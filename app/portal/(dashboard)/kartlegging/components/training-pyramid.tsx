"use client";

import type { TrainingIndex } from "@/lib/portal/kartlegging";

interface TrainingPyramidProps {
  index: TrainingIndex;
  categoryLabel: string;
}

export function TrainingPyramid({ index, categoryLabel }: TrainingPyramidProps) {
  const d = index.distribution;
  const bars = [
    {
      key: "onCourse",
      label: "Banegolf (18/9 hull)",
      value: d.onCourse,
      color: "var(--color-warning)",
    },
    {
      key: "skillTechnical",
      label: "Ferdighet (teknikk)",
      value: d.skillTechnical,
      color: "var(--color-primary)",
    },
    {
      key: "shortGame",
      label: "Kortspill",
      value: d.shortGame,
      color: "var(--color-primary-alt)",
    },
    {
      key: "putting",
      label: "Putting",
      value: d.putting,
      color: "var(--color-accent-cta)",
    },
    {
      key: "physicalMental",
      label: "Fysisk/mental",
      value: d.physicalMental,
      color: "var(--color-ai)",
    },
  ];

  const [recMin, recMax] = index.recommendedSummer;
  const weeklyLabel =
    index.weeklyHours < recMin
      ? "Under anbefalt"
      : index.weeklyHours > recMax
        ? "Over anbefalt"
        : "På nivå";

  const insight = buildInsight(d.onCourse, categoryLabel);

  return (
    <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          Din treningsfordeling siste 30 dager
        </span>
        <span className="text-[11px] tabular-nums text-portal-muted">
          {index.weeklyHours.toFixed(1)} t/uke
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {bars.map((b) => (
          <div key={b.key} className="flex items-center gap-3">
            <span className="w-36 text-xs text-portal-secondary">{b.label}</span>
            <div className="flex-1 h-[6px] rounded-full bg-portal-hover overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${b.value * 100}%`, background: b.color }}
              />
            </div>
            <span className="w-12 text-right text-xs tabular-nums font-semibold text-portal-text">
              {Math.round(b.value * 100)}%
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 pt-4 border-t border-portal-border-subtle space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-portal-secondary">
            Anbefalt for {categoryLabel} (sommer)
          </span>
          <span className="tabular-nums text-portal-text font-semibold">
            {recMin}-{recMax} t/uke
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-portal-secondary">Du ligger</span>
          <span className="text-portal-text font-semibold">{weeklyLabel}</span>
        </div>
      </div>

      {insight && (
        <div className="mt-4 rounded-lg bg-success-light px-3 py-2.5 text-xs leading-relaxed text-success-text">
          {insight}
        </div>
      )}
    </div>
  );
}

function buildInsight(
  onCourseRatio: number,
  categoryLabel: string
): string | null {
  if (onCourseRatio < 0.3) return null;
  const pct = Math.round(onCourseRatio * 100);
  if (onCourseRatio > 0.6) {
    return `Du har brukt ${pct}% av tiden på banen. Spillere i ${categoryLabel} som flyttet seg mot 40/60 (bane/ferdighet) fikk gjennomsnittlig +0.8 SG på 90 dager. Målrettet ferdighetstrening gir mer utvikling enn flere runder.`;
  }
  if (onCourseRatio > 0.45) {
    return `Du har ${pct}% banegolf. Det fungerer, men mer ferdighetstrening gir større utvikling per time.`;
  }
  return null;
}
