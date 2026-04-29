"use client";

import {
  Layers,
  Rocket,
  Target,
  Hand,
  CircleDot,
  Plus,
  type LucideIcon,
} from "lucide-react";

export type CategoryKey = "all" | "DR" | "APP" | "ARG" | "PT";

const ICONS: Record<CategoryKey, LucideIcon> = {
  all: Layers,
  DR: Rocket,
  APP: Target,
  ARG: Hand,
  PT: CircleDot,
};

const LABELS: Record<CategoryKey, string> = {
  all: "Alle",
  DR: "Driver",
  APP: "Approach",
  ARG: "Around-Green",
  PT: "Putting",
};

export interface CategoryCounts {
  all: number;
  DR: number;
  APP: number;
  ARG: number;
  PT: number;
}

export function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: CategoryKey;
  onChange: (k: CategoryKey) => void;
  counts: CategoryCounts;
}) {
  const keys: CategoryKey[] = ["all", "DR", "APP", "ARG", "PT"];

  return (
    <div className="flex justify-between items-center my-7 mb-4">
      <div className="inline-flex bg-white/[0.04] border border-white/[0.06] rounded-xl p-1 gap-0.5">
        {keys.map((key) => {
          const Icon = ICONS[key];
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={[
                "px-3.5 py-2 rounded-lg flex items-center gap-1.5 text-[12.5px] font-semibold transition",
                isActive
                  ? "bg-[#D1F843]/[0.18] text-[#D1F843]"
                  : "bg-transparent text-white/60 hover:text-white",
              ].join(" ")}
            >
              <Icon className="w-[13px] h-[13px]" />
              {LABELS[key]}
              <span
                className={[
                  "font-mono text-[10px] px-1 py-0 rounded ml-0.5",
                  isActive
                    ? "bg-black/20 text-[#D1F843]"
                    : "bg-white/10 text-white/70",
                ].join(" ")}
              >
                {counts[key]}
              </span>
            </button>
          );
        })}
      </div>
      <button className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white hover:bg-white/10 transition">
        <Plus className="w-3.5 h-3.5" />
        Legg til drill
      </button>
    </div>
  );
}
