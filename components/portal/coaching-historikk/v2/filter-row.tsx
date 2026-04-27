"use client";

import { Layers, User, Video, Activity, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { accent, monoFont } from "./styles";
import type { FilterType } from "./timeline-types";

interface Props {
  active: FilterType;
  onChange: (f: FilterType) => void;
  counts: Record<FilterType, number>;
}

const FILTERS: { key: FilterType; label: string; icon: LucideIcon }[] = [
  { key: "alle", label: "Alle", icon: Layers },
  { key: "individual", label: "Individual", icon: User },
  { key: "video", label: "Video-analyse", icon: Video },
  { key: "test", label: "Test", icon: Activity },
  { key: "tournament", label: "Turnering", icon: Trophy },
];

export function FilterRow({ active, onChange, counts }: Props) {
  return (
    <div className="mb-[18px] flex flex-wrap items-center gap-2.5">
      <span
        className="mr-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/45"
        style={{ fontFamily: monoFont }}
      >
        Filter
      </span>
      {FILTERS.map((f) => {
        const Icon = f.icon;
        const isActive = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            onClick={() => onChange(f.key)}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              background: isActive ? "rgba(209,248,67,0.18)" : "rgba(255,255,255,0.04)",
              borderColor: isActive ? "rgba(209,248,67,0.30)" : "rgba(255,255,255,0.06)",
              color: isActive ? accent : "rgba(255,255,255,0.7)",
            }}
          >
            <Icon className="h-3 w-3" />
            {f.label} ({counts[f.key]})
          </button>
        );
      })}
    </div>
  );
}
