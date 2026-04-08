"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { endOfISOWeek, isWithinInterval } from "date-fns";

export async function getActivePlan(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;

  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      *,
      TrainingPlanWeek (
        *,
        TrainingPlanSession (*)
      )
    `)
    .eq("studentId", id)
    .eq("isActive", true)
    .single();

  return plan;
}

export async function getCurrentWeekSessions(studentId?: string) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;
  const now = new Date();
  const weekEnd = endOfISOWeek(now);

  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      id,
      TrainingPlanWeek (
        id,
        weekStart,
        TrainingPlanSession (
          *,
          TrainingLog (id)
        )
      )
    `)
    .eq("studentId", id)
    .eq("isActive", true)
    .lte("TrainingPlanWeek.weekStart", weekEnd.toISOString())
    .single();

  if (!plan) return [];

  const weeks = (plan.TrainingPlanWeek as { weekStart: string; TrainingPlanSession: { TrainingLog: { id: string }[] }[] }[]) || [];

  // Find week that contains today
  const currentWeek = weeks.find((w) =>
    isWithinInterval(now, {
      start: new Date(w.weekStart),
      end: endOfISOWeek(new Date(w.weekStart)),
    })
  );

  return currentWeek?.TrainingPlanSession ?? [];
}
