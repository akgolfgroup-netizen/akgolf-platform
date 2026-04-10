"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface SparklineProps {
  data?: number[];
  color?: string;
  height?: number;
}

export function Sparkline({
  data = [3, 5, 4, 7, 6, 8, 9, 7, 10, 8, 11],
  color = "#005840",
  height = 40,
}: SparklineProps) {
  const chartData = data.map((v, i) => ({ i, v }));

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`sparkGrad-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.12} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#sparkGrad-${color.replace("#", "")})`}
            animationDuration={1000}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
