"use client";

import type { WeekTab } from "./types";

type Props = {
  weeks: WeekTab[];
  activeId: string;
  onSelect: (id: string) => void;
};

export function WeekTabs({ weeks, activeId, onSelect }: Props) {
  return (
    <div className="mb-3.5 flex gap-2">
      {weeks.map((w) => {
        const active = w.id === activeId;
        return (
          <button
            key={w.id}
            type="button"
            onClick={() => onSelect(w.id)}
            className="flex-1 cursor-pointer rounded-xl border px-3.5 py-2.5 text-left transition"
            style={{
              background: active ? "rgba(209,248,67,0.06)" : "#0D2E23",
              borderColor: active ? "rgba(209,248,67,0.40)" : "#1a4a3a",
            }}
          >
            <div
              className="font-mono text-[9.5px] font-bold uppercase tracking-[0.10em]"
              style={{ color: active ? "#D1F843" : "rgba(255,255,255,0.5)" }}
            >
              {w.label}
            </div>
            <div className="mt-0.5 text-[13px] font-bold text-white">
              {w.range}
            </div>
            <div className="mt-px font-mono text-[9.5px] text-white/50">
              {w.blocks} BLOKKER · {w.hours} t
              {w.taper ? " · TAPER" : ""}
            </div>
          </button>
        );
      })}
    </div>
  );
}
