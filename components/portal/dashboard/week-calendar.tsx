"use client";

import { colors } from "@/lib/design-tokens";

interface WeekDay {
  dayLabel: string;
  dateNumber: number;
  trained: boolean;
  hasCoaching: boolean;
  isToday: boolean;
  isRest: boolean;
  completionPercent: number;
}

interface WeekCalendarProps {
  days: WeekDay[];
}

export function WeekCalendar({ days }: WeekCalendarProps) {
  return (
    <div className="rounded-2xl border border-grey-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-center justify-around gap-2 overflow-x-auto px-2">
        {days.map((day, i) => {
          const isActive = day.trained || day.hasCoaching;
          return (
            <div
              key={i}
              className={`flex min-w-[52px] flex-col items-center gap-2 rounded-xl px-2 py-3 transition-colors ${
                day.isToday
                  ? "bg-black text-white"
                  : isActive
                    ? "bg-grey-50 text-black"
                    : "text-grey-400"
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide">
                {day.dayLabel}
              </span>
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  day.isToday
                    ? "bg-accent-cta text-accent-cta-text"
                    : day.hasCoaching
                      ? "bg-primary text-white"
                      : day.trained
                        ? "bg-success text-white"
                        : day.isRest
                          ? "bg-grey-100 text-grey-400"
                          : "bg-transparent text-grey-400"
                }`}
              >
                {day.dateNumber}
              </span>
              {day.isToday ? (
                <span className="text-[9px] font-bold text-accent-cta">I dag</span>
              ) : day.hasCoaching ? (
                <span className="text-[9px] font-bold text-primary">Coach</span>
              ) : day.trained ? (
                <span className="text-[9px] font-bold text-success">Done</span>
              ) : day.isRest ? (
                <span className="text-[9px] font-bold text-grey-400">Hvile</span>
              ) : (
                <span className="text-[9px] font-bold text-grey-300">—</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
