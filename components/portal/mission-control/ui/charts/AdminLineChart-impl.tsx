"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface AdminLineChartDatum {
  label: string;
  value: number;
  [key: string]: unknown;
}

interface AdminLineChartProps {
  data: AdminLineChartDatum[];
  color?: string;
  height?: number;
  yAxisLabel?: string;
  showGrid?: boolean;
  showLegend?: boolean;
  valueLabel?: string;
}

export function AdminLineChart({
  data,
  color = "var(--color-primary)",
  height = 260,
  yAxisLabel,
  showGrid = true,
  showLegend = false,
  valueLabel = "Verdi",
}: AdminLineChartProps) {
  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
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
          <Line
            type="monotone"
            dataKey="value"
            name={valueLabel}
            stroke={color}
           
            dot={{ r: 3, fill: color, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: color, strokeWidth: 2, stroke: "var(--color-surface)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
