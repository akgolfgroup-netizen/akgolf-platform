import {
  format,
  startOfISOWeek,
  addDays,
  isToday,
  isSameDay,
} from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";
import { EventChip } from "./event-chip";

const THEME = {
  gold: "#B8975C",
  navy: "#0F2950",
  text: "#02060D",
  textSecondary: "#64748B",
  textTertiary: "#9CA3AF",
  border: "#EBE5DA",
  bgSubtle: "#FAFBFC",
};

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
              className="text-center py-3 mb-3 rounded-xl"
              style={{
                background: isTodayFlag ? `${THEME.gold}15` : "transparent",
                border: isTodayFlag ? `1px solid ${THEME.gold}40` : `1px solid ${THEME.border}`,
              }}
            >
              <p 
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: isTodayFlag ? THEME.gold : THEME.textTertiary }}
              >
                {format(day, "EEE", { locale: nb })}
              </p>
              <p
                className="text-xl font-semibold mt-1"
                style={{ color: isTodayFlag ? THEME.navy : THEME.text }}
              >
                {format(day, "d")}
              </p>
            </div>

            {/* Events */}
            <div className="space-y-2 flex-1 min-h-[100px]">
              {dayEvents.length === 0 ? (
                <div 
                  className="h-16 rounded-xl flex items-center justify-center"
                  style={{ 
                    background: THEME.bgSubtle,
                    border: `1px dashed ${THEME.border}`,
                  }}
                >
                  <span style={{ color: THEME.textTertiary }}>–</span>
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
