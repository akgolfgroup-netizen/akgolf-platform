"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "./activity-detail-sheet";
import type { Facility } from "./facility-selector";

interface Props {
  date: Date;
  events: CalendarEvent[];
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectEvent: (event: CalendarEvent) => void;
}

export function FacilityCalendarMonth({
  date,
  events,
  facilities,
  selectedFacilityId,
  onSelectEvent,
}: Props) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Build array of weeks
  const weeks: Date[][] = [];
  let currentDay = calendarStart;
  while (currentDay <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(currentDay);
      currentDay = addDays(currentDay, 1);
    }
    weeks.push(week);
  }

  // Filter events by selected facility
  const filteredEvents = selectedFacilityId
    ? events.filter((e) => e.facilityId === selectedFacilityId)
    : events;

  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];

  return (
    <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[var(--color-grey-200)] bg-[var(--color-grey-50)]">
        {weekDays.map((day) => (
          <div
            key={day}
            className="py-3 text-center text-xs font-semibold text-[var(--color-grey-500)] uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dayEvents = filteredEvents.filter((e) =>
              isSameDay(new Date(e.startTime), day)
            );
            const isCurrentMonth = isSameMonth(day, date);
            const isCurrentDay = isToday(day);
            const maxVisibleEvents = 3;
            const hiddenCount = Math.max(0, dayEvents.length - maxVisibleEvents);

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] p-2 border-b border-r border-[var(--color-grey-100)] ${
                  !isCurrentMonth ? "bg-[var(--color-grey-50)]" : ""
                } ${dayIndex === 6 ? "border-r-0" : ""} ${
                  weekIndex === weeks.length - 1 ? "border-b-0" : ""
                }`}
              >
                {/* Day number */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-sm font-medium ${
                      isCurrentDay
                        ? "w-7 h-7 flex items-center justify-center rounded-full bg-[var(--color-grey-900)] text-white"
                        : isCurrentMonth
                        ? "text-[var(--color-grey-900)]"
                        : "text-[var(--color-grey-400)]"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, maxVisibleEvents).map((event) => {
                    const isPending = event.status === "PENDING";
                    return (
                      <button
                        key={event.id}
                        onClick={() => onSelectEvent(event)}
                        className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] truncate hover:opacity-80 transition-opacity ${
                          isPending ? "ring-1 ring-[#FF9500]" : ""
                        }`}
                        style={{
                          backgroundColor: `${event.color}20`,
                          color: event.color,
                        }}
                      >
                        <span className="font-medium">{format(new Date(event.startTime), "HH:mm")}</span>{" "}
                        {event.title}
                      </button>
                    );
                  })}
                  {hiddenCount > 0 && (
                    <p className="text-[10px] text-[var(--color-grey-400)] px-1">
                      +{hiddenCount} flere
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
