import { randomUUID } from "crypto";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
import { addMinutes } from "date-fns";
import { sendRescheduleNotification } from "@/lib/portal/email/send-booking-email";
import { logger } from "@/lib/logger";

interface RescheduleResult {
  success: boolean;
  newBookingId?: string;
  error?: string;
}

/**
 * Reschedule a booking to a new time slot.
 * Cancels the old booking and creates a new one in a single transaction,
 * preserving the payment reference.
 */
export async function rescheduleBooking(
  bookingId: string,
  newStartTime: Date,
  userId: string
): Promise<RescheduleResult> {
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

  // Validate new time
  const now = new Date();
  if (newStartTime <= now) {
    return { success: false, error: "Nytt tidspunkt må være i fremtiden" };
  }

  const minNoticeMs = booking.ServiceType.minNoticeHours * 60 * 60 * 1000;
  if (newStartTime.getTime() - now.getTime() < minNoticeMs) {
    return {
      success: false,
      error: `Krever minst ${booking.ServiceType.minNoticeHours} timers varsel`,
    };
  }

  const maxAdvanceMs = booking.ServiceType.maxAdvanceDays * 24 * 60 * 60 * 1000;
  if (newStartTime.getTime() - Date.now() > maxAdvanceMs) {
    return {
      success: false,
      error: `Kan ikke bestille mer enn ${booking.ServiceType.maxAdvanceDays} dager frem i tid`,
    };
  }

  const newEndTime = addMinutes(newStartTime, booking.ServiceType.duration);
  const conflictStart = addMinutes(
    newStartTime,
    -booking.ServiceType.bufferBefore
  );
  const conflictEnd = addMinutes(newEndTime, booking.ServiceType.bufferAfter);

  // Atomic: cancel old + create new in serializable transaction
  try {
    const newBooking = await prisma.$transaction(
      async (tx) => {
        // Check for conflicts (excluding the booking being rescheduled)
        const conflict = await tx.booking.findFirst({
          where: {
            id: { not: bookingId },
            instructorId: booking.instructorId,
            status: {
              in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
            },
            AND: [
              { startTime: { lt: conflictEnd } },
              { endTime: { gt: conflictStart } },
            ],
          },
        });

        if (conflict) {
          throw new Error("Tidspunktet er ikke lenger ledig");
        }

        // Check blocked times
        const blockedConflict = await tx.blockedTime.findFirst({
          where: {
            OR: [
              { instructorId: booking.instructorId },
              { instructorId: null },
            ],
            AND: [
              { startTime: { lt: conflictEnd } },
              { endTime: { gt: conflictStart } },
            ],
          },
        });

        if (blockedConflict) {
          throw new Error("Tidspunktet er blokkert");
        }

        // Cancel old booking
        await tx.booking.update({
          where: { id: bookingId },
          data: {
            status: BookingStatus.CANCELLED,
            cancelledAt: now,
            cancelReason: "Ombestilt",
          },
        });

        // Create new booking with same payment info
        return tx.booking.create({
          data: {
            id: randomUUID(),
            studentId: booking.studentId,
            instructorId: booking.instructorId,
            serviceTypeId: booking.serviceTypeId,
            locationId: booking.locationId,
            resourceId: booking.resourceId,
            startTime: newStartTime,
            endTime: newEndTime,
            status: booking.status, // preserve CONFIRMED/PENDING
            paymentMethod: booking.paymentMethod,
            paymentStatus: booking.paymentStatus,
            amount: booking.amount,
            vatAmount: booking.vatAmount,
            stripePaymentId: booking.stripePaymentId,
            vippsOrderId: booking.vippsOrderId,
            updatedAt: new Date(),
          },
        });
      },
      { isolationLevel: "Serializable" }
    );

    // Send reschedule notification (non-blocking)
    if (booking.User.email) {
      sendRescheduleNotification(
        booking.User.email,
        booking.User.name ?? "Elev",
        booking.ServiceType.name,
        booking.startTime,
        newStartTime,
      ).catch((err) => {
        logger.error("[Reschedule] Email notification failed:", err);
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
