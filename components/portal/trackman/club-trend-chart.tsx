"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendPoint {
  weekStart: string;
  avgCarry: number;
  shotCount: number;
}

interface ClubTrendChartProps {
  data: TrendPoint[];
}

export function ClubTrendChart({ data }: ClubTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-sm text-ink-muted">
        Ingen data for trend-graf
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatWeekLabel(d.weekStart),
  }));

  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4EAE6" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#8A958E" }}
            axisLine={{ stroke: "#E4EAE6" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#8A958E" }}
            axisLine={{ stroke: "#E4EAE6" }}
            tickLine={false}
            domain={[0, "auto"]}
            unit="m"
          />
          <Tooltip
            contentStyle={{
              background: "#FFFFFF",
              border: "1px solid #E4EAE6",
              borderRadius: 8,
              fontSize: 12,
              boxShadow: "0 4px 12px rgba(10,31,24,0.08)",
            }}
            labelStyle={{ color: "#0A1F18", fontWeight: 600 }}
            formatter={(value, _name, props) => {
              const payload = props?.payload as { shotCount: number } | undefined;
              return [
                `${value}m (${payload?.shotCount ?? 0} slag)`,
                "Snitt carry",
              ];
            }}
          />
          <Line
            type="monotone"
            dataKey="avgCarry"
            stroke="#005840"
            strokeWidth={2}
            dot={{ r: 3, fill: "#005840", strokeWidth: 0 }}
            activeDot={{ r: 5, stroke: "#005840", strokeWidth: 2, fill: "#FFFFFF" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatWeekLabel(weekStart: string): string {
  const d = new Date(weekStart);
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "short" });
}
