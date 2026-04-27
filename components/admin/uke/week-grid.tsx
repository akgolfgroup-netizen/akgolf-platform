import type { EventColor, WeekDay, WeekEvent } from "./mock-data";
import { TIME_SLOTS } from "./mock-data";

const EVT_STYLES: Record<EventColor, string> = {
  green:
    "bg-[rgba(42,125,90,0.22)] text-[#6FCBA1] border-l-2 border-[#2A7D5A]",
  lime:
    "bg-[rgba(209,248,67,0.16)] text-accent border-l-2 border-accent",
  coral:
    "bg-[rgba(184,66,51,0.18)] text-[#F49283] border-l-2 border-[#B84233]",
  violet:
    "bg-[rgba(175,82,222,0.18)] text-[#D8B6F0] border-l-2 border-[#AF52DE]",
  muted:
    "bg-white/[0.025] text-white/55 border-l-2 border-dashed border-white/15",
};

interface LegendDot {
  label: string;
  color: string;
}

const LEGEND: LegendDot[] = [
  { label: "1-til-1", color: "#2A7D5A" },
  { label: "Pagar", color: "#D1F843" },
  { label: "Gruppe", color: "#AF52DE" },
  { label: "Banecoach", color: "#B84233" },
];

export function WeekGrid({
  days,
  events,
}: {
  days: WeekDay[];
  events: WeekEvent[];
}) {
  return (
    <div className="rounded-2xl border border-[#1a4a3a] bg-[#0D2E23] p-3.5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-inter-tight text-[14px] font-semibold tracking-tight text-white">
          Uke 18
        </h3>
        <div className="flex items-center gap-3.5">
          {LEGEND.map((dot) => (
            <span
              key={dot.label}
              className="inline-flex items-center text-[11px] text-white/60"
            >
              <span
                className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px]"
                style={{ background: dot.color }}
              />
              {dot.label}
            </span>
          ))}
        </div>
      </div>

      <div
        className="grid overflow-hidden rounded-xl border border-[#1a4a3a] bg-[#0D2E23]"
        style={{ gridTemplateColumns: "64px repeat(7, 1fr)" }}
      >
        {/* Header row */}
        <div className="border-b border-[#1a4a3a] bg-white/[0.025]" />
        {days.map((day) => (
          <div
            key={day.short}
            className={
              "border-b border-l border-[#1a4a3a] py-2.5 text-center " +
              (day.isToday ? "bg-[rgba(209,248,67,0.06)]" : "")
            }
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">
              {day.short}
            </div>
            <div
              className={
                "mt-0.5 text-[18px] font-semibold tracking-[-0.02em] " +
                (day.isToday ? "text-accent" : "text-white")
              }
            >
              {day.num}
            </div>
          </div>
        ))}

        {/* Time column */}
        <div className="flex flex-col">
          {TIME_SLOTS.map((slot) => (
            <div
              key={slot}
              className="h-[60px] border-b border-[#1a4a3a] px-2 py-1 text-right font-mono text-[9px] tracking-[0.1em] text-white/40"
            >
              {slot}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, dayIdx) => {
          const dayEvents = events.filter((e) => e.day === dayIdx);
          return (
            <div
              key={day.short + dayIdx}
              className={
                "relative border-l border-[#1a4a3a] " +
                (day.isToday ? "bg-[rgba(209,248,67,0.025)]" : "")
              }
            >
              {TIME_SLOTS.map((slot) => (
                <div
                  key={slot}
                  className="h-[60px] border-b border-[#1a4a3a]"
                />
              ))}
              {dayEvents.map((evt, idx) => (
                <div
                  key={idx}
                  className={`absolute left-1 right-1 cursor-pointer overflow-hidden rounded-md px-2 py-1.5 text-[11px] leading-snug ${EVT_STYLES[evt.color]}`}
                  style={{ top: `${evt.top}px`, height: `${evt.height}px` }}
                >
                  <strong className="block font-semibold">{evt.title}</strong>
                  <small className="mt-0.5 block font-mono text-[9px] tracking-[0.06em] opacity-85">
                    {evt.meta}
                  </small>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
