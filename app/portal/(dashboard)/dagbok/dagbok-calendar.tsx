"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  subMonths,
  addMonths,
} from "date-fns";
import { nb } from "date-fns/locale";
import { motion } from "framer-motion";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { fadeInUp } from "@/components/portal/premium";
import { cn } from "@/lib/portal/utils/cn";

interface TrainingLogEntry {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  deviatedFromPlan: boolean;
  deviationReason: string | null;
  planSessionId: string | null;
  TrainingPlanSession: {
    id: string;
    title: string;
    focusArea: string | null;
    durationMinutes: number | null;
  } | null;
}

interface DagbokCalendarProps {
  logs: TrainingLogEntry[];
  onSelectDate?: (date: Date) => void;
}

const WEEK_DAYS = ["M", "T", "O", "T", "F", "L", "S"];

function buildCalendarDays(month: Date, logs: TrainingLogEntry[]) {
  const logDates = new Set(
    logs.map((l) => format(new Date(l.date), "yyyy-MM-dd"))
  );

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calStart, end: calEnd }).map((d) => ({
    date: d,
    day: d.getDate(),
    otherMonth: !isSameMonth(d, month),
    hasLog: logDates.has(format(d, "yyyy-MM-dd")),
    today: isToday(d),
  }));
}

export function DagbokCalendar({ logs, onSelectDate }: DagbokCalendarProps) {
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth, logs),
    [calendarMonth, logs]
  );

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <PremiumCard>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-semibold text-portal-text capitalize">
            {format(calendarMonth, "MMMM yyyy", { locale: nb })}
          </h3>
          <div className="flex gap-1 p-1 rounded-full bg-white border border-portal-border shadow-sm">
            <button
              onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-portal-muted hover:text-portal-text hover:bg-portal-hover transition-colors"
              aria-label="Forrige maned"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-portal-muted hover:text-portal-text hover:bg-portal-hover transition-colors"
              aria-label="Neste maned"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={`${day}-${i}`}
              className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-portal-muted py-2"
            >
              {day}
            </div>
          ))}

          {/* Day cells */}
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                if (day.hasLog && onSelectDate) {
                  onSelectDate(day.date);
                }
              }}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-200",
                day.hasLog ? "cursor-pointer" : "cursor-default",
                day.otherMonth && "opacity-30",
                day.today &&
                  "bg-primary/15 border-2 border-primary",
                day.hasLog &&
                  !day.today &&
                  "bg-primary/8",
                !day.today &&
                  !day.hasLog &&
                  "hover:bg-portal-hover"
              )}
            >
              <span
                className={cn(
                  "text-[13px] font-medium tabular-nums",
                  day.today
                    ? "text-primary font-semibold"
                    : "text-portal-text"
                )}
              >
                {day.day}
              </span>
              {day.hasLog && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5 bg-primary"
                />
              )}
            </button>
          ))}
        </div>
      </PremiumCard>
    </motion.div>
  );
}
