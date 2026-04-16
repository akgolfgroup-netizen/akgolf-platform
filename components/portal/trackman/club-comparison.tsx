"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { AlertTriangle } from "lucide-react";

interface ClubData {
  club: string;
  carry: number;
  gap?: number;
  gapStatus?: "good" | "warning" | "error";
}

interface ClubComparisonProps {
  data: Record<string, { carry: number }>;
  expectedGaps?: Record<string, number>;
  highlightGaps?: boolean;
}

const CLUB_ORDER = [
  "Driver",
  "3-wood",
  "5-wood",
  "2-hybrid",
  "3-hybrid",
  "4-hybrid",
  "3-jern",
  "4-jern",
  "5-jern",
  "6-jern",
  "7-jern",
  "8-jern",
  "9-jern",
  "PW",
  "GW",
  "SW",
  "LW",
];

// Expected yardage gaps between clubs
const DEFAULT_EXPECTED_GAPS: Record<string, number> = {
  "Driver": 30,    // to 3-wood
  "3-wood": 15,    // to 5-wood
  "5-wood": 10,    // to hybrid
  "2-hybrid": 8,
  "3-hybrid": 8,
  "4-hybrid": 8,
  "3-jern": 10,    // between irons
  "4-jern": 10,
  "5-jern": 10,
  "6-jern": 10,
  "7-jern": 10,
  "8-jern": 10,
  "9-jern": 10,
  "PW": 8,
  "GW": 8,
  "SW": 0,
  "LW": 0,
};

const BAR_COLOR = "#D4AF37";
const GAP_GOOD = "#2A7D5A";
const GAP_WARNING = "#C48A32";
const GAP_ERROR = "#B84233";

export function ClubComparison({
  data,
  expectedGaps,
  highlightGaps = true,
}: ClubComparisonProps) {
  const mergedExpectedGaps = { ...DEFAULT_EXPECTED_GAPS, ...expectedGaps };

  const chartData = useMemo(() => {
    const sortedClubs = Object.keys(data).sort(
      (a, b) => CLUB_ORDER.indexOf(a) - CLUB_ORDER.indexOf(b)
    );

    const result: ClubData[] = sortedClubs.map((club, index) => {
      const currentCarry = data[club].carry;
      let gap: number | undefined;
      let gapStatus: "good" | "warning" | "error" | undefined;

      if (index < sortedClubs.length - 1) {
        const nextClub = sortedClubs[index + 1];
        const nextCarry = data[nextClub].carry;
        gap = currentCarry - nextCarry;

        const expectedGap = mergedExpectedGaps[club] || 10;
        const gapDiff = Math.abs(gap - expectedGap);

        if (gapDiff <= 3) {
          gapStatus = "good";
        } else if (gapDiff <= 6) {
          gapStatus = "warning";
        } else {
          gapStatus = "error";
        }
      }

      return {
        club,
        carry: currentCarry,
        gap,
        gapStatus,
      };
    });

    return result;
  }, [data, mergedExpectedGaps]);

  // Find gaps that need attention
  const problemGaps = chartData.filter((d) => d.gapStatus === "error" || d.gapStatus === "warning");
  const averageGap = chartData
    .filter((d) => d.gap !== undefined)
    .reduce((sum, d) => sum + (d.gap || 0), 0) / (chartData.length - 1) || 0;

  const longestClub = chartData[0];
  const shortestClub = chartData[chartData.length - 1];
  const totalRange = longestClub && shortestClub 
    ? longestClub.carry - shortestClub.carry 
    : 0;

  if (chartData.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[#94A3B8]">
        Ingen klubbdata tilgjengelig
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Klubber
          </p>
          <p className="text-lg font-bold text-[#F8FAFC]">{chartData.length}</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Rekkevidde
          </p>
          <p className="text-lg font-bold text-[#D4AF37]">{totalRange}m</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Snitt gap
          </p>
          <p className="text-lg font-bold text-[#F8FAFC]">{averageGap.toFixed(1)}m</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-[#1E293B]/50">
          <p className="text-[9px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Gap-sjekk
          </p>
          <p className={`text-lg font-bold ${problemGaps.length === 0 ? "text-[#2A7D5A]" : "text-[#C48A32]"}`}>
            {problemGaps.length === 0 ? "OK" : `${problemGaps.length} sjekk`}
          </p>
        </div>
      </div>

      {/* Gap warnings */}
      {highlightGaps && problemGaps.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-[#C48A32]/10 border border-[#C48A32]/30">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-[#C48A32]" />
            <p className="text-sm font-medium text-[#C48A32]">Gap-analyse</p>
          </div>
          <ul className="space-y-1">
            {problemGaps.slice(0, 3).map((club) => (
              <li key={club.club} className="text-xs text-[#94A3B8]">
                <span className="text-[#F8FAFC] font-medium">{club.club}</span>
                {" "}→{club.gap}m gap
                {club.gapStatus === "error" && (
                  <span className="text-[#B84233] ml-1">(for stort hull)</span>
                )}
                {club.gapStatus === "warning" && (
                  <span className="text-[#C48A32] ml-1">(sjekk avstand)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Bar Chart */}
      <div className="h-[280px] sm:h-[340px]" role="img" aria-label="Klubbe-sammenligning carry">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 10, right: 60, left: 60, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} horizontal={false} />
            <XAxis
              type="number"
              domain={[0, "dataMax + 20"]}
              tick={{ fill: "#94A3B8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              tickFormatter={(value) => `${value}m`}
            />
            <YAxis
              type="category"
              dataKey="club"
              tick={{ fill: "#F8FAFC", fontSize: 11, fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              width={55}
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
              formatter={(value, name, props) => {
                const payload = (props as { payload?: ClubData })?.payload;
                const gap = payload?.gap;
                const gapStatus = payload?.gapStatus;
                const items: [string, string][] = [[`${Number(value)}m carry`, "Carry"]];
                
                if (gap !== undefined) {
                  items.push([`${gap}m til neste`, `Gap ${gapStatus === "good" ? "✓" : gapStatus === "warning" ? "⚠" : "✗"}`]);
                }
                
                return items;
              }}
            />
            <ReferenceLine x={0} stroke="#334155" />
            <Bar dataKey="carry" radius={[0, 4, 4, 0]} barSize={20}>
              {chartData.map((entry, index) => {
                const color = highlightGaps && entry.gapStatus
                  ? entry.gapStatus === "good"
                    ? BAR_COLOR
                    : entry.gapStatus === "warning"
                      ? GAP_WARNING
                      : GAP_ERROR
                  : BAR_COLOR;
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      {highlightGaps && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: BAR_COLOR }} />
            <span className="text-[#94A3B8]">Godt gap</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GAP_WARNING }} />
            <span className="text-[#94A3B8]">Sjekk avstand</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: GAP_ERROR }} />
            <span className="text-[#94A3B8]">For stort hull</span>
          </div>
        </div>
      )}
    </div>
  );
}
