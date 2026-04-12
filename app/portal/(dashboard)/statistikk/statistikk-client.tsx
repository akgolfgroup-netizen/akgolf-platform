"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BarChart3, TrendingDown, Trophy, Hash, Zap, Plus, Lightbulb } from "lucide-react";
import {
  HeroHeading, GlassCard, PremiumStatCard, Shimmer, fadeInUp, staggerContainer,
} from "@/components/portal/premium";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
import { StatistikkCharts } from "./statistikk-charts";
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

type TrainingAreaBreakdown = { area: string; minutes: number; sessions: number };

interface StatistikkClientProps {
  rounds: RoundStats[];
  aggregates: StatsAggregates | null;
  breakdown: TrainingAreaBreakdown[];
  weeklyTraining: WeeklyTrainingData[];
  handicap?: number | null;
  currentPeriod: PeriodKey;
}

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "1y", label: "1 ar" },
];

const SUB_NAV_TABS = [
  { label: "Oversikt", href: "/portal/statistikk" },
  { label: "Runder", href: "/portal/runde" },
  { label: "Trening", href: "/portal/dagbok" },
];

const SG_AREAS = [
  { key: "avgSgOffTheTee", label: "Tee Total" },
  { key: "avgSgApproach", label: "Approach" },
  { key: "avgSgAroundTheGreen", label: "Naerspill" },
  { key: "avgSgPutting", label: "Putting" },
] as const;

function trendToNumber(trend: "up" | "down" | "flat" | undefined): number | null {
  if (trend === "down") return -1;
  if (trend === "up") return 1;
  if (trend === "flat") return 0;
  return null;
}

const HERO_TITLE = (
  <>
    Din{" "}
    <span className="font-serif italic text-[var(--color-primary)] font-normal">statistikk</span>
    <span className="text-[var(--color-accent-cta)]">.</span>
  </>
);

function EmptyState() {
  return (
    <div className="space-y-10">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/statistikk" />
      <HeroHeading
        label="Statistikk"
        title={HERO_TITLE}
        description="Folg utviklingen din over tid. Registrer din forste runde for a se trender og analyser."
      />
      <GlassCard variant="light" padding="lg" className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface)]">
          <BarChart3 className="h-8 w-8 text-[var(--color-muted)]" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-grey-900)]">Ingen runder registrert</h2>
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

function SGBar({ label, value }: { label: string; value: number | null }) {
  if (value === null) return null;
  const isPositive = value >= 0;
  const barColor = isPositive ? "var(--color-success)" : "var(--color-error)";
  const widthPct = Math.min(Math.abs(value) / 3, 1) * 100;
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-[12px] font-semibold text-[var(--color-grey-900)]">{label}</span>
      <div className="relative flex h-6 flex-1 items-center">
        <div className="absolute left-1/2 h-full w-px bg-[var(--color-grey-900)]/10" />
        <div
          className="absolute h-4 rounded-full transition-all duration-500"
          style={{
            backgroundColor: barColor,
            width: `${widthPct / 2}%`,
            ...(isPositive ? { left: "50%" } : { right: "50%" }),
          }}
        />
      </div>
      <span className="w-12 shrink-0 text-right text-[12px] font-bold tabular-nums" style={{ color: barColor }}>
        {isPositive ? "+" : ""}{value.toFixed(1)}
      </span>
    </div>
  );
}

export function StatistikkClient({
  rounds, aggregates, breakdown, weeklyTraining, handicap, currentPeriod,
}: StatistikkClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePeriodChange = useCallback(
    (period: PeriodKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", period);
      router.push(`/portal/statistikk?${params.toString()}`);
    },
    [router, searchParams],
  );

  if (rounds.length === 0 && !aggregates) return <EmptyState />;

  const sgTrendValue = trendToNumber(aggregates?.sgTrend);
  const weakestArea = SG_AREAS
    .map((a) => ({ label: a.label, value: aggregates?.[a.key] ?? null }))
    .filter((a) => a.value !== null)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0] as
    | { label: string; value: number }
    | undefined;

  return (
    <div className="space-y-10">
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/statistikk" />

      <HeroHeading
        label="Statistikk"
        title={HERO_TITLE}
        description="Folg utviklingen din over tid. Analyser trender, Strokes Gained og fokusomrader."
        actions={
          <>
            <div className="flex h-11 items-center gap-1 rounded-full border border-white/80 bg-white/70 p-1 backdrop-blur-xl shadow-sm">
              {PERIOD_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => handlePeriodChange(o.key)}
                  className={`rounded-full px-4 py-2 text-[11px] font-semibold transition-colors ${
                    o.key === currentPeriod
                      ? "bg-[var(--color-grey-900)] text-white shadow-sm"
                      : "text-[var(--color-muted)] hover:text-[var(--color-grey-900)]"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
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

      {/* STAT CARDS */}
      <motion.div className="grid grid-cols-2 gap-4 lg:grid-cols-4" initial="hidden" animate="visible" variants={staggerContainer}>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard label="Runder" value={aggregates?.roundCount ?? 0} icon={Hash} />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard label="Snitt score" value={aggregates?.avgScore ?? 0} decimals={1} icon={TrendingDown} lowerIsBetter trend={trendToNumber(aggregates?.scoreTrend)} trendLabel="siste periode" />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard label="Handicap" value={handicap ?? "-"} icon={Trophy} lowerIsBetter />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard label="SG Total" value={aggregates?.avgSgTotal ?? 0} decimals={1} icon={Zap} trend={sgTrendValue} trendLabel="siste periode" />
        </motion.div>
      </motion.div>

      {/* SG CATEGORY BARS */}
      <GlassCard variant="light" padding="lg">
        <h3 className="mb-5 text-[14px] font-semibold text-[var(--color-grey-900)]">Strokes Gained per kategori</h3>
        <div className="space-y-3">
          {SG_AREAS.map((area) => (
            <SGBar key={area.key} label={area.label} value={aggregates?.[area.key] ?? null} />
          ))}
        </div>
      </GlassCard>

      {/* CHARTS */}
      <StatistikkCharts
        rounds={rounds} aggregates={aggregates} weeklyTraining={weeklyTraining}
        breakdown={breakdown} handicap={handicap}
      />

      {/* AI RECOMMENDATION */}
      {weakestArea && (
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 20, stiffness: 100 }}
        >
          <GlassCard variant="light" padding="lg">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-ai)]/10">
                <Lightbulb className="h-6 w-6 text-[var(--color-ai)]" strokeWidth={1.75} />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-muted)]">AI-anbefaling</p>
                <h3 className="mb-2 text-[14px] font-semibold text-[var(--color-grey-900)]">
                  Fokuser pa {weakestArea.label}-trening
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--color-text)]">
                  Basert pa dine SG-data bor du oke fokus pa{" "}
                  <strong className="text-[var(--color-grey-900)]">{weakestArea.label}</strong>.
                  Du taper mest slag ({weakestArea.value.toFixed(1)}) i denne kategorien.
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}
