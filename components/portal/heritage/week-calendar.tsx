"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  format,
  addWeeks,
  subWeeks,
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
} from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  duration: number;
  type: "coaching" | "training" | "tournament" | "booking";
  color?: string;
}

interface WeekCalendarProps {
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onAddClick?: (date: Date) => void;
}

const typeColors = {
  coaching: {
    bg: "bg-[var(--color-success)]/15",
    border: "border-[var(--color-success)]",
    text: "text-[var(--color-success-text)]",
  },
  training: {
    bg: "bg-[var(--color-primary)]/15",
    border: "border-[var(--color-primary)]",
    text: "text-[var(--color-primary)]",
  },
  tournament: {
    bg: "bg-[var(--color-warning)]/15",
    border: "border-[var(--color-warning)]",
    text: "text-[var(--color-warning-text)]",
  },
  booking: {
    bg: "bg-[var(--color-ai)]/15",
    border: "border-[var(--color-ai)]",
    text: "text-[var(--color-ai-text)]",
  },
};

const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00

export function WeekCalendar({
  events,
  onEventClick,
  onAddClick,
}: WeekCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEventsForDay = (date: Date) => {
    return events.filter((event) =>
      isSameDay(new Date(event.startTime), date)
    );
  };

  const formatTime = (date: Date) => {
    return format(date, "HH:mm");
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-grey-200)]/70 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-grey-200)]/70">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">
              Uke {format(weekStart, "w", { locale: nb })}
            </h2>
            <span className="text-sm text-[var(--color-grey-500)]">
              {format(weekStart, "d.", { locale: nb })} -{" "}
              {format(addDays(weekStart, 6), "d. MMMM yyyy", { locale: nb })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--color-grey-500)]" />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-[var(--color-primary)] bg-[var(--color-primary-soft)] rounded-lg hover:bg-[var(--color-accent-cta)]/25 transition-colors"
            >
              I dag
            </button>
            <button
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[var(--color-grey-500)]" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mt-4">
          {weekDays.map((day, i) => {
            const dayName = format(day, "EEE", { locale: nb }).slice(0, 3);
            const isTodayDate = isToday(day);

            return (
              <div
                key={i}
                className={cn(
                  "text-center py-2 px-1 rounded-lg",
                  isTodayDate && "bg-[var(--color-accent-cta)]/25"
                )}
              >
                <p
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    isTodayDate ? "text-[var(--color-primary)] font-semibold" : "text-[var(--color-grey-400)]"
                  )}
                >
                  {dayName}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-0.5",
                    isTodayDate ? "text-[var(--color-primary)]" : "text-[var(--color-grey-900)]"
                  )}
                >
                  {format(day, "d")}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-b border-[var(--color-grey-200)]/50 flex flex-wrap gap-4 text-xs">
        {[
          { label: "Coaching", color: "bg-[var(--color-success)]" },
          { label: "Trening", color: "bg-[var(--color-primary)]" },
          { label: "Turnering", color: "bg-[var(--color-warning)]" },
          { label: "Booking", color: "bg-[var(--color-ai)]" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-sm", item.color)} />
            <span className="text-[var(--color-grey-500)]">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Mobile: Day view */}
      <div className="lg:hidden">
        {weekDays.map((day, dayIndex) => {
          const dayEvents = getEventsForDay(day);
          const isTodayDate = isToday(day);

          return (
            <motion.div
              key={dayIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dayIndex * 0.05 }}
              className={cn(
                "border-b border-[var(--color-grey-200)]/50 last:border-b-0 p-3",
                isTodayDate && "bg-[var(--color-accent-cta)]/10"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isTodayDate ? "text-[var(--color-primary)]" : "text-[var(--color-grey-900)]"
                    )}
                  >
                    {format(day, "EEEE d.", { locale: nb })}
                  </span>
                  {isTodayDate && (
                    <span className="text-[10px] font-semibold text-[var(--color-primary)] bg-[var(--color-accent-cta)]/40 px-2 py-0.5 rounded-full">
                      I dag
                    </span>
                  )}
                </div>
                {onAddClick && (
                  <button
                    onClick={() => onAddClick(day)}
                    className="p-1.5 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-primary)] hover:bg-[var(--color-grey-100)] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {dayEvents.length === 0 ? (
                <p className="text-sm text-[var(--color-grey-400)] py-2">Ingen hendelser</p>
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((event) => {
                    const colors = typeColors[event.type];
                    return (
                      <button
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-l-4 transition-all",
                          colors.bg,
                          colors.border,
                          "hover:shadow-sm"
                        )}
                      >
                        <p className={cn("font-medium text-sm", colors.text)}>
                          {event.title}
                        </p>
                        <p className="text-xs text-[var(--color-grey-500)] mt-0.5">
                          {formatTime(new Date(event.startTime))} ·{" "}
                          {event.duration} min
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Desktop: Week grid */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 divide-x divide-[var(--color-grey-200)]/50">
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={dayIndex}
                className={cn(
                  "min-h-[300px] p-2",
                  isTodayDate && "bg-[var(--color-accent-cta)]/10"
                )}
              >
                <div className="space-y-2">
                  {dayEvents.map((event) => {
                    const colors = typeColors[event.type];
                    return (
                      <motion.button
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => onEventClick?.(event)}
                        className={cn(
                          "w-full text-left p-2.5 rounded-xl border-l-3 transition-all",
                          colors.bg,
                          colors.border,
                          "hover:shadow-sm hover:scale-[1.02]"
                        )}
                      >
                        <p
                          className={cn(
                            "font-medium text-xs leading-tight",
                            colors.text
                          )}
                        >
                          {event.title}
                        </p>
                        <p className="text-[10px] text-[var(--color-grey-500)] mt-1">
                          {formatTime(new Date(event.startTime))}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {onAddClick && (
                  <button
                    onClick={() => onAddClick(day)}
                    className="w-full mt-2 p-2 rounded-lg border border-dashed border-[var(--color-grey-200)] text-[var(--color-grey-400)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-grey-100)] transition-all text-xs flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Legg til
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
