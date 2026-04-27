"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Sparkles,
  Award,
  Target,
  Users as UsersIcon,
} from "lucide-react";
import {
  fetchLeaderboard,
  type LeaderboardData,
  type LeaderboardFilters,
} from "./actions";

const AGE_GROUPS = ["G19", "G15", "G12", "J19", "J15", "J12", "HERR", "DAME"] as const;
const REGIONS = [
  { value: "ALL", label: "Hele Norge" },
  { value: "OST", label: "Øst" },
  { value: "VEST", label: "Vest" },
  { value: "MIDT", label: "Midt" },
  { value: "NORD", label: "Nord" },
  { value: "SOR", label: "Sør" },
] as const;
const YEARS = [2025, 2024, 2023, 2022];

const AGE_LABEL: Record<string, string> = {
  G19: "Gutter 16-19",
  G15: "Gutter 13-15",
  G12: "Gutter -12",
  J19: "Jenter 16-19",
  J15: "Jenter 13-15",
  J12: "Jenter -12",
  HERR: "Herrer 20+",
  DAME: "Damer 20+",
};

function formatDecimal(n: number | null, digits = 1): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("nb-NO", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

function ConfidenceMeter({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const tone =
    score >= 0.7
      ? "bg-[#005840]"
      : score >= 0.3
        ? "bg-[#C48A32]"
        : "bg-[#B84233]";
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="h-1 w-14 rounded-full bg-[#EDF1EE] overflow-hidden">
        <div className={`h-full ${tone} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[11px] font-mono text-[#5C6B62] tabular-nums">{pct}%</span>
    </div>
  );
}

function MedalRank({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#D1F843] text-[#003B2A] font-mono text-xs font-bold">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#E4EAE6] text-[#0A1F18] font-mono text-xs font-bold">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F6ECD9] text-[#C48A32] font-mono text-xs font-bold">
        3
      </span>
    );
  return (
    <span className="inline-flex h-7 w-7 items-center justify-center font-mono text-xs text-[#8A958E] tabular-nums">
      {rank}
    </span>
  );
}

export function TalentLeaderboard({ initialData }: { initialData: LeaderboardData }) {
  const [data, setData] = useState<LeaderboardData>(initialData);
  const [pending, startTransition] = useTransition();
  const [filters, setFilters] = useState<LeaderboardFilters>({
    page: 1,
    year: 2025,
    holesSegment: 18,
    minRounds: 3,
  });

  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(async () => {
        const next = await fetchLeaderboard(filters);
        setData(next);
      });
    }, 250);
    return () => clearTimeout(t);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const startRank = (data.page - 1) * data.pageSize + 1;

  // Topp 3 stats fra siden
  const heroStats = useMemo(() => {
    const top3 = data.rows.slice(0, 3);
    const top10Avg =
      data.rows.length >= 10
        ? data.rows.slice(0, 10).reduce((s, r) => s + (r.avgRound ?? 0), 0) / 10
        : null;
    const bestImprovement = data.rows.reduce<number | null>((best, r) => {
      if (r.improvementPerYear === null || r.improvementPerYear === undefined) return best;
      if (best === null) return r.improvementPerYear;
      return r.improvementPerYear < best ? r.improvementPerYear : best;
    }, null);
    return { top3, top10Avg, bestImprovement };
  }, [data.rows]);

  return (
    <div className="space-y-8">
      {/* HERO */}
      <header className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-[#5C6B62] uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 text-[#005840]" />
          <span>Talent · scouting</span>
        </div>
        <h1 className="font-display text-4xl font-semibold text-[#0A1F18] tracking-tight">
          Norske talenter,{" "}
          <span className="italic font-light text-[#005840]">datadrevet</span>
        </h1>
        <p className="text-[#5C6B62] max-w-2xl">
          Brutto stroke play på tvers av OLYO Juniortour, Srixon Tour, Titleist Østlandstour,
          Garmin Norgescup og WAGR. Snitt vises kun når spilleren har minst{" "}
          {filters.minRounds ?? 3} runder i sesongen.
        </p>
      </header>

      {/* HERO-KPI STRIPE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HeroStat
          label="Spillere i visning"
          value={data.total.toLocaleString("nb-NO")}
          icon={<UsersIcon className="h-4 w-4" />}
        />
        <HeroStat
          label="Snitt topp 10"
          value={heroStats.top10Avg !== null ? formatDecimal(heroStats.top10Avg, 1) : "—"}
          hint="brutto · 18 hull"
          icon={<Target className="h-4 w-4" />}
        />
        <HeroStat
          label="Beste forbedring"
          value={
            heroStats.bestImprovement !== null
              ? (heroStats.bestImprovement > 0 ? "+" : "") +
                formatDecimal(heroStats.bestImprovement, 1)
              : "—"
          }
          hint="slag/år"
          tone={heroStats.bestImprovement !== null && heroStats.bestImprovement < 0 ? "good" : "neutral"}
          icon={<TrendingDown className="h-4 w-4" />}
        />
        <HeroStat
          label="Sesong"
          value={String(filters.year ?? 2025)}
          hint={`${filters.holesSegment ?? 18} hull · min ${filters.minRounds ?? 3} runder`}
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      {/* FILTERS */}
      <FiltersBar filters={filters} setFilters={setFilters} />

      {/* TABLE */}
      <div className="rounded-2xl border border-[#E4EAE6] bg-white shadow-[0_1px_2px_rgba(15,31,24,0.04),0_4px_12px_rgba(15,31,24,0.04)] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#EDF1EE] flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#0A1F18]">
              Leaderboard
            </h2>
            <p className="text-xs text-[#8A958E] mt-0.5">
              Sortert på snitt brutto stigende · lavest snitt øverst
            </p>
          </div>
          {pending && (
            <span className="inline-flex items-center gap-2 text-xs text-[#5C6B62]">
              <Loader2 className="h-3 w-3 animate-spin" /> Oppdaterer…
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-[#8A958E]">
                <th className="px-6 py-3 text-left font-medium w-16">#</th>
                <th className="px-4 py-3 text-left font-medium">Spiller</th>
                <th className="px-4 py-3 text-left font-medium">Klubb</th>
                <th className="px-4 py-3 text-left font-medium">Gruppe</th>
                <th className="px-4 py-3 text-right font-medium">Snitt</th>
                <th className="px-4 py-3 text-right font-medium">Beste</th>
                <th className="px-4 py-3 text-right font-medium">T3 / T10</th>
                <th className="px-4 py-3 text-right font-medium">Forbedring</th>
                <th className="px-4 py-3 text-left font-medium">Konfidens</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((r, i) => {
                const rank = startRank + i;
                const ageLabel = AGE_LABEL[r.ageGroup] ?? r.ageGroup;
                return (
                  <tr
                    key={r.playerId}
                    className="border-t border-[#EDF1EE] hover:bg-[#F4F6F4]/60 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <MedalRank rank={rank} />
                    </td>
                    <td className="px-4 py-3.5">
                      <Link
                        href={`/portal/talent/${r.playerId}`}
                        className="flex items-center gap-3 group/link"
                      >
                        {r.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={r.photoUrl}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-white shadow-sm"
                          />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-[#E8F0EC] flex items-center justify-center text-[#005840] text-xs font-medium font-mono">
                            {r.firstName[0]}
                            {r.lastName[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[#0A1F18] group-hover/link:text-[#005840] transition-colors">
                            {r.firstName} {r.lastName}
                          </div>
                          {r.birthYear && (
                            <div className="text-[11px] text-[#8A958E] font-mono mt-0.5">
                              f. {r.birthYear}
                              {r.region && (
                                <>
                                  <span className="mx-1">·</span>
                                  <span>{r.region.toLowerCase()}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 text-[#5C6B62] text-[13px]">
                      {r.club ?? "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#E8F0EC] text-[#005840]">
                        {r.ageGroup}
                      </span>
                      <div className="text-[10px] text-[#8A958E] mt-0.5">{ageLabel}</div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="font-mono text-base font-semibold text-[#0A1F18] tabular-nums">
                        {formatDecimal(r.avgRound, 1)}
                      </div>
                      <div className="text-[10px] text-[#8A958E] font-mono mt-0.5">
                        {r.totalRounds} runder
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono text-[#0A1F18] tabular-nums">
                      {r.bestRound ?? "—"}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="font-mono tabular-nums text-[#0A1F18]">
                        {r.top3Count}
                      </span>
                      <span className="text-[#8A958E] mx-0.5">/</span>
                      <span className="font-mono tabular-nums text-[#5C6B62]">
                        {r.top10Count}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right font-mono tabular-nums">
                      {r.improvementPerYear !== null && r.improvementPerYear !== undefined ? (
                        <span
                          className={
                            r.improvementPerYear < 0
                              ? "text-[#005840] font-medium inline-flex items-center gap-1"
                              : r.improvementPerYear > 0
                                ? "text-[#B84233] inline-flex items-center gap-1"
                                : "text-[#5C6B62]"
                          }
                        >
                          {r.improvementPerYear < 0 && (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {r.improvementPerYear > 0 && <TrendingUp className="h-3 w-3" />}
                          {r.improvementPerYear > 0 ? "+" : ""}
                          {formatDecimal(r.improvementPerYear, 1)}
                        </span>
                      ) : (
                        <span className="text-[#8A958E]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <ConfidenceMeter score={r.dataConfidenceScore} />
                    </td>
                  </tr>
                );
              })}
              {data.rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-12 text-center text-[#8A958E]">
                    <div className="font-display text-lg mb-1">Ingen treff</div>
                    <p className="text-sm">Prøv å justere filtrene</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-[#EDF1EE] flex items-center justify-between text-xs text-[#5C6B62]">
          <span className="font-mono">
            Side {data.page} av {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-[#E4EAE6] px-3 py-1.5 hover:bg-[#F4F6F4] disabled:opacity-40 transition"
              disabled={data.page <= 1}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Forrige
            </button>
            <button
              className="inline-flex items-center gap-1 rounded-lg border border-[#E4EAE6] px-3 py-1.5 hover:bg-[#F4F6F4] disabled:opacity-40 transition"
              disabled={data.page >= totalPages}
              onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
            >
              Neste <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroStat({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "neutral" | "good";
}) {
  const valueColor = tone === "good" ? "text-[#005840]" : "text-[#0A1F18]";
  return (
    <div className="rounded-2xl bg-white border border-[#E4EAE6] p-5 shadow-[0_1px_2px_rgba(15,31,24,0.04)] hover:shadow-[0_1px_2px_rgba(15,31,24,0.06),0_14px_32px_rgba(15,31,24,0.08)] hover:-translate-y-0.5 transition-all">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-[#8A958E]">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`mt-3 font-display text-3xl font-semibold tabular-nums ${valueColor}`}>
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-[#8A958E] font-mono">{hint}</div>}
    </div>
  );
}

function FiltersBar({
  filters,
  setFilters,
}: {
  filters: LeaderboardFilters;
  setFilters: (f: LeaderboardFilters | ((p: LeaderboardFilters) => LeaderboardFilters)) => void;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#E4EAE6] p-5 shadow-[0_1px_2px_rgba(15,31,24,0.04)]">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[260px]">
          <label className="block text-[11px] font-medium uppercase tracking-wider text-[#8A958E] mb-1.5">
            Søk
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A958E]" />
            <input
              type="search"
              placeholder="Navn eller klubb…"
              className="w-full rounded-lg border border-[#E4EAE6] bg-white py-2.5 pl-9 pr-3 text-sm focus:border-[#005840] focus:outline-none focus:ring-2 focus:ring-[#005840]/15"
              value={filters.search ?? ""}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
              }
            />
          </div>
        </div>

        <FilterPill
          label="Aldersgruppe"
          value={filters.ageGroup ?? "ALL"}
          onChange={(v) => setFilters((f) => ({ ...f, ageGroup: v as never, page: 1 }))}
          options={[
            { value: "ALL", label: "Alle" },
            ...AGE_GROUPS.map((g) => ({ value: g, label: AGE_LABEL[g] })),
          ]}
        />
        <FilterPill
          label="Region"
          value={filters.region ?? "ALL"}
          onChange={(v) => setFilters((f) => ({ ...f, region: v as never, page: 1 }))}
          options={REGIONS.map((r) => ({ value: r.value, label: r.label }))}
        />
        <FilterPill
          label="Sesong"
          value={String(filters.year ?? 2025)}
          onChange={(v) => setFilters((f) => ({ ...f, year: parseInt(v, 10), page: 1 }))}
          options={YEARS.map((y) => ({ value: String(y), label: String(y) }))}
        />
        <FilterPill
          label="Hull"
          value={String(filters.holesSegment ?? 18)}
          onChange={(v) =>
            setFilters((f) => ({ ...f, holesSegment: parseInt(v, 10) as 9 | 18, page: 1 }))
          }
          options={[
            { value: "18", label: "18 hull" },
            { value: "9", label: "9 hull" },
          ]}
        />
        <FilterPill
          label="Min runder"
          value={String(filters.minRounds ?? 3)}
          onChange={(v) =>
            setFilters((f) => ({ ...f, minRounds: parseInt(v, 10), page: 1 }))
          }
          options={[
            { value: "3", label: "3+" },
            { value: "5", label: "5+" },
            { value: "10", label: "10+" },
          ]}
        />
      </div>
    </div>
  );
}

function FilterPill({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="block text-[11px] font-medium uppercase tracking-wider text-[#8A958E] mb-1.5">
        {label}
      </label>
      <select
        className="rounded-lg border border-[#E4EAE6] bg-white px-3 py-2.5 text-sm text-[#0A1F18] focus:border-[#005840] focus:outline-none focus:ring-2 focus:ring-[#005840]/15"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
