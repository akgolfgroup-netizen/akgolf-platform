"use client";

/**
 * GapAnalysisCard — bar-chart per dimensjon med flaskehals-markering.
 * Bruker design-system tokens (shadow-card, rounded-xl, text-on-surface-variant).
 */

import { MonoLabel } from "@/components/portal/patterns";
import type { GapAnalysis } from "@/lib/portal/kartlegging";

interface GapAnalysisCardProps {
  gap: GapAnalysis;
}

export function GapAnalysisCard({ gap }: GapAnalysisCardProps) {
  if (!gap.targetCategory) {
    return (
      <section className="rounded-xl bg-surface-container-lowest shadow-card p-6 text-center">
        <MonoLabel size="xs" uppercase className="text-on-surface-variant block">
          Gap-analyse
        </MonoLabel>
        <p className="mt-3 text-sm text-on-surface-variant/90">
          Du er allerede på toppkategorien.
        </p>
      </section>
    );
  }

  const maxGap = Math.max(...gap.rows.map((r) => r.gap), 0.01);

  return (
    <section className="rounded-xl bg-surface-container-lowest shadow-card p-6 md:p-8">
      <div className="flex items-baseline justify-between mb-1">
        <MonoLabel size="xs" uppercase className="text-primary">
          Veien til {gap.targetCategory}
        </MonoLabel>
        <span className="text-xs text-on-surface-variant tabular-nums">
          Totalt +{gap.totalGap.toFixed(2)} SG
        </span>
      </div>

      <div className="mt-5 space-y-3.5">
        {gap.rows.map((r) => {
          const fillPct = Math.min(100, (1 - r.gap / maxGap) * 100);
          return (
            <div key={r.dimension} className="grid grid-cols-[80px_1fr_64px_88px] items-center gap-3">
              <span className="text-sm font-medium text-on-surface-variant/90">
                {r.label}
              </span>
              <div className="h-[5px] rounded-full bg-surface-container overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${fillPct}%`,
                    background: r.isBottleneck
                      ? "var(--color-error)"
                      : "var(--color-success)",
                  }}
                />
              </div>
              <span
                className={`text-right text-sm font-semibold tabular-nums ${
                  r.isBottleneck ? "text-error-text" : "text-success-text"
                }`}
              >
                +{r.gap.toFixed(2)}
              </span>
              <span className="text-right text-[11px] text-on-surface-variant">
                {r.statusLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-baseline justify-between">
        <div>
          <p className="text-sm text-on-surface-variant/80">
            Estimert tid:{" "}
            <span className="font-semibold text-on-surface">
              {gap.estimatedMonths !== null
                ? `${gap.estimatedMonths} måneder`
                : "—"}
            </span>
          </p>
          <p className="mt-1 text-xs text-on-surface-variant">{gap.assumption}</p>
        </div>
      </div>
    </section>
  );
}
