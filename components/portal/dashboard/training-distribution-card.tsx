"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { PremiumCard } from "./premium-card";

export interface TrainingCategory {
  label: string;
  fullLabel: string;
  percentage: number;
}

interface TrainingDistributionCardProps {
  categories?: TrainingCategory[];
  period?: string;
  delay?: number;
}

const DEFAULT_CATEGORIES: TrainingCategory[] = [
  { label: "TEK", fullLabel: "Teknikk", percentage: 35 },
  { label: "SLAG", fullLabel: "Golfslag", percentage: 15 },
  { label: "SPILL", fullLabel: "Strategi", percentage: 5 },
  { label: "FYS", fullLabel: "Fysisk", percentage: 45 },
];

export function TrainingDistributionCard({
  categories = DEFAULT_CATEGORIES,
  period = "GRUNN",
  delay = 0,
}: TrainingDistributionCardProps) {
  const maxValue = Math.max(...categories.map((c) => c.percentage));

  return (
    <PremiumCard delay={delay}>
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-[var(--color-primary)]" />
        <div>
          <p className="text-[15px] font-semibold text-[var(--color-portal-text)]">
            Treningspyramide
          </p>
          <p className="text-[10px] text-[var(--color-portal-muted)]">
            {period}-perioden
          </p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="mb-4 flex items-end justify-between gap-2" style={{ height: 64 }}>
        {categories.map((cat, i) => (
          <div key={cat.label} className="flex flex-1 flex-col items-center gap-1">
            <motion.div
              className="w-full origin-bottom rounded-t-sm bg-[var(--color-primary)]"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{
                duration: 0.5,
                delay: delay + 0.2 + i * 0.05,
                ease: "easeOut",
              }}
              style={{ height: `${(cat.percentage / maxValue) * 100}%` }}
            />
            <span className="text-[10px] font-semibold text-[var(--color-portal-muted)]">
              {cat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2.5 border-t border-black/[0.06] pt-3">
        {categories.map((cat) => (
          <div key={cat.label} className="flex items-center justify-between">
            <span className="text-xs text-[var(--color-portal-secondary)]">
              {cat.label} ({cat.fullLabel})
            </span>
            <span className="text-sm font-bold tabular-nums text-[var(--color-portal-text)]">
              {cat.percentage}%
            </span>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
