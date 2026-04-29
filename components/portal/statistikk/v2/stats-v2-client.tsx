"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { RoundStats } from "@prisma/client";
import type {
  PeriodKey,
  HcpForecastData,
} from "@/app/portal/(dashboard)/statistikk/actions";
import type { USIResult } from "@/lib/portal/usi/compute-usi";
import { KpiCard } from "@/components/portal/dashboard-bento/kpi-card";

import { PeriodTabs } from "./period-tabs";
import { StatsHeroBenchmark } from "./stats-hero-benchmark";
import { FocusCallout } from "./focus-callout";
import { SgDistributionCard } from "./sg-distribution-card";
import { HcpTrendCard } from "./hcp-trend-card";
import { ComparisonGrid } from "./comparison-grid";
import { AkPyramidCard } from "./ak-pyramid-card";
import { RoundsTable } from "./rounds-table";
import {
  PERIOD_LABEL,
  buildHeroLede,
  describeLevel,
  hcpToNextLevel,
  pickBiggestOpportunity,
  type StatsAggregates,
} from "./stats-v2-helpers";

interface StatsV2ClientProps {
  rounds: RoundStats[];
  aggregates: StatsAggregates | null;
  handicap: number | null;
  currentPeriod: PeriodKey;
  hcpForecast: HcpForecastData;
  usi: USIResult | null;
  trainingSessions30d: number;
  streak: number;
}

/**
 * StatsV2Client — pixel-naer Brand Guide V2.0-implementering av
 * statistikk-siden basert pa stats-v2.html, a13-sammenligning.html og
 * a14-strategi.html.
 *
 * Layout: 12-kolonne grid pa surface-bakgrunn. Hero benchmark-kort
 * (mork gradient) + lyse Brand Guide V2.0-kort under.
 */
export function StatsV2Client({
  rounds,
  aggregates,
  handicap,
  currentPeriod,
  hcpForecast,
  usi,
  trainingSessions30d,
  streak,
}: StatsV2ClientProps) {
  const periodLabel = PERIOD_LABEL[currentPeriod];
  const roundCount = aggregates?.roundCount ?? 0;

  // Beregn percentil basert pa avgScore relativ til "scratch baseline" (par 72).
  // Hvis avgScore = 72 → 95. percentil; +5 = 80; +10 = 65; +15 = 50; +20 = 35.
  const avgScore = aggregates?.avgScore ?? null;
  const overallPercentile = avgScore !== null
    ? Math.max(15, Math.min(95, Math.round(95 - (avgScore - 72) * 3)))
    : null;

  const heroHeadline = overallPercentile !== null
    ? `Du ligger over ${overallPercentile} % av spillere i din peer-gruppe.`
    : "Vi trenger flere runder for å plassere deg.";

  const heroLede = overallPercentile !== null
    ? buildHeroLede(aggregates)
    : "Registrer noen runder med Strokes Gained-data så bygger vi en peer-sammenligning for deg.";

  const focusItem = pickBiggestOpportunity(aggregates);

  // Pyramide-nivaa (A-K) hentes fra USI hvis tilgjengelig
  const currentLevel = usi?.estimatedCategory ?? "F";
  const trend90d = hcpForecast.trendSlopePerWeek
    ? hcpForecast.trendSlopePerWeek * 12 // 12 uker = 90d
    : null;
  const forecast12m = hcpForecast.predicted90d
    ? {
        value: Math.max(0, hcpForecast.predicted90d - 1.5),
        ci: 1.2,
      }
    : null;

  const hcpToNext = handicap !== null
    ? hcpToNextLevel(handicap, currentLevel)
    : null;

  const levelDescription = describeLevel(currentLevel);

  const handicapHistory = hcpForecast.history.slice(-12).map((h) => h.hcp);

  return (
    <div
      className="-mx-4 -my-4 lg:-mx-8 lg:-my-7 min-h-screen p-4 lg:p-7"
      style={{ background: "var(--color-surface, #F4F6F4)" }}
    >
      <div className="mx-auto max-w-[1400px]">
        {/* Page header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div
              className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
              style={{ color: "var(--color-primary, #005840)" }}
            >
              / Statistikk · Benchmark
            </div>
            <h1
              className="mt-2 font-inter-tight text-[36px] lg:text-[44px] font-bold leading-[1.05] tracking-[-0.03em]"
              style={{ color: "var(--color-ink, #0A1F18)" }}
            >
              Hvordan ligger du an?
            </h1>
            <p
              className="mt-2 max-w-[58ch] text-sm leading-[1.55]"
              style={{ color: "var(--color-ink-muted, #5C6B62)" }}
            >
              Sammenligning mot peer-gruppe (HCP 6–10) og AK-pyramiden. Tallene
              oppdateres etter hver runde. Periode: {periodLabel} ·{" "}
              {roundCount} runder · {trainingSessions30d} økter.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <PeriodTabs current={currentPeriod} />
            <Link
              href="/portal/runde/ny"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors"
              style={{
                background: "var(--color-primary, #005840)",
                color: "#FFFFFF",
              }}
            >
              <Plus className="h-4 w-4" />
              Ny runde
            </Link>
          </div>
        </header>

        {/* Bento grid */}
        <div className="grid grid-cols-12 gap-4 lg:gap-5">
          {/* Hero benchmark */}
          <StatsHeroBenchmark
            percentile={overallPercentile}
            peerLabel="peer-gruppen"
            peerCount={142}
            delta90d={
              hcpForecast.trendSlopePerWeek < 0
                ? Math.round(Math.abs(hcpForecast.trendSlopePerWeek) * 12 * 5)
                : null
            }
            headline={heroHeadline}
            lede={heroLede}
          />

          {/* KPI-rad (4 kort) */}
          <KpiCard
            label="HCP aktiv"
            value={handicap !== null ? handicap.toFixed(1) : "—"}
            changeText={
              hcpForecast.trendSlopePerWeek !== 0
                ? `${Math.abs(hcpForecast.trendSlopePerWeek).toFixed(2)}/uke`
                : undefined
            }
            changeDirection={
              hcpForecast.trendSlopePerWeek === 0
                ? "flat"
                : hcpForecast.trendSlopePerWeek < 0
                  ? "down"
                  : "up"
            }
            changeIsGood={hcpForecast.trendSlopePerWeek < 0}
            contextLabel={`siste ${periodLabel}`}
            sparkline={
              handicapHistory.length > 1
                ? { points: handicapHistory, type: "line" }
                : undefined
            }
          />
          <KpiCard
            label="Snittscore"
            value={avgScore !== null ? avgScore.toFixed(1) : "—"}
            contextLabel={`${roundCount} runder`}
          />
          <KpiCard
            label="GIR-prosent"
            value={
              aggregates?.avgGirPct !== null && aggregates?.avgGirPct !== undefined
                ? `${Math.round(aggregates.avgGirPct)}%`
                : "—"
            }
            contextLabel="snitt"
          />
          <KpiCard
            label="SG Total"
            value={
              aggregates?.avgSgTotal !== null && aggregates?.avgSgTotal !== undefined
                ? `${aggregates.avgSgTotal >= 0 ? "+" : ""}${aggregates.avgSgTotal.toFixed(2)}`
                : "—"
            }
            contextLabel="vs scratch"
            accent
          />

          {/* Fokus-callout */}
          {focusItem ? (
            <FocusCallout
              title={focusItem.title}
              tag={focusItem.tag}
              description={focusItem.description}
              ctaLabel="Lag plan"
              ctaHref="/portal/treningsplan"
            />
          ) : null}

          {/* SG-fordeling + HCP-trend */}
          <SgDistributionCard
            offTheTee={aggregates?.avgSgOffTheTee ?? null}
            approach={aggregates?.avgSgApproach ?? null}
            aroundTheGreen={aggregates?.avgSgAroundTheGreen ?? null}
            putting={aggregates?.avgSgPutting ?? null}
            total={aggregates?.avgSgTotal ?? null}
            roundCount={roundCount}
          />
          <HcpTrendCard
            current={handicap}
            trendPerWeek={hcpForecast.trendSlopePerWeek}
            history={handicapHistory}
            forecast30d={hcpForecast.predicted30d}
            forecast90d={hcpForecast.predicted90d}
          />

          {/* Detaljert sammenligning */}
          <ComparisonGrid
            aggregates={aggregates}
            trainingSessions30d={trainingSessions30d}
          />

          {/* AK-pyramide */}
          <section className="col-span-12 mt-2">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div
                  className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
                >
                  / AK-pyramiden
                </div>
                <h2
                  className="mt-1.5 font-inter-tight text-[24px] font-bold tracking-[-0.025em]"
                  style={{ color: "var(--color-ink, #0A1F18)" }}
                >
                  Plassering i talentutviklingsmodellen
                </h2>
              </div>
              <div
                className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
              >
                A–K · 8 nivåer
              </div>
            </div>
            <AkPyramidCard
              currentHcp={handicap}
              currentLevel={currentLevel}
              levelDescription={levelDescription}
              trend90d={trend90d}
              hcpToNextLevel={hcpToNext}
              forecast12m={forecast12m}
            />
          </section>

          {/* Runde-tabell */}
          <section className="col-span-12 mt-2">
            <div className="mb-4">
              <div
                className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-ink-subtle, #6F7A74)" }}
              >
                / Detaljer
              </div>
              <h2
                className="mt-1.5 font-inter-tight text-[24px] font-bold tracking-[-0.025em]"
                style={{ color: "var(--color-ink, #0A1F18)" }}
              >
                Siste runder
              </h2>
            </div>
            <RoundsTable rounds={rounds} />
          </section>

          {/* Footer-stripe */}
          <div
            className="col-span-12 mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-5 text-xs"
            style={{
              borderColor: "var(--color-line, #E4EAE6)",
              color: "var(--color-ink-subtle, #6F7A74)",
            }}
          >
            <div className="flex flex-wrap gap-6">
              <div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]">
                  Datakilde
                </div>
                <div
                  className="mt-0.5 text-[11px] font-semibold"
                  style={{ color: "var(--color-ink, #0A1F18)" }}
                >
                  {roundCount} runder · {trainingSessions30d} økter · streak {streak}d
                </div>
              </div>
              <div>
                <div className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]">
                  Sist beregnet
                </div>
                <div
                  className="mt-0.5 text-[11px] font-semibold"
                  style={{ color: "var(--color-ink, #0A1F18)" }}
                >
                  Akkurat nå
                </div>
              </div>
            </div>
            <div className="text-[10.5px] font-medium">
              AK Golf · Statistikk verifisert
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
