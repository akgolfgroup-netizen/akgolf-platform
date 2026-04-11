"use client";

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { EASE_ENTRANCE } from "@/lib/design-tokens";
import { NumberTicker } from "./number-ticker";

interface StatCardProps {
  label: string;
  value: number;
  decimalPlaces?: number;
  unit?: string;
  change?: {
    value: number;
    positive?: boolean;
    label?: string;
  } | null;
  icon: LucideIcon;
  accentColor?: string;
  /** When true, a negative change is shown as positive (e.g. handicap) */
  lowerIsBetter?: boolean;
  /** Animation stagger index */
  index?: number;
}

export function StatCard({
  label,
  value,
  decimalPlaces = 0,
  unit,
  change,
  icon: Icon,
  accentColor = "var(--color-primary)",
  lowerIsBetter = false,
  index = 0,
}: StatCardProps) {
  const rawPositive = change?.positive ?? (change ? change.value >= 0 : true);
  const isPositive = lowerIsBetter ? !rawPositive : rawPositive;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: EASE_ENTRANCE,
      }}
      className="flex flex-col justify-between rounded-xl bg-white p-5 shadow-card"
    >
      {/* Label + Icon */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          {label}
        </p>
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg"
          style={{
            backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
          }}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" style={{ color: accentColor }} strokeWidth={1.75} />
        </div>
      </div>

      {/* Big number */}
      <div className="mt-3 flex items-baseline gap-1.5">
        <NumberTicker
          value={value}
          decimalPlaces={decimalPlaces}
          delay={0.2 + index * 0.1}
          className="text-4xl font-bold tracking-tight text-black"
        />
        {unit && (
          <span className="text-sm font-medium text-muted">{unit}</span>
        )}
      </div>

      {/* Context line */}
      <div className="mt-3">
        {change ? (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              isPositive
                ? "bg-success-light text-success-text"
                : "bg-error-light text-error-text",
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {change.value}
            {change.label ?? " siste 30d"}
          </div>
        ) : (
          <span className="text-xs text-muted">Siste 30 dager</span>
        )}
      </div>
    </motion.div>
  );
}
