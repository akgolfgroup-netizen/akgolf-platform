"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import {
  getPlayerProfile,
  getGapAnalysis,
  getTestHistory,
} from "@/lib/portal/kartlegging";
import { getTrainingIndex } from "@/lib/portal/kartlegging/training-index";
import type {
  PlayerProfile,
  GapAnalysis,
  TrainingIndex,
  TestHistory,
} from "@/lib/portal/kartlegging";

export interface RoiRow {
  label: string;
  hours: number;
  sgDelta: number;
  sgPerHour: number;
}

export interface ForecastPoint {
  weeksFromNow: number;
  baseline: number;
  adjusted: number;
}

export interface MilestoneRow {
  id: string;
  label: string;
  achieved: boolean;
  progress: number;
  progressLabel: string;
}

export interface KartleggingData {
  profile: PlayerProfile | null;
  gap: GapAnalysis | null;
  trainingIndex: TrainingIndex | null;
  testHistory: TestHistory | null;
  roi: RoiRow[];
  forecast: ForecastPoint[];
  milestones: MilestoneRow[];
  consentRequired: boolean;
}

export async function getKartleggingData(): Promise<KartleggingData> {
  const user = await requirePortalUser();

  const [profile, dbUser, trainingIdxCatInput] = await Promise.all([
    getPlayerProfile(user.id),
    prisma.user.findUnique({
      where: { id: user.id },
      select: { dataConsentAt: true, dataConsentScope: true },
    }),
    Promise.resolve(null),
  ]);

  const consentRequired = !dbUser?.dataConsentAt;

  if (!profile) {
    return {
      profile: null,
      gap: null,
      trainingIndex: null,
      testHistory: null,
      roi: [],
      forecast: [],
      milestones: [],
      consentRequired,
    };
  }

  const [gap, trainingIndex, testHistory] = await Promise.all([
    getGapAnalysis(user.id),
    getTrainingIndex(user.id, {
      category: profile.category,
      averageScore: profile.averageScore,
    }),
    getTestHistory(user.id),
  ]);

  const [roi, forecast, milestones] = await Promise.all([
    computeRoi(user.id),
    computeForecast(user.id, profile, trainingIndex, gap),
    computeMilestones(user.id),
  ]);

  return {
    profile,
    gap,
    trainingIndex,
    testHistory,
    roi,
    forecast,
    milestones,
    consentRequired,
  };
}

async function computeRoi(userId: string): Promise<RoiRow[]> {
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const logs = await prisma.trainingLog.findMany({
    where: { userId, date: { gte: ninetyDaysAgo } },
    select: { focusArea: true, durationMinutes: true },
  });

  const buckets: Record<string, { hours: number; label: string }> = {
    "Banegolf 18 hull": { hours: 0, label: "Banegolf 18 hull" },
    "Ferdighet (teknikk)": { hours: 0, label: "Ferdighet (teknikk)" },
    "Kortspill": { hours: 0, label: "Kortspill" },
    "Putting": { hours: 0, label: "Putting" },
    "Fysisk/mental": { hours: 0, label: "Fysisk/mental" },
  };

  for (const log of logs) {
    const hours = (log.durationMinutes ?? 0) / 60;
    const focus = (log.focusArea ?? "").toLowerCase();
    if (focus.includes("bane") || focus.includes("round") || focus.includes("course")) {
      buckets["Banegolf 18 hull"].hours += hours;
    } else if (focus.includes("putt")) {
      buckets["Putting"].hours += hours;
    } else if (
      focus.includes("chip") ||
      focus.includes("pitch") ||
      focus.includes("bunker") ||
      focus.includes("kort")
    ) {
      buckets["Kortspill"].hours += hours;
    } else if (focus.includes("fysisk") || focus.includes("mental")) {
      buckets["Fysisk/mental"].hours += hours;
    } else {
      buckets["Ferdighet (teknikk)"].hours += hours;
    }
  }

  // SG-delta per kategori: bruk en forenklet heuristikk basert på trainingEfficiency
  const usi = await prisma.unifiedSkillIndex.findUnique({
    where: { userId },
    select: { trainingEfficiency: true },
  });
  const eff = usi?.trainingEfficiency ?? 0.05;

  // Grov antagelse: ferdighetstrening gir eff/t, banegolf ca 1/4 av det
  const weights: Record<string, number> = {
    "Banegolf 18 hull": 0.15,
    "Ferdighet (teknikk)": 1.0,
    "Kortspill": 1.0,
    "Putting": 1.0,
    "Fysisk/mental": 0.4,
  };

  return Object.values(buckets)
    .filter((b) => b.hours > 0)
    .map((b) => {
      const perHour = eff * (weights[b.label] ?? 0.5);
      return {
        label: b.label,
        hours: Math.round(b.hours * 10) / 10,
        sgDelta: Math.round(perHour * b.hours * 100) / 100,
        sgPerHour: Math.round(perHour * 1000) / 1000,
      };
    })
    .sort((a, b) => b.sgPerHour - a.sgPerHour);
}

async function computeForecast(
  userId: string,
  profile: PlayerProfile,
  idx: TrainingIndex | null,
  gap: GapAnalysis | null
): Promise<ForecastPoint[]> {
  const usi = profile.totalUsi;
  const eff = idx?.sgPerHourPerMonth ?? 0.05;
  const weeklyHours = idx?.weeklyHours ?? 0;

  // Baseline: fortsett som nå → projeksjon 12 uker
  // Justert: følg anbefalt plan for kategori
  const [recSummerMin] = idx?.recommendedSummer ?? [10, 15];
  const recHours = recSummerMin;

  const points: ForecastPoint[] = [];
  for (let w = 0; w <= 12; w++) {
    const baseline = usi + eff * weeklyHours * (w / 4);
    const adjusted = usi + eff * recHours * (w / 4);
    points.push({
      weeksFromNow: w,
      baseline: Math.round(baseline * 100) / 100,
      adjusted: Math.round(adjusted * 100) / 100,
    });
  }
  return points;
}

async function computeMilestones(userId: string): Promise<MilestoneRow[]> {
  const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const [logs, planCount, completedCount, passedTests] = await Promise.all([
    prisma.trainingLog.findMany({
      where: { userId, date: { gte: twentyEightDaysAgo } },
      orderBy: { date: "desc" },
      select: { focusArea: true, date: true },
    }),
    prisma.trainingPlanSession.count({
      where: {
        TrainingPlanWeek: { TrainingPlan: { studentId: userId } },
        createdAt: { gte: twentyEightDaysAgo },
      },
    }),
    prisma.trainingLog.count({
      where: {
        userId,
        date: { gte: twentyEightDaysAgo },
        planSessionId: { not: null },
      },
    }),
    prisma.testResult.count({
      where: { userId, passed: true, createdAt: { gte: ninetyDaysAgo } },
    }),
  ]);

  // Milepæl: 3 ferdighetsøkter på rad
  let streak = 0;
  for (const log of logs) {
    const focus = (log.focusArea ?? "").toLowerCase();
    const isSkill = !focus.includes("bane") && !focus.includes("round") && !focus.includes("course");
    if (isSkill) streak++;
    else break;
  }

  const adherence = planCount > 0 ? completedCount / planCount : 0;

  return [
    {
      id: "streak-3-skill",
      label: "3 ferdighetsøkter på rad",
      achieved: streak >= 3,
      progress: Math.min(100, (streak / 3) * 100),
      progressLabel: `${Math.min(streak, 3)}/3`,
    },
    {
      id: "plan-adherence-4w",
      label: "Planfølging ≥85% siste 4 uker",
      achieved: adherence >= 0.85,
      progress: Math.min(100, adherence * 100),
      progressLabel: `${Math.round(adherence * 100)}%`,
    },
    {
      id: "test-passed-90d",
      label: "Bestått minst én test siste 90 dager",
      achieved: passedTests >= 1,
      progress: passedTests >= 1 ? 100 : 0,
      progressLabel: passedTests >= 1 ? "Bestått" : "Mangler",
    },
  ];
}

export async function recordDataConsent(input: {
  tests: boolean;
  training: boolean;
  level: boolean;
  coachSharing: boolean;
}): Promise<void> {
  const user = await requirePortalUser();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      dataConsentAt: new Date(),
      dataConsentScope: input,
      updatedAt: new Date(),
    },
  });
  revalidatePath("/portal/kartlegging");
}

export async function withdrawDataConsent(): Promise<void> {
  const user = await requirePortalUser();
  await prisma.user.update({
    where: { id: user.id },
    data: {
      dataConsentAt: null,
      dataConsentScope: { set: null },
      updatedAt: new Date(),
    },
  });
  revalidatePath("/portal/kartlegging");
}
