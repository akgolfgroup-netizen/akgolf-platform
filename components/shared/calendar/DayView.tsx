"use client";

import { useMemo } from "react";
import {
  isSameDay,
  getHours,
  getMinutes,
  differenceInMinutes,
  setHours,
  setMinutes,
  format,
} from "date-fns";
import { nb } from "date-fns/locale";
import { HOURS, CATEGORY_COLORS } from "./calendar-types";
import type { CalendarEvent } from "./calendar-types";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
}

const HOUR_HEIGHT = 64; // px per hour
const START_HOUR = 8;
const END_HOUR = 20;

function getEventColor(event: CalendarEvent): string {
  if (event.color) return event.color;
  if (event.category) return CATEGORY_COLORS[event.category] ?? "#005840";
  return "#005840";
}

function getEventTextColor(event: CalendarEvent): string {
  if (event.category === "training") return "#0A1F18";
  return "#FFFFFF";
}

function clampHour(h: number): number {
  return Math.max(START_HOUR, Math.min(END_HOUR, h));
}

export function DayView({
  currentDate,
  events,
  onEventClick,
  onAddEvent,
}: DayViewProps) {
  const dayEvents = useMemo(
    () => events.filter((e) => isSameDay(e.startTime, currentDate)),
    [events, currentDate]
  );

  const now = new Date();
  const isToday = isSameDay(now, currentDate);
  const currentHour = getHours(now);
  const currentMinute = getMinutes(now);
  const nowOffset =
    isToday &&
    currentHour >= START_HOUR &&
    currentHour <= END_HOUR
      ? (currentHour - START_HOUR + currentMinute / 60) * HOUR_HEIGHT
      : null;

  function handleSlotClick(hour: number) {
    if (!onAddEvent) return;
    const date = setMinutes(setHours(currentDate, hour), 0);
    onAddEvent(date);
  }

  return (
    <div className="w-full overflow-x-auto">
      {/* Date header */}
      <div
        className="mb-4"
        style={{
          fontFamily: "var(--font-headline)",
          fontSize: "16px",
          fontWeight: 600,
          color: "#0A1F18",
        }}
      >
        {format(currentDate, "EEEE d. MMMM", { locale: nb })}
      </div>

      <div className="relative" style={{ minHeight: HOURS.length * HOUR_HEIGHT }}>
        {/* Hour rows */}
        {HOURS.map((hour) => (
          <button
            key={hour}
            type="button"
            onClick={() => handleSlotClick(hour)}
            className="absolute left-0 right-0 flex items-start border-t border-[#EFEDE6] hover:bg-[rgba(0,88,64,0.03)] transition-colors"
            style={{
              top: (hour - START_HOUR) * HOUR_HEIGHT,
              height: HOUR_HEIGHT,
            }}
          >
            <span
              className="w-14 shrink-0 pt-1 pr-3 text-right"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                color: "#9C9990",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </span>
          </button>
        ))}

        {/* Current time indicator */}
        {nowOffset !== null && (
          <div
            className="absolute left-14 right-0 z-20 pointer-events-none"
            style={{ top: nowOffset }}
          >
            <div className="flex items-center">
              <div
                className="w-2 h-2 rounded-full -ml-1"
                style={{ backgroundColor: "#D1F843" }}
              />
              <div
                className="flex-1 h-[2px]"
                style={{ backgroundColor: "#D1F843" }}
              />
            </div>
          </div>
        )}

        {/* Event blocks */}
        {dayEvents.map((event) => {
          const startH = getHours(event.startTime) + getMinutes(event.startTime) / 60;
          const endH = getHours(event.endTime) + getMinutes(event.endTime) / 60;
          const clampedStart = clampHour(startH);
          const clampedEnd = clampHour(endH);
          const top = (clampedStart - START_HOUR) * HOUR_HEIGHT;
          const height = Math.max((clampedEnd - clampedStart) * HOUR_HEIGHT, 24);
          const durationMin = differenceInMinutes(event.endTime, event.startTime);

          return (
            <button
              key={event.id}
              type="button"
              onClick={() => onEventClick?.(event)}
              className="absolute left-16 right-2 z-10 rounded-[12px] px-3 py-1.5 text-left transition-opacity hover:opacity-90 overflow-hidden"
              style={{
                top,
                height,
                backgroundColor: getEventColor(event),
                color: getEventTextColor(event),
                boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
              }}
            >
              <span
                className="block truncate"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  fontWeight: 600,
                }}
              >
                {event.title}
              </span>
              {height >= 40 && (
                <span
                  className="block mt-0.5"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    opacity: 0.8,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {format(event.startTime, "HH:mm")}
                  {" - "}
                  {format(event.endTime, "HH:mm")}
                  {" "}({durationMin} min)
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
