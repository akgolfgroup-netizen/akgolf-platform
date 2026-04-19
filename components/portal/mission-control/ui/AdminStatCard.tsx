import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminSparkline } from "./charts/AdminSparkline";
import { MonoLabel } from "@/components/portal/patterns";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; positive?: boolean };
  icon?: React.ReactNode;
  sparkline?: number[];
  sparklineColor?: string;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  change,
  icon,
  sparkline,
  sparklineColor,
  className,
}: AdminStatCardProps) {
  const isPositive = change?.positive ?? (change ? change.value >= 0 : true);

  return (
    <div className={cn("admin-card", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <MonoLabel as="p" size="xs" uppercase className="text-[var(--color-muted)] block">
            {label}
          </MonoLabel>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text)] tracking-tight tabular-nums">
            {value}
          </p>
          {change && (
            <div className="mt-2 flex items-center gap-1 text-xs font-medium">
              {isPositive ? (
                <ArrowUpRight
                  className="w-3.5 h-3.5 text-[var(--color-success)]"
                  aria-hidden="true"
                />
              ) : (
                <ArrowDownRight
                  className="w-3.5 h-3.5 text-[var(--color-error)]"
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  isPositive
                    ? "text-[var(--color-success)]"
                    : "text-[var(--color-error)]",
                )}
              >
                {isPositive ? "+" : ""}
                {change.value}%
              </span>
              <span className="text-[var(--color-muted)]">vs forrige</span>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          {icon && (
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}
          {sparkline && sparkline.length > 1 && (
            <AdminSparkline
              data={sparkline}
              color={
                sparklineColor ??
                (isPositive
                  ? "var(--color-success)"
                  : change
                    ? "var(--color-error)"
                    : "var(--color-primary)")
              }
              width={72}
              height={24}
            />
          )}
        </div>
      </div>
    </div>
  );
}
