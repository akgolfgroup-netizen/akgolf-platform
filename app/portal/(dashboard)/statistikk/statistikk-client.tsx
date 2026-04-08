"use client";

import { useState } from "react";
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
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import type { RoundStats } from "@prisma/client";

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
  handicap?: number | null;
}

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

function formatMinutesToHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}t`;
  return `${h}t ${m}m`;
}

function EmptyState() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c16]">Statistikk</h1>
        <p className="text-[#6b7366] mt-1">Følg utviklingen din over tid</p>
      </div>

      <div className="bg-white rounded-3xl p-12 text-center border border-[#c2c9bb]/50">
        <div className="w-16 h-16 rounded-2xl bg-[#f7f3ea] flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-8 h-8 text-[#c2c9bb]" />
        </div>
        <h2 className="text-xl font-semibold text-[#1c1c16] mb-2">
          Ingen runder registrert
        </h2>
        <p className="text-[#6b7366] mb-8 max-w-md mx-auto">
          Registrer din første runde for å se statistikk, Strokes Gained-analyse og utviklingstrender.
        </p>
        <Link
          href="/portal/statistikk/ny-runde"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#154212] text-white font-medium hover:bg-[#0d2e0c] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Registrer din første runde
        </Link>
      </div>
    </div>
  );
}

export function StatistikkClient({
  rounds,
  aggregates,
  breakdown,
}: StatistikkClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(1);
  const periods = ["7 dager", "30 dager", "90 dager", "1 år"];

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
    { label: "Tee", value: aggregates?.avgSgOffTheTee ?? null, color: "#154212" },
    { label: "Approach", value: aggregates?.avgSgApproach ?? null, color: "#3b82f6" },
    { label: "Nærspill", value: aggregates?.avgSgAroundTheGreen ?? null, color: "#f59e0b" },
    { label: "Putting", value: aggregates?.avgSgPutting ?? null, color: "#8b5cf6" },
  ];

  const weakestArea = sgAreas
    .filter((a) => a.value !== null)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0];

  // Score trend data for chart
  const scoreData = rounds
    .slice(0, 12)
    .reverse()
    .map((r) => ({
      date: r.date.toISOString(),
      value: r.totalScore ?? 0,
    }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1c1c16]">Statistikk</h1>
          <p className="text-[#6b7366] mt-1">Følg utviklingen din over tid</p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-1 p-1 rounded-xl bg-white border border-[#c2c9bb]/50">
          {periods.map((period, idx) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                idx === selectedPeriod
                  ? "bg-[#154212] text-white"
                  : "text-[#6b7366] hover:text-[#1c1c16]"
              }`}
            >
              {period}
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
              ? { value: 1, label: "høyere" }
              : undefined
          }
          icon={aggregates?.scoreTrend === "down" ? TrendingDown : TrendingUp}
          iconColor={aggregates?.scoreTrend === "down" ? "#22c55e" : "#ef4444"}
        />
        <StatCard
          label="Runder"
          value={aggregates?.roundCount?.toString() ?? "0"}
          icon={Calendar}
          iconColor="#154212"
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
          iconColor="#f59e0b"
        />
        <StatCard
          label="Treningstid"
          value={totalTrainingMinutes > 0 ? (totalTrainingMinutes / 60).toFixed(1) + "t" : "0"}
          trend={
            totalTrainingSessions > 0
              ? { value: 0, label: `${totalTrainingSessions} økter` }
              : undefined
          }
          icon={BarChart3}
          iconColor="#8b5cf6"
        />
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <ProgressChart
            data={scoreData.length > 1 ? scoreData : [{ date: "2024-01", value: 85 }, { date: "2024-02", value: 82 }]}
            title="Score-utvikling"
            color="#154212"
            height={200}
          />
        </motion.div>

        {/* Recent Rounds */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1c1c16]">Siste runder</h3>
            {rounds.length > 5 && (
              <button className="text-xs font-medium text-[#154212] hover:underline">
                Se alle
              </button>
            )}
          </div>
          <div className="space-y-3">
            {recentRounds.length === 0 ? (
              <p className="text-sm text-[#8a9385] text-center py-8">Ingen runder registrert ennå</p>
            ) : (
              recentRounds.map((round) => {
                const { date, month } = formatDate(round.date);
                return (
                  <div
                    key={round.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#f7f3ea] hover:bg-[#e8e4db] transition-colors"
                  >
                    <div className="w-10 h-10 bg-white rounded-lg flex flex-col items-center justify-center shadow-sm flex-shrink-0">
                      <span className="text-sm font-bold text-[#1c1c16]">{date}</span>
                      <span className="text-[10px] font-medium text-[#8a9385] uppercase">{month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1c1c16] truncate">
                        {round.courseName ?? "Ukjent bane"}
                      </p>
                      {round.scoreToPar !== null && (
                        <p className="text-xs text-[#8a9385]">{formatScoreDiff(round.scoreToPar)} fra par</p>
                      )}
                    </div>
                    <div className="text-lg font-bold text-[#1c1c16]">{round.totalScore ?? "-"}</div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      </div>

      {/* SG Analysis */}
      {aggregates?.avgSgTotal !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-[#1c1c16]">Strokes Gained</h3>
            <div className="text-xs text-[#8a9385]">
              Snitt: {aggregates?.avgSgTotal?.toFixed(2) ?? "-"}
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sgAreas.map((area) => (
              <div key={area.label} className="text-center p-4 rounded-xl bg-[#f7f3ea]">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ backgroundColor: `${area.color}20` }}
                >
                  <Target className="w-6 h-6" style={{ color: area.color }} />
                </div>
                <p className="text-xs text-[#8a9385] uppercase tracking-wider">{area.label}</p>
                <p className="text-2xl font-bold text-[#1c1c16] mt-1">
                  {area.value?.toFixed(2) ?? "-"}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Focus Areas */}
      {focusAreas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50"
        >
          <h3 className="font-semibold text-[#1c1c16] mb-6">Fokusområde-fordeling</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {focusAreas.map((area) => (
              <div key={area.name} className="text-center">
                <div className="h-24 rounded-xl bg-[#f7f3ea] relative overflow-hidden mb-3">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#154212] transition-all duration-500"
                    style={{ height: `${area.percent}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-[#1c1c16]">{area.name}</p>
                <p className="text-xs text-[#8a9385]">{area.percent}%</p>
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
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-gradient-to-br from-[#8b5cf6]/10 to-[#8b5cf6]/5 rounded-2xl p-6 border border-[#8b5cf6]/20"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1c1c16] mb-1">AI-anbefaling</h3>
              <p className="text-sm text-[#42493e]">
                Basert på dine SG-data bør du øke fokus på <strong>{weakestArea.label}</strong>-trening. 
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
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h3 className="text-sm font-semibold text-[#1c1c16] mb-4">Hurtighandlinger</h3>
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
            description="Planlegg økter"
          />
        </div>
      </motion.div>

      {/* SG Explanation */}
      <details className="group bg-white rounded-2xl border border-[#c2c9bb]/50 overflow-hidden">
        <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-[#f7f3ea] transition-colors">
          <div className="w-10 h-10 rounded-xl bg-[#f7f3ea] flex items-center justify-center">
            <Info className="w-5 h-5 text-[#6b7366]" />
          </div>
          <span className="font-semibold text-[#1c1c16]">Hva er Strokes Gained?</span>
          <ChevronRight className="w-5 h-5 text-[#8a9385] ml-auto transition-transform group-open:rotate-90" />
        </summary>
        <div className="p-4 pt-0 border-t border-[#c2c9bb]/30">
          <p className="text-sm text-[#6b7366] mb-4 mt-4">
            {PORTAL_CONTENT.statistikk.sgExplanation.intro}
          </p>
          <div className="grid grid-cols-2 gap-3">
            {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
              <div key={cat.key} className="flex gap-3 p-3 rounded-xl bg-[#f7f3ea]">
                <span className="text-xs font-bold px-2 py-1 rounded bg-[#154212] text-white h-fit">
                  {cat.key}
                </span>
                <span className="text-xs text-[#6b7366]">{cat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </details>
    </div>
  );
}
