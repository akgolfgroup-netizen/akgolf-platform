"use client";

import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, AlertCircle, Loader2, ShieldCheck } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  bookingId: string;
  serviceName: string;
}

function CheckoutForm({ bookingId, serviceName }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url:
          window.location.origin +
          "/portal/booking/" +
          bookingId +
          "/confirmation",
      },
    });

    if (confirmError) {
      setError(confirmError.message ?? "Betalingen feilet. Prøv igjen.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Reminder */}
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-gold/5 border-gold/30">
        <CreditCard size={20} className="text-gold" />
        <p className="font-medium text-navy">{serviceName}</p>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-2xl p-5 border bg-white border-border">
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 px-4 py-4 rounded-xl bg-error/10 border border-error/30"
        >
          <AlertCircle size={18} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-all duration-300 disabled:opacity-50 text-white shadow-lg shadow-gold/30"
        style={{
          background: "linear-gradient(135deg, var(--color-gold), var(--color-gold-light))",
        }}
        whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(184,151,92,0.3)" }}
        whileTap={{ scale: 0.99 }}
      >
        {loading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            <span>Behandler betaling...</span>
          </>
        ) : (
          <>
            <ShieldCheck size={20} />
            <span>Betal nå</span>
          </>
        )}
      </motion.button>

      {/* Security Note */}
      <p className="text-xs text-center text-ink-40">
        Sikker betaling via Stripe. AK Golf Academy lagrer ikke kortinformasjon.
      </p>
    </form>
  );
}

interface StripePaymentPageProps {
  clientSecret: string;
  bookingId: string;
  serviceName: string;
}

export function StripePaymentPage({
  clientSecret,
  bookingId,
  serviceName,
}: StripePaymentPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-snow">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 border bg-gold/10 border-gold/30"
          >
            <CreditCard size={28} className="text-gold" />
          </motion.div>
          <h1 className="text-2xl font-semibold mb-2 text-navy">
            Fullfør betaling
          </h1>
          <p className="text-ink-50">
            Sikker kortbetaling med Stripe
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 border bg-white border-border shadow-md"
        >
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#B8975C",
                  colorBackground: "#FFFFFF",
                  colorText: "#0F2950",
                  colorDanger: "#EF4444",
                  fontFamily: "Inter, sans-serif",
                  borderRadius: "12px",
                  spacingUnit: "4px",
                },
              },
            }}
          >
            <CheckoutForm bookingId={bookingId} serviceName={serviceName} />
          </Elements>
        </motion.div>
      </motion.div>
    </div>
  );
}
