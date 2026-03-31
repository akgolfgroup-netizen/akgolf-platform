import {
  format,
  addDays,
  isToday,
  isSameDay,
} from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";
import { EventChip } from "./event-chip";

interface CalendarWeekViewProps {
  events: CalendarEvent[];
  weekStart: Date;
}

export function CalendarWeekView({ events, weekStart }: CalendarWeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((day) => {
        const dayEvents = events.filter((e) =>
          isSameDay(new Date(e.startDate), day)
        );
        const isTodayFlag = isToday(day);

        return (
          <div key={day.toISOString()} className="flex flex-col">
            {/* Day header */}
            <div
              className={`text-center py-3 mb-3 rounded-xl border ${
                isTodayFlag
                  ? "bg-[var(--color-grey-100)] border-[var(--color-grey-200)]"
                  : "bg-transparent border-[var(--color-grey-200)]"
              }`}
            >
              <p
                className={`text-xs font-medium uppercase tracking-wider ${
                  isTodayFlag ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-400)]"
                }`}
              >
                {format(day, "EEE", { locale: nb })}
              </p>
              <p
                className={`text-xl font-semibold mt-1 ${
                  isTodayFlag ? "text-[var(--color-grey-900)]" : "text-[var(--color-grey-900)]"
                }`}
              >
                {format(day, "d")}
              </p>
            </div>

            {/* Events */}
            <div className="space-y-2 flex-1 min-h-[100px]">
              {dayEvents.length === 0 ? (
                <div className="h-16 rounded-xl flex items-center justify-center bg-transparent border border-dashed border-[var(--color-grey-200)]">
                  <span className="text-[var(--color-grey-400)]">–</span>
                </div>
              ) : (
                dayEvents.map((e) => (
                  <EventChip key={e.id} event={e} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
