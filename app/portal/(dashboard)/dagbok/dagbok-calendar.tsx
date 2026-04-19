"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  Target,
  X,
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
import { motion, AnimatePresence } from "framer-motion";
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
  const logByDate = new Map<string, TrainingLogEntry[]>();
  for (const log of logs) {
    const key = format(new Date(log.date), "yyyy-MM-dd");
    const arr = logByDate.get(key) ?? [];
    arr.push(log);
    logByDate.set(key, arr);
  }

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  return eachDayOfInterval({ start: calStart, end: calEnd }).map((d) => {
    const key = format(d, "yyyy-MM-dd");
    return {
      date: d,
      day: d.getDate(),
      otherMonth: !isSameMonth(d, month),
      hasLog: logByDate.has(key),
      logs: logByDate.get(key) ?? [],
      today: isToday(d),
    };
  });
}

export function DagbokCalendar({ logs, onSelectDate }: DagbokCalendarProps) {
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<{
    date: Date;
    logs: TrainingLogEntry[];
  } | null>(null);

  const calendarDays = useMemo(
    () => buildCalendarDays(calendarMonth, logs),
    [calendarMonth, logs]
  );

  const handleDayClick = (day: { date: Date; hasLog: boolean; logs: TrainingLogEntry[] }) => {
    if (day.hasLog) {
      setSelectedDay({ date: day.date, logs: day.logs });
    } else {
      setSelectedDay(null);
      onSelectDate?.(day.date);
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <PremiumCard>
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[16px] font-semibold text-on-surface capitalize">
            {format(calendarMonth, "MMMM yyyy", { locale: nb })}
          </h3>
          <div className="flex gap-1 p-1 rounded-full bg-white border border-outline-variant shadow-sm">
            <button
              onClick={() => setCalendarMonth(subMonths(calendarMonth, 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Forrige maned"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCalendarMonth(addMonths(calendarMonth, 1))}
              className="w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors"
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
              className="text-center text-[10px] font-bold uppercase tracking-[0.15em] text-outline py-2"
            >
              {day}
            </div>
          ))}

          {/* Day cells */}
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(day)}
              className={cn(
                "aspect-square flex flex-col items-center justify-center rounded-xl transition-all duration-200",
                day.hasLog ? "cursor-pointer" : "cursor-default",
                day.otherMonth && "opacity-30",
                day.today &&
                  "bg-primary/15 border-2 border-primary",
                day.hasLog &&
                  !day.today &&
                  "bg-primary/8 hover:bg-primary/15",
                !day.today &&
                  !day.hasLog &&
                  "hover:bg-surface-container"
              )}
            >
              <span
                className={cn(
                  "text-[13px] font-medium tabular-nums",
                  day.today
                    ? "text-primary font-semibold"
                    : "text-on-surface"
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

        {/* Selected day details */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden"
            >
              <div className="rounded-xl border border-grey-200/50 bg-grey-50/60 p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-black">
                    {format(selectedDay.date, "d. MMMM yyyy", { locale: nb })}
                  </p>
                  <button
                    onClick={() => setSelectedDay(null)}
                    className="p-1 rounded-lg hover:bg-grey-200/30 transition-colors"
                  >
                    <X className="w-4 h-4 text-grey-400" />
                  </button>
                </div>
                <div className="space-y-3">
                  {selectedDay.logs.map((log) => {
                    const title = log.TrainingPlanSession?.title || log.focusArea || "Treningsøkt";
                    const area = log.focusArea || log.TrainingPlanSession?.focusArea || "Trening";
                    return (
                      <div key={log.id} className="rounded-lg bg-white p-3 border border-grey-200/50">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-black">{title}</p>
                          {log.rating != null && (
                            <span className="flex items-center gap-1 text-xs text-grey-400">
                              <Star className="w-3 h-3" />
                              {log.rating}/10
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex flex-wrap gap-3 text-xs text-grey-400">
                          {log.durationMinutes != null && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {log.durationMinutes} min
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {area}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="mt-2 text-xs text-grey-500 line-clamp-2">{log.notes}</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PremiumCard>
    </motion.div>
  );
}
