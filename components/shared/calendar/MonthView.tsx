"use client";

import { useMemo } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { WEEKDAYS_NO, CATEGORY_COLORS } from "./calendar-types";
import type { CalendarEvent } from "./calendar-types";

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date | null;
  events: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
  onEventClick?: (event: CalendarEvent) => void;
}

const MAX_VISIBLE_EVENTS = 2;

function getEventColor(event: CalendarEvent): string {
  if (event.color) return event.color;
  if (event.category) return CATEGORY_COLORS[event.category] ?? "#005840";
  return "#005840";
}

export function MonthView({
  currentDate,
  selectedDate,
  events,
  onDateSelect,
  onEventClick,
}: MonthViewProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentDate]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const key = format(event.startTime, "yyyy-MM-dd");
      const existing = map.get(key) ?? [];
      existing.push(event);
      map.set(key, existing);
    }
    return map;
  }, [events]);

  return (
    <div className="w-full">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS_NO.map((day) => (
          <div
            key={day}
            className="text-center py-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#9C9990",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
          const dayKey = format(day, "yyyy-MM-dd");
          const dayEvents = eventsByDay.get(dayKey) ?? [];
          const visibleEvents = dayEvents.slice(0, MAX_VISIBLE_EVENTS);
          const hiddenCount = dayEvents.length - MAX_VISIBLE_EVENTS;

          return (
            <button
              key={dayKey}
              type="button"
              onClick={() => onDateSelect?.(day)}
              className={cn(
                "relative flex flex-col items-center p-1.5 min-h-[84px] transition-colors duration-120",
                "border-t border-[#EFEDE6]",
                "hover:bg-[rgba(0,88,64,0.04)]"
              )}
              style={{
                backgroundColor: isSelected
                  ? "rgba(0,88,64,0.08)"
                  : undefined,
                borderRadius: isSelected ? "12px" : undefined,
              }}
            >
              {/* Day number */}
              <span
                className="relative flex flex-col items-center"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: isCurrentMonth ? "#0A1F18" : "#C4C0B8",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {format(day, "d")}
                {/* Today indicator */}
                {isToday(day) && (
                  <span
                    className="absolute -bottom-1 w-[5px] h-[5px] rounded-full"
                    style={{ backgroundColor: "#D1F843" }}
                  />
                )}
              </span>

              {/* Event pills */}
              <div className="mt-2 w-full flex flex-col gap-0.5 px-0.5">
                {visibleEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                    className="w-full truncate text-left rounded-full px-1.5 py-px transition-opacity hover:opacity-80"
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      backgroundColor: getEventColor(event),
                      color:
                        event.category === "training"
                          ? "#0A1F18"
                          : "#FFFFFF",
                    }}
                    title={`${format(event.startTime, "HH:mm", { locale: nb })} ${event.title}`}
                  >
                    {event.title}
                  </button>
                ))}
                {hiddenCount > 0 && (
                  <span
                    className="text-center"
                    style={{
                      fontSize: "10px",
                      fontFamily: "var(--font-body)",
                      fontWeight: 500,
                      color: "#5E5C57",
                    }}
                  >
                    +{hiddenCount} til
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
