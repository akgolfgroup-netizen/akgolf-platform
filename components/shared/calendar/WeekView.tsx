"use client";

import { useMemo } from "react";
import {
  startOfWeek,
  addDays,
  isSameDay,
  isToday,
  getHours,
  getMinutes,
  format,
} from "date-fns";
import { nb } from "date-fns/locale";
import { WEEKDAYS_NO, HOURS, CATEGORY_COLORS } from "./calendar-types";
import type { CalendarEvent } from "./calendar-types";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick?: (event: CalendarEvent) => void;
  onAddEvent?: (date: Date) => void;
  onDateSelect?: (date: Date) => void;
}

const HOUR_HEIGHT = 52;
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

export function WeekView({
  currentDate,
  events,
  onEventClick,
  onAddEvent,
  onDateSelect,
}: WeekViewProps) {
  const weekStart = useMemo(
    () => startOfWeek(currentDate, { weekStartsOn: 1 }),
    [currentDate]
  );

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

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

  const now = new Date();
  const currentHour = getHours(now);
  const currentMinute = getMinutes(now);
  const nowOffset =
    currentHour >= START_HOUR && currentHour <= END_HOUR
      ? (currentHour - START_HOUR + currentMinute / 60) * HOUR_HEIGHT
      : null;

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[700px]">
        {/* Column headers */}
        <div className="grid grid-cols-[56px_repeat(7,1fr)] border-b border-[#E5E3DD]">
          <div /> {/* time gutter */}
          {weekDays.map((day, i) => {
            const today = isToday(day);
            return (
              <button
                key={i}
                type="button"
                onClick={() => onDateSelect?.(day)}
                className="flex flex-col items-center py-3 transition-colors hover:bg-[rgba(0,88,64,0.03)]"
              >
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    color: today ? "#005840" : "#9C9990",
                  }}
                >
                  {WEEKDAYS_NO[i]}
                </span>
                <span
                  className="mt-0.5 flex items-center justify-center w-8 h-8 rounded-full"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "15px",
                    fontWeight: 600,
                    fontVariantNumeric: "tabular-nums",
                    color: today ? "#FFFFFF" : "#0A1F18",
                    backgroundColor: today ? "#005840" : "transparent",
                  }}
                >
                  {format(day, "d")}
                </span>
              </button>
            );
          })}
        </div>

        {/* Time grid */}
        <div
          className="relative grid grid-cols-[56px_repeat(7,1fr)]"
          style={{ height: HOURS.length * HOUR_HEIGHT }}
        >
          {/* Hour labels */}
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 w-14 text-right pr-3"
              style={{
                top: (hour - START_HOUR) * HOUR_HEIGHT,
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "#9C9990",
                fontVariantNumeric: "tabular-nums",
                lineHeight: "1",
                transform: "translateY(-6px)",
              }}
            >
              {String(hour).padStart(2, "0")}:00
            </div>
          ))}

          {/* Horizontal grid lines */}
          {HOURS.map((hour) => (
            <div
              key={`line-${hour}`}
              className="absolute left-14 right-0 border-t border-[#EFEDE6]"
              style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}
            />
          ))}

          {/* Day columns */}
          {weekDays.map((day, colIndex) => {
            const today = isToday(day);
            const dayKey = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(dayKey) ?? [];

            return (
              <div
                key={colIndex}
                className="relative border-l border-[#EFEDE6]"
                style={{
                  gridColumn: colIndex + 2,
                  gridRow: 1,
                  backgroundColor: today ? "#FAFAF7" : "#FFFFFF",
                }}
                onClick={() => {
                  if (onAddEvent) {
                    const noon = new Date(day);
                    noon.setHours(12, 0, 0, 0);
                    onAddEvent(noon);
                  }
                }}
              >
                {/* Events */}
                {dayEvents.map((event) => {
                  const startH =
                    getHours(event.startTime) +
                    getMinutes(event.startTime) / 60;
                  const endH =
                    getHours(event.endTime) +
                    getMinutes(event.endTime) / 60;
                  const clampedStart = clampHour(startH);
                  const clampedEnd = clampHour(endH);
                  const top = (clampedStart - START_HOUR) * HOUR_HEIGHT;
                  const height = Math.max(
                    (clampedEnd - clampedStart) * HOUR_HEIGHT,
                    20
                  );

                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick?.(event);
                      }}
                      className="absolute left-0.5 right-0.5 z-10 rounded-lg px-1.5 py-1 text-left overflow-hidden transition-opacity hover:opacity-90"
                      style={{
                        top,
                        height,
                        backgroundColor: getEventColor(event),
                        color: getEventTextColor(event),
                      }}
                    >
                      <span
                        className="block truncate"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "11px",
                          fontWeight: 600,
                        }}
                      >
                        {event.title}
                      </span>
                      {height >= 32 && (
                        <span
                          className="block truncate"
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "10px",
                            opacity: 0.8,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {format(event.startTime, "HH:mm")}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Current time indicator */}
          {nowOffset !== null &&
            weekDays.some((d) => isToday(d)) && (
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
        </div>
      </div>
    </div>
  );
}
