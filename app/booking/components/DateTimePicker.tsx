"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CalendarDays } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { cn } from "@/lib/portal/utils/cn";

interface Props {
  serviceTypeId: string;
  instructorId: string;
  onSelect: (startTime: string) => void;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const MONTH_NAMES = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember",
];

export function DateTimePicker({ serviceTypeId, instructorId, onSelect }: Props) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const fetchSlots = useCallback(async (dateKey: string) => {
    setLoading(true);
    setSlots([]);
    try {
      const params = new URLSearchParams({
        serviceTypeId,
        instructorId,
        date: dateKey,
      });
      const res = await fetch(`/api/portal/public/slots?${params}`);
      if (res.ok) {
        const data = await res.json();
        setSlots(data);
      }
    } catch (err) {
      console.error("Failed to fetch slots:", err);
    } finally {
      setLoading(false);
    }
  }, [serviceTypeId, instructorId]);

  useEffect(() => {
    if (selectedDate) {
      fetchSlots(selectedDate);
      setSelectedTime(null);
    }
  }, [selectedDate, fetchSlots]);

  const firstDay = new Date(viewMonth.year, viewMonth.month, 1);
  const lastDay = new Date(viewMonth.year, viewMonth.month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startWeekday; i++) calendarDays.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) calendarDays.push(d);

  const canGoPrev =
    viewMonth.year > today.getFullYear() ||
    (viewMonth.year === today.getFullYear() && viewMonth.month > today.getMonth());

  function navigateMonth(dir: -1 | 1) {
    setViewMonth((prev) => {
      let m = prev.month + dir;
      let y = prev.year;
      if (m < 0) { m = 11; y--; }
      if (m > 11) { m = 0; y++; }
      return { year: y, month: m };
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
  }

  function handleTimeSelect(slot: string) {
    setSelectedTime(slot);
    onSelect(slot);
  }

  return (
    <div>
      <StepHeader
        eyebrow="Steg 3"
        heading="Velg dato og tid"
        description="Når passer det for deg?"
      />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Calendar - takes 3 columns */}
        <div className="lg:col-span-3 w-card">
          {/* Header with month navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              disabled={!canGoPrev}
              className="p-2 rounded-xl hover:bg-navy/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} className="text-navy" />
            </button>
            <h3 className="font-semibold text-lg text-navy">
              {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-xl hover:bg-navy/5 transition-all"
            >
              <ChevronRight size={20} className="text-navy" />
            </button>
          </div>

          {/* Day names header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-xs font-semibold text-ink-40 text-center py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} className="aspect-square" />;
              }

              const date = new Date(viewMonth.year, viewMonth.month, day);
              const dateKey = formatDateKey(date);
              const isPast = date < today;
              const isSelected = selectedDate === dateKey;
              const isToday = date.getTime() === today.getTime();

              return (
                <motion.button
                  key={dateKey}
                  whileHover={!isPast ? { scale: 1.05 } : {}}
                  whileTap={!isPast ? { scale: 0.95 } : {}}
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateKey)}
                  className={cn(
                    "relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all",
                    isPast && "text-ink-20 cursor-not-allowed",
                    !isPast && !isSelected && "hover:bg-gold/10 text-ink-80 cursor-pointer",
                    isSelected && "bg-gold text-white shadow-lg shadow-gold/30",
                    isToday && !isSelected && "ring-2 ring-gold ring-offset-2 text-gold font-bold"
                  )}
                >
                  {day}
                  {/* Availability indicator dot */}
                  {!isPast && !isSelected && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-gold/40" />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-ink-10">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-xs text-ink-40">Ledig</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-ink-20" />
              <span className="text-xs text-ink-40">Opptatt</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full ring-2 ring-gold" />
              <span className="text-xs text-ink-40">I dag</span>
            </div>
          </div>
        </div>

        {/* Time slots - takes 2 columns */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selectedDate ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-card min-h-[300px] flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-4">
                  <CalendarDays size={28} className="text-gold" />
                </div>
                <h4 className="font-medium text-ink-90 mb-2">Velg en dato</h4>
                <p className="text-sm text-ink-50">
                  Klikk på en dato i kalenderen for å se ledige tider
                </p>
              </motion.div>
            ) : loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-card min-h-[300px] flex items-center justify-center"
              >
                <Loader2 size={32} className="animate-spin text-gold" />
              </motion.div>
            ) : slots.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-card min-h-[300px] flex flex-col items-center justify-center text-center p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-ink-10 flex items-center justify-center mb-4">
                  <CalendarDays size={28} className="text-ink-40" />
                </div>
                <h4 className="font-medium text-ink-90 mb-2">Ingen ledige tider</h4>
                <p className="text-sm text-ink-50">
                  Prøv en annen dato eller kontakt oss for assistanse
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-card"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-navy">
                    {new Date(selectedDate).toLocaleDateString("nb-NO", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h4>
                  <span className="text-sm text-gold font-medium">
                    {slots.length} ledige
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-1">
                  {slots.map((slot, i) => {
                    const time = new Date(slot);
                    const timeStr = time.toLocaleTimeString("nb-NO", {
                      hour: "2-digit",
                      minute: "2-digit",
                    });
                    const isSelected = selectedTime === slot;

                    return (
                      <motion.button
                        key={slot}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03, duration: 0.2 }}
                        onClick={() => handleTimeSelect(slot)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-sm font-medium transition-all",
                          isSelected
                            ? "bg-gold text-white shadow-lg shadow-gold/30"
                            : "bg-ink-5 text-ink-80 hover:bg-gold/10 hover:text-gold border border-ink-10 hover:border-gold/30"
                        )}
                      >
                        {timeStr}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
