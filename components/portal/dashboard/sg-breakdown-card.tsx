"use client";

import { motion } from "framer-motion";
import { Target, Flag, TrendingUp, CircleDot } from "lucide-react";
import { PremiumCard } from "./premium-card";
import { NumberTicker } from "./number-ticker";

export interface SGBreakdownStat {
  area: string;
  sgValue: number;
  percentage: number;
  trainingTime: string;
  trend: number;
}

interface SGBreakdownCardProps {
  stat: SGBreakdownStat;
  delay?: number;
}

const AREA_CONFIG: Record<string, { icon: typeof Target; colorClass: string }> = {
  "Tee (Driver/Wood)": { icon: Target, colorClass: "text-[var(--color-info)]" },
  "Approach >100m": { icon: Flag, colorClass: "text-[var(--color-error)]" },
  "Kortspill <100m": { icon: TrendingUp, colorClass: "text-[var(--color-success)]" },
  "Putting": { icon: CircleDot, colorClass: "text-[var(--color-ai)]" },
};

export function SGBreakdownCard({ stat, delay = 0 }: SGBreakdownCardProps) {
  const config = AREA_CONFIG[stat.area] ?? {
    icon: Target,
    colorClass: "text-[var(--color-portal-secondary)]",
  };
  const Icon = config.icon;
  const isPositive = stat.sgValue >= 0;

  return (
    <PremiumCard delay={delay} glow={isPositive ? "green" : undefined}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-portal-hover)]">
          <Icon className={`h-5 w-5 ${config.colorClass}`} />
        </div>
        <span
          className={`rounded-md px-2.5 py-1 text-xs font-bold tabular-nums ${
            isPositive
              ? "bg-[var(--color-success-light)] text-[var(--color-success-text)]"
              : "bg-[var(--color-error-light)] text-[var(--color-error-text)]"
          }`}
        >
          {isPositive ? "+" : ""}
          <NumberTicker value={stat.sgValue} decimalPlaces={2} delay={delay + 0.3} />
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-[var(--color-portal-secondary)]">
            {stat.area}
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--color-portal-muted)]">
            Strokes Gained per runde
          </p>
        </div>

        {/* SG Impact progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[var(--color-portal-muted)]">SG-innvirkning</span>
            <span className="font-semibold tabular-nums text-[var(--color-portal-text)]">
              {stat.percentage}%
            </span>
          </div>
          <div className="relative h-[5px] overflow-hidden rounded-full bg-black/[0.05]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stat.percentage}%` }}
              transition={{
                duration: 1.2,
                delay: delay + 0.4,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="h-full rounded-full bg-[var(--color-primary)]"
            />
          </div>
        </div>

        {/* Training time */}
        <div className="flex items-center justify-between border-t border-black/[0.06] pt-3">
          <span className="text-[10px] text-[var(--color-portal-muted)]">Treningstid</span>
          <span className="text-xs font-semibold text-[var(--color-portal-text)]">
            {stat.trainingTime}
          </span>
        </div>
      </div>
    </PremiumCard>
  );
}
