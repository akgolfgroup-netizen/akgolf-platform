"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";
import { startOfISOWeek, addWeeks, format } from "date-fns";
import type { ViewId } from "@/lib/portal/views/registry";
import { initializeDefaultConsents } from "@/lib/portal/consent/service";

export interface OnboardingGoals {
  goals: string[];
  trainingFrequency: string;
  handicapGoal?: number;
  currentHandicap?: number;
  defaultView?: ViewId;
  age?: number;
  weeklyHours?: number;
  homeCourseName?: string;
  coldStartWeakness?: string;
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
      handicap: data.currentHandicap ?? null,
      ageYears: data.age ?? null,
      weeklyTrainingHours: data.weeklyHours ?? null,
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

  // Initialize default GDPR consents
  try {
    await initializeDefaultConsents(user.id);
  } catch (e) {
    console.error("Failed to initialize consents:", e);
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

// ── Rask onboarding + første plan ──────────────────────────────────

export interface QuickOnboardInput {
  handicap: number;
  goalCategory: "handicap" | "compete" | "fun";
}

export async function quickOnboardAndGeneratePlan(
  input: QuickOnboardInput
): Promise<{ success: boolean; error?: string; planId?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();
  const now = new Date();

  // 1. Lagre HCP
  await supabase.from("HandicapEntry").insert({
    id: nanoid(),
    userId: user.id,
    date: now.toISOString().slice(0, 10),
    handicapIndex: input.handicap,
    source: "ONBOARDING",
  });

  // 2. Lagre onboarding-data + marker som fullført
  const frequency =
    input.goalCategory === "compete" ? "5+" : input.goalCategory === "handicap" ? "3-4" : "1-2";

  await supabase
    .from("User")
    .update({
      onboardingGoals: {
        goals: [input.goalCategory],
        trainingFrequency: frequency,
        currentHandicap: input.handicap,
      },
      onboardingCompletedAt: now.toISOString(),
    })
    .eq("id", user.id);

  // 3. Generer første treningsplan
  try {
    const planId = nanoid();
    const weekStart = startOfISOWeek(now);
    const weekStartStr = weekStart.toISOString().slice(0, 10);

    // Deaktiver eksisterende aktive planer
    await supabase
      .from("TrainingPlan")
      .update({ isActive: false })
      .eq("studentId", user.id)
      .eq("isActive", true);

    // Opprett plan
    await supabase.from("TrainingPlan").insert({
      id: planId,
      studentId: user.id,
      createdById: user.id,
      title: "Min første plan",
      description: `Generert basert på mål: ${input.goalCategory}`,
      periodType: "PREPARATION",
      startDate: weekStartStr,
      endDate: addWeeks(weekStart, 4).toISOString().slice(0, 10),
      isActive: true,
      aiGenerated: false,
      updatedAt: now.toISOString(),
    });

    // Opprett uke
    const weekId = nanoid();
    await supabase.from("TrainingPlanWeek").insert({
      id: weekId,
      planId,
      weekNumber: parseInt(format(now, "I")),
      weekStart: weekStartStr,
      focus: "Introduksjon og basis",
    });

    // Økter basert på mål-kategori
    const sessions = getStarterSessions(input.goalCategory, weekStartStr);
    await supabase.from("TrainingPlanSession").insert(
      sessions.map((s, idx) => ({
        id: nanoid(),
        weekId,
        dayOfWeek: s.dayOfWeek,
        title: s.title,
        description: s.description,
        durationMinutes: s.durationMinutes,
        focusArea: s.focusArea,
        exercises: [],
        sortOrder: idx,
      }))
    );

    // Initialize default GDPR consents
    try {
      await initializeDefaultConsents(user.id);
    } catch (e) {
      console.error("Failed to initialize consents:", e);
    }

    revalidatePath("/portal");
    revalidatePath("/portal/treningsplan");
    return { success: true, planId };
  } catch (err) {
    console.error("quickOnboardAndGeneratePlan error:", err);
    return { success: false, error: "Kunne ikke generere plan. Prøv igjen." };
  }
}

function getStarterSessions(
  goal: "handicap" | "compete" | "fun",
  _weekStart: string
): Array<{
  dayOfWeek: number;
  title: string;
  description: string;
  durationMinutes: number;
  focusArea: string;
}> {
  switch (goal) {
    case "compete":
      return [
        { dayOfWeek: 1, title: "Teknikk — Driver & jern", description: "Fokus på konsistens og nøyaktighet", durationMinutes: 90, focusArea: "TEK" },
        { dayOfWeek: 2, title: "Kortspill & putting", description: "Scramble-øvelser og putt-teknikk", durationMinutes: 60, focusArea: "SLAG" },
        { dayOfWeek: 4, title: "Fysisk trening", description: "Styrke, mobilitet og eksplosivitet", durationMinutes: 60, focusArea: "FYS" },
        { dayOfWeek: 6, title: "Banespill 9 hull", description: "Strategi og course management", durationMinutes: 120, focusArea: "SPILL" },
      ];
    case "handicap":
      return [
        { dayOfWeek: 1, title: "Teknikk — Full sving", description: "Grunnleggende svingteknikk med fokus på kontakt", durationMinutes: 60, focusArea: "TEK" },
        { dayOfWeek: 3, title: "Nærspill & chip", description: "Chipping og pitching rundt green", durationMinutes: 45, focusArea: "SLAG" },
        { dayOfWeek: 5, title: "Putting", description: "Putt-teknikk og green-reading", durationMinutes: 45, focusArea: "SLAG" },
        { dayOfWeek: 6, title: "Banespill", description: "9 hull med fokus på strategi", durationMinutes: 90, focusArea: "SPILL" },
      ];
    case "fun":
    default:
      return [
        { dayOfWeek: 2, title: "Range-session", description: "Lek og variasjon med ulike klubber", durationMinutes: 60, focusArea: "TEK" },
        { dayOfWeek: 5, title: "Kortspill på banen", description: "Chipping og putting i spillform", durationMinutes: 45, focusArea: "SLAG" },
        { dayOfWeek: 7, title: "Sosial runde", description: "9 eller 18 hull med venner", durationMinutes: 120, focusArea: "SPILL" },
      ];
  }
}
