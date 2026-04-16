"use client";

import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import { Sparkline } from "./sparkline";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { colors } from "@/lib/design-tokens";

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
    <div className="flex h-full flex-col justify-between rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-200 hover:border-grey-200 hover:shadow-md">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-grey-400">
          {label}
        </p>
        <div className="mt-1">
          <NumberTicker
            value={value}
            decimalPlaces={decimalPlaces}
            className="text-[40px] font-semibold tracking-tight text-black"
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
                  : "bg-grey-100 text-grey-500"
            }`}
          >
            {isPositive ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : isNegative ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : null}
            {Math.abs(change).toFixed(decimalPlaces)}
          </span>
          {changeLabel && (
            <span className="text-[11px] text-grey-400">{changeLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
