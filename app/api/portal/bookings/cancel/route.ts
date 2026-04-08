import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { processRefund } from "@/lib/portal/booking/refund";
import { notifyNextOnWaitlist } from "@/lib/portal/booking/waitlist";
import { sendBookingCancellation } from "@/lib/portal/email/send-booking-email";
import { notifyBookingCancelled } from "@/lib/portal/notifications/triggers";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`booking:${getClientIp(req)}`, RATE_LIMITS.BOOKING_CREATE);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  let body: { bookingId?: string; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Ugyldig JSON" }, { status: 400 });
  }

  const { bookingId, reason } = body;
  if (!bookingId) {
    return NextResponse.json(
      { error: "Mangler bookingId" },
      { status: 400 }
    );
  }

  try {
    // Fetch booking with ownership check
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        studentId: user.id,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
      },
      include: {
        ServiceType: { select: { name: true } },
        Instructor: { select: { User: { select: { name: true } } } },
        User: { select: { name: true, email: true } },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking ikke funnet eller kan ikke avbestilles" },
        { status: 404 }
      );
    }

    // Evaluate cancellation policy
    const cancellation = evaluateCancellationPolicy(booking.startTime);
    if (!cancellation.allowed) {
      return NextResponse.json(
        { error: cancellation.reason },
        { status: 400 }
      );
    }

    // Process refund if applicable
    let refundResult: {
      success: boolean;
      refundedAmount: number;
      error?: string;
    } | null = null;

    if (
      booking.paymentStatus === PaymentStatus.PAID &&
      cancellation.refundPercent > 0
    ) {
      refundResult = await processRefund(
        booking.paymentMethod,
        booking.stripePaymentId,
        booking.amount,
        cancellation.refundPercent
      );

      if (!refundResult.success) {
        // Log but continue - manual refund may be needed
        logger.error(`[Cancel] Refund failed for booking ${bookingId}`, refundResult.error);
      }
    }

    // Update booking status
    await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
        cancelledAt: new Date(),
        cancelReason: reason || cancellation.reason,
        ...(refundResult?.refundedAmount
          ? { paymentStatus: PaymentStatus.REFUNDED }
          : {}),
      },
    });

    // Send cancellation email (non-blocking)
    if (booking.User.email) {
      sendBookingCancellation(
        booking.User.email,
        booking.User.name ?? "Elev",
        booking.ServiceType.name,
        booking.Instructor.User.name ?? "Instruktør",
        booking.startTime,
        reason || cancellation.reason,
        cancellation.refundPercent,
      ).catch((err) => logger.error("[Cancel] Cancellation email failed", err));
    }

    // Send notifikasjon til instruktør (non-blocking)
    notifyBookingCancelled(booking, reason || cancellation.reason).catch((err) =>
      logger.error("[Cancel] Notification failed", err)
    );

    // Notify waitlist if applicable
    await notifyNextOnWaitlist(
      bookingId,
      booking.ServiceType.name,
      booking.Instructor.User.name ?? "Instruktør",
      booking.startTime
    ).catch((err) => logger.error("[Cancel] Waitlist notification failed", err));

    return NextResponse.json({
      success: true,
      message: "Booking avbestilt",
      cancellation: {
        reason: cancellation.reason,
        refundPercent: cancellation.refundPercent,
        refundedAmount: refundResult?.refundedAmount ?? 0,
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Intern feil ved avbestilling" },
      { status: 500 }
    );
  }
}
