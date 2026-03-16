"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
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
}

export function SGRadarChart({ playerSG, benchmark }: SGRadarChartProps) {
  const categories = [
    { key: "offTheTee", label: "Off the Tee" },
    { key: "approach", label: "Approach" },
    { key: "aroundTheGreen", label: "Rundt Green" },
    { key: "putting", label: "Putting" },
  ] as const;

  const data = categories.map((c) => ({
    category: c.label,
    player: playerSG[c.key] ?? 0,
    benchmark: benchmark?.sg[c.key] ?? 0,
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="rgba(15,41,80,0.6)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "rgba(212,196,168,0.7)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "#0a1929",
              border: "1px solid rgba(15,41,80,0.8)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "#fafbfc" }}
          />
          {benchmark && (
            <Radar
              name="Benchmark"
              dataKey="benchmark"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.1}
              strokeWidth={1.5}
              dot={false}
            />
          )}
          <Radar
            name="Din SG"
            dataKey="player"
            stroke="#B8975C"
            fill="#B8975C"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: "#B8975C", r: 3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
