"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { ITEM_TYPE_LABELS, PLAYER_LEVELS } from "@/lib/portal/library/types";
import { TRENINGSOMRADER } from "@/lib/portal/training/ak-taxonomy";
import type { LibraryItemType } from "@prisma/client";

interface Props {
  onDone: () => void;
}

export function GeneratorPanel({ onDone }: Props) {
  const [type, setType] = useState<LibraryItemType>("DRILL");
  const [area, setArea] = useState(TRENINGSOMRADER[0].code);
  const [count, setCount] = useState(3);
  const [difficulty, setDifficulty] = useState(3);
  const [levels, setLevels] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<number | null>(null);

  const toggleLevel = (lvl: string) => {
    setLevels(curr =>
      curr.includes(lvl) ? curr.filter(l => l !== lvl) : [...curr, lvl]
    );
  };

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setCreated(null);
    try {
      const res = await fetch("/api/admin/library/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          type,
          area,
          count,
          difficulty,
          playerLevels: levels.length > 0 ? levels : undefined,
          notes: notes.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Kunne ikke generere");
      }
      setCreated(data.created ?? 0);
      setTimeout(onDone, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-white p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
        <h2 className="font-medium text-[var(--color-ink)]">Lag nye forslag</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--color-ink-muted)]">Type</span>
          <select
            value={type}
            onChange={e => setType(e.target.value as LibraryItemType)}
            className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
          >
            {(Object.keys(ITEM_TYPE_LABELS) as LibraryItemType[]).map(t => (
              <option key={t} value={t}>
                {ITEM_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--color-ink-muted)]">Område</span>
          <select
            value={area}
            onChange={e => setArea(e.target.value)}
            className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
          >
            {TRENINGSOMRADER.map(a => (
              <option key={a.code} value={a.code}>
                {a.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--color-ink-muted)]">Antall (1–10)</span>
          <input
            type="number"
            min={1}
            max={10}
            value={count}
            onChange={e => setCount(Math.max(1, Math.min(10, Number(e.target.value))))}
            className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="text-[var(--color-ink-muted)]">Vanskelighet</span>
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={e => setDifficulty(Number(e.target.value))}
          />
          <span className="text-xs text-[var(--color-ink-subtle)]">
            Steg {difficulty}/5
          </span>
        </label>
      </div>

      <div className="mt-4">
        <span className="text-sm text-[var(--color-ink-muted)]">
          Spillerkategorier (la stå tom for alle)
        </span>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PLAYER_LEVELS.map(lvl => {
            const active = levels.includes(lvl);
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => toggleLevel(lvl)}
                className={`rounded-md px-2.5 py-1 font-mono text-xs ${
                  active
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-[var(--color-surface-soft)] text-[var(--color-ink-muted)] hover:bg-[var(--color-line)]"
                }`}
              >
                {lvl}
              </button>
            );
          })}
        </div>
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        <span className="text-[var(--color-ink-muted)]">
          Ekstra føringer (valgfritt)
        </span>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          placeholder="F.eks. 'fokus på pre-shot rutine' eller 'unngå bunker-driller her'"
          className="rounded-lg border border-[var(--color-line)] bg-white px-3 py-2"
        />
      </label>

      {error ? (
        <p className="mt-3 text-sm text-[var(--color-danger)]">{error}</p>
      ) : null}
      {created !== null ? (
        <p className="mt-3 text-sm text-[var(--color-success)]">
          {created} nye forslag opprettet som utkast.
        </p>
      ) : null}

      <div className="mt-5 flex justify-end gap-2">
        <button
          onClick={onDone}
          disabled={submitting}
          className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--color-ink-muted)] hover:bg-[var(--color-surface-soft)]"
        >
          Avbryt
        </button>
        <button
          onClick={submit}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Genererer…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generer
            </>
          )}
        </button>
      </div>
    </div>
  );
}
