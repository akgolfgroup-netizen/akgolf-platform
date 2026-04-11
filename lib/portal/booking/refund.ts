import { stripe } from "@/lib/portal/stripe";
import { PaymentMethod } from "@prisma/client";
import { logger } from "@/lib/logger";

interface RefundResult {
  success: boolean;
  refundedAmount: number; // kroner (samme enhet som database)
  providerRefundId?: string;
  error?: string;
}

/**
 * Process a refund via the original payment provider.
 * totalAmount er i kroner (database-enhet). Konverteres til øre for Stripe.
 */
export async function processRefund(
  paymentMethod: PaymentMethod,
  providerPaymentId: string | null,
  totalAmount: number,
  refundPercent: number
): Promise<RefundResult> {
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
    return refundStripe(providerPaymentId, refundAmount);
  }

  // INVOICE or NONE — no automated refund
  return {
    success: true,
    refundedAmount: 0,
    error: "Manuell refusjon kreves for denne betalingsmetoden",
  };
}

async function refundStripe(
  paymentIntentId: string,
  amount: number
): Promise<RefundResult> {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount,
    });

    return {
      success: refund.status === "succeeded" || refund.status === "pending",
      refundedAmount: refund.amount / 100, // Stripe returnerer øre, konverter til kroner
      providerRefundId: refund.id,
    };
  } catch (error) {
    logger.error("[Refund] Stripe refund failed:", error);
    return {
      success: false,
      refundedAmount: 0,
      error: error instanceof Error ? error.message : "Stripe refund feilet",
    };
  }
}


