"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getTournamentsWithPlans,
  planTournament,
  getTournamentPrep,
  saveTournamentPrep as savePrepAction,
} from "@/modules/tournament-planner";
import { getTourSchedule } from "@/lib/portal/datagolf/client";
import type {
  TournamentWithPlan,
  GoalType,
  PlanLevel,
  TournamentPrepData,
  HoleStrategy,
  PrepChecklist,
} from "@/modules/tournament-planner";
import type { TourScheduleEvent } from "@/lib/portal/datagolf/client";

// ── Hent turneringer med brukerens planer ──────────────────────

export async function getTournaments(options?: {
  from?: Date;
  to?: Date;
}): Promise<TournamentWithPlan[]> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  return getTournamentsWithPlans(supabase, user.id, options);
}

// ── Registrer / oppdater turneringsplan ────────────────────────

export async function registerForTournament(input: {
  tournamentId: string;
  goalType: GoalType;
  planLevel: PlanLevel;
  notes?: string;
  isRegistered?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) return { success: false, error: "Ikke innlogget" };

  const supabase = await createServerSupabase();

  try {
    await planTournament(supabase, {
      studentId: user.id,
      tournamentId: input.tournamentId,
      goalType: input.goalType,
      planLevel: input.planLevel,
      notes: input.notes,
      isRegistered: input.isRegistered,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke lagre plan" };
  }
}

// ── Hent turneringsforberedelse ────────────────────────────────

export async function getTournamentPrepAction(
  tournamentId: string
): Promise<TournamentPrepData | null> {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();
  return getTournamentPrep(supabase, tournamentId, user.id);
}

// ── Lagre turneringsforberedelse ───────────────────────────────

export async function saveTournamentPrepAction(input: {
  tournamentId: string;
  courseStrategy?: HoleStrategy[];
  checklist?: PrepChecklist;
  readinessScore?: number;
  mentalPrepNotes?: string;
  warmupPlan?: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) return { success: false, error: "Ikke innlogget" };

  const supabase = await createServerSupabase();

  try {
    await savePrepAction(supabase, {
      tournamentId: input.tournamentId,
      userId: user.id,
      courseStrategy: input.courseStrategy,
      checklist: input.checklist,
      readinessScore: input.readinessScore,
      mentalPrepNotes: input.mentalPrepNotes,
      warmupPlan: input.warmupPlan,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke lagre forberedelse" };
  }
}

// ── Hent PGA/Euro Tour-kalender fra DataGolf ───────────────────

export async function getProTournaments(
  tour: "pga" | "euro" = "pga"
): Promise<TourScheduleEvent[]> {
  try {
    return await getTourSchedule(tour, undefined, true);
  } catch {
    return [];
  }
}
