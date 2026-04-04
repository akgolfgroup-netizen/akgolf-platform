"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface SGCategory {
  label: string;
  shortLabel: string;
  value: number | null;
}

interface SGOverviewCardProps {
  categories?: SGCategory[];
  period?: string;
}

const defaultCategories: SGCategory[] = [
  { label: "Tee Total", shortLabel: "Tee", value: null },
  { label: "Approach", shortLabel: "App", value: null },
  { label: "Naerspill", shortLabel: "Naer", value: null },
  { label: "Putting", shortLabel: "Putt", value: null },
];

export function SGOverviewCard({
  categories = defaultCategories,
  period = "Siste 5 runder",
}: SGOverviewCardProps) {
  const hasData = categories.some((c) => c.value !== null);

  // Normalize for radar (shift so -1→0, 0→1, 1→2)
  const radarData = categories.map((c) => ({
    subject: c.shortLabel,
    value: c.value !== null ? c.value + 1 : 1,
    raw: c.value,
  }));

  return (
    <div className="portal-card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-[#1D1D1F]">
          Strokes Gained
        </h3>
        <span className="text-xs text-[#86868B]">{period}</span>
      </div>

      {/* SG values grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="bg-[#F5F5F7] rounded-xl p-3 flex items-center justify-between"
          >
            <span className="text-xs font-semibold text-[#48484A]">
              {cat.label}
            </span>
            {cat.value !== null ? (
              <span
                className={`text-sm font-bold tabular-nums ${
                  cat.value >= 0 ? "text-[#2D6A4F]" : "text-[#D14343]"
                }`}
              >
                {cat.value > 0 ? "+" : ""}
                {cat.value.toFixed(2)}
              </span>
            ) : (
              <span className="text-sm font-bold text-[#D2D2D7]">
                &mdash;
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Radar chart */}
      <div className="flex justify-center">
        <div className="w-[200px] h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#E8E8ED" strokeWidth={0.5} />
              <PolarAngleAxis
                dataKey="subject"
                tick={{
                  fontSize: 10,
                  fontWeight: 600,
                  fill: "#86868B",
                }}
              />
              <Radar
                dataKey="value"
                stroke={hasData ? "#2D6A4F" : "#D2D2D7"}
                fill={hasData ? "#2D6A4F" : "#D2D2D7"}
                fillOpacity={hasData ? 0.12 : 0.05}
                strokeWidth={2}
                animationDuration={1200}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
