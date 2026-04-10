"use client";

import { motion, AnimatePresence } from "framer-motion";
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
import { useState, useRef } from "react";

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
  categoryLabel?: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: "foundation",
    name: "Foundation Test",
    category: "anbefalt",
    price: 995,
    duration: "60 min",
    description:
      "Komplett analyse av spillet ditt med TrackMan. Detaljert rapport og personlig anbefaling.",
    features: [
      "Full TrackMan-analyse",
      "Detaljert rapport",
      "Personlig anbefaling",
      "Ingen binding",
    ],
    recommended: true,
    categoryLabel: "Anbefalt",
    icon: <Star className="h-5 w-5" />,
  },
  {
    id: "performance",
    name: "Performance",
    category: "abonnement",
    price: 1600,
    priceSuffix: "/mnd",
    duration: "20 min",
    sessions: "2 okter/mnd",
    description: "Maanedlig coaching med TrackMan-analyse og treningsplan.",
    categoryLabel: "Abonnement",
    icon: <Calendar className="h-5 w-5" />,
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
    categoryLabel: "Abonnement",
    icon: <Calendar className="h-5 w-5" />,
  },
  {
    id: "flex-20",
    name: "Flex 20",
    category: "enkeltokter",
    price: 995,
    duration: "20 min",
    description: "Kort, fokusert treningsokt med TrackMan.",
    categoryLabel: "Enkeltokt",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "flex-50",
    name: "Flex 50",
    category: "enkeltokter",
    price: 2500,
    duration: "50 min",
    description: "Grundig gjennomgang av teknikk og strategi.",
    categoryLabel: "Enkeltokt",
    icon: <User className="h-5 w-5" />,
  },
  {
    id: "flex-50-duo",
    name: "Flex 50 Duo",
    category: "enkeltokter",
    price: 1700,
    priceSuffix: "/pers",
    duration: "50 min",
    perPerson: true,
    description: "Del okten med en venn. To spillere, en coach.",
    categoryLabel: "Enkeltokt",
    icon: <Users className="h-5 w-5" />,
  },
  {
    id: "on-course",
    name: "Banecoaching 9 hull",
    category: "bane",
    price: 1500,
    duration: "90 min",
    description: "Coaching pa banen. Naerspill og strategi i ekte situasjoner.",
    categoryLabel: "Pa banen",
    icon: <MapPin className="h-5 w-5" />,
  },
];

const instructors = [
  { id: "anders", name: "Anders K.", avatar: "AK" },
  { id: "preben", name: "Preben H.", avatar: "PH" },
];

const timeSlots = [
  { day: "Man 7/4", slots: ["09:00", "09:30", "10:00", "11:00", "14:00", "15:30"] },
  { day: "Tir 8/4", slots: ["08:30", "10:00", "13:00", "14:30", "16:00"] },
  { day: "Ons 9/4", slots: ["09:00", "10:30", "11:00", "13:30", "15:00"] },
  { day: "Tor 10/4", slots: ["09:00", "09:30", "11:30", "14:00"] },
  { day: "Fre 11/4", slots: ["08:00", "10:00", "12:00", "15:00", "16:30"] },
];

/* ─── Component ─── */
export default function ProposalC() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedInstructor, setSelectedInstructor] = useState("anders");
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentService = services.find((s) => s.id === selectedService);

  const formatPrice = (price: number) =>
    price.toLocaleString("nb-NO");

  const handleServiceSelect = (id: string) => {
    setSelectedService(id === selectedService ? null : id);
    setSelectedTime(null);
  };

  return (
    <div className="relative min-h-screen bg-white pb-28">
      {/* ─── Sticky Header ─── */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl"
      >
        <div className="border-b border-[var(--color-grey-200)]/60 px-6 py-4">
          <div className="mx-auto flex max-w-lg items-center justify-between">
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-[var(--color-black)]">
              AK Golf
            </span>
            <div className="flex items-center gap-1.5">
              {["Tjeneste", "Tid", "Bekreft"].map((step, i) => (
                <div key={step} className="flex items-center gap-1.5">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                      i === 0
                        ? "bg-[var(--color-black)] text-white"
                        : "bg-[var(--color-grey-100)] text-[var(--color-grey-400)]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      i === 0
                        ? "text-[var(--color-black)]"
                        : "text-[var(--color-grey-400)]"
                    }`}
                  >
                    {step}
                  </span>
                  {i < 2 && (
                    <div className="mx-1 h-px w-4 bg-[var(--color-grey-200)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Instructor Pills in Header ─── */}
        <div className="border-b border-[var(--color-grey-200)]/40 px-6 py-3">
          <div className="mx-auto flex max-w-lg items-center gap-2">
            <span className="mr-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-grey-400)]">
              Coach
            </span>
            {instructors.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInstructor(inst.id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium transition-all duration-300 ${
                  selectedInstructor === inst.id
                    ? "bg-[var(--color-black)] text-white"
                    : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:bg-[var(--color-grey-200)]"
                }`}
              >
                {inst.name}
              </button>
            ))}
          </div>
        </div>
      </motion.header>

      <main className="mx-auto max-w-lg px-6">
        {/* ─── Hero ─── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="pb-6 pt-8"
        >
          <h1 className="text-[clamp(1.5rem,5vw,2rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[var(--color-black)]">
            Velg tjeneste
          </h1>
          <p className="mt-2 text-[14px] text-[var(--color-grey-500)]">
            Swipe for a utforske. Trykk for a velge.
          </p>
        </motion.section>

        {/* ─── Horizontal Scroll Cards ─── */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="pb-8"
        >
          <div
            ref={scrollRef}
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 scrollbar-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {services.map((service, i) => {
              const isSelected = selectedService === service.id;
              const isRecommended = service.recommended;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + i * 0.06,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="snap-center"
                >
                  <button
                    onClick={() => handleServiceSelect(service.id)}
                    className={`relative flex flex-shrink-0 flex-col justify-between rounded-[20px] p-5 text-left transition-all duration-400 ${
                      isRecommended
                        ? "h-[260px] w-[220px]"
                        : "h-[220px] w-[180px]"
                    } ${
                      isSelected
                        ? isRecommended
                          ? "bg-[var(--color-black)] ring-2 ring-[var(--color-brand)] ring-offset-2"
                          : "bg-[var(--color-black)] ring-2 ring-[var(--color-grey-400)] ring-offset-2"
                        : isRecommended
                          ? "bg-[var(--color-black)]"
                          : "bg-[var(--color-grey-100)]"
                    }`}
                  >
                    {/* Category label */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            isSelected || isRecommended
                              ? "text-white/40"
                              : "text-[var(--color-grey-400)]"
                          }`}
                        >
                          {service.categoryLabel}
                        </span>
                        {isRecommended && (
                          <span className="rounded-full bg-[var(--color-brand)] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                            Start her
                          </span>
                        )}
                        {isSelected && !isRecommended && (
                          <Check
                            className={`h-4 w-4 ${
                              isRecommended
                                ? "text-[var(--color-brand)]"
                                : "text-white"
                            }`}
                          />
                        )}
                      </div>
                      <h3
                        className={`text-[16px] font-semibold leading-tight tracking-[-0.01em] ${
                          isSelected || isRecommended
                            ? "text-white"
                            : "text-[var(--color-black)]"
                        }`}
                      >
                        {service.name}
                      </h3>
                      <p
                        className={`mt-2 text-[12px] leading-[1.5] ${
                          isSelected || isRecommended
                            ? "text-white/50"
                            : "text-[var(--color-grey-400)]"
                        }`}
                      >
                        {service.description}
                      </p>
                    </div>

                    {/* Bottom */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-[22px] font-bold tracking-[-0.02em] ${
                            isSelected || isRecommended
                              ? "text-white"
                              : "text-[var(--color-black)]"
                          }`}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          {formatPrice(service.price)}
                        </span>
                        <span
                          className={`text-[13px] ${
                            isSelected || isRecommended
                              ? "text-white/50"
                              : "text-[var(--color-grey-400)]"
                          }`}
                          style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                          kr{service.priceSuffix || ""}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span
                          className={`flex items-center gap-1 text-[11px] ${
                            isSelected || isRecommended
                              ? "text-white/40"
                              : "text-[var(--color-grey-400)]"
                          }`}
                        >
                          <Clock className="h-3 w-3" />
                          {service.duration}
                        </span>
                        {service.perPerson && (
                          <span
                            className={`flex items-center gap-1 text-[11px] ${
                              isSelected || isRecommended
                                ? "text-white/40"
                                : "text-[var(--color-grey-400)]"
                            }`}
                          >
                            <Users className="h-3 w-3" />2 pers
                          </span>
                        )}
                        {service.sessions && (
                          <span
                            className={`text-[11px] ${
                              isSelected || isRecommended
                                ? "text-white/40"
                                : "text-[var(--color-grey-400)]"
                            }`}
                          >
                            {service.sessions}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Scroll hint dots */}
          <div className="flex justify-center gap-1.5 pt-2">
            {services.map((s) => (
              <div
                key={s.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selectedService === s.id
                    ? "w-4 bg-[var(--color-black)]"
                    : "w-1.5 bg-[var(--color-grey-300)]"
                }`}
              />
            ))}
          </div>
        </motion.section>

        {/* ─── Features for selected — only show for Foundation ─── */}
        <AnimatePresence>
          {selectedService === "foundation" && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-6">
                <div className="rounded-2xl bg-[var(--color-grey-100)] p-5">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--color-grey-400)]">
                    Inkludert
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {services
                      .find((s) => s.id === "foundation")
                      ?.features?.map((f) => (
                        <span
                          key={f}
                          className="flex items-center gap-2 text-[12px] text-[var(--color-grey-600)]"
                        >
                          <Check className="h-3 w-3 flex-shrink-0 text-[var(--color-brand)]" />
                          {f}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Inline Time Picker ─── */}
        <AnimatePresence>
          {selectedService && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="pb-8">
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--color-black)] text-[10px] font-bold text-white">
                    2
                  </div>
                  <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-[var(--color-black)]">
                    Velg tid
                  </h2>
                </div>

                {/* Day selector — horizontal scroll */}
                <div className="-mx-6 mb-4 flex gap-2 overflow-x-auto px-6 pb-2" style={{ scrollbarWidth: "none" }}>
                  {timeSlots.map((ts, i) => (
                    <button
                      key={ts.day}
                      onClick={() => {
                        setSelectedDay(i);
                        setSelectedTime(null);
                      }}
                      className={`flex-shrink-0 rounded-xl px-4 py-3 text-center transition-all duration-300 ${
                        selectedDay === i
                          ? "bg-[var(--color-black)] text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)] hover:bg-[var(--color-grey-200)]"
                      }`}
                    >
                      <p className="text-[13px] font-medium">{ts.day}</p>
                      <p
                        className={`mt-0.5 text-[11px] ${
                          selectedDay === i
                            ? "text-white/50"
                            : "text-[var(--color-grey-400)]"
                        }`}
                        style={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {ts.slots.length} tider
                      </p>
                    </button>
                  ))}
                </div>

                {/* Time grid */}
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots[selectedDay].slots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`rounded-xl py-3 text-center text-[14px] font-medium transition-all duration-200 ${
                        selectedTime === time
                          ? "bg-[var(--color-brand)] text-white"
                          : "bg-[var(--color-grey-100)] text-[var(--color-grey-600)] hover:bg-[var(--color-grey-200)]"
                      }`}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* ─── Trust badges ─── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="py-8"
        >
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-grey-400)]">
              <ShieldCheck className="h-3.5 w-3.5" />
              Ingen binding
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-grey-400)]">
              <Calendar className="h-3.5 w-3.5" />
              Gratis avbestilling 24t for
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--color-grey-400)]">
              <Star className="h-3.5 w-3.5" />
              TrackMan i alle okter
            </span>
          </div>
        </motion.section>
      </main>

      {/* ─── Sticky Bottom CTA ─── */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--color-grey-200)]/60 bg-white/95 backdrop-blur-xl"
          >
            <div className="mx-auto flex max-w-lg items-center justify-between px-6 py-4">
              <div>
                <p className="text-[14px] font-semibold text-[var(--color-black)]">
                  {currentService?.name}
                </p>
                <p
                  className="text-[13px] text-[var(--color-grey-500)]"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {currentService
                    ? formatPrice(currentService.price)
                    : ""}{" "}
                  kr
                  {currentService?.priceSuffix || ""}
                  {selectedTime && (
                    <span className="ml-2 text-[var(--color-brand)]">
                      {timeSlots[selectedDay].day}, {selectedTime}
                    </span>
                  )}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 rounded-full px-6 py-3 text-[13px] font-semibold transition-all duration-300 ${
                  selectedTime
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-black)] text-white"
                }`}
              >
                {selectedTime ? (
                  <>
                    Bekreft
                    <Check className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Velg tid
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Proposal label ─── */}
      <div className="fixed bottom-20 left-6 z-50">
        <span className="rounded-full bg-[var(--color-black)] px-4 py-2 text-[11px] font-medium tracking-[0.05em] text-white/70">
          Forslag C — Single-scroll App
        </span>
      </div>
    </div>
  );
}
