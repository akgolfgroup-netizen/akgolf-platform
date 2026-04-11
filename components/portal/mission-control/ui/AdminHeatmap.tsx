"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AdminHeatmapCell {
  row: string;
  col: string;
  value: number;
}

interface AdminHeatmapProps {
  data: AdminHeatmapCell[];
  rows: string[];
  cols: string[];
  color?: string;
  cellSize?: number;
  gap?: number;
  formatTooltip?: (cell: AdminHeatmapCell) => string;
  ariaLabel?: string;
  className?: string;
}

export function AdminHeatmap({
  data,
  rows,
  cols,
  color = "var(--color-primary)",
  cellSize = 28,
  gap = 4,
  formatTooltip,
  ariaLabel = "Aktivitets-heatmap",
  className,
}: AdminHeatmapProps) {
  const maxValue = React.useMemo(
    () => Math.max(1, ...data.map((d) => d.value)),
    [data],
  );

  const lookup = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const cell of data) {
      map.set(`${cell.row}|${cell.col}`, cell.value);
    }
    return map;
  }, [data]);

  return (
    <div
      className={cn("inline-block", className)}
      role="table"
      aria-label={ariaLabel}
    >
      <div
        className="inline-grid"
        style={{
          gridTemplateColumns: `auto repeat(${cols.length}, ${cellSize}px)`,
          gap,
        }}
      >
        <div />
        {cols.map((col) => (
          <div
            key={`col-${col}`}
            className="text-[10px] text-center"
            style={{ color: "var(--color-muted)" }}
          >
            {col}
          </div>
        ))}
        {rows.map((row) => (
          <React.Fragment key={`row-${row}`}>
            <div
              className="text-[11px] pr-2 flex items-center justify-end"
              style={{ color: "var(--color-muted)" }}
            >
              {row}
            </div>
            {cols.map((col) => {
              const value = lookup.get(`${row}|${col}`) ?? 0;
              const intensity = value / maxValue;
              const opacity =
                value === 0 ? 0.06 : 0.15 + intensity * 0.85;
              const tooltip = formatTooltip
                ? formatTooltip({ row, col, value })
                : `${row} ${col}: ${value}`;
              return (
                <div
                  key={`${row}-${col}`}
                  role="cell"
                  title={tooltip}
                  className="rounded-md transition-transform hover:scale-110"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    background: color,
                    opacity,
                  }}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
