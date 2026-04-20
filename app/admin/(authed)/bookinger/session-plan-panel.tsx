"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

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
      <div className="mt-3 pt-3 border-t border-surface">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 text-xs font-medium text-on-surface hover:text-on-surface-variant transition-colors disabled:opacity-50"
        >
          {loading ? <Icon name="progress_activity" className="w-3.5 h-3.5 animate-spin" /> : <Icon name="auto_awesome" className="w-3.5 h-3.5" />}
          {loading ? "Genererer AI-forslag..." : "Generer AI-forslag"}
        </button>
        {error && <p className="mt-1.5 text-xs text-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="mt-3 pt-3 border-t border-surface">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-2 text-xs font-medium text-on-surface hover:text-on-surface-variant transition-colors w-full text-left"
      >
        <Icon name="auto_awesome" className="w-3.5 h-3.5 shrink-0" />
        <span className="flex-1">AI-øktplan — {plan.summary}</span>
        {expanded ? <Icon name="expand_less" className="w-3.5 h-3.5 shrink-0" /> : <Icon name="expand_more" className="w-3.5 h-3.5 shrink-0" />}
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-success/40" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant mb-0.5">Oppvarming · {plan.warmup.duration} min</p>
              <p className="text-xs text-on-surface">{plan.warmup.description}</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-on-surface/40" />
            <div className="flex-1 space-y-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant">Hoveddrill</p>
              {plan.mainDrills.map((drill, i) => (
                <div key={i} className="bg-surface border border-outline-variant/30 rounded-lg p-2.5">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon name="fitness_center" className="w-3.5 h-3.5 text-on-surface shrink-0" />
                    <span className="text-xs font-semibold text-on-surface">{drill.name}</span>
                    <span className="ml-auto text-[10px] text-on-surface-variant">{drill.duration} min</span>
                  </div>
                  <p className="text-xs text-on-surface-variant ml-5.5">{drill.description}</p>
                  {drill.equipment && <p className="text-[10px] text-on-surface-variant ml-5.5 mt-0.5 italic">Utstyr: {drill.equipment}</p>}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-1 shrink-0 self-stretch rounded-full bg-warning/40" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant mb-0.5">Avslutning · {plan.cooldown.duration} min</p>
              <p className="text-xs text-on-surface">{plan.cooldown.description}</p>
            </div>
          </div>

          {plan.keyPoints.length > 0 && (
            <div className="bg-surface border border-outline-variant/30 rounded-lg p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-variant mb-1.5">Nøkkelpunkter</p>
              <ul className="space-y-1">
                {plan.keyPoints.map((kp, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-on-surface">
                    <Icon name="my_location" className="w-3 h-3 text-on-surface shrink-0 mt-0.5" />{kp}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {plan.trainerNotes && (
            <div className="flex items-start gap-2 text-xs text-on-surface-variant italic">
              <Icon name="sticky_note_2" className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{plan.trainerNotes}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-1.5 text-[10px] text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50"
          >
            {loading ? <Icon name="progress_activity" className="w-3 h-3 animate-spin" /> : <Icon name="auto_awesome" className="w-3 h-3" />}
            Generer på nytt
          </button>
        </div>
      )}
    </div>
  );
}
