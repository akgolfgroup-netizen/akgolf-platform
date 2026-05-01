"use client";

import { useState, useTransition } from "react";
import { X, Dumbbell, Timer, CircleDot, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LogProgressModalProps {
  planId: string;
  phaseId: string;
  phaseTitle: string;
  onClose: () => void;
  onLogged: () => void;
}

export function LogProgressModal({
  planId,
  phaseId,
  phaseTitle,
  onClose,
  onLogged,
}: LogProgressModalProps) {
  const [isPending, startTransition] = useTransition();
  const [repsDone, setRepsDone] = useState<number | "">("");
  const [hoursDone, setHoursDone] = useState<number | "">("");
  const [ballsDone, setBallsDone] = useState<number | "">("");
  const [qualityScore, setQualityScore] = useState<number>(5);
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    startTransition(async () => {
      const res = await fetch(`/api/portal/technical-plans/${planId}/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phaseId,
          repsDone: typeof repsDone === "number" ? repsDone : 0,
          hoursDone: typeof hoursDone === "number" ? hoursDone : 0,
          ballsDone: typeof ballsDone === "number" ? ballsDone : null,
          qualityScore,
          notes: notes || null,
        }),
      });

      if (res.ok) {
        onLogged();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
      <Card className="w-full max-w-md bg-card rounded-2xl border border-line shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-ink">Logg økt</h3>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-ink-muted mb-4">{phaseTitle}</p>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-ink-muted mb-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                Reps
              </label>
              <input
                type="number"
                value={repsDone}
                onChange={(e) => setRepsDone(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-ink-muted mb-1.5">
                <Timer className="w-3.5 h-3.5" />
                Timer
              </label>
              <input
                type="number"
                step="0.5"
                value={hoursDone}
                onChange={(e) =>
                  setHoursDone(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-ink-muted mb-1.5">
                <CircleDot className="w-3.5 h-3.5" />
                Baller
              </label>
              <input
                type="number"
                value={ballsDone}
                onChange={(e) =>
                  setBallsDone(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-ink-muted mb-1.5">
              <Star className="w-3.5 h-3.5" />
              Kvalitet (1–10)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <button
                  key={n}
                  onClick={() => setQualityScore(n)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                    qualityScore >= n
                      ? "bg-primary text-white"
                      : "bg-surface-soft text-ink-muted hover:bg-line"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Notater</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Hva jobbet du med?"
              className="w-full rounded-lg border border-line bg-card px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="ghost" onClick={onClose}>
            Avbryt
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-primary text-white hover:bg-primary-hover"
          >
            {isPending ? "Logger..." : "Logg økt"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
