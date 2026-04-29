"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { createServerSupabase } from "@/lib/supabase/server";
import { subDays, subWeeks, startOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export type PeriodKey = "7d" | "30d" | "90d" | "season" | "1y";

function getDateFromPeriod(period: PeriodKey): Date {
  const now = new Date();
  switch (period) {
    case "7d":
      return subDays(now, 7);
    case "30d":
      return subDays(now, 30);
    case "90d":
      return subDays(now, 90);
    case "season":
      // Golfsesong i Norge: 1. april - 31. oktober
      // Hvis vi er for april, bruk forrige ars sesongstart
      return new Date(now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1, 3, 1);
    case "1y":
      return subDays(now, 365);
  }
}

// Kun feltene siden + aggregat trenger — RoundStats har 50+ kolonner
// (inkl. JSON-blobs) som vi ikke leser i UI/aggregat. Holder payload smal.
const ROUND_STATS_SELECT = {
  id: true,
  date: true,
  courseName: true,
  totalScore: true,
  scoreToPar: true,
  sgTotal: true,
  sgOffTheTee: true,
  sgApproach: true,
  sgAroundTheGreen: true,
  sgPutting: true,
  drivingDistance: true,
  fairwaysHit: true,
  fairwaysTotal: true,
  gir: true,
  girTotal: true,
  totalPutts: true,
} as const;

const ROUND_STATS_TAKE = 200;

export type RoundStatsRow = {
  id: string;
  date: Date;
  courseName: string | null;
  totalScore: number | null;
  scoreToPar: number | null;
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
  drivingDistance: number | null;
  fairwaysHit: number | null;
  fairwaysTotal: number | null;
  gir: number | null;
  girTotal: number | null;
  totalPutts: number | null;
};

export async function getFilteredRoundStats(period: PeriodKey = "30d"): Promise<RoundStatsRow[]> {
  const user = await requirePortalUser();
  const since = getDateFromPeriod(period);

  return prisma.roundStats.findMany({
    where: {
      userId: user.id,
      date: { gte: since },
    },
    orderBy: { date: "desc" },
    take: ROUND_STATS_TAKE,
    select: ROUND_STATS_SELECT,
  });
}

export async function computeAggregates(rounds: RoundStatsRow[]) {
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

// Bakoverkompatibel wrapper — laster rounds én gang og deriverer aggregater.
// Brukes når en kaller fortsatt vil ha begge i samme kall.
export async function getFilteredAggregates(period: PeriodKey = "30d") {
  const rounds = await getFilteredRoundStats(period);
  return computeAggregates(rounds);
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
  const weeksCount = period === "7d" ? 1 : period === "30d" ? 4 : period === "90d" ? 12 : period === "season" ? 30 : 52;
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

export interface HcpHistoryPoint {
  date: string; // ISO date
  hcp: number;
}

export interface HcpForecastData {
  history: HcpHistoryPoint[];
  currentHcp: number | null;
  predicted30d: number | null;
  predicted90d: number | null;
  ci30d: { lower: number; upper: number } | null;
  ci90d: { lower: number; upper: number } | null;
  trainingMinutes30d: number;
  trainingSessions30d: number;
  trendSlopePerWeek: number; // HCP change per week (negative = improving)
}

export async function getHcpForecast(): Promise<HcpForecastData> {
  const user = await requirePortalUser();
  const since = subDays(new Date(), 180);

  const [snapshots, handicapEntries, trainingLogs] = await Promise.all([
    prisma.unifiedSkillSnapshot.findMany({
      where: { userId: user.id, createdAt: { gte: since } },
      orderBy: { createdAt: "asc" },
      select: { estimatedHandicap: true, createdAt: true },
    }),
    prisma.handicapEntry.findMany({
      where: { userId: user.id, date: { gte: since } },
      orderBy: { date: "asc" },
      select: { handicapIndex: true, date: true },
    }),
    prisma.trainingLog.findMany({
      where: { userId: user.id, date: { gte: subDays(new Date(), 30) } },
      select: { durationMinutes: true },
    }),
  ]);

  // Prefer snapshots when available, else handicap-entries
  const historySource: HcpHistoryPoint[] =
    snapshots.length >= 3
      ? snapshots.map((s) => ({
          date: s.createdAt.toISOString(),
          hcp: s.estimatedHandicap,
        }))
      : handicapEntries.map((e) => ({
          date: e.date.toISOString(),
          hcp: e.handicapIndex,
        }));

  const currentHcp = historySource.length > 0 ? historySource[historySource.length - 1].hcp : null;

  // Forecast via Kalman (reuse logic)
  const { forecastHcpFromSnapshots } = await import("@/lib/portal/usi/kalman-filter");
  const forecast = forecastHcpFromSnapshots(
    historySource.map((p) => ({
      estimatedHandicap: p.hcp,
      createdAt: new Date(p.date),
    }))
  );

  // CI: approximate ±1 SD growing with sqrt(days). Base SD = 0.5 HCP.
  const baseSd = 0.5;
  const ci30d =
    forecast.predictedHcp30d != null
      ? {
          lower: Math.max(0, forecast.predictedHcp30d - baseSd * Math.sqrt(30 / 30)),
          upper: forecast.predictedHcp30d + baseSd * Math.sqrt(30 / 30),
        }
      : null;
  const ci90d =
    forecast.predictedHcp90d != null
      ? {
          lower: Math.max(0, forecast.predictedHcp90d - baseSd * Math.sqrt(90 / 30)),
          upper: forecast.predictedHcp90d + baseSd * Math.sqrt(90 / 30),
        }
      : null;

  const trainingMinutes30d = trainingLogs.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
  const trainingSessions30d = trainingLogs.length;

  // trendSlope is per-snapshot interval (~1 day) → convert to per-week
  const trendSlopePerWeek = forecast.trendSlope * 7;

  return {
    history: historySource,
    currentHcp,
    predicted30d: forecast.predictedHcp30d,
    predicted90d: forecast.predictedHcp90d,
    ci30d,
    ci90d,
    trainingMinutes30d,
    trainingSessions30d,
    trendSlopePerWeek,
  };
}

export type GolfProfileSummary = {
  roundCount30d: number;
  avgScore30d: number | null;
  scoreTrend: "up" | "down" | "flat";
  handicap: number | null;
  trainingSessions30d: number;
  trainingMinutes30d: number;
  streak: number;
  topFocusAreas: string[];
  trackManBestCarry: number | null;
  trackManBestBallSpeed: number | null;
  combinedInsights: string[];
};

// Maks antall TrainingLog-rader hentet for streak-beregning. 365 dager dekker
// realistisk streak-rekord; uten cap kan power-users laste tusenvis av rader.
const STREAK_FETCH_LIMIT = 365;

async function calculateStreak(userId: string): Promise<number> {
  const supabase = await createServerSupabase();
  const { data: logs } = await supabase
    .from("TrainingLog")
    .select("date")
    .eq("userId", userId)
    .order("date", { ascending: false })
    .limit(STREAK_FETCH_LIMIT);

  if (!logs || logs.length === 0) return 0;

  const uniqueDates = [
    ...new Set(logs.map((l) => new Date(l.date).toISOString().split("T")[0])),
  ].sort().reverse();

  const todayStr = new Date().toISOString().split("T")[0];
  const yesterdayStr = subDays(new Date(), 1).toISOString().split("T")[0];

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export async function getGolfProfileSummary(): Promise<GolfProfileSummary> {
  const user = await requirePortalUser();
  const since30d = subDays(new Date(), 30);

  const [rounds, trainingLogs, handicapEntry, trackManBest] = await Promise.all([
    prisma.roundStats.findMany({
      where: { userId: user.id, date: { gte: since30d } },
      orderBy: { date: "desc" },
    }),
    prisma.trainingLog.findMany({
      where: { userId: user.id, date: { gte: since30d } },
      select: { durationMinutes: true, focusArea: true },
    }),
    prisma.handicapEntry.findFirst({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    prisma.trackManShotData.findFirst({
      where: { userId: user.id },
      orderBy: { carryDistance: "desc" },
      select: { carryDistance: true, ballSpeed: true },
    }),
  ]);

  const roundCount30d = rounds.length;
  const scoredRounds = rounds.filter((r) => r.totalScore !== null);
  const avgScore30d =
    scoredRounds.length > 0
      ? scoredRounds.reduce((sum, r) => sum + (r.totalScore ?? 0), 0) / scoredRounds.length
      : null;

  let scoreTrend: "up" | "down" | "flat" = "flat";
  if (scoredRounds.length >= 4) {
    const mid = Math.floor(scoredRounds.length / 2);
    const recentAvg = scoredRounds.slice(0, mid).reduce((s, r) => s + (r.totalScore ?? 0), 0) / mid;
    const olderAvg = scoredRounds.slice(mid).reduce((s, r) => s + (r.totalScore ?? 0), 0) / (scoredRounds.length - mid);
    if (recentAvg < olderAvg - 0.5) scoreTrend = "down";
    else if (recentAvg > olderAvg + 0.5) scoreTrend = "up";
  }

  const trainingSessions30d = trainingLogs.length;
  const trainingMinutes30d = trainingLogs.reduce((sum, t) => sum + (t.durationMinutes ?? 0), 0);
  const streak = await calculateStreak(user.id);

  const focusMap = new Map<string, number>();
  for (const t of trainingLogs) {
    if (t.focusArea) {
      focusMap.set(t.focusArea, (focusMap.get(t.focusArea) ?? 0) + 1);
    }
  }
  const topFocusAreas = Array.from(focusMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([area]) => area);

  const trackManBestCarry = trackManBest?.carryDistance ?? null;
  const trackManBestBallSpeed = trackManBest?.ballSpeed ?? null;

  // Generer kombinerte innsikter
  const insights: string[] = [];

  if (roundCount30d > 0 && trainingSessions30d > 0) {
    insights.push(`Du har spilt ${roundCount30d} runder og logget ${trainingSessions30d} treningsøkter siste 30 dager.`);
  }

  if (avgScore30d != null && scoreTrend === "down") {
    insights.push(`Snittscoren din er på ${avgScore30d.toFixed(1)} — og den er i bedring!`);
  } else if (avgScore30d != null) {
    insights.push(`Snittscoren din siste 30 dager er ${avgScore30d.toFixed(1)}.`);
  }

  if (trackManBestCarry && trackManBestCarry > 200) {
    insights.push(`TrackMan viser at du kan slå carry opp til ${Math.round(trackManBestCarry)}m — sterk ballfart!`);
  } else if (trackManBestBallSpeed) {
    insights.push(`Din beste målte ballfart er ${Math.round(trackManBestBallSpeed)} mph.`);
  }

  if (trainingMinutes30d > 0) {
    const hours = Math.round(trainingMinutes30d / 60 * 10) / 10;
    insights.push(`Du har trent omtrent ${hours} timer denne måneden${topFocusAreas.length > 0 ? ` med fokus på ${topFocusAreas[0].toLowerCase()}` : ""}.`);
  }

  if (streak >= 3) {
    insights.push(`Du er inne i en fin treningsstreak på ${streak} dager. Fortsett momentum!`);
  }

  if (insights.length === 0) {
    insights.push("Registrer runder og treningsøkter for å få personlige innsikter.");
  }

  return {
    roundCount30d,
    avgScore30d,
    scoreTrend,
    handicap: handicapEntry?.handicapIndex ?? null,
    trainingSessions30d,
    trainingMinutes30d,
    streak,
    topFocusAreas,
    trackManBestCarry,
    trackManBestBallSpeed,
    combinedInsights: insights.slice(0, 5),
  };
}
