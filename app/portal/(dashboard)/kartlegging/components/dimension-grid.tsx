"use client";

/**
 * DimensionGrid — bruker SGRing (P-01) + kategori-badges.
 * Viser total-ring + 4 kort med per-dim kategori fra pattern-biblioteket.
 */

import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";
import { MonoLabel, NightSurface, SGRing } from "@/components/portal/patterns";
import type { DimensionBreakdown } from "@/lib/portal/kartlegging";

interface DimensionGridProps {
  dimensions: DimensionBreakdown[];
}

const GAP_LABELS = {
  strength: { label: "Styrke", bg: "bg-success-light", text: "text-success-text" },
  "on-level": { label: "På nivå", bg: "bg-surface-container", text: "text-on-surface-variant/80" },
  gap: { label: "Gap", bg: "bg-error-light", text: "text-error-text" },
} as const;

export function DimensionGrid({ dimensions }: DimensionGridProps) {
  const map = new Map(dimensions.map((d) => [d.dimension, d]));
  const offTee = map.get("offTheTee");
  const approach = map.get("approach");
  const around = map.get("aroundTheGreen");
  const putt = map.get("putting");

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
      {/* SG Ring — total visualisering */}
      <NightSurface className="rounded-xl p-6 flex items-center justify-center">
        <SGRing
          offTee={offTee?.sgValue ?? 0}
          approach={approach?.sgValue ?? 0}
          short={around?.sgValue ?? 0}
          putt={putt?.sgValue ?? 0}
          size="md"
          showLegend
        />
      </NightSurface>

      {/* 4 dimension-kort */}
      <div className="grid grid-cols-2 gap-4">
        {dimensions.map((d) => {
          const level = getSkillLevelByCode(d.category);
          const style = GAP_LABELS[d.gap];
          const sign = d.sgValue >= 0 ? "+" : "";
          return (
            <div
              key={d.dimension}
              className="rounded-xl bg-surface-container-lowest shadow-card p-5 transition-shadow duration-200 hover:shadow-card-hover"
            >
              <MonoLabel size="xs" uppercase className="text-on-surface-variant block">
                {d.label}
              </MonoLabel>

              <div className="mt-3 flex items-baseline gap-2">
                <span
                  className="text-4xl font-bold tabular-nums tracking-tight"
                  style={{ color: level?.color ?? "#005840" }}
                >
                  {d.category}
                </span>
                <span className="text-sm text-on-surface-variant/80 tabular-nums">
                  {sign}
                  {d.sgValue.toFixed(2)} SG
                </span>
              </div>

              <div className="mt-3">
                <span
                  className={`inline-flex items-center rounded-full ${style.bg} px-2.5 py-0.5 text-[11px] font-medium ${style.text}`}
                >
                  {style.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
