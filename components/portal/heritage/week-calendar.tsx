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
  coaching: { bg: "bg-[#22c55e]/15", border: "border-[#22c55e]", text: "text-[#15803d]" },
  training: { bg: "bg-[#3b82f6]/15", border: "border-[#3b82f6]", text: "text-[#1d4ed8]" },
  tournament: { bg: "bg-[#f59e0b]/15", border: "border-[#f59e0b]", text: "text-[#b45309]" },
  booking: { bg: "bg-[#8b5cf6]/15", border: "border-[#8b5cf6]", text: "text-[#6d28d9]" },
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
    <div className="bg-white rounded-2xl border border-[#c2c9bb]/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[#c2c9bb]/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#1c1c16]">
              Uke {format(weekStart, "w", { locale: nb })}
            </h2>
            <span className="text-sm text-[#6b7366]">
              {format(weekStart, "d.", { locale: nb })} -{" "}
              {format(addDays(weekStart, 6), "d. MMMM yyyy", { locale: nb })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
              className="p-2 rounded-lg hover:bg-[#f7f3ea] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#6b7366]" />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-3 py-1.5 text-sm font-medium text-[#154212] bg-[#e8f0e5] rounded-lg hover:bg-[#d2f000]/20 transition-colors"
            >
              I dag
            </button>
            <button
              onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
              className="p-2 rounded-lg hover:bg-[#f7f3ea] transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-[#6b7366]" />
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
                  isTodayDate && "bg-[#d2f000]/20"
                )}
              >
                <p
                  className={cn(
                    "text-xs uppercase tracking-wider",
                    isTodayDate ? "text-[#154212] font-semibold" : "text-[#8a9385]"
                  )}
                >
                  {dayName}
                </p>
                <p
                  className={cn(
                    "text-lg font-semibold mt-0.5",
                    isTodayDate ? "text-[#154212]" : "text-[#1c1c16]"
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
      <div className="px-4 py-2 border-b border-[#c2c9bb]/30 flex flex-wrap gap-4 text-xs">
        {[
          { label: "Coaching", color: "bg-[#22c55e]" },
          { label: "Trening", color: "bg-[#3b82f6]" },
          { label: "Turnering", color: "bg-[#f59e0b]" },
          { label: "Booking", color: "bg-[#8b5cf6]" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-sm", item.color)} />
            <span className="text-[#6b7366]">{item.label}</span>
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
                "border-b border-[#c2c9bb]/30 last:border-b-0 p-3",
                isTodayDate && "bg-[#d2f000]/5"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isTodayDate ? "text-[#154212]" : "text-[#1c1c16]"
                    )}
                  >
                    {format(day, "EEEE d.", { locale: nb })}
                  </span>
                  {isTodayDate && (
                    <span className="text-[10px] font-semibold text-[#154212] bg-[#d2f000]/30 px-2 py-0.5 rounded-full">
                      I dag
                    </span>
                  )}
                </div>
                {onAddClick && (
                  <button
                    onClick={() => onAddClick(day)}
                    className="p-1.5 rounded-lg text-[#8a9385] hover:text-[#154212] hover:bg-[#f7f3ea] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                )}
              </div>

              {dayEvents.length === 0 ? (
                <p className="text-sm text-[#8a9385] py-2">Ingen hendelser</p>
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
                        <p className="text-xs text-[#6b7366] mt-0.5">
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
        <div className="grid grid-cols-7 divide-x divide-[#c2c9bb]/30">
          {weekDays.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDate = isToday(day);

            return (
              <div
                key={dayIndex}
                className={cn(
                  "min-h-[300px] p-2",
                  isTodayDate && "bg-[#d2f000]/5"
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
                        <p className="text-[10px] text-[#6b7366] mt-1">
                          {formatTime(new Date(event.startTime))}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {onAddClick && (
                  <button
                    onClick={() => onAddClick(day)}
                    className="w-full mt-2 p-2 rounded-lg border border-dashed border-[#c2c9bb] text-[#8a9385] hover:text-[#154212] hover:border-[#154212]/30 hover:bg-[#f7f3ea] transition-all text-xs flex items-center justify-center gap-1"
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
