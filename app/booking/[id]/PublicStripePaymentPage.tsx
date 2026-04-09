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
import { CreditCard, AlertCircle, Loader2, ShieldCheck, Mail, Smartphone } from "lucide-react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Apple Light Theme 2026
const THEME = {
  bg: "#F5F5F7",
  bgElevated: "#FFFFFF",
  primary: "#1D1D1F",
  text: "#1D1D1F",
  textMuted: "#86868B",
  textLight: "#AEAEB2",
  border: "#E8E8ED",
  error: "#EF4444",
  shadow: "0 4px 8px rgba(0,0,0,0.06)",
  shadowPrimary: "0 4px 16px rgba(29,29,31,0.15)",
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
          background: THEME.bg,
          borderColor: THEME.border,
        }}
      >
        <CreditCard size={20} style={{ color: THEME.primary }} />
        <p className="font-medium" style={{ color: THEME.text }}>{serviceName}</p>
      </div>

      {/* Customer Info (read-only) */}
      <div
        className="rounded-2xl p-5 border"
        style={{
          background: THEME.bg,
          borderColor: THEME.border,
        }}
      >
        <div className="flex items-center gap-3">
          <Mail size={18} style={{ color: THEME.primary }} />
          <div>
            <p className="text-xs" style={{ color: THEME.textLight }}>Booking sendes til</p>
            <p className="text-sm font-medium" style={{ color: THEME.text }}>{customerEmail}</p>
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
        className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-[opacity,transform,box-shadow] duration-300 disabled:opacity-50"
        style={{
          background: THEME.primary,
          color: "#FFFFFF",
          boxShadow: THEME.shadowPrimary,
        }}
        whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(29,29,31,0.25)" }}
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

      {/* Payment Methods Info */}
      <div 
        className="flex items-center justify-center gap-3 text-xs"
        style={{ color: THEME.textMuted }}
      >
        <div className="flex items-center gap-1">
          <Smartphone size={12} />
          <span>Apple Pay</span>
        </div>
        <span>•</span>
        <div className="flex items-center gap-1">
          <Smartphone size={12} />
          <span>Google Pay</span>
        </div>
        <span>•</span>
        <span>Kort</span>
      </div>

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
  // Prisene er lagret i kroner
  const priceNOK = amount.toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
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
              background: THEME.bg,
              borderColor: THEME.border,
            }}
          >
            <CreditCard size={28} style={{ color: THEME.primary }} />
          </motion.div>
          <h1
            className="text-2xl font-semibold mb-2"
            style={{ color: THEME.text }}
          >
            Fullfør betaling
          </h1>
          <p style={{ color: THEME.textMuted }}>
            Apple Pay, Google Pay eller kort
          </p>
        </div>

        {/* Price Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 mb-6 text-center border"
          style={{
            background: THEME.primary,
            borderColor: THEME.border,
          }}
        >
          <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>Total å betale</p>
          <p className="text-4xl font-bold text-white">{priceNOK}</p>
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
                  colorPrimary: THEME.primary,
                  colorBackground: "#FFFFFF",
                  colorText: THEME.text,
                  colorDanger: THEME.error,
                  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
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
