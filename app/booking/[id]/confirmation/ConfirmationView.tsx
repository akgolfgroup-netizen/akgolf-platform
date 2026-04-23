"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import Link from "next/link";
import { BookingUpsellCard } from "@/components/portal/booking/upsell-card";

interface ConfirmationViewProps {
  serviceName: string;
  instructorName: string;
  formattedDate: string;
  duration: number;
  priceNOK: string;
  paymentMethod: string;
  userName?: string | null;
  bookingPrice: number;
}

export function ConfirmationView({
  serviceName,
  instructorName,
  formattedDate,
  duration,
  priceNOK,
  paymentMethod,
  userName,
  bookingPrice,
}: ConfirmationViewProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface">
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
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 bg-success/10 border-2 border-success/25"
          >
            <Icon name="check_circle" size={48} className="text-success" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-semibold mb-3 text-primary"
          >
            Booking bekreftet
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-on-surface-variant"
          >
            Din coaching-time er booket og bekreftet
          </motion.p>
        </div>

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-3xl p-8 mb-8 border bg-surface-container-lowest border-outline-variant/30 shadow-card"
        >
          {/* Decorative top line */}
          <div className="absolute top-0 left-8 right-8 h-1 rounded-full bg-primary" />

          <h3 className="text-xs font-semibold uppercase tracking-widest mb-6 text-on-surface-variant">
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
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface">
                <Icon name="credit_card" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1 text-on-surface-variant">Tjeneste</p>
                <p className="font-semibold text-primary">{serviceName}</p>
              </div>
            </motion.div>

            {/* Instructor */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface">
                <Icon name="person" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1 text-on-surface-variant">Instruktør</p>
                <p className="font-semibold text-primary">{instructorName}</p>
              </div>
            </motion.div>

            {/* Date */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface">
                <Icon name="calendar_today" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1 text-on-surface-variant">Dato og tid</p>
                <p className="font-semibold text-primary">{formattedDate}</p>
              </div>
            </motion.div>

            {/* Duration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-surface">
                <Icon name="schedule" size={20} className="text-primary" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide mb-1 text-on-surface-variant">Varighet</p>
                <p className="font-semibold text-primary">{duration} minutter</p>
              </div>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="my-6 h-px bg-surface-variant" />

          {/* Price & Payment */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide mb-1 text-on-surface-variant">Betalt</p>
              <p className="text-3xl font-semibold text-primary">{priceNOK}</p>
            </div>
            {paymentMethod !== "NONE" && (
              <div
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  paymentMethod === "VIPPS"
                    ? "bg-vipps/20 text-vipps"
                    : "bg-ai/20 text-ai"
                }`}
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
          className="text-sm text-center mb-6 text-on-surface-variant"
        >
          En bekreftelse er sendt til din e-post.<br/>
          Du kan administrere bookingen fra &quot;Bookinger&quot; i menyen.
        </motion.p>

        {/* Upsell Card */}
        <BookingUpsellCard
          userName={userName}
          bookingPrice={bookingPrice}
          isLoggedIn={true}
        />

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/portal/bookinger"
            className="flex items-center justify-center w-full px-6 py-4 rounded-2xl text-base font-semibold transition-opacity duration-300 bg-primary text-surface shadow-md"
          >
            Se mine bookinger
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
