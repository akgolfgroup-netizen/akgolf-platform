"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface OnboardingGoals {
  goals: string[];
  trainingFrequency: string;
  handicapGoal?: number;
  currentHandicap?: number;
}

export async function saveOnboardingData(data: OnboardingGoals) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  await supabase
    .from("User")
    .update({
      onboardingGoals: JSON.parse(JSON.stringify(data)),
      onboardingCompletedAt: new Date().toISOString(),
    })
    .eq("id", user.id);

  revalidatePath("/portal");
}

export async function checkOnboardingStatus() {
  const user = await requirePortalUser();
  if (!user?.id) return { completed: false };

  const supabase = await createServerSupabase();

  const { data: userData } = await supabase
    .from("User")
    .select("onboardingCompletedAt, onboardingGoals")
    .eq("id", user.id)
    .single();

  return {
    completed: !!userData?.onboardingCompletedAt,
    goals: userData?.onboardingGoals as OnboardingGoals | null,
  };
}

export async function skipOnboarding() {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  await supabase
    .from("User")
    .update({
      onboardingCompletedAt: new Date().toISOString(),
    })
    .eq("id", user.id);

  revalidatePath("/portal");
}
