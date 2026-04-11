"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/portal/utils/cn";

interface DarkStatCardProps {
  label: string;
  value: number | string;
  unit?: string;
  decimals?: number;
  trend?: number | null;
  trendLabel?: string;
  lowerIsBetter?: boolean;
  icon?: LucideIcon;
  /** Highlight-variant: primary (dark green), accent (lime) eller default (dark) */
  variant?: "default" | "accent" | "primary";
  className?: string;
  delay?: number;
}

/**
 * DarkStatCard — premium stat-kort i ron-v2 stil med dyp mork bakgrunn,
 * gradient-mesh og animert tall-counter.
 */
export function DarkStatCard({
  label,
  value,
  unit,
  decimals = 0,
  trend,
  trendLabel,
  lowerIsBetter = false,
  icon: Icon,
  variant = "default",
  className,
  delay = 0,
}: DarkStatCardProps) {
  const trendPositive =
    trend !== null && trend !== undefined
      ? lowerIsBetter
        ? trend < 0
        : trend > 0
      : null;

  const valueColor =
    variant === "accent" ? "text-[var(--color-accent-cta)]" : "text-white";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        type: "spring",
        damping: 20,
        stiffness: 100,
      }}
      className={cn(
        "relative rounded-[24px] overflow-hidden p-6 shadow-[0_20px_60px_-20px_rgba(10,31,24,0.25)] group",
        className
      )}
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-[#0A1F18]" />

      {/* Gradient mesh overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            variant === "accent"
              ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(209,248,67,0.25), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(0,88,64,0.3), transparent 60%)"
              : variant === "primary"
                ? "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(42,125,90,0.5), transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(209,248,67,0.15), transparent 60%)"
                : "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(42,125,90,0.25), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 100%, rgba(209,248,67,0.08), transparent 60%)",
        }}
      />

      {/* Grain noise */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Border-glow on hover */}
      <div className="absolute inset-0 rounded-[24px] ring-1 ring-white/5 group-hover:ring-[var(--color-accent-cta)]/20 transition-all duration-500" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <p className="text-[10px] font-bold tracking-[0.18em] text-white/40 uppercase">
            {label}
          </p>
          {Icon && (
            <div className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center backdrop-blur-xl">
              <Icon className="w-4 h-4 text-[var(--color-accent-cta)]" strokeWidth={1.75} />
            </div>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1.5 mb-3">
          {typeof value === "number" ? (
            <AnimatedNumber
              value={value}
              decimals={decimals}
              className={cn(
                "text-[42px] font-[300] tabular-nums tracking-[-0.04em] leading-none",
                valueColor
              )}
            />
          ) : (
            <span
              className={cn(
                "text-[42px] font-[300] tabular-nums tracking-[-0.04em] leading-none",
                valueColor
              )}
            >
              {value}
            </span>
          )}
          {unit && (
            <span className="text-[16px] font-[300] text-white/40">{unit}</span>
          )}
        </div>

        {/* Trend */}
        {trend !== null && trend !== undefined && (
          <div className="flex items-center gap-1.5 text-[11px]">
            <span
              className={cn(
                "font-semibold tabular-nums",
                trendPositive === null
                  ? "text-white/40"
                  : trendPositive
                    ? "text-[var(--color-accent-cta)]"
                    : "text-[#FF6B6B]"
              )}
            >
              {trend > 0 ? "+" : ""}
              {typeof trend === "number" ? trend.toFixed(decimals > 0 ? 1 : 0).replace(".", ",") : trend}
            </span>
            {trendLabel && (
              <span className="text-white/35">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
