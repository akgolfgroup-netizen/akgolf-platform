"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";
import type { TrainingArea, PhaseStatus, TechnicalPlanStatus } from "@/lib/portal/technical-plan/types";

function getSupabase() {
  return createServiceClient();
}

export type TechnicalPlanSummary = {
  id: string;
  title: string;
  status: TechnicalPlanStatus;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  player: { id: string; name: string | null; image: string | null };
  phaseCount: number;
  completedPhases: number;
};

export type PhaseView = {
  id: string;
  phaseCode: string;
  title: string;
  description: string | null;
  order: number;
  drillId: string | null;
  drillName: string | null;
  customName: string | null;
  targetReps: number;
  targetHours: number | null;
  targetBalls: number | null;
  area: TrainingArea;
  environment: string;
  completedReps: number;
  completedHours: number;
  completedBalls: number;
  status: PhaseStatus;
  startDate: Date | null;
  endDate: Date | null;
  sessionCount: number;
};

export type DrillOption = {
  id: string;
  name: string;
  category: TrainingArea;
  difficulty: number;
};

export async function getTechnicalPlansForAdmin(): Promise<TechnicalPlanSummary[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

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
    .order("updated_at", { ascending: false });

  if (error) throw error;

  const plans = (data ?? []).filter((p) =>
    user.role === "ADMIN" ? true : p.coach_id === user.id
  );

  return plans.map((p) => ({
    id: p.id,
    title: p.title,
    status: p.status as TechnicalPlanStatus,
    startDate: p.start_date ? new Date(p.start_date) : null,
    endDate: p.end_date ? new Date(p.end_date) : null,
    createdAt: new Date(p.created_at),
    player: p.player as unknown as { id: string; name: string | null; image: string | null },
    phaseCount: (p.phases as unknown as Array<{ id: string; status: string }>)?.length ?? 0,
    completedPhases:
      (p.phases as unknown as Array<{ id: string; status: string }>)?.filter(
        (ph) => ph.status === "COMPLETED"
      ).length ?? 0,
  }));
}

export async function getTechnicalPlanDetail(planId: string) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("technical_plans")
    .select(
      `
      *,
      player:player_id(id, name, image),
      phases:technical_plan_phases(
        *,
        drill:drill_id(id, name),
        sessions:technical_plan_sessions(*)
      )
    `
    )
    .eq("id", planId)
    .single();

  if (error || !data) return null;

  if (data.coach_id !== user.id && user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }

  return data;
}

export async function createTechnicalPlanAction(data: {
  playerId: string;
  title: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();
  const { data: plan, error } = await supabase
    .from("technical_plans")
    .insert({
      player_id: data.playerId,
      coach_id: user.id,
      title: data.title,
      description: data.description,
      start_date: data.startDate ? new Date(data.startDate).toISOString() : null,
      end_date: data.endDate ? new Date(data.endDate).toISOString() : null,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/teknisk-plan");
  return plan;
}

export async function updateTechnicalPlanAction(
  planId: string,
  data: {
    title?: string;
    description?: string;
    status?: TechnicalPlanStatus;
    startDate?: string;
    endDate?: string;
  }
) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();

  // Verify ownership
  const { data: plan } = await supabase
    .from("technical_plans")
    .select("coach_id")
    .eq("id", planId)
    .single();

  if (!plan) throw new Error("Plan ikke funnet");
  if (plan.coach_id !== user.id && user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }

  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.status !== undefined) update.status = data.status;
  if (data.startDate !== undefined) update.start_date = data.startDate ? new Date(data.startDate).toISOString() : null;
  if (data.endDate !== undefined) update.end_date = data.endDate ? new Date(data.endDate).toISOString() : null;

  const { data: result, error } = await supabase
    .from("technical_plans")
    .update(update)
    .eq("id", planId)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/teknisk-plan");
  return result;
}

export async function deleteTechnicalPlanAction(planId: string) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();

  const { data: plan } = await supabase
    .from("technical_plans")
    .select("coach_id")
    .eq("id", planId)
    .single();

  if (!plan) throw new Error("Plan ikke funnet");
  if (plan.coach_id !== user.id && user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }

  const { error } = await supabase.from("technical_plans").delete().eq("id", planId);
  if (error) throw error;

  revalidatePath("/admin/teknisk-plan");
}

export async function createPhaseAction(data: {
  planId: string;
  phaseCode: string;
  title: string;
  description?: string;
  order: number;
  drillId?: string;
  customName?: string;
  customDescription?: string;
  targetReps: number;
  targetHours?: number;
  targetBalls?: number;
  area: TrainingArea;
  environment: string;
}) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();

  const { data: plan } = await supabase
    .from("technical_plans")
    .select("coach_id")
    .eq("id", data.planId)
    .single();

  if (!plan) throw new Error("Plan ikke funnet");
  if (plan.coach_id !== user.id && user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }

  const { data: phase, error } = await supabase
    .from("technical_plan_phases")
    .insert({
      plan_id: data.planId,
      phase_code: data.phaseCode,
      title: data.title,
      description: data.description,
      order: data.order,
      drill_id: data.drillId ?? null,
      custom_name: data.customName,
      custom_description: data.customDescription,
      target_reps: data.targetReps,
      target_hours: data.targetHours,
      target_balls: data.targetBalls,
      area: data.area,
      environment: data.environment,
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/teknisk-plan");
  return phase;
}

export async function updatePhaseAction(
  phaseId: string,
  data: {
    title?: string;
    description?: string;
    order?: number;
    drillId?: string;
    customName?: string;
    customDescription?: string;
    targetReps?: number;
    targetHours?: number;
    targetBalls?: number;
    area?: TrainingArea;
    environment?: string;
    status?: PhaseStatus;
  }
) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();

  const { data: phase } = await supabase
    .from("technical_plan_phases")
    .select("plan:plan_id(coach_id)")
    .eq("id", phaseId)
    .single();

  if (!phase) throw new Error("Fase ikke funnet");

  const coachId = (phase.plan as unknown as { coach_id: string }[])?.[0]?.coach_id;
  if (coachId !== user.id && user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }

  const update: Record<string, unknown> = {};
  if (data.title !== undefined) update.title = data.title;
  if (data.description !== undefined) update.description = data.description;
  if (data.order !== undefined) update.order = data.order;
  if (data.drillId !== undefined) update.drill_id = data.drillId;
  if (data.customName !== undefined) update.custom_name = data.customName;
  if (data.customDescription !== undefined) update.custom_description = data.customDescription;
  if (data.targetReps !== undefined) update.target_reps = data.targetReps;
  if (data.targetHours !== undefined) update.target_hours = data.targetHours;
  if (data.targetBalls !== undefined) update.target_balls = data.targetBalls;
  if (data.area !== undefined) update.area = data.area;
  if (data.environment !== undefined) update.environment = data.environment;
  if (data.status !== undefined) update.status = data.status;

  const { data: result, error } = await supabase
    .from("technical_plan_phases")
    .update(update)
    .eq("id", phaseId)
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/teknisk-plan");
  return result;
}

export async function deletePhaseAction(phaseId: string) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();

  const { data: phase } = await supabase
    .from("technical_plan_phases")
    .select("plan:plan_id(coach_id)")
    .eq("id", phaseId)
    .single();

  if (!phase) throw new Error("Fase ikke funnet");

  const coachId = (phase.plan as unknown as { coach_id: string }[])?.[0]?.coach_id;
  if (coachId !== user.id && user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }

  const { error } = await supabase.from("technical_plan_phases").delete().eq("id", phaseId);
  if (error) throw error;

  revalidatePath("/admin/teknisk-plan");
}

export async function getDrillOptions(): Promise<DrillOption[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("drills")
    .select("id, name, category, difficulty")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return (data ?? []) as DrillOption[];
}

export async function getPlayerOptions() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("User")
    .select("id, name, email")
    .eq("role", "STUDENT")
    .eq("isActive", true)
    .order("name", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
