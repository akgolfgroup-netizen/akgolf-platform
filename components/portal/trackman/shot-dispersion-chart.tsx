"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ZAxis,
  Legend,
} from "recharts";

interface ShotPoint {
  id: string;
  shotNumber: number;
  club: string;
  ballSpeed: number | null;
  carryDistance: number | null;
  totalDistance: number | null;
  spinRate: number | null;
  launchAngle: number | null;
  offlineDistance: number | null;
}

interface ShotDispersionChartProps {
  shots: ShotPoint[];
}

const CLUB_COLORS: Record<string, string> = {
  Driver: "var(--color-grey-900)",
  "3-wood": "var(--color-primary)",
  "5-wood": "var(--color-success)",
  "3-iron": "var(--color-info)",
  "4-iron": "var(--color-info)",
  "5-iron": "var(--color-info)",
  "6-iron": "var(--color-warning)",
  "7-iron": "var(--color-warning)",
  "8-iron": "var(--color-warning)",
  "9-iron": "var(--color-error)",
  "PW": "var(--color-error)",
  "GW": "var(--color-ai-primary)",
  "SW": "var(--color-ai-primary)",
  "LW": "var(--color-ai-primary)",
};

function getClubColor(club: string): string {
  const normalized = club.trim();
  if (CLUB_COLORS[normalized]) return CLUB_COLORS[normalized];
  const lower = normalized.toLowerCase();
  if (lower.includes("driver")) return CLUB_COLORS.Driver;
  if (lower.includes("wood")) return CLUB_COLORS["3-wood"];
  if (lower.includes("iron")) return CLUB_COLORS["6-iron"];
  if (lower.includes("wedge") || lower.includes("pw") || lower.includes("gw") || lower.includes("sw") || lower.includes("lw")) {
    return CLUB_COLORS.SW;
  }
  return "var(--color-grey-500)";
}

export function ShotDispersionChart({ shots }: ShotDispersionChartProps) {
  const validShots = shots.filter(
    (s): s is ShotPoint & { carryDistance: number; offlineDistance: number } =>
      s.carryDistance != null && s.offlineDistance != null
  );

  if (validShots.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-sm text-grey-400">
        Ingen shot-data med offline- og carry-målinger for denne sesjonen
      </div>
    );
  }

  const clubs = Array.from(new Set(validShots.map((s) => s.club)));

  const dataByClub = clubs.map((club) => ({
    club,
    data: validShots
      .filter((s) => s.club === club)
      .map((s) => ({
        x: Math.round(s.offlineDistance * 10) / 10,
        y: Math.round(s.carryDistance * 10) / 10,
        z: s.ballSpeed ? Math.round(s.ballSpeed) : 50,
        shotNumber: s.shotNumber,
        spinRate: s.spinRate,
        club: s.club,
      })),
    color: getClubColor(club),
  }));

  return (
    <div className="w-full">
      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-200)" />
            <XAxis
              type="number"
              dataKey="x"
              name="Offline"
              unit="m"
              tick={{ fill: "var(--color-grey-500)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-grey-200)" }}
              label={{
                value: "Offline (m)",
                position: "insideBottom",
                offset: -5,
                fill: "var(--color-grey-500)",
                fontSize: 11,
              }}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Carry"
              unit="m"
              tick={{ fill: "var(--color-grey-500)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-grey-200)" }}
              label={{
                value: "Carry (m)",
                angle: -90,
                position: "insideLeft",
                fill: "var(--color-grey-500)",
                fontSize: 11,
              }}
            />
            <ZAxis type="number" dataKey="z" range={[40, 120]} />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                background: "white",
                border: "1px solid var(--color-grey-200)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(_, __, props) => {
                const payload = props?.payload as {
                  x: number;
                  y: number;
                  shotNumber: number;
                  spinRate: number | null;
                  club: string;
                };
                return [
                  `Shot #${payload.shotNumber}: ${payload.y}m carry, ${payload.x}m offline${payload.spinRate ? `, ${Math.round(payload.spinRate)} rpm` : ""}`,
                  payload.club,
                ];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => value}
            />
            {dataByClub.map((group) => (
              <Scatter
                key={group.club}
                name={group.club}
                data={group.data}
                fill={group.color}
                stroke={group.color}
                strokeWidth={1}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
