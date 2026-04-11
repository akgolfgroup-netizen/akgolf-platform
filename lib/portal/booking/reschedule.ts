import { prisma } from "@/lib/portal/prisma";
import { createServiceClient } from "@/lib/supabase/server";
import { BookingStatus, Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";
import { nanoid } from "nanoid";
import { sendRescheduleNotification } from "@/lib/portal/email/send-booking-email";
import { logger } from "@/lib/logger";
import { notifyBookingRescheduled } from "@/lib/portal/notifications/triggers";
import { syncBookingToCalendar } from "@/lib/portal/calendar/google-calendar";

interface RescheduleResult {
  success: boolean;
  newBookingId?: string;
  error?: string;
}

/**
 * Reschedule a booking to a new time slot.
 * Wrapped in Prisma $transaction — creates new booking FIRST, then cancels old.
 * Automatic rollback if anything fails.
 */
export async function rescheduleBooking(
  bookingId: string,
  newStartTime: Date,
  userId: string
): Promise<RescheduleResult> {
  // Hent booking med relatert data for validering
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      ServiceType: {
        select: {
          name: true,
          duration: true,
          bufferBefore: true,
          bufferAfter: true,
          minNoticeHours: true,
          maxAdvanceDays: true,
        },
      },
      User: {
        select: { name: true, email: true },
      },
      Instructor: {
        select: { userId: true, User: { select: { name: true } } },
      },
    },
  });

  if (!booking) {
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

  const serviceType = booking.ServiceType;
  if (!serviceType) {
    return { success: false, error: "Tjenestetype ikke funnet" };
  }

  // Valider nytt tidspunkt
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
  const conflictStart = addMinutes(newStartTime, -serviceType.bufferBefore);
  const conflictEnd = addMinutes(newEndTime, serviceType.bufferAfter);
  const newBookingId = nanoid();

  try {
    // Atomisk transaksjon: opprett ny FØRST, kanseller gammel ETTER
    await prisma.$transaction(async (tx) => {
      // Sjekk konflikter (ekskluder bookingen som ombestilles)
      const conflict = await tx.booking.findFirst({
        where: {
          id: { not: bookingId },
          instructorId: booking.instructorId,
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
          startTime: { lt: conflictEnd },
          endTime: { gt: conflictStart },
        },
        select: { id: true },
      });

      if (conflict) {
        throw new Error("Tidspunktet er ikke lenger ledig");
      }

      // Sjekk blokkerte tider
      const blockedCount = await tx.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM "BlockedTime"
        WHERE ("instructorId" = ${booking.instructorId} OR "instructorId" IS NULL)
          AND "startTime" < ${conflictEnd}
          AND "endTime" > ${conflictStart}
      `;

      if (Number(blockedCount[0].count) > 0) {
        throw new Error("Tidspunktet er blokkert");
      }

      // Opprett ny booking FØRST
      await tx.booking.create({
        data: {
          id: newBookingId,
          studentId: booking.studentId,
          instructorId: booking.instructorId,
          serviceTypeId: booking.serviceTypeId,
          locationId: booking.locationId,
          resourceId: booking.resourceId,
          startTime: newStartTime,
          endTime: newEndTime,
          status: booking.status,
          paymentMethod: booking.paymentMethod,
          paymentStatus: booking.paymentStatus,
          amount: booking.amount,
          vatAmount: booking.vatAmount,
          stripePaymentId: booking.stripePaymentId,
          vippsOrderId: booking.vippsOrderId,
          updatedAt: new Date(),
        },
      });

      // Kanseller gammel booking ETTER — rollback automatisk hvis dette feiler
      await tx.booking.update({
        where: { id: bookingId },
        data: {
          status: BookingStatus.CANCELLED,
          cancelledAt: now,
          cancelReason: "Ombestilt",
        },
      });
    }, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });

    // Oppdater Google Calendar-event (non-blocking)
    if (booking.Instructor?.userId) {
      syncBookingToCalendar(booking.Instructor.userId, {
        id: newBookingId,
        startTime: newStartTime,
        endTime: newEndTime,
        serviceName: serviceType.name,
        instructorName: booking.Instructor.User?.name ?? undefined,
        googleCalendarEventId: booking.googleCalendarEventId,
      }).then(async (eventId) => {
        await prisma.booking.update({
          where: { id: newBookingId },
          data: { googleCalendarEventId: eventId },
        });
      }).catch((err) => {
        logger.error("[Reschedule] Google Calendar sync failed:", err);
      });
    }

    // Notifikasjoner utenfor transaksjon (non-blocking)
    if (booking.User?.email) {
      sendRescheduleNotification(
        booking.User.email,
        booking.User.name ?? "Elev",
        serviceType.name,
        booking.startTime,
        newStartTime,
      ).catch((err) => {
        logger.error("[Reschedule] Email notification failed:", err);
      });
    }

    // Push-notifikasjon
    const supabase = createServiceClient();
    const { data: fullBooking } = await supabase
      .from("Booking")
      .select(`
        *,
        ServiceType:serviceTypeId (name),
        Instructor:instructorId (User:userId (name)),
        Location:locationId (name)
      `)
      .eq("id", newBookingId)
      .single();

    if (fullBooking) {
      notifyBookingRescheduled(fullBooking, booking.startTime).catch((err) => {
        logger.error("[Reschedule] Push notification failed:", err);
      });
    }

    return { success: true, newBookingId };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Kunne ikke ombestille",
    };
  }
}
