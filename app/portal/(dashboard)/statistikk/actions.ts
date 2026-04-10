"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { subDays, subWeeks, startOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type PeriodKey = "7d" | "30d" | "90d" | "1y";

function getDateFromPeriod(period: PeriodKey): Date {
  const now = new Date();
  switch (period) {
    case "7d":
      return subDays(now, 7);
    case "30d":
      return subDays(now, 30);
    case "90d":
      return subDays(now, 90);
    case "1y":
      return subDays(now, 365);
  }
}

export async function getFilteredRoundStats(period: PeriodKey = "30d") {
  const user = await requirePortalUser();
  const since = getDateFromPeriod(period);

  const rounds = await prisma.roundStats.findMany({
    where: {
      userId: user.id,
      date: { gte: since },
    },
    orderBy: { date: "desc" },
  });

  return rounds;
}

export async function getFilteredAggregates(period: PeriodKey = "30d") {
  const user = await requirePortalUser();
  const since = getDateFromPeriod(period);

  const rounds = await prisma.roundStats.findMany({
    where: {
      userId: user.id,
      date: { gte: since },
    },
    orderBy: { date: "desc" },
  });

  if (rounds.length === 0) {
    return null;
  }

  const roundCount = rounds.length;

  const avgScore =
    rounds.filter((r) => r.totalScore !== null).length > 0
      ? rounds.reduce((sum, r) => sum + (r.totalScore ?? 0), 0) /
        rounds.filter((r) => r.totalScore !== null).length
      : null;

  const sgFields = ["sgOffTheTee", "sgApproach", "sgAroundTheGreen", "sgPutting", "sgTotal"] as const;
  const sgAverages: Record<string, number | null> = {};
  for (const field of sgFields) {
    const valid = rounds.filter((r) => r[field] !== null);
    sgAverages[field] =
      valid.length > 0
        ? valid.reduce((sum, r) => sum + (r[field] ?? 0), 0) / valid.length
        : null;
  }

  const drivingValid = rounds.filter((r) => r.drivingDistance !== null);
  const avgDrivingDistance =
    drivingValid.length > 0
      ? drivingValid.reduce((sum, r) => sum + (r.drivingDistance ?? 0), 0) / drivingValid.length
      : null;

  const fairwayValid = rounds.filter((r) => r.fairwaysHit !== null && r.fairwaysTotal !== null);
  const avgFairwayPct =
    fairwayValid.length > 0
      ? (fairwayValid.reduce((sum, r) => sum + (r.fairwaysHit ?? 0), 0) /
          fairwayValid.reduce((sum, r) => sum + (r.fairwaysTotal ?? 0), 0)) *
        100
      : null;

  const girValid = rounds.filter((r) => r.gir !== null && r.girTotal !== null);
  const avgGirPct =
    girValid.length > 0
      ? (girValid.reduce((sum, r) => sum + (r.gir ?? 0), 0) /
          girValid.reduce((sum, r) => sum + (r.girTotal ?? 0), 0)) *
        100
      : null;

  // Determine score trend: compare first half vs second half
  let scoreTrend: "up" | "down" | "flat" = "flat";
  const scoredRounds = rounds.filter((r) => r.totalScore !== null);
  if (scoredRounds.length >= 4) {
    const mid = Math.floor(scoredRounds.length / 2);
    const recentAvg =
      scoredRounds.slice(0, mid).reduce((s, r) => s + (r.totalScore ?? 0), 0) / mid;
    const olderAvg =
      scoredRounds.slice(mid).reduce((s, r) => s + (r.totalScore ?? 0), 0) /
      (scoredRounds.length - mid);
    if (recentAvg < olderAvg - 0.5) scoreTrend = "down";
    else if (recentAvg > olderAvg + 0.5) scoreTrend = "up";
  }

  let sgTrend: "up" | "down" | "flat" = "flat";
  const sgRounds = rounds.filter((r) => r.sgTotal !== null);
  if (sgRounds.length >= 4) {
    const mid = Math.floor(sgRounds.length / 2);
    const recentAvg =
      sgRounds.slice(0, mid).reduce((s, r) => s + (r.sgTotal ?? 0), 0) / mid;
    const olderAvg =
      sgRounds.slice(mid).reduce((s, r) => s + (r.sgTotal ?? 0), 0) /
      (sgRounds.length - mid);
    if (recentAvg > olderAvg + 0.1) sgTrend = "up";
    else if (recentAvg < olderAvg - 0.1) sgTrend = "down";
  }

  return {
    roundCount,
    avgScore,
    avgSgTotal: sgAverages.sgTotal ?? null,
    avgSgOffTheTee: sgAverages.sgOffTheTee ?? null,
    avgSgApproach: sgAverages.sgApproach ?? null,
    avgSgAroundTheGreen: sgAverages.sgAroundTheGreen ?? null,
    avgSgPutting: sgAverages.sgPutting ?? null,
    avgDrivingDistance,
    avgFairwayPct,
    avgGirPct,
    avgPuttsPerGir: null,
    avgUpAndDownPct: null,
    scoreTrend,
    sgTrend,
  };
}

export interface WeeklyTrainingData {
  week: string;
  sessions: number;
  minutes: number;
}

export async function getWeeklyTrainingVolume(period: PeriodKey = "30d"): Promise<WeeklyTrainingData[]> {
  const user = await requirePortalUser();
  const since = getDateFromPeriod(period);

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: since },
    },
    select: {
      date: true,
      durationMinutes: true,
    },
    orderBy: { date: "asc" },
  });

  // Group by week
  const weekMap = new Map<string, { sessions: number; minutes: number }>();

  // Pre-fill weeks so we get empty ones too
  const weeksCount = period === "7d" ? 1 : period === "30d" ? 4 : period === "90d" ? 12 : 52;
  for (let i = weeksCount - 1; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 1 });
    const key = format(weekStart, "d. MMM", { locale: nb });
    weekMap.set(key, { sessions: 0, minutes: 0 });
  }

  for (const log of logs) {
    const weekStart = startOfWeek(new Date(log.date), { weekStartsOn: 1 });
    const key = format(weekStart, "d. MMM", { locale: nb });
    const existing = weekMap.get(key) ?? { sessions: 0, minutes: 0 };
    existing.sessions += 1;
    existing.minutes += log.durationMinutes ?? 0;
    weekMap.set(key, existing);
  }

  return Array.from(weekMap.entries()).map(([week, data]) => ({
    week,
    sessions: data.sessions,
    minutes: data.minutes,
  }));
}

export async function getFilteredBreakdown(period: PeriodKey = "30d") {
  const user = await requirePortalUser();
  const since = getDateFromPeriod(period);

  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: since },
    },
    select: {
      focusArea: true,
      durationMinutes: true,
    },
  });

  const areaMap = new Map<string, { minutes: number; sessions: number }>();
  for (const log of logs) {
    const area = log.focusArea ?? "Annet";
    const existing = areaMap.get(area) ?? { minutes: 0, sessions: 0 };
    existing.minutes += log.durationMinutes ?? 0;
    existing.sessions += 1;
    areaMap.set(area, existing);
  }

  return Array.from(areaMap.entries()).map(([area, data]) => ({
    area,
    minutes: data.minutes,
    sessions: data.sessions,
  }));
}

export async function addRoundStats(data: {
  date: string;
  courseName?: string;
  source?: string;
  totalScore?: number;
  scoreToPar?: number;
  eagleCount?: number;
  birdieCount?: number;
  parCount?: number;
  bogeyCount?: number;
  doublePlusCount?: number;
  bounceBackCount?: number;
  par3Average?: number;
  par4Average?: number;
  par5Average?: number;
  sgTotal?: number;
  sgOffTheTee?: number;
  sgApproach?: number;
  sgAroundTheGreen?: number;
  sgPutting?: number;
  drivingDistance?: number;
  fairwaysHit?: number;
  fairwaysTotal?: number;
  dispersion?: number;
  gir?: number;
  girTotal?: number;
  proximityToHole?: number;
  approach100?: number;
  approach150?: number;
  approach200?: number;
  approach200Plus?: number;
  upAndDownMade?: number;
  upAndDownTotal?: number;
  sandSaveMade?: number;
  sandSaveTotal?: number;
  scrambleProximity?: number;
  totalPutts?: number;
  puttsPerGir?: number;
  onePuttCount?: number;
  threePuttCount?: number;
  makePct3ft?: number;
  makePct6ft?: number;
  makePct10ft?: number;
  speedRatio?: number;
  mentalProcessRating?: number;
  notes?: string;
}) {
  const user = await requirePortalUser();

  await prisma.roundStats.create({
    data: {
      id: nanoid(),
      userId: user.id,
      date: new Date(data.date),
      updatedAt: new Date(),
      ...(data.courseName !== undefined && { courseName: data.courseName }),
      ...(data.totalScore !== undefined && { totalScore: data.totalScore }),
      ...(data.scoreToPar !== undefined && { scoreToPar: data.scoreToPar }),
      ...(data.eagleCount !== undefined && { eagleCount: data.eagleCount }),
      ...(data.birdieCount !== undefined && { birdieCount: data.birdieCount }),
      ...(data.parCount !== undefined && { parCount: data.parCount }),
      ...(data.bogeyCount !== undefined && { bogeyCount: data.bogeyCount }),
      ...(data.doublePlusCount !== undefined && { doublePlusCount: data.doublePlusCount }),
      ...(data.bounceBackCount !== undefined && { bounceBackCount: data.bounceBackCount }),
      ...(data.par3Average !== undefined && { par3Average: data.par3Average }),
      ...(data.par4Average !== undefined && { par4Average: data.par4Average }),
      ...(data.par5Average !== undefined && { par5Average: data.par5Average }),
      ...(data.sgTotal !== undefined && { sgTotal: data.sgTotal }),
      ...(data.sgOffTheTee !== undefined && { sgOffTheTee: data.sgOffTheTee }),
      ...(data.sgApproach !== undefined && { sgApproach: data.sgApproach }),
      ...(data.sgAroundTheGreen !== undefined && { sgAroundTheGreen: data.sgAroundTheGreen }),
      ...(data.sgPutting !== undefined && { sgPutting: data.sgPutting }),
      ...(data.drivingDistance !== undefined && { drivingDistance: data.drivingDistance }),
      ...(data.fairwaysHit !== undefined && { fairwaysHit: data.fairwaysHit }),
      ...(data.fairwaysTotal !== undefined && { fairwaysTotal: data.fairwaysTotal }),
      ...(data.dispersion !== undefined && { dispersion: data.dispersion }),
      ...(data.gir !== undefined && { gir: data.gir }),
      ...(data.girTotal !== undefined && { girTotal: data.girTotal }),
      ...(data.proximityToHole !== undefined && { proximityToHole: data.proximityToHole }),
      ...(data.approach100 !== undefined && { approach100: data.approach100 }),
      ...(data.approach150 !== undefined && { approach150: data.approach150 }),
      ...(data.approach200 !== undefined && { approach200: data.approach200 }),
      ...(data.approach200Plus !== undefined && { approach200Plus: data.approach200Plus }),
      ...(data.upAndDownMade !== undefined && { upAndDownMade: data.upAndDownMade }),
      ...(data.upAndDownTotal !== undefined && { upAndDownTotal: data.upAndDownTotal }),
      ...(data.sandSaveMade !== undefined && { sandSaveMade: data.sandSaveMade }),
      ...(data.sandSaveTotal !== undefined && { sandSaveTotal: data.sandSaveTotal }),
      ...(data.scrambleProximity !== undefined && { scrambleProximity: data.scrambleProximity }),
      ...(data.totalPutts !== undefined && { totalPutts: data.totalPutts }),
      ...(data.puttsPerGir !== undefined && { puttsPerGir: data.puttsPerGir }),
      ...(data.onePuttCount !== undefined && { onePuttCount: data.onePuttCount }),
      ...(data.threePuttCount !== undefined && { threePuttCount: data.threePuttCount }),
      ...(data.makePct3ft !== undefined && { makePct3ft: data.makePct3ft }),
      ...(data.makePct6ft !== undefined && { makePct6ft: data.makePct6ft }),
      ...(data.makePct10ft !== undefined && { makePct10ft: data.makePct10ft }),
      ...(data.speedRatio !== undefined && { speedRatio: data.speedRatio }),
      ...(data.mentalProcessRating !== undefined && { mentalProcessRating: data.mentalProcessRating }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  });

  revalidatePath("/portal/statistikk");
  return { success: true };
}

export async function getLatestHandicap() {
  const user = await requirePortalUser();

  const entry = await prisma.handicapEntry.findFirst({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return entry || null;
}
