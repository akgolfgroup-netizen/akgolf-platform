"use client";

import { Target, Zap, TrendingUp, Activity, Crosshair, Lightbulb, Focus } from "lucide-react";
import type { TrackManAnalyticsSummary } from "@/app/portal/(dashboard)/trackman/actions";

interface TrackManAnalyticsCardProps {
  analytics: TrackManAnalyticsSummary;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null) return "–";
  return `${Math.round(value * 10) / 10}%`;
}

function formatSpeed(value: number | null | undefined): string {
  if (value == null) return "–";
  return `${Math.round(value * 10) / 10} mph`;
}

function formatDistance(value: number | null | undefined): string {
  if (value == null) return "–";
  return `${Math.round(value * 10) / 10}m`;
}

function TrendBadge({ trend }: { trend: string | null }) {
  if (!trend) return null;
  const isPositive = trend.toLowerCase().includes("opp") || trend.toLowerCase().includes("up") || trend.toLowerCase().includes("+") || trend.toLowerCase().includes("bedre");
  const isNegative = trend.toLowerCase().includes("ned") || trend.toLowerCase().includes("down") || trend.toLowerCase().includes("-") || trend.toLowerCase().includes("darligere");
  const colorClass = isPositive
    ? "bg-success-light text-success-text"
    : isNegative
      ? "bg-error-light text-error-text"
      : "bg-grey-100 text-grey-600";
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      <TrendingUp className="w-3 h-3" />
      {trend}
    </span>
  );
}

function DistributionBadges({ distribution }: { distribution: Record<string, unknown> | null }) {
  if (!distribution || typeof distribution !== "object") return <span className="text-sm text-grey-400">Ingen data</span>;
  const entries = Object.entries(distribution)
    .filter(([, v]) => typeof v === "number")
    .sort(([, a], [, b]) => (b as number) - (a as number));
  if (entries.length === 0) return <span className="text-sm text-grey-400">Ingen data</span>;
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([key, value]) => (
        <span key={key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-grey-100 text-grey-700">
          {key}: {Math.round((value as number) * 10) / 10}%
        </span>
      ))}
    </div>
  );
}

function ClubStatsBars({ stats, title }: { stats: Record<string, unknown> | null; title: string }) {
  if (!stats || typeof stats !== "object") return null;
  const numericEntries = Object.entries(stats).filter(([, v]) => typeof v === "number") as [string, number][];
  if (numericEntries.length === 0) return null;
  const max = Math.max(...numericEntries.map(([, v]) => v));
  return (
    <div className="space-y-3">
      <h5 className="text-xs font-semibold uppercase tracking-wider text-grey-400">{title}</h5>
      <div className="space-y-2">
        {numericEntries.map(([key, value]) => (
          <div key={key} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-grey-700 capitalize">{key}</span>
              <span className="font-medium text-grey-900">{Math.round(value * 10) / 10}</span>
            </div>
            <div className="h-2 w-full bg-grey-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${max > 0 ? Math.min(100, (value / max) * 100) : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrackManAnalyticsCard({ analytics }: TrackManAnalyticsCardProps) {
  return (
    <div className="bg-white rounded-xl border border-grey-200/50 p-5 space-y-6">
      {/* KPI-rad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Snitt ballfart</span>
          </div>
          <p className="text-xl font-bold text-grey-900">{formatSpeed(analytics.avgBallSpeed)}</p>
        </div>
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Max ballfart</span>
          </div>
          <p className="text-xl font-bold text-grey-900">{formatSpeed(analytics.maxBallSpeed)}</p>
        </div>
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-success" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Snitt carry</span>
          </div>
          <p className="text-xl font-bold text-grey-900">{formatDistance(analytics.avgCarryDistance)}</p>
        </div>
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-4 h-4 text-success" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Max carry</span>
          </div>
          <p className="text-xl font-bold text-grey-900">{formatDistance(analytics.maxCarryDistance)}</p>
        </div>
      </div>

      {/* Konsistens og sweet spot */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-info" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Ballfart-konsistens</span>
          </div>
          <p className="text-lg font-semibold text-grey-900">{formatPercent(analytics.ballSpeedConsistency)}</p>
        </div>
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Target className="w-4 h-4 text-info" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Distance-konsistens</span>
          </div>
          <p className="text-lg font-semibold text-grey-900">{formatPercent(analytics.distanceConsistency)}</p>
        </div>
        <div className="p-3 rounded-lg bg-grey-50">
          <div className="flex items-center gap-2 mb-1">
            <Crosshair className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium uppercase tracking-wider text-grey-500">Sweet spot</span>
          </div>
          <p className="text-lg font-semibold text-grey-900">{formatPercent(analytics.sweetSpotPercentage)}</p>
        </div>
      </div>

      {/* Trender */}
      <div className="flex flex-wrap gap-3">
        {analytics.trendBallSpeed && <TrendBadge trend={analytics.trendBallSpeed} />}
        {analytics.trendDistance && <TrendBadge trend={analytics.trendDistance} />}
        {analytics.trendConsistency && <TrendBadge trend={analytics.trendConsistency} />}
      </div>

      {/* Klubb-statistikker */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <ClubStatsBars stats={analytics.driverStats} title="Driver" />
        <ClubStatsBars stats={analytics.ironStats} title="Jern" />
        <ClubStatsBars stats={analytics.wedgeStats} title="Wedge" />
      </div>

      {/* Shot shape + miss pattern */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-grey-400 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Ballbane-fordeling
          </h5>
          <DistributionBadges distribution={analytics.shotShapeDistribution} />
        </div>
        <div className="space-y-2">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-grey-400 flex items-center gap-2">
            <Crosshair className="w-4 h-4" />
            Miss-mønster
          </h5>
          {analytics.missPattern && typeof analytics.missPattern === "object" ? (
            <DistributionBadges distribution={analytics.missPattern} />
          ) : (
            <span className="text-sm text-grey-400">Ingen data</span>
          )}
        </div>
      </div>

      {/* Innsikter */}
      {analytics.generatedInsights.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-grey-400 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Innsikter
          </h5>
          <ul className="space-y-2">
            {analytics.generatedInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-grey-700">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Anbefalt fokus */}
      {analytics.recommendedFocus.length > 0 && (
        <div className="space-y-3">
          <h5 className="text-xs font-semibold uppercase tracking-wider text-grey-400 flex items-center gap-2">
            <Focus className="w-4 h-4" />
            Anbefalt fokus
          </h5>
          <div className="flex flex-wrap gap-2">
            {analytics.recommendedFocus.map((focus, idx) => (
              <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent-cta text-accent-cta-text">
                {focus}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
