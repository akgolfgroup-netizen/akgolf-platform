"use client";

import { motion } from "framer-motion";
import { GlassCard, fadeInUp } from "@/components/portal/premium";
import { ScoreTrendChart } from "@/components/portal/statistikk/score-trend-chart";
import { SGRadarChart } from "@/components/portal/statistikk/sg-radar-chart";
import { TrainingVolumeChart } from "@/components/portal/statistikk/training-volume-chart";
import type { RoundStats } from "@prisma/client";
import type { WeeklyTrainingData } from "./actions";

type StatsAggregates = {
  roundCount: number;
  avgScore: number | null;
  avgSgTotal: number | null;
  avgSgOffTheTee: number | null;
  avgSgApproach: number | null;
  avgSgAroundTheGreen: number | null;
  avgSgPutting: number | null;
  avgDrivingDistance: number | null;
  avgFairwayPct: number | null;
  avgGirPct: number | null;
  avgPuttsPerGir: number | null;
  avgUpAndDownPct: number | null;
  scoreTrend: "up" | "down" | "flat";
  sgTrend: "up" | "down" | "flat";
};

type TrainingAreaBreakdown = {
  area: string;
  minutes: number;
  sessions: number;
};

interface StatistikkChartsProps {
  rounds: RoundStats[];
  aggregates: StatsAggregates | null;
  weeklyTraining: WeeklyTrainingData[];
  breakdown: TrainingAreaBreakdown[];
  handicap?: number | null;
}

function getTotalTrainingMinutes(breakdown: TrainingAreaBreakdown[]): number {
  return breakdown.reduce((sum, b) => sum + b.minutes, 0);
}

export function StatistikkCharts({
  rounds,
  aggregates,
  weeklyTraining,
  breakdown,
  handicap,
}: StatistikkChartsProps) {
  // Prepare data for ScoreTrendChart
  const scoreTrendRounds = rounds
    .filter((r) => r.totalScore !== null)
    .map((r) => ({
      date: r.date,
      score: r.totalScore as number,
      scoreToPar: r.scoreToPar ?? 0,
    }));

  // Prepare data for SGRadarChart
  const playerSG = {
    offTheTee: aggregates?.avgSgOffTheTee ?? null,
    approach: aggregates?.avgSgApproach ?? null,
    aroundTheGreen: aggregates?.avgSgAroundTheGreen ?? null,
    putting: aggregates?.avgSgPutting ?? null,
  };

  const hasSGData = Object.values(playerSG).some((v) => v !== null);

  // Training area breakdown
  const totalTrainingMinutes = getTotalTrainingMinutes(breakdown);
  const focusAreas = breakdown
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 4)
    .map((b) => ({
      name: b.area,
      percent:
        totalTrainingMinutes > 0
          ? Math.round((b.minutes / totalTrainingMinutes) * 100)
          : 0,
    }));

  return (
    <>
      {/* Score Trend + SG Radar */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Utvikling
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div variants={fadeInUp}>
            <GlassCard variant="light" padding="lg" delay={0.1}>
              <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">
                Score-utvikling
              </h3>
              <ScoreTrendChart
                rounds={scoreTrendRounds}
                handicap={handicap ?? undefined}
              />
            </GlassCard>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <GlassCard variant="light" padding="lg" delay={0.2}>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-[14px] font-semibold text-[var(--color-grey-900)]">
                  Strokes Gained
                </h3>
                {aggregates?.avgSgTotal != null && (
                  <span className="text-[11px] text-[var(--color-muted)] tabular-nums">
                    Totalt: {aggregates.avgSgTotal.toFixed(2)}
                  </span>
                )}
              </div>
              {hasSGData ? (
                <SGRadarChart playerSG={playerSG} showLegend={false} />
              ) : (
                <div className="flex h-[280px] items-center justify-center text-sm text-[var(--color-muted)]">
                  Ingen SG-data i valgt periode
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>

      {/* Training Volume + Breakdown */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Trening
        </p>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <motion.div variants={fadeInUp}>
            <GlassCard variant="light" padding="lg" delay={0.3}>
              <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">
                Treningsvolum
              </h3>
              <TrainingVolumeChart data={weeklyTraining} />
            </GlassCard>
          </motion.div>

          {focusAreas.length > 0 && (
            <motion.div variants={fadeInUp}>
              <GlassCard variant="light" padding="lg" delay={0.4}>
                <h3 className="mb-6 text-[14px] font-semibold text-[var(--color-grey-900)]">
                  Fokusomrade-fordeling
                </h3>
                <div className="space-y-4">
                  {focusAreas.map((area) => (
                    <div key={area.name}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[var(--color-grey-900)]">
                          {area.name}
                        </span>
                        <span className="text-[11px] text-[var(--color-muted)] tabular-nums">
                          {area.percent}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                        <div
                          className="h-full rounded-full bg-[var(--color-primary)] transition-all duration-500"
                          style={{ width: `${area.percent}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
