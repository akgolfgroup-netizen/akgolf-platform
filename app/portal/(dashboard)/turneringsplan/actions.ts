"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";

export interface PortalTournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  level: string;
  course: string | null;
  location: string | null;
  externalUrl: string | null;
  series: string | null;
  numberOfHoles: number | null;
  isRegistered: boolean;
  planLevel: string | null;
  goalType: string | null;
  planNotes: string | null;
}

export interface TournamentStats {
  upcoming: number;
  registered: number;
  completed: number;
}

export async function getPlayerTournaments(): Promise<{
  tournaments: PortalTournament[];
  stats: TournamentStats;
}> {
  const user = await requirePortalUser();

  const now = new Date();

  // Hent alle turneringer fra og med i dag, pluss brukerens planer
  const tournaments = await prisma.tournament.findMany({
    where: {
      startDate: { gte: now },
    },
    include: {
      PlayerTournamentPlan: {
        where: { studentId: user.id },
        take: 1,
      },
    },
    orderBy: { startDate: "asc" },
    take: 50,
  });

  // Hent fullforte turneringer (for stats)
  const completedCount = await prisma.tournament.count({
    where: {
      startDate: { lt: now },
      PlayerTournamentPlan: {
        some: { studentId: user.id },
      },
    },
  });

  const mapped: PortalTournament[] = tournaments.map((t) => {
    const plan = t.PlayerTournamentPlan[0] ?? null;
    return {
      id: t.id,
      name: t.name,
      startDate: t.startDate.toISOString(),
      endDate: t.endDate?.toISOString() ?? null,
      level: t.level,
      course: t.course,
      location: t.location,
      externalUrl: t.externalUrl,
      series: t.series,
      numberOfHoles: t.numberOfHoles,
      isRegistered: plan?.isRegistered ?? false,
      planLevel: plan?.planLevel ?? null,
      goalType: plan?.goalType ?? null,
      planNotes: plan?.notes ?? null,
    };
  });

  const registeredCount = mapped.filter((t) => t.isRegistered).length;

  return {
    tournaments: mapped,
    stats: {
      upcoming: mapped.length,
      registered: registeredCount,
      completed: completedCount,
    },
  };
}
