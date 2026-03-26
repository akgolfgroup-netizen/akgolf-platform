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
import { CreditCard, AlertCircle, Loader2, ShieldCheck, User, Mail } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Warm Light Theme
const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  gold: "#B07D4F",
  goldLight: "#E8D4B0",
  navy: "#0A1929",
  text: "#02060D",
  textMuted: "#64748B",
  textLight: "#9CA3AF",
  border: "#EBE5DA",
  error: "#EF4444",
  shadow: "0 4px 8px rgba(0,0,0,0.1)",
  shadowGold: "0 4px 16px rgba(176,125,79,0.3)",
};

interface CheckoutFormProps {
  bookingId: string;
  serviceName: string;
  customerEmail: string;
}

function CheckoutForm({ bookingId, serviceName, customerEmail }: CheckoutFormProps) {
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
      <div 
        className="flex items-center gap-4 px-5 py-4 rounded-2xl border"
        style={{
          background: `${THEME.gold}08`,
          borderColor: `${THEME.gold}30`,
        }}
      >
        <CreditCard size={20} style={{ color: THEME.gold }} />
        <p className="font-medium" style={{ color: THEME.navy }}>{serviceName}</p>
      </div>

      {/* Customer Info (read-only) */}
      <div 
        className="rounded-2xl p-5 border"
        style={{
          background: `${THEME.gold}05`,
          borderColor: THEME.border,
        }}
      >
        <div className="flex items-center gap-3">
          <Mail size={18} style={{ color: THEME.gold }} />
          <div>
            <p className="text-xs" style={{ color: THEME.textLight }}>Booking sendes til</p>
            <p className="text-sm font-medium" style={{ color: THEME.navy }}>{customerEmail}</p>
          </div>
        </div>
      </div>

      {/* Stripe Payment Element */}
      <div 
        className="rounded-2xl p-5 border"
        style={{
          background: THEME.bgElevated,
          borderColor: THEME.border,
        }}
      >
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
          className="flex items-start gap-3 px-4 py-4 rounded-xl"
          style={{
            background: `${THEME.error}10`,
            border: `1px solid ${THEME.error}30`,
          }}
        >
          <AlertCircle size={18} style={{ color: THEME.error }} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm" style={{ color: THEME.error }}>{error}</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!stripe || !elements || loading}
        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-all duration-300 disabled:opacity-50"
        style={{
          background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
          color: "#FFFFFF",
          boxShadow: THEME.shadowGold,
        }}
        whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(176,125,79,0.3)" }}
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
      <p 
        className="text-xs text-center"
        style={{ color: THEME.textLight }}
      >
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
  customerName: string;
  amount: number;
}

export function PublicStripePaymentPage({
  clientSecret,
  bookingId,
  serviceName,
  customerEmail,
  customerName,
  amount,
}: PublicStripePaymentPageProps) {
  const priceNOK = (amount / 100).toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
  });

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{ background: THEME.bg }}
    >
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
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 border"
            style={{
              background: `${THEME.gold}15`,
              borderColor: `${THEME.gold}30`,
            }}
          >
            <CreditCard size={28} style={{ color: THEME.gold }} />
          </motion.div>
          <h1 
            className="text-2xl font-semibold mb-2"
            style={{ color: THEME.navy }}
          >
            Fullfør betaling
          </h1>
          <p style={{ color: THEME.textMuted }}>
            Sikker kortbetaling med Stripe
          </p>
        </div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6 text-center border"
          style={{
            background: `linear-gradient(135deg, ${THEME.navy}, #1a3a5c)`,
            borderColor: `${THEME.gold}30`,
          }}
        >
          <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Total å betale</p>
          <p className="text-4xl font-bold" style={{ color: THEME.gold }}>{priceNOK}</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl p-8 border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
            boxShadow: THEME.shadow,
          }}
        >
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: "stripe",
                variables: {
                  colorPrimary: THEME.gold,
                  colorBackground: "#FFFFFF",
                  colorText: THEME.navy,
                  colorDanger: THEME.error,
                  fontFamily: "Inter, sans-serif",
                  borderRadius: "12px",
                  spacingUnit: "4px",
                },
              },
            }}
          >
            <CheckoutForm 
              bookingId={bookingId} 
              serviceName={serviceName} 
              customerEmail={customerEmail}
            />
          </Elements>
        </motion.div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <a 
            href={`/booking/${bookingId}/confirmation`}
            className="text-sm transition-colors hover:opacity-70"
            style={{ color: THEME.textMuted }}
          >
            Avbryt betaling → Se bookingdetaljer
          </a>
        </div>
      </motion.div>
    </div>
  );
}
