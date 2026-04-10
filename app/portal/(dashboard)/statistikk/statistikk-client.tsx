"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingDown,
  Target,
  Trophy,
  Clock,
  Award,
  Plus,
  ChevronRight,
  Info,
  Lightbulb,
} from "lucide-react";
import {
  PortalHeader,
  PortalCard,
  PremiumStatCard,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
import { ScoreTrendChart } from "@/components/portal/statistikk/score-trend-chart";
import { SGRadarChart } from "@/components/portal/statistikk/sg-radar-chart";
import { TrainingVolumeChart } from "@/components/portal/statistikk/training-volume-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import type { RoundStats } from "@prisma/client";
import type { PeriodKey, WeeklyTrainingData } from "./actions";

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

interface StatistikkClientProps {
  rounds: RoundStats[];
  aggregates: StatsAggregates | null;
  breakdown: TrainingAreaBreakdown[];
  weeklyTraining: WeeklyTrainingData[];
  handicap?: number | null;
  currentPeriod: PeriodKey;
}

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "7d", label: "7 dager" },
  { key: "30d", label: "30 dager" },
  { key: "90d", label: "90 dager" },
  { key: "1y", label: "1 ar" },
];

function formatDate(date: Date) {
  const d = new Date(date);
  return {
    date: d.getDate().toString(),
    month: d.toLocaleString("nb-NO", { month: "short" }).replace(".", ""),
  };
}

function formatScoreDiff(scoreToPar: number | null): string {
  if (scoreToPar === null) return "-";
  if (scoreToPar === 0) return "E";
  return scoreToPar > 0 ? `+${scoreToPar}` : `${scoreToPar}`;
}

function getTotalTrainingMinutes(breakdown: TrainingAreaBreakdown[]): number {
  return breakdown.reduce((sum, b) => sum + b.minutes, 0);
}

function EmptyState() {
  return (
    <div className="space-y-8">
      <PortalHeader
        label="Statistikk"
        title="Statistikk"
        description="Folg utviklingen din over tid"
      />

      <PortalCard padding="lg" className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
          <BarChart3 className="h-8 w-8 text-[var(--color-muted)]" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-text)]">
          Ingen runder registrert
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[var(--color-muted)]">
          Registrer din forste runde for a se statistikk, Strokes Gained-analyse og utviklingstrender.
        </p>
        <Link
          href="/portal/statistikk/ny-runde"
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-6 py-3 font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Registrer din forste runde
        </Link>
      </PortalCard>
    </div>
  );
}

export function StatistikkClient({
  rounds,
  aggregates,
  breakdown,
  weeklyTraining,
  handicap,
  currentPeriod,
}: StatistikkClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePeriodChange = useCallback(
    (period: PeriodKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", period);
      router.push(`/portal/statistikk?${params.toString()}`);
    },
    [router, searchParams]
  );

  if (rounds.length === 0 && !aggregates) {
    return <EmptyState />;
  }

  const recentRounds = rounds.slice(0, 5);
  const bestScore = rounds.reduce<number | null>((best, r) => {
    if (r.totalScore === null) return best;
    if (best === null) return r.totalScore;
    return r.totalScore < best ? r.totalScore : best;
  }, null);

  const bestScoreToPar = rounds.find((r) => r.totalScore === bestScore)?.scoreToPar;

  const totalTrainingMinutes = getTotalTrainingMinutes(breakdown);
  const totalTrainingSessions = breakdown.reduce((sum, b) => sum + b.sessions, 0);

  const focusAreas = breakdown
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 4)
    .map((b) => ({
      name: b.area,
      percent: totalTrainingMinutes > 0 ? Math.round((b.minutes / totalTrainingMinutes) * 100) : 0,
    }));

  const sgAreas = [
    { label: "Tee", value: aggregates?.avgSgOffTheTee ?? null, color: "var(--color-primary)" },
    { label: "Approach", value: aggregates?.avgSgApproach ?? null, color: "#3b82f6" },
    { label: "Narspill", value: aggregates?.avgSgAroundTheGreen ?? null, color: "var(--color-warning)" },
    { label: "Putting", value: aggregates?.avgSgPutting ?? null, color: "var(--color-ai)" },
  ];

  const weakestArea = sgAreas
    .filter((a) => a.value !== null)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0];

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

  const periodSelector = (
    <div className="flex gap-1 rounded-xl border border-black/5 bg-white p-1">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.key}
          onClick={() => handlePeriodChange(option.key)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            option.key === currentPeriod
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const avgScoreValue = aggregates?.avgScore ?? null;
  const bestScoreTrendLabel =
    bestScoreToPar != null ? `${formatScoreDiff(bestScoreToPar)} fra par` : undefined;
  const trainingHours = totalTrainingMinutes > 0 ? totalTrainingMinutes / 60 : 0;

  return (
    <div className="space-y-8">
      <PortalHeader
        label="Statistikk"
        title="Statistikk"
        description="Folg utviklingen din over tid"
        actions={periodSelector}
      />

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Snittslag"
            value={avgScoreValue ?? "-"}
            decimals={1}
            icon={TrendingDown}
            lowerIsBetter
            trend={
              aggregates?.scoreTrend === "down"
                ? -1
                : aggregates?.scoreTrend === "up"
                  ? 1
                  : aggregates?.scoreTrend === "flat"
                    ? 0
                    : null
            }
            trendLabel="siste periode"
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Runder"
            value={aggregates?.roundCount ?? 0}
            icon={Trophy}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Beste score"
            value={bestScore ?? "-"}
            icon={Award}
            trend={bestScoreToPar != null ? 0 : null}
            trendLabel={bestScoreTrendLabel}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Treningstimer"
            value={trainingHours}
            unit="t"
            decimals={1}
            icon={Clock}
            trend={totalTrainingSessions > 0 ? 0 : null}
            trendLabel={totalTrainingSessions > 0 ? `${totalTrainingSessions} okter` : undefined}
          />
        </motion.div>
      </motion.div>

      {/* Charts Row: Score Trend + Recent Rounds */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Score Trend Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.1 }}
        >
          <PortalCard>
            <h3 className="mb-4 font-semibold text-[var(--color-text)]">Score-utvikling</h3>
            <ScoreTrendChart
              rounds={scoreTrendRounds}
              handicap={handicap ?? undefined}
            />
          </PortalCard>
        </motion.div>

        {/* Recent Rounds */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.2 }}
        >
          <PortalCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-text)]">Siste runder</h3>
              {rounds.length > 5 && (
                <button className="text-xs font-medium text-[var(--color-primary)] hover:underline">
                  Se alle
                </button>
              )}
            </div>
            <div className="space-y-3">
              {recentRounds.length === 0 ? (
                <p className="py-8 text-center text-sm text-[var(--color-muted)]">
                  Ingen runder registrert enna
                </p>
              ) : (
                recentRounds.map((round) => {
                  const { date, month } = formatDate(round.date);
                  return (
                    <div
                      key={round.id}
                      className="flex items-center gap-3 rounded-xl bg-[var(--color-surface)] p-3 transition-colors hover:bg-[var(--color-surface-alt,var(--color-surface))]"
                    >
                      <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-white shadow-sm">
                        <span className="text-sm font-bold text-[var(--color-text)]">{date}</span>
                        <span className="text-[10px] font-medium uppercase text-[var(--color-muted)]">
                          {month}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-[var(--color-text)]">
                          {round.courseName ?? "Ukjent bane"}
                        </p>
                        {round.scoreToPar !== null && (
                          <p className="text-xs text-[var(--color-muted)]">
                            {formatScoreDiff(round.scoreToPar)} fra par
                          </p>
                        )}
                      </div>
                      <div className="text-lg font-bold text-[var(--color-text)]">
                        {round.totalScore ?? "-"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </PortalCard>
        </motion.div>
      </div>

      {/* Charts Row: SG Radar + Training Volume */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* SG Radar Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.3 }}
        >
          <PortalCard>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-[var(--color-text)]">Strokes Gained</h3>
              {aggregates?.avgSgTotal !== null && aggregates?.avgSgTotal !== undefined && (
                <span className="text-xs text-[var(--color-muted)]">
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
          </PortalCard>
        </motion.div>

        {/* Training Volume Chart */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <PortalCard>
            <h3 className="mb-4 font-semibold text-[var(--color-text)]">Treningsvolum</h3>
            <TrainingVolumeChart data={weeklyTraining} />
          </PortalCard>
        </motion.div>
      </div>

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <PortalCard>
            <h3 className="mb-6 font-semibold text-[var(--color-text)]">Fokusomrade-fordeling</h3>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {focusAreas.map((area) => (
                <div key={area.name} className="text-center">
                  <div className="relative mb-3 h-24 overflow-hidden rounded-xl bg-[var(--color-surface)]">
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] transition-all duration-500"
                      style={{ height: `${area.percent}%` }}
                    />
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">{area.name}</p>
                  <p className="text-xs text-[var(--color-muted)]">{area.percent}%</p>
                </div>
              ))}
            </div>
          </PortalCard>
        </motion.div>
      )}

      {/* AI Recommendation */}
      {weakestArea && weakestArea.value !== null && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ delay: 0.6 }}
          className="rounded-[24px] border border-[var(--color-ai)]/20 bg-gradient-to-br from-[var(--color-ai)]/10 to-[var(--color-ai)]/5 p-6"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-ai)]/20">
              <Lightbulb className="h-6 w-6 text-[var(--color-ai)]" />
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-[var(--color-text)]">AI-anbefaling</h3>
              <p className="text-sm text-[var(--color-muted)]">
                Basert pa dine SG-data bor du oke fokus pa <strong>{weakestArea.label}</strong>-trening.
                Du taper mest slag ({weakestArea.value.toFixed(1)}) i denne kategorien.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ delay: 0.7 }}
      >
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Hurtighandlinger</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickAction
            href="/portal/statistikk/ny-runde"
            icon={Plus}
            label="Registrer runde"
            description="Legg til ny score"
            variant="primary"
          />
          <QuickAction
            href="/portal/analyse"
            icon={BarChart3}
            label="Dyp analyse"
            description="Se detaljert statistikk"
          />
          <QuickAction
            href="/portal/treningsplan"
            icon={Target}
            label="Treningsplan"
            description="Planlegg okter"
          />
        </div>
      </motion.div>

      {/* SG Explanation */}
      <details className="group overflow-hidden rounded-[24px] border border-black/5 bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 transition-colors hover:bg-[var(--color-surface)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface)]">
            <Info className="h-5 w-5 text-[var(--color-muted)]" />
          </div>
          <span className="font-semibold text-[var(--color-text)]">Hva er Strokes Gained?</span>
          <ChevronRight className="ml-auto h-5 w-5 text-[var(--color-muted)] transition-transform group-open:rotate-90" />
        </summary>
        <div className="border-t border-black/5 p-4 pt-0">
          <p className="mb-4 mt-4 text-sm text-[var(--color-muted)]">
            {PORTAL_CONTENT.statistikk.sgExplanation.intro}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
              <div
                key={cat.key}
                className="flex gap-3 rounded-xl bg-[var(--color-surface)] p-3"
              >
                <span className="h-fit rounded bg-[var(--color-primary)] px-2 py-1 text-xs font-bold text-white">
                  {cat.key}
                </span>
                <span className="text-xs text-[var(--color-muted)]">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
