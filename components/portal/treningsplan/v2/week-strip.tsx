import Link from "next/link";
import { cn } from "@/lib/portal/utils/cn";
import { areaToPillKind, type SessionPillKind, type V2EventLite } from "./types";

const DOWS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

const PILL_STYLES: Record<SessionPillKind, string> = {
  putt: "bg-success/20 text-success",
  iron: "bg-info/20 text-info",
  short: "bg-warning/20 text-warning",
  driver: "bg-error/20 text-error",
  round: "bg-accent/18 text-accent",
};

interface DayPill {
  label: string;
  kind: SessionPillKind;
}

function pillForEvent(ev: V2EventLite): DayPill {
  const kind = areaToPillKind(ev.area);
  const labelMap: Record<SessionPillKind, string> = {
    putt: "Putt",
    iron: "Iron",
    short: "Short",
    driver: "Driver",
    round: "Runde",
  };
  return { label: `${labelMap[kind]} ${ev.dur}m`, kind };
}

export function WeekStrip({
  weekDates,
  events,
  weekOffset,
  todayIso,
  detailHref,
}: {
  weekDates: Date[];
  events: V2EventLite[];
  weekOffset: number;
  todayIso: string;
  detailHref?: (offset: number) => string;
}) {
  const byDay = new Map<string, V2EventLite[]>();
  for (const ev of events) {
    if (!byDay.has(ev.date)) byDay.set(ev.date, []);
    byDay.get(ev.date)!.push(ev);
  }

  return (
    <div className="mb-7 grid grid-cols-7 gap-2">
      {weekDates.map((d, i) => {
        const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        const isToday = iso === todayIso;
        const dayEvents = byDay.get(iso) ?? [];
        const isRest = dayEvents.length === 0;
        const pills = dayEvents.slice(0, 2).map(pillForEvent);

        const cardInner = (
          <>
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
              {DOWS[i]}
            </div>
            <div
              className={cn(
                "my-1 text-[24px] font-extrabold leading-none tracking-[-0.03em]",
                isToday && "text-accent",
                !isToday && !isRest && "text-white",
                isRest && "text-white/30",
              )}
            >
              {String(d.getDate()).padStart(2, "0")}
            </div>
            {isRest ? (
              <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
                — Hvile —
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {pills.map((p, idx) => (
                  <span
                    key={idx}
                    className={cn(
                      "block w-full rounded-md px-1.5 py-1",
                      "font-mono text-[9px] font-semibold uppercase tracking-[0.04em]",
                      PILL_STYLES[p.kind],
                    )}
                  >
                    {p.label}
                  </span>
                ))}
              </div>
            )}
          </>
        );

        const baseCls = cn(
          "relative min-h-[110px] rounded-xl border p-3 text-center transition-all",
          "hover:border-white/[0.18]",
          "border-sidebar-divider bg-sidebar-hover",
          isToday && "border-accent bg-accent/5",
        );

        if (detailHref) {
          return (
            <Link key={iso} href={detailHref(weekOffset)} className={baseCls}>
              {cardInner}
            </Link>
          );
        }
        return (
          <div key={iso} className={baseCls}>
            {cardInner}
          </div>
        );
      })}
    </div>
  );
}
