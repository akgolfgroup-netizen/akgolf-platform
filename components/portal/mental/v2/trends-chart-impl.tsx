"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export interface TrendPoint {
  date: string;
  focus: number;
  confidence: number;
  commitment: number;
  acceptance: number;
}

interface TrendsChartProps {
  data: TrendPoint[];
  loading: boolean;
}

const COLORS = {
  grid: "rgba(255,255,255,0.06)",
  axis: "rgba(255,255,255,0.45)",
  focus: "#D1F843",
  confidence: "#6BB1FF",
  commitment: "#C99CF3",
  acceptance: "#6FCBA1",
};

export function TrendsChart({ data, loading }: TrendsChartProps) {
  return (
    <section
      className="rounded-2xl mb-6"
      style={{
        background: "#0F2E23",
        border: "1px solid rgba(255,255,255,0.06)",
        padding: "22px 24px",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h4
          style={{
            margin: 0,
            fontSize: 15,
            color: "#fff",
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          Mentale tall over tid
        </h4>
        <div
          className="flex gap-3"
          style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}
        >
          {[
            { color: COLORS.focus, label: "Fokus" },
            { color: COLORS.confidence, label: "Selvtillit" },
            { color: COLORS.commitment, label: "Engasjement" },
            { color: COLORS.acceptance, label: "Aksept" },
          ].map((l) => (
            <span key={l.label} className="flex items-center gap-1.5">
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: l.color,
                  display: "inline-block",
                }}
              />
              {l.label}
            </span>
          ))}
        </div>
      </div>
      <div style={{ height: 280 }}>
        {loading ? (
          <div
            className="flex items-center justify-center h-full"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Laster…
          </div>
        ) : data.length === 0 ? (
          <div
            className="flex items-center justify-center h-full"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Ingen data ennå
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: COLORS.axis }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 10]}
                tick={{ fontSize: 11, fill: COLORS.axis }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "#0A1F18",
                  color: "#fff",
                }}
                labelStyle={{ color: "#fff", fontWeight: 600 }}
              />
              <Legend wrapperStyle={{ paddingTop: 8 }} />
              <Line
                type="monotone"
                dataKey="focus"
                name="Fokus"
                stroke={COLORS.focus}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                name="Selvtillit"
                stroke={COLORS.confidence}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="commitment"
                name="Engasjement"
                stroke={COLORS.commitment}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="acceptance"
                name="Aksept"
                stroke={COLORS.acceptance}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
