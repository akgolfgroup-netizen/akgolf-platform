"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface AdminAreaChartDatum {
  label: string;
  value: number;
  [key: string]: unknown;
}

interface AdminAreaChartProps {
  data: AdminAreaChartDatum[];
  color?: string;
  height?: number;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  valueLabel?: string;
}

export function AdminAreaChart({
  data,
  color = "var(--color-primary)",
  height = 260,
  yAxisLabel,
  showGrid = true,
  showLegend = false,
  valueLabel = "Verdi",
}: AdminAreaChartProps) {
  const gradientId = React.useId();

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          {showGrid && (
            <CartesianGrid
              stroke="var(--color-muted)"
              strokeDasharray="4 4"
              strokeOpacity={0.3}
              vertical={false}
            />
          )}
          <XAxis
            dataKey="label"
            stroke="var(--color-muted)"
            tick={{ fill: "var(--color-text)", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-muted)", strokeOpacity: 0.4 }}
          />
          <YAxis
            stroke="var(--color-muted)"
            tick={{ fill: "var(--color-text)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            label={
              yAxisLabel
                ? {
                    value: yAxisLabel,
                    angle: -90,
                    position: "insideLeft",
                    fill: "var(--color-muted)",
                    fontSize: 12,
                  }
                : undefined
            }
          />
          <Tooltip
            cursor={{
              stroke: "var(--color-primary)",
              strokeOpacity: 0.2,
              strokeWidth: 1,
            }}
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-muted)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--color-text)",
            }}
          />
          {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
          <Area
            type="monotone"
            dataKey="value"
            name={valueLabel}
            stroke={color}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
