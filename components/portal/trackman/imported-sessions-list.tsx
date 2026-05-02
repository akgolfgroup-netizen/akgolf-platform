"use client";

import { useEffect, useState, useTransition } from "react";
import { Calendar, Trash2, Loader2, Inbox } from "lucide-react";
import { deleteTrackmanSession } from "@/lib/portal/trackman/upload-actions";

interface SessionItem {
  sessionId: string;
  date: string;
  context: string;
  totalShots: number;
  clubs: { club: string; count: number }[];
  avgBallSpeed: number | null;
}

interface SessionsResponse {
  items: SessionItem[];
}

/**
 * Liste over importerte TrackMan-sesjoner med slett-knapp.
 * Henter fra /api/portal/trackman/sessions og kaller deleteTrackmanSession-action.
 * Bruker bekreftelse i UI for sletting (window.confirm).
 */
export function ImportedSessionsList() {
  const [items, setItems] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portal/trackman/sessions?limit=10");
      if (!res.ok) throw new Error("Kunne ikke laste importer");
      const data = (await res.json()) as SessionsResponse;
      setItems(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Feil ved lasting");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const handleDelete = (sessionId: string, totalShots: number) => {
    const confirmed = window.confirm(
      `Slette denne okten? ${totalShots} slag vil bli fjernet permanent.`,
    );
    if (!confirmed) return;

    setPendingId(sessionId);
    startTransition(async () => {
      const result = await deleteTrackmanSession(sessionId);
      setPendingId(null);
      if (result.ok) {
        setItems((prev) => prev.filter((i) => i.sessionId !== sessionId));
      } else {
        setError(result.error ?? "Kunne ikke slette okten");
      }
    });
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-[var(--color-line,#E4EAE6)] bg-card p-6 text-center text-sm text-ink-muted">
        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
        Laster importer...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-[var(--color-line,#E4EAE6)] bg-card p-4 text-sm text-[var(--color-danger,#B84233)]">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--color-line,#E4EAE6)] bg-card p-8 text-center">
        <Inbox className="w-6 h-6 text-ink-subtle mx-auto mb-2" />
        <p className="text-sm font-medium text-ink">Ingen importerte okter enna</p>
        <p className="text-xs text-ink-muted mt-1">
          Last opp din forste TrackMan-eksport over for a komme i gang.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-ink px-1">
        Tidligere importer ({items.length})
      </h2>
      <ul className="space-y-2">
        {items.map((item) => {
          const date = new Date(item.date);
          const isPending = pendingId === item.sessionId;
          return (
            <li
              key={item.sessionId}
              className="flex items-center gap-3 rounded-xl border border-[var(--color-line,#E4EAE6)] bg-card p-3 hover:border-[var(--color-line-soft,#EDF1EE)] transition-colors"
            >
              <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-soft,#E8F0EC)] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-[var(--color-primary,#005840)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <p className="text-sm font-medium text-ink truncate">
                    {date.toLocaleDateString("nb-NO", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <span className="text-xs font-mono text-ink-muted">
                    {item.totalShots} slag
                  </span>
                </div>
                <p className="text-xs text-ink-subtle truncate">
                  {item.clubs
                    .slice(0, 4)
                    .map((c) => `${c.club} (${c.count})`)
                    .join(" · ")}
                  {item.clubs.length > 4 ? ` +${item.clubs.length - 4}` : ""}
                </p>
              </div>
              <button
                onClick={() => handleDelete(item.sessionId, item.totalShots)}
                disabled={isPending}
                className="p-2 rounded-lg text-ink-muted hover:text-[var(--color-danger,#B84233)] hover:bg-[var(--color-danger-soft,#F4DAD5)] disabled:opacity-50 transition-colors"
                aria-label={`Slett okt fra ${date.toLocaleDateString("nb-NO")}`}
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
