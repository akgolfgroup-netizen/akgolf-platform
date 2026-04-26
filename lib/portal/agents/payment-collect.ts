/**
 * Agent: payment-collect
 *
 * Trigger: Booking.status = COMPLETED (Flex-tjeneste, ikke abonnement).
 * Handling:
 *   - Privatperson + lagret kort → off-session trekk (Stripe PaymentIntent)
 *   - Bedrift (User.organizationNumber satt) → opprett Stripe Invoice (14d forfall)
 *   - Hvis abonnement dekker → ingen handling
 *
 * Standardvalg #4 (Anders' fullmakt):
 *   Privat = kort-trekk auto. Bedrift = faktura, 14d forfall.
 *
 * Logger til AgentLog.
 */

import { nanoid } from "nanoid";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { chargeOffSession } from "@/lib/portal/stripe/off-session";
import { createInvoiceForBooking } from "@/lib/portal/stripe/invoice";

const AGENT_NAME = "payment-collect";

export async function runPaymentCollect(bookingId: string): Promise<{
  ran: boolean;
  reason?: string;
  channel?: "off-session" | "invoice" | "subscription-covered";
  amountKr?: number;
}> {
  const started = Date.now();

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        User: { select: { id: true, email: true } },
      },
    });

    if (!booking) {
      await logSkip(bookingId, "no-booking");
      return { ran: false, reason: "no-booking" };
    }
    if (booking.status !== "COMPLETED") {
      await logSkip(bookingId, "not-completed");
      return { ran: false, reason: "not-completed" };
    }
    if (booking.paymentStatus === "PAID") {
      await logSkip(bookingId, "already-paid");
      return { ran: false, reason: "already-paid" };
    }

    // Sjekk customer-type for å avgjøre kanal
    const pref = await prisma.customerPaymentPreference.findUnique({
      where: { userId: booking.User.id },
      select: { customerType: true, orgNumber: true },
    });
    const isCompany = pref?.customerType === "BUSINESS" || !!pref?.orgNumber;

    // Bedrift med org.nr → faktura
    if (isCompany) {
      const result = await createInvoiceForBooking(bookingId);
      await logSuccess(bookingId, "invoice", result?.amountKr ?? 0, started);
      return {
        ran: true,
        channel: "invoice",
        amountKr: result?.amountKr,
      };
    }

    // Privat → forsøk off-session trekk
    const charge = await chargeOffSession(bookingId);
    if (!charge) {
      await logSkip(bookingId, "subscription-covered-or-no-pm");
      return { ran: false, reason: "subscription-covered-or-no-pm", channel: "subscription-covered" };
    }

    await logSuccess(bookingId, "off-session", charge.chargedKr, started);
    return {
      ran: true,
      channel: "off-session",
      amountKr: charge.chargedKr,
    };
  } catch (err) {
    await logError(bookingId, err, started);
    logger.error(`[${AGENT_NAME}] failed for booking ${bookingId}`, err);
    return { ran: false, reason: "error" };
  }
}

async function logSuccess(bookingId: string, channel: string, amountKr: number, started: number) {
  await prisma.agentLog
    .create({
      data: {
        id: nanoid(),
        agentType: AGENT_NAME,
        model: "stripe-api",
        status: "success",
        duration: Date.now() - started,
        input: bookingId,
        output: `${channel} kr ${amountKr}`,
      },
    })
    .catch(() => {});
}

async function logSkip(bookingId: string, reason: string) {
  await prisma.agentLog
    .create({
      data: {
        id: nanoid(),
        agentType: AGENT_NAME,
        model: "stripe-api",
        status: "skipped",
        input: bookingId,
        output: reason,
      },
    })
    .catch(() => {});
}

async function logError(bookingId: string, err: unknown, started: number) {
  await prisma.agentLog
    .create({
      data: {
        id: nanoid(),
        agentType: AGENT_NAME,
        model: "stripe-api",
        status: "error",
        duration: Date.now() - started,
        input: bookingId,
        error: err instanceof Error ? err.message : String(err),
      },
    })
    .catch(() => {});
}
