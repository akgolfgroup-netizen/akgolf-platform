import { stripe } from "@/lib/portal/stripe";
import { PaymentMethod } from "@prisma/client";

interface RefundResult {
  success: boolean;
  refundedAmount: number; // øre
  providerRefundId?: string;
  error?: string;
}

/**
 * Process a refund via the original payment provider.
 * Amount is in øre. Supports partial refunds.
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

  const refundAmount = Math.round((totalAmount * refundPercent) / 100);

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

  if (paymentMethod === PaymentMethod.VIPPS) {
    return refundVipps(providerPaymentId, refundAmount);
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
      refundedAmount: refund.amount,
      providerRefundId: refund.id,
    };
  } catch (error) {
    console.error("[Refund] Stripe refund failed:", error);
    return {
      success: false,
      refundedAmount: 0,
      error: error instanceof Error ? error.message : "Stripe refund feilet",
    };
  }
}

async function refundVipps(
  orderId: string,
  amount: number
): Promise<RefundResult> {
  // Vipps ePayment API refund
  const accessToken = await getVippsAccessToken();
  if (!accessToken) {
    return {
      success: false,
      refundedAmount: 0,
      error: "Kunne ikke autentisere mot Vipps",
    };
  }

  try {
    const res = await fetch(
      `https://api.vipps.no/epayment/v1/payments/${orderId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key":
            process.env.VIPPS_SUBSCRIPTION_KEY ?? "",
          "Merchant-Serial-Number":
            process.env.VIPPS_MERCHANT_SERIAL_NUMBER ?? "",
        },
        body: JSON.stringify({
          modificationAmount: {
            currency: "NOK",
            value: amount,
          },
        }),
      }
    );

    if (!res.ok) {
      const body = await res.text();
      console.error("[Refund] Vipps refund failed:", res.status, body);
      return {
        success: false,
        refundedAmount: 0,
        error: `Vipps refusjon feilet (${res.status})`,
      };
    }

    return {
      success: true,
      refundedAmount: amount,
      providerRefundId: `vipps-refund-${orderId}`,
    };
  } catch (error) {
    console.error("[Refund] Vipps refund error:", error);
    return {
      success: false,
      refundedAmount: 0,
      error: error instanceof Error ? error.message : "Vipps refund feilet",
    };
  }
}

async function getVippsAccessToken(): Promise<string | null> {
  try {
    const res = await fetch(
      "https://api.vipps.no/accesstoken/get",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          client_id: process.env.VIPPS_CLIENT_ID ?? "",
          client_secret: process.env.VIPPS_CLIENT_SECRET ?? "",
          "Ocp-Apim-Subscription-Key":
            process.env.VIPPS_SUBSCRIPTION_KEY ?? "",
        },
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.access_token ?? null;
  } catch {
    return null;
  }
}
