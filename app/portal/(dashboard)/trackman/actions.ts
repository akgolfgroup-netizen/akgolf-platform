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

export type TrackManOverview = {
  sessions: TrackManSessionItem[];
  clubStats: ClubStat[];
  carryTrend: CarryTrendPoint[];
  totalSessions: number;
  totalShots: number;
  bestCarry: number;
  avgCarry: number;
};

// ── Hjelpere ─────────────────────────────────────────────

interface SessionAverages {
  club?: string;
  count?: number;
  avgCarry?: number;
  avgTotal?: number;
  avgClubSpeed?: number | null;
  avgBallSpeed?: number | null;
  avgSpinRate?: number | null;
  avgLaunchAngle?: number | null;
  avgSmashFactor?: number | null;
}

function parseAverages(averages: unknown): SessionAverages {
  if (
    averages &&
    typeof averages === "object" &&
    !Array.isArray(averages)
  ) {
    return averages as SessionAverages;
  }
  return {};
}

function parseShotsArray(shots: unknown): unknown[] {
  if (Array.isArray(shots)) return shots;
  return [];
}

// ── Server Actions ───────────────────────────────────────

export async function getTrackManOverview(): Promise<TrackManOverview> {
  const user = await requirePortalUser();

  const sessions = await prisma.trackmanSession.findMany({
    where: { userId: user.id },
    orderBy: { sessionDate: "desc" },
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
    };
  }

  // ── Mapper sesjoner ──
  const sessionItems: TrackManSessionItem[] = sessions.map((s) => {
    const avg = parseAverages(s.averages);
    const shotsArr = parseShotsArray(s.shots);
    return {
      id: s.id,
      sessionDate: s.sessionDate.toISOString(),
      club: s.club,
      shotCount: avg.count ?? shotsArr.length,
      avgCarry: avg.avgCarry ?? 0,
      avgBallSpeed: avg.avgBallSpeed ?? null,
      avgClubSpeed: avg.avgClubSpeed ?? null,
      avgSpinRate: avg.avgSpinRate ?? null,
      avgLaunchAngle: avg.avgLaunchAngle ?? null,
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
  const driverSessions = sessions
    .filter((s) => s.club === "Driver")
    .sort((a, b) => a.sessionDate.getTime() - b.sessionDate.getTime());

  const carryTrend: CarryTrendPoint[] = driverSessions.map((s) => {
    const avgs = parseAverages(s.averages);
    return {
      date: s.sessionDate.toISOString().slice(0, 10),
      value: avgs.avgCarry ?? 0,
    };
  });

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
  };
}
