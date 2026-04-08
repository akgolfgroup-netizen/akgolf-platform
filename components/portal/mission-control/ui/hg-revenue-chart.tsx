"use client";

import { cn } from "@/lib/portal/utils/cn";

interface DataPoint {
  label: string;
  value: number;
  previousValue?: number;
}

interface HGRevenueChartProps {
  data: DataPoint[];
  className?: string;
  title?: string;
  period?: string;
  total?: string;
}

export function HGRevenueChart({
  data,
  className,
  title = "Inntekt",
  period = "Siste 30 dager",
  total,
}: HGRevenueChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));
  const formatValue = (v: number) => {
    if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
    return v.toString();
  };

  return (
    <div className={cn("hg-card overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-[var(--hg-border)]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="hg-section-title">{title}</h3>
            <span className="text-xs text-[var(--hg-text-muted)]">{period}</span>
          </div>
          {total && (
            <div className="text-right">
              <span className="text-lg font-bold text-[var(--hg-primary)] tabular-nums">
                {total}
              </span>
              <span className="text-xs text-[var(--hg-text-muted)] block">totalt</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-end gap-2 h-32">
          {data.map((point, i) => {
            const height = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
            const prevHeight = point.previousValue && maxValue > 0
              ? (point.previousValue / maxValue) * 100
              : 0;
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="relative w-full flex justify-center gap-0.5 h-24 items-end">
                  {/* Current bar */}
                  <div
                    className="w-full max-w-[16px] bg-[var(--hg-primary)] rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                    title={`${point.label}: ${point.value}`}
                  />
                  {/* Previous bar (if exists) */}
                  {point.previousValue && (
                    <div
                      className="w-full max-w-[8px] bg-[var(--hg-border)] rounded-t opacity-50"
                      style={{ height: `${prevHeight}%` }}
                    />
                  )}
                </div>
                <span className="text-[10px] text-[var(--hg-text-muted)] truncate max-w-full">
                  {point.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-[var(--hg-border-subtle)]">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[var(--hg-primary)]" />
            <span className="text-xs text-[var(--hg-text-muted)]">Nåværende</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-[var(--hg-border)] opacity-50" />
            <span className="text-xs text-[var(--hg-text-muted)]">Forrige periode</span>
          </div>
        </div>
      </div>
    </div>
  );
}
