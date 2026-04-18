"use client";

import { motion } from "framer-motion";
import { KpiCard } from "@/components/portal/dashboard/kpi-card";
import { HandicapTrendChart } from "@/components/portal/dashboard/handicap-trend-chart";
import { SessionsDonut } from "@/components/portal/dashboard/sessions-donut";
import { SGRadarCard } from "@/components/portal/dashboard/sg-radar-card";
import { TrackManWidget } from "@/components/portal/dashboard/trackman-widget";
import { EmptyKpiCard } from "@/components/portal/dashboard/empty-kpi-card";
import { colors } from "@/lib/design-tokens";
import type { DashboardV3Props } from "../dashboard-types";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
};

function generateFallbackSparkline(baseValue: number, points: number): number[] {
  return Array.from({ length: points }, (_, i) => Math.max(0, baseValue + Math.sin(i) * 2));
}

/**
 * Data Rich — tall-tung visning med grafer og trend.
 *
 * View 3 (opt3): KPI-kort, diagrammer og TrackMan-data i fokus.
 */
export function DataRichView({
  stats,
  handicap,
  handicapHistory,
  trackManData,
}: DashboardV3Props) {
  const handicapSparkline =
    handicapHistory.length > 0
      ? handicapHistory
      : generateFallbackSparkline(handicap.current ?? 14, 10);

  const roundsSparkline =
    stats.roundsCount > 0 ? generateFallbackSparkline(stats.roundsCount, 6) : [];

  const sessionsSparkline =
    stats.sessionsCount > 0 ? generateFallbackSparkline(stats.sessionsCount, 8) : [];

  return (
    <motion.div
      className="mx-auto w-full max-w-[1400px] space-y-6 pb-12 pt-2"
      initial="hidden"
      animate="show"
      variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } }}
    >
      {/* KPI-rad */}
      <motion.div variants={item} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Handicap"
          value={handicap.current ?? 0}
          decimalPlaces={1}
          sparklineData={handicapSparkline}
          change={handicap.trend}
          changeLabel="siste måned"
          accentColor={colors.primary.main}
        />

        {stats.roundsCount > 0 ? (
          <KpiCard
            label="Runder"
            value={stats.roundsCount}
            sparklineData={roundsSparkline}
            accentColor={colors.data.coral}
          />
        ) : (
          <EmptyKpiCard label="Runder" message="Registrer din første runde" href="/portal/runde/ny" />
        )}

        {stats.sessionsCount > 0 ? (
          <KpiCard
            label="Treningsøkter"
            value={stats.sessionsCount}
            sparklineData={sessionsSparkline}
            accentColor={colors.primary.main}
          />
        ) : (
          <EmptyKpiCard label="Treningsøkter" message="Logg din første økt" href="/portal/dagbok" />
        )}

        <SGRadarCard />
      </motion.div>

      {/* Diagram-rad */}
      <motion.div variants={item} className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <HandicapTrendChart data={handicapHistory} />
        </div>
        <div className="lg:col-span-4">
          <SessionsDonut />
        </div>
      </motion.div>

      {/* TrackMan */}
      {trackManData && (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <TrackManWidget data={trackManData} />
        </motion.div>
      )}
    </motion.div>
  );
}
