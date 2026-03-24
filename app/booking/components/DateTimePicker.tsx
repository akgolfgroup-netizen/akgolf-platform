"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2, CalendarDays, ArrowRight } from "lucide-react";
import { StepHeader } from "./StepHeader";
import { cn } from "@/lib/portal/utils/cn";

interface Props {
  serviceTypeId: string;
  instructorId: string;
  onSelect: (startTime: string) => void;
}

const DAY_NAMES = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];

function getWeekDates(date: Date): Date[] {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  monday.setHours(0, 0, 0, 0);

  const week: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

function formatWeekRange(weekStart: Date): string {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekNumber = getWeekNumber(weekStart);
  const startDay = weekStart.getDate();
  const endDay = weekEnd.getDate();
  const startMonth = weekStart.toLocaleDateString("nb-NO", { month: "short" });
  const endMonth = weekEnd.toLocaleDateString("nb-NO", { month: "short" });
  const year = weekStart.getFullYear();

  if (weekStart.getMonth() === weekEnd.getMonth()) {
    return `Uke ${weekNumber} - ${startDay}. - ${endDay}. ${startMonth} ${year}`;
  }
  return `Uke ${weekNumber} - ${startDay}. ${startMonth} - ${endDay}. ${endMonth} ${year}`;
}

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

type TimeFilter = "all" | "morning" | "afternoon" | "evening";

const TIME_FILTERS: { value: TimeFilter; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "morning", label: "Morgen" },
  { value: "afternoon", label: "Ettermiddag" },
  { value: "evening", label: "Kveld" },
];

function filterSlotsByTime(slots: string[], filter: TimeFilter): string[] {
  if (filter === "all") return slots;

  return slots.filter((slot) => {
    const hour = new Date(slot).getHours();
    switch (filter) {
      case "morning":
        return hour >= 6 && hour < 12;
      case "afternoon":
        return hour >= 12 && hour < 17;
      case "evening":
        return hour >= 17 && hour < 22;
      default:
        return true;
    }
  });
}

export function DateTimePicker({ serviceTypeId, instructorId, onSelect }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const week = getWeekDates(today);
    return week[0];
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsPerDay, setSlotsPerDay] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [loadingWeek, setLoadingWeek] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  const weekDates = getWeekDates(currentWeekStart);

  // Fetch slots count for each day in the week
  const fetchWeekSlots = useCallback(async () => {
    setLoadingWeek(true);
    const counts: Record<string, number> = {};

    try {
      await Promise.all(
        weekDates.map(async (date) => {
          const dateKey = formatDateKey(date);
          if (date < today) {
            counts[dateKey] = 0;
            return;
          }

          try {
            const params = new URLSearchParams({
              serviceTypeId,
              instructorId,
              date: dateKey,
            });
            const res = await fetch(`/api/portal/public/slots?${params}`);
            if (res.ok) {
              const data = await res.json();
              counts[dateKey] = Array.isArray(data) ? data.length : 0;
            } else {
              counts[dateKey] = 0;
            }
          } catch {
            counts[dateKey] = 0;
          }
        })
      );
      setSlotsPerDay(counts);
    } finally {
      setLoadingWeek(false);
    }
  }, [serviceTypeId, instructorId, weekDates, today]);

  useEffect(() => {
    fetchWeekSlots();
  }, [currentWeekStart, serviceTypeId, instructorId]);

  // Fetch slots for selected day
  const fetchDaySlots = useCallback(async (dateKey: string) => {
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
        setSlots(Array.isArray(data) ? data : []);
      }
    } catch {
      console.error("Failed to fetch slots");
    } finally {
      setLoading(false);
    }
  }, [serviceTypeId, instructorId]);

  useEffect(() => {
    if (selectedDate) {
      fetchDaySlots(selectedDate);
      setSelectedTime(null);
      setTimeFilter("all");
    }
  }, [selectedDate, fetchDaySlots]);

  function navigateWeek(direction: -1 | 1) {
    setCurrentWeekStart((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(newDate.getDate() + direction * 7);
      return newDate;
    });
    setSelectedDate(null);
    setSelectedTime(null);
    setSlots([]);
  }

  const canGoPrev = currentWeekStart > today;

  function handleDaySelect(date: Date) {
    if (date < today) return;
    const dateKey = formatDateKey(date);
    if (slotsPerDay[dateKey] === 0) return;
    setSelectedDate(dateKey);
  }

  function handleTimeSelect(slot: string) {
    setSelectedTime(slot);
  }

  function handleContinue() {
    if (selectedTime) {
      onSelect(selectedTime);
    }
  }

  const filteredSlots = filterSlotsByTime(slots, timeFilter);

  return (
    <div>
      <StepHeader
        eyebrow="Steg 3"
        heading="Velg dato og tid"
        description="Velg nar du oensker a trene"
      />

      {/* Week Navigator */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => navigateWeek(-1)}
          disabled={!canGoPrev}
          className="w-9 h-9 border border-ink-10 rounded-lg bg-white flex items-center justify-center hover:bg-ink-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} className="text-ink-70" />
        </button>
        <span className="font-semibold text-ink-90">
          {formatWeekRange(currentWeekStart)}
        </span>
        <button
          onClick={() => navigateWeek(1)}
          className="w-9 h-9 border border-ink-10 rounded-lg bg-white flex items-center justify-center hover:bg-ink-5 transition-colors"
        >
          <ChevronRight size={18} className="text-ink-70" />
        </button>
      </div>

      {/* Day Selector */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {weekDates.map((date, i) => {
          const dateKey = formatDateKey(date);
          const isPast = date < today;
          const isSelected = selectedDate === dateKey;
          const slotCount = slotsPerDay[dateKey] ?? 0;
          const isFull = !isPast && slotCount === 0;

          return (
            <button
              key={dateKey}
              onClick={() => handleDaySelect(date)}
              disabled={isPast || isFull}
              className={cn(
                "border-2 rounded-xl p-3 text-center transition-all",
                isPast && "opacity-40 cursor-not-allowed border-ink-10",
                isFull && !isPast && "opacity-40 cursor-not-allowed border-ink-10",
                !isPast && !isFull && !isSelected && "border-ink-10 hover:border-ink-30 cursor-pointer",
                isSelected && "border-ink-90 bg-ink-90 text-white"
              )}
            >
              <div className={cn(
                "text-[11px] uppercase tracking-wide mb-1",
                isSelected ? "text-white/70" : "text-ink-50"
              )}>
                {DAY_NAMES[i]}
              </div>
              <div className={cn(
                "text-lg font-semibold",
                isSelected ? "text-white" : "text-ink-90"
              )}>
                {date.getDate()}
              </div>
              <div className={cn(
                "text-[11px] mt-1",
                isSelected ? "text-white/70" : "text-ink-50"
              )}>
                {isPast ? "" : isFull ? "Fullt" : `${slotCount} ledige`}
              </div>
            </button>
          );
        })}
      </div>

      {/* Time Slots */}
      <AnimatePresence mode="wait">
        {!selectedDate ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-ink-5 rounded-xl p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-gold" />
            </div>
            <h4 className="font-medium text-ink-90 mb-2">Velg en dato</h4>
            <p className="text-sm text-ink-50">
              Klikk pa en dato ovenfor for a se ledige tider
            </p>
          </motion.div>
        ) : loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-ink-5 rounded-xl p-8 flex items-center justify-center"
          >
            <Loader2 size={32} className="animate-spin text-gold" />
          </motion.div>
        ) : slots.length === 0 ? (
          <motion.div
            key="no-slots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-ink-5 rounded-xl p-8 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-ink-10 flex items-center justify-center mx-auto mb-4">
              <CalendarDays size={28} className="text-ink-50" />
            </div>
            <h4 className="font-medium text-ink-90 mb-2">Ingen ledige tider</h4>
            <p className="text-sm text-ink-50">
              Prov en annen dato eller kontakt oss for assistanse
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="slots"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Time slots header */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <span className="text-sm font-semibold text-ink-90">
                Tilgjengelige tider -{" "}
                {new Date(selectedDate).toLocaleDateString("nb-NO", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
              <div className="flex gap-1">
                {TIME_FILTERS.map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => setTimeFilter(filter.value)}
                    className={cn(
                      "px-3 py-1.5 rounded text-xs font-medium transition-colors",
                      timeFilter === filter.value
                        ? "bg-ink-90 text-white"
                        : "bg-ink-5 text-ink-70 hover:bg-ink-10"
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-4 gap-2">
              {filteredSlots.map((slot) => {
                const time = new Date(slot);
                const timeStr = time.toLocaleTimeString("nb-NO", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const isSelected = selectedTime === slot;

                return (
                  <button
                    key={slot}
                    onClick={() => handleTimeSelect(slot)}
                    className={cn(
                      "py-3 px-2 border-2 rounded-lg text-sm font-semibold text-center transition-all",
                      isSelected
                        ? "border-ink-90 bg-ink-90 text-white"
                        : "border-ink-10 text-ink-90 hover:border-ink-30"
                    )}
                  >
                    {timeStr}
                  </button>
                );
              })}
            </div>

            {filteredSlots.length === 0 && (
              <p className="text-center text-sm text-ink-50 py-4">
                Ingen tider i valgt tidsrom. Prov et annet filter.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-end mt-8 pt-6 border-t border-ink-10">
        <button
          onClick={handleContinue}
          disabled={!selectedTime}
          className="w-btn w-btn-gold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Fortsett
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
