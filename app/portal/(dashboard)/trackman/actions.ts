"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

// ── Typer ────────────────────────────────────────────────

export type TrackManSessionItem = {
  id: string;
  sessionDate: string;
  club: string;
  shotCount: number;
  avgCarry: number;
  avgBallSpeed: number | null;
  avgClubSpeed: number | null;
  avgSpinRate: number | null;
  avgLaunchAngle: number | null;
};

export type ClubStat = {
  club: string;
  avgSpeed: number | null;
  avgBallSpeed: number | null;
  avgSpin: number | null;
  avgLaunch: number | null;
  avgCarry: number;
  sessionCount: number;
};

export type CarryTrendPoint = {
  date: string;
  value: number;
};

export type TrackManAnalyticsSummary = {
  id: string;
  sessionId: string;
  driverStats: Record<string, unknown> | null;
  ironStats: Record<string, unknown> | null;
  wedgeStats: Record<string, unknown> | null;
  avgBallSpeed: number | null;
  maxBallSpeed: number | null;
  avgCarryDistance: number | null;
  maxCarryDistance: number | null;
  ballSpeedConsistency: number | null;
  distanceConsistency: number | null;
  shotShapeDistribution: Record<string, unknown> | null;
  missPattern: Record<string, unknown> | null;
  sweetSpotPercentage: number | null;
  trendBallSpeed: string | null;
  trendDistance: string | null;
  trendConsistency: string | null;
  generatedInsights: string[];
  recommendedFocus: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type TrackManOverview = {
  sessions: TrackManSessionItem[];
  clubStats: ClubStat[];
  carryTrend: CarryTrendPoint[];
  totalSessions: number;
  totalShots: number;
  bestCarry: number;
  avgCarry: number;
  recentAnalytics: TrackManAnalyticsSummary[];
};

// ── Server Actions ───────────────────────────────────────

export async function getTrackManOverview(): Promise<TrackManOverview> {
  const user = await requirePortalUser();

  const sessions = await prisma.trackManShotData.groupBy({
    by: ["sessionId"],
    where: { userId: user.id },
    _count: { sessionId: true },
    _max: { createdAt: true },
    orderBy: { _max: { createdAt: "desc" } },
  });

  if (sessions.length === 0) {
    return {
      sessions: [],
      clubStats: [],
      carryTrend: [],
      totalSessions: 0,
      totalShots: 0,
      bestCarry: 0,
      avgCarry: 0,
      recentAnalytics: [],
    };
  }

  const sessionIds = sessions.map((s) => s.sessionId);

  // Hent analytics for de siste 12 sesjonene
  const recentSessionIds = sessionIds.slice(0, 12);
  const analyticsRaw = await prisma.trackManSessionAnalytics.findMany({
    where: { sessionId: { in: recentSessionIds }, userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const recentAnalytics: TrackManAnalyticsSummary[] = analyticsRaw.map((a) => ({
    id: a.id,
    sessionId: a.sessionId,
    driverStats: a.driverStats as Record<string, unknown> | null,
    ironStats: a.ironStats as Record<string, unknown> | null,
    wedgeStats: a.wedgeStats as Record<string, unknown> | null,
    avgBallSpeed: a.avgBallSpeed,
    maxBallSpeed: a.maxBallSpeed,
    avgCarryDistance: a.avgCarryDistance,
    maxCarryDistance: a.maxCarryDistance,
    ballSpeedConsistency: a.ballSpeedConsistency,
    distanceConsistency: a.distanceConsistency,
    shotShapeDistribution: a.shotShapeDistribution as Record<string, unknown> | null,
    missPattern: a.missPattern as Record<string, unknown> | null,
    sweetSpotPercentage: a.sweetSpotPercentage,
    trendBallSpeed: a.trendBallSpeed,
    trendDistance: a.trendDistance,
    trendConsistency: a.trendConsistency,
    generatedInsights: a.generatedInsights,
    recommendedFocus: a.recommendedFocus,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  }));

  const firstShots = await prisma.trackManShotData.findMany({
    where: { sessionId: { in: sessionIds }, userId: user.id },
    orderBy: { shotNumber: "asc" },
    distinct: ["sessionId"],
    select: {
      sessionId: true,
      createdAt: true,
      club: true,
    },
  });

  const allShots = await prisma.trackManShotData.findMany({
    where: { sessionId: { in: sessionIds }, userId: user.id },
    select: {
      sessionId: true,
      club: true,
      carryDistance: true,
      ballSpeed: true,
      clubSpeed: true,
      spinRate: true,
      launchAngle: true,
    },
  });

  // ── Mapper sesjoner ──
  const sessionItems: TrackManSessionItem[] = sessions.map((s) => {
    const meta = firstShots.find((f) => f.sessionId === s.sessionId);
    const shots = allShots.filter((shot) => shot.sessionId === s.sessionId);
    const carries = shots.map((sh) => sh.carryDistance).filter((v): v is number => v != null);
    const ballSpeeds = shots.map((sh) => sh.ballSpeed).filter((v): v is number => v != null);
    const clubSpeeds = shots.map((sh) => sh.clubSpeed).filter((v): v is number => v != null);
    const spins = shots.map((sh) => sh.spinRate).filter((v): v is number => v != null);
    const launches = shots.map((sh) => sh.launchAngle).filter((v): v is number => v != null);

    const avg = (arr: number[]) =>
      arr.length > 0 ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10 : 0;

    return {
      id: s.sessionId,
      sessionDate: (meta?.createdAt ?? s._max.createdAt)?.toISOString() ?? new Date().toISOString(),
      club: meta?.club ?? "Ukjent",
      shotCount: s._count.sessionId,
      avgCarry: avg(carries),
      avgBallSpeed: ballSpeeds.length > 0 ? avg(ballSpeeds) : null,
      avgClubSpeed: clubSpeeds.length > 0 ? avg(clubSpeeds) : null,
      avgSpinRate: spins.length > 0 ? avg(spins) : null,
      avgLaunchAngle: launches.length > 0 ? avg(launches) : null,
    };
  });

  // ── Aggreger per klubb ──
  const clubMap = new Map<
    string,
    {
      carries: number[];
      speeds: number[];
      ballSpeeds: number[];
      spins: number[];
      launches: number[];
      count: number;
    }
  >();

  for (const s of sessionItems) {
    const existing = clubMap.get(s.club) ?? {
      carries: [],
      speeds: [],
      ballSpeeds: [],
      spins: [],
      launches: [],
      count: 0,
    };
    if (s.avgCarry > 0) existing.carries.push(s.avgCarry);
    if (s.avgClubSpeed) existing.speeds.push(s.avgClubSpeed);
    if (s.avgBallSpeed) existing.ballSpeeds.push(s.avgBallSpeed);
    if (s.avgSpinRate) existing.spins.push(s.avgSpinRate);
    if (s.avgLaunchAngle) existing.launches.push(s.avgLaunchAngle);
    existing.count += 1;
    clubMap.set(s.club, existing);
  }

  const avg = (arr: number[]) =>
    arr.length > 0
      ? Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10
      : 0;
  const avgOrNull = (arr: number[]) =>
    arr.length > 0 ? avg(arr) : null;

  const clubStats: ClubStat[] = Array.from(clubMap.entries())
    .map(([club, data]) => ({
      club,
      avgSpeed: avgOrNull(data.speeds),
      avgBallSpeed: avgOrNull(data.ballSpeeds),
      avgSpin: avgOrNull(data.spins),
      avgLaunch: avgOrNull(data.launches),
      avgCarry: avg(data.carries),
      sessionCount: data.count,
    }))
    .sort((a, b) => b.avgCarry - a.avgCarry);

  // ── Carry-trend (Driver, siste 12 mnd) ──
  const driverSessions = sessionItems
    .filter((s) => s.club.toLowerCase().includes("driver"))
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

  const carryTrend: CarryTrendPoint[] = driverSessions.map((s) => ({
    date: s.sessionDate.slice(0, 10),
    value: s.avgCarry,
  }));

  // ── Totaler ──
  const totalShots = sessionItems.reduce((sum, s) => sum + s.shotCount, 0);
  const allCarries = sessionItems
    .map((s) => s.avgCarry)
    .filter((c) => c > 0);
  const bestCarry =
    allCarries.length > 0 ? Math.round(Math.max(...allCarries)) : 0;
  const avgCarryTotal =
    allCarries.length > 0 ? Math.round(avg(allCarries)) : 0;

  return {
    sessions: sessionItems.slice(0, 20),
    clubStats,
    carryTrend,
    totalSessions: sessions.length,
    totalShots,
    bestCarry,
    avgCarry: avgCarryTotal,
    recentAnalytics,
  };
}
