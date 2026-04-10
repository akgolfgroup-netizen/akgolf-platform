"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, X, Loader2 } from "lucide-react";

const PERIOD_TYPES = [
  { value: "grunnperiode", label: "Grunnperiode", desc: "Volum og teknisk grunnarbeid" },
  { value: "spesialiseringsperiode", label: "Spesialiseringsperiode", desc: "Situasjonstrening og presisjon" },
  { value: "turneringsperiode", label: "Turneringsperiode", desc: "Vedlikehold og konkurranseforberedelse" },
];

interface AIGenerateButtonProps {
  studentId: string;
}

export function AIGenerateButton({ studentId }: AIGenerateButtonProps) {
  const [open, setOpen] = useState(false);
  const [goals, setGoals] = useState("");
  const [periodType, setPeriodType] = useState("grunnperiode");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGenerate() {
    if (!goals.trim()) return;
    setLoading(true);
    const startDate = new Date().toISOString().split("T")[0];
    await fetch("/api/portal/ai/training-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, goals, periodType, durationWeeks, startDate }),
    });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-grey-900)] text-[var(--color-grey-900)] text-sm font-semibold hover:bg-[var(--color-grey-500)] transition-colors"
      >
        <Zap className="w-4 h-4" />
        Generer plan
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-[var(--color-grey-900)]">Generer treningsplan</h2>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-[var(--color-grey-100)] rounded">
                <X className="w-4 h-4 text-[var(--color-grey-500)]" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
                  Spillerens mål
                </label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  placeholder="F.eks: Forbedre putting under press, bygge konsekvens med driver, forberede seg til NM U18..."
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] text-[var(--color-grey-900)] text-sm placeholder:text-[var(--color-grey-500)]/50 outline-none focus:border-[var(--color-grey-900)] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
                  Periodiseringstype
                </label>
                <div className="space-y-2">
                  {PERIOD_TYPES.map((p) => (
                    <label
                      key={p.value}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        periodType === p.value
                          ? "border-[var(--color-grey-900)] bg-[var(--color-grey-900)]/5"
                          : "border-[var(--color-grey-200)] hover:border-[var(--color-grey-900)]/30"
                      }`}
                    >
                      <input
                        type="radio"
                        value={p.value}
                        checked={periodType === p.value}
                        onChange={() => setPeriodType(p.value)}
                        className="mt-0.5 accent-[var(--color-grey-900)]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-grey-900)]">{p.label}</p>
                        <p className="text-xs text-[var(--color-grey-500)]">{p.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--color-grey-500)] mb-1.5">
                  Varighet: {durationWeeks} uker
                </label>
                <input
                  type="range"
                  min={2}
                  max={12}
                  value={durationWeeks}
                  onChange={(e) => setDurationWeeks(Number(e.target.value))}
                  className="w-full accent-[var(--color-grey-900)]"
                />
                <div className="flex justify-between text-xs text-[var(--color-grey-500)]/50 mt-1">
                  <span>2 uker</span>
                  <span>12 uker</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !goals.trim()}
              className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-grey-900)] text-[var(--color-grey-900)] font-semibold text-sm hover:bg-[var(--color-grey-500)] transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Genererer plan...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generer {durationWeeks}-ukers plan
                </>
              )}
            </button>
            <p className="mt-2 text-[10px] text-[var(--color-grey-500)]/40 text-center">
              Drevet av AI-verktøy
            </p>
          </div>
        </div>
      )}
    </>
  );
}
