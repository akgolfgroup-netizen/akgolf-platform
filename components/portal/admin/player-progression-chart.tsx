"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface HandicapEntry {
  id: string;
  date: Date;
  handicapIndex: number;
  source: string;
}

interface CoachingSession {
  id: string;
  sessionDate: Date;
  primaryFocus: string | null;
}

interface PlayerProgressionChartProps {
  handicapEntries: HandicapEntry[];
  coachingSessions: CoachingSession[];
}

function linearRegression(data: { x: number; y: number }[]) {
  if (data.length < 2) return null;
  const n = data.length;
  const sumX = data.reduce((s, d) => s + d.x, 0);
  const sumY = data.reduce((s, d) => s + d.y, 0);
  const sumXY = data.reduce((s, d) => s + d.x * d.y, 0);
  const sumXX = data.reduce((s, d) => s + d.x * d.x, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function PlayerProgressionChart({
  handicapEntries,
  coachingSessions,
}: PlayerProgressionChartProps) {
  if (handicapEntries.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400">
        Ingen handicap-data registrert.
      </div>
    );
  }

  // Process handicap data
  const data = handicapEntries.map((e, i) => ({
    date: format(new Date(e.date), "d. MMM", { locale: nb }),
    fullDate: new Date(e.date).getTime(),
    handicap: e.handicapIndex,
    x: i,
  }));

  // Linear regression for trend
  const reg = linearRegression(data.map((d) => ({ x: d.x, y: d.handicap })));
  const dataWithTrend = reg
    ? data.map((d) => ({
        ...d,
        trend: parseFloat((reg.slope * d.x + reg.intercept).toFixed(2)),
      }))
    : data;

  // Find coaching sessions that fall within handicap range
  const sessionMarkers = coachingSessions
    .map((session) => {
      const sessionTime = new Date(session.sessionDate).getTime();
      // Find closest handicap entry
      let closestIdx = 0;
      let closestDiff = Infinity;
      for (let i = 0; i < data.length; i++) {
        const diff = Math.abs(data[i].fullDate - sessionTime);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestIdx = i;
        }
      }
      return {
        x: closestIdx,
        y: data[closestIdx]?.handicap,
        focus: session.primaryFocus,
        date: format(new Date(session.sessionDate), "d. MMM", { locale: nb }),
      };
    })
    .filter((m) => m.y !== undefined);

  const min = Math.min(...handicapEntries.map((e) => e.handicapIndex));
  const max = Math.max(...handicapEntries.map((e) => e.handicapIndex));
  const padding = Math.max((max - min) * 0.3, 1);

  // Calculate improvement
  const firstHcp = handicapEntries[0]?.handicapIndex ?? 0;
  const lastHcp = handicapEntries[handicapEntries.length - 1]?.handicapIndex ?? 0;
  const improvement = firstHcp - lastHcp;

  return (
    <div>
      {/* Summary stats */}
      <div className="flex items-center gap-6 mb-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Nåværende</p>
          <p className="text-2xl font-bold text-[#0A1929]">{lastHcp.toFixed(1)}</p>
        </div>
        {improvement !== 0 && (
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Endring</p>
            <p className={`text-lg font-semibold ${improvement > 0 ? "text-green-600" : "text-red-500"}`}>
              {improvement > 0 ? "-" : "+"}{Math.abs(improvement).toFixed(1)}
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Coaching-økter</p>
          <p className="text-lg font-semibold text-[#B07D4F]">{coachingSessions.length}</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={dataWithTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[min - padding, max + padding]}
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            reversed
          />
          <Tooltip
            contentStyle={{
              background: "white",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [typeof value === "number" ? value.toFixed(1) : String(value), "Handicap"]}
          />
          <Line
            type="monotone"
            dataKey="handicap"
            stroke="#B07D4F"
            strokeWidth={2}
            dot={{ fill: "#B07D4F", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
          {reg && (
            <Line
              type="monotone"
              dataKey="trend"
              stroke="rgba(184,151,92,0.3)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          )}
          {/* Coaching session markers */}
          {sessionMarkers.slice(0, 10).map((marker, i) => (
            <ReferenceDot
              key={i}
              x={data[marker.x]?.date}
              y={marker.y}
              r={6}
              fill="#38BDF8"
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-[#B07D4F]" />
          <span>Handicap</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" />
          <span>Coaching-økt</span>
        </div>
        {reg && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-0.5 bg-[#B07D4F]/30" style={{ backgroundImage: "repeating-linear-gradient(90deg, #B07D4F 0, #B07D4F 4px, transparent 4px, transparent 8px)" }} />
            <span>Trend</span>
          </div>
        )}
      </div>
    </div>
  );
}
