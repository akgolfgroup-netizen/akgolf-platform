"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Calendar, User, CreditCard } from "lucide-react";
import Link from "next/link";

interface ConfirmationViewProps {
  serviceName: string;
  instructorName: string;
  formattedDate: string;
  duration: number;
  priceNOK: string;
  paymentMethod: string;
}

// Warm Light Theme
const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  gold: "#B8975C",
  goldLight: "#E8D4B0",
  navy: "#0F2950",
  text: "#02060D",
  textMuted: "#64748B",
  textLight: "#9CA3AF",
  border: "#EBE5DA",
  success: "#22C55E",
  shadow: "0 4px 8px rgba(0,0,0,0.1)",
  shadowGold: "0 4px 16px rgba(184,151,92,0.3)",
};

export function ConfirmationView({
  serviceName,
  instructorName,
  formattedDate,
  duration,
  priceNOK,
  paymentMethod,
}: ConfirmationViewProps) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: THEME.bg }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-lg"
      >
        {/* Success Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.1 
            }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{
              background: `linear-gradient(135deg, ${THEME.success}20, ${THEME.success}10)`,
              border: `2px solid ${THEME.success}40`,
            }}
          >
            <CheckCircle2 size={48} style={{ color: THEME.success }} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-semibold mb-3"
            style={{ color: THEME.navy }}
          >
            Booking bekreftet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ color: THEME.textMuted }}
          >
            Din coaching-time er booket og bekreftet
          </motion.p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-3xl p-8 mb-8 border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
            boxShadow: THEME.shadow,
          }}
        >
          {/* Decorative top line */}
          <div 
            className="absolute top-0 left-8 right-8 h-1 rounded-full"
            style={{ 
              background: `linear-gradient(90deg, ${THEME.gold}, ${THEME.goldLight}, ${THEME.gold})`,
            }}
          />

          <h3 
            className="text-xs font-semibold uppercase tracking-widest mb-6"
            style={{ color: THEME.textLight }}
          >
            Bookingdetaljer
          </h3>

          <div className="space-y-5">
            {/* Service */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-4"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${THEME.gold}15` }}
              >
                <CreditCard size={20} style={{ color: THEME.gold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Tjeneste</p>
                <p className="font-semibold" style={{ color: THEME.navy }}>{serviceName}</p>
              </div>
            </motion.div>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${THEME.gold}15` }}
              >
                <User size={20} style={{ color: THEME.gold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Instruktør</p>
                <p className="font-semibold" style={{ color: THEME.navy }}>{instructorName}</p>
              </div>
            </motion.div>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${THEME.gold}15` }}
              >
                <Calendar size={20} style={{ color: THEME.gold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Dato og tid</p>
                <p className="font-semibold" style={{ color: THEME.navy }}>{formattedDate}</p>
              </div>
            </motion.div>

            {/* Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${THEME.gold}15` }}
              >
                <Clock size={20} style={{ color: THEME.gold }} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Varighet</p>
                <p className="font-semibold" style={{ color: THEME.navy }}>{duration} minutter</p>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px" style={{ background: THEME.border }} />

          {/* Price & Payment */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1" style={{ color: THEME.textLight }}>Betalt</p>
              <p className="text-3xl font-semibold" style={{ color: THEME.gold }}>{priceNOK}</p>
            </div>
            {paymentMethod !== "NONE" && (
              <div 
                className="px-4 py-2 rounded-xl text-sm font-semibold"
                style={{
                  background: paymentMethod === "VIPPS" ? "#FF5B2420" : "#635BFF20",
                  color: paymentMethod === "VIPPS" ? "#FF5B24" : "#635BFF",
                }}
              >
                {paymentMethod === "VIPPS" ? "Vipps" : "Kort"}
              </div>
            )}
          </div>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-sm text-center mb-8"
          style={{ color: THEME.textMuted }}
        >
          En bekreftelse er sendt til din e-post.<br/>
          Du kan administrere bookingen fra "Bookinger" i menyen.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/portal/bookinger"
            className="flex items-center justify-center w-full px-6 py-4 rounded-2xl text-base font-semibold transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldLight})`,
              color: "#FFFFFF",
              boxShadow: THEME.shadowGold,
            }}
          >
            Se mine bookinger
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
