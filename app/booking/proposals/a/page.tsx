"use client";

import { motion } from "framer-motion";
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
    duration: "2 x 20 min",
    description: "Maanedlig coaching med TrackMan-analyse og treningsplan.",
  },
  {
    id: "performance-pro",
    name: "Performance Pro",
    category: "abonnement",
    price: 2000,
    priceSuffix: "/mnd",
    duration: "4 x 20 min",
    description: "Dobbelt sa mange okter, prioritert booking.",
  },
  {
    id: "flex-20",
    name: "Flex 20",
    category: "enkeltokter",
    price: 995,
    duration: "20 min",
  },
  {
    id: "flex-50",
    name: "Flex 50",
    category: "enkeltokter",
    price: 2500,
    duration: "50 min",
  },
  {
    id: "flex-50-duo",
    name: "Flex 50 Duo",
    category: "enkeltokter",
    price: 1700,
    priceSuffix: "/pers",
    duration: "50 min",
    perPerson: true,
  },
  {
    id: "on-course",
    name: "Banecoaching 9 hull",
    category: "bane",
    price: 1500,
    duration: "90 min",
  },
];

const instructors = [
  { id: "anders", name: "Anders", avatar: "AK" },
  { id: "preben", name: "Preben", avatar: "PH" },
];

/* ─── Component ─── */
export default function ProposalA() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState("anders");
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const foundation = services.find((s) => s.id === "foundation")!;
  const abonnement = services.filter((s) => s.category === "abonnement");
  const enkeltokter = services.filter((s) => s.category === "enkeltokter");
  const bane = services.filter((s) => s.category === "bane");

  const formatPrice = (price: number) =>
    price.toLocaleString("nb-NO");

  return (
    <div className="min-h-screen bg-white">
      {/* ─── Header ─── */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="border-b border-[var(--color-grey-200)]/50 px-6 py-5"
      >
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-black)]">
            AK Golf
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--color-grey-400)]">
            Bestill time
          </span>
        </div>
      </motion.header>

      <main className="mx-auto max-w-2xl px-6">
        {/* ─── Hero ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="pb-16 pt-20"
        >
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[var(--color-black)]">
            Book coaching
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-[1.65] text-[var(--color-grey-500)]">
            Velg tjeneste, instruktor og tid. Alt pa ett sted.
          </p>
        </motion.section>

        {/* ─── Instructor Pills ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="pb-14"
        >
          <p className="mb-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-400)]">
            Instruktor
          </p>
          <div className="flex gap-2">
            {instructors.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstructor(inst.id)}
                className={`flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[13px] font-medium transition-all duration-300 ${
                  selectedInstructor === inst.id
                    ? "bg-[var(--color-black)] text-white"
                    : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:bg-[var(--color-grey-200)]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                    selectedInstructor === inst.id
                      ? "bg-white/20 text-white"
                      : "bg-[var(--color-grey-200)] text-[var(--color-grey-500)]"
                  }`}
                >
                  {inst.avatar}
                </span>
                {inst.name}
              </button>
            ))}
          </div>
        </motion.section>

        {/* ─── Foundation Test — Featured ─── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="pb-16"
        >
          <button
            onClick={() =>
              setSelectedService(
                selectedService === foundation.id ? null : foundation.id,
              )
            }
            onMouseEnter={() => setHoveredService(foundation.id)}
            onMouseLeave={() => setHoveredService(null)}
            className="group w-full text-left"
          >
            <div className="flex items-start gap-3">
              <span className="mt-2.5 block h-2 w-2 flex-shrink-0 rounded-full bg-[var(--color-brand)]" />
              <div className="flex-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
                      Start her
                    </p>
                    <h2 className="mt-1 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-black)]">
                      {foundation.name}
                    </h2>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold tracking-[-0.02em] text-[var(--color-black)]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {formatPrice(foundation.price)} kr
                    </p>
                  </div>
                </div>
                <p className="mt-4 max-w-lg text-[15px] leading-[1.7] text-[var(--color-grey-500)]">
                  {foundation.description}
                </p>
                <div className="mt-5 flex items-center gap-5">
                  <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-grey-400)]">
                    <Clock className="h-3.5 w-3.5" />
                    {foundation.duration}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-[var(--color-grey-400)]">
                    <User className="h-3.5 w-3.5" />
                    Individuell
                  </span>
                </div>
                {foundation.features && (
                  <ul className="mt-6 space-y-2.5">
                    {foundation.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2.5 text-[13px] text-[var(--color-grey-500)]"
                      >
                        <Check className="h-3.5 w-3.5 flex-shrink-0 text-[var(--color-brand)]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
                <div
                  className={`mt-6 flex items-center gap-2 text-[13px] font-medium transition-all duration-300 ${
                    selectedService === foundation.id
                      ? "text-[var(--color-brand)]"
                      : "text-[var(--color-grey-400)] group-hover:text-[var(--color-black)]"
                  }`}
                >
                  {selectedService === foundation.id ? (
                    <>
                      <Check className="h-4 w-4" />
                      Valgt — velg tid nedenfor
                    </>
                  ) : (
                    <>
                      Velg denne
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </div>
            </div>
          </button>

          {/* Inline time picker placeholder */}
          {selectedService === foundation.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="ml-5 mt-8 overflow-hidden"
            >
              <div className="rounded-xl border border-[var(--color-grey-200)] p-6">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-400)]">
                  Velg dato og tid
                </p>
                <div className="mt-4 flex gap-2">
                  {["Man 7/4", "Tir 8/4", "Ons 9/4", "Tor 10/4"].map(
                    (day, i) => (
                      <button
                        key={day}
                        className={`rounded-lg px-4 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                          i === 0
                            ? "bg-[var(--color-black)] text-white"
                            : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:bg-[var(--color-grey-200)]"
                        }`}
                      >
                        {day}
                      </button>
                    ),
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {[
                    "09:00",
                    "09:30",
                    "10:00",
                    "10:30",
                    "11:00",
                    "13:00",
                    "14:00",
                    "15:30",
                  ].map((time) => (
                    <button
                      key={time}
                      className="rounded-lg border border-[var(--color-grey-200)] px-3 py-2.5 text-[13px] font-medium text-[var(--color-grey-600)] transition-all duration-200 hover:border-[var(--color-black)] hover:text-[var(--color-black)]"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </motion.section>

        {/* ─── Divider ─── */}
        <div className="border-t border-[var(--color-grey-200)]/60" />

        {/* ─── Abonnement ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="py-14"
        >
          <p className="mb-8 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-400)]">
            Abonnement
          </p>
          <div className="space-y-0">
            {abonnement.map((service, i) => (
              <button
                key={service.id}
                onClick={() =>
                  setSelectedService(
                    selectedService === service.id ? null : service.id,
                  )
                }
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="group flex w-full items-baseline justify-between border-b border-[var(--color-grey-200)]/40 py-5 text-left transition-all duration-300 first:pt-0 last:border-0"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`text-[17px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                      selectedService === service.id
                        ? "text-[var(--color-brand)]"
                        : hoveredService === service.id
                          ? "text-[var(--color-black)]"
                          : "text-[var(--color-grey-600)]"
                    }`}
                  >
                    {service.name}
                  </span>
                  <span className="flex items-center gap-1 text-[12px] text-[var(--color-grey-400)]">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </span>
                </div>
                <span
                  className="text-[17px] font-medium tracking-[-0.01em] text-[var(--color-grey-600)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatPrice(service.price)} kr
                  {service.priceSuffix && (
                    <span className="text-[12px] font-normal text-[var(--color-grey-400)]">
                      {service.priceSuffix}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ─── Divider ─── */}
        <div className="border-t border-[var(--color-grey-200)]/60" />

        {/* ─── Enkeltokter ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="py-14"
        >
          <p className="mb-8 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-400)]">
            Enkeltokter
          </p>
          <div className="space-y-0">
            {enkeltokter.map((service) => (
              <button
                key={service.id}
                onClick={() =>
                  setSelectedService(
                    selectedService === service.id ? null : service.id,
                  )
                }
                onMouseEnter={() => setHoveredService(service.id)}
                onMouseLeave={() => setHoveredService(null)}
                className="group flex w-full items-baseline justify-between border-b border-[var(--color-grey-200)]/40 py-5 text-left transition-all duration-300 first:pt-0 last:border-0"
              >
                <div className="flex items-baseline gap-4">
                  <span
                    className={`text-[17px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                      selectedService === service.id
                        ? "text-[var(--color-brand)]"
                        : hoveredService === service.id
                          ? "text-[var(--color-black)]"
                          : "text-[var(--color-grey-600)]"
                    }`}
                  >
                    {service.name}
                  </span>
                  {service.perPerson && (
                    <span className="flex items-center gap-1 text-[12px] text-[var(--color-grey-400)]">
                      <Users className="h-3 w-3" />2 personer
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[12px] text-[var(--color-grey-400)]">
                    <Clock className="h-3 w-3" />
                    {service.duration}
                  </span>
                </div>
                <span
                  className="text-[17px] font-medium tracking-[-0.01em] text-[var(--color-grey-600)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {formatPrice(service.price)} kr
                  {service.priceSuffix && (
                    <span className="text-[12px] font-normal text-[var(--color-grey-400)]">
                      {service.priceSuffix}
                    </span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </motion.section>

        {/* ─── Divider ─── */}
        <div className="border-t border-[var(--color-grey-200)]/60" />

        {/* ─── Bane ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="py-14"
        >
          <p className="mb-8 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--color-grey-400)]">
            Pa banen
          </p>
          {bane.map((service) => (
            <button
              key={service.id}
              onClick={() =>
                setSelectedService(
                  selectedService === service.id ? null : service.id,
                )
              }
              onMouseEnter={() => setHoveredService(service.id)}
              onMouseLeave={() => setHoveredService(null)}
              className="group flex w-full items-baseline justify-between py-5 text-left transition-all duration-300"
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={`text-[17px] font-medium tracking-[-0.01em] transition-colors duration-300 ${
                    selectedService === service.id
                      ? "text-[var(--color-brand)]"
                      : hoveredService === service.id
                        ? "text-[var(--color-black)]"
                        : "text-[var(--color-grey-600)]"
                  }`}
                >
                  {service.name}
                </span>
                <span className="flex items-center gap-1 text-[12px] text-[var(--color-grey-400)]">
                  <MapPin className="h-3 w-3" />
                  Utendors
                </span>
                <span className="flex items-center gap-1 text-[12px] text-[var(--color-grey-400)]">
                  <Clock className="h-3 w-3" />
                  {service.duration}
                </span>
              </div>
              <span
                className="text-[17px] font-medium tracking-[-0.01em] text-[var(--color-grey-600)]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatPrice(service.price)} kr
              </span>
            </button>
          ))}
        </motion.section>

        {/* ─── Trust ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="border-t border-[var(--color-grey-200)]/60 py-14"
        >
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-[12px] text-[var(--color-grey-400)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ingen binding
            </span>
            <span className="flex items-center gap-2 text-[12px] text-[var(--color-grey-400)]">
              <Calendar className="h-3.5 w-3.5" />
              Gratis avbestilling 24t for
            </span>
            <span className="flex items-center gap-2 text-[12px] text-[var(--color-grey-400)]">
              <Star className="h-3.5 w-3.5" />
              TrackMan i alle okter
            </span>
          </div>
        </motion.section>
      </main>

      {/* ─── Proposal label ─── */}
      <div className="fixed bottom-6 left-6">
        <span className="rounded-full bg-[var(--color-black)] px-4 py-2 text-[11px] font-medium tracking-[0.05em] text-white/70">
          Forslag A — Minimal Nordic
        </span>
      </div>
    </div>
  );
}
