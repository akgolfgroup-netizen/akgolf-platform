import { format, isToday, isSameWeek, startOfISOWeek } from "date-fns";
import { nb } from "date-fns/locale";
import type { CalendarEvent } from "@/app/portal/(dashboard)/kalender/actions";
import { EventChip } from "./event-chip";
import { Calendar } from "lucide-react";

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
      <div className="text-center py-16 rounded-2xl border border-[rgba(15,41,80,0.4)]">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--color-snow)]/50" />
        <p className="text-[var(--color-snow)]/70">
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
            <span className="text-sm font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Uke {format(weekStart, "I", { locale: nb })} · {format(weekStart, "d. MMMM", { locale: nb })}
            </span>
            {isSameWeek(weekStart, new Date(), { weekStartsOn: 1 }) && (
              <span className="text-xs px-3 py-1 rounded-full font-medium bg-[rgba(184,151,92,0.15)] text-[var(--color-gold)] border border-[rgba(184,151,92,0.3)]">
                Denne uken
              </span>
            )}
          </div>

          <div className="space-y-3">
            {weekEvents.map((e) => (
              <div key={e.id} className="flex items-start gap-4">
                <div className="w-20 flex-shrink-0 text-right">
                  <p
                    className={`text-sm font-medium ${
                      isToday(new Date(e.startDate))
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-snow)]"
                    }`}
                  >
                    {format(new Date(e.startDate), "EEE d.", { locale: nb })}
                  </p>
                  <p className="text-[var(--color-snow)]/50">
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
