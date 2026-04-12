"use client";

import { motion } from "framer-motion";
import { PremiumCard } from "./premium-card";

interface FocusCategory {
  label: string;
  percent: number;
  color: "green" | "warning" | "error";
}

interface StrokesGainedCardProps {
  categories?: FocusCategory[];
  delay?: number;
}

const DEFAULT_CATEGORIES: FocusCategory[] = [
  { label: "Putting (under 3m)", percent: 82, color: "green" },
  { label: "Short game (chip & pitch)", percent: 65, color: "warning" },
  { label: "Driving presisjon", percent: 71, color: "green" },
  { label: "Jern-spill (approach)", percent: 58, color: "error" },
];

const GRADIENT_MAP = {
  green: "linear-gradient(90deg, var(--color-primary), var(--color-green-bright))",
  warning: "linear-gradient(90deg, var(--color-warning), #FFB84D)",
  error: "linear-gradient(90deg, var(--color-error), #FF6B60)",
};

export function StrokesGainedCard({
  categories = DEFAULT_CATEGORIES,
  delay = 0,
}: StrokesGainedCardProps) {
  return (
    <PremiumCard delay={delay} className="h-full">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
            Fokusomraader
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-portal-muted)]">Basert paa siste 5 okter</p>
        </div>
        <span className="rounded-md border border-ai/15 bg-ai/[0.08] px-2.5 py-1 text-[10px] font-semibold text-ai">
          AI-analyse
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {categories.map((cat, i) => (
          <div key={cat.label} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-text">{cat.label}</span>
              <span className="text-sm font-bold tabular-nums text-[var(--color-portal-text)]">
                {cat.percent}%
              </span>
            </div>
            <div className="relative h-[5px] overflow-hidden rounded-full bg-black/[0.05]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.percent}%` }}
                transition={{
                  duration: 1.2,
                  delay: delay + 0.2 + i * 0.1,
                  ease: [0.34, 1.56, 0.64, 1],
                }}
                className="relative h-full rounded-full"
                style={{ background: GRADIENT_MAP[cat.color] }}
              >
                {/* Glow blur on end */}
                <div
                  className="absolute bottom-0 right-0 top-0 w-5 rounded-full opacity-50 blur-[6px]"
                  style={{ background: GRADIENT_MAP[cat.color] }}
                />
              </motion.div>
            </div>
          </div>
        ))}
      </div>
    </PremiumCard>
  );
}
