"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface RoundData {
  date: Date | string;
  score: number;
  scoreToPar: number;
  courseRating?: number;
}

interface ScoreTrendChartProps {
  rounds: RoundData[];
  handicap?: number;
  showMovingAverage?: boolean;
}

function calculateMovingAverage(data: number[], window: number): (number | null)[] {
  return data.map((_, index) => {
    if (index < window - 1) return null;
    const slice = data.slice(index - window + 1, index + 1);
    return slice.reduce((a, b) => a + b, 0) / window;
  });
}

export function ScoreTrendChart({
  rounds,
  handicap,
  showMovingAverage = true,
}: ScoreTrendChartProps) {
  if (rounds.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-[var(--color-grey-500)]">
        Ingen runder registrert enna
      </div>
    );
  }

  // Sort by date and prepare data
  const sortedRounds = [...rounds].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const scores = sortedRounds.map((r) => r.score);
  const movingAvg = showMovingAverage ? calculateMovingAverage(scores, 5) : [];

  const data = sortedRounds.map((round, index) => ({
    date: format(new Date(round.date), "d. MMM", { locale: nb }),
    fullDate: format(new Date(round.date), "d. MMMM yyyy", { locale: nb }),
    score: round.score,
    scoreToPar: round.scoreToPar,
    movingAvg: movingAvg[index],
    courseRating: round.courseRating,
  }));

  // Calculate stats
  const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const bestScore = Math.min(...scores);
  const trend = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : 0;

  // Calculate target score based on handicap
  const targetScore = handicap ? Math.round(72 + handicap) : null;

  return (
    <div className="w-full">
      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Snitt
          </p>
          <p className="text-xl font-bold text-[var(--color-grey-900)]">{avgScore}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Beste
          </p>
          <p className="text-xl font-bold text-[var(--color-grey-900)]">{bestScore}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Runder
          </p>
          <p className="text-xl font-bold text-[var(--color-grey-900)]">{rounds.length}</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-[var(--color-grey-100)]">
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-500)] mb-1">
            Trend
          </p>
          <p
            className={`text-xl font-bold ${
              trend < 0
                ? "text-[#2D6A4F]"
                : trend > 0
                  ? "text-[#D14343]"
                  : "text-[var(--color-grey-900)]"
            }`}
          >
            {trend > 0 ? "+" : ""}
            {trend}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[280px]">
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grey-200)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "var(--color-grey-500)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-grey-200)" }}
            />
            <YAxis
              domain={["dataMin - 5", "dataMax + 5"]}
              tick={{ fill: "var(--color-grey-500)", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "var(--color-grey-200)" }}
              reversed // Lower score is better
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid var(--color-grey-200)",
                borderRadius: 8,
                fontSize: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value, name) => {
                const numValue = Number(value);
                if (name === "score") return [`${numValue} slag`, "Score"];
                if (name === "movingAvg") return [numValue ? `${numValue.toFixed(1)} slag` : "-", "Snitt (5 runder)"];
                return [String(value), String(name)];
              }}
              labelFormatter={(label, payload) => {
                const item = payload?.[0]?.payload as { fullDate?: string } | undefined;
                return item?.fullDate || String(label);
              }}
            />
            {targetScore && (
              <ReferenceLine
                y={targetScore}
                stroke="#3B82F6"
                strokeDasharray="5 5"
                label={{
                  value: `Mal (HCP ${handicap})`,
                  fill: "#3B82F6",
                  fontSize: 10,
                  position: "right",
                }}
              />
            )}
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-grey-900)"
              strokeWidth={2}
              dot={{ fill: "var(--color-grey-900)", r: 4, strokeWidth: 2, stroke: "white" }}
              activeDot={{ r: 6, stroke: "var(--color-grey-900)", strokeWidth: 2 }}
            />
            {showMovingAverage && (
              <Line
                type="monotone"
                dataKey="movingAvg"
                stroke="#2D6A4F"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                connectNulls
              />
            )}
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              formatter={(value) => {
                if (value === "score") return "Score";
                if (value === "movingAvg") return "Glidende snitt";
                return value;
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
