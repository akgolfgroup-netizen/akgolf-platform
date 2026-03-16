"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsOverviewProps {
  aggregates: {
    roundCount: number;
    avgScore: number | null;
    avgSgTotal: number | null;
    avgDrivingDistance: number | null;
    avgFairwayPct: number | null;
    avgGirPct: number | null;
    avgPuttsPerGir: number | null;
    avgUpAndDownPct: number | null;
    scoreTrend: "up" | "down" | "flat";
    sgTrend: "up" | "down" | "flat";
  };
}

function TrendIcon({ trend, invertColor }: { trend: "up" | "down" | "flat"; invertColor?: boolean }) {
  if (trend === "flat") return <Minus className="w-3 h-3 text-[var(--color-gold-muted)]" />;
  const isGood = invertColor ? trend === "down" : trend === "up";
  return trend === "up" ? (
    <TrendingUp className={`w-3 h-3 ${isGood ? "text-green-400" : "text-red-400"}`} />
  ) : (
    <TrendingDown className={`w-3 h-3 ${isGood ? "text-green-400" : "text-red-400"}`} />
  );
}

function StatCard({
  label,
  value,
  unit,
  trend,
  invertTrendColor,
}: {
  label: string;
  value: string | null;
  unit?: string;
  trend?: "up" | "down" | "flat";
  invertTrendColor?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4 border border-[var(--color-border)]"
      style={{ background: "rgba(255,255,255,0.02)" }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-semibold text-[var(--color-gold-dim)] uppercase tracking-widest">
          {label}
        </span>
        {trend && <TrendIcon trend={trend} invertColor={invertTrendColor} />}
      </div>
      <p className="text-xl font-bold text-[var(--color-snow)]">
        {value ?? "—"}
        {unit && value && (
          <span className="text-xs font-normal text-[var(--color-gold-muted)] ml-1">{unit}</span>
        )}
      </p>
    </div>
  );
}

export function StatsOverview({ aggregates }: StatsOverviewProps) {
  const a = aggregates;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <StatCard
        label="Snitt Score"
        value={a.avgScore !== null ? a.avgScore.toFixed(1) : null}
        trend={a.scoreTrend}
        invertTrendColor
      />
      <StatCard
        label="SG Total"
        value={a.avgSgTotal !== null ? a.avgSgTotal.toFixed(2) : null}
        trend={a.sgTrend}
      />
      <StatCard
        label="Fairway %"
        value={a.avgFairwayPct !== null ? `${a.avgFairwayPct}` : null}
        unit="%"
      />
      <StatCard
        label="GIR %"
        value={a.avgGirPct !== null ? `${a.avgGirPct}` : null}
        unit="%"
      />
      <StatCard
        label="Driving"
        value={a.avgDrivingDistance !== null ? a.avgDrivingDistance.toFixed(0) : null}
        unit="m"
      />
      <StatCard
        label="Putts/GIR"
        value={a.avgPuttsPerGir !== null ? a.avgPuttsPerGir.toFixed(2) : null}
      />
      <StatCard
        label="Up & Down"
        value={a.avgUpAndDownPct !== null ? `${a.avgUpAndDownPct}` : null}
        unit="%"
      />
      <StatCard
        label="Runder"
        value={`${a.roundCount}`}
      />
    </div>
  );
}
