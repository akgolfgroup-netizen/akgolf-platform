import * as React from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminStatCardProps {
  label: string;
  value: string | number;
  change?: { value: number; positive?: boolean };
  icon?: React.ReactNode;
  className?: string;
}

export function AdminStatCard({
  label,
  value,
  change,
  icon,
  className,
}: AdminStatCardProps) {
  const isPositive = change?.positive ?? (change ? change.value >= 0 : true);

  return (
    <div className={cn("admin-card", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="admin-label">{label}</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-text)] tracking-tight">
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
        {icon && (
          <div
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
