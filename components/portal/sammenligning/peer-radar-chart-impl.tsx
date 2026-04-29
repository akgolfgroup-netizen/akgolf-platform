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

// Hex-farger for Recharts (støtter ikke Tailwind-klasser på SVG-attributter)
const COLORS = {
  grey200: "#D5DFDB",
  grey400: "#7A8C85",
  grey900: "#0A1F18",
  info: "#007AFF",
};

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
    { key: "sgOffTheTee" as const, label: "Off the Tee" },
    { key: "sgApproach" as const, label: "Approach" },
    { key: "sgAroundTheGreen" as const, label: "Rundt Green" },
    { key: "sgPutting" as const, label: "Putting" },
  ];

  const data = categories.map((c) => ({
    category: c.label,
    du: myStats[c.key] ?? 0,
    gruppe: peerStats[c.key] ?? 0,
  }));

  return (
    <div className="w-full h-[320px]">
      <ResponsiveContainer>
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="70%">
          <PolarGrid stroke={COLORS.grey200} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: COLORS.grey400, fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: COLORS.grey900,
              border: `1px solid ${COLORS.grey200}`,
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
            stroke={COLORS.info}
            fill={COLORS.info}
            fillOpacity={0.1}
           
          />
          <Radar
            name="Du"
            dataKey="du"
            stroke={COLORS.grey900}
            fill={COLORS.grey900}
            fillOpacity={0.2}
           
            dot={{ fill: COLORS.grey900, r: 3 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
