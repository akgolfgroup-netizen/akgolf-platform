"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { StepHeader } from "./StepHeader";

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
    setSlots([]);
  }

  return (
    <div>
      <StepHeader
        eyebrow="Steg 3"
        heading="Velg dato og tid"
        description="Når passer det for deg?"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Calendar */}
        <div className="w-card">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth(-1)}
              disabled={!canGoPrev}
              className="p-1.5 rounded-lg hover:bg-ink-10 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-semibold text-ink-90">
              {MONTH_NAMES[viewMonth.month]} {viewMonth.year}
            </h3>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1.5 rounded-lg hover:bg-ink-10 transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {DAY_NAMES.map((d) => (
              <div key={d} className="text-xs font-medium text-ink-40 py-1">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) {
                return <div key={`empty-${i}`} />;
              }

              const date = new Date(viewMonth.year, viewMonth.month, day);
              const dateKey = formatDateKey(date);
              const isPast = date < today;
              const isSelected = selectedDate === dateKey;
              const isToday = date.getTime() === today.getTime();

              return (
                <button
                  key={dateKey}
                  disabled={isPast}
                  onClick={() => setSelectedDate(dateKey)}
                  className={`
                    relative w-full aspect-square flex items-center justify-center rounded-lg text-sm transition-all
                    ${isPast ? "text-ink-30 cursor-not-allowed" : "hover:bg-gold/10 cursor-pointer"}
                    ${isSelected ? "bg-gold text-white font-semibold" : ""}
                    ${isToday && !isSelected ? "font-semibold text-gold" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div className="w-card min-h-[280px]">
          {!selectedDate ? (
            <div className="flex items-center justify-center h-full text-ink-40 text-sm">
              Velg en dato i kalenderen
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 size={24} className="animate-spin text-gold" />
            </div>
          ) : slots.length === 0 ? (
            <div className="flex items-center justify-center h-full text-ink-40 text-sm">
              Ingen ledige tider denne dagen
            </div>
          ) : (
            <>
              <h4 className="text-sm font-medium text-ink-50 mb-3">
                Ledige tider
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot, i) => {
                  const time = new Date(slot);
                  const timeStr = time.toLocaleTimeString("nb-NO", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  return (
                    <motion.button
                      key={slot}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => onSelect(slot)}
                      className="px-3 py-2.5 rounded-lg border border-ink-20 text-sm font-medium text-ink-80 hover:border-gold hover:bg-gold/5 transition-all"
                    >
                      {timeStr}
                    </motion.button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
