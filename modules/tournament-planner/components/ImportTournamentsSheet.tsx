"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Loader2, Download, Check, AlertCircle } from "lucide-react";

const LEVELS = ["nasjonal", "regional", "lokal", "internasjonal"] as const;

interface ImportedCompetition {
  golfboxId: number;
  name: string;
  startDate: string;
  endDate: string | null;
  venue?: string;
  category?: string;
  selected: boolean;
  level: string;
}

interface ImportTournamentsSheetProps {
  open: boolean;
  onClose: () => void;
}

export function ImportTournamentsSheet({ open, onClose }: ImportTournamentsSheetProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [competitions, setCompetitions] = useState<ImportedCompetition[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ created: number; updated: number } | null>(null);
  const router = useRouter();

  async function handleFetch() {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/tournament-planner/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Feil ved henting");
        return;
      }
      setCategoryName(data.categoryName);
      setCompetitions(
        data.competitions.map((c: Omit<ImportedCompetition, "selected" | "level">) => ({
          ...c,
          selected: true,
          level: "nasjonal",
        }))
      );
    } catch {
      setError("Kunne ikke koble til GolfBox API");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm() {
    const selected = competitions.filter((c) => c.selected);
    if (!selected.length) return;

    setConfirming(true);
    try {
      const res = await fetch("/api/tournament-planner/import/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          competitions: selected.map((c) => ({
            golfboxId: c.golfboxId,
            name: c.name,
            startDate: c.startDate,
            endDate: c.endDate,
            venue: c.venue,
            level: c.level,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Feil ved import");
        return;
      }
      setResult(data);
      router.refresh();
    } catch {
      setError("Importfeil");
    } finally {
      setConfirming(false);
    }
  }

  function toggleAll(checked: boolean) {
    setCompetitions((prev) => prev.map((c) => ({ ...c, selected: checked })));
  }

  function setBulkLevel(level: string) {
    setCompetitions((prev) =>
      prev.map((c) => (c.selected ? { ...c, level } : c))
    );
  }

  if (!open) return null;

  const selectedCount = competitions.filter((c) => c.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-bold text-[var(--color-snow)] text-sm">
              Importer fra GolfBox
            </h2>
            <p className="text-xs text-[var(--color-gold-muted)]">
              Lim inn en norskgolf.no terminliste-URL
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg">
            <X className="w-4 h-4 text-[var(--color-gold-muted)]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* URL input */}
          <div className="flex gap-2">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.norskgolf.no/terminlister#/customer/18/schedule/2026/7671"
              className="flex-1 px-3 py-2.5 rounded-xl bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)] placeholder:text-[var(--color-gold-muted)]/40"
            />
            <button
              onClick={handleFetch}
              disabled={loading || !url}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Hent
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success result */}
          {result && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs">
              <Check className="w-4 h-4 flex-shrink-0" />
              {result.created} opprettet, {result.updated} oppdatert
            </div>
          )}

          {/* Competition list */}
          {competitions.length > 0 && !result && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-[var(--color-snow)]">
                  {categoryName} — {competitions.length} turneringer
                </p>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[var(--color-gold-muted)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedCount === competitions.length}
                      onChange={(e) => toggleAll(e.target.checked)}
                      className="accent-[var(--color-gold)]"
                    />
                    Velg alle
                  </label>
                  <select
                    onChange={(e) => setBulkLevel(e.target.value)}
                    className="px-2 py-1 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-xs"
                    defaultValue=""
                  >
                    <option value="" disabled>Sett nivå (bulk)</option>
                    {LEVELS.map((l) => (
                      <option key={l} value={l}>
                        {l.charAt(0).toUpperCase() + l.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                {competitions.map((comp, i) => (
                  <div
                    key={comp.golfboxId}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                      comp.selected
                        ? "border-[var(--color-gold)]/20 bg-[var(--color-gold)]/5"
                        : "border-[var(--color-border)] opacity-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={comp.selected}
                      onChange={(e) => {
                        setCompetitions((prev) =>
                          prev.map((c, j) =>
                            j === i ? { ...c, selected: e.target.checked } : c
                          )
                        );
                      }}
                      className="accent-[var(--color-gold)] flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-snow)] truncate">
                        {comp.name}
                      </p>
                      <p className="text-xs text-[var(--color-gold-muted)]">
                        {new Date(comp.startDate).toLocaleDateString("nb-NO")}
                        {comp.venue && ` · ${comp.venue}`}
                      </p>
                    </div>
                    <select
                      value={comp.level}
                      onChange={(e) => {
                        setCompetitions((prev) =>
                          prev.map((c, j) =>
                            j === i ? { ...c, level: e.target.value } : c
                          )
                        );
                      }}
                      className="px-2 py-1 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-xs flex-shrink-0"
                    >
                      {LEVELS.map((l) => (
                        <option key={l} value={l}>
                          {l.charAt(0).toUpperCase() + l.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {competitions.length > 0 && !result && (
          <div className="px-5 py-4 border-t border-[var(--color-border)]">
            <button
              onClick={handleConfirm}
              disabled={confirming || selectedCount === 0}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
            >
              {confirming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                `Importer ${selectedCount} turnering${selectedCount !== 1 ? "er" : ""}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
