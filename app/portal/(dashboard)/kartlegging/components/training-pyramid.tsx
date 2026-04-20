"use client";

/**
 * TrainingPyramid — bruker AKPyramide pattern (P-04) for §5.1.
 * Mapper fordeling til FYS/TEK/SLAG/SPILL/TURN.
 */

import { AKPyramide, type PyramideLevel } from "@/components/portal/patterns";
import { MonoLabel } from "@/components/portal/patterns";
import type { TrainingIndex } from "@/lib/portal/kartlegging";

interface TrainingPyramidProps {
  index: TrainingIndex;
  categoryLabel: string;
}

export function TrainingPyramid({ index, categoryLabel }: TrainingPyramidProps) {
  const d = index.distribution;
  const weekly = index.weeklyHours;

  // Mapper fordeling til AK-pyramidens 5 lag
  const data: { level: PyramideLevel; percent: number; value: string }[] = [
    {
      level: "FYS",
      percent: Math.round(d.physicalMental * 100),
      value: hoursFormat(d.physicalMental * weekly),
    },
    {
      level: "TEK",
      percent: Math.round(d.skillTechnical * 100),
      value: hoursFormat(d.skillTechnical * weekly),
    },
    {
      level: "SLAG",
      percent: Math.round(d.shortGame * 100),
      value: hoursFormat(d.shortGame * weekly),
    },
    {
      level: "SPILL",
      percent: Math.round(d.putting * 100),
      value: hoursFormat(d.putting * weekly),
    },
    {
      level: "TURN",
      percent: Math.round(d.onCourse * 100),
      value: hoursFormat(d.onCourse * weekly),
    },
  ];

  const [recMin, recMax] = index.recommendedSummer;
  const weeklyStatus =
    weekly < recMin
      ? { label: "Under anbefalt", tone: "warning" as const }
      : weekly > recMax
        ? { label: "Over anbefalt", tone: "warning" as const }
        : { label: "På nivå", tone: "success" as const };

  const insight = buildInsight(d.onCourse, categoryLabel);

  return (
    <div className="space-y-4">
      <AKPyramide
        data={data}
        readOnly
        title="Din treningsfordeling · siste 30 dager"
        subtitle={`${weekly.toFixed(1)} t/uke · Anbefalt for ${categoryLabel}: ${recMin}–${recMax} t/uke (sommer)`}
      />

      <div className="rounded-xl bg-surface-container-lowest shadow-card p-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <MonoLabel size="xs" uppercase className="text-on-surface-variant">
              Status
            </MonoLabel>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                weeklyStatus.tone === "success"
                  ? "bg-success-light text-success-text"
                  : "bg-warning-light text-warning-text"
              }`}
            >
              {weeklyStatus.label}
            </span>
          </div>
          <span className="text-on-surface-variant/80 tabular-nums">
            {weekly.toFixed(1)}t / {recMin}–{recMax}t
          </span>
        </div>

        {insight && (
          <p className="mt-3 text-xs leading-relaxed text-on-surface-variant/80 border-t border-outline-variant/20 pt-3">
            {insight}
          </p>
        )}
      </div>
    </div>
  );
}

function hoursFormat(hours: number): string {
  if (hours < 0.1) return "—";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  return `${hours.toFixed(1)}h`;
}

function buildInsight(
  onCourseRatio: number,
  categoryLabel: string
): string | null {
  if (onCourseRatio < 0.3) return null;
  const pct = Math.round(onCourseRatio * 100);
  if (onCourseRatio > 0.6) {
    return `Du har brukt ${pct}% av tiden på banen. Spillere i ${categoryLabel} som flyttet seg mot 40/60 (bane/ferdighet) fikk i snitt +0.8 SG på 90 dager. Målrettet ferdighetstrening gir mer utvikling enn flere runder.`;
  }
  if (onCourseRatio > 0.45) {
    return `Du har ${pct}% banegolf. Det fungerer, men mer ferdighetstrening gir større utvikling per time.`;
  }
  return null;
}
