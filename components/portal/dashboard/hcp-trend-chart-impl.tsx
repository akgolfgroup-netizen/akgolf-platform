"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface HCPDataPoint {
  date: Date | string;
  hcp: number;
  roundsPlayed?: number;
}

interface HCPTrendChartProps {
  data: HCPDataPoint[];
  targetHcp?: number;
  showRounds?: boolean;
}

const GOLD_COLOR = "#D4AF37";
const GOLD_LIGHT = "rgba(212, 175, 55, 0.2)";

export function HCPTrendChart({
  data,
  targetHcp,
  showRounds = true,
}: HCPTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[var(--color-grey-500)]">
        Ingen HCP-data tilgjengelig
      </div>
    );
  }

  // Sort by date and prepare data (last 12 months)
  const sortedData = [...data]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-12);

  const chartData = sortedData.map((point) => ({
    date: format(new Date(point.date), "MMM", { locale: nb }),
    fullDate: format(new Date(point.date), "MMMM yyyy", { locale: nb }),
    hcp: point.hcp,
    rounds: point.roundsPlayed || 0,
  }));

  // Calculate stats
  const currentHcp = sortedData[sortedData.length - 1]?.hcp ?? 0;
  const startHcp = sortedData[0]?.hcp ?? 0;
  const bestHcp = Math.min(...sortedData.map((d) => d.hcp));
  const improvement = startHcp - currentHcp;

  // Prepare scatter data for rounds played
  const scatterData = showRounds
    ? chartData
        .filter((d) => d.rounds > 0)
        .map((d) => ({
          date: d.date,
          hcp: d.hcp,
          rounds: d.rounds,
        }))
    : [];

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Na HCP
          </p>
          <p className="text-xl font-bold text-[#F8FAFC]">{currentHcp.toFixed(1)}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Beste
          </p>
          <p className="text-xl font-bold text-[#F8FAFC]">{bestHcp.toFixed(1)}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Utvikling
          </p>
          <p
            className={`text-xl font-bold ${
              improvement > 0
                ? "text-[#2A7D5A]"
                : improvement < 0
                  ? "text-[#B84233]"
                  : "text-[#F8FAFC]"
            }`}
          >
            {improvement > 0 ? "+" : ""}
            {improvement.toFixed(1)}
          </p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Periode
          </p>
          <p className="text-xl font-bold text-[#F8FAFC]">12 mnd</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[220px] sm:h-[280px]" role="img" aria-label="HCP-utvikling over 12 maneder">
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="hcpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={GOLD_COLOR} stopOpacity={0.3} />
                <stop offset="95%" stopColor={GOLD_COLOR} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              reversed // Lower HCP is better
            />
            <Tooltip
              contentStyle={{
                background: "#1E293B",
                border: "1px solid #334155",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
              }}
              labelStyle={{ color: "#F8FAFC" }}
              itemStyle={{ color: "#F8FAFC" }}
              formatter={(value, name) => {
                if (name === "hcp") return [`HCP ${Number(value).toFixed(1)}`, "Handicap"];
                return [String(value), String(name)];
              }}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload as { fullDate?: string } | undefined;
                return item?.fullDate || String(label);
              }}
            />
            <Area
              type="monotone"
              dataKey="hcp"
              stroke={GOLD_COLOR}
             
              fill="url(#hcpGradient)"
              activeDot={{ r: 6, stroke: GOLD_COLOR, strokeWidth: 2, fill: "#1E293B" }}
            />
            {showRounds && scatterData.length > 0 && (
              <Scatter
                data={scatterData}
                fill={GOLD_COLOR}
                stroke="#1E293B"
               
                shape={(props: { cx?: number; cy?: number }) => {
                  const { cx = 0, cy = 0 } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={4}
                      fill={GOLD_COLOR}
                      stroke="#1E293B"
                     
                    />
                  );
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {targetHcp && (
        <div className="mt-3 text-center">
          <p className="text-xs text-[#94A3B8]">
            Mal: HCP {targetHcp} (
            {currentHcp > targetHcp
              ? `${(currentHcp - targetHcp).toFixed(1)} igjen`
              : "Oppnadd!"}
            )
          </p>
        </div>
      )}
    </div>
  );
}
