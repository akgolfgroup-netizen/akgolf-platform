"use client";

import { PremiumCard } from "./premium-card";
import { NumberTicker } from "./number-ticker";

export interface PlayerCategoryData {
  code: string;
  level: string;
  scoreRange: string;
  avgScore: number;
  handicap: number;
  totalSG: number;
}

interface PlayerCategoryCardProps {
  data: PlayerCategoryData;
  delay?: number;
}

export function PlayerCategoryCard({ data, delay = 0 }: PlayerCategoryCardProps) {
  const isPositiveSG = data.totalSG >= 0;

  return (
    <PremiumCard delay={delay} glow="green">
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {/* Kategori */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Kategori
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-[var(--color-portal-text)]">
              {data.code}
            </span>
            <span className="rounded-md bg-[var(--color-portal-hover)] px-2 py-0.5 text-[10px] font-semibold text-[var(--color-portal-secondary)]">
              {data.level}
            </span>
          </div>
        </div>

        {/* Snittslag */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Snittslag
          </p>
          <p className="text-3xl font-extrabold tracking-tight tabular-nums text-[var(--color-portal-text)]">
            <NumberTicker value={data.avgScore} decimalPlaces={1} delay={delay + 0.2} />
          </p>
          <p className="text-[10px] text-[var(--color-portal-muted)]">
            Range: {data.scoreRange}
          </p>
        </div>

        {/* Handicap */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Handicap Index
          </p>
          <p className="text-3xl font-extrabold tracking-tight tabular-nums text-[var(--color-portal-text)]">
            <NumberTicker value={data.handicap} decimalPlaces={1} delay={delay + 0.3} />
          </p>
        </div>

        {/* Total SG */}
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Total Strokes Gained
          </p>
          <div className="flex items-baseline gap-1.5">
            <p
              className={`text-3xl font-extrabold tracking-tight tabular-nums ${
                isPositiveSG
                  ? "text-[var(--color-success)]"
                  : "text-[var(--color-error)]"
              }`}
            >
              <NumberTicker
                value={data.totalSG}
                decimalPlaces={2}
                prefix={isPositiveSG ? "+" : ""}
                delay={delay + 0.4}
              />
            </p>
            <span className="text-[10px] text-[var(--color-portal-muted)]">per runde</span>
          </div>
        </div>
      </div>
    </PremiumCard>
  );
}
