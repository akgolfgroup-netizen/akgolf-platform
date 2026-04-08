import { randomUUID } from "crypto";
import { createServiceClient } from "@/lib/supabase/server";
import { BookingStatus } from "@prisma/client";
import { addMinutes } from "date-fns";
import { sendRescheduleNotification } from "@/lib/portal/email/send-booking-email";
import { logger } from "@/lib/logger";
import { notifyBookingRescheduled } from "@/lib/portal/notifications/triggers";

interface RescheduleResult {
  success: boolean;
  newBookingId?: string;
  error?: string;
}

/**
 * Reschedule a booking to a new time slot.
 * Cancels the old booking and creates a new one,
 * preserving the payment reference.
 */
export async function rescheduleBooking(
  bookingId: string,
  newStartTime: Date,
  userId: string
): Promise<RescheduleResult> {
  const supabase = createServiceClient();
  
  // Fetch booking with related data
  const { data: booking, error: bookingError } = await supabase
    .from("Booking")
    .select(`
      *,
      ServiceType:serviceTypeId (name, duration, bufferBefore, bufferAfter, minNoticeHours, maxAdvanceDays),
      User:studentId (name, email)
    `)
    .eq("id", bookingId)
    .single();

  if (bookingError || !booking) {
    return { success: false, error: "Booking ikke funnet" };
  }

  if (booking.studentId !== userId) {
    return { success: false, error: "Ikke autorisert" };
  }

  if (
    booking.status !== BookingStatus.CONFIRMED &&
    booking.status !== BookingStatus.PENDING
  ) {
    return { success: false, error: "Kan kun endre aktive bookinger" };
  }

  // Type assertions for joined data
  const serviceType = booking.ServiceType as {
    name: string;
    duration: number;
    bufferBefore: number;
    bufferAfter: number;
    minNoticeHours: number;
    maxAdvanceDays: number;
  } | null;
  const userData = booking.User as { name: string | null; email: string | null } | null;

  if (!serviceType) {
    return { success: false, error: "Tjenestetype ikke funnet" };
  }

  // Validate new time
  const now = new Date();
  if (newStartTime <= now) {
    return { success: false, error: "Nytt tidspunkt må være i fremtiden" };
  }

  const minNoticeMs = serviceType.minNoticeHours * 60 * 60 * 1000;
  if (newStartTime.getTime() - now.getTime() < minNoticeMs) {
    return {
      success: false,
      error: `Krever minst ${serviceType.minNoticeHours} timers varsel`,
    };
  }

  const maxAdvanceMs = serviceType.maxAdvanceDays * 24 * 60 * 60 * 1000;
  if (newStartTime.getTime() - Date.now() > maxAdvanceMs) {
    return {
      success: false,
      error: `Kan ikke bestille mer enn ${serviceType.maxAdvanceDays} dager frem i tid`,
    };
  }

  const newEndTime = addMinutes(newStartTime, serviceType.duration);
  const conflictStart = addMinutes(
    newStartTime,
    -serviceType.bufferBefore
  );
  const conflictEnd = addMinutes(newEndTime, serviceType.bufferAfter);

  try {
    // Check for conflicts (excluding the booking being rescheduled)
    const { data: conflict, error: conflictError } = await supabase
      .from("Booking")
      .select("id")
      .neq("id", bookingId)
      .eq("instructorId", booking.instructorId)
      .in("status", [BookingStatus.PENDING, BookingStatus.CONFIRMED])
      .lt("startTime", conflictEnd.toISOString())
      .gt("endTime", conflictStart.toISOString())
      .limit(1)
      .single();

    if (conflict) {
      throw new Error("Tidspunktet er ikke lenger ledig");
    }

    // Check blocked times
    const { data: blockedConflict, error: blockedError } = await supabase
      .from("BlockedTime")
      .select("id")
      .or(`instructorId.eq.${booking.instructorId},instructorId.is.null`)
      .lt("startTime", conflictEnd.toISOString())
      .gt("endTime", conflictStart.toISOString())
      .limit(1)
      .single();

    if (blockedConflict) {
      throw new Error("Tidspunktet er blokkert");
    }

    // Cancel old booking
    const { error: cancelError } = await supabase
      .from("Booking")
      .update({
        status: BookingStatus.CANCELLED,
        cancelledAt: now.toISOString(),
        cancelReason: "Ombestilt",
      })
      .eq("id", bookingId);

    if (cancelError) {
      throw new Error("Kunne ikke kansellere eksisterende booking");
    }

    // Create new booking with same payment info
    const { data: newBooking, error: createError } = await supabase
      .from("Booking")
      .insert({
        id: randomUUID(),
        studentId: booking.studentId,
        instructorId: booking.instructorId,
        serviceTypeId: booking.serviceTypeId,
        locationId: booking.locationId,
        resourceId: booking.resourceId,
        startTime: newStartTime.toISOString(),
        endTime: newEndTime.toISOString(),
        status: booking.status, // preserve CONFIRMED/PENDING
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentStatus,
        amount: booking.amount,
        vatAmount: booking.vatAmount,
        stripePaymentId: booking.stripePaymentId,
        vippsOrderId: booking.vippsOrderId,
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (createError || !newBooking) {
      throw new Error("Kunne ikke opprette ny booking");
    }

    // Send reschedule notification (non-blocking)
    if (userData?.email) {
      sendRescheduleNotification(
        userData.email,
        userData.name ?? "Elev",
        serviceType.name,
        new Date(booking.startTime),
        newStartTime,
      ).catch((err) => {
        logger.error("[Reschedule] Email notification failed:", err);
      });
    }

    // Send push notification
    const { data: fullBooking, error: fullBookingError } = await supabase
      .from("Booking")
      .select(`
        *,
        ServiceType:serviceTypeId (name),
        Instructor:instructorId (User:userId (name)),
        Location:locationId (name)
      `)
      .eq("id", newBooking.id)
      .single();

    if (fullBooking) {
      notifyBookingRescheduled(fullBooking, new Date(booking.startTime)).catch((err) => {
        logger.error("[Reschedule] Push notification failed:", err);
      });
    }

    return { success: true, newBookingId: newBooking.id };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Kunne ikke ombestille",
    };
  }
}
