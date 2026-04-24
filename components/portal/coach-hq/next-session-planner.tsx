"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface NextSessionPlannerProps {
  studentId: string;
  studentName: string;
}

interface Draft {
  focus: {
    areas: Array<{ title: string; reason: string; priority: number }>;
  };
  plan: {
    summary: string;
    warmup: { duration: number; description: string };
    mainDrills: Array<{ name: string; duration: number; description: string; equipment?: string }>;
    cooldown: { duration: number; description: string };
    keyPoints: string[];
    trainerNotes: string;
  };
  context: {
    playerHandicap: number | null;
    focusAreas: string[];
    activeGoals: Array<{ title: string; targetDate: string | null; priority: number }>;
    sources: {
      coachingSessions: number;
      trainingLogs: number;
      trackmanSessions: number;
      goals: number;
    };
  };
  generatedAt: string;
}

export function NextSessionPlanner({ studentId, studentName }: NextSessionPlannerProps) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [duration, setDuration] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const resp = await fetch("/api/portal/ai/next-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, durationMinutes: duration }),
      });
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.error ?? `HTTP ${resp.status}`);
      }
      const data = await resp.json();
      setDraft(data.draft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generering feilet");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <h3 className="text-lg font-bold text-on-surface tracking-tight">Planlegg neste økt</h3>
        <p className="text-sm text-on-surface-variant mt-1 mb-4">
          Agent henter kontekst fra {studentName} sine siste økter, TrackMan-data, mål og treningslogg, og lager et strukturert utkast.
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <label className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant block mb-1">
              Varighet
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-1.5 text-sm"
            >
              <option value={20}>20 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
            </select>
          </div>
          <Button
            variant="primary"
            onClick={generate}
            isLoading={loading}
            disabled={loading}
            className="mt-5"
          >
            <Icon name="auto_awesome" size={16} className="mr-2" />
            Generer utkast
          </Button>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-error/10 border border-error/20 p-3 text-sm text-error">
            {error}
          </div>
        )}
      </div>

      {draft && <DraftView draft={draft} />}
    </div>
  );
}

function DraftView({ draft }: { draft: Draft }) {
  const { focus, plan, context } = draft;

  return (
    <div className="space-y-4">
      {/* AI-Attribution */}
      <div className="rounded-xl bg-surface-container-low p-3 flex items-center gap-2 flex-wrap text-xs text-on-surface-variant">
        <Icon name="auto_awesome" size={14} className="text-secondary-fixed-text" filled />
        <span className="font-semibold">Kilder:</span>
        <span>{context.sources.coachingSessions} økter</span>
        <span>·</span>
        <span>{context.sources.trainingLogs} logger</span>
        <span>·</span>
        <span>{context.sources.trackmanSessions} TrackMan</span>
        <span>·</span>
        <span>{context.sources.goals} mål</span>
        {context.playerHandicap !== null && (
          <>
            <span>·</span>
            <span>HCP {context.playerHandicap.toFixed(1)}</span>
          </>
        )}
      </div>

      {/* Focus */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-3">
          Anbefalt fokus
        </div>
        <div className="space-y-2">
          {focus.areas.slice(0, 3).map((a, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="shrink-0 h-6 w-6 rounded-full bg-primary text-on-primary flex items-center justify-center text-xs font-bold">
                {a.priority}
              </div>
              <div>
                <div className="font-semibold text-sm text-on-surface">{a.title}</div>
                <div className="text-xs text-on-surface-variant">{a.reason}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan summary */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6">
        <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
          Sammendrag
        </div>
        <p className="text-sm text-on-surface">{plan.summary}</p>
      </div>

      {/* Plan structure */}
      <div className="rounded-2xl bg-surface-container-lowest border border-outline-variant/30 p-6 space-y-4">
        <PlanBlock label={`Oppvarming (${plan.warmup.duration} min)`} description={plan.warmup.description} />

        <div>
          <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
            Hoveddrills ({plan.mainDrills.reduce((a, d) => a + d.duration, 0)} min)
          </div>
          <div className="space-y-2">
            {plan.mainDrills.map((d, i) => (
              <div key={i} className="rounded-xl bg-surface-container-low p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-sm text-on-surface">{d.name}</div>
                  <div className="text-xs text-on-surface-variant">{d.duration} min</div>
                </div>
                <p className="text-xs text-on-surface-variant">{d.description}</p>
                {d.equipment && (
                  <div className="text-[10px] text-on-surface-variant mt-1">
                    <span className="font-semibold">Utstyr:</span> {d.equipment}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <PlanBlock label={`Cooldown (${plan.cooldown.duration} min)`} description={plan.cooldown.description} />

        {plan.keyPoints.length > 0 && (
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-2">
              Nøkkelpunkter
            </div>
            <ul className="space-y-1">
              {plan.keyPoints.map((p, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-on-surface">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}

        {plan.trainerNotes && (
          <div className="rounded-xl bg-secondary-fixed/10 border border-secondary-fixed/20 p-3">
            <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-1">
              Trener-notater
            </div>
            <p className="text-xs text-on-surface">{plan.trainerNotes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlanBlock({ label, description }: { label: string; description: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.12em] font-bold text-on-surface-variant mb-1">
        {label}
      </div>
      <p className="text-sm text-on-surface">{description}</p>
    </div>
  );
}
