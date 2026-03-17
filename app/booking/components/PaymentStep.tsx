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
import { CreditCard, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import { StepHeader } from "./StepHeader";

// AK Golf Brand Colors - aligned with brand guidelines
const AK_GOLD = "#B8975C";
const AK_NAVY = "#0F2950";
const AK_INK_90 = "#1a2d3d";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Stripe Elements themed with AK Golf brand colors
const STRIPE_THEME = {
  colorPrimary: AK_GOLD,
  colorBackground: "#FFFFFF",
  colorText: AK_NAVY,
  colorDanger: "#EF4444",
} as const;

interface Props {
  clientSecret: string;
  bookingId: string;
  serviceName: string;
  amount: number; // øre
  onSuccess: () => void;
}

function CheckoutForm({ bookingId, serviceName, onSuccess }: {
  bookingId: string;
  serviceName: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(confirmError.message ?? "Betalingen feilet. Prøv igjen.");
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gold/5 border border-gold/20">
        <CreditCard size={18} className="text-gold" />
        <span className="font-medium text-ink-90 text-sm">{serviceName}</span>
      </div>

      <div className="w-card">
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-2 px-4 py-3 rounded-lg bg-error/5 border border-error/20"
        >
          <AlertCircle size={16} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-btn w-btn-gold w-full disabled:opacity-50"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Behandler betaling...
          </>
        ) : (
          <>
            <ShieldCheck size={18} />
            Betal nå
          </>
        )}
      </button>

      <p className="text-xs text-center text-ink-40">
        Sikker betaling via Stripe. AK Golf lagrer ikke kortinformasjon.
      </p>
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
  const priceNok = amount / 100;

  return (
    <div>
      <StepHeader
        eyebrow="Steg 5"
        heading="Betaling"
        description="Velg betalingsmetode og fullfør bookingen."
      />
      <p className="text-ink-50 -mt-6 mb-8">
        Totalt: <span className="font-semibold text-gold">{priceNok.toLocaleString("nb-NO")} kr</span>
      </p>

      <div className="max-w-md space-y-4">
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                ...STRIPE_THEME,
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
            onSuccess={onSuccess}
          />
        </Elements>
      </div>
    </div>
  );
}
