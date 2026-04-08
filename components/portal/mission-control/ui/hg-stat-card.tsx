"use client";

import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

interface HGStatCardProps {
  label: string;
  value: string | number;
  trend?: {
    value: number;
    direction: "up" | "down";
  };
  icon?: LucideIcon;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
  subtitle?: string;
}

export function HGStatCard({
  label,
  value,
  trend,
  icon: Icon,
  variant = "default",
  className,
  subtitle,
}: HGStatCardProps) {
  const variantStyles = {
    default: "",
    success: "border-l-2 border-l-[var(--hg-success)]",
    warning: "border-l-2 border-l-[var(--hg-warning)]",
    error: "border-l-2 border-l-[var(--hg-error)]",
  };

  return (
    <div
      className={cn(
        "hg-card p-4 flex flex-col gap-2",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="hg-label">{label}</span>
        {Icon && (
          <div className="p-1.5 rounded-lg bg-[var(--hg-surface-raised)]">
            <Icon className="w-4 h-4 text-[var(--hg-text-muted)]" />
          </div>
        )}
      </div>
      
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-[var(--hg-text)] tabular-nums tracking-tight">
          {value}
        </span>
        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-medium",
              trend.direction === "up" ? "text-[var(--hg-success)]" : "text-[var(--hg-error)]"
            )}
          >
            {trend.direction === "up" ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.value}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <span className="text-xs text-[var(--hg-text-muted)]">{subtitle}</span>
      )}
    </div>
  );
}
