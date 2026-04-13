"use client";

import { useState, useTransition, useCallback } from "react";
import {
  BarChart3,
  Search,
  Target,
  TrendingUp,
  Layers,
  Crosshair,
  Loader2,
  ArrowRight,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from "recharts";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import {
  calculateTourPercentile,
  getPercentileLabel,
  CATEGORY_LABELS,
} from "@/lib/portal/datagolf/tour-benchmarks";
import { SG_BENCHMARKS } from "@/lib/portal/golf/sg-benchmarks";
import type {
  PlayerSGProfile,
  ProPlayerSearchResult,
  ProComparison,
} from "./actions";
import { getProPlayers, getProComparison } from "./actions";

// ── Design tokens as hex (for Recharts which doesn't støtter CSS vars) ──
// Verdier speiler brand guide V2.0-tokens i globals.css.
// Bruk CSS-variabler i JSX der det er mulig — dette objektet brukes kun
// på props som Recharts trenger som literale strenger.

const COLORS = {
  black: "#0A1F18", // --color-grey-900
  grey100: "#ECF0EF", // --color-grey-100
  grey200: "#D5DFDB", // --color-grey-200
  grey400: "#7A8C85", // --color-grey-400
  grey500: "#5A6E66", // --color-grey-500
  grey600: "#324D45", // --color-grey-600
  grey900: "#0A1F18", // --color-grey-900
  brand: "#1A4D36", // --color-success
  blue: "#C48A32", // --color-warning (kontrastfarge for pro-sammenligning vs spiller-brand)
  success: "#1A4D36", // --color-success
  error: "#EF4444", // --color-error
  warning: "#C48A32", // --color-warning
  ai: "#AF52DE", // --color-ai
};

// ── SG category config ──

const SG_CATEGORIES = [
  { key: "sgTotal" as const, field: "sgTotal" as const, label: "Total SG" },
  { key: "sgOtt" as const, field: "sgOffTheTee" as const, label: "Utslag" },
  { key: "sgApp" as const, field: "sgApproach" as const, label: "Innspill" },
  {
    key: "sgArg" as const,
    field: "sgAroundTheGreen" as const,
    label: "Nærspill",
  },
  { key: "sgPutt" as const, field: "sgPutting" as const, label: "Putting" },
];

// ── Helper: get A-K category for a given SG total ──

function getAKCategory(sgTotal: number | null) {
  if (sgTotal === null) return null;
  // SG_BENCHMARKS are sorted K (worst) to A (best)
  // Find the closest category based on total SG
  let closest = SG_BENCHMARKS[0];
  let minDiff = Math.abs(sgTotal - closest.sg.total);
  for (const b of SG_BENCHMARKS) {
    const diff = Math.abs(sgTotal - b.sg.total);
    if (diff < minDiff) {
      minDiff = diff;
      closest = b;
    }
  }
  return closest;
}

function getPercentileBarColor(pct: number): string {
  if (pct >= 75) return COLORS.brand;
  if (pct >= 50) return COLORS.blue;
  if (pct >= 25) return COLORS.warning;
  return COLORS.error;
}

// ── Improvement potential calculation ──
// Approximately 1 SG total improvement = ~3 handicap strokes decrease
// This is a rough heuristic used for visualization

function estimateHandicapImpact(sgImprovement: number): number {
  return Math.round(sgImprovement * 5 * 10) / 10;
}

// ── Component ──

interface BenchmarkClientProps {
  profile: PlayerSGProfile | null;
}

export function BenchmarkClient({ profile }: BenchmarkClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProPlayerSearchResult[]>(
    []
  );
  const [selectedPro, setSelectedPro] = useState<ProComparison | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.length < 2) {
        setSearchResults([]);
        return;
      }
      setIsSearching(true);
      startTransition(async () => {
        const results = await getProPlayers(query);
        setSearchResults(results);
        setIsSearching(false);
      });
    },
    [startTransition]
  );

  const handleSelectPro = useCallback(
    (dgId: number) => {
      startTransition(async () => {
        const comparison = await getProComparison(dgId);
        setSelectedPro(comparison);
        setSearchResults([]);
        setSearchQuery("");
      });
    },
    [startTransition]
  );

  // ── No data state ──

  if (!profile) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-[#0A1F18]">Benchmarking</h1>
          <p className="text-[#324D45] mt-1">
            Sammenlign deg med PGA Tour og proffspillere
          </p>
        </header>

        <PremiumCard>
          <div className="p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#F5F8F7] flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-[#7A8C85]" />
            </div>
            <h2 className="text-lg font-semibold text-[#0A1F18] mb-2">
              Ingen statistikk ennå
            </h2>
            <p className="text-sm text-[#324D45] max-w-md mx-auto">
              Registrer Strokes Gained-data fra rundene dine under Statistikk for
              å se hvordan du måler deg mot PGA Tour-spillere.
            </p>
          </div>
        </PremiumCard>
      </div>
    );
  }

  // ── Percentile data for bar chart ──

  const percentileData = SG_CATEGORIES.map((cat) => {
    const value = profile[cat.field];
    const percentile =
      value !== null ? calculateTourPercentile(value, cat.key) : 0;
    return {
      category: cat.label,
      value: value !== null ? Number(value.toFixed(2)) : 0,
      percentile: Math.round(percentile),
      color: getPercentileBarColor(percentile),
    };
  });

  // ── A-K category ──

  const akCategory = getAKCategory(profile.sgTotal);

  // ── Per-category A-K breakdown ──

  type SGField = "offTheTee" | "approach" | "aroundTheGreen" | "putting";
  const categoryAK = (
    [
      {
        label: "Utslag",
        userVal: profile.sgOffTheTee,
        field: "offTheTee" as SGField,
      },
      {
        label: "Innspill",
        userVal: profile.sgApproach,
        field: "approach" as SGField,
      },
      {
        label: "Nærspill",
        userVal: profile.sgAroundTheGreen,
        field: "aroundTheGreen" as SGField,
      },
      {
        label: "Putting",
        userVal: profile.sgPutting,
        field: "putting" as SGField,
      },
    ] as const
  ).map((c) => {
    if (c.userVal === null) return { ...c, category: null };
    let closest = SG_BENCHMARKS[0];
    let minDiff = Math.abs(c.userVal - closest.sg[c.field]);
    for (const b of SG_BENCHMARKS) {
      const diff = Math.abs(c.userVal - b.sg[c.field]);
      if (diff < minDiff) {
        minDiff = diff;
        closest = b;
      }
    }
    return { ...c, category: closest };
  });

  // ── Improvement potential ──

  const improvementAreas = [
    {
      label: "Innspill",
      current: profile.sgApproach,
      improvement: 0.3,
    },
    {
      label: "Utslag",
      current: profile.sgOffTheTee,
      improvement: 0.2,
    },
    {
      label: "Putting",
      current: profile.sgPutting,
      improvement: 0.2,
    },
    {
      label: "Nærspill",
      current: profile.sgAroundTheGreen,
      improvement: 0.15,
    },
  ];

  // ── Approach distance data ──

  const approachDistanceData = [
    { bucket: "< 100m", value: profile.approachDistances.approach100 },
    { bucket: "100-150m", value: profile.approachDistances.approach150 },
    { bucket: "150-200m", value: profile.approachDistances.approach200 },
    { bucket: "200m+", value: profile.approachDistances.approach200Plus },
  ].filter((d) => d.value !== null);

  // ── Pro comparison radar data ──

  const radarData = selectedPro
    ? [
        {
          category: "Utslag",
          player: profile.sgOffTheTee ?? 0,
          pro: selectedPro.pro.sgOtt ?? 0,
        },
        {
          category: "Innspill",
          player: profile.sgApproach ?? 0,
          pro: selectedPro.pro.sgApp ?? 0,
        },
        {
          category: "Nærspill",
          player: profile.sgAroundTheGreen ?? 0,
          pro: selectedPro.pro.sgArg ?? 0,
        },
        {
          category: "Putting",
          player: profile.sgPutting ?? 0,
          pro: selectedPro.pro.sgPutt ?? 0,
        },
      ]
    : [];

  const radarMin = selectedPro
    ? Math.min(...radarData.flatMap((d) => [d.player, d.pro]), -3)
    : -3;
  const radarMax = selectedPro
    ? Math.max(...radarData.flatMap((d) => [d.player, d.pro]), 1)
    : 1;

  // ── Pro approach distance comparison ──

  const proApproachData =
    selectedPro?.proApproach && approachDistanceData.length > 0
      ? [
          {
            bucket: "75-100y",
            player: profile.approachDistances.approach100,
            pro: selectedPro.proApproach["75-100"],
          },
          {
            bucket: "100-125y",
            player: profile.approachDistances.approach150,
            pro: selectedPro.proApproach["100-125"],
          },
          {
            bucket: "150-175y",
            player: profile.approachDistances.approach200,
            pro: selectedPro.proApproach["150-175"],
          },
          {
            bucket: "200-225y",
            player: profile.approachDistances.approach200Plus,
            pro: selectedPro.proApproach["200-225"],
          },
        ].filter((d) => d.player !== null || d.pro !== null)
      : null;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <header>
        <h1 className="text-2xl font-bold text-[#0A1F18]">Benchmarking</h1>
        <p className="text-[#324D45] mt-1">
          Sammenlign deg med PGA Tour og proffspillere
          {profile.roundCount > 0 && (
            <span className="ml-2 text-[#7A8C85]">
              Basert på {profile.roundCount} runder
            </span>
          )}
        </p>
      </header>

      {/* ── Row 1: Tour Percentile + A-K Category ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tour Percentile Bar Chart */}
        <PremiumCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#0A1F18]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0A1F18]">
                PGA Tour-persentil
              </h3>
              <p className="text-xs text-[#324D45]">Hvor du ligger sammenlignet med touren</p>
            </div>
          </div>
          <div className="h-[300px] mt-4">
            <ResponsiveContainer>
              <BarChart
                data={percentileData}
                layout="vertical"
                margin={{ left: 10, right: 30, top: 0, bottom: 0 }}
              >
                <CartesianGrid
                  horizontal={false}
                  stroke={COLORS.grey200}
                  strokeDasharray="3 3"
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tick={{ fill: COLORS.grey500, fontSize: 11 }}
                  tickFormatter={(v) => `${v}%`}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  width={80}
                  tick={{ fill: COLORS.grey600, fontSize: 12, fontWeight: 500 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  contentStyle={{
                    background: "white",
                    border: `1px solid ${COLORS.grey200}`,
                    borderRadius: 12,
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={(value, _name, entry) => {
                    const payload = entry?.payload as (typeof percentileData)[0] | undefined;
                    return [
                      `${value}% (SG: ${payload?.value ?? "-"})`,
                      "Persentil",
                    ];
                  }}
                />
                <ReferenceLine
                  x={50}
                  stroke={COLORS.grey400}
                  strokeDasharray="4 4"
                  label={{
                    value: "Median",
                    position: "top",
                    fill: COLORS.grey400,
                    fontSize: 10,
                  }}
                />
                <Bar dataKey="percentile" radius={[0, 6, 6, 0]} barSize={24}>
                  {percentileData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Percentile labels */}
          <div className="flex flex-wrap gap-2 mt-4">
            {percentileData.map((d) => (
              <div
                key={d.category}
                className="flex items-center gap-1.5 text-xs text-[#324D45]"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                {d.category}: {getPercentileLabel(d.percentile)}
              </div>
            ))}
          </div>
        </PremiumCard>

        {/* A-K Category Card */}
        <PremiumCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center">
              <Layers className="w-5 h-5 text-[#0A1F18]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0A1F18]">
                A-K Ferdighetsnivå
              </h3>
              <p className="text-xs text-[#324D45]">Din kategori per SG-område</p>
            </div>
          </div>
          {/* Overall level */}
          {akCategory && (
            <div className="flex items-center gap-4 mt-4 p-4 rounded-xl bg-[#F5F8F7]">
              <div className="w-14 h-14 rounded-xl bg-[#0A1F18] flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
                  {akCategory.category}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#0A1F18]">
                  {akCategory.label}
                </p>
                <p className="text-xs text-[#324D45]">
                  HCP {akCategory.handicapRange[0]}-
                  {akCategory.handicapRange[1]} | Snitt{" "}
                  {akCategory.averageScore} slag
                </p>
              </div>
            </div>
          )}

          {/* Per-category breakdown */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {categoryAK.map((c) => (
              <div
                key={c.label}
                className="p-3 rounded-xl border border-[#D5DFDB] bg-white"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85] mb-1">
                  {c.label}
                </p>
                <div className="flex items-baseline gap-2">
                  {c.category ? (
                    <>
                      <span className="text-xl font-bold text-[#0A1F18] tabular-nums tracking-tight">
                        {c.category.category}
                      </span>
                      <span className="text-xs text-[#324D45]">
                        {c.category.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-[#7A8C85]">Ingen data</span>
                  )}
                </div>
                {c.userVal !== null && (
                  <p className="text-xs text-[#324D45] mt-1">
                    SG: {c.userVal.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </PremiumCard>
      </div>

      {/* ── Row 2: Pro Comparison ── */}
      <PremiumCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center">
            <Search className="w-5 h-5 text-[#0A1F18]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#0A1F18]">
              Sammenlign med proff
            </h3>
            <p className="text-xs text-[#324D45]">Søk etter en PGA Tour-spiller og se side-ved-side SG-sammenligning</p>
          </div>
        </div>
        {/* Search bar */}
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C85]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Søk etter spiller (f.eks. Viktor Hovland)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5DFDB] bg-[#F5F8F7] text-sm text-[#0A1F18] placeholder:text-[#7A8C85] focus:outline-none focus:border-[#0A1F18] transition-colors"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A8C85] animate-spin" />
          )}
        </div>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-w-md rounded-xl border border-[#D5DFDB] bg-white shadow-lg overflow-hidden">
            {searchResults.map((player) => (
              <button
                key={player.dgId}
                onClick={() => handleSelectPro(player.dgId)}
                disabled={isPending}
                className="w-full text-left px-4 py-3 hover:bg-[#F5F8F7] transition-colors border-b border-[#D5DFDB] last:border-b-0 disabled:opacity-50"
              >
                <span className="text-sm font-medium text-[#0A1F18]">
                  {player.name}
                </span>
                {player.sgTotal !== null && (
                  <span className="ml-2 text-xs text-[#324D45]">
                    SG Total: {player.sgTotal.toFixed(2)}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Comparison content */}
        {selectedPro && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Radar chart */}
            <div>
              <h3 className="text-sm font-semibold text-[#0A1F18] mb-3">
                SG-profil: Du vs {selectedPro.pro.name}
              </h3>
              <div className="h-[300px]">
                <ResponsiveContainer>
                  <RadarChart
                    data={radarData}
                    cx="50%"
                    cy="50%"
                    outerRadius="75%"
                  >
                    <PolarGrid
                      stroke={COLORS.grey200}
                      strokeDasharray="3 3"
                    />
                    <PolarAngleAxis
                      dataKey="category"
                      tick={{
                        fill: COLORS.grey600,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    />
                    <PolarRadiusAxis
                      domain={[radarMin, radarMax]}
                      tick={{ fill: COLORS.grey400, fontSize: 10 }}
                      tickCount={5}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: `1px solid ${COLORS.grey200}`,
                        borderRadius: 12,
                        fontSize: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      formatter={(value) => [
                        `${Number(value).toFixed(2)} SG`,
                        "",
                      ]}
                    />
                    <Radar
                      name={selectedPro.pro.name}
                      dataKey="pro"
                      stroke={COLORS.blue}
                      fill={COLORS.blue}
                      fillOpacity={0.15}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                    <Radar
                      name="Din SG"
                      dataKey="player"
                      stroke={COLORS.grey900}
                      fill={COLORS.grey900}
                      fillOpacity={0.25}
                      strokeWidth={2}
                      dot={{
                        fill: COLORS.grey900,
                        r: 4,
                        strokeWidth: 2,
                        stroke: "white",
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
                      iconType="circle"
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Side-by-side values */}
            <div>
              <h3 className="text-sm font-semibold text-[#0A1F18] mb-3">
                Detaljert sammenligning
              </h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Total SG",
                    yours: profile.sgTotal,
                    theirs: selectedPro.pro.sgTotal,
                  },
                  {
                    label: "Utslag",
                    yours: profile.sgOffTheTee,
                    theirs: selectedPro.pro.sgOtt,
                  },
                  {
                    label: "Innspill",
                    yours: profile.sgApproach,
                    theirs: selectedPro.pro.sgApp,
                  },
                  {
                    label: "Nærspill",
                    yours: profile.sgAroundTheGreen,
                    theirs: selectedPro.pro.sgArg,
                  },
                  {
                    label: "Putting",
                    yours: profile.sgPutting,
                    theirs: selectedPro.pro.sgPutt,
                  },
                ].map((row) => {
                  const diff =
                    row.yours !== null && row.theirs !== null
                      ? row.yours - row.theirs
                      : null;
                  return (
                    <div
                      key={row.label}
                      className="flex items-center justify-between p-3 rounded-xl border border-[#D5DFDB] bg-white"
                    >
                      <span className="text-sm font-medium text-[#324D45] w-20">
                        {row.label}
                      </span>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="tabular-nums tracking-tight font-semibold text-[#0A1F18] w-16 text-right">
                          {row.yours !== null ? row.yours.toFixed(2) : "-"}
                        </span>
                        <span className="text-[#7A8C85]">vs</span>
                        <span className="tabular-nums tracking-tight font-semibold text-[#0A1F18] w-16">
                          {row.theirs !== null ? row.theirs.toFixed(2) : "-"}
                        </span>
                        {diff !== null && (
                          <span
                            className={`text-xs font-medium w-16 text-right ${
                              diff >= 0
                                ? "text-[#1A4D36]"
                                : "text-[#EF4444]"
                            }`}
                          >
                            {diff >= 0 ? "+" : ""}
                            {diff.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* No pro selected placeholder */}
        {!selectedPro && !isPending && (
          <div className="mt-6 py-8 text-center">
            <Crosshair className="w-8 h-8 text-[#7A8C85] mx-auto mb-3" />
            <p className="text-sm text-[#7A8C85]">
              Søk etter en spiller for å se sammenligning
            </p>
          </div>
        )}

        {isPending && !isSearching && (
          <div className="mt-6 py-8 text-center">
            <Loader2 className="w-6 h-6 text-[#7A8C85] mx-auto mb-3 animate-spin" />
            <p className="text-sm text-[#7A8C85]">Henter spillerdata...</p>
          </div>
        )}
      </PremiumCard>

      {/* ── Row 3: Improvement Potential + Approach Distance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Improvement Potential */}
        <PremiumCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#0A1F18]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0A1F18]">
                Forbedringspotensial
              </h3>
              <p className="text-xs text-[#324D45]">Estimert handicap-effekt av SG-forbedringer</p>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {improvementAreas.map((area) => {
              if (area.current === null) return null;
              const hcpImpact = estimateHandicapImpact(area.improvement);
              const newSg = area.current + area.improvement;

              return (
                <div
                  key={area.label}
                  className="p-4 rounded-xl border border-[#D5DFDB] bg-[#F5F8F7]/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#0A1F18]">
                      {area.label}
                    </span>
                    <span className="text-xs font-semibold text-[#1A4D36] bg-[#1A4D36]/10 px-2 py-0.5 rounded-full">
                      -{hcpImpact} HCP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#324D45]">
                    <span className="tabular-nums tracking-tight">
                      {area.current.toFixed(2)} SG
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#7A8C85]" />
                    <span className="tabular-nums tracking-tight font-semibold">
                      {newSg.toFixed(2)} SG
                    </span>
                    <span className="text-xs text-[#7A8C85] ml-1">
                      (+{area.improvement.toFixed(2)})
                    </span>
                  </div>
                  {/* Progress bar showing how close to 0 */}
                  <div className="mt-2 h-1.5 rounded-full bg-[#F5F8F7] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, ((newSg + 6) / 6) * 100))}%`,
                        backgroundColor: COLORS.brand,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-[#7A8C85] mt-4">
            Estimater er basert på historiske sammenhenger mellom SG og handicap.
            Faktisk effekt varierer.
          </p>
        </PremiumCard>

        {/* Approach Distance Breakdown */}
        <PremiumCard>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F8F7] flex items-center justify-center">
              <Target className="w-5 h-5 text-[#0A1F18]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#0A1F18]">
                Innspill per avstand
              </h3>
              <p className="text-xs text-[#324D45]">
                {approachDistanceData.length > 0
                  ? "Dine SG-verdier per avstandskategori"
                  : "Registrer approach-data for å se fordeling"}
              </p>
            </div>
          </div>
          {approachDistanceData.length > 0 ? (
            <>
              <div className="h-[260px] mt-4">
                <ResponsiveContainer>
                  <BarChart
                    data={approachDistanceData}
                    margin={{ left: 0, right: 10, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      stroke={COLORS.grey200}
                      strokeDasharray="3 3"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="bucket"
                      tick={{
                        fill: COLORS.grey600,
                        fontSize: 11,
                        fontWeight: 500,
                      }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: COLORS.grey400, fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: `1px solid ${COLORS.grey200}`,
                        borderRadius: 12,
                        fontSize: 12,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                      formatter={(v) => [`${Number(v).toFixed(2)} SG`, ""]}
                    />
                    <ReferenceLine
                      y={0}
                      stroke={COLORS.grey400}
                      strokeDasharray="4 4"
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                      {approachDistanceData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={
                            (entry.value ?? 0) >= 0
                              ? COLORS.brand
                              : COLORS.error
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Pro approach overlay if available */}
              {proApproachData && (
                <div className="mt-4">
                  <p className="text-xs font-medium text-[#324D45] mb-2">
                    Sammenligning med {selectedPro?.pro.name} (yards)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {proApproachData.map((d) => (
                      <div
                        key={d.bucket}
                        className="text-center p-2 rounded-lg bg-[#F5F8F7]"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7A8C85] mb-1">
                          {d.bucket}
                        </p>
                        <p className="text-xs text-[#0A1F18]">
                          Du:{" "}
                          <span className="tabular-nums tracking-tight font-semibold">
                            {d.player !== null ? d.player.toFixed(1) : "-"}
                          </span>
                        </p>
                        <p className="text-xs text-[#324D45]">
                          Pro:{" "}
                          <span className="tabular-nums tracking-tight">
                            {d.pro !== null ? d.pro.toFixed(1) : "-"}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-10 text-center">
              <Target className="w-8 h-8 text-[#7A8C85] mx-auto mb-3" />
              <p className="text-sm text-[#7A8C85]">
                Legg til approach-statistikk per avstand i rundene dine for å se
                denne analysen.
              </p>
            </div>
          )}
        </PremiumCard>
      </div>
    </div>
  );
}
