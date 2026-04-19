import "server-only";
import { prisma } from "@/lib/portal/prisma";
import {
  getSkillLevelByCode,
  getSkillLevelByScore,
} from "@/lib/portal/golf/skill-levels";
import type { TrainingIndex } from "./types";

/**
 * Mapping fra TrainingLog.focusArea til treningsfordeling-buckets.
 */
const FOCUS_TO_BUCKET: Record<string, keyof TrainingIndex["distribution"]> = {
  "on-course": "onCourse",
  course: "onCourse",
  round: "onCourse",
  bane: "onCourse",
  full_swing: "skillTechnical",
  teknikk: "skillTechnical",
  tee: "skillTechnical",
  approach: "skillTechnical",
  iron: "skillTechnical",
  driver: "skillTechnical",
  short_game: "shortGame",
  chipping: "shortGame",
  pitching: "shortGame",
  bunker: "shortGame",
  kortspill: "shortGame",
  putting: "putting",
  physical: "physicalMental",
  fysisk: "physicalMental",
  mental: "physicalMental",
  strength: "physicalMental",
};

function bucketOf(focus: string | null): keyof TrainingIndex["distribution"] {
  if (!focus) return "skillTechnical";
  const normalized = focus.toLowerCase().trim();
  return FOCUS_TO_BUCKET[normalized] ?? "skillTechnical";
}

export async function getTrainingIndex(
  userId: string,
  options?: { category?: string; averageScore?: number | null }
): Promise<TrainingIndex> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const [logs, planned, usi] = await Promise.all([
    prisma.trainingLog.findMany({
      where: { userId, date: { gte: thirtyDaysAgo } },
      select: { durationMinutes: true, focusArea: true, date: true },
    }),
    prisma.trainingPlanSession.count({
      where: {
        TrainingPlanWeek: {
          TrainingPlan: { studentId: userId },
        },
        createdAt: { gte: fourteenDaysAgo, lte: new Date() },
      },
    }),
    prisma.unifiedSkillIndex.findUnique({
      where: { userId },
      select: { trainingEfficiency: true },
    }),
  ]);

  const completed = await prisma.trainingLog.count({
    where: {
      userId,
      date: { gte: fourteenDaysAgo },
      planSessionId: { not: null },
    },
  });

  const distribution = {
    onCourse: 0,
    skillTechnical: 0,
    shortGame: 0,
    putting: 0,
    physicalMental: 0,
  };

  let totalMinutes = 0;
  for (const log of logs) {
    const mins = log.durationMinutes ?? 0;
    totalMinutes += mins;
    distribution[bucketOf(log.focusArea)] += mins;
  }

  const totalMins = totalMinutes || 1;
  const distributionPct = {
    onCourse: distribution.onCourse / totalMins,
    skillTechnical: distribution.skillTechnical / totalMins,
    shortGame: distribution.shortGame / totalMins,
    putting: distribution.putting / totalMins,
    physicalMental: distribution.physicalMental / totalMins,
  };

  const weeklyHours = totalMinutes / 60 / (30 / 7);
  const planAdherencePct = planned > 0 ? (completed / planned) * 100 : 0;

  const level =
    options?.averageScore != null
      ? getSkillLevelByScore(options.averageScore) ?? undefined
      : options?.category
        ? getSkillLevelByCode(options.category) ?? undefined
        : undefined;

  return {
    weeklyHours: Math.round(weeklyHours * 10) / 10,
    recommendedSummer: level?.trainingVolumeSummer ?? [6, 10],
    recommendedWinter: level?.trainingVolumeWinter ?? [4, 8],
    planAdherencePct: Math.round(planAdherencePct),
    sgPerHourPerMonth: usi?.trainingEfficiency ?? 0,
    distribution: distributionPct,
    courseGolfRatio: distributionPct.onCourse,
  };
}
