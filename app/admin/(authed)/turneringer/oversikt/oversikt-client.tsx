"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { TournamentOverviewData, TournamentOverviewRow } from "./actions";

interface Props {
  initialData: TournamentOverviewData;
  year: number;
  levelFilter?: string;
  monthFilter?: number;
}

const MONTHS_NB = [
  "Januar", "Februar", "Mars", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Desember",
];

const LEVEL_LABEL: Record<string, string> = {
  nasjonal: "Nasjonal",
  regional: "Regional",
  internasjonal: "Internasjonal",
  lokal: "Lokal",
};

export function OversiktClient({ initialData, year, levelFilter, monthFilter }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedEntry, setSelectedEntry] = useState<{ row: TournamentOverviewRow; entryIdx: number } | null>(null);

  const updateFilter = (key: string, value: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === undefined || value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`?${params.toString()}`);
  };

  const exportCsv = () => {
    const lines: string[] = ["Spiller,Turnering,Serie,Sted,Dato,Niva,Plan,Mal,Registrert"];
    for (const row of initialData.rows) {
      for (const e of row.entries) {
        const dato = new Date(e.startDate).toLocaleDateString("nb-NO");
        lines.push([
          escapeCsv(row.studentName),
          escapeCsv(e.tournamentName),
          escapeCsv(e.series ?? ""),
          escapeCsv(e.venue ?? ""),
          dato,
          e.level,
          e.planLevel,
          e.goalType,
          e.isRegistered ? "Ja" : "Nei",
        ].join(","));
      }
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `turneringsoversikt-${year}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Pivot per student × month
  const pivotByMonth = useMemo(() => {
    const map = new Map<string, Map<number, TournamentOverviewRow["entries"]>>();
    for (const row of initialData.rows) {
      const monthMap = new Map<number, TournamentOverviewRow["entries"]>();
      for (const e of row.entries) {
        const arr = monthMap.get(e.monthIndex) ?? [];
        arr.push(e);
        monthMap.set(e.monthIndex, arr);
      }
      map.set(row.studentId, monthMap);
    }
    return map;
  }, [initialData]);

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Turneringsoversikt</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Komplett oversikt: hvilke spillere som spiller hvor til en hver tid.
          </p>
        </div>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <FilterSelect
            label="År"
            value={String(year)}
            options={[
              { value: String(year - 1), label: String(year - 1) },
              { value: String(year), label: String(year) },
              { value: String(year + 1), label: String(year + 1) },
            ]}
            onChange={(v) => updateFilter("year", v)}
          />
          <FilterSelect
            label="Nivå"
            value={levelFilter ?? "all"}
            options={[
              { value: "all", label: "Alle" },
              { value: "nasjonal", label: "Nasjonal" },
              { value: "regional", label: "Regional" },
              { value: "internasjonal", label: "Internasjonal" },
              { value: "lokal", label: "Lokal" },
            ]}
            onChange={(v) => updateFilter("level", v)}
          />
          <FilterSelect
            label="Måned"
            value={monthFilter !== undefined ? String(monthFilter) : "all"}
            options={[
              { value: "all", label: "Alle" },
              ...MONTHS_NB.map((m, i) => ({ value: String(i), label: m })),
            ]}
            onChange={(v) => updateFilter("month", v)}
          />
          <button
            onClick={exportCsv}
            className="rounded-lg border border-line bg-card px-4 py-2 text-sm font-medium hover:bg-surface-soft"
          >
            Eksporter CSV
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <Stat label="Spillere med plan" value={initialData.rows.length} />
        <Stat label="Turneringer i utvalg" value={initialData.totalTournaments} />
        <Stat label="Registrerte påmeldinger" value={initialData.totalRegistrations} />
      </div>

      {initialData.rows.length === 0 ? (
        <div className="rounded-xl border border-line bg-card p-8 text-center">
          <p className="text-ink-muted">Ingen turneringsplaner i utvalget. Spillere kan velge turneringer fra spillerportalen.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-line bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-line bg-surface-soft">
              <tr>
                <th className="sticky left-0 bg-surface-soft p-3 text-left font-medium text-ink-muted">Spiller</th>
                {MONTHS_NB.map((m) => (
                  <th key={m} className="p-2 text-center text-xs font-medium text-ink-muted">
                    {m.slice(0, 3)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {initialData.rows.map((row) => {
                const monthMap = pivotByMonth.get(row.studentId) ?? new Map();
                return (
                  <tr key={row.studentId} className="border-b border-line-soft last:border-0">
                    <td className="sticky left-0 bg-card p-3 font-medium">{row.studentName}</td>
                    {MONTHS_NB.map((_, monthIdx) => {
                      const entries = monthMap.get(monthIdx) ?? [];
                      return (
                        <td key={monthIdx} className="p-2 text-center align-top">
                          {entries.length === 0 ? (
                            <span className="text-ink-subtle">·</span>
                          ) : (
                            <div className="flex flex-col gap-1">
                              {entries.map((e: TournamentOverviewRow["entries"][number]) => (
                                <button
                                  key={e.planId}
                                  onClick={() => setSelectedEntry({ row, entryIdx: row.entries.indexOf(e) })}
                                  className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                                    e.isRegistered
                                      ? "bg-primary-soft text-primary hover:bg-primary/20"
                                      : "bg-surface-soft text-ink-muted hover:bg-line"
                                  }`}
                                  title={e.tournamentName}
                                >
                                  {e.tournamentName.length > 18 ? e.tournamentName.slice(0, 16) + "…" : e.tournamentName}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {selectedEntry && (
        <DetailModal
          row={selectedEntry.row}
          entry={selectedEntry.row.entries[selectedEntry.entryIdx]}
          onClose={() => setSelectedEntry(null)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-line bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-ink-muted">{label}</div>
      <div className="mt-1 font-mono text-2xl font-semibold">{value}</div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="text-ink-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-line bg-card px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DetailModal({
  row,
  entry,
  onClose,
}: {
  row: TournamentOverviewRow;
  entry: TournamentOverviewRow["entries"][number];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-card-hover"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-wide text-ink-muted">{row.studentName}</div>
            <h2 className="mt-1 text-xl font-semibold">{entry.tournamentName}</h2>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink" aria-label="Lukk">
            ×
          </button>
        </div>

        <dl className="mt-4 space-y-2 text-sm">
          {entry.series && (
            <Row label="Serie" value={entry.series} />
          )}
          <Row label="Nivå" value={LEVEL_LABEL[entry.level] ?? entry.level} />
          {entry.venue && <Row label="Sted" value={entry.venue} />}
          <Row
            label="Dato"
            value={
              entry.endDate && entry.endDate.getTime() !== entry.startDate.getTime()
                ? `${formatDate(entry.startDate)} – ${formatDate(entry.endDate)}`
                : formatDate(entry.startDate)
            }
          />
          <Row label="Plan" value={`Nivå ${entry.planLevel}`} />
          <Row label="Mål" value={prettifyGoal(entry.goalType)} />
          <Row
            label="Påmelding"
            value={entry.isRegistered ? "Registrert" : "Ikke registrert"}
          />
        </dl>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-muted">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString("nb-NO", { day: "2-digit", month: "short", year: "numeric" });
}

function prettifyGoal(g: string): string {
  switch (g) {
    case "prestasjon":
      return "Prestasjon";
    case "utvikling":
      return "Utvikling";
    case "trening":
      return "Trening";
    default:
      return g;
  }
}

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}
