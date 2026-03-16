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
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
          />
          <Radar
            name={comparisonLabel}
            dataKey="gruppe"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.1}
            strokeWidth={1.5}
          />
          <Radar
            name="Du"
            dataKey="du"
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
