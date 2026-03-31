"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Info,
  TrendingDown,
  Lightbulb,
  Target,
  Calendar,
  Award,
  ChevronRight,
  Plus,
} from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import { BentoGrid } from "@/components/portal/apple/bento-grid";
import { BentoCard } from "@/components/portal/apple/bento-card";
import { StatCard } from "@/components/portal/apple/stat-card";
import { AppleBadge } from "@/components/portal/apple/apple-badge";
import type { RoundStats } from "@prisma/client";

// ── Types from actions ──

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
}

// ── Helpers ──

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

function getSgColor(value: number | null): string {
  if (value === null) return "text-[var(--color-grey-500)]";
  return value >= 0
    ? "text-[var(--color-grey-900)]"
    : "text-[var(--color-grey-400)]";
}

function getTotalTrainingMinutes(breakdown: TrainingAreaBreakdown[]): number {
  return breakdown.reduce((sum, b) => sum + b.minutes, 0);
}

function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} timer`;
  return `${h} timer ${m} min`;
}

// ── Empty State ──

function EmptyState() {
  return (
    <div className="apple-light-bg min-h-screen -m-6 -mt-4 p-8">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em] mb-1">
          Statistikk
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mb-12">
          Folg utviklingen din over tid
        </p>

        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center mb-6">
            <BarChart3 className="w-8 h-8 text-[var(--color-grey-400)]" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-grey-900)] mb-2">
            Ingen runder registrert
          </h2>
          <p className="text-[15px] text-[var(--color-grey-500)] mb-8 text-center max-w-md">
            Registrer din forste runde for a se statistikk, Strokes
            Gained-analyse og utviklingstrender.
          </p>
          <Link
            href="/portal/statistikk/ny-runde"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-grey-900)] text-white text-[15px] font-medium hover:bg-[var(--color-grey-800)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Registrer din forste runde
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ──

export function StatistikkClient({
  rounds,
  aggregates,
  breakdown,
}: StatistikkClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const periods = ["7 dager", "30 dager", "90 dager", "1 ar"];

  // Empty state
  if (rounds.length === 0 && !aggregates) {
    return <EmptyState />;
  }

  // Derived data
  const recentRounds = rounds.slice(0, 5);
  const bestScore = rounds.reduce<number | null>((best, r) => {
    if (r.totalScore === null) return best;
    if (best === null) return r.totalScore;
    return r.totalScore < best ? r.totalScore : best;
  }, null);

  const bestScoreToPar = rounds.find(
    (r) => r.totalScore === bestScore
  )?.scoreToPar;

  const totalTrainingMinutes = getTotalTrainingMinutes(breakdown);
  const totalTrainingSessions = breakdown.reduce(
    (sum, b) => sum + b.sessions,
    0
  );

  // Focus area distribution (percentage)
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

  // Find the weakest SG area for AI recommendation
  const sgAreas = [
    { label: "Tee Total", value: aggregates?.avgSgOffTheTee ?? null },
    { label: "Approach", value: aggregates?.avgSgApproach ?? null },
    { label: "Naerspill", value: aggregates?.avgSgAroundTheGreen ?? null },
    { label: "Putting", value: aggregates?.avgSgPutting ?? null },
  ];

  const weakestArea = sgAreas
    .filter((a) => a.value !== null)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0];

  return (
    <div className="apple-light-bg min-h-screen -m-6 -mt-4 p-8">
      {/* Page Header */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em] mb-1">
              Statistikk
            </h1>
            <p className="text-[15px] text-[var(--color-grey-500)]">
              Folg utviklingen din over tid
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex gap-1 p-1 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
            {periods.map((period, idx) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(idx)}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  idx === selectedPeriod
                    ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                    : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Hero Section */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-md:grid-cols-1">
          <StatCard
            label="Snittslag"
            value={
              aggregates?.avgScore !== null &&
              aggregates?.avgScore !== undefined
                ? aggregates.avgScore.toFixed(1)
                : "-"
            }
            trend={
              aggregates?.scoreTrend === "down"
                ? -1
                : aggregates?.scoreTrend === "up"
                  ? 1
                  : undefined
            }
            trendLabel={
              aggregates?.scoreTrend === "down"
                ? "bedre"
                : aggregates?.scoreTrend === "up"
                  ? "hoyere"
                  : undefined
            }
            icon={Target}
            iconColor="text-[var(--color-grey-900)]"
            iconBg="bg-[var(--color-grey-100)]"
          />
          <StatCard
            label="Runder"
            value={aggregates?.roundCount?.toString() ?? "0"}
            icon={Calendar}
            iconColor="text-[var(--color-grey-700)]"
            iconBg="bg-[var(--color-grey-100)]"
          />
          <StatCard
            label="Beste score"
            value={bestScore?.toString() ?? "-"}
            trendLabel={
              bestScoreToPar !== null && bestScoreToPar !== undefined
                ? formatScoreDiff(bestScoreToPar) + " fra par"
                : undefined
            }
            icon={Award}
            iconColor="text-[var(--color-grey-700)]"
            iconBg="bg-[var(--color-grey-100)]"
          />
          <StatCard
            label="Trenings-timer"
            value={
              totalTrainingMinutes > 0
                ? (totalTrainingMinutes / 60).toFixed(1)
                : "0"
            }
            trendLabel={
              totalTrainingSessions > 0
                ? `${totalTrainingSessions} okter`
                : undefined
            }
            icon={BarChart3}
            iconColor="text-[var(--color-grey-700)]"
            iconBg="bg-[var(--color-grey-100)]"
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1200px] mx-auto">
        <BentoGrid gap="md">
          {/* Score Chart - Wide */}
          <BentoCard
            span={8}
            title="Score-utvikling"
            icon={TrendingDown}
            iconColor="text-[var(--color-grey-700)]"
            action={
              aggregates?.scoreTrend === "down" ? (
                <AppleBadge variant="success" size="sm" dot>
                  Fallende trend
                </AppleBadge>
              ) : aggregates?.scoreTrend === "up" ? (
                <AppleBadge variant="neutral" size="sm" dot>
                  Stigende trend
                </AppleBadge>
              ) : null
            }
          >
            <div className="h-[200px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-grey-100)] to-white border border-[var(--color-grey-100)]">
              <div className="text-center text-[var(--color-grey-400)]">
                <TrendingDown className="w-10 h-10 mx-auto mb-3 text-[var(--color-grey-300)]" />
                <p className="text-sm font-medium">Score-graf</p>
                <p className="text-xs mt-1">
                  {aggregates?.roundCount
                    ? `Basert pa ${aggregates.roundCount} runder`
                    : "Viser trend over valgt periode"}
                </p>
              </div>
            </div>
          </BentoCard>

          {/* Recent Rounds - Narrow */}
          <BentoCard
            span={4}
            title="Siste runder"
            action={
              rounds.length > 5 ? (
                <button className="text-[13px] font-medium text-[var(--color-grey-900)] flex items-center gap-1 hover:text-[var(--color-grey-700)] transition-colors">
                  Se alle
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : null
            }
          >
            <div className="space-y-3">
              {recentRounds.length === 0 ? (
                <div className="text-center py-8 text-[var(--color-grey-400)]">
                  <p className="text-sm">Ingen runder registrert enna</p>
                </div>
              ) : (
                recentRounds.map((round) => {
                  const { date, month } = formatDate(round.date);
                  return (
                    <div
                      key={round.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-grey-100)] hover:bg-[var(--color-grey-200)]/50 transition-colors cursor-pointer"
                    >
                      <div className="w-11 h-11 bg-white rounded-xl flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-[15px] font-bold text-[var(--color-grey-900)] leading-none">
                          {date}
                        </span>
                        <span className="text-[10px] font-semibold text-[var(--color-grey-500)] uppercase">
                          {month}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[var(--color-grey-900)] truncate">
                          {round.courseName ?? "Ukjent bane"}
                        </p>
                        {round.scoreToPar !== null && (
                          <p className="text-[11px] text-[var(--color-grey-500)]">
                            {formatScoreDiff(round.scoreToPar)} fra par
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--color-grey-900)]">
                          {round.totalScore ?? "-"}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </BentoCard>

          {/* Strokes Gained */}
          <BentoCard
            span={6}
            title="Strokes Gained"
            icon={Target}
            action={
              <button className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-grey-400)] hover:bg-[var(--color-grey-100)] transition-colors">
                <Info className="w-4 h-4" />
              </button>
            }
          >
            {aggregates?.avgSgTotal !== null &&
            aggregates?.avgSgTotal !== undefined ? (
              <div className="flex gap-6">
                {/* Radar placeholder */}
                <div className="w-[160px] h-[160px] rounded-full bg-gradient-to-br from-[var(--color-grey-100)] to-white border-2 border-[var(--color-grey-100)] flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-[var(--color-grey-400)]">
                    SG Radar
                  </span>
                </div>

                {/* SG Stats */}
                <div className="flex-1 grid grid-cols-2 gap-3">
                  {sgAreas.map((stat) => (
                    <div
                      key={stat.label}
                      className="p-3 rounded-xl bg-[var(--color-grey-100)] text-center"
                    >
                      <p className="text-[11px] font-medium text-[var(--color-grey-500)] mb-1">
                        {stat.label}
                      </p>
                      <p
                        className={`text-lg font-bold ${getSgColor(stat.value)}`}
                      >
                        {stat.value !== null
                          ? `${stat.value >= 0 ? "+" : ""}${stat.value.toFixed(1)}`
                          : "-"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[160px] flex items-center justify-center rounded-xl bg-[var(--color-grey-100)]">
                <p className="text-sm text-[var(--color-grey-400)]">
                  Registrer runder med SG-data for a se analyse
                </p>
              </div>
            )}
          </BentoCard>

          {/* Training Volume */}
          <BentoCard
            span={6}
            title="Treningsvolum"
            icon={BarChart3}
            iconColor="text-[var(--color-grey-700)]"
          >
            {totalTrainingMinutes > 0 ? (
              <>
                <div className="h-[140px] flex items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-grey-100)] to-white border border-[var(--color-grey-100)] mb-4">
                  <div className="text-center text-[var(--color-grey-400)]">
                    <BarChart3 className="w-8 h-8 mx-auto mb-2 text-[var(--color-grey-300)]" />
                    <p className="text-sm font-medium">
                      Ukentlig treningsvolum
                    </p>
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-[var(--color-grey-100)]">
                  <div>
                    <p className="text-[11px] font-medium text-[var(--color-grey-500)]">
                      Totalt
                    </p>
                    <p className="text-lg font-bold text-[var(--color-grey-900)]">
                      {formatMinutesToHours(totalTrainingMinutes)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-medium text-[var(--color-grey-500)]">
                      Okter
                    </p>
                    <p className="text-lg font-bold text-[var(--color-grey-900)]">
                      {totalTrainingSessions}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-[200px] flex items-center justify-center rounded-xl bg-[var(--color-grey-100)]">
                <div className="text-center text-[var(--color-grey-400)]">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm font-medium">
                    Ingen treningsdata enna
                  </p>
                  <p className="text-xs mt-1">
                    Logg treningsoktene dine i dagboken
                  </p>
                </div>
              </div>
            )}
          </BentoCard>

          {/* Focus Area Distribution - Full Width */}
          {focusAreas.length > 0 && (
            <BentoCard
              span={12}
              title="Fokusomrade-fordeling"
              icon={Target}
              iconColor="text-[var(--color-grey-900)]"
            >
              <div className="grid grid-cols-4 gap-4 max-md:grid-cols-2">
                {focusAreas.map((area) => (
                  <div key={area.name} className="text-center">
                    <div className="h-[100px] rounded-xl bg-[var(--color-grey-100)] relative overflow-hidden mb-3">
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-[var(--color-grey-900)] transition-all duration-500 rounded-b-xl"
                        style={{ height: `${area.percent}%` }}
                      />
                    </div>
                    <p className="text-[13px] font-semibold text-[var(--color-grey-900)]">
                      {area.name}
                    </p>
                    <p className="text-xs text-[var(--color-grey-500)]">
                      {area.percent}%
                    </p>
                  </div>
                ))}
              </div>

              {/* AI Recommendation — only if we have SG data */}
              {weakestArea && weakestArea.value !== null && (
                <div className="mt-6 p-4 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-200)] flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="w-5 h-5 text-[var(--color-grey-700)]" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-[var(--color-grey-900)] mb-1">
                        AI-anbefaling
                      </p>
                      <p className="text-[13px] text-[var(--color-grey-600)]">
                        Basert pa SG-data bor du oke fokus pa{" "}
                        {weakestArea.label}-trening. Du taper mest slag (
                        {weakestArea.value.toFixed(1)}) i denne kategorien.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </BentoCard>
          )}

          {/* SG Explanation */}
          <BentoCard span={12} variant="solid" hover={false}>
            <details className="group">
              <summary className="flex items-center gap-3 cursor-pointer list-none">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center">
                  <Info className="w-5 h-5 text-[var(--color-grey-900)]" />
                </div>
                <span className="text-[15px] font-semibold text-[var(--color-grey-900)]">
                  Hva er Strokes Gained?
                </span>
                <ChevronRight className="w-5 h-5 text-[var(--color-grey-400)] ml-auto transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-[var(--color-grey-100)]">
                <p className="text-[14px] text-[var(--color-grey-600)] mb-4 leading-relaxed">
                  {PORTAL_CONTENT.statistikk.sgExplanation.intro}
                </p>
                <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
                  {PORTAL_CONTENT.statistikk.sgExplanation.categories.map(
                    (cat) => (
                      <div
                        key={cat.key}
                        className="flex gap-3 p-3 rounded-xl bg-[var(--color-grey-100)]"
                      >
                        <AppleBadge variant="dark" size="sm">
                          {cat.key}
                        </AppleBadge>
                        <span className="text-[13px] text-[var(--color-grey-600)]">
                          {cat.description}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </details>
          </BentoCard>
        </BentoGrid>
      </div>
    </div>
  );
}
