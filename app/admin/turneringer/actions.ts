"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";

export type TournamentItem = {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date | null;
  level: string;
  course: string | null;
  location: string | null;
  externalUrl: string | null;
  series: string | null;
  source: string | null;
  golfboxId: number | null;
  playerCount: number;
  status: "upcoming" | "ongoing" | "completed";
};

export type TournamentStats = {
  upcoming: number;
  ongoing: number;
  completed: number;
  totalPlayers: number;
};

export type TournamentOverviewResult = {
  tournaments: TournamentItem[];
  stats: TournamentStats;
};

function deriveTournamentStatus(
  startDate: Date,
  endDate: Date | null
): "upcoming" | "ongoing" | "completed" {
  const now = new Date();
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  // Sett tid til midnatt for datosammenligning
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  if (today < startDay) return "upcoming";
  if (today > endDay) return "completed";
  return "ongoing";
}

export async function getTournaments(filter?: {
  status?: string;
}): Promise<TournamentOverviewResult> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return {
      tournaments: [],
      stats: { upcoming: 0, ongoing: 0, completed: 0, totalPlayers: 0 },
    };
  }

  const tournaments = await prisma.tournament.findMany({
    include: {
      _count: {
        select: { PlayerTournamentPlan: true },
      },
    },
    orderBy: { startDate: "desc" },
  });

  const items: TournamentItem[] = tournaments.map((t) => ({
    id: t.id,
    name: t.name,
    startDate: t.startDate,
    endDate: t.endDate,
    level: t.level,
    course: t.course,
    location: t.location,
    externalUrl: t.externalUrl,
    series: t.series,
    source: t.source,
    golfboxId: t.golfboxId,
    playerCount: t._count.PlayerTournamentPlan,
    status: deriveTournamentStatus(t.startDate, t.endDate),
  }));

  const upcoming = items.filter((t) => t.status === "upcoming").length;
  const ongoing = items.filter((t) => t.status === "ongoing").length;
  const completed = items.filter((t) => t.status === "completed").length;
  const totalPlayers = items.reduce((sum, t) => sum + t.playerCount, 0);

  // Filtrer etter status hvis spesifisert
  const filtered =
    filter?.status && filter.status !== "all"
      ? items.filter((t) => t.status === filter.status)
      : items;

  return {
    tournaments: filtered,
    stats: { upcoming, ongoing, completed, totalPlayers },
  };
}

export async function deleteTournament(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ikke autorisert" };
  }

  try {
    await prisma.tournament.delete({
      where: { id },
    });

    revalidatePath("/portal/admin/turneringer");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke slette turnering" };
  }
}
