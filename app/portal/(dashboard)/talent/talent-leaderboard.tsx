"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Search, Image as ImageIcon, Loader2, ChevronLeft, ChevronRight, TrendingDown } from "lucide-react";
import {
  fetchLeaderboard,
  type LeaderboardData,
  type LeaderboardFilters,
} from "./actions";

const AGE_GROUPS = ["G19", "G15", "G12", "J19", "J15", "J12", "HERR", "DAME"] as const;
const REGIONS = ["OST", "VEST", "MIDT", "NORD", "SOR"] as const;
const YEARS = [2025, 2024, 2023, 2022];

function formatDecimal(n: number | null, digits = 1): string {
  if (n === null || n === undefined) return "—";
  return n.toLocaleString("nb-NO", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function ConfidenceBar({ score }: { score: number }) {
  const pct = Math.round(score * 100);
  const color = score >= 0.7 ? "bg-success" : score >= 0.3 ? "bg-warning" : "bg-error";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-line-soft overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-mono text-ink-muted w-8">{pct}%</span>
    </div>
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

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Talent</h1>
        <p className="text-sm text-ink-muted">
          Scouting på tvers av OLYO, Srixon, Østlandstour, Garmin Norgescup og WAGR.
          Snitt brutto vises kun når spilleren har spilt minst {filters.minRounds ?? 3} runder i sesongen.
        </p>
      </header>

      <FiltersBar filters={filters} setFilters={setFilters} totalPlayers={data.total} />

      <div className="rounded-2xl border border-line bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-ink-muted">
            <tr>
              <th className="px-4 py-3 text-left w-12">#</th>
              <th className="px-4 py-3 text-left">Spiller</th>
              <th className="px-4 py-3 text-left">Klubb</th>
              <th className="px-4 py-3 text-left">Gruppe</th>
              <th className="px-4 py-3 text-right">Snitt</th>
              <th className="px-4 py-3 text-right">Beste</th>
              <th className="px-4 py-3 text-right">T3</th>
              <th className="px-4 py-3 text-right">T10</th>
              <th className="px-4 py-3 text-right">Forb./år</th>
              <th className="px-4 py-3 text-left">Konfidens</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r, i) => (
              <tr
                key={r.playerId}
                className="border-t border-line-soft hover:bg-surface-soft/50 transition"
              >
                <td className="px-4 py-3 font-mono text-ink-muted">{startRank + i}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/portal/talent/${r.playerId}`}
                    className="flex items-center gap-2 text-ink hover:text-primary"
                  >
                    {r.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={r.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-surface-soft flex items-center justify-center">
                        <ImageIcon className="h-4 w-4 text-ink-subtle" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">
                        {r.firstName} {r.lastName}
                      </div>
                      {r.birthYear && (
                        <div className="text-xs text-ink-subtle font-mono">f. {r.birthYear}</div>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-muted">{r.club ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-primary-soft text-primary">
                    {r.ageGroup}
                  </span>
                </td>
                <td className="px-4 py-3 text-right font-mono font-medium text-ink">
                  {formatDecimal(r.avgRound, 1)}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-muted">
                  {r.bestRound ?? "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-muted">
                  {r.top3Count}
                </td>
                <td className="px-4 py-3 text-right font-mono text-ink-muted">
                  {r.top10Count}
                </td>
                <td className="px-4 py-3 text-right font-mono">
                  {r.improvementPerYear !== null && r.improvementPerYear !== undefined ? (
                    <span
                      className={
                        r.improvementPerYear < 0 ? "text-success" : "text-ink-muted"
                      }
                    >
                      {r.improvementPerYear < 0 && (
                        <TrendingDown className="inline h-3 w-3 mr-0.5" />
                      )}
                      {r.improvementPerYear > 0 ? "+" : ""}
                      {formatDecimal(r.improvementPerYear, 1)}
                    </span>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <ConfidenceBar score={r.dataConfidenceScore} />
                </td>
              </tr>
            ))}
            {data.rows.length === 0 && (
              <tr>
                <td colSpan={10} className="p-8 text-center text-ink-subtle">
                  Ingen spillere matcher dette filteret
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between text-sm text-ink-muted">
        <span>
          {data.total.toLocaleString("nb-NO")} spillere · side {data.page} av {totalPages}
          {pending && <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />}
        </span>
        <div className="flex gap-2">
          <button
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-soft disabled:opacity-50"
            disabled={data.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
          >
            <ChevronLeft className="inline h-4 w-4" /> Forrige
          </button>
          <button
            className="rounded-lg border border-line px-3 py-1.5 text-sm hover:bg-surface-soft disabled:opacity-50"
            disabled={data.page >= totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
          >
            Neste <ChevronRight className="inline h-4 w-4" />
          </button>
        </div>
      </footer>
    </div>
  );
}

function FiltersBar({
  filters,
  setFilters,
}: {
  filters: LeaderboardFilters;
  setFilters: (f: LeaderboardFilters | ((p: LeaderboardFilters) => LeaderboardFilters)) => void;
  totalPlayers: number;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <input
            type="search"
            placeholder="Søk navn eller klubb..."
            className="w-full rounded-lg border border-line bg-surface-soft py-2 pl-9 pr-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            value={filters.search ?? ""}
            onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))}
          />
        </div>
        <Select
          label="Aldersgruppe"
          value={filters.ageGroup ?? "ALL"}
          onChange={(v) => setFilters((f) => ({ ...f, ageGroup: v as never, page: 1 }))}
          options={["ALL", ...AGE_GROUPS]}
        />
        <Select
          label="Region"
          value={filters.region ?? "ALL"}
          onChange={(v) => setFilters((f) => ({ ...f, region: v as never, page: 1 }))}
          options={["ALL", ...REGIONS]}
        />
        <Select
          label="Sesong"
          value={String(filters.year ?? 2025)}
          onChange={(v) => setFilters((f) => ({ ...f, year: parseInt(v, 10), page: 1 }))}
          options={YEARS.map(String)}
        />
        <Select
          label="Hull"
          value={String(filters.holesSegment ?? 18)}
          onChange={(v) => setFilters((f) => ({ ...f, holesSegment: parseInt(v, 10) as 9 | 18, page: 1 }))}
          options={["18", "9"]}
        />
        <Select
          label="Min runder"
          value={String(filters.minRounds ?? 3)}
          onChange={(v) => setFilters((f) => ({ ...f, minRounds: parseInt(v, 10), page: 1 }))}
          options={["3", "5", "10"]}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-xs font-medium text-ink-muted whitespace-nowrap">{label}</span>
      <select
        className="rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === "ALL" ? "Alle" : o}
          </option>
        ))}
      </select>
    </label>
  );
}
