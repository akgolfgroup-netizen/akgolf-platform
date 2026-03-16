"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass, Loader2, RefreshCw } from "lucide-react";

interface FocusArea {
  title: string;
  reason: string;
  priority: number;
}

export function FocusRecommendationCard() {
  const [areas, setAreas] = useState<FocusArea[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchRecommendation() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/focus-recommendation", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Noe gikk galt");
      }
      const data = await res.json();
      setAreas(data.areas ?? []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Noe gikk galt");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "rgba(10,25,41,0.7)", border: "1px solid rgba(15,41,80,0.8)" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Compass className="w-4 h-4 text-[var(--color-gold)]" />
        <h2 className="text-sm font-semibold text-[var(--color-snow)]">Anbefalt fokus</h2>
      </div>

      <AnimatePresence mode="wait">
        {!areas && !loading && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {error && (
              <p className="text-xs text-red-400 mb-2">{error}</p>
            )}
            <p className="text-xs text-[var(--color-gold-muted)] mb-3">
              Få personlige anbefalinger basert på din treningshistorikk, runder og coachingøkter.
            </p>
            <button
              onClick={fetchRecommendation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-opacity hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #c9a96e 0%, #B8975C 100%)",
                color: "#0a1929",
              }}
            >
              <Compass className="w-3.5 h-3.5" />
              Generer anbefaling
            </button>
            <p className="mt-2 text-[10px] text-[var(--color-gold-muted)]/40">
              Drevet av AI-verktøy
            </p>
          </motion.div>
        )}

        {loading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-sm text-[var(--color-gold-muted)] py-4"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyserer data...
          </motion.div>
        )}

        {areas && (
          <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="space-y-3">
              {areas
                .sort((a, b) => a.priority - b.priority)
                .map((area, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 rounded-xl border border-[var(--color-border)]"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <span
                      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "rgba(184,151,92,0.15)",
                        color: "var(--color-gold)",
                      }}
                    >
                      {area.priority}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-[var(--color-snow)]">{area.title}</p>
                      <p className="text-xs text-[var(--color-gold-muted)] mt-0.5">{area.reason}</p>
                    </div>
                  </div>
                ))}
            </div>
            <button
              onClick={() => { setAreas(null); fetchRecommendation(); }}
              className="flex items-center gap-1 text-[10px] text-[var(--color-gold-dim)]/50 hover:text-[var(--color-gold-dim)] mt-3 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Oppdater
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
