"use client";

import type { ForecastPoint } from "../actions";

interface ForecastCardProps {
  points: ForecastPoint[];
}

export function ForecastCard({ points }: ForecastCardProps) {
  if (points.length === 0) {
    return null;
  }

  const allValues = points.flatMap((p) => [p.baseline, p.adjusted]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const span = max - min || 1;

  const width = 480;
  const height = 160;
  const padX = 24;
  const padY = 16;
  const innerW = width - 2 * padX;
  const innerH = height - 2 * padY;

  function pointsToPath(
    data: ForecastPoint[],
    key: "baseline" | "adjusted"
  ): string {
    return data
      .map((p, i) => {
        const x = padX + (i / (data.length - 1)) * innerW;
        const y =
          padY + innerH - ((p[key] - min) / span) * innerH;
        return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ");
  }

  const last = points[points.length - 1];
  const gap = last.adjusted - last.baseline;

  return (
    <div className="bg-portal-card rounded-2xl p-5 shadow-portal-card border border-portal-border-subtle">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-portal-muted">
          12-ukers prognose
        </span>
        <span className="text-[11px] text-portal-muted">
          USI-utvikling
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] bg-portal-muted" />
          <span className="text-portal-secondary">Fortsett som nå</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-[2px] bg-primary" />
          <span className="text-portal-secondary">Følg anbefalt plan</span>
        </div>
      </div>

      <svg
        className="mt-2 w-full h-auto"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
      >
        <path
          d={pointsToPath(points, "baseline")}
          fill="none"
          stroke="var(--color-muted)"
          strokeWidth={2}
          strokeDasharray="4 3"
          strokeLinecap="round"
        />
        <path
          d={pointsToPath(points, "adjusted")}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>

      <div className="mt-3 pt-3 border-t border-portal-border-subtle flex items-center justify-between">
        <span className="text-xs text-portal-secondary">
          Differanse om 12 uker
        </span>
        <span
          className={`text-sm font-semibold tabular-nums ${
            gap > 0.1 ? "text-success-text" : "text-portal-text"
          }`}
        >
          {gap > 0 ? "+" : ""}
          {gap.toFixed(2)} USI
        </span>
      </div>

      {gap > 0.3 && (
        <p className="mt-3 text-xs text-portal-secondary leading-relaxed">
          Gapet mellom linjene = hva du potensielt lar ligge på bordet. Å følge
          anbefalt plan gir {gap.toFixed(2)} USI ekstra på 12 uker.
        </p>
      )}
    </div>
  );
}
