import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOURS, WEEK_CELLS, WEEK_DAYS, type CellState } from "./mock-data";

const CELL_CLASSES: Record<CellState, string> = {
  free: "",
  avail: "bg-[rgba(209,248,67,0.10)] hover:bg-[rgba(209,248,67,0.16)]",
  booked: "bg-[rgba(0,122,255,0.18)]",
  blocked:
    "[background-image:repeating-linear-gradient(45deg,rgba(255,255,255,0.02)_0_6px,rgba(255,255,255,0.06)_6px_12px)]",
  holiday: "bg-[rgba(184,66,51,0.12)]",
};

export function WeekCard() {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23]">
      {/* Head */}
      <div className="flex items-center justify-between border-b border-[#1a4a3a] px-5 py-4">
        <h3 className="text-[14px] font-bold text-white">
          Uke 18 · 28. apr – 4. mai 2025
        </h3>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
          >
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-white/80 transition hover:bg-white/10"
          >
            I dag
          </button>
          <button
            type="button"
            className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-t border-[#1a4a3a]">
        {/* Header row */}
        <div className="border-b border-r border-[#1a4a3a] px-2 py-2.5" />
        {WEEK_DAYS.map((day) => (
          <div
            key={day.short}
            className={
              "border-b border-r border-[#1a4a3a] px-2 py-2.5 text-center font-mono text-[10px] font-bold uppercase tracking-[0.10em] " +
              (day.today ? "text-accent" : "text-white/55")
            }
          >
            {day.short}
            <div
              className={
                "mt-0.5 text-[13px] font-bold " + (day.today ? "text-accent" : "text-white")
              }
            >
              {day.date}
            </div>
          </div>
        ))}

        {/* Hour rows */}
        {HOURS.map((time, rowIdx) => (
          <FragmentRow key={time} time={time} rowIdx={rowIdx} />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 border-t border-[#1a4a3a] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.06em] text-white/55">
        <LegendSwatch color="rgba(209,248,67,0.18)" label="Tilgjengelig (36t)" />
        <LegendSwatch color="rgba(0,122,255,0.30)" label="Booket (12t)" />
        <LegendSwatchPattern label="Lunsj/buffer" />
        <LegendSwatch color="rgba(184,66,51,0.20)" label="Helligdag (1. mai)" />
      </div>
    </section>
  );
}

function FragmentRow({ time, rowIdx }: { time: string; rowIdx: number }) {
  const row = WEEK_CELLS[rowIdx] ?? [];
  return (
    <>
      <div className="border-b border-r border-white/[0.04] px-1 py-2 text-right font-mono text-[9.5px] tracking-[0.05em] text-white/50">
        {time}
      </div>
      {row.map((state, i) => (
        <div
          key={`${time}-${i}`}
          className={
            "h-[38px] cursor-pointer border-b border-r border-white/[0.03] transition " +
            (CELL_CLASSES[state] || "hover:bg-white/[0.02]")
          }
        />
      ))}
    </>
  );
}

function LegendSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-3.5 w-3.5 rounded-[3px]"
        style={{ background: color }}
      />
      {label}
    </div>
  );
}

function LegendSwatchPattern({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="inline-block h-3.5 w-3.5 rounded-[3px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0 4px, rgba(255,255,255,0.10) 4px 8px)",
        }}
      />
      {label}
    </div>
  );
}
