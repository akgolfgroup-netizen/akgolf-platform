"use client";

import { useState, useOptimistic } from "react";
import type { PlayerTournamentPlan, PlanLevel, GoalType } from "../types";

interface UseTournamentPlanOptions {
  studentId: string;
  tournamentId: string;
  initialPlan?: PlayerTournamentPlan | null;
  onSuccess?: () => void;
}

export function useTournamentPlan({
  studentId,
  tournamentId,
  initialPlan,
  onSuccess,
}: UseTournamentPlanOptions) {
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<PlayerTournamentPlan | null>(initialPlan ?? null);

  async function save(planLevel: PlanLevel, goalType: GoalType) {
    setSaving(true);

    // Optimistic update
    const optimistic: PlayerTournamentPlan = {
      id: plan?.id ?? "optimistic",
      studentId,
      tournamentId,
      planLevel,
      goalType,
      isRegistered: plan?.isRegistered ?? false,
      createdAt: plan?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    setPlan(optimistic);

    try {
      const res = await fetch("/api/tournament-planner/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, tournamentId, planLevel, goalType, isRegistered: plan?.isRegistered ?? false }),
      });
      if (!res.ok) throw new Error("Lagring feilet");
      const saved = await res.json();
      setPlan(saved);
      onSuccess?.();
    } catch {
      setPlan(initialPlan ?? null);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setSaving(true);
    setPlan(null);
    try {
      await fetch("/api/tournament-planner/plan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, tournamentId }),
      });
      onSuccess?.();
    } catch {
      setPlan(initialPlan ?? null);
    } finally {
      setSaving(false);
    }
  }

  return { plan, saving, save, remove };
}
