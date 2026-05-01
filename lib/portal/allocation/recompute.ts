// VERIFY: Replanlegging — sjekker om diff ≥10% for regenerering
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md Fase 8

import { prisma } from "@/lib/portal/prisma";
import { computeAllocation } from "./engine";
import type { AllocationInput } from "./engine";

export async function shouldRecompute(userId: string): Promise<{
  should: boolean;
  reason?: string;
  diffPercent?: number;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      ageYears: true,
      weeklyTrainingHours: true,
      playerType: true,
      onboardingGoals: true,
    },
  });

  if (!user) return { should: false };

  const latestAlloc = await prisma.playerAllocation.findFirst({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });

  if (!latestAlloc) {
    return { should: true, reason: "Ingen eksisterende allokering" };
  }

  // TODO: Sjekk om HCP har endret seg (HCP lagres i HandicapEntry)

  // Sjekk om weeklyHours har endret seg
  const hoursDiff = Math.abs((user.weeklyTrainingHours ?? 0) - latestAlloc.weeklyHours);
  if (hoursDiff >= 2) {
    return { should: true, reason: `Timer/uke endret med ${hoursDiff}`, diffPercent: hoursDiff * 10 };
  }

  // Beregn ny allokering og sammenlign
  const input: AllocationInput = {
    userId: user.id,
    hcp: 15, // TODO: Hent fra HandicapEntry
    weeklyHours: user.weeklyTrainingHours ?? 3,
    age: user.ageYears ?? 30,
    goal: user.playerType ?? "PERFORMANCE",
    planHorizonWeeks: 4,
    weakestArea: Array.isArray(user.onboardingGoals) && (user.onboardingGoals as string[]).length > 0
      ? (user.onboardingGoals as string[])[0]
      : undefined,
  };

  const newAlloc = computeAllocation(input);
  const oldWeeks = (latestAlloc.weeks as unknown as Array<{ allocation: Record<string, number> }>) ?? [];

  if (oldWeeks.length > 0 && newAlloc.weeks.length > 0) {
    const old = oldWeeks[0].allocation as Record<string, number>;
    const neu = newAlloc.weeks[0].allocation;
    const diff = Math.abs((old.fysisk ?? 0) - neu.fysisk) +
      Math.abs((old.teknikk ?? 0) - neu.teknikk) +
      Math.abs((old.slag ?? 0) - Object.values(neu.slag).reduce((a,b)=>a+b,0)) +
      Math.abs((old.spill ?? 0) - Object.values(neu.spill).reduce((a,b)=>a+b,0)) +
      Math.abs((old.mental ?? 0) - neu.mental);

    if (diff >= 10) {
      return { should: true, reason: `Allokeringsdiff = ${diff}%`, diffPercent: diff };
    }
  }

  return { should: false };
}
