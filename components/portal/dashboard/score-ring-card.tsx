"use client";

import { motion } from "framer-motion";
import { NumberTicker } from "./number-ticker";
import { PremiumCard } from "./premium-card";

interface ScoreMetric {
  label: string;
  value: string;
  trend?: "up" | "down";
}

interface ScoreRingCardProps {
  score: number;
  metrics: ScoreMetric[];
  delay?: number;
}

export function ScoreRingCard({
  score,
  metrics,
  delay = 0,
}: ScoreRingCardProps) {
  // SVG ring: 80% fill for score visualization
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const fillPercent = Math.min(score / 100, 1);
  const dashArray = `${circumference * fillPercent} ${circumference * (1 - fillPercent)}`;

  return (
    <PremiumCard delay={delay} className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Scoring & Spredning
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-portal-muted)]">Siste 10 runder</p>
        </div>
        <span className="rounded-md border border-primary/15 bg-primary/[0.08] px-2.5 py-1 text-[10px] font-semibold text-primary">
          Fremgang
        </span>
      </div>

      <div className="flex items-center gap-5">
        {/* SVG Ring */}
        <div className="relative h-[140px] w-[140px] shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(0,88,64,0.08) 0%, transparent 70%)",
            }}
          />
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            className="drop-shadow-[0_0_10px_rgba(0,88,64,0.15)]"
          >
            {/* Track */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.04)"
              strokeWidth="5"
              transform="rotate(-90 70 70)"
            />
            {/* Fill */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="5"
              strokeDasharray={dashArray}
              strokeLinecap="round"
              transform="rotate(-90 70 70)"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <NumberTicker
              value={score}
              delay={delay + 0.3}
              className="text-[44px] font-extrabold leading-none tracking-[-0.05em] text-[var(--color-portal-text)]"
            />
            <span className="mt-0.5 text-[11px] text-[var(--color-portal-muted)]">snitt score</span>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="grid flex-1 grid-cols-2 gap-2">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[10px] border border-black/[0.06] bg-black/[0.02] px-3 py-2.5 transition-colors duration-200 hover:border-black/[0.08] hover:bg-black/[0.04]"
            >
              <span className="block text-[11px] text-[var(--color-portal-muted)]">{m.label}</span>
              <span
                className={`mt-1 block text-lg font-bold tracking-[-0.03em] tabular-nums ${
                  m.trend === "up"
                    ? "text-success"
                    : m.trend === "down"
                      ? "text-error"
                      : "text-[var(--color-portal-text)]"
                }`}
              >
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PremiumCard>
  );
}
