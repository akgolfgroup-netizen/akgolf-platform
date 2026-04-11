"use client";

import { motion } from "framer-motion";
import { EASE_ENTRANCE } from "@/lib/design-tokens";

interface StrokesGainedCategory {
  label: string;
  value: number;
}

interface StrokesGainedCardProps {
  categories?: StrokesGainedCategory[];
  /** Animation stagger delay */
  delay?: number;
}

const DEFAULT_CATEGORIES: StrokesGainedCategory[] = [
  { label: "Tee", value: 1.2 },
  { label: "Approach", value: 0.4 },
  { label: "Kort spill", value: -1.8 },
  { label: "Putting", value: -0.6 },
];

export function StrokesGainedCard({
  categories = DEFAULT_CATEGORIES,
  delay = 0,
}: StrokesGainedCardProps) {
  const maxAbsValue = Math.max(...categories.map((c) => Math.abs(c.value)), 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
      className="rounded-xl bg-white p-5 shadow-card"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        Strokes Gained
      </p>

      <div className="mt-4 flex flex-col gap-3.5">
        {categories.map((cat, i) => {
          const isPositive = cat.value >= 0;
          const widthPercent = (Math.abs(cat.value) / maxAbsValue) * 100;

          return (
            <div key={cat.label} className="flex items-center gap-3">
              {/* Category label */}
              <span className="w-20 shrink-0 text-sm font-medium text-text">
                {cat.label}
              </span>

              {/* Bar container */}
              <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-grey-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPercent}%` }}
                  transition={{
                    duration: 0.8,
                    delay: delay + 0.2 + i * 0.1,
                    ease: EASE_ENTRANCE,
                  }}
                  className={`h-full rounded-full ${
                    isPositive ? "bg-success" : "bg-error"
                  }`}
                />
              </div>

              {/* Value */}
              <span
                className={`w-12 text-right text-sm font-semibold tabular-nums ${
                  isPositive ? "text-success" : "text-error"
                }`}
              >
                {isPositive ? "+" : ""}
                {cat.value.toFixed(1)}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
