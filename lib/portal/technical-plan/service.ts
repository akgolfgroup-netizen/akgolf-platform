/**
 * Technical Plan Service — Supabase-versjon
 * Server-only — bruker service client for å omgå RLS.
 * Kalles fra admin API (coach) og portal API (spiller).
 */

import { createServiceClient } from "@/lib/supabase/server";
import type {
  TechnicalPlanStatus,
  PhaseStatus,
  TrainingArea,
} from "./types";

function getSupabase() {
  return createServiceClient();
}

// ─── Types ───────────────────────────────────────────────────────────

export interface CreateTechnicalPlanInput {
  playerId: string;
  coachId: string;
  title: string;
  description?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface CreatePhaseInput {
  planId: string;
  phaseCode: string;
  title: string;
  description?: string | null;
  order: number;
  drillId?: string | null;
  customName?: string | null;
  customDescription?: string | null;
  customMediaUrls?: string[];
  targetReps: number;
  targetHours?: number | null;
  targetBalls?: number | null;
  area: TrainingArea;
  environment: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface UpdatePhaseInput {
  title?: string;
  description?: string | null;
  order?: number;
  drillId?: string | null;
  customName?: string | null;
  customDescription?: string | null;
  customMediaUrls?: string[];
  targetReps?: number;
  targetHours?: number | null;
  targetBalls?: number | null;
  area?: TrainingArea;
  environment?: string;
  status?: PhaseStatus;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface LogProgressInput {
  phaseId: string;
  repsDone?: number;
  hoursDone?: number;
  ballsDone?: number | null;
  qualityScore?: number | null;
  notes?: string | null;
  trainingLogId?: string | null;
}

// ─── Queries ─────────────────────────────────────────────────────────

export async function listTechnicalPlansForPlayer(playerId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .select(
      `
      *,
      phases:technical_plan_phases(
        id, phase_code, title, "order", status, area,
        target_reps, target_hours, target_balls,
        completed_reps, completed_hours, completed_balls, environment
      ),
      coach:coach_id(id, name, image)
    `
    )
    .eq("player_id", playerId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function listTechnicalPlansForCoach(coachId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .select(
      `
      *,
      player:player_id(id, name, image),
      phases:technical_plan_phases(id, status)
    `
    )
    .eq("coach_id", coachId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getTechnicalPlanById(id: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .select(
      `
      *,
      phases:technical_plan_phases(
        *,
        drill:drill_id(id, name, description, difficulty, media_urls, tags),
        sessions:technical_plan_sessions(*)
      ),
      player:player_id(id, name, image),
      coach:coach_id(id, name, image)
    `
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// ─── Mutations ───────────────────────────────────────────────────────

export async function createTechnicalPlan(input: CreateTechnicalPlanInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .insert({
      player_id: input.playerId,
      coach_id: input.coachId,
      title: input.title,
      description: input.description,
      start_date: input.startDate?.toISOString() ?? null,
      end_date: input.endDate?.toISOString() ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTechnicalPlan(
  id: string,
  data: Partial<CreateTechnicalPlanInput> & { status?: TechnicalPlanStatus }
) {
  const supabase = getSupabase();
  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.startDate !== undefined) update.start_date = data.startDate?.toISOString() ?? null;
  if (data.endDate !== undefined) update.end_date = data.endDate?.toISOString() ?? null;
  if (data.status !== undefined) update.status = data.status;

  const { data: result, error } = await supabase
    .from("technical_plans")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deleteTechnicalPlan(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("technical_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function createPhase(input: CreatePhaseInput) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plan_phases")
    .insert({
      plan_id: input.planId,
      phase_code: input.phaseCode,
      title: input.title,
      description: input.description,
      order: input.order,
      drill_id: input.drillId ?? null,
      custom_name: input.customName,
      custom_description: input.customDescription,
      custom_media_urls: input.customMediaUrls ?? [],
      target_reps: input.targetReps,
      target_hours: input.targetHours,
      target_balls: input.targetBalls,
      area: input.area,
      environment: input.environment,
      start_date: input.startDate?.toISOString() ?? null,
      end_date: input.endDate?.toISOString() ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePhase(id: string, input: UpdatePhaseInput) {
  const supabase = getSupabase();
  const update: Record<string, unknown> = {};
  if (input.title !== undefined) update.title = input.title;
  if (input.description !== undefined) update.description = input.description;
  if (input.order !== undefined) update.order = input.order;
  if (input.drillId !== undefined) update.drill_id = input.drillId;
  if (input.customName !== undefined) update.custom_name = input.customName;
  if (input.customDescription !== undefined) update.custom_description = input.customDescription;
  if (input.customMediaUrls !== undefined) update.custom_media_urls = input.customMediaUrls;
  if (input.targetReps !== undefined) update.target_reps = input.targetReps;
  if (input.targetHours !== undefined) update.target_hours = input.targetHours;
  if (input.targetBalls !== undefined) update.target_balls = input.targetBalls;
  if (input.area !== undefined) update.area = input.area;
  if (input.environment !== undefined) update.environment = input.environment;
  if (input.status !== undefined) update.status = input.status;
  if (input.startDate !== undefined) update.start_date = input.startDate?.toISOString() ?? null;
  if (input.endDate !== undefined) update.end_date = input.endDate?.toISOString() ?? null;

  const { data, error } = await supabase
    .from("technical_plan_phases")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePhase(id: string) {
  const supabase = getSupabase();
  const { error } = await supabase.from("technical_plan_phases").delete().eq("id", id);
  if (error) throw error;
}

export async function logProgress(input: LogProgressInput) {
  const supabase = getSupabase();

  // Insert session log
  const { data: session, error } = await supabase
    .from("technical_plan_sessions")
    .insert({
      phase_id: input.phaseId,
      training_log_id: input.trainingLogId ?? null,
      reps_done: input.repsDone ?? 0,
      hours_done: input.hoursDone ?? 0,
      balls_done: input.ballsDone,
      quality_score: input.qualityScore,
      notes: input.notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Recalculate aggregated progress
  const { data: agg } = await supabase
    .from("technical_plan_sessions")
    .select("reps_done, hours_done, balls_done")
    .eq("phase_id", input.phaseId);

  const completedReps = agg?.reduce((sum, r) => sum + (r.reps_done ?? 0), 0) ?? 0;
  const completedHours = agg?.reduce((sum, r) => sum + (r.hours_done ?? 0), 0) ?? 0;
  const completedBalls = agg?.reduce((sum, r) => sum + (r.balls_done ?? 0), 0) ?? 0;

  // Get phase targets
  const { data: phase } = await supabase
    .from("technical_plan_phases")
    .select("target_reps, target_hours, target_balls")
    .eq("id", input.phaseId)
    .single();

  const isCompleted =
    phase && phase.target_reps > 0 && completedReps >= phase.target_reps;

  const { data: updatedPhase } = await supabase
    .from("technical_plan_phases")
    .update({
      completed_reps: completedReps,
      completed_hours: completedHours,
      completed_balls: completedBalls,
      status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      ...(isCompleted ? { end_date: new Date().toISOString() } : {}),
    })
    .eq("id", input.phaseId)
    .select()
    .single();

  return session;
}

export async function verifyProgress(
  sessionId: string,
  coachNote?: string | null
) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plan_sessions")
    .update({
      verified_by_coach: true,
      verified_at: new Date().toISOString(),
      coach_note: coachNote ?? null,
    })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ─── Drill helpers ───────────────────────────────────────────────────

export async function listDrills(area?: TrainingArea) {
  const supabase = getSupabase();
  let query = supabase
    .from("drills")
    .select("*")
    .eq("is_active", true)
    .order("difficulty", { ascending: true });

  if (area) {
    query = query.eq("category", area);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createDrill(data: {
  name: string;
  description?: string | null;
  category: TrainingArea;
  difficulty: number;
  recommendedReps?: number | null;
  recommendedSets?: number | null;
  mediaUrls?: string[];
  tags?: string[];
  createdBy: string;
}) {
  const supabase = getSupabase();
  const { data: result, error } = await supabase
    .from("drills")
    .insert({
      name: data.name,
      description: data.description,
      category: data.category,
      difficulty: data.difficulty,
      recommended_reps: data.recommendedReps,
      recommended_sets: data.recommendedSets,
      media_urls: data.mediaUrls ?? [],
      tags: data.tags ?? [],
      created_by: data.createdBy,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

// ─── TrackMan-integration helpers ────────────────────────────────────

export interface CreatePlanSessionInput {
  phaseId: string;
  repsDone?: number;
  hoursDone?: number;
  ballsDone?: number;
  qualityScore?: number | null;
  dataQuality?: string;
  matchScore?: number;
  matchWarnings?: string[];
  autoMatched?: boolean;
  notes?: string | null;
  trainingLogId?: string | null;
}

export async function createPlanSessionWithMatch(input: CreatePlanSessionInput) {
  const supabase = getSupabase();

  const { data: session, error } = await supabase
    .from("technical_plan_sessions")
    .insert({
      phase_id: input.phaseId,
      training_log_id: input.trainingLogId ?? null,
      reps_done: input.repsDone ?? 0,
      hours_done: input.hoursDone ?? 0,
      balls_done: input.ballsDone,
      quality_score: input.qualityScore,
      data_quality: input.dataQuality ?? "SELF_REPORTED",
      match_score: input.matchScore ?? null,
      match_warnings: input.matchWarnings ?? [],
      auto_matched: input.autoMatched ?? false,
      notes: input.notes,
    })
    .select()
    .single();

  if (error) throw error;

  // Update phase aggregates and last_session_at
  const { data: agg } = await supabase
    .from("technical_plan_sessions")
    .select("reps_done, hours_done, balls_done")
    .eq("phase_id", input.phaseId);

  const completedReps = agg?.reduce((sum, r) => sum + (r.reps_done ?? 0), 0) ?? 0;
  const completedHours = agg?.reduce((sum, r) => sum + (r.hours_done ?? 0), 0) ?? 0;
  const completedBalls = agg?.reduce((sum, r) => sum + (r.balls_done ?? 0), 0) ?? 0;

  const { data: phase } = await supabase
    .from("technical_plan_phases")
    .select("target_reps, target_hours, target_balls")
    .eq("id", input.phaseId)
    .single();

  const isCompleted =
    phase && phase.target_reps > 0 && completedReps >= phase.target_reps;

  await supabase
    .from("technical_plan_phases")
    .update({
      completed_reps: completedReps,
      completed_hours: completedHours,
      completed_balls: completedBalls,
      status: isCompleted ? "COMPLETED" : "IN_PROGRESS",
      last_session_at: new Date().toISOString(),
      ...(isCompleted ? { end_date: new Date().toISOString() } : {}),
    })
    .eq("id", input.phaseId);

  return session;
}

export async function getActivePlanForPlayer(playerId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .select(
      `
      *,
      phases:technical_plan_phases(*)
    `
    )
    .eq("player_id", playerId)
    .eq("status", "ACTIVE")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data ?? null;
}

export async function getPlanWithPhasesAndSessions(planId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .select(
      `
      *,
      phases:technical_plan_phases(
        *,
        sessions:technical_plan_sessions(*)
      )
    `
    )
    .eq("id", planId)
    .single();

  if (error) throw error;
  return data;
}
