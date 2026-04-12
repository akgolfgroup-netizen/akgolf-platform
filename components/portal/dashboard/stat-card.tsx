"use client";

import { type LucideIcon } from "lucide-react";
import { NumberTicker } from "./number-ticker";
import { PremiumCard } from "./premium-card";

interface StatCardProps {
  label: string;
  value: number;
  decimalPlaces?: number;
  unit?: string;
  badge?: string;
  icon: LucideIcon;
  accentColor?: string;
  glowType?: "green" | "ai";
  index?: number;
}

/**
 * V3-prototyp layout: sentrert vertikalt
 * [icon-ring 48x48]
 * [value 32px extrabold]
 * [label 11px uppercase]
 * [badge pill]
 */
export function StatCard({
  label,
  value,
  decimalPlaces = 0,
  unit,
  badge,
  icon: Icon,
  accentColor = "var(--color-primary)",
  glowType = "green",
  index = 0,
}: StatCardProps) {
  return (
    <PremiumCard
      delay={index * 0.08}
      className="flex flex-1 flex-col items-center justify-center p-6 text-center"
      glow={glowType}
    >
      {/* Icon ring */}
      <div
        className="mb-3 flex h-12 w-12 items-center justify-center rounded-[14px]"
        style={{
          backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
          border: `1px solid color-mix(in srgb, ${accentColor} 20%, transparent)`,
        }}
      >
        <Icon
          className="h-[22px] w-[22px]"
          style={{ color: accentColor }}
          strokeWidth={2}
        />
      </div>

      {/* Value — colored to match accent */}
      <span style={{ color: accentColor }}>
        <NumberTicker
          value={value}
          decimalPlaces={decimalPlaces}
          delay={0.2 + index * 0.08}
          className="text-[32px] font-extrabold tracking-[-0.04em] tabular-nums"
          suffix={unit ? ` ${unit}` : undefined}
        />
      </span>

      {/* Label */}
      <span className="mt-1.5 text-[11px] uppercase tracking-[0.04em] text-[var(--color-portal-muted)]">
        {label}
      </span>

      {/* Badge */}
      {badge && (
        <span
          className="mt-2 rounded-[6px] px-2.5 py-1 text-[11px] font-medium"
          style={{
            backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
            color: accentColor,
          }}
        >
          {badge}
        </span>
      )}
    </PremiumCard>
  );
}
