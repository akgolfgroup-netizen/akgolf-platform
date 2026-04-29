"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type { WeeklyTrendPoint } from "@/lib/portal/training/analysis-actions";
import { PYRAMIDE } from "@/lib/portal/training/ak-taxonomy";

// ─── Farger ─────────────────────────────────────────────────────────

const PYRAMID_COLORS: Record<string, string> = {
  FYS: "#C48A32",
  TEK: "#007AFF",
  SLAG: "#005840",
  SPILL: "#AF52DE",
  TURN: "#D1F843",
};

const FALLBACK_COLORS = ["#005840", "#007AFF", "#C48A32", "#AF52DE", "#D1F843", "#E85D4E", "#2A7D5A"];

// ─── Tooltip ────────────────────────────────────────────────────────

interface TooltipPayload {
  name: string;
  value: number;
  color: string;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;

  const total = payload.reduce((s, p) => s + (p.value ?? 0), 0);

  return (
    <div className="rounded-lg border border-line bg-card shadow-card p-3 text-sm">
      <p className="font-semibold text-ink mb-2">{label}</p>
      <div className="space-y-1">
        {payload
          .filter((p) => (p.value ?? 0) > 0)
          .map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-sm"
                  style={{ backgroundColor: p.color }}
                />
                <span className="text-ink-muted">{p.name}</span>
              </div>
              <span className="font-medium text-ink">{p.value} min</span>
            </div>
          ))}
      </div>
      <div className="mt-2 pt-2 border-t border-line-soft flex justify-between">
        <span className="text-ink-subtle">Totalt</span>
        <span className="font-semibold text-ink">{total} min</span>
      </div>
    </div>
  );
}

// ─── Hovedkomponent ─────────────────────────────────────────────────

interface AnalysisTrendChartProps {
  data: WeeklyTrendPoint[];
}

export function AnalysisTrendChart({ data }: AnalysisTrendChartProps) {
  const chartData = useMemo(() => {
    // Samle alle pyramide-nøkler som finnes
    const allPyramids = new Set<string>();
    for (const week of data) {
      Object.keys(week.byPyramid).forEach((k) => allPyramids.add(k));
    }

    // Sorter pyramider i standard rekkefølge
    const orderedPyramids: string[] = PYRAMIDE.map((p) => p.code).filter(
      (c) => allPyramids.has(c),
    );
    // Legg til eventuelle ukjente/pyramider utenfor standard
    allPyramids.forEach((k) => {
      if (!orderedPyramids.includes(k)) orderedPyramids.push(k);
    });

    return {
      rows: data.map((week) => {
        const row: Record<string, number | string> = {
          uke: format(new Date(week.weekStart), "d. MMM", { locale: nb }),
          fullDate: format(new Date(week.weekStart), "dd.MM.yyyy", { locale: nb }),
        };
        orderedPyramids.forEach((py) => {
          row[py] = week.byPyramid[py] ?? 0;
        });
        return row;
      }),
      pyramids: orderedPyramids,
    };
  }, [data]);

  if (chartData.rows.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-ink-subtle text-sm">
        Ingen treningsdata for trend
      </div>
    );
  }

  const hasAnyData = chartData.rows.some((r) =>
    chartData.pyramids.some((p) => (r[p] as number) > 0)
  );

  if (!hasAnyData) {
    return (
      <div className="h-[300px] flex items-center justify-center text-ink-subtle text-sm">
        Ingen treningsdata for trend
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-card">
      <h3 className="text-sm font-semibold text-ink mb-1">
        Trend over tid (uker)
      </h3>
      <p className="text-xs text-ink-subtle mb-4">
        Akkumulerte minutter per pyramide-kategori
      </p>

      <div className="h-[280px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData.rows}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-line)"
              vertical={false}
            />
            <XAxis
              dataKey="uke"
              tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-line)" }}
            />
            <YAxis
              tick={{ fill: "var(--color-ink-muted)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => `${v} min`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="square"
              iconSize={10}
              wrapperStyle={{
                fontSize: 12,
                color: "var(--color-ink-muted)",
                paddingTop: 8,
              }}
            />
            {chartData.pyramids.map((py, idx) => (
              <Bar
                key={py}
                dataKey={py}
                name={py}
                stackId="a"
                fill={PYRAMID_COLORS[py] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length]}
                radius={idx === chartData.pyramids.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
