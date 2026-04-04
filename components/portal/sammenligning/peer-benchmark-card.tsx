"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Users, Target, Award } from "lucide-react";
import { SG_BENCHMARKS, getBenchmarkByHandicap, type SGBenchmark } from "@/lib/portal/golf/sg-benchmarks";

interface PeerBenchmarkCardProps {
  handicap: number;
  playerSG: {
    total: number | null;
    offTheTee: number | null;
    approach: number | null;
    aroundTheGreen: number | null;
    putting: number | null;
  };
  avgScore?: number;
}

function getTrendIcon(diff: number) {
  if (diff > 0.1) return <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />;
  if (diff < -0.1) return <TrendingDown className="w-4 h-4 text-[#D14343]" />;
  return <Minus className="w-4 h-4 text-[var(--color-grey-400)]" />;
}

function getProgressToNextCategory(
  currentBenchmark: SGBenchmark,
  playerTotal: number
): { nextCategory: SGBenchmark | null; progress: number } {
  const currentIndex = SG_BENCHMARKS.findIndex((b) => b.category === currentBenchmark.category);

  if (currentIndex <= 0) {
    return { nextCategory: null, progress: 100 };
  }

  const nextBenchmark = SG_BENCHMARKS[currentIndex - 1];
  const currentTarget = currentBenchmark.sg.total;
  const nextTarget = nextBenchmark.sg.total;
  const range = nextTarget - currentTarget;

  if (range === 0) return { nextCategory: nextBenchmark, progress: 100 };

  const progress = Math.min(100, Math.max(0, ((playerTotal - currentTarget) / range) * 100));

  return { nextCategory: nextBenchmark, progress };
}

export function PeerBenchmarkCard({ handicap, playerSG, avgScore }: PeerBenchmarkCardProps) {
  const benchmark = getBenchmarkByHandicap(handicap);

  if (!benchmark) {
    return (
      <div className="p-6 rounded-xl bg-[var(--color-grey-100)] text-center">
        <p className="text-sm text-[var(--color-grey-500)]">
          Registrer handicap for a se sammenligning
        </p>
      </div>
    );
  }

  const categories = [
    { key: "offTheTee" as const, label: "Tee" },
    { key: "approach" as const, label: "Innspill" },
    { key: "aroundTheGreen" as const, label: "Narspill" },
    { key: "putting" as const, label: "Putting" },
  ];

  const { nextCategory, progress } = playerSG.total !== null
    ? getProgressToNextCategory(benchmark, playerSG.total)
    : { nextCategory: null, progress: 0 };

  return (
    <div className="space-y-4">
      {/* Category badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold text-white"
            style={{
              background: `linear-gradient(135deg, var(--color-grey-900) 0%, var(--color-grey-600) 100%)`,
            }}
          >
            {benchmark.category}
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--color-grey-900)]">
              {benchmark.label}
            </p>
            <p className="text-sm text-[var(--color-grey-500)]">
              HCP {benchmark.handicapRange[0]}-{benchmark.handicapRange[1]}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-[var(--color-grey-500)]">Din HCP</p>
          <p className="text-2xl font-bold text-[var(--color-grey-900)]">{handicap.toFixed(1)}</p>
        </div>
      </div>

      {/* Progress to next category */}
      {nextCategory && playerSG.total !== null && (
        <motion.div
          className="p-4 rounded-xl bg-gradient-to-r from-[var(--color-grey-100)] to-white border border-[var(--color-grey-200)]"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--color-grey-500)]" />
              <span className="text-sm font-medium text-[var(--color-grey-900)]">
                Progresjon mot {nextCategory.label} ({nextCategory.category})
              </span>
            </div>
            <span className="text-sm font-bold text-[var(--color-grey-900)]">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 bg-[var(--color-grey-200)] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-[var(--color-grey-600)] to-[var(--color-grey-900)]"
            />
          </div>
        </motion.div>
      )}

      {/* SG Comparison grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const playerValue = playerSG[cat.key];
          const benchmarkValue = benchmark.sg[cat.key];
          const diff = playerValue !== null ? playerValue - benchmarkValue : null;

          return (
            <motion.div
              key={cat.key}
              className="p-4 rounded-xl bg-[var(--color-grey-100)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: categories.indexOf(cat) * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--color-grey-500)]">
                  {cat.label}
                </span>
                {diff !== null && getTrendIcon(diff)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-[var(--color-grey-900)]">
                  {playerValue !== null ? playerValue.toFixed(2) : "-"}
                </span>
                <span className="text-xs text-[var(--color-grey-400)]">
                  vs {benchmarkValue.toFixed(2)}
                </span>
              </div>
              {diff !== null && (
                <p
                  className={`text-xs mt-1 font-medium ${
                    diff > 0 ? "text-[#2D6A4F]" : diff < 0 ? "text-[#D14343]" : "text-[var(--color-grey-500)]"
                  }`}
                >
                  {diff > 0 ? "+" : ""}
                  {diff.toFixed(2)} slag
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Score comparison */}
      {avgScore && (
        <div className="p-4 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-[var(--color-grey-500)]" />
            <div>
              <p className="text-sm font-medium text-[var(--color-grey-900)]">
                Gjennomsnittlig score
              </p>
              <p className="text-xs text-[var(--color-grey-500)]">
                Benchmark for kategori {benchmark.category}: {benchmark.averageScore}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-[var(--color-grey-900)]">{avgScore}</p>
            <p
              className={`text-xs font-medium ${
                avgScore < benchmark.averageScore
                  ? "text-[#2D6A4F]"
                  : avgScore > benchmark.averageScore
                    ? "text-[#D14343]"
                    : "text-[var(--color-grey-500)]"
              }`}
            >
              {avgScore < benchmark.averageScore ? "-" : "+"}
              {Math.abs(avgScore - benchmark.averageScore)} vs benchmark
            </p>
          </div>
        </div>
      )}

      {/* Peer info */}
      <div className="flex items-center gap-2 text-xs text-[var(--color-grey-500)]">
        <Users className="w-4 h-4" />
        <span>Benchmark basert pa {benchmark.label.toLowerCase()}-spillere (HCP {benchmark.handicapRange[0]}-{benchmark.handicapRange[1]})</span>
      </div>
    </div>
  );
}
