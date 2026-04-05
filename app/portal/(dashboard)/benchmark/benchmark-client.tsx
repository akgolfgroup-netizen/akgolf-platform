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
import { BentoCard } from "@/components/portal/apple/bento-card";
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

// ── Design tokens as hex (for Recharts which doesn't support CSS vars) ──

const COLORS = {
  black: "#1D1D1F",
  grey100: "#F5F5F7",
  grey200: "#E8E8ED",
  grey400: "#86868B",
  grey500: "#6E6E73",
  grey600: "#48484A",
  grey900: "#1D1D1F",
  brand: "#2D6A4F",
  blue: "#3B82F6",
  success: "#34C759",
  error: "#FF3B30",
  warning: "#FF9500",
  ai: "#AF52DE",
};

// ── SG category config ──

const SG_CATEGORIES = [
  { key: "sgTotal" as const, field: "sgTotal" as const, label: "Total SG" },
  { key: "sgOtt" as const, field: "sgOffTheTee" as const, label: "Utslag" },
  { key: "sgApp" as const, field: "sgApproach" as const, label: "Innspill" },
  {
    key: "sgArg" as const,
    field: "sgAroundTheGreen" as const,
    label: "Naerspill",
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
          <h1 className="text-3xl font-bold tracking-tight text-[var(--color-grey-900)]">
            Benchmarking
          </h1>
          <p className="text-[var(--color-grey-500)] mt-1">
            Sammenlign deg med PGA Tour og proffspillere
          </p>
        </header>

        <div className="rounded-2xl border border-[var(--color-grey-200)] bg-white p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-[var(--color-grey-100)] flex items-center justify-center mb-4">
            <BarChart3 className="w-6 h-6 text-[var(--color-grey-400)]" />
          </div>
          <h2 className="text-lg font-semibold text-[var(--color-grey-900)] mb-2">
            Ingen statistikk enna
          </h2>
          <p className="text-sm text-[var(--color-grey-500)] max-w-md mx-auto">
            Registrer Strokes Gained-data fra rundene dine under Statistikk for
            a se hvordan du maler deg mot PGA Tour-spillere.
          </p>
        </div>
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
        label: "Naerspill",
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
      label: "Naerspill",
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
          category: "Naerspill",
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
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-grey-900)]">
          Benchmarking
        </h1>
        <p className="text-[var(--color-grey-500)] mt-1">
          Sammenlign deg med PGA Tour og proffspillere
          {profile.roundCount > 0 && (
            <span className="ml-2 text-[var(--color-grey-400)]">
              Basert pa {profile.roundCount} runder
            </span>
          )}
        </p>
      </header>

      {/* ── Row 1: Tour Percentile + A-K Category ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tour Percentile Bar Chart */}
        <BentoCard
          icon={BarChart3}
          title="PGA Tour-persentil"
          subtitle="Hvor du ligger sammenlignet med touren"
        >
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
                className="flex items-center gap-1.5 text-xs text-[var(--color-grey-500)]"
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: d.color }}
                />
                {d.category}: {getPercentileLabel(d.percentile)}
              </div>
            ))}
          </div>
        </BentoCard>

        {/* A-K Category Card */}
        <BentoCard
          icon={Layers}
          title="A-K Ferdighetsniva"
          subtitle="Din kategori per SG-omrade"
        >
          {/* Overall level */}
          {akCategory && (
            <div className="flex items-center gap-4 mt-4 p-4 rounded-xl bg-[var(--color-grey-100)]">
              <div className="w-14 h-14 rounded-xl bg-[var(--color-grey-900)] flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-white">
                  {akCategory.category}
                </span>
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--color-grey-900)]">
                  {akCategory.label}
                </p>
                <p className="text-xs text-[var(--color-grey-500)]">
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
                className="p-3 rounded-xl border border-[var(--color-grey-200)] bg-white"
              >
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-400)] mb-1">
                  {c.label}
                </p>
                <div className="flex items-baseline gap-2">
                  {c.category ? (
                    <>
                      <span className="text-xl font-bold text-[var(--color-grey-900)]">
                        {c.category.category}
                      </span>
                      <span className="text-xs text-[var(--color-grey-500)]">
                        {c.category.label}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-[var(--color-grey-400)]">
                      Ingen data
                    </span>
                  )}
                </div>
                {c.userVal !== null && (
                  <p className="text-xs text-[var(--color-grey-500)] mt-1">
                    SG: {c.userVal.toFixed(2)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </BentoCard>
      </div>

      {/* ── Row 2: Pro Comparison ── */}
      <BentoCard
        icon={Search}
        title="Sammenlign med proff"
        subtitle="Sok etter en PGA Tour-spiller og se side-ved-side SG-sammenligning"
      >
        {/* Search bar */}
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-400)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Sok etter spiller (f.eks. Viktor Hovland)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--color-grey-200)] bg-[var(--color-grey-100)] text-sm text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:border-[var(--color-grey-400)] transition-colors"
          />
          {isSearching && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-grey-400)] animate-spin" />
          )}
        </div>

        {/* Search results dropdown */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-w-md rounded-xl border border-[var(--color-grey-200)] bg-white shadow-lg overflow-hidden">
            {searchResults.map((player) => (
              <button
                key={player.dgId}
                onClick={() => handleSelectPro(player.dgId)}
                disabled={isPending}
                className="w-full text-left px-4 py-3 hover:bg-[var(--color-grey-100)] transition-colors border-b border-[var(--color-grey-200)] last:border-b-0 disabled:opacity-50"
              >
                <span className="text-sm font-medium text-[var(--color-grey-900)]">
                  {player.name}
                </span>
                {player.sgTotal !== null && (
                  <span className="ml-2 text-xs text-[var(--color-grey-500)]">
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
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-3">
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
              <h3 className="text-sm font-semibold text-[var(--color-grey-900)] mb-3">
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
                    label: "Naerspill",
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
                      className="flex items-center justify-between p-3 rounded-xl border border-[var(--color-grey-200)]"
                    >
                      <span className="text-sm font-medium text-[var(--color-grey-600)] w-20">
                        {row.label}
                      </span>
                      <div className="flex items-center gap-6 text-sm">
                        <span className="font-mono font-semibold text-[var(--color-grey-900)] w-16 text-right">
                          {row.yours !== null ? row.yours.toFixed(2) : "-"}
                        </span>
                        <span className="text-[var(--color-grey-300)]">vs</span>
                        <span className="font-mono font-semibold text-[var(--color-grey-900)] w-16">
                          {row.theirs !== null ? row.theirs.toFixed(2) : "-"}
                        </span>
                        {diff !== null && (
                          <span
                            className={`text-xs font-medium w-16 text-right ${
                              diff >= 0
                                ? "text-[var(--color-success-text)]"
                                : "text-[var(--color-error)]"
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
            <Crosshair className="w-8 h-8 text-[var(--color-grey-300)] mx-auto mb-3" />
            <p className="text-sm text-[var(--color-grey-400)]">
              Sok etter en spiller for a se sammenligning
            </p>
          </div>
        )}

        {isPending && !isSearching && (
          <div className="mt-6 py-8 text-center">
            <Loader2 className="w-6 h-6 text-[var(--color-grey-400)] mx-auto mb-3 animate-spin" />
            <p className="text-sm text-[var(--color-grey-400)]">
              Henter spillerdata...
            </p>
          </div>
        )}
      </BentoCard>

      {/* ── Row 3: Improvement Potential + Approach Distance ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Improvement Potential */}
        <BentoCard
          icon={TrendingUp}
          title="Forbedringspotensial"
          subtitle="Estimert handicap-effekt av SG-forbedringer"
        >
          <div className="space-y-3 mt-4">
            {improvementAreas.map((area) => {
              if (area.current === null) return null;
              const hcpImpact = estimateHandicapImpact(area.improvement);
              const newSg = area.current + area.improvement;

              return (
                <div
                  key={area.label}
                  className="p-4 rounded-xl border border-[var(--color-grey-200)] bg-[var(--color-grey-100)]/50"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--color-grey-900)]">
                      {area.label}
                    </span>
                    <span className="text-xs font-semibold text-[var(--color-success-text)] bg-[var(--color-success-light)] px-2 py-0.5 rounded-full">
                      -{hcpImpact} HCP
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-grey-600)]">
                    <span className="font-mono">
                      {area.current.toFixed(2)} SG
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[var(--color-grey-400)]" />
                    <span className="font-mono font-semibold">
                      {newSg.toFixed(2)} SG
                    </span>
                    <span className="text-xs text-[var(--color-grey-400)] ml-1">
                      (+{area.improvement.toFixed(2)})
                    </span>
                  </div>
                  {/* Progress bar showing how close to 0 */}
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--color-grey-200)] overflow-hidden">
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

          <p className="text-[10px] text-[var(--color-grey-400)] mt-4">
            Estimater er basert pa historiske sammenhenger mellom SG og handicap.
            Faktisk effekt varierer.
          </p>
        </BentoCard>

        {/* Approach Distance Breakdown */}
        <BentoCard
          icon={Target}
          title="Innspill per avstand"
          subtitle={
            approachDistanceData.length > 0
              ? "Dine SG-verdier per avstandskategori"
              : "Registrer approach-data for a se fordeling"
          }
        >
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
                  <p className="text-xs font-medium text-[var(--color-grey-600)] mb-2">
                    Sammenligning med {selectedPro?.pro.name} (yards)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {proApproachData.map((d) => (
                      <div
                        key={d.bucket}
                        className="text-center p-2 rounded-lg bg-[var(--color-grey-100)]"
                      >
                        <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-grey-400)] mb-1">
                          {d.bucket}
                        </p>
                        <p className="text-xs text-[var(--color-grey-900)]">
                          Du:{" "}
                          <span className="font-mono font-semibold">
                            {d.player !== null ? d.player.toFixed(1) : "-"}
                          </span>
                        </p>
                        <p className="text-xs text-[var(--color-grey-500)]">
                          Pro:{" "}
                          <span className="font-mono">
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
              <Target className="w-8 h-8 text-[var(--color-grey-300)] mx-auto mb-3" />
              <p className="text-sm text-[var(--color-grey-400)]">
                Legg til approach-statistikk per avstand i rundene dine for a se
                denne analysen.
              </p>
            </div>
          )}
        </BentoCard>
      </div>
    </div>
  );
}
