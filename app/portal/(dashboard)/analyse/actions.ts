"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { subMonths, startOfDay, subDays } from "date-fns";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function getHandicapEntries(months = 12) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: entries } = await supabase
    .from("HandicapEntry")
    .select("*")
    .eq("userId", user.id)
    .gte("date", subMonths(new Date(), months).toISOString())
    .order("date", { ascending: true });

  return entries || [];
}

export async function addHandicapEntry(data: {
  date: string;
  handicapIndex: number;
  source?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Unauthorized");

  const supabase = await createServerSupabase();

  await supabase.from("HandicapEntry").insert({
    id: nanoid(),
    userId: user.id,
    date: new Date(data.date).toISOString(),
    handicapIndex: data.handicapIndex,
    source: data.source ?? "MANUAL",
  });

  revalidatePath("/analyse");
}

export async function getTrainingLogsForAnalyse(days = 90) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select(`
      *,
      TrainingPlanSession (weekId, focusArea, durationMinutes)
    `)
    .eq("userId", user.id)
    .gte("date", subDays(new Date(), days).toISOString())
    .order("date", { ascending: true });

  return logs || [];
}

export async function getPlanVsActual(weeks = 8) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const from = subDays(new Date(), weeks * 7);

  // Planned sessions from active plan
  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      id,
      TrainingPlanWeek (
        id,
        weekNumber,
        weekStart,
        TrainingPlanSession (
          id,
          TrainingLog (id)
        )
      )
    `)
    .eq("studentId", user.id)
    .eq("isActive", true)
    .gte("TrainingPlanWeek.weekStart", from.toISOString())
    .single();

  if (!plan) return [];

  const weeks_data = (plan.TrainingPlanWeek as { weekNumber: number; weekStart: string; TrainingPlanSession: { TrainingLog: { id: string }[] }[] }[]) || [];

  return weeks_data.map((week) => ({
    weekNumber: week.weekNumber,
    weekStart: new Date(week.weekStart),
    planned: week.TrainingPlanSession.length,
    completed: week.TrainingPlanSession.filter((s) => s.TrainingLog.length > 0).length,
  }));
}

export async function getConsistencyData(days = 84) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();
  const from = subDays(startOfDay(new Date()), days);

  const { data: logs } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", user.id)
    .gte("date", from.toISOString())
    .order("date", { ascending: true });

  return (logs || []).map((l) => new Date(l.date).toISOString().split("T")[0]);
}
