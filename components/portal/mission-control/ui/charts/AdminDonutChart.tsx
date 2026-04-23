"use client";

import * as React from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface AdminDonutChartDatum {
  label: string;
  value: number;
  color?: string;
}

interface AdminDonutChartProps {
  data: AdminDonutChartDatum[];
  height?: number;
  innerRadius?: number;
  outerRadius?: number;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string | number;
}

const DEFAULT_COLORS = [
  "var(--color-primary)",
  "var(--color-accent-cta)",
  "var(--color-success)",
  "var(--color-warning)",
  "var(--color-ai)",
  "var(--color-error)",
];

export function AdminDonutChart({
  data,
  height = 260,
  innerRadius = 60,
  outerRadius = 90,
  showLegend = true,
  centerLabel,
  centerValue,
}: AdminDonutChartProps) {
  return (
    <div style={{ width: "100%", height, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-muted)",
              borderRadius: 12,
              fontSize: 12,
              color: "var(--color-text)",
            }}
          />
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{ fontSize: 12, color: "var(--color-text)" }}
            />
          )}
          <Pie
            data={data}
            dataKey="value"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
            stroke="var(--color-surface)"
           
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {(centerLabel || centerValue !== undefined) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            paddingBottom: showLegend ? 28 : 0,
          }}
        >
          {centerValue !== undefined && (
            <span
              style={{
                fontSize: 28,
                fontWeight: 600,
                color: "var(--color-text)",
                lineHeight: 1,
              }}
            >
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span
              style={{
                fontSize: 12,
                color: "var(--color-muted)",
                marginTop: 4,
              }}
            >
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
