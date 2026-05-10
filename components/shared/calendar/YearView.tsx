"use client";

import { useMemo } from "react";
import {
  startOfYear,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  eachMonthOfInterval,
  isSameMonth,
  format,
  getDay,
} from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarView, CalendarEvent } from "./calendar-types";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onNavigate: (date: Date, view: CalendarView) => void;
}

function getDayOfWeekMon(date: Date): number {
  const d = getDay(date);
  return d === 0 ? 6 : d - 1; // Mon=0, Sun=6
}

export function YearView({ currentDate, events, onNavigate }: YearViewProps) {
  const year = currentDate.getFullYear();

  const months = useMemo(() => {
    const yearStart = startOfYear(currentDate);
    const yearEnd = new Date(year, 11, 31);
    return eachMonthOfInterval({ start: yearStart, end: yearEnd });
  }, [currentDate, year]);

  const eventCountByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const event of events) {
      const key = format(event.startTime, "yyyy-MM-dd");
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [events]);

  const now = new Date();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      {months.map((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
        const isCurrentMonth = isSameMonth(month, now);
        const firstDayOffset = getDayOfWeekMon(monthStart);

        return (
          <button
            key={format(month, "yyyy-MM")}
            type="button"
            onClick={() => onNavigate(month, "month")}
            className="flex flex-col p-4 rounded-[20px] transition-all hover:shadow-[0_1px_2px_rgba(15,31,24,0.06),0_14px_32px_rgba(15,31,24,0.08)]"
            style={{
              backgroundColor: "#FFFFFF",
              border: isCurrentMonth
                ? "2px solid #005840"
                : "1px solid #EFEDE6",
              boxShadow:
                "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
            }}
          >
            {/* Month name */}
            <span
              className="mb-3"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                fontWeight: 700,
                color: isCurrentMonth ? "#005840" : "#0A1F18",
                textTransform: "capitalize",
              }}
            >
              {format(month, "MMMM", { locale: nb })}
            </span>

            {/* Mini day grid */}
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: "repeat(7, 6px)",
              }}
            >
              {/* Offset for first day */}
              {Array.from({ length: firstDayOffset }).map((_, i) => (
                <div key={`empty-${i}`} className="w-[6px] h-[6px]" />
              ))}

              {days.map((day) => {
                const key = format(day, "yyyy-MM-dd");
                const count = eventCountByDay.get(key) ?? 0;

                let dotColor = "#EFEDE6";
                if (count >= 3) dotColor = "#1A7D56";
                else if (count >= 1) dotColor = "#D1F843";

                return (
                  <div
                    key={key}
                    className="w-[6px] h-[6px] rounded-full"
                    style={{ backgroundColor: dotColor }}
                    title={
                      count > 0
                        ? `${format(day, "d. MMM", { locale: nb })}: ${count} hendelse${count > 1 ? "r" : ""}`
                        : undefined
                    }
                  />
                );
              })}
            </div>
          </button>
        );
      })}
    </div>
  );
}
