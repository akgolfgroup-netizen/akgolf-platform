"use client";

import { useMemo } from "react";
import { PremiumCard } from "./premium-card";
import { NumberTicker } from "./number-ticker";

interface HandicapSparklineCardProps {
  history: number[];
  currentHcp: number | null;
  delay?: number;
}

export function HandicapSparklineCard({
  history,
  currentHcp,
  delay = 0,
}: HandicapSparklineCardProps) {
  const hasData = history.length > 1;

  // Build SVG path from data
  const { linePath, areaPath, points, labels } = useMemo(() => {
    if (!hasData) return { linePath: "", areaPath: "", points: [], labels: [] };

    const w = 500;
    const h = 150;
    const padY = 10;
    const min = Math.min(...history);
    const max = Math.max(...history);
    const range = max - min || 1;

    const pts = history.map((val, i) => ({
      x: (i / (history.length - 1)) * w,
      // Invert: lower HCP = higher on chart
      y: padY + ((val - min) / range) * (h - 2 * padY),
      val,
    }));

    // Smooth curve through points
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const curr = pts[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
      d += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
    }

    const area = `${d} L${w},${h} L0,${h} Z`;

    const lbls = pts
      .filter((_, i) => i % 2 === 0 || i === pts.length - 1)
      .map((p, i, arr) => ({
        x: p.x,
        text: `R${history.indexOf(p.val) + 1}: ${p.val.toFixed(1)}`,
        isLast: i === arr.length - 1,
      }));

    return { linePath: d, areaPath: area, points: pts, labels: lbls };
  }, [history, hasData]);

  return (
    <PremiumCard delay={delay} className="h-full">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Scoring-trend
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-portal-muted)]">
            Siste {history.length} runder
          </p>
        </div>
        {currentHcp !== null && (
          <div className="flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.08] px-3 py-1">
            <NumberTicker
              value={currentHcp}
              decimalPlaces={1}
              delay={delay + 0.3}
              className="text-xs font-bold tabular-nums text-primary"
            />
          </div>
        )}
      </div>

      {hasData ? (
        <div>
          <svg
            viewBox="0 0 500 150"
            preserveAspectRatio="none"
            className="h-[150px] w-full"
          >
            {/* Grid lines */}
            <line x1="0" y1="37" x2="500" y2="37" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            <line x1="0" y1="112" x2="500" y2="112" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />

            <defs>
              <linearGradient id="sparkAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="sparkLineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--color-green-bright)" stopOpacity="1" />
              </linearGradient>
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Area fill */}
            <path d={areaPath} fill="url(#sparkAreaGrad)" />

            {/* Line with glow */}
            <path
              d={linePath}
              fill="none"
              stroke="url(#sparkLineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#lineGlow)"
            />

            {/* Data points */}
            {points.map((p, i) => {
              const isLast = i === points.length - 1;
              if (i % 2 !== 0 && !isLast) return null;
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r={isLast ? 5 : 3.5}
                  fill={isLast ? "var(--color-green-bright)" : "white"}
                  stroke={isLast ? "white" : "var(--color-primary)"}
                  strokeWidth="2"
                  filter={isLast ? "url(#lineGlow)" : undefined}
                />
              );
            })}
          </svg>

          {/* Labels */}
          <div className="mt-2 flex justify-between">
            {labels.map((l) => (
              <span
                key={l.text}
                className={`text-[10px] ${
                  l.isLast
                    ? "font-semibold text-[var(--color-green-bright)]"
                    : "text-[var(--color-portal-muted)]"
                }`}
              >
                {l.text}
              </span>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-[150px] items-center justify-center rounded-xl bg-black/[0.02] text-sm text-[var(--color-portal-muted)]">
          Registrer flere runder for aa se trenden
        </div>
      )}
    </PremiumCard>
  );
}
