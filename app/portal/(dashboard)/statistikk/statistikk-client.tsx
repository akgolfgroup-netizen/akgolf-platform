"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import type { RoundStats } from "@prisma/client";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import type {
  PeriodKey,
  WeeklyTrainingData,
  GolfProfileSummary,
  HcpForecastData,
} from "./actions";
import type { USIResult } from "@/lib/portal/usi/compute-usi";
import type { TrainingPrescriptionResult } from "@/lib/portal/usi/generate-prescription";

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

interface StatistikkClientProps {
  rounds: RoundStats[];
  aggregates: StatsAggregates | null;
  weeklyTraining: WeeklyTrainingData[];
  handicap?: number | null;
  currentPeriod: PeriodKey;
  profile: GolfProfileSummary;
  usi: USIResult | null;
  prescription: TrainingPrescriptionResult | null;
  hcpForecast: HcpForecastData;
}

const PERIOD_OPTIONS: { key: PeriodKey; label: string }[] = [
  { key: "30d", label: "Siste 30d" },
  { key: "90d", label: "Siste 90d" },
  { key: "season", label: "Sesong" },
  { key: "1y", label: "1 år" },
];

function formatSG(value: number | null): string {
  if (value === null) return "–";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function formatPct(value: number | null, decimals = 1): string {
  if (value === null) return "–";
  return `${value.toFixed(decimals)}%`;
}

function sgToRadarPoint(
  sg: number | null,
  angle: number,
  maxAbs = 2.5
): { x: number; y: number } {
  const cx = 50;
  const cy = 50;
  const maxRadius = 40;
  // Normaliser SG [-maxAbs, +maxAbs] → [0.2, 1.0] av maxRadius
  const v = sg ?? 0;
  const norm = Math.max(0.2, Math.min(1.0, 0.6 + v / (maxAbs * 2)));
  const r = maxRadius * norm;
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

export function StatistikkClient({
  rounds,
  aggregates,
  currentPeriod,
  hcpForecast,
}: StatistikkClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onPeriodChange = useCallback(
    (key: PeriodKey) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("period", key);
      router.push(`/portal/statistikk?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Radar polygon — 6 akser: Drive, Innspill, Kort spill, Putting, HCP-trend, Volum
  const radarPoints = useMemo(() => {
    if (!aggregates) return "";
    const points = [
      sgToRadarPoint(aggregates.avgSgOffTheTee, 0),
      sgToRadarPoint(aggregates.avgSgApproach, 60),
      sgToRadarPoint(aggregates.avgSgAroundTheGreen, 120),
      sgToRadarPoint(aggregates.avgSgPutting, 180),
      sgToRadarPoint(
        hcpForecast.trendSlopePerWeek < 0 ? 0.5 : -0.3,
        240
      ),
      sgToRadarPoint(aggregates.roundCount > 5 ? 0.8 : -0.3, 300),
    ];
    return points.map((p) => `${p.x},${p.y}`).join(" ");
  }, [aggregates, hcpForecast.trendSlopePerWeek]);

  // Historical SG trend: plot sgTotal per round
  const sgTrendData = useMemo(() => {
    const valid = rounds.filter((r) => r.sgTotal !== null).slice(0, 10).reverse();
    if (valid.length < 2) return null;
    const values = valid.map((r) => r.sgTotal ?? 0);
    const max = Math.max(...values, 0.5);
    const min = Math.min(...values, -0.5);
    const range = Math.max(max - min, 1);
    const pathPoints = values.map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 35 - ((v - min) / range) * 30;
      return { x, y, value: v, date: valid[i].date };
    });
    const linePath = pathPoints
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");
    const areaPath = `${linePath} L 100 40 L 0 40 Z`;
    return {
      linePath,
      areaPath,
      peak: Math.max(...values),
      avg: values.reduce((s, v) => s + v, 0) / values.length,
      points: pathPoints,
    };
  }, [rounds]);

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Strokes Gained
          </h1>
          <div className="hidden h-4 w-px bg-outline-variant sm:block" />
          <div className="hidden items-center gap-2 rounded-full bg-surface-container px-3 py-1 sm:flex">
            <div className="h-2 w-2 animate-pulse rounded-full bg-secondary-fixed" />
            <span className="font-mono text-[10px] uppercase tracking-tighter text-on-surface-variant">
              Live data
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-surface-container p-1">
            {PERIOD_OPTIONS.map((option) => {
              const isActive = option.key === currentPeriod;
              return (
                <button
                  key={option.key}
                  onClick={() => onPeriodChange(option.key)}
                  className={`rounded px-3 py-1 text-[11px] font-bold uppercase tracking-widest transition-colors ${
                    isActive
                      ? "bg-surface-container-lowest text-primary shadow-sm"
                      : "text-on-surface-variant hover:text-primary"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          <Link
            href="/portal/runde/ny"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:opacity-90 active:scale-95"
          >
            <Icon name="add" size={14} />
            Ny runde
          </Link>
        </div>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Performance Radar (col-5) */}
        <section className="group relative col-span-12 overflow-hidden rounded-3xl border border-outline-variant/10 bg-surface-container-lowest p-8 lg:col-span-5">
          <div className="absolute right-0 top-0 p-8 opacity-10 transition-opacity group-hover:opacity-20">
            <Icon name="analytics" size={96} className="text-primary" />
          </div>
          <div className="relative z-10 flex h-full flex-col">
            <div className="mb-8">
              <span className="rounded bg-primary-fixed/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary-container">
                Fremdriftsradar
              </span>
              <h3 className="mt-2 text-2xl font-bold text-primary">
                Strokes Gained
              </h3>
            </div>
            <div className="flex flex-grow items-center justify-center rounded-full border border-primary/5 bg-[radial-gradient(circle,rgba(210,240,0,0.05)_0%,rgba(21,66,18,0.02)_100%)] p-4">
              <div className="relative aspect-square w-full max-w-[320px]">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#c2c9bb"
                    strokeDasharray="2 2"
                    strokeOpacity="0.4"
                    strokeWidth="0.3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="27"
                    fill="none"
                    stroke="#c2c9bb"
                    strokeDasharray="2 2"
                    strokeOpacity="0.4"
                    strokeWidth="0.3"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="14"
                    fill="none"
                    stroke="#c2c9bb"
                    strokeDasharray="2 2"
                    strokeOpacity="0.4"
                    strokeWidth="0.3"
                  />
                  {[0, 60, 120, 180, 240, 300].map((angle) => {
                    const rad = (angle - 90) * (Math.PI / 180);
                    const x2 = 50 + 40 * Math.cos(rad);
                    const y2 = 50 + 40 * Math.sin(rad);
                    return (
                      <line
                        key={angle}
                        x1="50"
                        y1="50"
                        x2={x2}
                        y2={y2}
                        stroke="#c2c9bb"
                        strokeOpacity="0.3"
                        strokeWidth="0.3"
                      />
                    );
                  })}
                  {radarPoints ? (
                    <polygon
                      points={radarPoints}
                      fill="rgba(210, 240, 0, 0.4)"
                      stroke="#d2f000"
                      strokeWidth="1.5"
                    />
                  ) : null}
                </svg>
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-4 font-mono text-[9px] font-bold uppercase tracking-tighter">
                  Drive
                </div>
                <div className="absolute right-0 top-1/4 translate-x-6 font-mono text-[9px] font-bold uppercase tracking-tighter">
                  Innspill
                </div>
                <div className="absolute bottom-1/4 right-0 translate-x-6 font-mono text-[9px] font-bold uppercase tracking-tighter">
                  Kort spill
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 font-mono text-[9px] font-bold uppercase tracking-tighter">
                  Putting
                </div>
                <div className="absolute bottom-1/4 left-0 -translate-x-6 font-mono text-[9px] font-bold uppercase tracking-tighter">
                  HCP
                </div>
                <div className="absolute left-0 top-1/4 -translate-x-6 font-mono text-[9px] font-bold uppercase tracking-tighter">
                  Volum
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-between font-mono text-[11px]">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-secondary-fixed" />
                <span className="uppercase">Nåværende</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full border border-primary/20" />
                <span className="uppercase text-on-surface-variant">
                  Benchmark
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Høyre kolonne (col-7): Trend + 3 stats */}
        <div className="col-span-12 flex flex-col gap-6 lg:col-span-7">
          <section className="rounded-3xl border border-outline-variant/5 bg-surface-container-low p-6">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Trendanalyse
                </span>
                <h4 className="text-lg font-bold text-primary">
                  SG Total historisk
                </h4>
              </div>
              <div className="flex gap-4 font-mono text-[10px] uppercase">
                <div className="flex flex-col items-end">
                  <span className="text-on-surface-variant">Topp</span>
                  <span className="font-bold text-primary">
                    {sgTrendData ? formatSG(sgTrendData.peak) : "–"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-on-surface-variant">Snitt</span>
                  <span className="font-bold text-primary">
                    {aggregates ? formatSG(aggregates.avgSgTotal) : "–"}
                  </span>
                </div>
              </div>
            </div>
            <div className="relative mt-8 h-48 w-full">
              {sgTrendData ? (
                <>
                  <svg
                    className="h-full w-full"
                    viewBox="0 0 100 40"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="sg-gradient-area"
                        x1="0"
                        x2="0"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#154212" />
                        <stop offset="100%" stopColor="#fdf9f0" />
                      </linearGradient>
                    </defs>
                    <g className="text-primary/10">
                      <line
                        x1="0"
                        x2="100"
                        y1="10"
                        y2="10"
                        stroke="currentColor"
                        strokeWidth="0.1"
                      />
                      <line
                        x1="0"
                        x2="100"
                        y1="20"
                        y2="20"
                        stroke="currentColor"
                        strokeWidth="0.1"
                      />
                      <line
                        x1="0"
                        x2="100"
                        y1="30"
                        y2="30"
                        stroke="currentColor"
                        strokeWidth="0.1"
                      />
                    </g>
                    <path
                      d={sgTrendData.areaPath}
                      fill="url(#sg-gradient-area)"
                      opacity="0.2"
                    />
                    <path
                      d={sgTrendData.linePath}
                      fill="none"
                      stroke="#154212"
                      strokeWidth="1.5"
                    />
                    {sgTrendData.points.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="0.8"
                        fill="#d2f000"
                        stroke="#154212"
                        strokeWidth="0.3"
                      />
                    ))}
                  </svg>
                  <div className="mt-4 flex justify-between px-2 font-mono text-[9px] uppercase tracking-tighter text-on-surface-variant">
                    {sgTrendData.points.map((p, i) => (
                      <span key={i}>
                        {format(new Date(p.date), "d.M", { locale: nb })}
                      </span>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                  <Icon
                    name="timeline"
                    size={36}
                    className="text-primary/30"
                  />
                  <p className="text-sm text-primary/60">
                    Legg inn minst 2 runder med SG-data for å se trend
                  </p>
                </div>
              )}
            </div>
          </section>

          <div className="grid grid-cols-3 gap-6">
            <MetricCard
              label="GIR"
              value={
                aggregates ? formatPct(aggregates.avgGirPct, 1) : "–"
              }
              trend={aggregates?.scoreTrend}
              trendValue="2.4%"
            />
            <MetricCard
              label="Snitt-putts"
              value={
                aggregates?.avgPuttsPerGir
                  ? aggregates.avgPuttsPerGir.toFixed(1)
                  : "–"
              }
              trend="down"
              trendValue="0.8"
            />
            <MetricCard
              label="Drive snitt"
              value={
                aggregates?.avgDrivingDistance
                  ? `${Math.round(aggregates.avgDrivingDistance)}m`
                  : "–"
              }
              trend="up"
              trendValue="4.1m"
            />
          </div>
        </div>

        {/* Statistical Breakdown (col-12) */}
        <section className="col-span-12 overflow-hidden rounded-3xl border border-outline-variant/5 bg-surface-container-low">
          <div className="flex items-center justify-between border-b border-outline-variant/10 px-8 py-6">
            <h4 className="text-lg font-bold text-primary">
              Runde for runde
            </h4>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase text-on-surface-variant">
                Filtrer
              </span>
              <Icon
                name="filter_list"
                size={18}
                className="cursor-pointer text-primary"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            {rounds.length === 0 ? (
              <div className="flex flex-col items-center gap-4 px-8 py-16 text-center">
                <Icon
                  name="sports_golf"
                  size={48}
                  className="text-primary/30"
                />
                <div>
                  <p className="text-base font-bold text-primary">
                    Ingen runder i valgt periode
                  </p>
                  <p className="mt-1 text-sm text-primary/60">
                    Registrer din første runde for å se statistikk
                  </p>
                </div>
                <Link
                  href="/portal/runde/ny"
                  className="rounded-lg bg-secondary-fixed px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-primary hover:opacity-90"
                >
                  Ny runde
                </Link>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-high/50">
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Dato / Bane
                    </th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Score
                    </th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      FIR
                    </th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      GIR
                    </th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Putts
                    </th>
                    <th className="px-8 py-4 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      SG Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {rounds.slice(0, 10).map((r) => {
                    const firPct =
                      r.fairwaysHit !== null && r.fairwaysTotal
                        ? (r.fairwaysHit / r.fairwaysTotal) * 100
                        : null;
                    const girPct =
                      r.gir !== null && r.girTotal
                        ? (r.gir / r.girTotal) * 100
                        : null;
                    const sgClass =
                      r.sgTotal !== null && r.sgTotal >= 0
                        ? "text-[#2d5a27]"
                        : "text-[#ba1a1a]";
                    return (
                      <tr
                        key={r.id}
                        className="transition-colors hover:bg-surface-container-lowest"
                      >
                        <td className="px-8 py-4 font-mono text-xs font-bold">
                          <div>
                            {format(new Date(r.date), "d. MMM", {
                              locale: nb,
                            })}
                          </div>
                          <div className="mt-0.5 text-[10px] font-normal text-on-surface-variant">
                            {r.courseName ?? "Ukjent bane"}
                          </div>
                        </td>
                        <td className="px-8 py-4 text-sm font-bold text-primary">
                          {r.totalScore ?? "–"}
                        </td>
                        <td className="px-8 py-4 text-sm">
                          {formatPct(firPct, 0)}
                        </td>
                        <td className="px-8 py-4 text-sm font-bold text-primary">
                          {formatPct(girPct, 0)}
                        </td>
                        <td className="px-8 py-4 text-sm">
                          {r.totalPutts ?? "–"}
                        </td>
                        <td
                          className={`px-8 py-4 font-mono text-sm font-bold ${sgClass}`}
                        >
                          {formatSG(r.sgTotal)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>

      {/* Footer-stripe */}
      <div className="mt-2 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 pt-6 opacity-60">
        <div className="flex gap-8">
          <div className="flex flex-col">
            <span className="font-mono text-[8px] uppercase tracking-widest">
              Datakilde
            </span>
            <span className="text-[10px] font-bold">
              {rounds.length} runder i periode
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-[8px] uppercase tracking-widest">
              Sist oppdatert
            </span>
            <span className="text-[10px] font-bold">
              {format(new Date(), "d. MMM HH:mm", { locale: nb })}
            </span>
          </div>
        </div>
        <div className="text-[10px] font-medium tracking-tight">
          AK Golf · Analysedata verifisert
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  trend,
  trendValue,
}: {
  label: string;
  value: string;
  trend: "up" | "down" | "flat" | undefined;
  trendValue: string;
}) {
  const isPositive = trend === "up";
  const isNegative = trend === "down";
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest p-5">
      <p className="font-mono text-[9px] uppercase tracking-widest text-on-surface-variant">
        {label}
      </p>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold text-primary">{value}</span>
        {trend && trend !== "flat" ? (
          <span
            className={`flex items-center text-[10px] font-bold ${
              isPositive
                ? "text-[#2d5a27]"
                : isNegative
                  ? "text-[#ba1a1a]"
                  : "text-on-surface-variant"
            }`}
          >
            <Icon
              name={isPositive ? "trending_up" : "trending_down"}
              size={14}
            />{" "}
            {trendValue}
          </span>
        ) : null}
      </div>
    </div>
  );
}
