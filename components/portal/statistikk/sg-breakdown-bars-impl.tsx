"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";

interface SGBreakdownData {
  category: string;
  value: number;
  tourAverage: number;
}

interface SGBreakdownBarsProps {
  data: {
    offTheTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
  };
  tourAverages?: {
    offTheTee: number;
    approach: number;
    aroundGreen: number;
    putting: number;
  };
  showTourReference?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  offTheTee: "Off Tee",
  approach: "Approach",
  aroundGreen: "Around Green",
  putting: "Putting",
};

const POSITIVE_COLOR = "#2A7D5A";
const NEGATIVE_COLOR = "#B84233";
const NEUTRAL_COLOR = "#94A3B8";

export function SGBreakdownBars({
  data,
  tourAverages,
  showTourReference = true,
}: SGBreakdownBarsProps) {
  const chartData: SGBreakdownData[] = [
    {
      category: CATEGORY_LABELS.offTheTee,
      value: data.offTheTee,
      tourAverage: tourAverages?.offTheTee ?? 0,
    },
    {
      category: CATEGORY_LABELS.approach,
      value: data.approach,
      tourAverage: tourAverages?.approach ?? 0,
    },
    {
      category: CATEGORY_LABELS.aroundGreen,
      value: data.aroundGreen,
      tourAverage: tourAverages?.aroundGreen ?? 0,
    },
    {
      category: CATEGORY_LABELS.putting,
      value: data.putting,
      tourAverage: tourAverages?.putting ?? 0,
    },
  ];

  // Calculate stats
  const totalSG = data.offTheTee + data.approach + data.aroundGreen + data.putting;
  const bestCategory = chartData.reduce((best, current) =>
    current.value > best.value ? current : best
  );
  const worstCategory = chartData.reduce((worst, current) =>
    current.value < worst.value ? current : worst
  );

  const getBarColor = (value: number) => {
    if (value > 0.1) return POSITIVE_COLOR;
    if (value < -0.1) return NEGATIVE_COLOR;
    return NEUTRAL_COLOR;
  };

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Total SG
          </p>
          <p
            className={`text-xl font-bold ${
              totalSG > 0 ? "text-[#2A7D5A]" : totalSG < 0 ? "text-[#B84233]" : "text-[#F8FAFC]"
            }`}
          >
            {totalSG > 0 ? "+" : ""}
            {totalSG.toFixed(2)}
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Sterkeste
          </p>
          <p className="text-sm font-bold text-[#2A7D5A]">{bestCategory.category}</p>
          <p className="text-xs text-[#F8FAFC]">+{bestCategory.value.toFixed(2)}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Forbedring
          </p>
          <p className="text-sm font-bold text-[#B84233]">{worstCategory.category}</p>
          <p className="text-xs text-[#F8FAFC]">{worstCategory.value.toFixed(2)}</p>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="h-[220px] sm:h-[280px]" role="img" aria-label="Strokes Gained breakdown">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 80, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
            <XAxis
              type="number"
              domain={[-2, 2]}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(value) => (value > 0 ? `+${value}` : value)}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fill: "#F8FAFC", fontSize: 12, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              itemStyle={{ color: "#F8FAFC" }}
              formatter={(value) => [
                `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(2)} slag/runder`,
                "Strokes Gained",
              ]}
            />
            {showTourReference && (
              <ReferenceLine
                x={0}
                stroke="#D4AF37"
                strokeDasharray="5 5"
                label={{
                  value: "Tour snitt",
                  fill: "#D4AF37",
                  fontSize: 10,
                  position: "top",
                }}
              />
            )}
            <ReferenceLine x={0} stroke="#334155" />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.value)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: POSITIVE_COLOR }} />
          <span className="text-[#94A3B8]">Styrke (+0.1)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: NEGATIVE_COLOR }} />
          <span className="text-[#94A3B8]">Svakhet (-0.1)</span>
        </div>
        {showTourReference && (
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-[#D4AF37]" style={{ borderTop: "2px dashed #D4AF37" }} />
            <span className="text-[#94A3B8]">Tour-gjennomsnitt</span>
          </div>
        )}
      </div>
    </div>
  );
}
