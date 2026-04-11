import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { evaluateCancellationPolicy } from "@/lib/portal/booking/cancellation-policy";
import { processRefund } from "@/lib/portal/booking/refund";
import { notifyNextOnWaitlist } from "@/lib/portal/booking/waitlist";
import { sendBookingCancellation } from "@/lib/portal/email/send-booking-email";
import { notifyBookingCancelled } from "@/lib/portal/notifications/triggers";
import { releaseSession } from "@/lib/portal/booking/subscription-quota";
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

  const supabase = await createServerSupabase();

  try {
    // Fetch booking with ownership check
    const { data: booking, error: bookingError } = await supabase
      .from("Booking")
      .select(`
        *,
        ServiceType (
          name
        ),
        Instructor (
          User (
            name
          )
        ),
        User (
          name,
          email
        )
      `)
      .eq("id", bookingId)
      .eq("studentId", user.id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json(
        { error: "Booking ikke funnet" },
        { status: 404 }
      );
    }

    // Idempotens: allerede kansellert → returner 200 OK
    if (booking.status === "CANCELLED") {
      return NextResponse.json({
        success: true,
        message: "Booking allerede avbestilt",
        cancellation: {
          reason: booking.cancelReason ?? "Allerede avbestilt",
          refundPercent: 0,
          refundedAmount: 0,
        },
      });
    }

    if (!["PENDING", "CONFIRMED"].includes(booking.status)) {
      return NextResponse.json(
        { error: "Booking kan ikke avbestilles" },
        { status: 400 }
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
      booking.paymentStatus === "PAID" &&
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
    const updateData: {
      status: string;
      cancelledAt: string;
      cancelReason: string;
      paymentStatus?: string;
    } = {
      status: "CANCELLED",
      cancelledAt: new Date().toISOString(),
      cancelReason: reason || cancellation.reason,
    };

    if (refundResult?.refundedAmount) {
      updateData.paymentStatus = "REFUNDED";
    }

    const { error: updateError } = await supabase
      .from("Booking")
      .update(updateData)
      .eq("id", bookingId);

    if (updateError) {
      throw updateError;
    }

    // Release subscription quota if cancellation is >24h before start (full refund)
    if (cancellation.refundPercent === 100 && booking.paymentMethod === "NONE") {
      releaseSession(booking.studentId).catch((err) =>
        logger.error("[Cancel] Failed to release session quota", err)
      );
    }

    // Send cancellation email (non-blocking)
    const userEmail = booking.User?.email;
    const userName = booking.User?.name ?? "Elev";
    const serviceName = booking.ServiceType?.name ?? "Tjeneste";
    const instructorName = booking.Instructor?.User?.name ?? "Instruktør";

    if (userEmail) {
      sendBookingCancellation(
        userEmail,
        userName,
        serviceName,
        instructorName,
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
      serviceName,
      instructorName,
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
