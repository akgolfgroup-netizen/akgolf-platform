"use client";

import { useState, useCallback, useMemo } from "react";
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  addYears,
  subYears,
  startOfWeek,
  getISOWeek,
  format,
} from "date-fns";
import { nb } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { YearView } from "./YearView";
import type { CalendarView, CalendarProps } from "./calendar-types";

const VIEW_OPTIONS: { key: CalendarView; label: string }[] = [
  { key: "day", label: "Dag" },
  { key: "week", label: "Uke" },
  { key: "month", label: "Maaned" },
  { key: "year", label: "Aar" },
];

export function AkCalendar({
  events,
  defaultView = "month",
  onEventClick,
  onDateSelect,
  onAddEvent,
  className,
}: CalendarProps) {
  const [view, setView] = useState<CalendarView>(defaultView);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  }, []);

  const navigate = useCallback(
    (direction: -1 | 1) => {
      setCurrentDate((prev) => {
        switch (view) {
          case "day":
            return direction === 1 ? addDays(prev, 1) : subDays(prev, 1);
          case "week":
            return direction === 1 ? addWeeks(prev, 1) : subWeeks(prev, 1);
          case "month":
            return direction === 1 ? addMonths(prev, 1) : subMonths(prev, 1);
          case "year":
            return direction === 1 ? addYears(prev, 1) : subYears(prev, 1);
        }
      });
    },
    [view]
  );

  const handleDateSelect = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      onDateSelect?.(date);
    },
    [onDateSelect]
  );

  const handleYearNavigate = useCallback(
    (date: Date, targetView: CalendarView) => {
      setCurrentDate(date);
      setView(targetView);
    },
    []
  );

  const title = useMemo(() => {
    switch (view) {
      case "day":
        return format(currentDate, "d. MMMM yyyy", { locale: nb });
      case "week": {
        const weekNum = getISOWeek(currentDate);
        const ws = startOfWeek(currentDate, { weekStartsOn: 1 });
        return `Uke ${weekNum}, ${format(ws, "yyyy")}`;
      }
      case "month":
        return format(currentDate, "MMMM yyyy", { locale: nb });
      case "year":
        return format(currentDate, "yyyy");
    }
  }, [view, currentDate]);

  return (
    <div
      className={cn("w-full rounded-[20px] bg-white p-5", className)}
      style={{
        border: "1px solid #E5E3DD",
        boxShadow:
          "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        {/* Left: navigation + title */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-9 h-9 rounded-[12px] transition-colors hover:bg-[rgba(0,88,64,0.06)]"
            style={{ border: "1px solid #EFEDE6" }}
            aria-label="Forrige"
          >
            <ChevronLeft
              size={18}
              strokeWidth={1.75}
              color="#5E5C57"
            />
          </button>
          <button
            type="button"
            onClick={() => navigate(1)}
            className="flex items-center justify-center w-9 h-9 rounded-[12px] transition-colors hover:bg-[rgba(0,88,64,0.06)]"
            style={{ border: "1px solid #EFEDE6" }}
            aria-label="Neste"
          >
            <ChevronRight
              size={18}
              strokeWidth={1.75}
              color="#5E5C57"
            />
          </button>

          <h2
            className="ml-2 capitalize"
            style={{
              fontFamily: "var(--font-headline)",
              fontSize: "20px",
              fontWeight: 700,
              color: "#0A1F18",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h2>
        </div>

        {/* Right: today button + view switcher */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goToToday}
            className="px-3.5 py-1.5 rounded-[12px] transition-colors hover:bg-[rgba(0,88,64,0.06)]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "13px",
              fontWeight: 600,
              color: "#005840",
              border: "1px solid #E5E3DD",
            }}
          >
            I dag
          </button>

          {/* View switcher pills */}
          <div
            className="flex rounded-[12px] p-0.5"
            style={{ backgroundColor: "#EFEDE6" }}
          >
            {VIEW_OPTIONS.map((opt) => {
              const isActive = view === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setView(opt.key)}
                  className="px-3 py-1.5 rounded-[10px] transition-all"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor: isActive ? "#D1F843" : "transparent",
                    color: isActive ? "#0A1F18" : "#5E5C57",
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* View content */}
      {view === "month" && (
        <MonthView
          currentDate={currentDate}
          selectedDate={selectedDate}
          events={events}
          onDateSelect={handleDateSelect}
          onEventClick={onEventClick}
        />
      )}
      {view === "week" && (
        <WeekView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onAddEvent={onAddEvent}
          onDateSelect={(date) => {
            handleDateSelect(date);
            setCurrentDate(date);
            setView("day");
          }}
        />
      )}
      {view === "day" && (
        <DayView
          currentDate={currentDate}
          events={events}
          onEventClick={onEventClick}
          onAddEvent={onAddEvent}
        />
      )}
      {view === "year" && (
        <YearView
          currentDate={currentDate}
          events={events}
          onNavigate={handleYearNavigate}
        />
      )}
    </div>
  );
}
