/**
 * TrackMan Plan Matcher
 *
 * Matcher TrackMan-sessions til TechnicalPlan-faser basert på:
 * - Klubb-miks vs fase-område
 * - Avstandsdistribusjon
 * - Tidsnærhet (økt innenfor plan-periode)
 *
 * Returnerer auto-matched fase med confidence score.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { calculateTrackManPhaseMatch } from "./quality-engine";
import type { DataQualityLevel } from "@/lib/portal/training-research/constants";

export interface PlanMatchResult {
  phaseId: string | null;
  phaseTitle: string | null;
  matchScore: number; // 0-100
  matchWarnings: string[];
  autoMatched: boolean;
  dataQuality: DataQualityLevel;
}

/**
 * Finn beste matchende fase for en TrackMan-session.
 */
export async function matchTrackManSessionToPlan(
  userId: string,
  trackManSessionId: string,
  shots: Array<{ club: string; carryDistance: number | null }>
): Promise<PlanMatchResult> {
  const supabase = createServiceClient();

  // 1. Finn aktiv plan for spilleren
  const { data: plan, error: planError } = await supabase
    .from("technical_plans")
    .select("id, phases:technical_plan_phases(id, title, area, status)")
    .eq("player_id", userId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (planError || !plan) {
    return {
      phaseId: null,
      phaseTitle: null,
      matchScore: 0,
      matchWarnings: ["Ingen aktiv plan funnet for spilleren"],
      autoMatched: false,
      dataQuality: "SELF_REPORTED",
    };
  }

  // 2. Vurder hver fase
  const phases = (plan.phases as unknown as Array<{
    id: string;
    title: string;
    area: string;
    status: string;
  }>) ?? [];

  const activePhases = phases.filter((p) => p.status !== "COMPLETED" && p.status !== "SKIPPED");

  if (activePhases.length === 0) {
    return {
      phaseId: null,
      phaseTitle: null,
      matchScore: 0,
      matchWarnings: ["Ingen aktive faser i planen"],
      autoMatched: false,
      dataQuality: "SELF_REPORTED",
    };
  }

  // 3. Score hver fase
  const scored = activePhases.map((phase) => {
    const { score, warnings } = calculateTrackManPhaseMatch({
      trackManShots: shots,
      phaseArea: phase.area,
    });
    return { phase, score, warnings };
  });

  // 4. Velg beste match
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];

  // Auto-match kun ved høy confidence
  const autoMatched = best.score >= 70;

  return {
    phaseId: best.phase.id,
    phaseTitle: best.phase.title,
    matchScore: best.score,
    matchWarnings: best.warnings,
    autoMatched,
    dataQuality: autoMatched ? "TRACKMAN_VERIFIED" : "HYBRID_ESTIMATED",
  };
}

/**
 * Lagre match-resultatet til databasen.
 */
export async function savePlanMatch(params: {
  sessionId: string;
  phaseId: string;
  matchScore: number;
  matchWarnings: string[];
  autoMatched: boolean;
  dataQuality: DataQualityLevel;
}) {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from("technical_plan_sessions")
    .update({
      phase_id: params.phaseId,
      match_score: params.matchScore,
      match_warnings: params.matchWarnings,
      auto_matched: params.autoMatched,
      data_quality: params.dataQuality,
    })
    .eq("id", params.sessionId);

  if (error) throw error;
}

/**
 * Hent myelin-status for alle aktive faser.
 * 30 dager uten TrackMan-data = rød advarsel.
 */
export async function getMyelinStatus(userId: string) {
  const supabase = createServiceClient();

  const { data: phases, error } = await supabase
    .from("technical_plan_phases")
    .select(
      `
      id,
      title,
      status,
      last_session_at,
      plan:plan_id(player_id)
    `
    )
    .eq("plan.player_id", userId)
    .neq("status", "COMPLETED")
    .neq("status", "SKIPPED");

  if (error || !phases) return [];

  const now = Date.now();
  const MYELIN_DECAY_MS = 30 * 24 * 60 * 60 * 1000; // 30 dager

  return phases.map((phase: any) => {
    const lastSession = phase.last_session_at
      ? new Date(phase.last_session_at).getTime()
      : null;
    const daysSince = lastSession
      ? Math.floor((now - lastSession) / (24 * 60 * 60 * 1000))
      : Infinity;

    let status: "green" | "yellow" | "red" | "critical";
    if (daysSince <= 7) status = "green";
    else if (daysSince <= 21) status = "yellow";
    else if (daysSince <= 30) status = "red";
    else status = "critical";

    return {
      phaseId: phase.id,
      phaseTitle: phase.title,
      daysSinceLastSession: daysSince === Infinity ? null : daysSince,
      myelinStatus: status,
      decayPercentage: lastSession
        ? Math.min(100, Math.round((now - lastSession) / MYELIN_DECAY_MS * 100))
        : 100,
    };
  });
}
