"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { StepHeader } from "./StepHeader";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Props {
  clientSecret: string;
  bookingId: string;
  serviceName: string;
  amount: number; // kroner
  duration?: number;
  onSuccess: () => void;
}

function CheckoutForm({
  bookingId,
  serviceName,
  amount,
  duration = 60,
  onSuccess,
}: {
  bookingId: string;
  serviceName: string;
  amount: number;
  duration?: number;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number } | null>(null);

  const subtotal = amount;
  const discount = appliedDiscount?.amount ?? 0;
  const total = subtotal - discount;
  const totalNok = total;

  async function handleApplyDiscount() {
    // For now, simulate discount code
    if (discountCode.toUpperCase() === "GOLF2026") {
      setAppliedDiscount({ code: "GOLF2026", amount: Math.round(subtotal * 0.1) });
    } else {
      setError("Ugyldig rabattkode");
      setTimeout(() => setError(null), 3000);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url:
          window.location.origin +
          "/booking?confirmed=true&bookingId=" +
          bookingId,
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Betalingen feilet. Prov igjen.");
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Summary */}
      <div className="bg-ink-5 rounded-xl p-5">
        <div className="flex justify-between items-center py-2 text-sm">
          <span className="text-ink-70">
            {serviceName} ({duration} min)
          </span>
          <span className="text-ink-90">kr {subtotal.toLocaleString("nb-NO")}</span>
        </div>
        {appliedDiscount && (
          <div className="flex justify-between items-center py-2 text-sm text-success">
            <span>Rabattkode: {appliedDiscount.code}</span>
            <span>-kr {appliedDiscount.amount.toLocaleString("nb-NO")}</span>
          </div>
        )}
        <div className="flex justify-between items-center pt-4 mt-2 border-t-2 border-ink-20">
          <span className="font-semibold text-ink-90 text-lg">Totalt a betale</span>
          <span className="font-bold text-lg text-ink-90">
            kr {totalNok.toLocaleString("nb-NO")}
          </span>
        </div>
      </div>

      {/* Discount Code */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-50 mb-2 block">
          Rabattkode
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
            placeholder="Skriv inn kode"
            className="w-input flex-1"
            disabled={!!appliedDiscount}
          />
          <button
            type="button"
            onClick={handleApplyDiscount}
            disabled={!discountCode || !!appliedDiscount}
            className="w-btn w-btn-secondary disabled:opacity-50"
          >
            {appliedDiscount ? "Brukt" : "Bruk"}
          </button>
        </div>
      </div>

      {/* Payment form */}
      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-ink-50 mb-2 block">
          Betalingsmetode
        </label>
        <div className="border border-ink-10 rounded-xl p-4 bg-white">
          <PaymentElement
            options={{
              layout: "tabs",
            }}
          />
        </div>
      </div>

      {/* Security notice */}
      <div className="flex items-center gap-2 text-xs text-ink-50">
        <Lock size={14} />
        <span>Sikker betaling via Stripe. Vi lagrer ikke kortinformasjonen din.</span>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 px-4 py-3 rounded-lg bg-error/10 border border-error/20"
        >
          <AlertCircle size={16} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </motion.div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-btn w-btn-gold w-full text-base py-4 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Behandler betaling...
          </>
        ) : (
          <>
            <Lock size={18} />
            Betal kr {totalNok.toLocaleString("nb-NO")}
          </>
        )}
      </button>
    </form>
  );
}

export function PaymentStep({
  clientSecret,
  bookingId,
  serviceName,
  amount,
  onSuccess,
}: Props) {
  return (
    <div>
      <StepHeader
        eyebrow="Steg 5"
        heading="Betaling"
        description="Velg betalingsmetode og fullfoor bestillingen"
      />

      <div className="max-w-md">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#B07D4F",
                colorBackground: "#FFFFFF",
                colorText: "#0A1929",
                colorDanger: "#EF4444",
                fontFamily: "Inter, sans-serif",
                borderRadius: "8px",
                spacingUnit: "4px",
              },
            },
          }}
        >
          <CheckoutForm
            bookingId={bookingId}
            serviceName={serviceName}
            amount={amount}
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}
