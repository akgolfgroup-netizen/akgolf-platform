"use client";


import { Icon } from "@/components/ui/icon";
import { useState, FormEvent } from "react";


interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type Level = "nasjonal" | "regional" | "lokal" | "internasjonal";

const LEVELS: { value: Level; label: string }[] = [
  { value: "lokal", label: "Lokal (klubbturnering)" },
  { value: "regional", label: "Regional" },
  { value: "nasjonal", label: "Nasjonal" },
  { value: "internasjonal", label: "Internasjonal" },
];

export function AddTournamentModal({ open, onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [level, setLevel] = useState<Level>("lokal");
  const [externalUrl, setExternalUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/tournament-planner/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          startDate,
          endDate: endDate || undefined,
          level,
          location: location || undefined,
          externalUrl: externalUrl || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || `Feil: ${res.status}`);
        return;
      }

      onSuccess?.();
      // Reset + lukk
      setName("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setLevel("lokal");
      setExternalUrl("");
      setNotes("");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-on-surface/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-xl bg-surface-container-lowest p-6 shadow-card-hover-deep"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-on-surface">Legg til egen turnering</h2>
            <p className="mt-1 text-sm text-on-surface-variant">
              Legg inn klubbturnering eller en turnering som ikke finnes i listen.
              Kun du ser denne.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-on-surface-variant hover:bg-surface hover:text-on-surface-variant/80"
            aria-label="Lukk"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="t-name" className="block text-sm font-medium text-on-surface-variant/90">
              Navn *
            </label>
            <input
              id="t-name"
              type="text"
              required
              minLength={2}
              maxLength={200}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="F.eks. Klubbmesterskap GFGK 2026"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="t-start" className="block text-sm font-medium text-on-surface-variant/90">
                Startdato *
              </label>
              <input
                id="t-start"
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label htmlFor="t-end" className="block text-sm font-medium text-on-surface-variant/90">
                Sluttdato
              </label>
              <input
                id="t-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="t-level" className="block text-sm font-medium text-on-surface-variant/90">
              Nivå *
            </label>
            <select
              id="t-level"
              required
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="t-loc" className="block text-sm font-medium text-on-surface-variant/90">
              Sted
            </label>
            <input
              id="t-loc"
              type="text"
              maxLength={200}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="F.eks. Oslo Golfklubb"
            />
          </div>

          <div>
            <label htmlFor="t-url" className="block text-sm font-medium text-on-surface-variant/90">
              Lenke (valgfri)
            </label>
            <input
              id="t-url"
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="t-notes" className="block text-sm font-medium text-on-surface-variant/90">
              Notater (valgfri)
            </label>
            <textarea
              id="t-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              maxLength={500}
              className="mt-1 block w-full rounded-lg border border-outline-variant/30 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Serienavn, klasse, eller andre detaljer"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-error-light p-3 text-sm text-error-text" role="alert">
              {error}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 rounded-xl border border-outline-variant/30 px-4 py-2 text-sm font-medium text-on-surface-variant/90 hover:bg-surface disabled:opacity-50"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface hover:bg-primary-alt disabled:opacity-50"
            >
              {submitting && <Icon name="progress_activity" className="h-4 w-4 animate-spin" />}
              Lagre turnering
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
