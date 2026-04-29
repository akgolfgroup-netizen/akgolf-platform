"use client";

import { Rocket, Target, Hand, CircleDot, type LucideIcon } from "lucide-react";
import { DrillCard, type Drill } from "./drill-card";

export type SectionCategory = "DR" | "APP" | "ARG" | "PT";

const ICONS: Record<SectionCategory, LucideIcon> = {
  DR: Rocket,
  APP: Target,
  ARG: Hand,
  PT: CircleDot,
};

const ICON_COLOR: Record<SectionCategory, string> = {
  DR: "var(--akgolf-accent, #D1F843)",
  APP: "#6BB1FF",
  ARG: "#C99CF3",
  PT: "#E8B967",
};

const TITLES: Record<SectionCategory, string> = {
  DR: "Driver",
  APP: "Approach",
  ARG: "Around-Green",
  PT: "Putting",
};

export interface CategorySectionData {
  category: SectionCategory;
  count: number;
  subtitle: string;
  drills: Drill[];
}

export function CategorySection({ data }: { data: CategorySectionData }) {
  const Icon = ICONS[data.category];
  const color = ICON_COLOR[data.category];
  return (
    <section className="mb-8">
      <h3 className="m-0 mb-3.5 font-display text-lg text-white font-bold tracking-[-0.02em] flex items-center gap-3">
        <Icon className="w-[18px] h-[18px]" style={{ color }} />
        {TITLES[data.category]}
        <span className="font-mono text-[10px] font-bold tracking-[0.14em] uppercase text-white/45 bg-white/[0.04] px-2 py-0.5 rounded-md">
          {data.category} · {data.count} drills
        </span>
        <span className="ml-auto text-xs text-white/50 font-medium">
          {data.subtitle}
        </span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {data.drills.map((drill) => (
          <DrillCard key={drill.id} drill={drill} />
        ))}
      </div>
    </section>
  );
}
