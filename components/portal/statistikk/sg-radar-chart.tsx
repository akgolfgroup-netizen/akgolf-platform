"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import type { SGBenchmark } from "@/lib/portal/golf/sg-benchmarks";

interface SGRadarChartProps {
  playerSG: {
    offTheTee: number | null;
    approach: number | null;
    aroundTheGreen: number | null;
    putting: number | null;
  };
  benchmark?: SGBenchmark | null;
  showLegend?: boolean;
}

export function SGRadarChart({ playerSG, benchmark, showLegend = true }: SGRadarChartProps) {
  const categories = [
    { key: "offTheTee", label: "Tee" },
    { key: "approach", label: "Innspill" },
    { key: "aroundTheGreen", label: "Narspill" },
    { key: "putting", label: "Putting" },
  ] as const;

  const data = categories.map((c) => ({
    category: c.label,
    player: playerSG[c.key] ?? 0,
    benchmark: benchmark?.sg[c.key] ?? 0,
  }));

  // Calculate min/max for proper scaling
  const allValues = data.flatMap((d) => [d.player, d.benchmark]);
  const minValue = Math.min(...allValues, -3);
  const maxValue = Math.max(...allValues, 1);

  return (
    <div className="w-full">
      <div className="h-[280px]">
        <ResponsiveContainer>
          <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="var(--color-grey-200)" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="category"
              tick={{ fill: "var(--color-grey-600)", fontSize: 12, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              domain={[minValue, maxValue]}
              tick={{ fill: "var(--color-grey-400)", fontSize: 10 }}
              tickCount={5}
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
              formatter={(value) => [`${Number(value).toFixed(2)} slag`, ""]}
            />
            {benchmark && (
              <Radar
                name={`Benchmark (${benchmark.category})`}
                dataKey="benchmark"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
            )}
            <Radar
              name="Din SG"
              dataKey="player"
              stroke="var(--color-grey-900)"
              fill="var(--color-grey-900)"
              fillOpacity={0.25}
              strokeWidth={2}
              dot={{ fill: "var(--color-grey-900)", r: 4, strokeWidth: 2, stroke: "white" }}
            />
            {showLegend && (
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                iconType="circle"
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* SG Value Cards */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        {categories.map((c) => {
          const value = playerSG[c.key];
          const benchmarkValue = benchmark?.sg[c.key];
          const diff = value && benchmarkValue ? value - benchmarkValue : null;
          const isPositive = diff !== null && diff > 0;

          return (
            <div
              key={c.key}
              className="text-center p-2 rounded-lg bg-[var(--color-grey-100)]"
            >
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
                {c.label}
              </p>
              <p className="text-lg font-bold text-[var(--color-grey-900)]">
                {value !== null ? value.toFixed(1) : "-"}
              </p>
              {diff !== null && (
                <p
                  className={`text-[10px] font-medium ${
                    isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {diff.toFixed(2)} vs bench
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
