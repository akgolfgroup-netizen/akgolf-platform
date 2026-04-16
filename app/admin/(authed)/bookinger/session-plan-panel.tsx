"use client";

import { useState } from "react";
import { Loader2, Sparkles, ChevronDown, ChevronUp, Target, StickyNote, Dumbbell } from "lucide-react";
import type { SessionPlan } from "@/lib/portal/ai/session-planner";

export function SessionPlanPanel({ bookingId }: { bookingId: string }) {
  const [plan, setPlan] = useState<SessionPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/portal/ai/session-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Noe gikk galt");
      }
      const data = (await res.json()) as { plan: SessionPlan };
      setPlan(data.plan);
      setExpanded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ukjent feil");
    } finally {
      setLoading(false);
    }
  }

  if (!plan) {
    return (
      <div className="mt-3 pt-3 border-t border-grey-50">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-medium text-black hover:text-grey-400 transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          {loading ? "Genererer AI-forslag..." : "Generer AI-forslag"}
        </button>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-grey-50">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-xs font-medium text-black hover:text-grey-400 transition-colors w-full text-left"
      >
        <Sparkles className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1">AI-øktplan — {plan.summary}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 shrink-0" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-success/40" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-grey-400 mb-0.5">Oppvarming · {plan.warmup.duration} min</p>
              <p className="text-xs text-black">{plan.warmup.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-black/40" />
            <div className="flex-1 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-grey-400">Hoveddrill</p>
              {plan.mainDrills.map((drill, i) => (
                <div key={i} className="bg-grey-50 border border-grey-200 rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Dumbbell className="w-3.5 h-3.5 text-black shrink-0" />
                    <span className="text-xs font-semibold text-black">{drill.name}</span>
                    <span className="ml-auto text-[10px] text-grey-400">{drill.duration} min</span>
                  </div>
                  <p className="text-xs text-grey-400 ml-5.5">{drill.description}</p>
                  {drill.equipment && <p className="text-[10px] text-grey-400 ml-5.5 mt-0.5 italic">Utstyr: {drill.equipment}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-warning/40" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-grey-400 mb-0.5">Avslutning · {plan.cooldown.duration} min</p>
              <p className="text-xs text-black">{plan.cooldown.description}</p>
            </div>
          </div>

          {plan.keyPoints.length > 0 && (
            <div className="bg-grey-50 border border-grey-200 rounded-lg p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-grey-400 mb-1.5">Nøkkelpunkter</p>
              <ul className="space-y-1">
                {plan.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-black">
                    <Target className="w-3 h-3 text-black shrink-0 mt-0.5" />{kp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.trainerNotes && (
            <div className="flex items-start gap-2 text-xs text-grey-400 italic">
              <StickyNote className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{plan.trainerNotes}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 text-[10px] text-grey-400 hover:text-black transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Generer på nytt
          </button>
        </div>
      )}
    </div>
  );
}
