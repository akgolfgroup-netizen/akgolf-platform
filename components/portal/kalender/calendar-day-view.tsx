import { format, isToday, addDays, subDays } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";
import { EventChip } from "./event-chip";
import { Calendar } from "lucide-react";

interface CalendarDayViewProps {
  events: CalendarEvent[];
  date: Date;
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 6); // 06:00 - 19:00

export function CalendarDayView({ events, date }: CalendarDayViewProps) {
  const dayEvents = events.filter((e) => {
    const eventDate = new Date(e.startDate);
    return (
      eventDate.getDate() === date.getDate() &&
      eventDate.getMonth() === date.getMonth() &&
      eventDate.getFullYear() === date.getFullYear()
    );
  });

  const isTodayFlag = isToday(date);

  return (
    <div className="space-y-4">
      {/* Day header */}
      <div
        className={`text-center py-6 rounded-2xl border ${
          isTodayFlag
            ? "bg-[var(--color-grey-100)] border-[var(--color-grey-300)]"
            : "bg-white border-[var(--color-grey-200)]"
        }`}
      >
        <p className="text-sm font-medium uppercase tracking-wider text-[var(--color-grey-500)]">
          {format(date, "EEEE", { locale: nb })}
        </p>
        <p className="text-4xl font-bold mt-1 text-[var(--color-grey-900)]">
          {format(date, "d")}
        </p>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          {format(date, "MMMM yyyy", { locale: nb })}
        </p>
      </div>

      {/* Timeline */}
      {dayEvents.length === 0 ? (
        <div className="text-center py-16 rounded-2xl border border-[var(--color-grey-200)] bg-white">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--color-grey-300)]" />
          <p className="text-[var(--color-grey-500)]">
            Ingen hendelser denne dagen.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
          {HOURS.map((hour) => {
            const hourEvents = dayEvents.filter((e) => {
              const eventHour = new Date(e.startDate).getHours();
              return eventHour === hour;
            });

            return (
              <div
                key={hour}
                className="flex border-b border-[var(--color-grey-100)] last:border-b-0"
              >
                <div className="w-16 flex-shrink-0 py-3 px-3 text-right border-r border-[var(--color-grey-100)]">
                  <span className="text-xs font-medium text-[var(--color-grey-400)]">
                    {hour.toString().padStart(2, "0")}:00
                  </span>
                </div>
                <div className="flex-1 p-2 min-h-[48px]">
                  {hourEvents.length > 0 ? (
                    <div className="space-y-1">
                      {hourEvents.map((e) => (
                        <EventChip key={e.id} event={e} />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All-day events */}
      {dayEvents.filter((e) => e.allDay).length > 0 && (
        <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-grey-500)] mb-3">
            Hele dagen
          </p>
          <div className="space-y-2">
            {dayEvents
              .filter((e) => e.allDay)
              .map((e) => (
                <EventChip key={e.id} event={e} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
