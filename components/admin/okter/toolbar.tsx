"use client";

import {
  Search,
  SlidersHorizontal,
  Zap,
  Target,
  CircleDot,
  Circle,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { FILTER_CHIPS } from "./mock-data";

const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  target: Target,
  "circle-dot": CircleDot,
  circle: Circle,
  trophy: Trophy,
};

export function OkterToolbar() {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2.5">
      <div className="inline-flex rounded-lg border border-[#1a4a3a] bg-[#0D2E23] p-0.5">
        <button
          type="button"
          className="rounded-md bg-accent/15 px-3.5 py-1.5 font-mono text-[12px] tracking-[0.06em] text-accent"
        >
          ALLE 154
        </button>
        <button
          type="button"
          className="rounded-md px-3.5 py-1.5 font-mono text-[12px] tracking-[0.06em] text-white/60 transition hover:text-white"
        >
          FULLFØRT 142
        </button>
        <button
          type="button"
          className="rounded-md px-3.5 py-1.5 font-mono text-[12px] tracking-[0.06em] text-white/60 transition hover:text-white"
        >
          PLANLAGT 12
        </button>
      </div>

      <div className="flex w-[280px] items-center gap-2 rounded-lg border border-[#1a4a3a] bg-[#0D2E23] px-3 py-2">
        <Search className="h-3.5 w-3.5 text-white/50" strokeWidth={1.8} />
        <input
          placeholder="Søk type, spiller, coach…"
          className="flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
        />
      </div>

      {FILTER_CHIPS.map((chip) => {
        const Icon = ICON_MAP[chip.iconName];
        return (
          <button
            key={chip.label}
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full border border-[#1a4a3a] bg-[#0D2E23] px-3 py-1.5 text-[12px] text-white/70 transition hover:border-accent/30 hover:bg-accent/10 hover:text-accent"
          >
            {Icon ? <Icon className="h-3 w-3" strokeWidth={1.8} /> : null}
            {chip.label} {chip.count}
          </button>
        );
      })}

      <button
        type="button"
        className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-[#1a4a3a] bg-[#0D2E23] px-3 py-1.5 text-[12px] text-white/70 transition hover:bg-white/5"
      >
        <SlidersHorizontal className="h-3 w-3" strokeWidth={1.8} /> Filter
      </button>
    </div>
  );
}
