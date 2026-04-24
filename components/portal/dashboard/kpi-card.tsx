"use client";


import { Icon } from "@/components/ui/icon";
import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import { Sparkline } from "./sparkline";

import { colors } from "@/lib/design-tokens";
import { MonoLabel } from "@/components/portal/patterns";

interface KpiCardProps {
  label: string;
  value: number;
  decimalPlaces?: number;
  sparklineData: number[];
  change?: number | null;
  changeLabel?: string;
  accentColor?: string;
}

export function KpiCard({
  label,
  value,
  decimalPlaces = 0,
  sparklineData,
  change,
  changeLabel,
  accentColor = colors.primary.main,
}: KpiCardProps) {
  const isPositive = change != null && change < 0;
  const isNegative = change != null && change > 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-sm transition-all duration-200 hover:border-outline-variant/30 hover:shadow-md">
      <div>
        <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block">{label}</MonoLabel>
        <div className="mt-1">
          <NumberTicker
            value={value}
            decimalPlaces={decimalPlaces}
            className="text-[40px] font-semibold tracking-tight text-on-surface"
          />
        </div>
      </div>

      <div className="mt-2">
        <Sparkline data={sparklineData} width={160} height={40} color={accentColor} />
      </div>

      {change !== undefined && change !== null && (
        <div className="mt-3 flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
              isPositive
                ? "bg-success-light text-success-text"
                : isNegative
                  ? "bg-error-light text-error-text"
                  : "bg-surface-container text-on-surface-variant/80"
            }`}
          >
            {isPositive ? (
              <Icon name="south_east" className="h-3 w-3" />
            ) : isNegative ? (
              <Icon name="arrow_outward" className="h-3 w-3" />
            ) : null}
            {Math.abs(change).toFixed(decimalPlaces)}
          </span>
          {changeLabel && (
            <span className="text-[11px] text-on-surface-variant">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
