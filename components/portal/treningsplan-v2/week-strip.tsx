/**
 * 7-dagers strip med session-pills (a5).
 *
 * Tar imot ferdig-bygget liste med dato-objekter + V2Event[] for hele uka,
 * grupperer per ISO-dato og rendrer en DayCard per dag.
 */

import { DayCard } from "./day-card";
import type { V2Event } from "./types";

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function WeekStrip({
  weekDates,
  events,
  todayIso,
  hrefForDay,
}: {
  /** Mandag → søndag (7 datoer). */
  weekDates: Date[];
  events: V2Event[];
  todayIso: string;
  /** Returner en URL pr. dato, eller undefined for ikke-klikkbar. */
  hrefForDay?: (iso: string, events: V2Event[]) => string | undefined;
}) {
  const byDay = new Map<string, V2Event[]>();
  for (const ev of events) {
    const list = byDay.get(ev.date) ?? [];
    list.push(ev);
    byDay.set(ev.date, list);
  }

  return (
    <div className="mb-7 grid grid-cols-7 gap-2">
      {weekDates.map((d, i) => {
        const iso = isoDate(d);
        const dayEvents = byDay.get(iso) ?? [];
        const href = hrefForDay?.(iso, dayEvents);
        return (
          <DayCard
            key={iso}
            date={d}
            weekdayIndex={i}
            events={dayEvents}
            isToday={iso === todayIso}
            href={href}
          />
        );
      })}
    </div>
  );
}
