"use client";

import { cn } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TrainingVolumeChartProps {
  data: Array<{
    period: string;
    fys: number;
    tek: number;
    slag: number;
    spill: number;
    turn: number;
  }>;
  height?: number;
  className?: string;
}

const PYRAMID_CATEGORIES = [
  { key: "fys", label: "FYS", color: "#005840" },
  { key: "tek", label: "TEK", color: "#1A7D56" },
  { key: "slag", label: "SLAG", color: "#D1F843" },
  { key: "spill", label: "SPILL", color: "#B8852A" },
  { key: "turn", label: "TURN", color: "#5E5C57" },
] as const;

function CustomLegend() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
      {PYRAMID_CATEGORIES.map((cat) => (
        <div key={cat.key} className="flex items-center gap-1.5">
          <span
            className="inline-block w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: cat.color }}
          />
          <span
            style={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: "12px",
              color: "#5E5C57",
            }}
          >
            {cat.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function TrainingVolumeChart({
  data,
  height = 280,
  className,
}: TrainingVolumeChartProps) {
  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: -16, bottom: 4 }}
        >
          <XAxis
            dataKey="period"
            axisLine={false}
            tickLine={false}
            tick={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 12,
              fill: "#5E5C57",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{
              fontFamily: "var(--font-inter), Inter, sans-serif",
              fontSize: 11,
              fill: "#9C9990",
            }}
          />
          <Legend content={<CustomLegend />} />
          {PYRAMID_CATEGORIES.map((cat) => (
            <Bar
              key={cat.key}
              dataKey={cat.key}
              stackId="volume"
              fill={cat.color}
              radius={
                cat.key === "turn" ? [4, 4, 0, 0] : [0, 0, 0, 0]
              }
              maxBarSize={40}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
