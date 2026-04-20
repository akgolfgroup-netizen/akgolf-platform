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

// Stripe Elements krever hex-verdier for appearance API
const STRIPE_THEME = {
  colorPrimary: "#005840",
  colorText: "#005840",
  colorDanger: "#B84233",
};

interface CheckoutFormProps {
  bookingId: string;
  serviceName: string;
  customerEmail: string;
}

function CheckoutForm({ bookingId, serviceName, customerEmail }: CheckoutFormProps) {
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
        // Public users go to public confirmation page
        return_url:
          window.location.origin +
          "/booking/" +
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

      {/* Customer Info (read-only) */}
      <div className="rounded-2xl p-5 border bg-surface border-outline-variant/30">
        <div className="flex items-center gap-3">
          <Icon name="mail" size={18} className="text-primary" />
          <div>
            <p className="text-xs text-on-surface-variant">Booking sendes til</p>
            <p className="text-sm font-medium text-primary">{customerEmail}</p>
          </div>
        </div>
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
        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-[opacity,transform,box-shadow] duration-300 disabled:opacity-50 bg-primary text-surface shadow-lg shadow-black/15"
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
      <div className="flex items-center justify-center gap-3 text-xs text-on-surface-variant">
        <div className="flex items-center gap-1">
          <Icon name="smartphone" size={12} />
          <span>Apple Pay</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Icon name="smartphone" size={12} />
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

interface PublicStripePaymentPageProps {
  clientSecret: string;
  bookingId: string;
  serviceName: string;
  customerEmail: string;
  amount: number;
}

export function PublicStripePaymentPage({
  clientSecret,
  bookingId,
  serviceName,
  customerEmail,
  amount,
}: PublicStripePaymentPageProps) {
  // Prisene er lagret i kroner
  const priceNOK = amount.toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
  });

  return (
    <div className="min-h-screen py-12 px-4 bg-surface">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md mx-auto"
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

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6 text-center border bg-primary border-outline-variant/30"
        >
          <p className="text-sm mb-1 text-surface/70">Total å betale</p>
          <p className="text-4xl font-bold text-surface">{priceNOK}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 border bg-surface-container-lowest border-outline-variant/30 shadow-card"
        >
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: STRIPE_THEME.colorPrimary,
                  colorBackground: "#FFFFFF",
                  colorText: STRIPE_THEME.colorText,
                  colorDanger: STRIPE_THEME.colorDanger,
                  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
                  borderRadius: "12px",
                  spacingUnit: "4px",
                },
              },
            }}
          >
            <Icon name="check"outForm 
              bookingId={bookingId} 
              serviceName={serviceName} 
              customerEmail={customerEmail} />
          </Elements>
        </motion.div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a 
            href={`/booking/${bookingId}/confirmation`}
            className="text-sm transition-colors hover:opacity-70 text-on-surface-variant"
          >
            Avbryt betaling → Se bookingdetaljer
          </a>
        </div>
      </motion.div>
    </div>
  );
}
