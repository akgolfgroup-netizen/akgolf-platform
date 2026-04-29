"use client";

import type { BlockType, DayColumn } from "./types";

const BLOCK_STYLES: Record<BlockType, { bg: string; border: string; dashed?: boolean; muted?: boolean }> = {
  range: {
    bg: "rgba(209,248,67,0.12)",
    border: "rgba(209,248,67,0.30)",
  },
  short: {
    bg: "rgba(107,177,255,0.14)",
    border: "rgba(107,177,255,0.30)",
  },
  putt: {
    bg: "rgba(175,82,222,0.14)",
    border: "rgba(175,82,222,0.30)",
  },
  fysisk: {
    bg: "rgba(232,185,103,0.14)",
    border: "rgba(232,185,103,0.30)",
  },
  runde: {
    bg: "rgba(42,125,90,0.20)",
    border: "rgba(42,125,90,0.40)",
  },
  rest: {
    bg: "rgba(255,255,255,0.04)",
    border: "rgba(255,255,255,0.10)",
    dashed: true,
    muted: true,
  },
};

type Props = {
  days: DayColumn[];
  onAddBlock?: (dayId: string) => void;
};

export function DayBoard({ days, onAddBlock }: Props) {
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => (
        <div
          key={day.id}
          className="min-h-[380px] rounded-xl border p-2.5"
          style={{ background: "#0D2E23", borderColor: "#1a4a3a" }}
        >
          <div
            className="mb-2 flex items-center justify-between border-b pb-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.12em] text-white/55"
            style={{ borderColor: "rgba(255,255,255,0.05)" }}
          >
            <span>{day.label}</span>
            <span style={{ color: "#D1F843" }}>{day.blocks.length}</span>
          </div>

          {day.blocks.map((block) => {
            const style = BLOCK_STYLES[block.type];
            return (
              <div
                key={block.id}
                draggable
                className="mb-1.5 cursor-grab rounded-md border px-2.5 py-2 text-[11.5px] leading-tight"
                style={{
                  background: style.bg,
                  borderColor: style.border,
                  borderStyle: style.dashed ? "dashed" : "solid",
                  color: style.muted ? "rgba(255,255,255,0.5)" : undefined,
                }}
              >
                <div
                  className="font-bold"
                  style={{ color: style.muted ? "rgba(255,255,255,0.65)" : "#fff" }}
                >
                  {block.name}
                </div>
                <div className="mt-0.5 font-mono text-[9px] tracking-[0.05em] text-white/60">
                  {block.meta}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={() => onAddBlock?.(day.id)}
            className="mt-1 w-full cursor-pointer rounded-md border border-dashed px-2 py-2 text-center font-mono text-[9.5px] tracking-[0.10em] text-white/40 transition hover:border-[rgba(209,248,67,0.30)] hover:text-[#D1F843]"
            style={{ borderColor: "rgba(255,255,255,0.10)" }}
          >
            + LEGG TIL
          </button>
        </div>
      ))}
    </div>
  );
}
