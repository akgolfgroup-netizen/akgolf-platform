"use client";

import { useState, useTransition } from "react";
import { X, Star, NotebookPen, Plus, MessageSquare } from "lucide-react";
import { logSession } from "@/app/portal/(dashboard)/dagbok/actions";
import { ExerciseLogRow, type ExerciseLogData } from "./exercise-log-row";
import {
  L_PHASES,
  M_ENVIRONMENTS,
  PR_LEVELS,
  type LPhase,
  type MEnvironment,
  type PRLevel,
} from "@/lib/portal/golf/ak-formula";

interface LogSessionSheetProps {
  open: boolean;
  onClose: () => void;
  prefill?: {
    planSessionId?: string;
    date?: string;
    title?: string;
    focusArea?: string | null;
    durationMinutes?: number | null;
    exercises?: Array<{
      id: string;
      name: string;
      plannedSets?: number;
      plannedReps?: number;
    }>;
    coachFeedback?: string | null;
  };
}

const FOCUS_OPTIONS = [
  { value: "range", label: "Range" },
  { value: "naerspill", label: "Nærspill" },
  { value: "putting", label: "Putting" },
  { value: "bane", label: "Bane" },
  { value: "styrke", label: "Styrke" },
  { value: "restitusjon", label: "Restitusjon" },
];

export function LogSessionSheet({ open, onClose, prefill }: LogSessionSheetProps) {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState<number>(0);
  const [focusArea, setFocusArea] = useState(prefill?.focusArea ?? "");
  const [duration, setDuration] = useState(String(prefill?.durationMinutes ?? ""));
  const [notes, setNotes] = useState("");
  const [deviatedFromPlan, setDeviatedFromPlan] = useState(false);
  const [deviationReason, setDeviationReason] = useState("");

  // Session-level AK-formula parameters
  const [primaryLPhase, setPrimaryLPhase] = useState<LPhase | undefined>();
  const [primaryEnvironment, setPrimaryEnvironment] = useState<MEnvironment | undefined>();
  const [primaryPressLevel, setPrimaryPressLevel] = useState<PRLevel | undefined>();

  // Exercise tracking
  const [exercises, setExercises] = useState<ExerciseLogData[]>(() => {
    if (prefill?.exercises && prefill.exercises.length > 0) {
      return prefill.exercises.map((ex) => ({
        id: ex.id,
        exerciseName: ex.name,
        plannedSets: ex.plannedSets,
        plannedReps: ex.plannedReps,
      }));
    }
    return [];
  });

  // New exercise input
  const [showAddExercise, setShowAddExercise] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");

  if (!open) return null;

  function handleAddExercise() {
    if (!newExerciseName.trim()) return;

    const newExercise: ExerciseLogData = {
      id: `temp-${Date.now()}`,
      exerciseName: newExerciseName.trim(),
    };

    setExercises([...exercises, newExercise]);
    setNewExerciseName("");
    setShowAddExercise(false);
  }

  function handleUpdateExercise(index: number, data: ExerciseLogData) {
    const updated = [...exercises];
    updated[index] = data;
    setExercises(updated);
  }

  function handleRemoveExercise(index: number) {
    setExercises(exercises.filter((_, i) => i !== index));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      // TODO: Replace with logSessionWithExercises when server action is ready
      // The new action should accept:
      // - exercises: ExerciseLogData[]
      // - primaryLPhase, primaryEnvironment, primaryPressLevel
      await logSession({
        planSessionId: prefill?.planSessionId,
        date: prefill?.date ?? new Date().toISOString(),
        durationMinutes: duration ? Number(duration) : undefined,
        focusArea: focusArea || undefined,
        notes: notes || undefined,
        rating: rating || undefined,
        deviatedFromPlan,
        deviationReason: deviatedFromPlan ? deviationReason : undefined,
        // TODO: Add these fields when logSessionWithExercises is implemented
        // exercises,
        // primaryLPhase,
        // primaryEnvironment,
        // primaryPressLevel,
      });
      onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl p-6"
        style={{
          background: "white",
          border: "1px solid var(--color-grey-200)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <NotebookPen className="w-4 h-4 text-[var(--color-grey-900)]" />
            <h2 className="text-sm font-semibold text-[var(--color-grey-900)]">
              {prefill?.title ? `Logg: ${prefill.title}` : "Logg økt"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--color-grey-400)]/50 hover:text-[var(--color-grey-900)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
              Opplevelse
            </label>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className="w-6 h-6"
                    style={{
                      color: n <= rating ? "var(--color-grey-900)" : "var(--color-grey-200)",
                      fill: n <= rating ? "var(--color-grey-900)" : "transparent",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Focus area */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
              Fokusområde
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FOCUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFocusArea(opt.value)}
                  className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                  style={{
                    background: focusArea === opt.value ? "var(--color-grey-200)" : "transparent",
                    borderColor: focusArea === opt.value ? "var(--color-grey-900)" : "var(--color-grey-200)",
                    color: focusArea === opt.value ? "var(--color-grey-900)" : "var(--color-grey-500)",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
              Varighet (min)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="60"
              min={5}
              max={480}
              className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
              style={{ borderColor: "var(--color-grey-200)" }}
            />
          </div>

          {/* Session-level AK-formula parameters */}
          <div className="space-y-3 p-4 rounded-xl" style={{ background: "var(--color-grey-50)" }}>
            <h3 className="text-xs font-semibold text-[var(--color-grey-900)]">
              AK-formel (øktnivå)
            </h3>

            {/* L-phase */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
                L-fase (Læringsfokus)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(L_PHASES) as LPhase[]).map((phase) => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setPrimaryLPhase(primaryLPhase === phase ? undefined : phase)}
                    className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                    style={{
                      background: primaryLPhase === phase ? "var(--color-grey-200)" : "white",
                      borderColor: primaryLPhase === phase ? "var(--color-grey-900)" : "var(--color-grey-200)",
                      color: primaryLPhase === phase ? "var(--color-grey-900)" : "var(--color-grey-500)",
                    }}
                  >
                    {L_PHASES[phase].name}
                  </button>
                ))}
              </div>
            </div>

            {/* M-environment */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
                M-miljø (Treningskontekst)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(M_ENVIRONMENTS) as unknown as MEnvironment[]).map((envKey) => {
                  const env = M_ENVIRONMENTS[envKey];
                  return (
                    <button
                      key={envKey}
                      type="button"
                      onClick={() => setPrimaryEnvironment(primaryEnvironment === envKey ? undefined : envKey)}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                      style={{
                        background: primaryEnvironment === envKey ? "var(--color-grey-200)" : "white",
                        borderColor: primaryEnvironment === envKey ? "var(--color-grey-900)" : "var(--color-grey-200)",
                        color: primaryEnvironment === envKey ? "var(--color-grey-900)" : "var(--color-grey-500)",
                      }}
                    >
                      {env.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PR-level */}
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
                PR-press (Stressnivå)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(Object.keys(PR_LEVELS) as unknown as PRLevel[]).map((prKey) => {
                  const pr = PR_LEVELS[prKey];
                  return (
                    <button
                      key={prKey}
                      type="button"
                      onClick={() => setPrimaryPressLevel(primaryPressLevel === prKey ? undefined : prKey)}
                      className="px-3 py-1 rounded-full text-xs font-medium border transition-colors"
                      style={{
                        background: primaryPressLevel === prKey ? "var(--color-grey-200)" : "white",
                        borderColor: primaryPressLevel === prKey ? "var(--color-grey-900)" : "var(--color-grey-200)",
                        color: primaryPressLevel === prKey ? "var(--color-grey-900)" : "var(--color-grey-500)",
                      }}
                    >
                      {pr.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Exercises section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)]">
                Øvelser ({exercises.length})
              </label>
              <button
                type="button"
                onClick={() => setShowAddExercise(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors hover:bg-[var(--color-grey-100)]"
                style={{ color: "var(--color-grey-500)" }}
              >
                <Plus className="w-3 h-3" />
                Legg til øvelse
              </button>
            </div>

            {/* Add exercise input */}
            {showAddExercise && (
              <div
                className="flex gap-2 p-3 rounded-xl"
                style={{
                  background: "var(--color-grey-100)",
                  border: "1px solid var(--color-grey-200)",
                }}
              >
                <input
                  type="text"
                  value={newExerciseName}
                  onChange={(e) => setNewExerciseName(e.target.value)}
                  placeholder="Navn på øvelse..."
                  className="flex-1 px-3 py-2 rounded-lg text-sm bg-white border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
                  style={{ borderColor: "var(--color-grey-200)" }}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExercise();
                    } else if (e.key === "Escape") {
                      setShowAddExercise(false);
                      setNewExerciseName("");
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddExercise}
                  disabled={!newExerciseName.trim()}
                  className="px-3 py-2 rounded-lg text-xs font-semibold transition-opacity"
                  style={{
                    background: "var(--color-black)",
                    color: "white",
                    opacity: newExerciseName.trim() ? 1 : 0.5,
                  }}
                >
                  Legg til
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddExercise(false);
                    setNewExerciseName("");
                  }}
                  className="p-2 rounded-lg text-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Exercise list */}
            <div className="space-y-3">
              {exercises.map((exercise, index) => (
                <ExerciseLogRow
                  key={exercise.id}
                  data={exercise}
                  onChange={(data) => handleUpdateExercise(index, data)}
                  onRemove={() => handleRemoveExercise(index)}
                />
              ))}
            </div>

            {exercises.length === 0 && !showAddExercise && (
              <p className="text-xs text-[var(--color-grey-400)] text-center py-4">
                Ingen øvelser registrert. Klikk &quot;Legg til øvelse&quot; for å starte.
              </p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)] mb-1.5">
              Notater
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Hva gikk bra? Hva skal forbedres?"
              className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border outline-none resize-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
              style={{ borderColor: "var(--color-grey-200)" }}
            />
          </div>

          {/* Coach feedback (readonly for student) */}
          {prefill?.coachFeedback && (
            <div
              className="p-4 rounded-xl"
              style={{
                background: "var(--color-grey-50)",
                border: "1px solid var(--color-grey-200)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-grey-500)]" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--color-grey-400)]">
                  Tilbakemelding fra coach
                </span>
              </div>
              <p className="text-sm text-[var(--color-grey-900)]">
                {prefill.coachFeedback}
              </p>
            </div>
          )}

          {/* Deviated from plan */}
          {prefill?.planSessionId && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={deviatedFromPlan}
                  onChange={(e) => setDeviatedFromPlan(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[var(--color-grey-900)]"
                />
                <span className="text-xs text-[var(--color-grey-500)]">
                  Avvik fra plan
                </span>
              </label>
              {deviatedFromPlan && (
                <input
                  type="text"
                  value={deviationReason}
                  onChange={(e) => setDeviationReason(e.target.value)}
                  placeholder="Årsak til avvik..."
                  className="mt-2 w-full px-3 py-2 rounded-lg text-sm bg-transparent border outline-none text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)]/30"
                  style={{ borderColor: "var(--color-grey-200)" }}
                />
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity"
            style={{
              background: "var(--color-black)",
              color: "white",
              opacity: isPending ? 0.7 : 1,
            }}
          >
            {isPending ? "Lagrer..." : "Lagre økt"}
          </button>
        </form>
      </div>
    </div>
  );
}
