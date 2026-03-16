"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import { CreditCard, Calendar, Clock, User, AlertCircle, Loader2, ShieldCheck } from "lucide-react";
import Image from "next/image";

interface ServiceTypeData {
  id: string;
  name: string;
  duration: number;
  price: number;
  description: string | null;
  allowStripe: boolean;
  allowVipps: boolean;
}

interface InstructorData {
  id: string;
  user: {
    name: string | null;
    image: string | null;
  };
}

interface Props {
  serviceType: ServiceTypeData;
  instructor: InstructorData;
  startTime: string;
  studentId: string;
}

// Warm Light Theme
const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  gold: "#B8975C",
  goldLight: "#E8D4B0",
  goldMuted: "#D4C4A8",
  navy: "#0F2950",
  text: "#02060D",
  textMuted: "#64748B",
  textLight: "#9CA3AF",
  border: "#EBE5DA",
  error: "#EF4444",
  shadow: "0 4px 8px rgba(0,0,0,0.1)",
  shadowHover: "0 8px 30px rgba(0,0,0,0.1)",
  shadowGold: "0 4px 16px rgba(184,151,92,0.3)",
};

function VippsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#FF5B24" />
      <path
        d="M6 8.5C7.5 8.5 8.5 9.5 9.5 11L12 15L14.5 11C15.5 9.5 16.5 8.5 18 8.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BookingPaymentForm({ serviceType, instructor, startTime, studentId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<"stripe" | "vipps" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startDate = new Date(startTime);
  if (isNaN(startDate.getTime())) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center"
        style={{ background: THEME.bg }}
      >
        <p style={{ color: THEME.textMuted }}>Ugyldig tidspunkt.</p>
      </div>
    );
  }
  const priceNok = serviceType.price / 100;

  const formattedDate = format(startDate, "EEEE d. MMMM yyyy", { locale: nb });
  const formattedTime = format(startDate, "HH:mm", { locale: nb });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  async function handleStripe() {
    setLoading("stripe");
    setError(null);

    try {
      const res = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: serviceType.id,
          instructorId: instructor.id,
          startTime,
          paymentMethod: "STRIPE",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Noe gikk galt. Prøv igjen.");
        setLoading(null);
        return;
      }

      router.push(`/booking/${data.bookingId}/pay`);
    } catch {
      setError("Nettverksfeil. Sjekk tilkoblingen og prøv igjen.");
      setLoading(null);
    }
  }

  async function handleVipps() {
    setLoading("vipps");
    setError(null);

    try {
      const createRes = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceTypeId: serviceType.id,
          instructorId: instructor.id,
          startTime,
          paymentMethod: "VIPPS",
        }),
      });

      const createData = await createRes.json();

      if (!createRes.ok) {
        setError(createData.error ?? "Noe gikk galt. Prøv igjen.");
        setLoading(null);
        return;
      }

      const { bookingId } = createData;

      const vippsRes = await fetch("/api/booking/vipps-initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });

      if (vippsRes.status === 501) {
        setError("Vipps-betaling er ikke tilgjengelig ennå. Velg kortbetaling.");
        setLoading(null);
        return;
      }

      const vippsData = await vippsRes.json();

      if (!vippsRes.ok) {
        setError(vippsData.error ?? "Kunne ikke starte Vipps-betaling.");
        setLoading(null);
        return;
      }

      if (vippsData.paymentUrl) {
        window.location.href = vippsData.paymentUrl;
      } else {
        setError("Ugyldig respons fra Vipps. Prøv igjen.");
        setLoading(null);
      }
    } catch {
      setError("Nettverksfeil. Sjekk tilkoblingen og prøv igjen.");
      setLoading(null);
    }
  }

  const isAnyLoading = loading !== null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="w-full max-w-lg"
    >
      {/* Header */}
      <div className="text-center mb-10">
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
          Bekreft og betal
        </h1>
        <p style={{ color: THEME.textMuted }}>
          Gjennomgå detaljene og velg betalingsmetode
        </p>
      </div>

      {/* Booking Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl p-8 mb-6 border"
        style={{
          background: THEME.bgElevated,
          borderColor: THEME.border,
          boxShadow: THEME.shadow,
        }}
      >
        <h3 
          className="text-xs font-semibold uppercase tracking-widest mb-6"
          style={{ color: THEME.textLight }}
        >
          Bookingdetaljer
        </h3>

        <div className="space-y-5">
          {/* Service */}
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${THEME.gold}12` }}
            >
              <CreditCard size={20} style={{ color: THEME.gold }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Tjeneste</p>
              <p className="font-semibold" style={{ color: THEME.navy }}>{serviceType.name}</p>
              {serviceType.description && (
                <p className="text-sm mt-1" style={{ color: THEME.textMuted }}>
                  {serviceType.description}
                </p>
              )}
            </div>
          </div>

          {/* Instructor */}
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${THEME.gold}12` }}
            >
              <User size={20} style={{ color: THEME.gold }} />
            </div>
            <div className="flex items-center gap-3">
              {instructor.user.image && (
                <Image
                  src={instructor.user.image}
                  alt={instructor.user.name ?? "Instruktør"}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Instruktør</p>
                <p className="font-semibold" style={{ color: THEME.navy }}>
                  {instructor.user.name ?? "Ukjent instruktør"}
                </p>
              </div>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${THEME.gold}12` }}
            >
              <Calendar size={20} style={{ color: THEME.gold }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Dato og tid</p>
              <p className="font-semibold" style={{ color: THEME.navy }}>
                {capitalizedDate} kl. {formattedTime}
              </p>
            </div>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${THEME.gold}12` }}
            >
              <Clock size={20} style={{ color: THEME.gold }} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Varighet</p>
              <p className="font-semibold" style={{ color: THEME.navy }}>{serviceType.duration} minutter</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div 
          className="mt-6 pt-6 flex items-center justify-between border-t"
          style={{ borderColor: THEME.border }}
        >
          <span className="text-sm" style={{ color: THEME.textMuted }}>Totalpris</span>
          <span 
            className="text-3xl font-semibold"
            style={{ color: THEME.gold }}
          >
            {priceNok.toLocaleString("nb-NO", { style: "currency", currency: "NOK", minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </motion.div>

      {/* Payment Options */}
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
        <p 
          className="text-xs font-semibold uppercase tracking-widest mb-5"
          style={{ color: THEME.textLight }}
        >
          Velg betalingsmetode
        </p>

        <div className="space-y-3">
          {/* Stripe */}
          {serviceType.allowStripe && (
            <motion.button
              onClick={handleStripe}
              disabled={isAnyLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-all duration-300 disabled:opacity-50"
              style={{
                background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
                color: "#FFFFFF",
                boxShadow: THEME.shadowGold,
              }}
              whileHover={{ scale: 1.01, boxShadow: "0 8px 30px rgba(184,151,92,0.3)" }}
              whileTap={{ scale: 0.99 }}
            >
              {loading === "stripe" ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Oppretter booking...</span>
                </>
              ) : (
                <>
                  <CreditCard size={20} />
                  <span>Betal med kort / Apple Pay / Google Pay</span>
                </>
              )}
            </motion.button>
          )}

          {/* Vipps */}
          {serviceType.allowVipps && (
            <motion.button
              onClick={handleVipps}
              disabled={isAnyLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-5 rounded-2xl text-base font-semibold transition-all duration-300 disabled:opacity-50 border-2"
              style={{
                background: "transparent",
                color: "#FF5B24",
                borderColor: "#FF5B24",
              }}
              whileHover={{ 
                scale: 1.01,
                background: "#FF5B24",
                color: "#FFFFFF",
              }}
              whileTap={{ scale: 0.99 }}
            >
              {loading === "vipps" ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span>Starter Vipps...</span>
                </>
              ) : (
                <>
                  <VippsIcon />
                  <span>Betal med Vipps</span>
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 flex items-start gap-3 px-4 py-4 rounded-xl border"
            style={{ 
              background: `${THEME.error}10`,
              borderColor: `${THEME.error}30`,
            }}
          >
            <AlertCircle size={18} style={{ color: THEME.error }} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm" style={{ color: THEME.error }}>{error}</p>
          </motion.div>
        )}

        {/* Security Note */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <ShieldCheck size={14} style={{ color: THEME.textLight }} />
          <p className="text-xs" style={{ color: THEME.textLight }}>
            Sikker betaling. AK Golf lagrer ikke kortinformasjon.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
