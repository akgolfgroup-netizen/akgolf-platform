"use client";

import { useState, useTransition, useEffect } from "react";
import { Button, Badge } from "@/components/ui";
import {
  Search,
  Edit3,
  Image as ImageIcon,
  Filter as FilterIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  fetchTalentPlayers,
  fetchTalentPlayerDetail,
  type TalentListData,
  type TalentPlayerRow,
  type TalentPlayerDetail,
  type TalentFilters,
} from "./actions";
import { TalentPlayerEditor } from "@/components/admin/talent/TalentPlayerEditor";
import { DataConfidenceBadge } from "@/components/admin/talent/DataConfidenceBadge";

const AGE_GROUPS = ["G19", "G15", "G12", "J19", "J15", "J12", "HERR", "DAME"] as const;
const REGIONS = ["OST", "VEST", "MIDT", "NORD", "SOR"] as const;

export function TalentClient({ initialData }: { initialData: TalentListData }) {
  const [data, setData] = useState<TalentListData>(initialData);
  const [filters, setFilters] = useState<TalentFilters>({ page: 1 });
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState<TalentPlayerDetail | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => {
      startTransition(async () => {
        const next = await fetchTalentPlayers(filters);
        setData(next);
      });
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function openEditor(player: TalentPlayerRow) {
    setLoadingId(player.id);
    try {
      const detail = await fetchTalentPlayerDetail(player.id);
      if (detail) setEditing(detail);
    } finally {
      setLoadingId(null);
    }
  }

  function refreshAfterSave() {
    setEditing(null);
    startTransition(async () => {
      const next = await fetchTalentPlayers(filters);
      setData(next);
    });
  }

  const totalPages = Math.max(1, Math.ceil(data.total / data.pageSize));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-ink">Talent — admin</h1>
        <p className="text-sm text-ink-muted">
          {data.total.toLocaleString("nb-NO")} spillere · berik manuelt med kjønn, fødselsår,
          coach, NGF-ID og notater
        </p>
      </header>

      <FiltersBar filters={filters} setFilters={setFilters} />

      <div className="rounded-2xl border border-line bg-card shadow-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft text-xs uppercase text-ink-muted">
            <tr>
              <th className="px-4 py-3 text-left">Navn</th>
              <th className="px-4 py-3 text-left">Klubb</th>
              <th className="px-4 py-3 text-left">Født</th>
              <th className="px-4 py-3 text-left">Kjønn</th>
              <th className="px-4 py-3 text-left">Region</th>
              <th className="px-4 py-3 text-left">Resultater</th>
              <th className="px-4 py-3 text-left">WAGR</th>
              <th className="px-4 py-3 text-left">Konfidens</th>
              <th className="px-4 py-3 text-right">Handling</th>
            </tr>
          </thead>
          <tbody>
            {data.players.map((p) => (
              <tr
                key={p.id}
                className="border-t border-line-soft hover:bg-surface-soft/50 transition"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {p.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.photoUrl}
                        alt=""
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-surface-soft flex items-center justify-center text-xs text-ink-subtle">
                        <ImageIcon className="h-4 w-4" />
                      </div>
                    )}
                    <span className="font-medium text-ink">
                      {p.firstName} {p.lastName}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.club ?? "—"}</td>
                <td className="px-4 py-3">
                  {p.birthYear ? (
                    <span className="font-mono">
                      {p.birthYear}
                      {p.birthYearSource === "ESTIMATED" && (
                        <Badge variant="warning" className="ml-1">
                          est.
                        </Badge>
                      )}
                    </span>
                  ) : (
                    <span className="text-ink-subtle">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {p.gender === "MALE" ? "M" : p.gender === "FEMALE" ? "K" : <span className="text-ink-subtle">—</span>}
                </td>
                <td className="px-4 py-3 text-ink-muted">{p.region ?? "—"}</td>
                <td className="px-4 py-3 font-mono">{p.resultCount}</td>
                <td className="px-4 py-3 font-mono">
                  {p.wagrRank ? `#${p.wagrRank}` : <span className="text-ink-subtle">—</span>}
                </td>
                <td className="px-4 py-3">
                  <DataConfidenceBadge score={p.bestConfidence} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => openEditor(p)}
                    disabled={loadingId === p.id}
                  >
                    {loadingId === p.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Edit3 className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>
            ))}
            {data.players.length === 0 && (
              <tr>
                <td colSpan={9} className="p-8 text-center text-ink-subtle">
                  Ingen spillere matcher filteret
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex items-center justify-between text-sm text-ink-muted">
        <span>
          Side {data.page} av {totalPages}
          {pending && <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            disabled={data.page <= 1}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}
          >
            <ChevronLeft className="h-4 w-4" /> Forrige
          </Button>
          <Button
            size="sm"
            variant="ghost"
            disabled={data.page >= totalPages}
            onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}
          >
            Neste <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </footer>

      {editing && (
        <TalentPlayerEditor
          player={editing}
          onClose={() => setEditing(null)}
          onSaved={refreshAfterSave}
        />
      )}
    </div>
  );
}

function FiltersBar({
  filters,
  setFilters,
}: {
  filters: TalentFilters;
  setFilters: (f: TalentFilters | ((prev: TalentFilters) => TalentFilters)) => void;
}) {
  return (
    <div className="rounded-xl border border-line bg-card p-4 shadow-card">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle" />
          <input
            type="search"
            placeholder="Søk navn, klubb, NGF-ID..."
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
          label="Kjønn satt"
          value={filters.hasGender ?? "ALL"}
          onChange={(v) => setFilters((f) => ({ ...f, hasGender: v as never, page: 1 }))}
          options={["ALL", "yes", "no"]}
          labels={{ ALL: "Alle", yes: "Ja", no: "Nei" }}
        />
        <Select
          label="Fødselsår satt"
          value={filters.hasBirthYear ?? "ALL"}
          onChange={(v) => setFilters((f) => ({ ...f, hasBirthYear: v as never, page: 1 }))}
          options={["ALL", "yes", "no"]}
          labels={{ ALL: "Alle", yes: "Ja", no: "Nei" }}
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
  labels,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  labels?: Record<string, string>;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-xs font-medium text-ink-muted">
        <FilterIcon className="inline h-3 w-3 mr-1" />
        {label}
      </span>
      <select
        className="rounded-lg border border-line bg-surface-soft px-3 py-2 text-sm text-ink"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {labels?.[o] ?? (o === "ALL" ? "Alle" : o)}
          </option>
        ))}
      </select>
    </label>
  );
}
