import { stripe } from "@/lib/portal/stripe";
import { PaymentMethod } from "@prisma/client";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/portal/prisma";
import { buildRefundIdempotencyKey } from "./refund-idempotency";

export { buildRefundIdempotencyKey };

interface RefundResult {
  success: boolean;
  refundedAmount: number; // kroner (samme enhet som database)
  providerRefundId?: string;
  error?: string;
  alreadyProcessed?: boolean;
}

interface RefundOptions {
  bookingId: string;
  paymentMethod: PaymentMethod;
  providerPaymentId: string | null;
  totalAmount: number;
  refundPercent: number;
}

/**
 * Process a refund via the original payment provider.
 * totalAmount er i kroner (database-enhet). Konverteres til øre for Stripe.
 * 
 * Denne funksjonen er idempotent - kall med samme bookingId flere ganger vil
 * kun utføre én faktisk refund.
 */
export async function processRefund({
  bookingId,
  paymentMethod,
  providerPaymentId,
  totalAmount,
  refundPercent,
}: RefundOptions): Promise<RefundResult> {
  if (refundPercent <= 0) {
    return { success: true, refundedAmount: 0 };
  }

  // totalAmount er i kroner fra database, Stripe forventer øre
  const refundAmount = Math.round((totalAmount * 100 * refundPercent) / 100);

  if (!providerPaymentId) {
    return {
      success: false,
      refundedAmount: 0,
      error: "Ingen betalingsreferanse funnet",
    };
  }

  if (paymentMethod === PaymentMethod.STRIPE) {
    return refundStripe({
      bookingId,
      paymentIntentId: providerPaymentId,
      amount: refundAmount,
      totalAmount,
    });
  }

  // INVOICE or NONE — no automated refund
  return {
    success: true,
    refundedAmount: 0,
    error: "Manuell refusjon kreves for denne betalingsmetoden",
  };
}

interface StripeRefundOptions {
  bookingId: string;
  paymentIntentId: string;
  amount: number;
  totalAmount: number;
}

async function refundStripe({
  bookingId,
  paymentIntentId,
  amount,
  totalAmount,
}: StripeRefundOptions): Promise<RefundResult> {
  try {
    // Sjekk om det allerede finnes en refund for denne bookingen
    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: {
        stripeRefundId: true,
        refundIdempotencyKey: true,
        paymentStatus: true,
      },
    });

    if (existingBooking?.stripeRefundId) {
      logger.info(`[Refund] Refund already exists for booking ${bookingId}: ${existingBooking.stripeRefundId}`);
      
      // Hent refund-details fra Stripe for å bekrefte status
      try {
        const existingRefund = await stripe.refunds.retrieve(existingBooking.stripeRefundId);
        return {
          success: existingRefund.status === "succeeded" || existingRefund.status === "pending",
          refundedAmount: existingRefund.amount / 100, // Stripe returnerer øre, konverter til kroner
          providerRefundId: existingRefund.id,
          alreadyProcessed: true,
        };
      } catch {
        // Hvis vi ikke kan hente refund, anta at den finnes og er OK
        return {
          success: true,
          refundedAmount: amount / 100,
          providerRefundId: existingBooking.stripeRefundId,
          alreadyProcessed: true,
        };
      }
    }

    // Sjekk om booking allerede er refundert (basert på paymentStatus)
    if (existingBooking?.paymentStatus === "REFUNDED") {
      logger.info(`[Refund] Booking ${bookingId} already marked as refunded`);
      return {
        success: true,
        refundedAmount: amount / 100,
        alreadyProcessed: true,
      };
    }

    // Deterministisk idempotency-key — gjenbruk eksisterende hvis den finnes,
    // ellers generer ny basert på bookingId + amount.
    const idempotencyKey =
      existingBooking?.refundIdempotencyKey ??
      buildRefundIdempotencyKey(bookingId, amount);

    // Lagre idempotency-key før API-kall (for å kunne spore pågående refunds)
    if (!existingBooking?.refundIdempotencyKey) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { refundIdempotencyKey: idempotencyKey },
      });
    }

    // Utfør refund via Stripe
    const refund = await stripe.refunds.create(
      { 
        payment_intent: paymentIntentId, 
        amount,
        reason: "requested_by_customer",
        metadata: {
          bookingId,
          idempotencyKey,
          requestedAt: new Date().toISOString(),
        },
      },
      { idempotencyKey }
    );

    // Lagre refund ID i database
    await prisma.booking.update({
      where: { id: bookingId },
      data: { 
        stripeRefundId: refund.id,
        // Behold idempotencyKey for sporbarhet
      },
    });

    logger.info(`[Refund] Stripe refund created for booking ${bookingId}: ${refund.id} (status: ${refund.status})`);

    return {
      success: refund.status === "succeeded" || refund.status === "pending",
      refundedAmount: refund.amount / 100, // Stripe returnerer øre, konverter til kroner
      providerRefundId: refund.id,
    };
  } catch (error) {
    // Håndter spesifikke Stripe-feil
    if (error instanceof Error) {
      // Sjekk om dette er en idempotency-feil (samme key, annet innhold)
      if (error.message.includes("idempotency")) {
        logger.warn(`[Refund] Idempotency conflict for booking ${bookingId}: ${error.message}`);
        
        // Prøv å finne eksisterende refund
        try {
          const refunds = await stripe.refunds.list({
            payment_intent: paymentIntentId,
            limit: 1,
          });
          
          if (refunds.data.length > 0) {
            const existingRefund = refunds.data[0];
            logger.info(`[Refund] Found existing refund: ${existingRefund.id}`);
            
            // Oppdater booking med funnet refund ID
            await prisma.booking.update({
              where: { id: bookingId },
              data: { stripeRefundId: existingRefund.id },
            });
            
            return {
              success: existingRefund.status === "succeeded" || existingRefund.status === "pending",
              refundedAmount: existingRefund.amount / 100,
              providerRefundId: existingRefund.id,
              alreadyProcessed: true,
            };
          }
        } catch (listError) {
          logger.error(`[Refund] Failed to list refunds: ${listError}`);
        }
      }

      // Sjekk om charge allerede er refundert
      if (error.message.includes("charge_already_refunded")) {
        logger.info(`[Refund] Charge already refunded for booking ${bookingId}`);
        return {
          success: true,
          refundedAmount: amount / 100,
          alreadyProcessed: true,
        };
      }
    }

    logger.error("[Refund] Stripe refund failed:", error);
    return {
      success: false,
      refundedAmount: 0,
      error: error instanceof Error ? error.message : "Stripe refund feilet",
    };
  }
}

/**
 * Sjekk status på en eksisterende refund
 */
export async function getRefundStatus(
  refundId: string
): Promise<{ status: string; amount: number } | null> {
  try {
    const refund = await stripe.refunds.retrieve(refundId);
    return {
      status: refund.status,
      amount: refund.amount / 100, // Konverter til kroner
    };
  } catch (error) {
    logger.error(`[Refund] Failed to retrieve refund status for ${refundId}:`, error);
    return null;
  }
}
