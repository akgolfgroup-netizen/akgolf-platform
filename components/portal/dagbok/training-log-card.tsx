"use client";

import { useState } from "react";
import { Clock, Star, AlertTriangle, Trash2 } from "lucide-react";
import { deleteTrainingLog } from "@/app/portal/(dashboard)/dagbok/actions";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

interface TrainingLog {
  id: string;
  date: Date;
  durationMinutes: number | null;
  focusArea: string | null;
  notes: string | null;
  rating: number | null;
  deviatedFromPlan: boolean;
  deviationReason: string | null;
  planSession: { title: string; focusArea: string | null } | null;
}

const focusLabels: Record<string, string> = {
  range: "Range",
  naerspill: "Nærspill",
  putting: "Putting",
  bane: "Bane",
  styrke: "Styrke",
  restitusjon: "Restitusjon",
};

export function TrainingLogCard({ log }: { log: TrainingLog }) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Slett denne loggoppføringen?")) return;
    setDeleting(true);
    await deleteTrainingLog(log.id);
  }

  return (
    <div
      className="rounded-xl p-4 border group"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "var(--color-grey-200)",
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[var(--color-grey-900)]">
              {log.planSession?.title ?? "Frihånd-økt"}
            </span>
            {log.focusArea && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-grey-900)]/10 border border-[var(--color-grey-900)]/20 text-[var(--color-grey-500)]">
                {focusLabels[log.focusArea] ?? log.focusArea}
              </span>
            )}
            {log.deviatedFromPlan && (
              <span className="flex items-center gap-0.5 text-[10px] text-orange-400">
                <AlertTriangle className="w-2.5 h-2.5" />
                Avvik
              </span>
            )}
          </div>

          <p className="text-[10px] text-[var(--color-grey-500)] mt-0.5">
            {format(new Date(log.date), "EEEE d. MMMM", { locale: nb })}
          </p>

          <div className="flex items-center gap-3 mt-2">
            {log.durationMinutes && (
              <span className="flex items-center gap-1 text-[10px] text-[var(--color-grey-500)]">
                <Clock className="w-3 h-3" />
                {log.durationMinutes} min
              </span>
            )}
            {log.rating && (
              <span className="flex items-center gap-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className="w-2.5 h-2.5"
                    style={{
                      color: i < log.rating! ? "var(--color-grey-900)" : "var(--color-grey-200)",
                      fill: i < log.rating! ? "var(--color-grey-900)" : "transparent",
                    }}
                  />
                ))}
              </span>
            )}
          </div>

          {log.notes && (
            <p className="mt-2 text-xs text-[var(--color-grey-900)]/60 line-clamp-2">
              {log.notes}
            </p>
          )}

          {log.deviatedFromPlan && log.deviationReason && (
            <p className="mt-1.5 text-[10px] text-orange-400/70">
              Avvik: {log.deviationReason}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-[var(--color-error)]/50 hover:text-[var(--color-error)]"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
