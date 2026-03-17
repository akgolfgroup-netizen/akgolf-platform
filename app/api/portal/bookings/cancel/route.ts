import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { processRefund } from "@/lib/portal/booking/refund";
import { notifyNextOnWaitlist } from "@/lib/portal/booking/waitlist";

export async function POST(req: NextRequest) {
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
        serviceType: { select: { name: true } },
        instructor: { select: { user: { select: { name: true } } } },
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
        console.error(
          `[Cancel] Refund failed for booking ${bookingId}:`,
          refundResult.error
        );
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

    // Notify waitlist if applicable
    await notifyNextOnWaitlist(
      bookingId,
      booking.serviceType.name,
      booking.instructor.user.name ?? "Instruktør",
      booking.startTime
    ).catch((err) => {
      console.error(`[Cancel] Waitlist notification failed:`, err);
    });

    return NextResponse.json({
      success: true,
      message: "Booking avbestilt",
      cancellation: {
        reason: cancellation.reason,
        refundPercent: cancellation.refundPercent,
        refundedAmount: refundResult?.refundedAmount ?? 0,
      },
    });
  } catch (error) {
    console.error("[Cancel] Error:", error);
    return NextResponse.json(
      { error: "Intern feil ved avbestilling" },
      { status: 500 }
    );
  }
}
