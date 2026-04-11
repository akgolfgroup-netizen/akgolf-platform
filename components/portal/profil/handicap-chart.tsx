"use client";

import { TrendingDown } from "lucide-react";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";

interface HandicapEntry {
  id: string;
  userId: string;
  date: string;
  handicapIndex: number;
  source: string;
  createdAt: string;
}

interface HandicapChartProps {
  entries: HandicapEntry[];
}

export function HandicapChart({ entries }: HandicapChartProps) {
  const chartData = entries.map((e) => ({
    date: e.date,
    value: e.handicapIndex,
  }));

  const hasData = chartData.length >= 2;

  // Calculate trend
  const trend =
    chartData.length >= 2
      ? chartData[chartData.length - 1].value - chartData[0].value
      : null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--color-grey-100)",
        border: "1px solid var(--color-grey-200)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-[var(--color-grey-900)]" />
          <h2 className="text-sm font-semibold text-[var(--color-grey-900)]">
            Handicap-utvikling
          </h2>
        </div>
        {trend !== null && (
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background:
                trend <= 0
                  ? "var(--color-success-light)"
                  : "var(--color-error-light)",
              color:
                trend <= 0
                  ? "var(--color-success-text)"
                  : "var(--color-error-text)",
            }}
          >
            {trend <= 0 ? "" : "+"}
            {trend.toFixed(1)}
          </span>
        )}
      </div>

      {hasData ? (
        <ProgressChart
          data={chartData}
          color="var(--color-primary)"
          height={180}
        />
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <TrendingDown className="w-8 h-8 text-[var(--color-grey-300)] mb-3" />
          <p className="text-xs text-[var(--color-grey-500)] text-center">
            For lite data. Registrer flere runder for å se handicap-utvikling.
          </p>
        </div>
      )}
    </div>
  );
}
