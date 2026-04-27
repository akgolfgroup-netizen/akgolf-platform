"use client";

/**
 * ExerciseConfigPopover — modal som åpnes når en øvelse droppes på en
 * økt i WeekGrid. Lar spilleren konfigurere tid, reps med/uten ball,
 * fokus og notater før øvelsen lagres på økten.
 *
 * Matcher SessionExercise-skjemaet i lib/portal/training/session-exercise-types.ts.
 */

import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icon";

export interface ExerciseConfigDraft {
  /** Eksterne identifikatorer + AK-tagging fra øvelsesbanken. */
  id: string;
  name: string;
  description?: string;
  pyramid: string;
  area: string;
  lPhase?: string;
  /** Default-varighet fra ExerciseDefinition (min/max). */
  defaultDurationMinutes?: number;
}

export interface ExerciseConfigResult {
  durationMinutes?: number;
  repsWithBall?: number;
  repsWithoutBall?: number;
  focus?: string;
  notes?: string;
}

export interface ExerciseConfigPopoverProps {
  open: boolean;
  draft: ExerciseConfigDraft | null;
  onConfirm: (config: ExerciseConfigResult) => Promise<void> | void;
  onCancel: () => void;
}

export function ExerciseConfigPopover({
  open,
  draft,
  onConfirm,
  onCancel,
}: ExerciseConfigPopoverProps) {
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [repsWithBall, setRepsWithBall] = useState<string>("");
  const [repsWithoutBall, setRepsWithoutBall] = useState<string>("");
  const [focus, setFocus] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [pending, setPending] = useState(false);

  // Reset felter når en ny øvelse droppes
  useEffect(() => {
    if (open && draft) {
      setDurationMinutes(
        draft.defaultDurationMinutes ? String(draft.defaultDurationMinutes) : ""
      );
      setRepsWithBall("");
      setRepsWithoutBall("");
      setFocus("");
      setNotes("");
      setPending(false);
    }
  }, [open, draft]);

  if (!open || !draft) return null;

  const parseNumber = (value: string): number | undefined => {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    const n = parseInt(trimmed, 10);
    return Number.isFinite(n) && n >= 0 ? n : undefined;
  };

  const handleConfirm = async () => {
    setPending(true);
    try {
      await onConfirm({
        durationMinutes: parseNumber(durationMinutes),
        repsWithBall: parseNumber(repsWithBall),
        repsWithoutBall: parseNumber(repsWithoutBall),
        focus: focus.trim() || undefined,
        notes: notes.trim() || undefined,
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-card-hover">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-primary">Konfigurer øvelse</h2>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-surface-container"
            aria-label="Lukk"
          >
            <Icon name="close" size={18} className="text-on-surface-variant" />
          </button>
        </div>

        <p className="mt-1 text-sm font-semibold text-on-surface">{draft.name}</p>
        {draft.description && (
          <p className="mt-1 text-xs text-on-surface-variant">{draft.description}</p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="ex-duration"
              className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60"
            >
              Tid (min)
            </label>
            <input
              id="ex-duration"
              type="number"
              inputMode="numeric"
              min={0}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder={draft.defaultDurationMinutes ? String(draft.defaultDurationMinutes) : "10"}
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
              autoFocus
            />
          </div>
          <div>
            <label
              htmlFor="ex-focus"
              className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60"
            >
              Fokus
            </label>
            <input
              id="ex-focus"
              type="text"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="f.eks. Tempo"
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="ex-reps-ball"
              className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60"
            >
              Reps med ball
            </label>
            <input
              id="ex-reps-ball"
              type="number"
              inputMode="numeric"
              min={0}
              value={repsWithBall}
              onChange={(e) => setRepsWithBall(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="ex-reps-noball"
              className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60"
            >
              Reps uten ball
            </label>
            <input
              id="ex-reps-noball"
              type="number"
              inputMode="numeric"
              min={0}
              value={repsWithoutBall}
              onChange={(e) => setRepsWithoutBall(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="ex-notes"
            className="block font-mono text-[10px] font-bold uppercase tracking-widest text-primary/60"
          >
            Notater (valgfri)
          </label>
          <textarea
            id="ex-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="f.eks. Bruk SuperSpeed-køller for første 20 reps"
            className="mt-1 w-full resize-none rounded-lg border border-outline-variant/30 bg-surface px-3 py-2 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none"
          />
        </div>

        <div className="mt-5 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-outline-variant px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant hover:bg-surface-container"
          >
            Avbryt
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-[11px] font-bold uppercase tracking-widest text-surface hover:bg-primary-container disabled:opacity-50"
          >
            {pending ? (
              <>
                <Icon name="progress_activity" size={14} className="animate-spin" />
                Legger til…
              </>
            ) : (
              <>
                <Icon name="add" size={14} />
                Legg til øvelse
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
