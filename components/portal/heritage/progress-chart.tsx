"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  date: string;
  value: number;
}

interface ProgressChartProps {
  data: DataPoint[];
  title?: string;
  color?: string;
  showGrid?: boolean;
  height?: number;
}

export function ProgressChart({
  data,
  title,
  color = "var(--color-primary)",
  showGrid = true,
  height = 200,
}: ProgressChartProps) {
  const { path, areaPath, minValue, maxValue, yScale } = useMemo(() => {
    if (data.length < 2) {
      return { path: "", areaPath: "", minValue: 0, maxValue: 100, yScale: 1 };
    }

    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1 || 1;

    const chartMin = Math.max(0, min - padding);
    const chartMax = max + padding;
    const range = chartMax - chartMin || 1;

    const width = 100;
    const chartHeight = 80;

    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = chartHeight - ((d.value - chartMin) / range) * chartHeight;
      return { x, y };
    });

    // Smooth line
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 3;
      const cpX2 = curr.x - (curr.x - prev.x) / 3;
      path += ` C ${cpX1} ${prev.y}, ${cpX2} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Area path
    const areaPath = `${path} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`;

    return {
      path,
      areaPath,
      minValue: chartMin,
      maxValue: chartMax,
      yScale: range / chartHeight,
    };
  }, [data]);

  if (data.length < 2) {
    return (
      <div>
        {title && (
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">{title}</h3>
        )}
        <div
          className="flex items-center justify-center text-[var(--color-muted)] text-sm"
          style={{ height }}
        >
          Ikke nok data
        </div>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
          <div className="flex items-center gap-4 text-xs text-[var(--color-muted)]">
            <span>Min: {minValue.toFixed(1)}</span>
            <span>Max: {maxValue.toFixed(1)}</span>
          </div>
        </div>
      )}

      <div className="relative" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          {/* Grid lines */}
          {showGrid && (
            <g className="text-[var(--color-muted)]/30">
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={y}
                  x2="100"
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
            </g>
          )}

          {/* Area */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path
            d={areaPath}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* Line */}
          <motion.path
            d={path}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 100;
            const chartHeight = 80;
            const range = maxValue - minValue || 1;
            const y =
              100 - ((d.value - minValue) / range) * chartHeight - 10;

            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 + 0.5 }}
              />
            );
          })}
        </svg>
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between text-[10px] text-[var(--color-muted)] mt-2">
        {data.length > 6
          ? [data[0], data[Math.floor(data.length / 2)], data[data.length - 1]].map(
              (d, i) => (
                <span key={i}>
                  {new Date(d.date).toLocaleDateString("nb-NO", {
                    month: "short",
                  })}
                </span>
              )
            )
          : data.map((d, i) => (
              <span key={i}>
                {new Date(d.date).toLocaleDateString("nb-NO", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            ))}
      </div>
    </div>
  );
}
