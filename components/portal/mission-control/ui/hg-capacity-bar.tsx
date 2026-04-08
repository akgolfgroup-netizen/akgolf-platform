"use client";

import { cn } from "@/lib/portal/utils/cn";

interface HGCapacityBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function HGCapacityBar({
  current,
  max,
  label,
  showPercentage = true,
  size = "md",
  className,
}: HGCapacityBarProps) {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  
  const getStatusColor = () => {
    if (percentage >= 90) return "var(--hg-error)";
    if (percentage >= 75) return "var(--hg-warning)";
    return "var(--hg-primary)";
  };

  const sizeStyles = {
    sm: "h-1.5",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs text-[var(--hg-text-secondary)]">{label}</span>
          )}
          {showPercentage && (
            <span className="text-xs font-medium text-[var(--hg-text)] tabular-nums">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={cn("hg-capacity-bar", sizeStyles[size])}>
        <div
          className="hg-capacity-fill transition-all duration-500"
          style={{
            width: `${percentage}%`,
            backgroundColor: getStatusColor(),
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] text-[var(--hg-text-muted)] tabular-nums">
          {current} / {max}
        </span>
        <span className="text-[10px] text-[var(--hg-text-muted)]">
          {max - current} ledige
        </span>
      </div>
    </div>
  );
}
