/**
 * Enkelt-dag i ukestripen (a5).
 *
 * Mørk #0D2E23-card med dow + tall + pills, today-state med
 * lime-border, rest-state med dempet tekst.
 */

import Link from "next/link";
import { cn } from "@/lib/portal/utils/cn";
import { SessionPill } from "./session-pill";
import { areaToPillKind, type V2Event } from "./types";

const DOWS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];

export function DayCard({
  date,
  weekdayIndex,
  events,
  isToday,
  href,
}: {
  date: Date;
  /** 0 = mandag, 6 = søndag */
  weekdayIndex: number;
  events: V2Event[];
  isToday: boolean;
  /** Optional klikk-mål (f.eks. /portal/treningsplan/v2/[sessionId]). */
  href?: string;
}) {
  const isRest = events.length === 0;
  const dayNumber = String(date.getDate()).padStart(2, "0");

  // Topp 2 økter til pills (ikke mer enn 2 — matcher mockup).
  const pillEvents = events.slice(0, 2);

  const inner = (
    <>
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/50">
        {DOWS[weekdayIndex]}
      </div>
      <div
        className={cn(
          "my-1 text-[24px] font-extrabold leading-none tracking-[-0.03em]",
          isToday ? "text-[#D1F843]" : isRest ? "text-white/30" : "text-white",
        )}
      >
        {dayNumber}
      </div>
      {isRest ? (
        <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.1em] text-white/40">
          — Hvile —
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {pillEvents.map((ev) => (
            <SessionPill
              key={ev.id}
              kind={areaToPillKind(ev.area)}
              durationMinutes={ev.dur}
            />
          ))}
        </div>
      )}
    </>
  );

  const baseCls = cn(
    "relative min-h-[110px] rounded-xl border p-3 text-center transition-all",
    "hover:border-white/[0.18]",
    "border-[#1a4a3a] bg-[#0D2E23]",
    isToday && "border-[#D1F843] bg-[rgba(209,248,67,0.06)]",
    "block",
  );

  if (href) {
    return (
      <Link href={href} className={baseCls}>
        {inner}
      </Link>
    );
  }
  return <div className={baseCls}>{inner}</div>;
}
