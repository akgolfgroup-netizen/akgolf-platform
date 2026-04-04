"use client";

import { format, startOfWeek, addDays, isSameDay, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "./activity-detail-sheet";
import type { Facility } from "./facility-selector";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00
const SLOT_HEIGHT = 48;

interface Props {
  date: Date;
  events: CalendarEvent[];
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectEvent: (event: CalendarEvent) => void;
}

function eventTop(startTime: Date): number {
  const hours = startTime.getHours() + startTime.getMinutes() / 60;
  return (hours - 7) * SLOT_HEIGHT;
}

function eventHeight(startTime: Date, endTime: Date): number {
  const durationMs = endTime.getTime() - startTime.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);
  return Math.max(durationHours * SLOT_HEIGHT, 20);
}

export function FacilityCalendarWeek({
  date,
  events,
  facilities,
  selectedFacilityId,
  onSelectEvent,
}: Props) {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Filter events by selected facility
  const filteredEvents = selectedFacilityId
    ? events.filter((e) => e.facilityId === selectedFacilityId)
    : events;

  // Get facilities to show (selected or all)
  const visibleFacilities = selectedFacilityId
    ? facilities.filter((f) => f.id === selectedFacilityId)
    : facilities;

  return (
    <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white overflow-hidden">
      {/* Day headers */}
      <div
        className="grid border-b border-[var(--color-grey-200)] sticky top-0 bg-white z-10"
        style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}
      >
        <div className="py-3 px-2 text-center">
          <span className="text-[10px] text-[var(--color-grey-400)]">Tid</span>
        </div>
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`text-center py-3 border-l border-[var(--color-grey-200)] ${
              isToday(day) ? "bg-[var(--color-grey-900)]/5" : ""
            }`}
          >
            <p className="text-[10px] uppercase text-[var(--color-grey-400)] font-medium">
              {format(day, "EEE", { locale: nb })}
            </p>
            <p
              className={`text-sm font-semibold mt-0.5 ${
                isToday(day)
                  ? "bg-[var(--color-grey-900)] text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto"
                  : "text-[var(--color-grey-900)]"
              }`}
            >
              {format(day, "d")}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div
        className="grid overflow-y-auto"
        style={{
          gridTemplateColumns: "60px repeat(7, 1fr)",
          maxHeight: "calc(100vh - 320px)",
        }}
      >
        {/* Time labels */}
        <div className="relative" style={{ height: HOURS.length * SLOT_HEIGHT }}>
          {HOURS.map((hour) => (
            <div
              key={hour}
              className="absolute left-0 right-0"
              style={{ top: (hour - 7) * SLOT_HEIGHT }}
            >
              <span className="text-[10px] text-[var(--color-grey-400)] px-2 -translate-y-1/2 block">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day) => {
          const dayEvents = filteredEvents.filter((e) =>
            isSameDay(new Date(e.startTime), day)
          );

          return (
            <div
              key={day.toISOString()}
              className={`relative border-l border-[var(--color-grey-200)] ${
                isToday(day) ? "bg-[var(--color-grey-900)]/5" : ""
              }`}
              style={{ height: HOURS.length * SLOT_HEIGHT }}
            >
              {/* Hour lines */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-[var(--color-grey-100)]"
                  style={{ top: (hour - 7) * SLOT_HEIGHT }}
                />
              ))}

              {/* Events */}
              {dayEvents.map((event) => {
                const start = new Date(event.startTime);
                const end = new Date(event.endTime);
                const top = eventTop(start);
                const height = eventHeight(start, end);
                const isPending = event.status === "PENDING";

                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className={`absolute left-0.5 right-0.5 rounded-md px-1.5 py-0.5 text-left text-[10px] hover:opacity-90 transition-opacity cursor-pointer overflow-hidden ${
                      isPending ? "animate-pulse" : ""
                    }`}
                    style={{
                      top,
                      height,
                      backgroundColor: `${event.color}20`,
                      borderLeft: `3px solid ${event.color}`,
                    }}
                  >
                    <p
                      className="font-semibold truncate"
                      style={{ color: event.color }}
                    >
                      {event.title}
                    </p>
                    <p className="text-[var(--color-grey-500)] truncate">
                      {format(start, "HH:mm")} - {format(end, "HH:mm")}
                    </p>
                    {!selectedFacilityId && (
                      <p className="text-[var(--color-grey-400)] truncate text-[9px]">
                        {event.facilityName}
                      </p>
                    )}
                  </button>
                );
              })}

              {/* Now line */}
              {isToday(day) &&
                (() => {
                  const now = new Date();
                  const nowHours = now.getHours() + now.getMinutes() / 60;
                  if (nowHours < 7 || nowHours > 21) return null;
                  const top = (nowHours - 7) * SLOT_HEIGHT;

                  return (
                    <div
                      className="absolute left-0 right-0 z-10 pointer-events-none"
                      style={{ top }}
                    >
                      <div className="w-full h-0.5 bg-[#D14343]" />
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D14343]" />
                    </div>
                  );
                })()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
