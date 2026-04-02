"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingGoals: JSON.parse(JSON.stringify(data)),
      onboardingCompletedAt: new Date(),
    },
  });

  revalidatePath("/portal");
}

export async function checkOnboardingStatus() {
  const user = await requirePortalUser();
  if (!user?.id) return { completed: false };

  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      onboardingCompletedAt: true,
      onboardingGoals: true,
    },
  });

  return {
    completed: !!userData?.onboardingCompletedAt,
    goals: userData?.onboardingGoals as OnboardingGoals | null,
  };
}

export async function skipOnboarding() {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      onboardingCompletedAt: new Date(),
    },
  });

  revalidatePath("/portal");
}
