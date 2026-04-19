"use client";

import type { GapAnalysis } from "@/lib/portal/kartlegging";

interface GapAnalysisCardProps {
  gap: GapAnalysis;
}

export function GapAnalysisCard({ gap }: GapAnalysisCardProps) {
  if (!gap.targetCategory) {
    return (
      <div className="bg-portal-card rounded-[2rem] p-6 md:p-8 shadow-portal-card border border-portal-border-subtle text-center">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          Gap-analyse
        </span>
        <p className="mt-3 text-sm text-portal-text">
          Du er allerede på toppkategorien.
        </p>
      </div>
    );
  }

  const maxGap = Math.max(...gap.rows.map((r) => r.gap), 0.01);

  return (
    <div className="bg-portal-card rounded-[2rem] p-6 md:p-8 shadow-portal-card border border-portal-border-subtle">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          Veien til {gap.targetCategory}
        </span>
        <span className="text-[11px] text-portal-muted tabular-nums">
          Totalt +{gap.totalGap.toFixed(2)} SG
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {gap.rows.map((r) => {
          const fillPct = Math.min(100, (1 - r.gap / maxGap) * 100);
          return (
            <div key={r.dimension} className="flex items-center gap-3">
              <span className="w-24 text-sm font-medium text-portal-text">
                {r.label}
              </span>
              <div className="flex-1 h-[5px] rounded-full bg-portal-hover">
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
                className={`w-16 text-right text-sm font-semibold tabular-nums ${
                  r.isBottleneck ? "text-error-text" : "text-success-text"
                }`}
              >
                +{r.gap.toFixed(2)}
              </span>
              <span className="w-24 text-right text-[11px] text-portal-muted">
                {r.statusLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-portal-border-subtle">
        <p className="text-sm text-portal-secondary">
          Estimert tid:{" "}
          <span className="font-semibold text-portal-text">
            {gap.estimatedMonths !== null
              ? `${gap.estimatedMonths} måneder`
              : "—"}
          </span>
        </p>
        <p className="mt-1 text-xs text-portal-muted">{gap.assumption}</p>
      </div>
    </div>
  );
}
