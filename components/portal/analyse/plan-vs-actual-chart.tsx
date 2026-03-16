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
      <div className="flex items-center justify-center h-40 text-sm text-[var(--color-gold-muted)]">
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
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,41,80,0.5)" vertical={false} />
        <XAxis
          dataKey="uke"
          tick={{ fill: "var(--color-gold-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: "var(--color-gold-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#0F2950",
            border: "1px solid rgba(15,41,80,0.9)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--color-snow)",
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "10px", color: "var(--color-gold-muted)", paddingTop: "8px" }}
        />
        <Bar dataKey="Planlagt" fill="rgba(15,41,80,0.8)" radius={[3, 3, 0, 0]} />
        <Bar dataKey="Fullført" fill="var(--color-gold)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
