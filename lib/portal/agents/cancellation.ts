/**
 * Agent: cancellation
 *
 * Trigger: Booking.status endret til CANCELLED.
 * Handling:
 *   1. Beregn refundering per Standardvalg #1
 *   2. Hvis refund > 0 -> kall Stripe paymentIntents.refund (eller invoiceCredit)
 *   3. Frigi slot (kalender oppdaterer automatisk)
 *   4. Varsle eventuell venteliste-kandidat
 *
 * Logger til AgentLog via logAgentRun (sikrer riktig agentId-FK).
 */

import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { calculateRefund } from "@/lib/portal/booking/refund-policy";
import { logAgentRun } from "./log";

const AGENT_NAME = "cancellation";
const MODEL = "stripe-api";

export async function runCancellation(bookingId: string): Promise<{
  ran: boolean;
  reason?: string;
  refundedKr?: number;
}> {
  const started = Date.now();

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        PaymentTransaction: {
          where: { status: "PAID" },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!booking) {
      await logSkip(bookingId, "no-booking");
      return { ran: false, reason: "no-booking" };
    }
    if (booking.status !== "CANCELLED") {
      await logSkip(bookingId, "not-cancelled");
      return { ran: false, reason: "not-cancelled" };
    }

    const tx = booking.PaymentTransaction[0];
    if (!tx || tx.status !== "PAID") {
      await logSkip(bookingId, "no-paid-transaction");
      return { ran: false, reason: "no-paid-transaction", refundedKr: 0 };
    }

    const decision = calculateRefund({
      startTime: booking.startTime,
      cancelledAt: new Date(),
      paidAmountKr: tx.grossAmount,
    });

    if (decision.refundPct === 0 || decision.refundAmountKr === 0) {
      await logSuccess(bookingId, `no-refund - ${decision.reason}`, started);
      return { ran: true, refundedKr: 0 };
    }

    // Refund via Stripe
    if (!tx.providerRef) {
      await logError(bookingId, new Error("PaymentTransaction mangler providerRef"), started);
      return { ran: false, reason: "no-provider-ref" };
    }

    if (tx.paymentMethod === "STRIPE") {
      // Refund PaymentIntent
      const refund = await stripe.refunds.create({
        payment_intent: tx.providerRef,
        amount: decision.refundAmountKr * 100, // ore
        metadata: {
          bookingId,
          refundPct: String(decision.refundPct),
          reason: decision.reason,
        },
      });

      await prisma.paymentTransaction.update({
        where: { id: tx.id },
        data: {
          status: decision.refundPct === 100 ? "REFUNDED" : "PARTIALLY_REFUNDED",
          refundedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await prisma.booking.update({
        where: { id: bookingId },
        data: {
          paymentStatus: decision.refundPct === 100 ? "REFUNDED" : "PARTIALLY_REFUNDED",
        },
      });

      await logSuccess(
        bookingId,
        `refunded ${decision.refundAmountKr} kr (${decision.refundPct}%) - refund.id ${refund.id}`,
        started,
      );
      return { ran: true, refundedKr: decision.refundAmountKr };
    }

    if (tx.paymentMethod === "INVOICE") {
      // Credit-note for invoice
      const creditNote = await stripe.creditNotes.create({
        invoice: tx.providerRef,
        amount: decision.refundAmountKr * 100,
        memo: decision.reason,
        metadata: { bookingId },
      });

      await prisma.paymentTransaction.update({
        where: { id: tx.id },
        data: {
          status: decision.refundPct === 100 ? "REFUNDED" : "PARTIALLY_REFUNDED",
          refundedAt: new Date(),
          updatedAt: new Date(),
        },
      });

      await logSuccess(
        bookingId,
        `credit-note ${creditNote.id} for ${decision.refundAmountKr} kr`,
        started,
      );
      return { ran: true, refundedKr: decision.refundAmountKr };
    }

    await logSkip(bookingId, `unsupported-method:${tx.paymentMethod}`);
    return { ran: false, reason: "unsupported-method" };
  } catch (err) {
    await logError(bookingId, err, started);
    logger.error(`[${AGENT_NAME}] failed for booking ${bookingId}`, err);
    return { ran: false, reason: "error" };
  }
}

async function logSuccess(bookingId: string, output: string, started: number) {
  await logAgentRun({
    name: AGENT_NAME,
    model: MODEL,
    status: "success",
    duration: Date.now() - started,
    input: bookingId,
    output,
  });
}

async function logSkip(bookingId: string, reason: string) {
  await logAgentRun({
    name: AGENT_NAME,
    model: MODEL,
    status: "skipped",
    input: bookingId,
    output: reason,
  });
}

async function logError(bookingId: string, err: unknown, started: number) {
  await logAgentRun({
    name: AGENT_NAME,
    model: MODEL,
    status: "error",
    duration: Date.now() - started,
    input: bookingId,
    error: err instanceof Error ? err.message : String(err),
  });
}
