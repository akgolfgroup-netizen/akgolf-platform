"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";

export interface ClubAggregate {
  club: string;
  avgCarry: number | null;
  avgBallSpeed: number | null;
  avgSmashFactor: number | null;
  avgSpinRate: number | null;
  shotCount: number;
  lastSessionDate: Date | null;
}

export interface TrendPoint {
  weekStart: string; // ISO-date (mandag)
  avgCarry: number;
  shotCount: number;
}

export interface ClubTrendData {
  club: string;
  points: TrendPoint[];
}

function avg(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Hent snitt-tall per kolle for en spiller.
 * Krever at caller er spilleren selv eller staff.
 */
export async function getClubAggregates(userId?: string): Promise<ClubAggregate[]> {
  const caller = await requirePortalUser();
  const targetUserId = userId ?? caller.id;

  if (targetUserId !== caller.id && !isStaff(caller.role)) {
    throw new Error("Du har ikke tilgang til denne spillerens data");
  }

  const shots = await prisma.trackManShotData.findMany({
    where: { userId: targetUserId },
    select: {
      club: true,
      carryDistance: true,
      ballSpeed: true,
      smashFactor: true,
      spinRate: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const groups = new Map<
    string,
    {
      carries: number[];
      ballSpeeds: number[];
      smashFactors: number[];
      spinRates: number[];
      shotCount: number;
      lastSessionDate: Date | null;
    }
  >();

  for (const shot of shots) {
    const existing = groups.get(shot.club) ?? {
      carries: [],
      ballSpeeds: [],
      smashFactors: [],
      spinRates: [],
      shotCount: 0,
      lastSessionDate: null,
    };

    existing.shotCount += 1;
    if (shot.carryDistance !== null) existing.carries.push(shot.carryDistance);
    if (shot.ballSpeed !== null) existing.ballSpeeds.push(shot.ballSpeed);
    if (shot.smashFactor !== null) existing.smashFactors.push(shot.smashFactor);
    if (shot.spinRate !== null) existing.spinRates.push(shot.spinRate);

    if (!existing.lastSessionDate || shot.createdAt > existing.lastSessionDate) {
      existing.lastSessionDate = shot.createdAt;
    }

    groups.set(shot.club, existing);
  }

  return Array.from(groups.entries()).map(([club, data]) => ({
    club,
    avgCarry: data.carries.length > 0 ? Math.round(avg(data.carries) * 10) / 10 : null,
    avgBallSpeed: data.ballSpeeds.length > 0 ? Math.round(avg(data.ballSpeeds) * 10) / 10 : null,
    avgSmashFactor: data.smashFactors.length > 0 ? Math.round(avg(data.smashFactors) * 100) / 100 : null,
    avgSpinRate: data.spinRates.length > 0 ? Math.round(avg(data.spinRates)) : null,
    shotCount: data.shotCount,
    lastSessionDate: data.lastSessionDate,
  }));
}

/**
 * Hent trend-data (snitt-carry per uke) for en spesifikk kolle.
 * @param userId — spiller-ID (valgfritt for admin)
 * @param club — kolle-navn
 * @param days — antall dager tilbake (default 90)
 */
export async function getClubTrend(userId: string, club: string, days = 90): Promise<ClubTrendData> {
  const caller = await requirePortalUser();
  const targetUserId = userId ?? caller.id;

  if (targetUserId !== caller.id && !isStaff(caller.role)) {
    throw new Error("Du har ikke tilgang til denne spillerens data");
  }

  const since = new Date();
  since.setDate(since.getDate() - days);

  const shots = await prisma.trackManShotData.findMany({
    where: {
      userId: targetUserId,
      club,
      carryDistance: { not: null },
      createdAt: { gte: since },
    },
    select: {
      carryDistance: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const weekMap = new Map<string, number[]>();

  for (const shot of shots) {
    if (shot.carryDistance === null) continue;
    const weekStart = startOfWeek(shot.createdAt).toISOString().slice(0, 10);
    const existing = weekMap.get(weekStart) ?? [];
    existing.push(shot.carryDistance);
    weekMap.set(weekStart, existing);
  }

  const points: TrendPoint[] = Array.from(weekMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([weekStart, carries]) => ({
      weekStart,
      avgCarry: Math.round(avg(carries) * 10) / 10,
      shotCount: carries.length,
    }));

  return { club, points };
}
