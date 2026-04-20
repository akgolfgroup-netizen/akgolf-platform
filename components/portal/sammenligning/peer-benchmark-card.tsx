"use client";

import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";

import {
  SG_BENCHMARKS,
  getBenchmarkByHandicap,
  type SGBenchmark,
} from "@/lib/portal/golf/sg-benchmarks";

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
  if (diff > 0.1)
    return <Icon name="trending_up" className="w-4 h-4 text-success" />;
  if (diff < -0.1)
    return <Icon name="trending_down" className="w-4 h-4 text-error" />;
  return <Icon name="remove" className="w-4 h-4 text-on-surface-variant" />;
}

function getProgressToNextCategory(
  currentBenchmark: SGBenchmark,
  playerTotal: number
): { nextCategory: SGBenchmark | null; progress: number } {
  const currentIndex = SG_BENCHMARKS.findIndex(
    (b) => b.category === currentBenchmark.category
  );

  if (currentIndex <= 0) {
    return { nextCategory: null, progress: 100 };
  }

  const nextBenchmark = SG_BENCHMARKS[currentIndex - 1];
  const currentTarget = currentBenchmark.sg.total;
  const nextTarget = nextBenchmark.sg.total;
  const range = nextTarget - currentTarget;

  if (range === 0) return { nextCategory: nextBenchmark, progress: 100 };

  const progress = Math.min(
    100,
    Math.max(0, ((playerTotal - currentTarget) / range) * 100)
  );

  return { nextCategory: nextBenchmark, progress };
}

export function PeerBenchmarkCard({
  handicap,
  playerSG,
  avgScore,
}: PeerBenchmarkCardProps) {
  const benchmark = getBenchmarkByHandicap(handicap);

  if (!benchmark) {
    return (
      <div className="flex items-center justify-center rounded-3xl p-6 bg-primary/5 text-center">
        <p className="text-sm text-on-surface-variant">
          Registrer handicap for å se sammenligning
        </p>
      </div>
    );
  }

  const categories = [
    { key: "offTheTee" as const, label: "Tee" },
    { key: "approach" as const, label: "Innspill" },
    { key: "aroundTheGreen" as const, label: "Nærspill" },
    { key: "putting" as const, label: "Putting" },
  ];

  const { nextCategory, progress } =
    playerSG.total !== null
      ? getProgressToNextCategory(benchmark, playerSG.total)
      : { nextCategory: null, progress: 0 };

  return (
    <div className="space-y-5">
      {/* Category badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold text-surface shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #154212 0%, #1A4D36 100%)",
            }}
          >
            {benchmark.category}
          </div>
          <div>
            <p className="text-lg font-bold tracking-tight text-on-surface">
              {benchmark.label}
            </p>
            <p className="text-sm text-on-surface-variant">
              HCP {benchmark.handicapRange[0]}–{benchmark.handicapRange[1]}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Din HCP
          </p>
          <p className="text-3xl font-bold tracking-tight text-on-surface">
            {handicap.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Progress to next category */}
      {nextCategory && playerSG.total !== null && (
        <motion.div
          className="rounded-3xl p-4 bg-gradient-to-br from-primary/5 to-white border border-primary/15"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon name="my_location" className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-on-surface">
                Progresjon mot {nextCategory.label} ({nextCategory.category})
              </span>
            </div>
            <span className="text-sm font-bold text-primary">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-on-surface/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
            />
          </div>
        </motion.div>
      )}

      {/* SG Comparison grid */}
      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat) => {
          const playerValue = playerSG[cat.key];
          const benchmarkValue = benchmark.sg[cat.key];
          const diff =
            playerValue !== null ? playerValue - benchmarkValue : null;

          return (
            <motion.div
              key={cat.key}
              className="rounded-3xl p-4 bg-surface-container-lowest border border-outline-variant/10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: categories.indexOf(cat) * 0.08 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
                  {cat.label}
                </span>
                {diff !== null && getTrendIcon(diff)}
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold tracking-tight text-on-surface">
                  {playerValue !== null ? playerValue.toFixed(2) : "—"}
                </span>
                <span className="text-xs text-on-surface-variant">
                  vs {benchmarkValue.toFixed(2)}
                </span>
              </div>
              {diff !== null && (
                <p
                  className={`text-xs mt-1 font-semibold ${
                    diff > 0
                      ? "text-success"
                      : diff < 0
                        ? "text-error"
                        : "text-on-surface-variant"
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
        <div className="flex items-center justify-between rounded-3xl p-4 bg-surface-container-lowest border border-outline-variant/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="workspace_premium" className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">
                Gjennomsnittlig score
              </p>
              <p className="text-xs text-on-surface-variant">
                Benchmark for kategori {benchmark.category}: {benchmark.averageScore}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold tracking-tight text-on-surface">
              {avgScore}
            </p>
            <p
              className={`text-xs font-semibold ${
                avgScore < benchmark.averageScore
                  ? "text-success"
                  : avgScore > benchmark.averageScore
                    ? "text-error"
                    : "text-on-surface-variant"
              }`}
            >
              {avgScore < benchmark.averageScore ? "−" : "+"}
              {Math.abs(avgScore - benchmark.averageScore)} vs benchmark
            </p>
          </div>
        </div>
      )}

      {/* Peer info */}
      <div className="flex items-center gap-2 text-xs text-on-surface-variant">
        <Icon name="groups" className="h-4 w-4" />
        <span>
          Benchmark basert på {benchmark.label.toLowerCase()}-spillere (HCP{" "}
          {benchmark.handicapRange[0]}–{benchmark.handicapRange[1]})
        </span>
      </div>
    </div>
  );
}
