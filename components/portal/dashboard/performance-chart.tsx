"use client";

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import { cn } from "@/lib/utils";

interface HandicapPoint {
  date: string;
  handicap: number;
}

interface PerformanceChartProps {
  data: HandicapPoint[];
  className?: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[rgba(10,31,24,0.08)] bg-surface-container-lowest px-3 py-2 shadow-[0_4px_16px_rgba(10,31,24,0.08)]">
        <p className="text-[11px] font-medium uppercase tracking-[0.06em] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-semibold text-on-surface tabular-nums">
          HCP {payload[0].value.toFixed(1)}
        </p>
      </div>
    );
  }
  return null;
}

export function PerformanceChart({ data, className }: PerformanceChartProps) {
  return (
    <div className={cn("h-[180px] w-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="handicapGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2A7D5A" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2A7D5A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            hide
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: "rgba(10, 31, 24, 0.1)",
              strokeWidth: 1,
              strokeDasharray: "4 4",
            }}
          />
          <Area
            type="monotone"
            dataKey="handicap"
            stroke="#2A7D5A"
            strokeWidth={2.5}
            fill="url(#handicapGradient)"
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
