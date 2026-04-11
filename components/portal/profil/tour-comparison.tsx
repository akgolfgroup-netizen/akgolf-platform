"use client";

import { motion } from "framer-motion";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Trophy, TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import {
  PGA_TOUR_PERCENTILES,
  calculateTourPercentile,
  getPercentileLabel,
  getPercentileColor,
  CATEGORY_LABELS,
} from "@/lib/portal/datagolf/tour-benchmarks";

interface PlayerSG {
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
}

interface TourComparisonProps {
  playerSG: PlayerSG;
}

export function TourComparison({ playerSG }: TourComparisonProps) {
  // Map player SG to our category format
  const categories = [
    { key: "sgOtt", label: "Utslag", playerValue: playerSG.sgOffTheTee },
    { key: "sgApp", label: "Innspill", playerValue: playerSG.sgApproach },
    { key: "sgArg", label: "Naerspill", playerValue: playerSG.sgAroundTheGreen },
    { key: "sgPutt", label: "Putting", playerValue: playerSG.sgPutting },
  ] as const;

  // Check if we have any SG data
  const hasData = categories.some((c) => c.playerValue !== null);

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
            <Trophy className="w-5 h-5 text-[var(--color-grey-400)]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
              Tour Comparison
            </h3>
            <p className="text-xs text-[var(--color-grey-500)]">
              Sammenlign med PGA Tour
            </p>
          </div>
        </div>
        <div className="text-center py-8">
          <Info className="w-8 h-8 text-[var(--color-grey-300)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-grey-500)]">
            Logg minst 3 runder med SG-data for a se din sammenligning med PGA Tour.
          </p>
        </div>
      </div>
    );
  }

  // Prepare data for radar chart
  const chartData = categories.map((c) => ({
    category: c.label,
    player: c.playerValue ?? 0,
    tour: PGA_TOUR_PERCENTILES.p50[c.key],
  }));

  // Calculate percentiles for each category
  const percentiles = categories.map((c) => ({
    key: c.key,
    label: c.label,
    value: c.playerValue,
    percentile:
      c.playerValue !== null
        ? calculateTourPercentile(c.playerValue, c.key)
        : null,
  }));

  // Overall percentile (using sgTotal if available, otherwise average)
  const overallPercentile =
    playerSG.sgTotal !== null
      ? calculateTourPercentile(playerSG.sgTotal, "sgTotal")
      : null;

  // Calculate min/max for scaling
  const allValues = chartData.flatMap((d) => [d.player, d.tour, -2, 1]);
  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-[var(--color-grey-100)]">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-info-light)] to-[var(--color-ai-light)] flex items-center justify-center">
              <Trophy className="w-5 h-5 text-info-text" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">
                Tour Comparison
              </h3>
              <p className="text-xs text-[var(--color-grey-500)]">
                Din SG vs PGA Tour median
              </p>
            </div>
          </div>

          {/* Overall percentile badge */}
          {overallPercentile !== null && (
            <div
              className="px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: `${getPercentileColor(overallPercentile)}15`,
                color: getPercentileColor(overallPercentile),
              }}
            >
              {getPercentileLabel(overallPercentile)}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-[280px]">
          <ResponsiveContainer>
            <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="75%">
              <PolarGrid stroke="var(--color-grey-200)" strokeDasharray="3 3" />
              <PolarAngleAxis
                dataKey="category"
                tick={{ fill: "var(--color-grey-600)", fontSize: 12, fontWeight: 500 }}
              />
              <PolarRadiusAxis
                domain={[minValue, maxValue]}
                tick={{ fill: "var(--color-grey-400)", fontSize: 10 }}
                tickCount={5}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "white",
                  border: "1px solid var(--color-grey-200)",
                  borderRadius: 12,
                  fontSize: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
                formatter={(value) => [`${Number(value).toFixed(2)} slag`, ""]}
              />
              {/* PGA Tour median */}
              <Radar
                name="PGA Tour (median)"
                dataKey="tour"
                stroke="var(--color-info)"
                fill="var(--color-info)"
                fillOpacity={0.15}
                strokeWidth={2}
                strokeDasharray="5 5"
              />
              {/* Player */}
              <Radar
                name="Din SG"
                dataKey="player"
                stroke="var(--color-grey-900)"
                fill="var(--color-grey-900)"
                fillOpacity={0.25}
                strokeWidth={2}
                dot={{ fill: "var(--color-grey-900)", r: 4, strokeWidth: 2, stroke: "white" }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                iconType="circle"
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Percentile breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {percentiles.map((p) => {
            if (p.percentile === null) return null;

            const isAboveMedian = p.percentile >= 50;
            const Icon = isAboveMedian ? TrendingUp : TrendingDown;

            return (
              <div
                key={p.key}
                className="p-3 rounded-xl bg-[var(--color-grey-50)] border border-[var(--color-grey-100)]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-[var(--color-grey-500)] uppercase tracking-wider">
                    {p.label}
                  </span>
                  <Icon
                    className="w-3.5 h-3.5"
                    style={{ color: getPercentileColor(p.percentile) }}
                  />
                </div>
                <p className="text-lg font-bold text-[var(--color-grey-900)]">
                  {p.value?.toFixed(1) ?? "-"}
                </p>
                <p
                  className="text-[10px] font-medium mt-0.5"
                  style={{ color: getPercentileColor(p.percentile) }}
                >
                  Bedre enn {Math.round(p.percentile)}% av PGA Tour
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
