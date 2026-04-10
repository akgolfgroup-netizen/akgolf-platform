"use client";

import { format, isSameDay, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "./activity-detail-sheet";
import type { Facility } from "./facility-selector";

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7); // 07:00 - 20:00
const SLOT_HEIGHT = 60;

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
  return Math.max(durationHours * SLOT_HEIGHT, 24);
}

export function FacilityCalendarDay({
  date,
  events,
  facilities,
  selectedFacilityId,
  onSelectEvent,
}: Props) {
  // Filter events by date and selected facility
  const dayEvents = events.filter((e) => {
    const isSameDate = isSameDay(new Date(e.startTime), date);
    const matchesFacility = !selectedFacilityId || e.facilityId === selectedFacilityId;
    return isSameDate && matchesFacility;
  });

  // Get facilities to show (selected or all)
  const visibleFacilities = selectedFacilityId
    ? facilities.filter((f) => f.id === selectedFacilityId)
    : facilities;

  const columnCount = visibleFacilities.length;

  return (
    <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white overflow-hidden">
      {/* Header with date and facility columns */}
      <div className="border-b border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `60px repeat(${columnCount}, 1fr)`,
          }}
        >
          <div className="py-4 px-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase text-[var(--color-grey-400)]">
              {format(date, "EEEE", { locale: nb })}
            </span>
            <span
              className={`text-xl font-bold ${
                isToday(date) ? "text-[#007AFF]" : "text-[var(--color-grey-900)]"
              }`}
            >
              {format(date, "d. MMMM", { locale: nb })}
            </span>
          </div>
          {visibleFacilities.map((facility) => (
            <div
              key={facility.id}
              className="py-4 px-3 border-l border-[var(--color-grey-200)] text-center"
            >
              <p className="font-semibold text-[var(--color-grey-900)]">
                {facility.name}
              </p>
              {facility.Location && (
                <p className="text-xs text-[var(--color-grey-500)]">
                  {facility.Location.name}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Time grid */}
      <div
        className="grid overflow-y-auto"
        style={{
          gridTemplateColumns: `60px repeat(${columnCount}, 1fr)`,
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
              <span className="text-xs text-[var(--color-grey-400)] px-2 -translate-y-1/2 block font-medium">
                {String(hour).padStart(2, "0")}:00
              </span>
            </div>
          ))}
        </div>

        {/* Facility columns */}
        {visibleFacilities.map((facility) => {
          const facilityEvents = dayEvents.filter(
            (e) => e.facilityId === facility.id
          );

          return (
            <div
              key={facility.id}
              className="relative border-l border-[var(--color-grey-200)]"
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

              {/* Half-hour lines */}
              {HOURS.map((hour) => (
                <div
                  key={`${hour}-half`}
                  className="absolute left-0 right-0 border-t border-dashed border-[var(--color-grey-100)]"
                  style={{ top: (hour - 7) * SLOT_HEIGHT + SLOT_HEIGHT / 2 }}
                />
              ))}

              {/* Events */}
              {facilityEvents.map((event) => {
                const start = new Date(event.startTime);
                const end = new Date(event.endTime);
                const top = eventTop(start);
                const height = eventHeight(start, end);
                const isPending = event.status === "PENDING";

                return (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className={`absolute left-1 right-1 rounded-lg px-2 py-1 text-left hover:ring-2 hover:ring-offset-1 transition-[box-shadow] cursor-pointer overflow-hidden shadow-sm ${
                      isPending ? "ring-2 ring-[#C48A32] ring-offset-1" : ""
                    }`}
                    style={{
                      top,
                      height,
                      backgroundColor: `${event.color}15`,
                      borderLeft: `4px solid ${event.color}`,
                    }}
                  >
                    <p
                      className="font-semibold text-xs truncate"
                      style={{ color: event.color }}
                    >
                      {event.title}
                    </p>
                    <p className="text-[10px] text-[var(--color-grey-600)] truncate">
                      {format(start, "HH:mm")} - {format(end, "HH:mm")}
                    </p>
                    {event.type === "activity" && event.createdBy && (
                      <p className="text-[9px] text-[var(--color-grey-400)] truncate mt-0.5">
                        {event.createdBy}
                      </p>
                    )}
                    {isPending && (
                      <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#C48A32] animate-pulse" />
                    )}
                  </button>
                );
              })}

              {/* Now line */}
              {isToday(date) &&
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
                      <div className="w-full h-0.5 bg-[var(--color-error)]" />
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
