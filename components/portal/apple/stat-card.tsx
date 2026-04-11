"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import type { LucideIcon } from "lucide-react";
import { ICON_MAP, type IconName } from "./icon-map";

/**
 * StatCard Props
 *
 * For ikoner, bruk EN av disse:
 * - `icon`: Lucide icon-komponent (kun i Client Components)
 * - `iconName`: String-basert icon-navn (fungerer i Server Components)
 */
interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  /** @deprecated i Server Components — bruk iconName i stedet */
  icon?: LucideIcon;
  /** Bruk dette i Server Components i stedet for icon */
  iconName?: IconName;
  iconColor?: string;
  iconBg?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: {
    value: "text-2xl",
    label: "text-xs",
    icon: "w-8 h-8",
    iconInner: "w-4 h-4",
  },
  md: {
    value: "text-4xl",
    label: "text-sm",
    icon: "w-10 h-10",
    iconInner: "w-5 h-5",
  },
  lg: {
    value: "text-5xl",
    label: "text-base",
    icon: "w-12 h-12",
    iconInner: "w-6 h-6",
  },
};

export function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon,
  iconName,
  iconColor = "text-[var(--color-grey-900)]",
  iconBg = "bg-[var(--color-grey-100)]",
  className,
  size = "md",
}: StatCardProps) {
  // Resolve icon: prioriter direkte icon prop, fall tilbake til iconName lookup
  const Icon = icon ?? (iconName ? ICON_MAP[iconName] : undefined);
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;
  const sizes = sizeMap[size];

  return (
    <motion.div
      className={cn(
        "rounded-[14px] p-4 bg-white border border-grey-200",
        "transition-[transform,box-shadow] duration-300",
        className
      )}
      whileHover={{
        y: -2,
        scale: 1.005,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <div className={cn("rounded-xl flex items-center justify-center", iconBg, sizes.icon)}>
            <Icon className={cn(iconColor, sizes.iconInner)} />
          </div>
        )}
        <span className="text-[10px] uppercase tracking-[1px] text-grey-400 font-medium">
          {label}
        </span>
      </div>

      <div className="flex items-end justify-between">
        <motion.span
          className={cn(
            "text-[26px] font-extrabold text-black tabular-nums"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {value}
        </motion.span>

        {trend !== undefined && (
          <motion.div
            className={cn(
              "flex items-center gap-1 text-[11px] font-semibold",
              isPositive && "text-[var(--color-success)]",
              isNegative && "text-[var(--color-error)]",
              !isPositive && !isNegative && "text-grey-400"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            {isPositive && <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />}
            {isNegative && <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />}
            <span>
              {isPositive && "+"}
              {trend}
              {trendLabel && ` ${trendLabel}`}
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
