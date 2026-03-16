"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, RefreshCw, Pencil, Trash2, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { ImportTournamentsSheet } from "@/modules/tournament-planner/components/ImportTournamentsSheet";
import { EditTournamentSheet } from "@/modules/tournament-planner/components/EditTournamentSheet";
import { TournamentPlayerList } from "@/modules/tournament-planner/components/TournamentPlayerList";
import { GoalTypeBadge, PLAN_LEVEL_CONFIG } from "@/modules/tournament-planner";
import type { GoalType, PlanLevel } from "@/modules/tournament-planner";

interface TournamentRow {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  level: string;
  course: string | null;
  location: string | null;
  registrationDeadline: Date | null;
  seriesUrl: string | null;
  externalUrl: string | null;
  golfboxId: number | null;
  source: string | null;
  sourceId: string | null;
  series: string | null;
  createdById: string | null;
  _count: { playerPlans: number };
  playerPlans: {
    id: string;
    planLevel: string;
    goalType: string;
    notes: string | null;
    isRegistered: boolean;
    student: { id: string; name: string | null; image: string | null };
  }[];
}

interface TournamentAdminListProps {
  tournaments: TournamentRow[];
}

const SOURCE_LABELS: Record<string, string> = {
  golfbox: "GolfBox",
  nordic_golf_tour: "NGT",
  jmi_sweden: "JMI",
  global_junior_tour: "GJT",
  manual: "Manuell",
};

export function TournamentAdminList({ tournaments }: TournamentAdminListProps) {
  const [importOpen, setImportOpen] = useState(false);
  const [editTournament, setEditTournament] = useState<TournamentRow | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ created: number; updated: number; sources: string[] } | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [filterSeries, setFilterSeries] = useState<string>("");
  const router = useRouter();

  async function handleSync() {
    setSyncing(true);
    setSyncResult(null);
    setSyncError(null);
    try {
      const res = await fetch("/api/tournament-planner/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: new Date().getFullYear() }),
      });
      if (!res.ok) {
        throw new Error(`Synkronisering feilet (${res.status})`);
      }
      const data = await res.json();
      setSyncResult(data);
      router.refresh();
    } catch (err) {
      setSyncError(err instanceof Error ? err.message : "Ukjent feil under synkronisering");
    } finally {
      setSyncing(false);
    }
  }

  const allSeries = Array.from(new Set(tournaments.map((t) => t.series).filter(Boolean))) as string[];
  const filtered = filterSeries
    ? tournaments.filter((t) => t.series === filterSeries)
    : tournaments;

  async function handleDelete(t: TournamentRow) {
    const planCount = t._count.playerPlans;
    const msg = planCount > 0
      ? `Slette "${t.name}"? Dette sletter også ${planCount} spillerplan${planCount !== 1 ? "er" : ""}.`
      : `Slette "${t.name}"?`;

    if (!confirm(msg)) return;

    setDeletingId(t.id);
    try {
      const res = await fetch(`/api/tournament-planner/${t.id}`, { method: "DELETE" });
      if (!res.ok) {
        alert(`Kunne ikke slette turneringen (${res.status})`);
        return;
      }
      router.refresh();
    } catch {
      alert("Nettverksfeil — kunne ikke slette turneringen");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[var(--color-snow)]">
          Alle turneringer ({filtered.length})
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] text-xs font-semibold hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
            Synkroniser
          </button>
          <button
            onClick={() => setImportOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-xs font-medium hover:bg-[var(--color-gold)]/10 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            GolfBox
          </button>
        </div>
      </div>

      {syncError && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {syncError}
        </div>
      )}

      {syncResult && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
          {syncResult.created} opprettet, {syncResult.updated} oppdatert fra {syncResult.sources.join(", ")}
        </div>
      )}

      {allSeries.length > 1 && (
        <div className="flex items-center gap-2 mb-4 overflow-x-auto">
          <button
            onClick={() => setFilterSeries("")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              !filterSeries ? "bg-[var(--color-gold)]/15 text-[var(--color-gold)]" : "text-[var(--color-gold-muted)] hover:text-[var(--color-snow)]"
            }`}
          >
            Alle
          </button>
          {allSeries.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSeries(s === filterSeries ? "" : s)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterSeries === s ? "bg-[var(--color-gold)]/15 text-[var(--color-gold)]" : "text-[var(--color-gold-muted)] hover:text-[var(--color-snow)]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-2">
        {filtered.map((t) => {
          const isExpanded = expandedId === t.id;
          return (
            <div key={t.id}>
              <div className="flex items-center justify-between p-3 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-xl">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : t.id)}
                  className="flex items-center gap-2 flex-1 min-w-0 text-left"
                >
                  {t._count.playerPlans > 0 ? (
                    isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--color-gold-muted)] flex-shrink-0" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--color-gold-muted)] flex-shrink-0" />
                    )
                  ) : (
                    <span className="w-3.5 flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--color-snow)] truncate">{t.name}</p>
                    <p className="text-xs text-[var(--color-gold-muted)]">
                      {new Date(t.startDate).toLocaleDateString("nb-NO")} · {t.level}
                      {t.source && ` · ${SOURCE_LABELS[t.source] ?? t.source}`}
                      {t.series && ` · ${t.series}`}
                    </p>
                  </div>
                </button>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-[var(--color-gold-muted)]">
                    {t._count.playerPlans} planer
                  </span>
                  <button
                    onClick={() => setEditTournament(t)}
                    className="p-1.5 rounded-lg hover:bg-[var(--color-border)] transition-colors text-[var(--color-gold-muted)]"
                    title="Rediger"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(t)}
                    disabled={deletingId === t.id}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-[var(--color-gold-muted)] hover:text-red-400"
                    title="Slett"
                  >
                    {deletingId === t.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && t.playerPlans.length > 0 && (
                <TournamentPlayerList plans={t.playerPlans} />
              )}
            </div>
          );
        })}
      </div>

      <ImportTournamentsSheet open={importOpen} onClose={() => setImportOpen(false)} />

      {editTournament && (
        <EditTournamentSheet
          open={true}
          onClose={() => setEditTournament(null)}
          tournament={editTournament}
          onSaved={() => {
            setEditTournament(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
