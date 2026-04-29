import { ChevronLeft, ChevronRight } from "lucide-react";
import { COACH_LEGEND } from "./mock-data";

const VIEWS = ["DAG", "UKE", "MÅNED", "AGENDA"];

export function CalendarToolbar() {
  return (
    <div className="mb-3.5 flex flex-wrap items-center gap-2.5">
      {/* Nav */}
      <div className="inline-flex rounded-lg border border-white/8 bg-white/[0.04] p-0.5">
        <button
          type="button"
          title="Forrige"
          className="grid h-7 place-items-center rounded-md px-2.5 text-white transition hover:bg-white/[0.06]"
        >
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
        <button
          type="button"
          title="I dag"
          className="rounded-md px-2.5 py-1 font-mono text-[11px] tracking-wider text-white transition hover:bg-white/[0.06]"
        >
          I DAG
        </button>
        <button
          type="button"
          title="Neste"
          className="grid h-7 place-items-center rounded-md px-2.5 text-white transition hover:bg-white/[0.06]"
        >
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>

      {/* Period */}
      <div className="min-w-[160px] text-[18px] font-semibold tracking-tight text-white">
        Uke 18 · 2025
        <small className="mt-0.5 block font-mono text-[10px] font-normal tracking-wider text-white/50">
          28 APR – 4 MAI
        </small>
      </div>

      {/* View toggle */}
      <div className="inline-flex rounded-lg border border-white/8 bg-white/[0.04] p-0.5">
        {VIEWS.map((v) => (
          <button
            key={v}
            type="button"
            className={
              "rounded-md px-3 py-1.5 font-mono text-[12px] tracking-wider transition " +
              (v === "UKE"
                ? "bg-accent/15 text-accent"
                : "text-white/60 hover:text-white")
            }
          >
            {v}
          </button>
        ))}
      </div>

      {/* Coach legend */}
      <div className="ml-auto flex items-center gap-2.5">
        {COACH_LEGEND.map((c) => (
          <div
            key={c.key}
            className={
              "inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.04] px-2.5 py-1.5 text-[11px] text-white/85 " +
              (c.muted ? "opacity-40" : "")
            }
          >
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.name}
            <span className="font-mono text-[10px] text-white/50">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
