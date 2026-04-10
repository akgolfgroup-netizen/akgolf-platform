"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Target,
  Calendar,
  Award,
  Plus,
  ChevronRight,
  Info,
  Lightbulb,
} from "lucide-react";
import { StatCard } from "@/components/portal/heritage/stat-card";
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
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Statistikk</h1>
        <p className="text-[var(--color-grey-500)] mt-1">Folg utviklingen din over tid</p>
      </div>

      <div className="bg-white rounded-3xl p-12 text-center border border-[var(--color-grey-200)]">
        <div className="w-16 h-16 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-[var(--color-grey-400)]" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2">
          Ingen runder registrert
        </h2>
        <p className="text-[var(--color-grey-500)] mb-8 max-w-md mx-auto">
          Registrer din forste runde for a se statistikk, Strokes Gained-analyse og utviklingstrender.
        </p>
        <Link
          href="/portal/statistikk/ny-runde"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Registrer din forste runde
        </Link>
      </div>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Statistikk</h1>
          <p className="text-[var(--color-grey-500)] mt-1">Folg utviklingen din over tid</p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-white border border-[var(--color-grey-200)]">
          {PERIOD_OPTIONS.map((option) => (
            <button
              key={option.key}
              onClick={() => handlePeriodChange(option.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                option.key === currentPeriod
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-900)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StatCard
          label="Snittscore"
          value={aggregates?.avgScore?.toFixed(1) ?? "-"}
          trend={
            aggregates?.scoreTrend === "down"
              ? { value: -1, label: "bedre" }
              : aggregates?.scoreTrend === "up"
              ? { value: 1, label: "hoyere" }
              : undefined
          }
          icon={aggregates?.scoreTrend === "down" ? TrendingDown : TrendingUp}
          iconColor={aggregates?.scoreTrend === "down" ? "var(--color-success)" : "var(--color-error)"}
        />
        <StatCard
          label="Runder"
          value={aggregates?.roundCount?.toString() ?? "0"}
          icon={Calendar}
          iconColor="var(--color-primary)"
        />
        <StatCard
          label="Beste score"
          value={bestScore?.toString() ?? "-"}
          trend={
            bestScoreToPar != null
              ? { value: 0, label: formatScoreDiff(bestScoreToPar) + " fra par" }
              : undefined
          }
          icon={Award}
          iconColor="var(--color-warning)"
        />
        <StatCard
          label="Treningstid"
          value={totalTrainingMinutes > 0 ? (totalTrainingMinutes / 60).toFixed(1) + "t" : "0"}
          trend={
            totalTrainingSessions > 0
              ? { value: 0, label: `${totalTrainingSessions} okter` }
              : undefined
          }
          icon={BarChart3}
          iconColor="var(--color-ai)"
        />
      </motion.div>

      {/* Charts Row: Score Trend + Recent Rounds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]"
        >
          <h3 className="font-semibold text-[var(--color-grey-900)] mb-4">Score-utvikling</h3>
          <ScoreTrendChart
            rounds={scoreTrendRounds}
            handicap={handicap ?? undefined}
          />
        </motion.div>

        {/* Recent Rounds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--color-grey-900)]">Siste runder</h3>
            {rounds.length > 5 && (
              <button className="text-xs font-medium text-[var(--color-primary)] hover:underline">
                Se alle
              </button>
            )}
          </div>
          <div className="space-y-3">
            {recentRounds.length === 0 ? (
              <p className="text-sm text-[var(--color-grey-400)] text-center py-8">Ingen runder registrert enna</p>
            ) : (
              recentRounds.map((round) => {
                const { date, month } = formatDate(round.date);
                return (
                  <div
                    key={round.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)] transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-sm font-bold text-[var(--color-grey-900)]">{date}</span>
                      <span className="text-[10px] font-medium text-[var(--color-grey-400)] uppercase">{month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-grey-900)] truncate">
                        {round.courseName ?? "Ukjent bane"}
                      </p>
                      {round.scoreToPar !== null && (
                        <p className="text-xs text-[var(--color-grey-400)]">{formatScoreDiff(round.scoreToPar)} fra par</p>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[var(--color-grey-900)]">{round.totalScore ?? "-"}</div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* Charts Row: SG Radar + Training Volume */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SG Radar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--color-grey-900)]">Strokes Gained</h3>
            {aggregates?.avgSgTotal !== null && aggregates?.avgSgTotal !== undefined && (
              <span className="text-xs text-[var(--color-grey-400)]">
                Totalt: {aggregates.avgSgTotal.toFixed(2)}
              </span>
            )}
          </div>
          {hasSGData ? (
            <SGRadarChart playerSG={playerSG} showLegend={false} />
          ) : (
            <div className="h-[280px] flex items-center justify-center text-sm text-[var(--color-grey-400)]">
              Ingen SG-data i valgt periode
            </div>
          )}
        </motion.div>

        {/* Training Volume Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]"
        >
          <h3 className="font-semibold text-[var(--color-grey-900)] mb-4">Treningsvolum</h3>
          <TrainingVolumeChart data={weeklyTraining} />
        </motion.div>
      </div>

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[var(--color-grey-200)]"
        >
          <h3 className="font-semibold text-[var(--color-grey-900)] mb-6">Fokusomrade-fordeling</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {focusAreas.map((area) => (
              <div key={area.name} className="text-center">
                <div className="h-24 rounded-xl bg-[var(--color-grey-100)] relative overflow-hidden mb-3">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] transition-all duration-500"
                    style={{ height: `${area.percent}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-[var(--color-grey-900)]">{area.name}</p>
                <p className="text-xs text-[var(--color-grey-400)]">{area.percent}%</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* AI Recommendation */}
      {weakestArea && weakestArea.value !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-gradient-to-br from-[var(--color-ai)]/10 to-[var(--color-ai)]/5 rounded-2xl p-6 border border-[var(--color-ai)]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[var(--color-ai)]/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[var(--color-ai)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-grey-900)] mb-1">AI-anbefaling</h3>
              <p className="text-sm text-[var(--color-grey-600)]">
                Basert pa dine SG-data bor du oke fokus pa <strong>{weakestArea.label}</strong>-trening.
                Du taper mest slag ({weakestArea.value.toFixed(1)}) i denne kategorien.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-4">Hurtighandlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
      <details className="group bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
        <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-[var(--color-grey-100)] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
            <Info className="w-5 h-5 text-[var(--color-grey-500)]" />
          </div>
          <span className="font-semibold text-[var(--color-grey-900)]">Hva er Strokes Gained?</span>
          <ChevronRight className="w-5 h-5 text-[var(--color-grey-400)] ml-auto transition-transform group-open:rotate-90" />
        </summary>
        <div className="p-4 pt-0 border-t border-[var(--color-grey-200)]">
          <p className="text-sm text-[var(--color-grey-500)] mb-4 mt-4">
            {PORTAL_CONTENT.statistikk.sgExplanation.intro}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
              <div key={cat.key} className="flex gap-3 p-3 rounded-xl bg-[var(--color-grey-100)]">
                <span className="text-xs font-bold px-2 py-1 rounded bg-[var(--color-primary)] text-white h-fit">
                  {cat.key}
                </span>
                <span className="text-xs text-[var(--color-grey-500)]">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
