"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { revalidatePath } from "next/cache";
import { checkAchievements } from "@/lib/portal/achievements/check-achievements";
import type { RoundSource } from "@prisma/client";

export async function getRoundStats(limit = 20) {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  return prisma.roundStats.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: limit,
  });
}

export async function addRoundStats(data: {
  date: string;
  courseName?: string;
  source?: RoundSource;
  totalScore?: number;
  scoreToPar?: number;
  par3Average?: number;
  par4Average?: number;
  par5Average?: number;
  eagleCount?: number;
  birdieCount?: number;
  parCount?: number;
  bogeyCount?: number;
  doublePlusCount?: number;
  bounceBackCount?: number;
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
  if (!user?.id) throw new Error("Ikke innlogget");

  await prisma.roundStats.create({
    data: {
      userId: user.id,
      date: new Date(data.date),
      courseName: data.courseName ?? null,
      source: data.source ?? "MANUAL",
      totalScore: data.totalScore ?? null,
      scoreToPar: data.scoreToPar ?? null,
      par3Average: data.par3Average ?? null,
      par4Average: data.par4Average ?? null,
      par5Average: data.par5Average ?? null,
      eagleCount: data.eagleCount ?? null,
      birdieCount: data.birdieCount ?? null,
      parCount: data.parCount ?? null,
      bogeyCount: data.bogeyCount ?? null,
      doublePlusCount: data.doublePlusCount ?? null,
      bounceBackCount: data.bounceBackCount ?? null,
      sgTotal: data.sgTotal ?? null,
      sgOffTheTee: data.sgOffTheTee ?? null,
      sgApproach: data.sgApproach ?? null,
      sgAroundTheGreen: data.sgAroundTheGreen ?? null,
      sgPutting: data.sgPutting ?? null,
      drivingDistance: data.drivingDistance ?? null,
      fairwaysHit: data.fairwaysHit ?? null,
      fairwaysTotal: data.fairwaysTotal ?? null,
      dispersion: data.dispersion ?? null,
      gir: data.gir ?? null,
      girTotal: data.girTotal ?? null,
      proximityToHole: data.proximityToHole ?? null,
      approach100: data.approach100 ?? null,
      approach150: data.approach150 ?? null,
      approach200: data.approach200 ?? null,
      approach200Plus: data.approach200Plus ?? null,
      upAndDownMade: data.upAndDownMade ?? null,
      upAndDownTotal: data.upAndDownTotal ?? null,
      sandSaveMade: data.sandSaveMade ?? null,
      sandSaveTotal: data.sandSaveTotal ?? null,
      scrambleProximity: data.scrambleProximity ?? null,
      totalPutts: data.totalPutts ?? null,
      puttsPerGir: data.puttsPerGir ?? null,
      onePuttCount: data.onePuttCount ?? null,
      threePuttCount: data.threePuttCount ?? null,
      makePct3ft: data.makePct3ft ?? null,
      makePct6ft: data.makePct6ft ?? null,
      makePct10ft: data.makePct10ft ?? null,
      speedRatio: data.speedRatio ?? null,
      mentalProcessRating: data.mentalProcessRating ?? null,
      notes: data.notes ?? null,
    },
  });

  revalidatePath("/statistikk");
  revalidatePath("/profil");

  // Check achievements in background
  checkAchievements(user.id).catch(() => {});
}

export async function getStatsAggregates() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const rounds = await prisma.roundStats.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 20,
  });

  if (rounds.length === 0) return null;

  const avg = (vals: (number | null)[]) => {
    const valid = vals.filter((v): v is number => v !== null);
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  };

  const last5 = rounds.slice(0, 5);
  const prev5 = rounds.slice(5, 10);

  function trend(recent: (number | null)[], older: (number | null)[]): "up" | "down" | "flat" {
    const a = avg(recent);
    const b = avg(older);
    if (a === null || b === null) return "flat";
    const diff = a - b;
    if (Math.abs(diff) < 0.1) return "flat";
    return diff > 0 ? "up" : "down";
  }

  return {
    roundCount: rounds.length,
    avgScore: avg(rounds.map((r) => r.totalScore)),
    avgSgTotal: avg(rounds.map((r) => r.sgTotal)),
    avgSgOffTheTee: avg(rounds.map((r) => r.sgOffTheTee)),
    avgSgApproach: avg(rounds.map((r) => r.sgApproach)),
    avgSgAroundTheGreen: avg(rounds.map((r) => r.sgAroundTheGreen)),
    avgSgPutting: avg(rounds.map((r) => r.sgPutting)),
    avgDrivingDistance: avg(rounds.map((r) => r.drivingDistance)),
    avgFairwayPct: (() => {
      const hits = rounds.reduce((s, r) => s + (r.fairwaysHit ?? 0), 0);
      const total = rounds.reduce((s, r) => s + (r.fairwaysTotal ?? 0), 0);
      return total > 0 ? Math.round((hits / total) * 100) : null;
    })(),
    avgGirPct: (() => {
      const hits = rounds.reduce((s, r) => s + (r.gir ?? 0), 0);
      const total = rounds.reduce((s, r) => s + (r.girTotal ?? 0), 0);
      return total > 0 ? Math.round((hits / total) * 100) : null;
    })(),
    avgPuttsPerGir: avg(rounds.map((r) => r.puttsPerGir)),
    avgUpAndDownPct: (() => {
      const made = rounds.reduce((s, r) => s + (r.upAndDownMade ?? 0), 0);
      const total = rounds.reduce((s, r) => s + (r.upAndDownTotal ?? 0), 0);
      return total > 0 ? Math.round((made / total) * 100) : null;
    })(),
    scoreTrend: trend(last5.map((r) => r.totalScore), prev5.map((r) => r.totalScore)),
    sgTrend: trend(last5.map((r) => r.sgTotal), prev5.map((r) => r.sgTotal)),
  };
}

export async function getTrainingAreaBreakdown() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const logs = await prisma.trainingLog.findMany({
    where: { userId: user.id },
    select: { focusArea: true, durationMinutes: true },
  });

  const areaMap = new Map<string, { minutes: number; sessions: number }>();

  for (const log of logs) {
    const area = log.focusArea ?? "annet";
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
