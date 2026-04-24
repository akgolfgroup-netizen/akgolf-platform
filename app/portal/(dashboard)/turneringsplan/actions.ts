"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { createServerSupabase } from "@/lib/supabase/server";

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

export interface CompletedTournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  level: string;
  course: string | null;
  location: string | null;
  goalType: string | null;
  planNotes: string | null;
  hadPrep: boolean;
}

export async function getPlayerTournaments(): Promise<{
  tournaments: PortalTournament[];
  stats: TournamentStats;
  completedTournaments: CompletedTournament[];
}> {
  const user = await requirePortalUser();

  const now = new Date();

  // Hent alle turneringer fra og med i dag, pluss brukerens planer
  // Filtrer bort private turneringer som ikke eies av brukeren
  const tournaments = await prisma.tournament.findMany({
    where: {
      startDate: { gte: now },
      OR: [{ isPrivate: false }, { createdById: user.id }],
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

  // Hent fullforte turneringer brukeren har vært tilknyttet
  const completedRaw = await prisma.tournament.findMany({
    where: {
      startDate: { lt: now },
      PlayerTournamentPlan: {
        some: { studentId: user.id },
      },
    },
    include: {
      PlayerTournamentPlan: {
        where: { studentId: user.id },
        take: 1,
      },
      TournamentPrep: {
        where: { userId: user.id },
        take: 1,
      },
    },
    orderBy: { startDate: "desc" },
    take: 100,
  });

  const completedTournaments: CompletedTournament[] = completedRaw.map((t) => {
    const plan = t.PlayerTournamentPlan[0] ?? null;
    return {
      id: t.id,
      name: t.name,
      startDate: t.startDate.toISOString(),
      endDate: t.endDate?.toISOString() ?? null,
      level: t.level,
      course: t.course,
      location: t.location,
      goalType: plan?.goalType ?? null,
      planNotes: plan?.notes ?? null,
      hadPrep: t.TournamentPrep.length > 0,
    };
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
      completed: completedTournaments.length,
    },
    completedTournaments,
  };
}

export async function registerForTournament(input: {
  tournamentId: string;
}): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id) return { success: false, error: "Ikke innlogget" };

  const supabase = await createServerSupabase();

  try {
    const { error } = await supabase
      .from("PlayerTournamentPlan")
      .upsert({
        studentId: user.id,
        tournamentId: input.tournamentId,
        isRegistered: true,
        updatedAt: new Date().toISOString(),
      }, {
        onConflict: "studentId,tournamentId",
      });

    if (error) throw error;
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke melde på turnering" };
  }
}
