"use client";


import { Icon } from "@/components/ui/icon";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { motion } from "framer-motion";


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
  bookingId: string;
  serviceName: string;
}

function CheckoutForm({ bookingId, serviceName }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
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
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl border bg-surface border-outline-variant/30">
        <Icon name="credit_card" size={20} className="text-primary" />
        <p className="font-medium text-primary">{serviceName}</p>
      </div>

      {/* Stripe Payment Element */}
      <div className="rounded-2xl p-5 border bg-surface-container-lowest border-outline-variant/30">
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
          <Icon name="error" size={18} className="text-error flex-shrink-0 mt-0.5" />
          <p className="text-sm text-error">{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-[opacity,transform,box-shadow] duration-300 disabled:opacity-50 text-surface bg-primary shadow-lg shadow-black/15"
        whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(29,29,31,0.25)" }}
        whileTap={{ scale: 0.99 }}
      >
        {loading ? (
          <>
            <Icon name="progress_activity" size={20} className="animate-spin" />
            <span>Behandler betaling...</span>
          </>
        ) : (
          <>
            <Icon name="shield"Check size={20} />
            <span>Betal nå</span>
          </>
        )}
      </motion.button>

      {/* Payment Methods Info */}
      <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <Icon name="smartphone" size={14} />
          <span>Apple Pay</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1.5">
          <Icon name="smartphone" size={14} />
          <span>Google Pay</span>
        </div>
        <span>•</span>
        <span>Kort</span>
      </div>

      {/* Security Note */}
      <p className="text-xs text-center text-on-surface-variant">
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 border bg-surface border-outline-variant/30"
          >
            <Icon name="credit_card" size={28} className="text-primary" />
          </motion.div>
          <h1 className="text-2xl font-semibold mb-2 text-primary">
            Fullfør betaling
          </h1>
          <p className="text-on-surface-variant">
            Apple Pay, Google Pay eller kort
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 border bg-surface-container-lowest border-outline-variant/30 shadow-md"
        >
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: "#005840",
                  colorBackground: "#FFFFFF",
                  colorText: "#005840",
                  colorDanger: "#EF4444",
                  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                  borderRadius: "12px",
                  spacingUnit: "4px",
                },
              },
            }}
          >
            <Icon name="check"outForm bookingId={bookingId} serviceName={serviceName} />
          </Elements>
        </motion.div>
      </motion.div>
    </div>
  );
}
