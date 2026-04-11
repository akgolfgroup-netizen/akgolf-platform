"use client";

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSparkline } from "@/components/portal/mission-control/ui";

interface StatTileWithSparklineProps {
  label: string;
  value: string | number;
  unit?: string;
  change?: { value: number; positive?: boolean } | null;
  sparkline?: number[];
  icon: LucideIcon;
  accentColor?: string;
  lowerIsBetter?: boolean;
}

export function StatTileWithSparkline({
  label,
  value,
  unit,
  change,
  sparkline,
  icon: Icon,
  accentColor = "var(--color-primary)",
  lowerIsBetter = false,
}: StatTileWithSparklineProps) {
  const rawPositive = change?.positive ?? (change ? change.value >= 0 : true);
  const isPositive = lowerIsBetter ? !rawPositive : rawPositive;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-[var(--color-grey-200)] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-semibold tracking-tight text-[var(--color-grey-900)] tabular-nums">
              {value}
            </span>
            {unit && (
              <span className="text-xs font-medium text-[var(--color-muted)]">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)` }}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" style={{ color: accentColor }} strokeWidth={1.75} />
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        {change ? (
          <div
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold",
              isPositive
                ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                : "bg-[var(--color-error)]/10 text-[var(--color-error)]",
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {isPositive ? "+" : ""}
            {change.value}
            {typeof change.value === "number" ? "%" : ""}
          </div>
        ) : (
          <span className="text-[11px] text-[var(--color-muted)]">Siste 30 dager</span>
        )}
        {sparkline && sparkline.length > 1 && (
          <AdminSparkline
            data={sparkline}
            color={accentColor}
            width={80}
            height={28}
          />
        )}
      </div>
    </div>
  );
}
