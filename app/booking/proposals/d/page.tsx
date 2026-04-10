"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Check,
} from "lucide-react";

/* ─── Types ─── */
interface DayInfo {
  date: number;
  month: number; // 0-indexed
  year: number;
  isCurrentMonth: boolean;
  isPast: boolean;
  isToday: boolean;
  hasSlots: boolean;
}

/* ─── Constants ─── */
const BRAND_GREEN = "#005840";
const BRAND_GREEN_10 = "rgba(0,88,64,0.10)";
const BRAND_GREEN_40 = "rgba(0,88,64,0.40)";
const TEXT_PRIMARY = "#0A1F18";
const TEXT_SECONDARY = "#7A8C85";
const BORDER = "#D5DFDB";
const SUBTLE_BG = "#ECF0EF";
const DISABLED = "#D2D2D7";

const WEEKDAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];

const MONTH_NAMES = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

/* Simulated available time slots per day-of-week (0=sun..6=sat) */
const SLOTS_BY_DOW: Record<number, string[]> = {
  1: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
  2: ["09:00", "10:00", "11:00", "13:00", "14:00"],
  3: ["10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
  4: ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"],
  5: ["09:00", "10:00", "11:00", "12:00"],
};

/* Short day names for CTA */
const SHORT_DAYS = ["Son", "Man", "Tir", "Ons", "Tor", "Fre", "Lor"];

/* ─── Helpers ─── */
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay();
  // Convert from Sun=0 to Mon=0
  return day === 0 ? 6 : day - 1;
}

function buildCalendarGrid(
  year: number,
  month: number,
  today: Date
): DayInfo[] {
  const days: DayInfo[] = [];
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Previous month padding
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  for (let i = firstDay - 1; i >= 0; i--) {
    const date = daysInPrevMonth - i;
    days.push({
      date,
      month: prevMonth,
      year: prevYear,
      isCurrentMonth: false,
      isPast: true,
      isToday: false,
      hasSlots: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(year, month, d);
    const dow = thisDate.getDay();
    const isPast =
      thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const isToday =
      d === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();
    const hasSlots = !isPast && dow >= 1 && dow <= 5;

    days.push({
      date: d,
      month,
      year,
      isCurrentMonth: true,
      isPast,
      isToday,
      hasSlots,
    });
  }

  // Next month padding to fill 6 rows
  const remaining = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextYear = month === 11 ? year + 1 : year;
  for (let d = 1; d <= remaining; d++) {
    days.push({
      date: d,
      month: nextMonth,
      year: nextYear,
      isCurrentMonth: false,
      isPast: false,
      isToday: false,
      hasSlots: false,
    });
  }

  return days;
}

function getSlotsForDate(date: Date): string[] {
  const dow = date.getDay();
  return SLOTS_BY_DOW[dow] ?? [];
}

/* ─── Service type ─── */
interface ServiceOption {
  id: string;
  name: string;
  duration: string;
  price: number;
}

const SERVICES: ServiceOption[] = [
  { id: "foundation", name: "Foundation Test", duration: "60 min", price: 995 },
  {
    id: "performance",
    name: "Performance",
    duration: "50 min",
    price: 1600,
  },
];

/* ─── Animation variants ─── */
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const calendarFade = {
  initial: { opacity: 0, x: 0 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

const pillSpring = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

/* ═══════════════════════════════════════════════════════════════════ */
/* Component                                                          */
/* ═══════════════════════════════════════════════════════════════════ */

export default function BookingProposalD() {
  const today = useMemo(() => new Date(2026, 3, 4), []); // April 4, 2026

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<{
    date: number;
    month: number;
    year: number;
  } | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<string>("foundation");
  const [showServicePicker, setShowServicePicker] = useState(false);
  const [direction, setDirection] = useState(0);

  const calendarDays = useMemo(
    () => buildCalendarGrid(currentYear, currentMonth, today),
    [currentYear, currentMonth, today]
  );

  const selectedDateObj = useMemo(() => {
    if (!selectedDate) return null;
    return new Date(selectedDate.year, selectedDate.month, selectedDate.date);
  }, [selectedDate]);

  const availableSlots = useMemo(() => {
    if (!selectedDateObj) return [];
    return getSlotsForDate(selectedDateObj);
  }, [selectedDateObj]);

  const activeService = SERVICES.find((s) => s.id === selectedService);

  const handlePrevMonth = useCallback(() => {
    setDirection(-1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const handleNextMonth = useCallback(() => {
    setDirection(1);
    setCurrentMonth((m) => (m === 11 ? 0 : m + 1));
    if (currentMonth === 11) setCurrentYear((y) => y + 1);
  }, [currentMonth]);

  const handleDateSelect = useCallback(
    (day: DayInfo) => {
      if (!day.isCurrentMonth || day.isPast || !day.hasSlots) return;
      setSelectedTime(null);
      setSelectedDate({ date: day.date, month: day.month, year: day.year });
    },
    []
  );

  const handleTimeSelect = useCallback((time: string) => {
    setSelectedTime(time);
  }, []);

  const isSelected = useCallback(
    (day: DayInfo) => {
      if (!selectedDate) return false;
      return (
        day.date === selectedDate.date &&
        day.month === selectedDate.month &&
        day.year === selectedDate.year
      );
    },
    [selectedDate]
  );

  /* CTA label */
  const ctaLabel = useMemo(() => {
    if (!selectedDate || !selectedTime || !activeService) return "Velg en tid";
    const d = new Date(
      selectedDate.year,
      selectedDate.month,
      selectedDate.date
    );
    const dayName = SHORT_DAYS[d.getDay()];
    const dateNum = d.getDate();
    const monthName = MONTH_NAMES[d.getMonth()].toLowerCase().slice(0, 3);
    return `Book ${activeService.name} \u2014 ${dayName} ${dateNum}. ${monthName}, ${selectedTime}`;
  }, [selectedDate, selectedTime, activeService]);

  const canBook = selectedDate !== null && selectedTime !== null;

  const isPrevDisabled =
    currentMonth === today.getMonth() && currentYear === today.getFullYear();

  /* ─── Calendar crossfade key ─── */
  const calendarKey = `${currentYear}-${currentMonth}`;

  return (
    <div className="min-h-screen bg-white">
      {/* ── Desktop: two-column / Mobile: single-column ── */}
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <div className="md:grid md:grid-cols-[1fr_340px] md:gap-12 md:pt-12">
          {/* ════ LEFT COLUMN ════ */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="pt-8 pb-36 md:pt-0 md:pb-12"
          >
            {/* ── Coach Profile ── */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center text-center mb-10 md:mb-12"
            >
              {/* Avatar */}
              <div
                className="relative mb-5"
                style={{ width: 88, height: 88 }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: TEXT_PRIMARY }}
                >
                  <span
                    className="text-white font-semibold"
                    style={{
                      fontSize: 28,
                      letterSpacing: "-0.02em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    AK
                  </span>
                </div>
                {/* Online indicator */}
                <div
                  className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full border-2 border-white"
                  style={{ backgroundColor: BRAND_GREEN }}
                />
              </div>

              {/* Name */}
              <h1
                className="font-bold"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.1,
                  color: TEXT_PRIMARY,
                }}
              >
                Anders Kristiansen
              </h1>

              {/* Role */}
              <p
                className="mt-2 font-medium uppercase"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  color: TEXT_SECONDARY,
                }}
              >
                Head Coach
              </p>

              {/* Trust indicators */}
              <div
                className="flex items-center gap-4 mt-4"
                style={{ color: TEXT_SECONDARY, fontSize: 12 }}
              >
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} strokeWidth={1.8} />
                  Fredrikstad
                </span>
                <span
                  className="w-px h-3"
                  style={{ backgroundColor: BORDER }}
                />
                <span>TrackMan</span>
                <span
                  className="w-px h-3"
                  style={{ backgroundColor: BORDER }}
                />
                <span>15+ ar</span>
              </div>
            </motion.div>

            {/* ── Calendar ── */}
            <motion.div variants={fadeUp}>
              {/* Month nav */}
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="font-semibold"
                  style={{
                    fontSize: 18,
                    letterSpacing: "-0.01em",
                    color: TEXT_PRIMARY,
                  }}
                >
                  {MONTH_NAMES[currentMonth]} {currentYear}
                </h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePrevMonth}
                    disabled={isPrevDisabled}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{
                      color: isPrevDisabled ? DISABLED : TEXT_SECONDARY,
                      cursor: isPrevDisabled ? "default" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isPrevDisabled)
                        e.currentTarget.style.backgroundColor = SUBTLE_BG;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    aria-label="Forrige maned"
                  >
                    <ChevronLeft size={18} strokeWidth={2} />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
                    style={{ color: TEXT_SECONDARY }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = SUBTLE_BG;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                    aria-label="Neste maned"
                  >
                    <ChevronRight size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Weekday headers */}
              <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="text-center font-medium"
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.04em",
                      color: TEXT_SECONDARY,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={calendarKey}
                  variants={calendarFade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="grid grid-cols-7"
                  style={{ gap: 0 }}
                >
                  {calendarDays.map((day, i) => {
                    const sel = isSelected(day);
                    const interactive =
                      day.isCurrentMonth && !day.isPast && day.hasSlots;

                    return (
                      <button
                        key={`${day.year}-${day.month}-${day.date}-${i}`}
                        onClick={() => handleDateSelect(day)}
                        disabled={!interactive}
                        className="relative flex flex-col items-center justify-center py-2"
                        style={{
                          height: 52,
                          cursor: interactive ? "pointer" : "default",
                        }}
                      >
                        {/* Selected circle */}
                        <AnimatePresence>
                          {sel && (
                            <motion.div
                              className="absolute rounded-full"
                              style={{
                                width: 40,
                                height: 40,
                                backgroundColor: BRAND_GREEN,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={pillSpring}
                            />
                          )}
                        </AnimatePresence>

                        {/* Today ring */}
                        {day.isToday && !sel && (
                          <div
                            className="absolute rounded-full"
                            style={{
                              width: 40,
                              height: 40,
                              border: `2px solid ${BRAND_GREEN_40}`,
                            }}
                          />
                        )}

                        {/* Date number */}
                        <span
                          className="relative z-10 font-medium"
                          style={{
                            fontSize: 15,
                            fontVariantNumeric: "tabular-nums",
                            color: sel
                              ? "#FFFFFF"
                              : !day.isCurrentMonth
                                ? DISABLED
                                : day.isPast
                                  ? DISABLED
                                  : TEXT_PRIMARY,
                            transition: "color 0.15s ease",
                          }}
                        >
                          {day.date}
                        </span>

                        {/* Availability dot */}
                        {day.hasSlots && !sel && day.isCurrentMonth && (
                          <div
                            className="absolute rounded-full"
                            style={{
                              width: 4,
                              height: 4,
                              bottom: 6,
                              backgroundColor: BRAND_GREEN_40,
                            }}
                          />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* ── Time Slots ── */}
            <AnimatePresence>
              {selectedDate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-8"
                >
                  <p
                    className="font-medium mb-3"
                    style={{
                      fontSize: 13,
                      letterSpacing: "0.02em",
                      color: TEXT_SECONDARY,
                    }}
                  >
                    Ledige tider
                  </p>

                  <div
                    className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {availableSlots.length > 0 ? (
                      availableSlots.map((time) => {
                        const active = selectedTime === time;
                        return (
                          <motion.button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            whileTap={{ scale: 0.95 }}
                            className="relative flex-shrink-0 rounded-full px-5 py-2.5 font-medium transition-colors duration-200"
                            style={{
                              fontSize: 14,
                              fontVariantNumeric: "tabular-nums",
                              fontFeatureSettings: '"tnum"',
                              backgroundColor: active
                                ? BRAND_GREEN
                                : SUBTLE_BG,
                              color: active ? "#FFFFFF" : TEXT_PRIMARY,
                              border: active
                                ? `1.5px solid ${BRAND_GREEN}`
                                : `1.5px solid ${BORDER}`,
                            }}
                          >
                            <motion.span
                              animate={{
                                scale: active ? 1.02 : 1,
                              }}
                              transition={pillSpring}
                            >
                              {time}
                            </motion.span>
                          </motion.button>
                        );
                      })
                    ) : (
                      <p
                        style={{ fontSize: 14, color: TEXT_SECONDARY }}
                      >
                        Ingen ledige tider denne dagen.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Service info (appears after time selection) ── */}
            <AnimatePresence>
              {selectedTime && activeService && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-6 rounded-2xl p-5"
                  style={{
                    backgroundColor: SUBTLE_BG,
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className="font-semibold"
                        style={{ fontSize: 15, color: TEXT_PRIMARY }}
                      >
                        {activeService.name}
                      </p>
                      <div
                        className="flex items-center gap-3 mt-1"
                        style={{ fontSize: 13, color: TEXT_SECONDARY }}
                      >
                        <span className="flex items-center gap-1">
                          <Clock size={13} strokeWidth={1.8} />
                          {activeService.duration}
                        </span>
                        <span
                          className="w-px h-3"
                          style={{ backgroundColor: BORDER }}
                        />
                        <span>{activeService.price} kr</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowServicePicker(!showServicePicker)}
                      className="font-medium transition-colors duration-200"
                      style={{
                        fontSize: 13,
                        color: BRAND_GREEN,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = "0.7";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = "1";
                      }}
                    >
                      endre tjeneste
                    </button>
                  </div>

                  {/* Service picker */}
                  <AnimatePresence>
                    {showServicePicker && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mt-4 flex flex-col gap-2"
                      >
                        {SERVICES.map((svc) => {
                          const isCurrent = svc.id === selectedService;
                          return (
                            <button
                              key={svc.id}
                              onClick={() => {
                                setSelectedService(svc.id);
                                setShowServicePicker(false);
                              }}
                              className="flex items-center justify-between rounded-xl px-4 py-3 transition-colors duration-200"
                              style={{
                                backgroundColor: isCurrent
                                  ? BRAND_GREEN_10
                                  : "white",
                                border: isCurrent
                                  ? `1.5px solid ${BRAND_GREEN}`
                                  : `1.5px solid ${BORDER}`,
                              }}
                            >
                              <div className="text-left">
                                <p
                                  className="font-medium"
                                  style={{
                                    fontSize: 14,
                                    color: TEXT_PRIMARY,
                                  }}
                                >
                                  {svc.name}
                                </p>
                                <p
                                  style={{
                                    fontSize: 12,
                                    color: TEXT_SECONDARY,
                                  }}
                                >
                                  {svc.duration} &middot; {svc.price} kr
                                </p>
                              </div>
                              {isCurrent && (
                                <Check
                                  size={16}
                                  strokeWidth={2.5}
                                  style={{ color: BRAND_GREEN }}
                                />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ════ RIGHT COLUMN — Desktop Summary Card ════ */}
          <div className="hidden md:block">
            <div className="sticky top-12">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="rounded-3xl p-6"
                style={{
                  border: `1px solid ${BORDER}`,
                  backgroundColor: "white",
                  boxShadow:
                    "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
                }}
              >
                <motion.h3
                  variants={fadeUp}
                  className="font-semibold mb-6"
                  style={{
                    fontSize: 16,
                    letterSpacing: "-0.01em",
                    color: TEXT_PRIMARY,
                  }}
                >
                  Din booking
                </motion.h3>

                {/* Summary rows */}
                <div
                  className="flex flex-col gap-4 mb-6"
                  style={{ minHeight: 140 }}
                >
                  {/* Coach */}
                  <motion.div variants={fadeUp} className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: SUBTLE_BG }}
                    >
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: 11,
                          color: TEXT_PRIMARY,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        AK
                      </span>
                    </div>
                    <div>
                      <p
                        className="font-medium"
                        style={{ fontSize: 14, color: TEXT_PRIMARY }}
                      >
                        Anders Kristiansen
                      </p>
                      <p style={{ fontSize: 12, color: TEXT_SECONDARY }}>
                        Head Coach
                      </p>
                    </div>
                  </motion.div>

                  {/* Divider */}
                  <div style={{ height: 1, backgroundColor: BORDER }} />

                  {/* Date */}
                  <motion.div
                    variants={fadeUp}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: selectedDate
                          ? BRAND_GREEN_10
                          : SUBTLE_BG,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 14,
                          fontVariantNumeric: "tabular-nums",
                          fontWeight: 600,
                          color: selectedDate ? BRAND_GREEN : DISABLED,
                        }}
                      >
                        {selectedDate ? selectedDate.date : "--"}
                      </span>
                    </div>
                    <div>
                      {selectedDate ? (
                        <>
                          <p
                            className="font-medium"
                            style={{ fontSize: 14, color: TEXT_PRIMARY }}
                          >
                            {SHORT_DAYS[
                              new Date(
                                selectedDate.year,
                                selectedDate.month,
                                selectedDate.date
                              ).getDay()
                            ]}{" "}
                            {selectedDate.date}.{" "}
                            {MONTH_NAMES[selectedDate.month]
                              .toLowerCase()
                              .slice(0, 3)}
                          </p>
                          <p style={{ fontSize: 12, color: TEXT_SECONDARY }}>
                            {MONTH_NAMES[selectedDate.month]} {selectedDate.year}
                          </p>
                        </>
                      ) : (
                        <p
                          style={{ fontSize: 14, color: DISABLED }}
                        >
                          Velg en dato
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Time */}
                  <motion.div
                    variants={fadeUp}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        backgroundColor: selectedTime
                          ? BRAND_GREEN_10
                          : SUBTLE_BG,
                      }}
                    >
                      <Clock
                        size={16}
                        strokeWidth={1.8}
                        style={{ color: selectedTime ? BRAND_GREEN : DISABLED }}
                      />
                    </div>
                    <div>
                      {selectedTime ? (
                        <>
                          <p
                            className="font-medium"
                            style={{
                              fontSize: 14,
                              color: TEXT_PRIMARY,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {selectedTime}
                          </p>
                          <p style={{ fontSize: 12, color: TEXT_SECONDARY }}>
                            {activeService?.duration}
                          </p>
                        </>
                      ) : (
                        <p
                          style={{ fontSize: 14, color: DISABLED }}
                        >
                          Velg en tid
                        </p>
                      )}
                    </div>
                  </motion.div>

                  {/* Service */}
                  <AnimatePresence>
                    {selectedTime && activeService && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div
                          style={{ height: 1, backgroundColor: BORDER }}
                          className="mb-4"
                        />
                        <div className="flex items-center justify-between">
                          <p
                            className="font-medium"
                            style={{ fontSize: 14, color: TEXT_PRIMARY }}
                          >
                            {activeService.name}
                          </p>
                          <p
                            className="font-semibold"
                            style={{
                              fontSize: 15,
                              color: TEXT_PRIMARY,
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {activeService.price} kr
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Desktop CTA */}
                <motion.button
                  variants={fadeUp}
                  disabled={!canBook}
                  whileTap={canBook ? { scale: 0.98 } : undefined}
                  className="w-full rounded-full py-3.5 font-semibold transition-all duration-300"
                  style={{
                    fontSize: 15,
                    letterSpacing: "-0.01em",
                    backgroundColor: canBook ? BRAND_GREEN : SUBTLE_BG,
                    color: canBook ? "#FFFFFF" : DISABLED,
                    border: canBook ? "none" : `1px solid ${BORDER}`,
                    cursor: canBook ? "pointer" : "default",
                  }}
                >
                  {canBook ? "Book okt" : "Velg dato og tid"}
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ════ MOBILE STICKY CTA ════ */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <AnimatePresence>
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="show"
            className="px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
            style={{
              backgroundColor: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              borderTop: `0.5px solid ${BORDER}`,
            }}
          >
            <motion.button
              disabled={!canBook}
              whileTap={canBook ? { scale: 0.97 } : undefined}
              className="w-full rounded-full py-3.5 font-semibold transition-all duration-300"
              style={{
                fontSize: 15,
                letterSpacing: "-0.01em",
                backgroundColor: canBook ? BRAND_GREEN : SUBTLE_BG,
                color: canBook ? "#FFFFFF" : DISABLED,
                border: canBook ? "none" : `1px solid ${BORDER}`,
                cursor: canBook ? "pointer" : "default",
              }}
              layout
            >
              <motion.span
                key={ctaLabel}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {ctaLabel}
              </motion.span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Hide scrollbar for time pills on WebKit */}
      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
