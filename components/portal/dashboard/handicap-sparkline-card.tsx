"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { EASE_ENTRANCE, colors } from "@/lib/design-tokens";

interface HandicapSparklineCardProps {
  history: number[];
  currentHcp: number | null;
  delay?: number;
}

export function HandicapSparklineCard({
  history,
  currentHcp,
  delay = 0,
}: HandicapSparklineCardProps) {
  const chartData = useMemo(
    () => history.map((value, i) => ({ index: i + 1, hcp: value })),
    [history],
  );

  const hasData = chartData.length > 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_ENTRANCE }}
      className="rounded-xl bg-white p-5 shadow-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Utvikling
          </p>
          <h3 className="mt-1 text-base font-semibold text-black">
            Handicap-trend
          </h3>
          <p className="text-xs text-muted">
            Siste {history.length || 0} registreringer
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1">
          <Trophy className="h-3 w-3 text-primary" strokeWidth={2} />
          <span className="text-xs font-bold tabular-nums text-primary">
            {currentHcp !== null ? currentHcp.toFixed(1) : "—"}
          </span>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4">
        {hasData ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="hcpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.primary.main} stopOpacity={0.2} />
                  <stop offset="100%" stopColor={colors.primary.main} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.primary.surface}
                vertical={false}
              />
              <XAxis
                dataKey="index"
                tick={{ fontSize: 11, fill: colors.primary.muted }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fontSize: 11, fill: colors.primary.muted }}
                axisLine={false}
                tickLine={false}
                reversed
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  fontSize: 13,
                }}
                formatter={(val) => [Number(val).toFixed(1), "HCP"]}
                labelFormatter={(l) => `Runde ${l}`}
              />
              <Area
                type="monotone"
                dataKey="hcp"
                stroke={colors.primary.main}
                strokeWidth={2}
                fill="url(#hcpGradient)"
                dot={false}
                activeDot={{ r: 4, fill: colors.primary.main, strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-[200px] items-center justify-center rounded-xl bg-surface text-sm text-muted">
            Registrer flere runder for å se trenden
          </div>
        )}
      </div>
    </motion.div>
  );
}
