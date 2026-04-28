"use client";

import { ChevronRight } from "lucide-react";

interface CaddiePanelProps {
  recommendedClub: string;
  shotDistance: number;
  toGreen: number;
  shotsToFinish: { fairway: number; rough: number; average: number };
  onSelect?: () => void;
}

/**
 * Caddie-panel for runde v2 — AI-anbefalt klubbe + skuddstats.
 */
export function CaddiePanel({
  recommendedClub,
  shotDistance,
  toGreen,
  shotsToFinish,
  onSelect,
}: CaddiePanelProps) {
  return (
    <div
      className="absolute top-24 right-6 w-[300px] z-30 p-5 rounded-2xl border border-white/10 backdrop-blur-2xl text-white"
      style={{ background: "rgba(12,22,17,0.62)" }}
    >
      <div className="flex items-center gap-1.5 mb-1.5 font-mono text-[10px] tracking-[0.14em] uppercase text-white/55">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D1F843]" /> Caddie · AI
      </div>
      <h4 className="m-0 mb-1 text-[17px] font-bold tracking-tight">
        {recommendedClub}
      </h4>
      <div className="text-[11px] text-white/55 mb-4">
        Anbefalt for neste slag — {toGreen} m til flagg
      </div>

      <div className="flex justify-between items-baseline py-2 border-b border-white/10">
        <span className="text-xs text-white/60">Skuddlengde</span>
        <span className="text-xl font-bold tabular-nums">
          {shotDistance}
          <span className="text-xs ml-0.5 opacity-60">m</span>
        </span>
      </div>
      <div className="flex justify-between items-baseline py-2">
        <span className="text-xs text-white/60">Til green</span>
        <span className="text-xl font-bold tabular-nums">
          {toGreen}
          <span className="text-xs ml-0.5 opacity-60">m</span>
        </span>
      </div>

      <div className="mt-4 pt-3 border-t border-dashed border-white/10">
        <div className="font-mono text-[10px] tracking-[0.14em] uppercase text-white/55 mb-2.5">
          Slag til ferdig
        </div>
        <div
          className="grid items-baseline text-xs gap-2"
          style={{ gridTemplateColumns: "1fr auto" }}
        >
          <span className="text-white/60">Snitt</span>
          <span className="font-semibold tabular-nums">
            {shotsToFinish.average.toFixed(1)}
          </span>
          <span className="text-white/60">Fairway</span>
          <span className="font-semibold tabular-nums">
            {shotsToFinish.fairway.toFixed(1)}
          </span>
          <span className="text-white/60">Rough</span>
          <span className="font-semibold tabular-nums">
            {shotsToFinish.rough.toFixed(1)}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelect}
        className="w-full mt-4 py-2.5 rounded-lg bg-[#D1F843] text-[#0A1F18] font-semibold text-sm flex items-center justify-center gap-1.5"
      >
        Velg klubbe
        <ChevronRight className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </div>
  );
}
