"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

interface TrainingCategory {
  name: string;
  value: number;
  color: string;
}

interface TrainingDistributionProps {
  data: {
    fys: number;
    tek: number;
    slag: number;
    spill: number;
    turn: number;
  };
  showLegend?: boolean;
}

// Colors from design system (pyramid colors)
const CATEGORY_COLORS = {
  fys: "#C48A32", // Orange - Fysisk
  tek: "#007AFF", // Blue - Teknisk
  slag: "#005840", // Green - Slag
  spill: "#AF52DE", // Purple - Spill
  turn: "#324D45", // Dark green - Turnering
};

const CATEGORY_NAMES = {
  fys: "FYS",
  tek: "TEK",
  slag: "SLAG",
  spill: "SPILL",
  turn: "TURN",
};

export function TrainingDistribution({
  data,
  showLegend = true,
}: TrainingDistributionProps) {
  const total = data.fys + data.tek + data.slag + data.spill + data.turn;

  if (total === 0) {
    return (
      <div className="h-[250px] flex items-center justify-center text-[#94A3B8]">
        Ingen treningsdata registrert
      </div>
    );
  }

  const chartData: TrainingCategory[] = [
    { name: CATEGORY_NAMES.fys, value: data.fys, color: CATEGORY_COLORS.fys },
    { name: CATEGORY_NAMES.tek, value: data.tek, color: CATEGORY_COLORS.tek },
    { name: CATEGORY_NAMES.slag, value: data.slag, color: CATEGORY_COLORS.slag },
    { name: CATEGORY_NAMES.spill, value: data.spill, color: CATEGORY_COLORS.spill },
    { name: CATEGORY_NAMES.turn, value: data.turn, color: CATEGORY_COLORS.turn },
  ].filter((item) => item.value > 0);

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {chartData.map((item) => {
          const percentage = ((item.value / total) * 100).toFixed(0);
          return (
            <div
              key={item.name}
              className="text-center p-2 rounded-lg"
              style={{ backgroundColor: `${item.color}20` }}
            >
              <p
                className="text-[10px] font-medium uppercase tracking-wider mb-1"
                style={{ color: item.color }}
              >
                {item.name}
              </p>
              <p className="text-lg font-bold text-[#F8FAFC]">{percentage}%</p>
            </div>
          );
        })}
      </div>

      {/* Donut Chart */}
      <div className="h-[200px] sm:h-[240px]" role="img" aria-label="Treningsfordeling">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              itemStyle={{ color: "#F8FAFC" }}
              formatter={(value) => {
                const numValue = Number(value);
                const percentage = ((numValue / total) * 100).toFixed(0);
                return [`${numValue} timer (${percentage}%)`, ""];
              }}
            />
            {showLegend && (
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                wrapperStyle={{
                  fontSize: 11,
                  color: "#F8FAFC",
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Total hours */}
      <div className="mt-3 text-center">
        <p className="text-sm text-[#94A3B8]">
          Totalt <span className="text-[#F8FAFC] font-semibold">{total}</span> treningstimer
        </p>
      </div>
    </div>
  );
}
