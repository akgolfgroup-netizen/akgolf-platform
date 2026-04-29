"use client";

import { ArrowRight } from "lucide-react";
import type { SessionLevel } from "./types";

interface SidePyramidProps {
  distribution: Record<SessionLevel, number>;
  weekBias: string;
}

const ORDER: { key: SessionLevel; label: string; classKey: string }[] = [
  { key: "fys", label: "FYS", classKey: "fys" },
  { key: "tek", label: "TEK", classKey: "tek" },
  { key: "slag", label: "SLAG", classKey: "slag" },
  { key: "spill", label: "SPILL", classKey: "spill" },
  { key: "turn", label: "TURN", classKey: "turn" },
];

const LEVEL_BG: Record<SessionLevel, string> = {
  fys: "rgba(111,203,161,0.20)",
  tek: "rgba(122,184,224,0.20)",
  slag: "rgba(224,199,122,0.20)",
  spill: "rgba(212,154,106,0.20)",
  turn: "rgba(197,137,232,0.20)",
};

const LEVEL_BORDER: Record<SessionLevel, string> = {
  fys: "rgba(111,203,161,0.50)",
  tek: "rgba(122,184,224,0.50)",
  slag: "rgba(224,199,122,0.50)",
  spill: "rgba(212,154,106,0.50)",
  turn: "rgba(197,137,232,0.50)",
};

const LEVEL_FG: Record<SessionLevel, string> = {
  fys: "#6FCBA1",
  tek: "#7AB8E0",
  slag: "#E0C77A",
  spill: "#D49A6A",
  turn: "#C589E8",
};

export function SidePyramid({ distribution, weekBias }: SidePyramidProps) {
  return (
    <div className="flex flex-col gap-3.5">
      <div
        className="text-[12px] leading-[1.5]"
        style={{ color: "rgba(255,255,255,0.7)" }}
      >
        AK-pyramiden er rammeverket vi bruker for å fordele tid mellom de fem
        nivåene. Klikk på et nivå for å filtrere øvelsesbanken.
      </div>
      <div className="grid grid-cols-5 gap-1 rounded-[10px] overflow-hidden">
        {ORDER.map((o) => {
          const pct = distribution[o.key] ?? 0;
          return (
            <button
              key={o.key}
              type="button"
              className="rounded-lg px-1.5 py-2.5 text-center font-mono text-[9px] font-bold uppercase tracking-[0.12em] transition-colors"
              style={{
                background: LEVEL_BG[o.key],
                border: `1px solid ${LEVEL_BORDER[o.key]}`,
                color: LEVEL_FG[o.key],
                fontFamily: "var(--font-jetbrains-mono)",
              }}
            >
              <span
                className="block font-extrabold mb-1"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "16px",
                  letterSpacing: "-0.02em",
                  color: LEVEL_FG[o.key],
                }}
              >
                {pct}%
              </span>
              {o.label}
            </button>
          );
        })}
      </div>
      <div
        className="font-mono text-[9px] uppercase tracking-[0.10em]"
        style={{
          color: "rgba(255,255,255,0.45)",
          fontFamily: "var(--font-jetbrains-mono)",
        }}
      >
        Faktisk fordeling siste 30 dager — mål: 25/25/20/20/10
      </div>

      <div
        className="rounded-[12px] p-3.5 mt-2"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <div
          className="font-mono text-[9px] uppercase tracking-[0.14em] mb-2"
          style={{ color: "#D1F843", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          Ukens bias
        </div>
        <div
          className="text-[13px] font-semibold leading-[1.45] text-white"
        >
          {weekBias}
        </div>
        <button
          type="button"
          className="mt-3 inline-flex items-center gap-1.5 rounded-[10px] px-3 py-1.5 text-[12px] font-semibold"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.85)",
          }}
        >
          Se forslag
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
