"use client";

import { useState, useTransition } from "react";
import { X, Star, NotebookPen } from "lucide-react";
import { logSession } from "@/app/portal/(dashboard)/dagbok/actions";

interface LogSessionSheetProps {
  open: boolean;
  onClose: () => void;
  prefill?: {
    planSessionId?: string;
    date?: string;
    title?: string;
    focusArea?: string | null;
    durationMinutes?: number | null;
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

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      await logSession({
        planSessionId: prefill?.planSessionId,
        date: prefill?.date ?? new Date().toISOString(),
        durationMinutes: duration ? Number(duration) : undefined,
        focusArea: focusArea || undefined,
        notes: notes || undefined,
        rating: rating || undefined,
        deviatedFromPlan,
        deviationReason: deviatedFromPlan ? deviationReason : undefined,
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
        className="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #0A1929 0%, #0A1929 100%)",
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
              background: "linear-gradient(135deg, #c9a96e 0%, #B07D4F 100%)",
              color: "var(--color-grey-900)",
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
