"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Lightbulb, BarChart3 } from "lucide-react";
import {
  HeroHeading,
  GlassCard,
  PremiumStatCard,
  Shimmer,
  fadeInUp,
  staggerContainer,
} from "@/components/portal/premium";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { SubNavTabs } from "@/components/portal/layout/sub-nav-tabs";
import type { RoundStats } from "@prisma/client";
import type { PeriodKey, WeeklyTrainingData } from "./actions";

/* ─── Types ─── */

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

/* ─── Constants ─── */

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "season", label: "Sesong" },
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
  { key: "avgSgAroundTheGreen", label: "Short Game" },
  { key: "avgSgPutting", label: "Putting" },
] as const;

const HERO_TITLE = (
  <>
    Din{" "}
    <span className="font-serif italic text-[var(--color-primary)] font-normal">
      statistikk
    </span>
    <span className="text-[var(--color-accent-cta)]">.</span>
  </>
);

/* ─── Helpers ─── */

function trendToNumber(trend: "up" | "down" | "flat" | undefined): number | null {
  if (trend === "down") return -1;
  if (trend === "up") return 1;
  if (trend === "flat") return 0;
  return null;
}

/* ─── SGBar ─── */

function SGBar({ label, value, delay }: { label: string; value: number | null; delay: number }) {
  if (value === null) return null;
  const isPositive = value >= 0;
  const widthPct = Math.min(Math.abs(value) / 3, 1) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="w-24 shrink-0 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-secondary)]">
        {label}
      </span>
      <div className="relative flex h-[5px] flex-1 items-center rounded-full bg-black/[0.05]">
        <div className="absolute left-1/2 h-full w-px bg-black/[0.08]" />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${widthPct / 2}%` }}
          transition={{
            duration: 1.2,
            delay: delay,
            ease: [0.34, 1.56, 0.64, 1],
          }}
          className="absolute h-full rounded-full"
          style={{
            backgroundColor: isPositive
              ? "var(--color-success)"
              : "var(--color-error)",
            ...(isPositive ? { left: "50%" } : { right: "50%" }),
          }}
        />
      </div>
      <span
        className="w-14 shrink-0 text-right text-[13px] font-bold tabular-nums"
        style={{
          color: isPositive
            ? "var(--color-success)"
            : "var(--color-error)",
        }}
      >
        {isPositive ? "+" : ""}
        {value.toFixed(1)}
      </span>
    </div>
  );
}

/* ─── ScoreSparkline ─── */

function ScoreSparkline({ rounds }: { rounds: RoundStats[] }) {
  const data = useMemo(() => {
    return rounds
      .filter((r) => r.totalScore !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((r) => ({
        date: new Date(r.date),
        score: r.totalScore as number,
      }));
  }, [rounds]);

  if (data.length < 2) {
    return (
      <div className="flex h-[160px] items-center justify-center rounded-xl bg-black/[0.02] text-sm text-[var(--color-portal-muted)]">
        Registrer flere runder for a se trenden
      </div>
    );
  }

  const W = 800;
  const H = 160;
  const PAD_X = 20;
  const PAD_Y = 16;

  const scores = data.map((d) => d.score);
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: PAD_X + (i / (data.length - 1)) * (W - 2 * PAD_X),
    // Invert: lower score = higher on chart (better)
    y: PAD_Y + ((d.score - min) / range) * (H - 2 * PAD_Y),
    score: d.score,
    date: d.date,
  }));

  // Smooth bezier
  let linePath = `M${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
    const cpx2 = prev.x + (curr.x - prev.x) * 0.6;
    linePath += ` C${cpx1},${prev.y} ${cpx2},${curr.y} ${curr.x},${curr.y}`;
  }

  const areaPath = `${linePath} L${points[points.length - 1].x},${H} L${points[0].x},${H} Z`;

  const lastPt = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-[160px] w-full">
      {/* Grid lines */}
      {[0.25, 0.5, 0.75].map((pct) => (
        <line
          key={pct}
          x1={PAD_X}
          y1={PAD_Y + pct * (H - 2 * PAD_Y)}
          x2={W - PAD_X}
          y2={PAD_Y + pct * (H - 2 * PAD_Y)}
          stroke="rgba(0,0,0,0.04)"
          strokeWidth="1"
        />
      ))}

      <defs>
        <linearGradient id="scoreFillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="scoreLineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.5" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="1" />
        </linearGradient>
        <filter id="sparkGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Area */}
      <path d={areaPath} fill="url(#scoreFillGrad)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="url(#scoreLineGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        filter="url(#sparkGlow)"
      />

      {/* Last point accent */}
      <circle
        cx={lastPt.x}
        cy={lastPt.y}
        r={5}
        fill="var(--color-accent-cta)"
        stroke="white"
        strokeWidth="2"
        filter="url(#sparkGlow)"
      />

      {/* First and last labels */}
      <text
        x={points[0].x}
        y={H - 2}
        textAnchor="start"
        className="fill-[var(--color-portal-muted)]"
        fontSize="10"
      >
        {data[0].score}
      </text>
      <text
        x={lastPt.x}
        y={H - 2}
        textAnchor="end"
        className="fill-[var(--color-primary)]"
        fontSize="10"
        fontWeight="600"
      >
        {data[data.length - 1].score}
      </text>
    </svg>
  );
}

/* ─── TrainingBarChart ─── */

function TrainingBarChart({ data }: { data: WeeklyTrainingData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[160px] items-center justify-center rounded-xl bg-black/[0.02] text-sm text-[var(--color-portal-muted)]">
        Ingen treningsdata i valgt periode
      </div>
    );
  }

  const maxMinutes = Math.max(...data.map((d) => d.minutes), 1);

  return (
    <div className="flex h-[160px] items-end gap-[5px]">
      {data.map((week, i) => {
        const heightPct = (week.minutes / maxMinutes) * 100;
        const isEmpty = week.minutes === 0;

        return (
          <div key={week.week} className="group relative flex flex-1 flex-col items-center">
            {/* Tooltip on hover */}
            <div className="pointer-events-none absolute -top-8 z-10 whitespace-nowrap rounded-md bg-[var(--color-portal-text)] px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
              {week.minutes} min
            </div>

            {/* Bar */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: isEmpty ? 2 : `${heightPct}%` }}
              transition={{
                duration: 0.8,
                delay: i * 0.04,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className={
                isEmpty
                  ? "w-full rounded-full bg-black/[0.05]"
                  : "w-full rounded-t-md bg-[var(--color-primary)] opacity-70 transition-opacity hover:opacity-100"
              }
              style={
                !isEmpty
                  ? {
                      background:
                        "linear-gradient(180deg, var(--color-primary-alt), var(--color-primary))",
                      boxShadow: "0 0 10px rgba(0,88,64,0.15)",
                    }
                  : undefined
              }
            />

            {/* Label */}
            <span className="mt-2 text-[9px] text-[var(--color-portal-muted)] tabular-nums leading-none">
              {week.week.split(".")[0]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── EmptyState ─── */

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
        <h2 className="mb-2 text-xl font-semibold text-[var(--color-grey-900)]">
          Ingen runder registrert
        </h2>
        <p className="mx-auto mb-8 max-w-md text-[var(--color-muted)]">
          Registrer din forste runde for a se statistikk, Strokes Gained-analyse og
          utviklingstrender.
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

/* ─── Main Component ─── */

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
    [router, searchParams],
  );

  if (rounds.length === 0 && !aggregates) return <EmptyState />;

  const sgTrendValue = trendToNumber(aggregates?.sgTrend);

  const weakestArea = SG_AREAS.map((a) => ({
    label: a.label,
    value: aggregates?.[a.key] ?? null,
  }))
    .filter((a) => a.value !== null)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0] as
    | { label: string; value: number }
    | undefined;

  return (
    <div className="space-y-8">
      {/* Sub-nav */}
      <SubNavTabs tabs={SUB_NAV_TABS} activeTab="/portal/statistikk" />

      {/* Hero heading + period selector + CTA */}
      <HeroHeading
        label="Statistikk"
        title={HERO_TITLE}
        description="Folg utviklingen din over tid. Analyser trender, Strokes Gained og fokusomrader."
        actions={
          <>
            {/* Chip-tabs periode-velger */}
            <div className="flex gap-1.5 rounded-[10px] bg-[var(--color-portal-hover)] p-[3px]">
              {PERIOD_OPTIONS.map((o) => (
                <button
                  key={o.key}
                  onClick={() => handlePeriodChange(o.key)}
                  className={
                    o.key === currentPeriod
                      ? "rounded-[7px] bg-[var(--color-primary)] px-4 py-[7px] text-[13px] font-medium text-white shadow-[0_2px_8px_rgba(0,88,64,0.3)]"
                      : "rounded-[7px] px-4 py-[7px] text-[13px] font-medium text-[var(--color-portal-muted)] hover:text-[var(--color-portal-secondary)]"
                  }
                >
                  {o.label}
                </button>
              ))}
            </div>

            {/* CTA */}
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

      {/* KPI-rad: 4 noekkeltall */}
      <motion.div
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Snitt score"
            value={aggregates?.avgScore ?? 0}
            decimals={1}
            lowerIsBetter
            trend={trendToNumber(aggregates?.scoreTrend)}
            trendLabel="siste periode"
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Handicap"
            value={handicap ?? "-"}
            lowerIsBetter
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="Runder"
            value={aggregates?.roundCount ?? 0}
          />
        </motion.div>
        <motion.div variants={fadeInUp}>
          <PremiumStatCard
            label="SG Total"
            value={aggregates?.avgSgTotal ?? 0}
            decimals={1}
            trend={sgTrendValue}
            trendLabel="siste periode"
          />
        </motion.div>
      </motion.div>

      {/* 2-kolonne: Strokes Gained barer + Treningsvolum */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Strokes Gained horisontale barer */}
        <PremiumCard delay={0.15} glow="green">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
                Strokes Gained
              </p>
              <p className="mt-0.5 text-xs text-[var(--color-portal-muted)]">
                Per kategori
              </p>
            </div>
            {aggregates?.avgSgTotal != null && (
              <span className="rounded-full border border-black/[0.06] bg-black/[0.02] px-3 py-1 text-[11px] font-bold tabular-nums text-[var(--color-portal-text)]">
                Totalt: {aggregates.avgSgTotal > 0 ? "+" : ""}
                {aggregates.avgSgTotal.toFixed(1)}
              </span>
            )}
          </div>
          <div className="space-y-4">
            {SG_AREAS.map((area, i) => (
              <SGBar
                key={area.key}
                label={area.label}
                value={aggregates?.[area.key] ?? null}
                delay={0.3 + i * 0.1}
              />
            ))}
          </div>
          {SG_AREAS.every((a) => (aggregates?.[a.key] ?? null) === null) && (
            <div className="flex h-[120px] items-center justify-center text-sm text-[var(--color-portal-muted)]">
              Ingen SG-data i valgt periode
            </div>
          )}
        </PremiumCard>

        {/* Treningsvolum stolpediagram */}
        <PremiumCard delay={0.2}>
          <div className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
              Treningsvolum
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-portal-muted)]">
              Minutter per uke
            </p>
          </div>
          <TrainingBarChart data={weeklyTraining} />
        </PremiumCard>
      </div>

      {/* Score-trend — fullbredde */}
      <PremiumCard delay={0.25}>
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-portal-muted)]">
              Score-trend
            </p>
            <p className="mt-0.5 text-xs text-[var(--color-portal-muted)]">
              Utvikling over tid
            </p>
          </div>
          {aggregates?.avgScore != null && (
            <span className="rounded-full border border-[var(--color-primary)]/15 bg-[var(--color-primary)]/[0.08] px-3 py-1 text-xs font-bold tabular-nums text-[var(--color-primary)]">
              Snitt {aggregates.avgScore.toFixed(1)}
            </span>
          )}
        </div>
        <ScoreSparkline rounds={rounds} />
      </PremiumCard>

      {/* AI-anbefaling */}
      {weakestArea && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: "spring", damping: 20, stiffness: 100 }}
        >
          <PremiumCard glow="ai" delay={0.4}>
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-ai)]/10">
                <Lightbulb className="h-6 w-6 text-[var(--color-ai)]" strokeWidth={1.75} />
              </div>
              <div>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-portal-muted)]">
                  AI-anbefaling
                </p>
                <h3 className="mb-2 text-[14px] font-semibold text-[var(--color-portal-text)]">
                  Fokuser pa {weakestArea.label}-trening
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--color-portal-secondary)]">
                  Basert pa dine SG-data bor du oke fokus pa{" "}
                  <strong className="text-[var(--color-portal-text)]">
                    {weakestArea.label}
                  </strong>
                  . Du taper mest slag ({weakestArea.value.toFixed(1)}) i denne kategorien.
                </p>
              </div>
            </div>
          </PremiumCard>
        </motion.div>
      )}
    </div>
  );
}
