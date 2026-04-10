"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save, Trash2 } from "lucide-react";
import { logSession, updateTrainingLog, deleteTrainingLog } from "@/app/portal/(dashboard)/dagbok/actions";

const FOCUS_AREAS = [
  { value: "TEE_TOTAL", label: "Tee (Driver + Lange køller)" },
  { value: "APPROACH", label: "Innspill (Approach)" },
  { value: "SHORT_GAME", label: "Nærspill" },
  { value: "PUTTING", label: "Putting" },
  { value: "DRIVING", label: "Driver" },
  { value: "IRON_PLAY", label: "Jernspill" },
  { value: "CHIPPING", label: "Chipping" },
  { value: "PITCHING", label: "Pitching" },
  { value: "BUNKER", label: "Bunker" },
  { value: "COURSE_MANAGEMENT", label: "Baneledelse" },
  { value: "MENTAL", label: "Mental trening" },
  { value: "FITNESS", label: "Fysisk trening" },
  { value: "OTHER", label: "Annet" },
];

interface LogEntry {
  id: string;
  date: Date | string;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  deviatedFromPlan: boolean;
  deviationReason: string | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  editLog?: LogEntry | null;
}

export function LogSessionModal({ open, onClose, editLog }: Props) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [durationMinutes, setDurationMinutes] = useState<string>("");
  const [focusArea, setFocusArea] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [deviatedFromPlan, setDeviatedFromPlan] = useState(false);
  const [deviationReason, setDeviationReason] = useState<string>("");

  useEffect(() => {
    if (editLog) {
      const d = new Date(editLog.date);
      setDate(d.toISOString().slice(0, 10));
      setDurationMinutes(editLog.durationMinutes?.toString() ?? "");
      setFocusArea(editLog.focusArea ?? "");
      setRating(editLog.rating ?? 5);
      setNotes(editLog.notes ?? "");
      setDeviatedFromPlan(editLog.deviatedFromPlan);
      setDeviationReason(editLog.deviationReason ?? "");
    } else {
      setDate(today);
      setDurationMinutes("");
      setFocusArea("");
      setRating(5);
      setNotes("");
      setDeviatedFromPlan(false);
      setDeviationReason("");
    }
    setError(null);
  }, [editLog, open, today]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const duration = durationMinutes ? parseInt(durationMinutes, 10) : undefined;
    if (duration !== undefined && (isNaN(duration) || duration < 1 || duration > 480)) {
      setError("Varighet må være mellom 1 og 480 minutter");
      return;
    }

    startTransition(async () => {
      try {
        if (editLog) {
          await updateTrainingLog(editLog.id, {
            durationMinutes: duration,
            focusArea: focusArea || undefined,
            notes: notes || undefined,
            rating,
            deviatedFromPlan,
            deviationReason: deviationReason || undefined,
          });
        } else {
          await logSession({
            date,
            durationMinutes: duration,
            focusArea: focusArea || undefined,
            notes: notes || undefined,
            rating,
            deviatedFromPlan,
            deviationReason: deviationReason || undefined,
          });
        }
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noe gikk galt");
      }
    });
  }

  function handleDelete() {
    if (!editLog) return;
    if (!confirm("Er du sikker på at du vil slette denne økten?")) return;

    startTransition(async () => {
      try {
        await deleteTrainingLog(editLog.id);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kunne ikke slette");
      }
    });
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-[var(--color-grey-200)] px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">
              {editLog ? "Rediger treningsøkt" : "Logg ny treningsøkt"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--color-grey-100)] transition-colors"
              aria-label="Lukk"
            >
              <X className="w-5 h-5 text-[var(--color-grey-500)]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Dato */}
            <div>
              <label htmlFor="log-date" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                Dato
              </label>
              <input
                id="log-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={!!editLog}
                required
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent disabled:bg-[var(--color-grey-100)]"
              />
            </div>

            {/* Varighet */}
            <div>
              <label htmlFor="log-duration" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                Varighet (minutter)
              </label>
              <input
                id="log-duration"
                type="number"
                min="1"
                max="480"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="f.eks. 60"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
            </div>

            {/* Fokusområde */}
            <div>
              <label htmlFor="log-focus" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                Fokusområde
              </label>
              <select
                id="log-focus"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
              >
                <option value="">Velg fokusområde</option>
                {FOCUS_AREAS.map((area) => (
                  <option key={area.value} value={area.value}>
                    {area.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Vurdering */}
            <div>
              <label htmlFor="log-rating" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                Hvordan føltes økten? ({rating}/10)
              </label>
              <input
                id="log-rating"
                type="range"
                min="1"
                max="10"
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value, 10))}
                className="w-full accent-[var(--color-primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--color-grey-500)] mt-1">
                <span>Tung</span>
                <span>Bra</span>
                <span>Utmerket</span>
              </div>
            </div>

            {/* Notater */}
            <div>
              <label htmlFor="log-notes" className="block text-sm font-medium text-[var(--color-grey-700)] mb-1.5">
                Notater
              </label>
              <textarea
                id="log-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                maxLength={2000}
                placeholder="Hva jobbet du med? Hva gikk bra? Hva kan forbedres?"
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
              />
            </div>

            {/* Avvik fra plan */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--color-grey-700)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={deviatedFromPlan}
                  onChange={(e) => setDeviatedFromPlan(e.target.checked)}
                  className="w-4 h-4 accent-[var(--color-primary)]"
                />
                Avvek fra planlagt økt
              </label>
              {deviatedFromPlan && (
                <textarea
                  value={deviationReason}
                  onChange={(e) => setDeviationReason(e.target.value)}
                  rows={2}
                  maxLength={500}
                  placeholder="Hvorfor avvek du fra planen?"
                  className="w-full mt-2 px-3 py-2 rounded-lg border border-[var(--color-grey-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none text-sm"
                />
              )}
            </div>

            {error && (
              <div role="alert" className="p-3 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              {editLog ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-error)] hover:bg-[var(--color-error)]/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Slett
                </button>
              ) : (
                <div />
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isPending}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[var(--color-grey-700)] hover:bg-[var(--color-grey-100)] transition-colors disabled:opacity-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editLog ? "Oppdater" : "Lagre økt"}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
