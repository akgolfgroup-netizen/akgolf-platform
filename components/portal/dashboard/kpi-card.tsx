"use client";

import { NumberTicker } from "@/components/portal/dashboard/number-ticker";
import { Sparkline } from "./sparkline";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: number;
  decimalPlaces?: number;
  sparklineData: number[];
  change?: number | null;
  changeLabel?: string;
}

export function KpiCard({
  label,
  value,
  decimalPlaces = 0,
  sparklineData,
  change,
  changeLabel,
}: KpiCardProps) {
  const isPositive = change != null && change < 0;
  const isNegative = change != null && change > 0;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-grey-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-grey-400">
          {label}
        </p>
        <div className="mt-1">
          <NumberTicker
            value={value}
            decimalPlaces={decimalPlaces}
            className="text-[32px] font-extrabold tracking-tight text-black"
          />
        </div>
      </div>

      <div className="mt-3">
        <Sparkline data={sparklineData} width={120} height={28} color="#005840" />
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
