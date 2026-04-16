"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChevronDown } from "lucide-react";

interface ClubSession {
  date: Date | string;
  carry: number;
  ballSpeed: number;
  spin: number;
  smashFactor?: number;
}

interface ClubWaveformProps {
  clubData: Record<string, ClubSession[]>;
  defaultClub?: string;
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

const CLUB_COLORS = {
  carry: "#D4AF37",     // Gold
  ballSpeed: "#007AFF", // Blue
  spin: "#AF52DE",      // Purple
};

export function ClubWaveform({ clubData, defaultClub }: ClubWaveformProps) {
  const availableClubs = Object.keys(clubData).sort(
    (a, b) => CLUB_ORDER.indexOf(a) - CLUB_ORDER.indexOf(b)
  );

  const [selectedClub, setSelectedClub] = useState(defaultClub || availableClubs[0] || "");
  const [metric, setMetric] = useState<"all" | "carry" | "ballSpeed" | "spin">("all");

  if (!selectedClub || !clubData[selectedClub]) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[#94A3B8]">
        Ingen TrackMan-data tilgjengelig
      </div>
    );
  }

  // Get last 90 days of data
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const sessions = clubData[selectedClub]
    .filter((s) => new Date(s.date) >= ninetyDaysAgo)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sessions.length === 0) {
    return (
      <div className="h-[300px] flex flex-col items-center justify-center text-[#94A3B8]">
        <p>Ingen data siste 90 dager for {selectedClub}</p>
        {availableClubs.length > 0 && (
          <div className="mt-4">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="bg-[#1E293B] border border-[#334155] rounded-lg px-3 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            >
              {availableClubs.map((club) => (
                <option key={club} value={club}>
                  {club}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    );
  }

  // Calculate averages
  const avgCarry = Math.round(sessions.reduce((a, s) => a + s.carry, 0) / sessions.length);
  const avgBallSpeed = Math.round(sessions.reduce((a, s) => a + s.ballSpeed, 0) / sessions.length);
  const avgSpin = Math.round(sessions.reduce((a, s) => a + s.spin, 0) / sessions.length);

  // Calculate trends (first half vs second half)
  const midPoint = Math.floor(sessions.length / 2);
  const firstHalf = sessions.slice(0, midPoint);
  const secondHalf = sessions.slice(midPoint);
  
  const firstAvgCarry = firstHalf.length > 0 
    ? firstHalf.reduce((a, s) => a + s.carry, 0) / firstHalf.length 
    : 0;
  const secondAvgCarry = secondHalf.length > 0 
    ? secondHalf.reduce((a, s) => a + s.carry, 0) / secondHalf.length 
    : 0;
  const carryTrend = secondAvgCarry - firstAvgCarry;

  const chartData = sessions.map((s, index) => ({
    index: index + 1,
    carry: s.carry,
    ballSpeed: s.ballSpeed,
    spin: s.spin / 100, // Scale down for visibility
    date: new Date(s.date).toLocaleDateString("nb-NO", { day: "numeric", month: "short" }),
  }));

  const metrics = [
    { key: "carry", label: "Carry", color: CLUB_COLORS.carry, unit: "m" },
    { key: "ballSpeed", label: "Ball Speed", color: CLUB_COLORS.ballSpeed, unit: "mph" },
    { key: "spin", label: "Spin", color: CLUB_COLORS.spin, unit: "rpm" },
  ];

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative">
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="appearance-none bg-[#1E293B] border border-[#334155] rounded-lg pl-4 pr-10 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer min-w-[140px]"
          >
            {availableClubs.map((club) => (
              <option key={club} value={club}>
                {club}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8] pointer-events-none" />
        </div>

        <div className="flex items-center gap-1 bg-[#1E293B] rounded-lg p-1">
          {[
            { key: "all", label: "Alle" },
            { key: "carry", label: "Carry" },
            { key: "ballSpeed", label: "Speed" },
            { key: "spin", label: "Spin" },
          ].map((m) => (
            <button
              key={m.key}
              onClick={() => setMetric(m.key as typeof metric)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                metric === m.key
                  ? "bg-[#334155] text-[#F8FAFC]"
                  : "text-[#94A3B8] hover:text-[#F8FAFC]"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Avg Carry
          </p>
          <p className="text-xl font-bold text-[#D4AF37]">{avgCarry}m</p>
          {carryTrend !== 0 && (
            <p className={`text-[10px] ${carryTrend > 0 ? "text-[#2A7D5A]" : "text-[#B84233]"}`}>
              {carryTrend > 0 ? "+" : ""}{carryTrend.toFixed(1)}m trend
            </p>
          )}
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Ball Speed
          </p>
          <p className="text-xl font-bold text-[#007AFF]">{avgBallSpeed}</p>
          <p className="text-[10px] text-[#94A3B8]">mph</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[#1E293B]/50">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[#94A3B8] mb-1">
            Spin
          </p>
          <p className="text-xl font-bold text-[#AF52DE]">{avgSpin}</p>
          <p className="text-[10px] text-[#94A3B8]">rpm</p>
        </div>
      </div>

      {/* Waveform Chart */}
      <div className="h-[220px] sm:h-[280px]" role="img" aria-label={`${selectedClub} TrackMan data`}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="carryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CLUB_COLORS.carry} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CLUB_COLORS.carry} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CLUB_COLORS.ballSpeed} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CLUB_COLORS.ballSpeed} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="spinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CLUB_COLORS.spin} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CLUB_COLORS.spin} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
            <XAxis
              dataKey="index"
              tick={{ fill: "#64748B", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              label={{ value: "Sessions (90 dager)", position: "insideBottom", offset: -5, fill: "#64748B", fontSize: 10 }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#64748B", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#64748B", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
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
              formatter={(value, name) => {
                const numValue = Number(value);
                if (name === "spin") return [`${(numValue * 100).toFixed(0)} rpm`, "Spin"];
                if (name === "carry") return [`${numValue}m`, "Carry"];
                if (name === "ballSpeed") return [`${numValue} mph`, "Ball Speed"];
                return [String(value), String(name)];
              }}
            />
            {(metric === "all" || metric === "carry") && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="carry"
                name="Carry"
                stroke={CLUB_COLORS.carry}
                strokeWidth={2}
                fill="url(#carryGradient)"
                activeDot={{ r: 5, stroke: CLUB_COLORS.carry, strokeWidth: 2, fill: "#1E293B" }}
              />
            )}
            {(metric === "all" || metric === "ballSpeed") && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="ballSpeed"
                name="Ball Speed"
                stroke={CLUB_COLORS.ballSpeed}
                strokeWidth={2}
                fill="url(#speedGradient)"
                activeDot={{ r: 5, stroke: CLUB_COLORS.ballSpeed, strokeWidth: 2, fill: "#1E293B" }}
              />
            )}
            {(metric === "all" || metric === "spin") && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="spin"
                name="Spin"
                stroke={CLUB_COLORS.spin}
                strokeWidth={2}
                fill="url(#spinGradient)"
                activeDot={{ r: 5, stroke: CLUB_COLORS.spin, strokeWidth: 2, fill: "#1E293B" }}
              />
            )}
            {metric === "all" && (
              <Legend
                wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
                formatter={(value) => {
                  if (value === "spin") return "Spin (x100)";
                  return value;
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
