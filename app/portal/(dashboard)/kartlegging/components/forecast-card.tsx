"use client";

/**
 * ForecastCard — prognose baseline vs. justert plan.
 * Bruker BentoCard (light-variant) med SVG-linjer i brand-farger.
 */

import { BentoCard, BentoEyebrow } from "@/components/portal/patterns";
import type { ForecastPoint } from "../actions";

interface ForecastCardProps {
  points: ForecastPoint[];
}

export function ForecastCard({ points }: ForecastCardProps) {
  if (points.length === 0) return null;

  const allValues = points.flatMap((p) => [p.baseline, p.adjusted]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;

  const width = 480;
  const height = 160;
  const padX = 16;
  const padY = 12;
  const innerW = width - 2 * padX;
  const innerH = height - 2 * padY;

  function pointsToPath(key: "baseline" | "adjusted"): string {
    return points
      .map((p, i) => {
        const x = padX + (i / (points.length - 1)) * innerW;
        const y = padY + innerH - ((p[key] - min) / span) * innerH;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const last = points[points.length - 1];
  const gap = last.adjusted - last.baseline;

  return (
    <BentoCard variant="glass" padding="lg">
      <div className="flex items-center justify-between mb-3">
        <BentoEyebrow dotColor="#2A7D5A">12-ukers prognose</BentoEyebrow>
        <span className="text-[11px] text-surface/50">USI-utvikling</span>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-surface/60 mb-2">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] bg-surface-container-lowest/40" />
          Fortsett som nå
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] bg-secondary-fixed" />
          Følg anbefalt plan
        </span>
      </div>

      <svg
        className="w-full h-auto"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <path
          d={pointsToPath("baseline")}
          fill="none"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth={2}
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <path
          d={pointsToPath("adjusted")}
          fill="none"
          stroke="#D1F843"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="text-xs text-surface/70">
          Differanse om 12 uker
        </span>
        <span
          className={`text-sm font-semibold tabular-nums ${
            gap > 0.1 ? "text-secondary-fixed" : "text-surface"
          }`}
        >
          {gap > 0 ? "+" : ""}
          {gap.toFixed(2)} USI
        </span>
      </div>

      {gap > 0.3 && (
        <p className="mt-3 text-xs leading-relaxed text-surface/70">
          Gapet mellom linjene = hva du lar ligge på bordet. Å følge anbefalt
          plan gir +{gap.toFixed(2)} USI ekstra på 12 uker.
        </p>
      )}
    </BentoCard>
  );
}
