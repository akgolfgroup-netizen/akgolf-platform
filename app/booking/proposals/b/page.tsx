"use client";

import { motion, type Variants } from "framer-motion";
import {
  Clock,
  Star,
  ArrowRight,
  Calendar,
  User,
  Users,
  MapPin,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";

/* ─── Service Data ─── */
interface Service {
  id: string;
  name: string;
  category: "anbefalt" | "abonnement" | "enkeltokter" | "bane";
  price: number;
  priceSuffix?: string;
  duration?: string;
  description?: string;
  features?: string[];
  recommended?: boolean;
  perPerson?: boolean;
  sessions?: string;
}

const services: Service[] = [
  {
    id: "foundation",
    name: "Foundation Test",
    category: "anbefalt",
    price: 995,
    duration: "60 min",
    description:
      "Komplett analyse av spillet ditt med TrackMan. Du far en detaljert rapport og personlig anbefaling for veien videre.",
    features: [
      "Full TrackMan-analyse",
      "Detaljert rapport",
      "Personlig anbefaling",
      "Ingen binding",
    ],
    recommended: true,
  },
  {
    id: "performance",
    name: "Performance",
    category: "abonnement",
    price: 1600,
    priceSuffix: "/mnd",
    duration: "20 min",
    sessions: "2 okter/mnd",
    description: "Maanedlig coaching med TrackMan-analyse og personlig treningsplan.",
  },
  {
    id: "performance-pro",
    name: "Performance Pro",
    category: "abonnement",
    price: 2000,
    priceSuffix: "/mnd",
    duration: "20 min",
    sessions: "4 okter/mnd",
    description: "Dobbelt sa mange okter. Prioritert booking 14 dager frem.",
  },
  {
    id: "flex-20",
    name: "Flex 20",
    category: "enkeltokter",
    price: 995,
    duration: "20 min",
    description: "Kort, fokusert okt.",
  },
  {
    id: "flex-50",
    name: "Flex 50",
    category: "enkeltokter",
    price: 2500,
    duration: "50 min",
    description: "Grundig gjennomgang.",
  },
  {
    id: "flex-50-duo",
    name: "Flex 50 Duo",
    category: "enkeltokter",
    price: 1700,
    priceSuffix: "/pers",
    duration: "50 min",
    perPerson: true,
    description: "Del okten med en venn.",
  },
  {
    id: "on-course",
    name: "On-Course Par 3",
    category: "bane",
    price: 1500,
    duration: "90 min",
    description: "Coaching pa banen. Naerspill og strategi i ekte situasjoner.",
  },
];

const instructors = [
  { id: "anders", name: "Anders K.", avatar: "AK" },
  { id: "preben", name: "Preben H.", avatar: "PH" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

/* ─── Component ─── */
export default function ProposalB() {
  const [selectedInstructor, setSelectedInstructor] = useState("anders");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const foundation = services.find((s) => s.id === "foundation")!;
  const abonnement = services.filter((s) => s.category === "abonnement");
  const enkeltokter = services.filter((s) => s.category === "enkeltokter");
  const bane = services.filter((s) => s.category === "bane");

  const formatPrice = (price: number) =>
    price.toLocaleString("nb-NO");

  return (
    <div className="min-h-screen bg-[var(--color-grey-100)]">
      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 z-50 border-b border-[var(--color-grey-200)]/60 bg-white/80 px-6 py-4 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-black)]">
            AK Golf
          </span>
          <div className="flex items-center gap-3">
            {instructors.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstructor(inst.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-medium transition-all duration-300 ${
                  selectedInstructor === inst.id
                    ? "bg-[var(--color-black)] text-white"
                    : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:bg-[var(--color-grey-200)]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-bold ${
                    selectedInstructor === inst.id
                      ? "bg-white/20 text-white"
                      : "bg-[var(--color-grey-300)] text-[var(--color-grey-600)]"
                  }`}
                >
                  {inst.avatar}
                </span>
                {inst.name}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* ─── Hero ─── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12"
        >
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.035em] text-[var(--color-black)]">
            Velg din coaching
          </h1>
          <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-[var(--color-grey-500)]">
            Fra enkeltimer til maanedlig oppfolging. Start med en Foundation Test
            for a finne riktig vei videre.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ─── Foundation Test — Full Width Featured Card ─── */}
          <motion.div variants={itemVariants} className="mb-4">
            <div className="relative overflow-hidden rounded-[20px]">
              {/* Atmospheric glow */}
              <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[var(--color-brand)] opacity-[0.06] blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-[var(--color-brand)] opacity-[0.04] blur-[60px]" />

              <div
                className="relative cursor-pointer bg-[var(--color-black)] p-8 transition-all duration-500 sm:p-10 md:p-12"
                onMouseEnter={() => setHoveredCard("foundation")}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Label pill */}
                <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5">
                  <Star className="h-3.5 w-3.5 text-[var(--color-brand-light)]" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                    Anbefalt startpunkt
                  </span>
                </div>

                <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-lg">
                    <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-white">
                      {foundation.name}
                    </h2>
                    <p className="mt-4 text-[15px] leading-[1.7] text-white/50">
                      {foundation.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                      {foundation.features?.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-2 text-[13px] text-white/40"
                        >
                          <Check className="h-3.5 w-3.5 text-[var(--color-brand)]" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-4 md:items-end">
                    <div className="text-right">
                      <p
                        className="text-[clamp(2rem,5vw,3rem)] font-bold tracking-[-0.02em] text-white"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {formatPrice(foundation.price)} kr
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/40">
                        <Clock className="h-3.5 w-3.5" />
                        {foundation.duration}
                      </p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13px] font-semibold text-[var(--color-black)] transition-all duration-300 hover:bg-[var(--color-brand-light)]"
                    >
                      Velg tid
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Section Label — Abonnement ─── */}
          <motion.div variants={itemVariants} className="mb-4 mt-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-grey-400)] shadow-sm">
              <Calendar className="h-3.5 w-3.5" />
              Abonnement
            </span>
          </motion.div>

          {/* ─── Abonnement Cards — Side by Side ─── */}
          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {abonnement.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <div
                  className={`group relative cursor-pointer rounded-[20px] bg-white p-7 transition-all duration-400 ${
                    hoveredCard === service.id
                      ? "shadow-[0_16px_48px_rgba(0,0,0,0.08)] translate-y-[-2px]"
                      : "shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  }`}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-black)]">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-[13px] text-[var(--color-grey-400)]">
                        {service.sessions}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className="text-[22px] font-bold tracking-[-0.02em] text-[var(--color-black)]"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {formatPrice(service.price)} kr
                      </p>
                      <p
                        className="text-[12px] text-[var(--color-grey-400)]"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {service.priceSuffix}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] leading-[1.6] text-[var(--color-grey-500)]">
                    {service.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-grey-400)]">
                      <Clock className="h-3.5 w-3.5" />
                      {service.duration} per okt
                    </span>
                    <span
                      className={`flex items-center gap-1.5 text-[12px] font-medium transition-all duration-300 ${
                        hoveredCard === service.id
                          ? "text-[var(--color-brand)]"
                          : "text-[var(--color-grey-300)]"
                      }`}
                    >
                      Velg
                      <ArrowRight
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          hoveredCard === service.id
                            ? "translate-x-0.5"
                            : ""
                        }`}
                      />
                    </span>
                  </div>
                  {service.id === "performance-pro" && (
                    <div className="absolute -right-1 -top-1 rounded-bl-xl rounded-tr-[20px] bg-[var(--color-brand)] px-3 py-1">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                        Mest valgt
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── Section Label — Enkeltokter ─── */}
          <motion.div variants={itemVariants} className="mb-4 mt-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-grey-400)] shadow-sm">
              <User className="h-3.5 w-3.5" />
              Enkeltokter
            </span>
          </motion.div>

          {/* ─── Enkeltokter Cards — 3 Column Grid ─── */}
          <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {enkeltokter.map((service) => (
              <motion.div key={service.id} variants={itemVariants}>
                <div
                  className={`group cursor-pointer rounded-[20px] bg-white p-6 transition-all duration-400 ${
                    hoveredCard === service.id
                      ? "shadow-[0_16px_48px_rgba(0,0,0,0.08)] translate-y-[-2px]"
                      : "shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                  }`}
                  onMouseEnter={() => setHoveredCard(service.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <h3 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--color-black)]">
                    {service.name}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-[1.5] text-[var(--color-grey-400)]">
                    {service.description}
                  </p>
                  <div className="mt-4 flex items-end justify-between">
                    <div>
                      <p
                        className="text-[20px] font-bold tracking-[-0.02em] text-[var(--color-black)]"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {formatPrice(service.price)} kr
                      </p>
                      {service.priceSuffix && (
                        <p
                          className="text-[11px] text-[var(--color-grey-400)]"
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {service.priceSuffix}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[var(--color-grey-400)]">
                      {service.perPerson && (
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />2
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ─── Section Label — Bane ─── */}
          <motion.div variants={itemVariants} className="mb-4 mt-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--color-grey-400)] shadow-sm">
              <MapPin className="h-3.5 w-3.5" />
              Pa banen
            </span>
          </motion.div>

          {/* ─── Bane Card ─── */}
          {bane.map((service) => (
            <motion.div key={service.id} variants={itemVariants} className="mb-4">
              <div
                className={`group cursor-pointer rounded-[20px] bg-white p-7 transition-all duration-400 ${
                  hoveredCard === service.id
                    ? "shadow-[0_16px_48px_rgba(0,0,0,0.08)] translate-y-[-2px]"
                    : "shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
                }`}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-[18px] font-semibold tracking-[-0.02em] text-[var(--color-black)]">
                      {service.name}
                    </h3>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-[var(--color-grey-500)]">
                      {service.description}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-grey-400)]">
                        <MapPin className="h-3.5 w-3.5" />
                        Utendors
                      </span>
                      <span className="flex items-center gap-1.5 text-[12px] text-[var(--color-grey-400)]">
                        <Clock className="h-3.5 w-3.5" />
                        {service.duration}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <p
                      className="text-[22px] font-bold tracking-[-0.02em] text-[var(--color-black)]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatPrice(service.price)} kr
                    </p>
                    <ArrowRight
                      className={`h-5 w-5 transition-all duration-300 ${
                        hoveredCard === service.id
                          ? "translate-x-1 text-[var(--color-brand)]"
                          : "text-[var(--color-grey-300)]"
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ─── Trust strip ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-white px-8 py-6"
        >
          <span className="flex items-center gap-2 text-[12px] text-[var(--color-grey-400)]">
            <ShieldCheck className="h-4 w-4" />
            Ingen binding
          </span>
          <span className="flex items-center gap-2 text-[12px] text-[var(--color-grey-400)]">
            <Calendar className="h-4 w-4" />
            Gratis avbestilling 24t for
          </span>
          <span className="flex items-center gap-2 text-[12px] text-[var(--color-grey-400)]">
            <Star className="h-4 w-4" />
            TrackMan i alle okter
          </span>
        </motion.div>
      </main>

      {/* ─── Proposal label ─── */}
      <div className="fixed bottom-6 left-6 z-50">
        <span className="rounded-full bg-[var(--color-black)] px-4 py-2 text-[11px] font-medium tracking-[0.05em] text-white/70">
          Forslag B — Premium Bento
        </span>
      </div>
    </div>
  );
}
