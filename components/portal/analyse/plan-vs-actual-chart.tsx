"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeekData {
  weekNumber: number;
  planned: number;
  completed: number;
}

interface PlanVsActualChartProps {
  data: WeekData[];
}

export function PlanVsActualChart({ data }: PlanVsActualChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--color-grey-500)]">
        Ingen plandata tilgjengelig.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    uke: `U${d.weekNumber}`,
    Planlagt: d.planned,
    Fullført: d.completed,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-200)" vertical={false} />
        <XAxis
          dataKey="uke"
          tick={{ fill: "var(--color-grey-500)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "var(--color-grey-500)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#0A1929",
            border: "1px solid var(--color-grey-200)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "white",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "10px", color: "var(--color-grey-500)", paddingTop: "8px" }}
        />
        <Bar dataKey="Planlagt" fill="var(--color-grey-200)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Fullført" fill="var(--color-grey-900)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
