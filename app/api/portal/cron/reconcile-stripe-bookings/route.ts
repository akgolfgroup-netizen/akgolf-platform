import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { subHours } from "date-fns";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const BATCH_SIZE = 50;
const STALE_THRESHOLD_HOURS = 1;

interface ReconcileSummary {
  scanned: number;
  confirmed: number;
  failed: number;
  unchanged: number;
  errors: number;
}

/**
 * Defensiv reconcile-CRON: hvis et Stripe webhook-event tapes, blir
 * bookingen hengende i PENDING for alltid. Hver 30. min sjekker vi
 * PENDING-bookinger eldre enn 1t mot Stripe og synker status.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = new Date();
  const summary: ReconcileSummary = {
    scanned: 0,
    confirmed: 0,
    failed: 0,
    unchanged: 0,
    errors: 0,
  };

  try {
    const stale = await prisma.booking.findMany({
      where: {
        paymentStatus: PaymentStatus.PENDING,
        stripePaymentId: { not: null },
        createdAt: { lt: subHours(startedAt, STALE_THRESHOLD_HOURS) },
      },
      select: {
        id: true,
        stripePaymentId: true,
      },
      take: BATCH_SIZE,
    });

    summary.scanned = stale.length;

    for (const booking of stale) {
      if (!booking.stripePaymentId) continue;

      try {
        const pi = await stripe.paymentIntents.retrieve(booking.stripePaymentId);

        if (pi.status === "succeeded") {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: PaymentStatus.PAID,
              status: BookingStatus.CONFIRMED,
            },
          });
          summary.confirmed += 1;
          logger.info(
            `[Reconcile] Booking ${booking.id} → CONFIRMED (Stripe PI ${pi.id} succeeded)`,
          );
        } else if (pi.status === "canceled") {
          await prisma.booking.update({
            where: { id: booking.id },
            data: {
              paymentStatus: PaymentStatus.FAILED,
              status: BookingStatus.CANCELLED,
            },
          });
          summary.failed += 1;
          logger.info(
            `[Reconcile] Booking ${booking.id} → CANCELLED (Stripe PI ${pi.id} canceled)`,
          );
        } else if (pi.status === "requires_payment_method" || pi.status === "requires_action") {
          summary.unchanged += 1;
        } else {
          summary.unchanged += 1;
        }
      } catch (err) {
        summary.errors += 1;
        logger.error(
          `[Reconcile] Failed to sync booking ${booking.id} with Stripe`,
          { error: err instanceof Error ? err.message : String(err) },
        );
      }
    }

    await prisma.agentLog.create({
      data: {
        id: nanoid(),
        agentType: "stripe-reconcile",
        model: "cron",
        status: summary.errors > 0 ? "partial" : "completed",
        duration: Date.now() - startedAt.getTime(),
        output: JSON.stringify(summary),
      },
    });

    return NextResponse.json({
      ok: true,
      ...summary,
      timestamp: startedAt.toISOString(),
    });
  } catch (error) {
    logger.error("[Reconcile] Cron job failed", error);
    return NextResponse.json(
      {
        error: "Internal error",
        message: error instanceof Error ? error.message : "unknown",
      },
      { status: 500 },
    );
  }
}
