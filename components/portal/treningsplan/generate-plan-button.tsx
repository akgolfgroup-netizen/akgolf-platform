"use client";

import { useState, useTransition } from "react";
import { Sparkles, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface GeneratePlanButtonProps {
  studentId: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const PERIOD_TYPES = [
  { value: "PREPARATION", label: "Forberedelse" },
  { value: "COMPETITION", label: "Konkurranse" },
  { value: "RECOVERY", label: "Restitusjon" },
  { value: "OFF_SEASON", label: "Off-season" },
];

const DURATION_OPTIONS = [
  { value: 4, label: "4 uker" },
  { value: 8, label: "8 uker" },
  { value: 12, label: "12 uker" },
];

export function GeneratePlanButton({ studentId, variant = "primary", className }: GeneratePlanButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [goals, setGoals] = useState("");
  const [periodType, setPeriodType] = useState("PREPARATION");
  const [durationWeeks, setDurationWeeks] = useState(8);

  async function handleGenerate() {
    if (!goals.trim()) {
      setError("Vennligst fyll inn mål for perioden");
      return;
    }

    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/portal/ai/training-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            goals: goals.trim(),
            periodType,
            durationWeeks,
            startDate: new Date().toISOString(),
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error ?? "Kunne ikke generere plan");
        }

        setShowModal(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Noe gikk galt");
      }
    });
  }

  const buttonClass = variant === "primary"
    ? "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#B07D4F] text-white hover:bg-[#A06D3F] transition-colors"
    : "inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium bg-[#B07D4F] text-white hover:bg-[#A06D3F] transition-colors";

  return (
    <>
      <button onClick={() => setShowModal(true)} className={`${buttonClass} ${className ?? ""}`}>
        <Sparkles className="w-4 h-4" />
        {variant === "primary" ? "Generer ny plan" : "Generer treningsplan"}
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isPending && setShowModal(false)}
          />

          {/* Modal */}
          <div
            className="relative w-full max-w-md rounded-2xl p-6"
            style={{
              background: "linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)",
              border: "1px solid #333",
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#B07D4F]" />
                <h2 className="text-sm font-semibold text-white">Generer treningsplan</h2>
              </div>
              <button
                onClick={() => !isPending && setShowModal(false)}
                className="text-[#737373] hover:text-white transition-colors"
                disabled={isPending}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Goals */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#737373] mb-1.5">
                  Mål for perioden *
                </label>
                <textarea
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  rows={3}
                  placeholder="F.eks: Senke handicap fra 12 til 10, forbedre putting på 2-3 meter, øke konsistens på approach..."
                  className="w-full px-3 py-2 rounded-lg text-sm bg-transparent border border-[#333] outline-none resize-none text-white placeholder:text-[#525252] focus:border-[#B07D4F]"
                  disabled={isPending}
                />
              </div>

              {/* Period Type */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#737373] mb-1.5">
                  Periodetype
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PERIOD_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setPeriodType(type.value)}
                      disabled={isPending}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
                      style={{
                        background: periodType === type.value ? "rgba(176,125,79,0.15)" : "transparent",
                        borderColor: periodType === type.value ? "#B07D4F" : "#333",
                        color: periodType === type.value ? "#B07D4F" : "#A3A3A3",
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-widest text-[#737373] mb-1.5">
                  Varighet
                </label>
                <div className="flex gap-2">
                  {DURATION_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setDurationWeeks(opt.value)}
                      disabled={isPending}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors"
                      style={{
                        background: durationWeeks === opt.value ? "rgba(176,125,79,0.15)" : "transparent",
                        borderColor: durationWeeks === opt.value ? "#B07D4F" : "#333",
                        color: durationWeeks === opt.value ? "#B07D4F" : "#A3A3A3",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg">{error}</p>
              )}

              {/* Submit */}
              <button
                onClick={handleGenerate}
                disabled={isPending}
                className="w-full py-2.5 rounded-xl text-sm font-semibold transition-opacity flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #c9a96e 0%, #B07D4F 100%)",
                  color: "#0a1929",
                  opacity: isPending ? 0.7 : 1,
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Genererer plan...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generer plan
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#525252] text-center">
                AI genererer en personlig treningsplan basert på dine mål
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
