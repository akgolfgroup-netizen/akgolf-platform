"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import type { ViewId } from "@/lib/portal/views/registry";

export interface OnboardingGoals {
  goals: string[];
  trainingFrequency: string;
  handicapGoal?: number;
  currentHandicap?: number;
  defaultView?: ViewId;
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

  // Lagre default view i UserPreferences
  if (data.defaultView) {
    const existing = await prisma.userPreferences.findUnique({
      where: { userId: user.id },
    });

    const newLayout = { "portal-dashboard": data.defaultView };

    if (existing) {
      const current =
        typeof existing.defaultViewPerScreen === "object" &&
        existing.defaultViewPerScreen !== null
          ? (existing.defaultViewPerScreen as Record<string, ViewId>)
          : {};

      await prisma.userPreferences.update({
        where: { userId: user.id },
        data: {
          defaultViewPerScreen: { ...current, ...newLayout },
        },
      });
    } else {
      await prisma.userPreferences.create({
        data: {
          userId: user.id,
          defaultViewPerScreen: newLayout,
        },
      });
    }
  }

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
