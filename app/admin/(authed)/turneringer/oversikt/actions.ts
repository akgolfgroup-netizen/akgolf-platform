"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

export interface TournamentOverviewRow {
  studentId: string;
  studentName: string;
  studentImage: string | null;
  entries: Array<{
    planId: string;
    tournamentId: string;
    tournamentName: string;
    series: string | null;
    level: string;
    venue: string | null;
    startDate: Date;
    endDate: Date | null;
    weekNumber: number;
    monthIndex: number;
    planLevel: string;
    goalType: string;
    isRegistered: boolean;
  }>;
}

export interface TournamentOverviewData {
  year: number;
  rows: TournamentOverviewRow[];
  totalTournaments: number;
  totalRegistrations: number;
  weeksWithActivity: number[];
}

/**
 * Henter komplett trener-oversikt: alle spillere × alle turneringer for ett år.
 * Returnerer pivot-data som klient kan rendere som måned/uke-grid.
 */
export async function getCoachTournamentOverview(
  year: number,
  filter?: { level?: string; month?: number },
): Promise<TournamentOverviewData | null> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31, 23, 59, 59);

  const plans = await prisma.playerTournamentPlan.findMany({
    where: {
      Tournament: {
        startDate: { gte: yearStart, lte: yearEnd },
        ...(filter?.level ? { level: filter.level } : {}),
      },
    },
    include: {
      User: { select: { id: true, name: true, image: true } },
      Tournament: {
        select: {
          id: true,
          name: true,
          series: true,
          level: true,
          location: true,
          course: true,
          startDate: true,
          endDate: true,
        },
      },
    },
  });

  // Filter on month after fetching (cleaner than date-range query for month)
  const filtered = filter?.month !== undefined
    ? plans.filter((p) => new Date(p.Tournament.startDate).getMonth() === filter.month)
    : plans;

  // Group per student
  const byStudent = new Map<string, TournamentOverviewRow>();
  const weeksWithActivity = new Set<number>();

  for (const p of filtered) {
    const sid = p.studentId;
    if (!byStudent.has(sid)) {
      byStudent.set(sid, {
        studentId: sid,
        studentName: p.User.name ?? "Ukjent spiller",
        studentImage: p.User.image,
        entries: [],
      });
    }
    const startDate = new Date(p.Tournament.startDate);
    const weekNumber = isoWeekNumber(startDate);
    const monthIndex = startDate.getMonth();
    weeksWithActivity.add(weekNumber);

    byStudent.get(sid)!.entries.push({
      planId: p.id,
      tournamentId: p.tournamentId,
      tournamentName: p.Tournament.name,
      series: p.Tournament.series,
      level: p.Tournament.level,
      venue: p.Tournament.location ?? p.Tournament.course,
      startDate: p.Tournament.startDate,
      endDate: p.Tournament.endDate,
      weekNumber,
      monthIndex,
      planLevel: p.planLevel,
      goalType: p.goalType,
      isRegistered: p.isRegistered,
    });
  }

  // Sort entries per student by date
  for (const row of byStudent.values()) {
    row.entries.sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
  }

  const rows = [...byStudent.values()].sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "nb"),
  );

  return {
    year,
    rows,
    totalTournaments: new Set(filtered.map((p) => p.tournamentId)).size,
    totalRegistrations: filtered.filter((p) => p.isRegistered).length,
    weeksWithActivity: [...weeksWithActivity].sort((a, b) => a - b),
  };
}

function isoWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
