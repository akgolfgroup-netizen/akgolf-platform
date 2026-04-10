"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { WeeklyTrainingData } from "@/app/portal/(dashboard)/statistikk/actions";

interface TrainingVolumeChartProps {
  data: WeeklyTrainingData[];
}

export function TrainingVolumeChart({ data }: TrainingVolumeChartProps) {
  const hasData = data.some((d) => d.sessions > 0);

  if (!hasData) {
    return (
      <div className="h-[280px] flex items-center justify-center text-sm text-[var(--color-grey-400)]">
        Ingen treningsdata i valgt periode
      </div>
    );
  }

  const totalSessions = data.reduce((sum, d) => sum + d.sessions, 0);
  const totalMinutes = data.reduce((sum, d) => sum + d.minutes, 0);
  const avgPerWeek = data.length > 0 ? Math.round(totalSessions / data.length * 10) / 10 : 0;

  return (
    <div className="w-full">
      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Totalt
          </p>
          <p className="text-xl font-bold text-[var(--color-grey-900)]">{totalSessions}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Per uke
          </p>
          <p className="text-xl font-bold text-[var(--color-grey-900)]">{avgPerWeek}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Timer
          </p>
          <p className="text-xl font-bold text-[var(--color-grey-900)]">{Math.round(totalMinutes / 60)}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[220px]">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-200)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "var(--color-grey-500)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-grey-200)" }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--color-grey-500)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid var(--color-grey-200)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={
                // recharts Formatter-type er inkompatibel — safe cast
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ((value: any, name: any) => {
                  if (name === "sessions") return [`${value} økter`, "Økter"];
                  return [String(value), String(name)];
                }) as any
              }
              labelFormatter={(label) => `Uke fra ${label}`}
            />
            <Bar
              dataKey="sessions"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
