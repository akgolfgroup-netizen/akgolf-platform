"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, Loader2 } from "lucide-react";
import type { TournamentWithPlan, PlanLevel, GoalType, PlayerTournamentPlan } from "../types";
import { GOAL_TYPE_CONFIG, PLAN_LEVEL_CONFIG } from "../constants";
import { GoalTypeTooltip } from "./GoalTypeTooltip";

interface PlanTournamentSheetProps {
  open: boolean;
  onClose: () => void;
  tournament: TournamentWithPlan;
  studentId: string;
  existingPlan?: PlayerTournamentPlan | null;
  onSaved: () => void;
  suggestedGoalType?: GoalType;
  currentPeriod?: string;
}

export function PlanTournamentSheet({
  open,
  onClose,
  tournament,
  studentId,
  existingPlan,
  onSaved,
  suggestedGoalType,
  currentPeriod,
}: PlanTournamentSheetProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [planLevel, setPlanLevel] = useState<PlanLevel>(
    existingPlan?.planLevel as PlanLevel ?? "A"
  );
  const [goalType, setGoalType] = useState<GoalType>(
    existingPlan?.goalType as GoalType ?? suggestedGoalType ?? "prestasjon"
  );
  const [notes, setNotes] = useState(existingPlan?.notes ?? "");
  const [isRegistered, setIsRegistered] = useState(existingPlan?.isRegistered ?? false);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleSave() {
    setSaving(true);
    await fetch("/api/tournament-planner/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentId,
        tournamentId: tournament.id,
        planLevel,
        goalType,
        notes: notes || undefined,
        isRegistered,
      }),
    });
    setSaving(false);
    router.refresh();
    onSaved();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60">
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[var(--color-border)]">
          <div>
            <h2 className="font-bold text-[var(--color-snow)] text-sm">
              {step === 1 ? "Velg plan-nivå" : "Velg måltype"}
            </h2>
            <p className="text-xs text-[var(--color-gold-muted)] truncate max-w-[200px]">
              {tournament.name}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-[var(--color-muted)] rounded-lg">
            <X className="w-4 h-4 text-[var(--color-gold-muted)]" />
          </button>
        </div>

        <div className="p-5">
          {step === 1 ? (
            <div className="space-y-2">
              {(Object.entries(PLAN_LEVEL_CONFIG) as [PlanLevel, { label: string; description: string }][]).map(
                ([level, config]) => (
                  <button
                    key={level}
                    onClick={() => { setPlanLevel(level); setStep(2); }}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-colors ${
                      planLevel === level
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-gold)]/30"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-[var(--color-snow)] text-sm">{config.label}</p>
                      <p className="text-xs text-[var(--color-gold-muted)]">{config.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[var(--color-gold-muted)]" />
                  </button>
                )
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-xs text-[var(--color-gold-muted)] hover:text-[var(--color-snow)] mb-3"
              >
                ← Plan {planLevel} valgt
              </button>

              {(Object.entries(GOAL_TYPE_CONFIG) as [GoalType, typeof GOAL_TYPE_CONFIG[GoalType]][]).map(
                ([type, config]) => (
                  <label
                    key={type}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      goalType === type
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/5"
                        : "border-[var(--color-border)] hover:border-[var(--color-gold)]/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="goalType"
                      value={type}
                      checked={goalType === type}
                      onChange={() => setGoalType(type)}
                      className="mt-0.5 accent-[var(--color-gold)]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: config.color }}>
                          {config.label}
                        </span>
                        <GoalTypeTooltip goalType={type} />
                      </div>
                      <p className="text-xs text-[var(--color-gold-muted)] mt-0.5">
                        {config.tooltip}
                      </p>
                    </div>
                  </label>
                )
              )}

              {currentPeriod && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-[var(--color-border)]/30 text-xs text-[var(--color-gold-muted)]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-gold)] mr-1.5 align-middle" />
                  {currentPeriod} — {suggestedGoalType ?? "prestasjon"} anbefalt
                </div>
              )}

              <div className="mt-3">
                <label className="block text-xs font-medium text-[var(--color-gold-muted)] mb-1.5">
                  Notater (valgfritt)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Mål, forberedelse, fokus..."
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)] resize-none placeholder:text-[var(--color-gold-muted)]/40"
                />
              </div>

              <label className="mt-3 flex items-center gap-3 p-3 rounded-xl border border-[var(--color-border)] cursor-pointer hover:border-[var(--color-gold)]/30 transition-colors">
                <input
                  type="checkbox"
                  checked={isRegistered}
                  onChange={(e) => setIsRegistered(e.target.checked)}
                  className="accent-[#22C55E] w-4 h-4"
                />
                <div>
                  <p className="text-sm font-medium text-[var(--color-snow)]">Jeg er påmeldt</p>
                  <p className="text-[10px] text-[var(--color-gold-muted)]">Å lage en plan betyr ikke at du er påmeldt</p>
                </div>
              </label>

              <button
                onClick={handleSave}
                disabled={saving}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-gold)] text-[var(--color-bg-deep)] font-semibold text-sm hover:bg-[var(--color-gold-muted)] transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lagre plan"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
