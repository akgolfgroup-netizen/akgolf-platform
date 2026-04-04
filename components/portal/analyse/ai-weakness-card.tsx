"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Loader2, ChevronRight, AlertCircle } from "lucide-react";

interface WeaknessAnalysis {
  primaryWeakness: string;
  supportingEvidence: string[];
  recommendation: string;
  focusAreaBreakdown: Record<string, number>;
}

const AREA_LABELS: Record<string, string> = {
  range: "Range",
  naerspill: "Nærspill",
  putting: "Putting",
  bane: "Bane",
  styrke: "Styrke",
  restitusjon: "Restitusjon",
};

export function AIWeaknessCard() {
  const [analysis, setAnalysis] = useState<WeaknessAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchAnalysis() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/weakness-analysis", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Ukjent feil");
      }
      const data = await res.json();
      setAnalysis(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-xl border p-5"
      style={{
        background: "linear-gradient(135deg, var(--color-grey-100) 0%, var(--color-grey-100) 100%)",
        borderColor: "var(--color-grey-200)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-[var(--color-grey-900)]" />
        <h3 className="text-sm font-semibold text-[var(--color-grey-900)]">Svakhetsanalyse</h3>
        <span
          className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-medium"
          style={{ background: "var(--color-grey-200)", color: "var(--color-grey-900)" }}
        >
          Elite
        </span>
      </div>

      <AnimatePresence mode="wait">
        {!analysis && !loading && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {error && (
              <div className="flex items-center gap-2 text-xs text-[#D14343] mb-3">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                {error}
              </div>
            )}
            <p className="text-xs text-[var(--color-grey-500)] mb-4">
              Analyserer dine siste 30 dager med treningslogg og coaching-historikk for å
              identifisere ditt primære forbedringsområde.
            </p>
            <button
              onClick={fetchAnalysis}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "var(--color-black)",
                color: "var(--color-grey-900)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Analyser nå
            </button>
          </motion.div>
        )}

        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-[var(--color-grey-500)]"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyserer treningsdata...
          </motion.div>
        )}

        {analysis && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-4"
          >
            {/* Primary weakness */}
            <div
              className="rounded-lg p-3"
              style={{ background: "var(--color-grey-200)", border: "1px solid var(--color-grey-200)" }}
            >
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-grey-400)] mb-1">
                Primær svakhet
              </p>
              <p className="text-sm font-semibold text-[var(--color-grey-900)]">
                {analysis.primaryWeakness}
              </p>
            </div>

            {/* Supporting evidence */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-grey-400)] mb-2">
                Grunnlag
              </p>
              <ul className="space-y-1">
                {analysis.supportingEvidence.map((e, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-[var(--color-grey-500)]">
                    <ChevronRight className="w-3 h-3 mt-0.5 text-[var(--color-grey-900)] flex-shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div
              className="rounded-lg p-3"
              style={{ background: "rgba(34,197,94,0.05)", border: "1px solid rgba(34,197,94,0.15)" }}
            >
              <p className="text-[10px] uppercase tracking-widest text-[#2D6A4F]/60 mb-1">
                Anbefaling
              </p>
              <p className="text-xs text-[var(--color-grey-500)]">{analysis.recommendation}</p>
            </div>

            {/* Focus area breakdown */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[var(--color-grey-400)] mb-2">
                Treningsfordeling (siste 30 dager)
              </p>
              <div className="space-y-1.5">
                {Object.entries(analysis.focusAreaBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([area, pct]) => (
                    <div key={area} className="flex items-center gap-2">
                      <span className="text-[10px] text-[var(--color-grey-500)] w-20 flex-shrink-0">
                        {AREA_LABELS[area] ?? area}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full bg-[var(--color-grey-200)]">
                        <div
                          className="h-1.5 rounded-full"
                          style={{
                            width: `${pct}%`,
                            background: "var(--color-grey-900)",
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-[var(--color-grey-500)] w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <button
              onClick={() => setAnalysis(null)}
              className="text-[10px] text-[var(--color-grey-400)]/50 hover:text-[var(--color-grey-400)] transition-colors"
            >
              Analyser på nytt
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
