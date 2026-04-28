"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  trend?: "up" | "down" | "neutral";
  showIcon?: boolean;
  strokeWidth?: number;
}

export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "#005840",
  trend,
  showIcon = false,
  strokeWidth = 2,
}: SparklineProps) {
  if (!data.length) {
    return <div className="h-8 w-full rounded bg-[var(--color-grey-100)]" />;
  }

  // Convert data to chart format
  const chartData = data.map((value, index) => ({ index, value }));

  // Determine trend if not provided
  const determinedTrend = trend ?? (() => {
    if (data.length < 2) return "neutral";
    const first = data[0];
    const last = data[data.length - 1];
    if (last > first) return "up";
    if (last < first) return "down";
    return "neutral";
  })();

  const trendColor = determinedTrend === "up" 
    ? "#2A7D5A" 
    : determinedTrend === "down" 
      ? "#B84233" 
      : color;

  const TrendIcon = determinedTrend === "up" 
    ? TrendingUp 
    : determinedTrend === "down" 
      ? TrendingDown 
      : null;

  return (
    <div className="flex items-center gap-2">
      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`sparklineGradient-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <foreignObject width={width} height={height}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
              <YAxis domain={["dataMin", "dataMax"]} hide />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={strokeWidth}
                dot={false}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </LineChart>
          </ResponsiveContainer>
        </foreignObject>
      </svg>
      
      {showIcon && TrendIcon && (
        <TrendIcon 
          className="w-4 h-4" 
          style={{ color: trendColor }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

// Compact version for stat cards (no labels, just the line)
interface SparklineCompactProps {
  data: number[];
  color?: string;
  height?: number;
}

export function SparklineCompact({
  data,
  color = "#D4AF37",
  height = 24,
}: SparklineCompactProps) {
  if (!data.length) {
    return <div className="h-6 w-full rounded bg-[var(--color-grey-100)]" />;
  }

  const chartData = data.map((value, index) => ({ index, value }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <YAxis domain={["dataMin", "dataMax"]} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
           
            dot={false}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
