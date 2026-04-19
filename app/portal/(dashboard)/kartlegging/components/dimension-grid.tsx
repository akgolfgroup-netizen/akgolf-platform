"use client";

import { getSkillLevelByCode } from "@/lib/portal/golf/skill-levels";
import type { DimensionBreakdown } from "@/lib/portal/kartlegging";

interface DimensionGridProps {
  dimensions: DimensionBreakdown[];
}

const GAP_LABELS = {
  strength: { label: "Styrke", bg: "bg-success-light", text: "text-success-text" },
  "on-level": { label: "På nivå", bg: "bg-portal-hover", text: "text-portal-secondary" },
  gap: { label: "Gap", bg: "bg-error-light", text: "text-error-text" },
} as const;

export function DimensionGrid({ dimensions }: DimensionGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {dimensions.map((d) => {
        const level = getSkillLevelByCode(d.category);
        const style = GAP_LABELS[d.gap];
        return (
          <div
            key={d.dimension}
            className="bg-portal-card rounded-2xl p-5 text-center shadow-portal-glow-green border border-portal-border-subtle transition-all duration-300 hover:-translate-y-px hover:shadow-portal-card-hover"
          >
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
              {d.label}
            </span>

            <div
              className="mt-2 font-extrabold tabular-nums"
              style={{
                fontSize: "var(--text-stat-lg, 44px)",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: level?.color ?? "var(--color-primary)",
              }}
            >
              {d.category}
            </div>

            <p className="mt-1 text-sm tabular-nums text-portal-secondary">
              {d.sgValue >= 0 ? "+" : ""}
              {d.sgValue.toFixed(2)} SG
            </p>

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
  );
}
