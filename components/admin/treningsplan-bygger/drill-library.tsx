"use client";

import { Brain, CircleDot, Dumbbell, Flag, Search, Target } from "lucide-react";
import type { DrillCategory, IconBlock, LibrarySection } from "./types";

const ICON_MAP: Record<DrillCategory, IconBlock> = {
  putting: {
    Icon: CircleDot,
    bg: "rgba(175,82,222,0.18)",
    color: "#C99CF3",
  },
  long: {
    Icon: Target,
    bg: "rgba(209,248,67,0.15)",
    color: "#D1F843",
  },
  short: {
    Icon: Flag,
    bg: "rgba(107,177,255,0.18)",
    color: "#6BB1FF",
  },
  fysisk: {
    Icon: Dumbbell,
    bg: "rgba(232,185,103,0.18)",
    color: "#E8B967",
  },
  mental: {
    Icon: Brain,
    bg: "rgba(196,138,50,0.20)",
    color: "#E8B967",
  },
};

type Props = {
  sections: LibrarySection[];
};

export function DrillLibrary({ sections }: Props) {
  return (
    <aside
      className="sticky top-4 max-h-[calc(100vh-100px)] overflow-y-auto rounded-2xl border p-4"
      style={{
        background: "#0D2E23",
        borderColor: "#1a4a3a",
      }}
    >
      <h4 className="mb-1.5 mt-0 px-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
        Søk
      </h4>
      <label
        className="mb-1.5 flex items-center gap-2 rounded-lg border px-2.5 py-2"
        style={{
          background: "rgba(0,0,0,0.20)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <Search className="h-3 w-3 text-white/45" strokeWidth={2} />
        <input
          type="text"
          placeholder="Drill-navn…"
          className="flex-1 border-0 bg-transparent text-[12px] text-white outline-none placeholder:text-white/35"
        />
      </label>

      {sections.map((section) => (
        <div key={section.id}>
          <h4 className="mb-1.5 mt-3.5 px-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em] text-white/50">
            {section.title}
          </h4>
          {section.drills.map((drill) => {
            const cfg = ICON_MAP[drill.category];
            const Icon = cfg.Icon;
            return (
              <div
                key={drill.id}
                draggable
                className="mb-1.5 flex cursor-grab items-start gap-2.5 rounded-lg border px-3 py-2.5 transition hover:border-[rgba(209,248,67,0.30)]"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: "rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-md"
                  style={{ background: cfg.bg, color: cfg.color }}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold leading-tight text-white">
                    {drill.name}
                  </div>
                  <div className="mt-0.5 font-mono text-[9.5px] tracking-[0.06em] text-white/50">
                    {drill.meta}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
