"use client";

import * as React from "react";
import { Line, LineChart, ResponsiveContainer, YAxis } from "recharts";

interface AdminSparklineProps {
  data: number[];
  color?: string;
  width?: number | string;
  height?: number;
  strokeWidth?: number;
}

export function AdminSparkline({
  data,
  color = "var(--color-primary)",
  width = 96,
  height = 28,
  strokeWidth = 2,
}: AdminSparklineProps) {
  const chartData = React.useMemo(
    () => data.map((value, index) => ({ index, value })),
    [data],
  );

  return (
    <div style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <YAxis hide domain={["dataMin", "dataMax"]} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={strokeWidth}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
