"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface HandicapEntry {
  id: string;
  date: Date;
  handicapIndex: number;
  source: string;
}

interface HandicapChartProps {
  entries: HandicapEntry[];
}

function linearRegression(data: { x: number; y: number }[]) {
  if (data.length < 2) return null;
  const n = data.length;
  const sumX = data.reduce((s, d) => s + d.x, 0);
  const sumY = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumXX = data.reduce((s, d) => s + d.x * d.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function HandicapChart({ entries }: HandicapChartProps) {
  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-[var(--color-gold-muted)]">
        Ingen handicap-data registrert ennå.
      </div>
    );
  }

  const data = entries.map((e, i) => ({
    date: format(new Date(e.date), "d. MMM", { locale: nb }),
    handicap: e.handicapIndex,
    x: i,
  }));

  // Linear regression
  const reg = linearRegression(data.map((d) => ({ x: d.x, y: d.handicap })));

  const dataWithTrend = reg
    ? data.map((d) => ({
        ...d,
        trend: parseFloat((reg.slope * d.x + reg.intercept).toFixed(2)),
      }))
    : data;

  const min = Math.min(...entries.map((e) => e.handicapIndex));
  const max = Math.max(...entries.map((e) => e.handicapIndex));
  const padding = Math.max((max - min) * 0.3, 1);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={dataWithTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,41,80,0.5)" />
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--color-gold-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          domain={[min - padding, max + padding]}
          tick={{ fill: "var(--color-gold-muted)", fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          reversed
        />
        <Tooltip
          contentStyle={{
            background: "#0F2950",
            border: "1px solid rgba(15,41,80,0.9)",
            borderRadius: "8px",
            fontSize: "12px",
            color: "var(--color-snow)",
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(value: any) => [typeof value === "number" ? value.toFixed(1) : value, "Handicap"]}
        />
        <Line
          type="monotone"
          dataKey="handicap"
          stroke="var(--color-gold)"
          strokeWidth={2}
          dot={{ fill: "var(--color-gold)", r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5 }}
          name="Handicap"
        />
        {reg && (
          <Line
            type="monotone"
            dataKey="trend"
            stroke="rgba(184,151,92,0.4)"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            name="Trend"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
