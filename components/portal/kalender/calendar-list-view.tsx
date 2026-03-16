import { format, isToday, isSameWeek, startOfISOWeek } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";
import { EventChip } from "./event-chip";
import { Calendar } from "lucide-react";

const THEME = {
  gold: "#B8975C",
  navy: "#0F2950",
  text: "#02060D",
  textSecondary: "#64748B",
  textTertiary: "#9CA3AF",
  border: "#EBE5DA",
  bgSubtle: "#FAFBFC",
};

interface CalendarListViewProps {
  events: CalendarEvent[];
}

function groupByWeek(events: CalendarEvent[]) {
  const groups = new Map<string, { weekStart: Date; events: CalendarEvent[] }>();
  for (const e of events) {
    const weekStart = startOfISOWeek(new Date(e.startDate));
    const key = format(weekStart, "yyyy-'W'II");
    if (!groups.has(key)) groups.set(key, { weekStart, events: [] });
    groups.get(key)!.events.push(e);
  }
  return Array.from(groups.values());
}

const TYPE_LABELS: Record<string, string> = {
  booking: "Booking",
  training: "Trening",
  tournament: "Turnering",
  coaching: "Coaching",
};

export function CalendarListView({ events }: CalendarListViewProps) {
  if (events.length === 0) {
    return (
      <div 
        className="text-center py-16 rounded-2xl border"
        style={{ borderColor: THEME.border }}
      >
        <Calendar className="w-12 h-12 mx-auto mb-4" style={{ color: THEME.textTertiary }} />
        <p style={{ color: THEME.textSecondary }}>
          Ingen hendelser i denne perioden.
        </p>
      </div>
    );
  }

  const weeks = groupByWeek(events);

  return (
    <div className="space-y-8">
      {weeks.map(({ weekStart, events: weekEvents }) => (
        <div key={format(weekStart, "yyyy-'W'II")}>
          <div className="flex items-center gap-3 mb-4">
            <span 
              className="text-sm font-semibold uppercase tracking-wider"
              style={{ color: THEME.gold }}
            >
              Uke {format(weekStart, "I", { locale: nb })} · {format(weekStart, "d. MMMM", { locale: nb })}
            </span>
            {isSameWeek(weekStart, new Date(), { weekStartsOn: 1 }) && (
              <span 
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  background: `${THEME.gold}15`,
                  color: THEME.gold,
                  border: `1px solid ${THEME.gold}30`,
                }}
              >
                Denne uken
              </span>
            )}
          </div>

          <div className="space-y-3">
            {weekEvents.map((e) => (
              <div key={e.id} className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0 text-right">
                  <p
                    className="text-sm font-medium"
                    style={{ 
                      color: isToday(new Date(e.startDate)) ? THEME.gold : THEME.text 
                    }}
                  >
                    {format(new Date(e.startDate), "EEE d.", { locale: nb })}
                  </p>
                  <p style={{ color: THEME.textTertiary }}>
                    {TYPE_LABELS[e.type]}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <EventChip event={e} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
