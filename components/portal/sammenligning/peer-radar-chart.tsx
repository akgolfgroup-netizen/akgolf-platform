"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface PeerRadarChartProps {
  myStats: {
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen: number | null;
    sgPutting: number | null;
  };
  peerStats: {
    sgOffTheTee: number | null;
    sgApproach: number | null;
    sgAroundTheGreen: number | null;
    sgPutting: number | null;
  };
  comparisonLabel?: string;
}

export function PeerRadarChart({ myStats, peerStats, comparisonLabel = "Gruppe" }: PeerRadarChartProps) {
  const categories = [
    { key: "sgOffTheTee", label: "Off the Tee" },
    { key: "sgApproach", label: "Approach" },
    { key: "sgAroundTheGreen", label: "Rundt Green" },
    { key: "sgPutting", label: "Putting" },
  ] as const;

  const data = categories.map((c) => ({
    category: c.label,
    du: myStats[c.key] ?? 0,
    gruppe: peerStats[c.key] ?? 0,
  }));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke="var(--color-grey-200)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: "var(--color-muted)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-grey-900)",
              border: "1px solid var(--color-grey-200)",
              borderRadius: 8,
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
          />
          <Radar
            name={comparisonLabel}
            dataKey="gruppe"
            stroke="var(--color-info)"
            fill="var(--color-info)"
            fillOpacity={0.1}
            strokeWidth={1.5}
          />
          <Radar
            name="Du"
            dataKey="du"
            stroke="var(--color-grey-900)"
            fill="var(--color-grey-900)"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ fill: "var(--color-grey-900)", r: 3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
