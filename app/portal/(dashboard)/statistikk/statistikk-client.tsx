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
  HeroHeading,
  GlassCard,
  DarkStatCard,
  Shimmer,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
import { ScoreTrendChart } from "@/components/portal/statistikk/score-trend-chart";
import { SGRadarChart } from "@/components/portal/statistikk/sg-radar-chart";
import { TrainingVolumeChart } from "@/components/portal/statistikk/training-volume-chart";
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
    <div className="space-y-10">
      <HeroHeading
        label="Statistikk"
        title={
          <>
            Din{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              statistikk
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Folg utviklingen din over tid. Registrer din forste runde for a se trender og analyser."
      />

      <GlassCard variant="light" padding="lg" className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
          <BarChart3 className="h-8 w-8 text-[var(--color-muted)]" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-grey-900)]">
          Ingen runder registrert
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[var(--color-muted)]">
          Registrer din forste runde for a se statistikk, Strokes Gained-analyse og utviklingstrender.
        </p>
        <Link
          href="/portal/statistikk/ny-runde"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent-cta)] px-6 py-3 text-[12px] font-bold text-[var(--color-grey-900)] shadow-[0_8px_24px_rgba(209,248,67,0.4)] transition-shadow hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)]"
        >
          <Plus className="h-4 w-4" />
          Registrer din forste runde
        </Link>
      </GlassCard>
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

  const avgScoreValue = aggregates?.avgScore ?? null;
  const avgScoreNumeric = typeof avgScoreValue === "number" ? avgScoreValue : 0;
  const trainingHours = totalTrainingMinutes > 0 ? totalTrainingMinutes / 60 : 0;
  const scoreTrendValue =
    aggregates?.scoreTrend === "down"
      ? -1
      : aggregates?.scoreTrend === "up"
        ? 1
        : aggregates?.scoreTrend === "flat"
          ? 0
          : null;

  const periodSelector = (
    <div className="flex h-11 items-center gap-1 rounded-full border border-white/80 bg-white/70 p-1 backdrop-blur-xl shadow-sm">
      {PERIOD_OPTIONS.map((option) => (
        <button
          key={option.key}
          onClick={() => handlePeriodChange(option.key)}
          className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${
            option.key === currentPeriod
              ? "bg-[var(--color-grey-900)] text-white shadow-sm"
              : "text-[var(--color-muted)] hover:text-[var(--color-grey-900)]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-10">
      {/* HERO */}
      <HeroHeading
        label="Statistikk"
        title={
          <>
            Din{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              statistikk
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Folg utviklingen din over tid. Analyser trender, Strokes Gained og fokusomrader."
        actions={
          <>
            {periodSelector}
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/portal/statistikk/ny-runde"
                className="relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-full bg-[var(--color-accent-cta)] px-6 text-[12px] font-bold text-[var(--color-grey-900)] shadow-[0_8px_24px_rgba(209,248,67,0.4)] transition-shadow hover:shadow-[0_12px_32px_rgba(209,248,67,0.5)]"
              >
                <Shimmer />
                <Plus className="relative z-10 h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="relative z-10">Logg runde</span>
              </Link>
            </motion.div>
          </>
        }
      />

      {/* STATS GRID */}
      <motion.div
        className="grid grid-cols-12 gap-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Snittslag"
            value={avgScoreNumeric}
            decimals={1}
            icon={TrendingDown}
            lowerIsBetter
            trend={scoreTrendValue}
            trendLabel="siste periode"
            variant="primary"
            delay={0}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Runder"
            value={aggregates?.roundCount ?? 0}
            icon={Trophy}
            variant="default"
            delay={0.08}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Beste score"
            value={bestScore ?? 0}
            icon={Award}
            trend={bestScoreToPar != null ? 0 : null}
            trendLabel={bestScoreToPar != null ? `${formatScoreDiff(bestScoreToPar)} fra par` : undefined}
            variant="accent"
            delay={0.16}
          />
        </div>
        <div className="col-span-6 lg:col-span-3">
          <DarkStatCard
            label="Treningstimer"
            value={trainingHours}
            unit="t"
            decimals={1}
            icon={Clock}
            trend={totalTrainingSessions > 0 ? 0 : null}
            trendLabel={totalTrainingSessions > 0 ? `${totalTrainingSessions} okter` : undefined}
            variant="default"
            delay={0.24}
          />
        </div>
      </motion.div>

      {/* SECTION LABEL */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Utvikling
        </p>

        {/* Charts Row: Score Trend + Recent Rounds */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Score Trend Chart */}
          <GlassCard variant="light" padding="lg" delay={0.1}>
            <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">
              Score-utvikling
            </h3>
            <ScoreTrendChart rounds={scoreTrendRounds} handicap={handicap ?? undefined} />
          </GlassCard>

          {/* Recent Rounds */}
          <GlassCard variant="light" padding="lg" delay={0.2}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--color-grey-900)]">
                Siste runder
              </h3>
              {rounds.length > 5 && (
                <button className="text-[11px] font-semibold text-[var(--color-primary)] hover:underline">
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
                      className="flex items-center gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 backdrop-blur-xl transition-colors hover:border-[var(--color-primary)]/20 hover:bg-white"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-[var(--color-surface)]">
                        <span className="text-sm font-bold text-[var(--color-grey-900)] tabular-nums">
                          {date}
                        </span>
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                          {month}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[var(--color-grey-900)]">
                          {round.courseName ?? "Ukjent bane"}
                        </p>
                        {round.scoreToPar !== null && (
                          <p className="text-[11px] text-[var(--color-muted)]">
                            {formatScoreDiff(round.scoreToPar)} fra par
                          </p>
                        )}
                      </div>
                      <div className="text-[20px] font-[300] tabular-nums text-[var(--color-grey-900)]">
                        {round.totalScore ?? "-"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* SECTION LABEL */}
      <div>
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Analyse
        </p>

        {/* Charts Row: SG Radar + Training Volume */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* SG Radar Chart */}
          <GlassCard variant="light" padding="lg" delay={0.3}>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--color-grey-900)]">
                Strokes Gained
              </h3>
              {aggregates?.avgSgTotal !== null && aggregates?.avgSgTotal !== undefined && (
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

          {/* Training Volume Chart */}
          <GlassCard variant="light" padding="lg" delay={0.4}>
            <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">
              Treningsvolum
            </h3>
            <TrainingVolumeChart data={weeklyTraining} />
          </GlassCard>
        </div>
      </div>

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <GlassCard variant="light" padding="lg" delay={0.5}>
          <h3 className="mb-6 text-[14px] font-semibold text-[var(--color-grey-900)]">
            Fokusomrade-fordeling
          </h3>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {focusAreas.map((area) => (
              <div key={area.name} className="text-center">
                <div className="relative mb-3 h-24 overflow-hidden rounded-2xl bg-[var(--color-surface)]">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[var(--color-primary)] transition-all duration-500"
                    style={{ height: `${area.percent}%` }}
                  />
                </div>
                <p className="text-[12px] font-semibold text-[var(--color-grey-900)]">
                  {area.name}
                </p>
                <p className="text-[11px] text-[var(--color-muted)] tabular-nums">
                  {area.percent}%
                </p>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* AI Recommendation */}
      {weakestArea && weakestArea.value !== null && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", damping: 20, stiffness: 100 }}
          className="relative overflow-hidden rounded-[24px] border border-white/80 bg-white/70 p-7 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)]"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 100% 0%, rgba(175,82,222,0.08), transparent 60%)",
            }}
          />
          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-ai)]/10">
              <Lightbulb className="h-6 w-6 text-[var(--color-ai)]" strokeWidth={1.75} />
            </div>
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">
                AI-anbefaling
              </p>
              <h3 className="mb-2 text-[14px] font-semibold text-[var(--color-grey-900)]">
                Fokuser pa {weakestArea.label}-trening
              </h3>
              <p className="text-[13px] leading-relaxed text-[var(--color-text)]">
                Basert pa dine SG-data bor du oke fokus pa{" "}
                <strong className="text-[var(--color-grey-900)]">{weakestArea.label}</strong>. Du
                taper mest slag ({weakestArea.value.toFixed(1)}) i denne kategorien.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, type: "spring", damping: 20, stiffness: 100 }}
      >
        <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[var(--color-muted)]">
          <span className="h-px w-6 bg-[var(--color-muted)]" />
          Snarveier
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatistikkQuickAction
            href="/portal/statistikk/ny-runde"
            icon={Plus}
            label="Registrer runde"
            description="Legg til ny score"
          />
          <StatistikkQuickAction
            href="/portal/analyse"
            icon={BarChart3}
            label="Dyp analyse"
            description="Se detaljert statistikk"
          />
          <StatistikkQuickAction
            href="/portal/treningsplan"
            icon={Target}
            label="Treningsplan"
            description="Planlegg okter"
          />
        </div>
      </motion.div>

      {/* SG Explanation */}
      <motion.details
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", damping: 20, stiffness: 100 }}
        className="group overflow-hidden rounded-[24px] border border-white/80 bg-white/70 backdrop-blur-xl shadow-[0_8px_32px_-12px_rgba(10,31,24,0.12)]"
      >
        <summary className="flex cursor-pointer list-none items-center gap-3 p-5 transition-colors hover:bg-white/40">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
            <Info className="h-5 w-5 text-[var(--color-primary)]" strokeWidth={1.75} />
          </div>
          <span className="text-[14px] font-semibold text-[var(--color-grey-900)]">
            Hva er Strokes Gained?
          </span>
          <ChevronRight className="ml-auto h-5 w-5 text-[var(--color-muted)] transition-transform group-open:rotate-90" />
        </summary>
        <div className="border-t border-white/60 p-5 pt-0">
          <p className="mb-4 mt-4 text-[13px] leading-relaxed text-[var(--color-muted)]">
            {PORTAL_CONTENT.statistikk.sgExplanation.intro}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
              <div
                key={cat.key}
                className="flex gap-3 rounded-2xl border border-white/60 bg-white/60 p-3 backdrop-blur-xl"
              >
                <span className="h-fit rounded-lg bg-[var(--color-primary)] px-2 py-1 text-[10px] font-bold text-white">
                  {cat.key}
                </span>
                <span className="text-[12px] text-[var(--color-muted)]">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.details>
    </div>
  );
}

function StatistikkQuickAction({
  href,
  icon: Icon,
  label,
  description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3 rounded-[20px] border border-white/80 bg-white/70 p-4 backdrop-blur-xl transition-all duration-300 will-change-transform hover:-translate-y-0.5 hover:border-[var(--color-primary)]/20 hover:shadow-[0_12px_32px_-12px_rgba(0,88,64,0.2)]"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)]/10 transition-transform group-hover:scale-110">
        <Icon className="h-[18px] w-[18px] text-[var(--color-primary)]" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-[var(--color-grey-900)]">{label}</p>
        <p className="truncate text-[11px] text-[var(--color-muted)]">{description}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 -translate-x-1 text-[var(--color-muted)] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}
