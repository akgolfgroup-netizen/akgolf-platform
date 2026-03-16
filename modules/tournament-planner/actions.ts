import type { PrismaClient } from "@prisma/client";
import type {
  PlanTournamentInput,
  CreateTournamentInput,
  TournamentWithPlan,
  TournamentPlanWithStudent,
  TournamentWithPlayers,
  ImportableTournament,
  HoleStrategy,
  PrepChecklist,
  TournamentPrepData,
} from "./types";
import { fetchAllSources } from "./sources";

// Dependency-injected Prisma client for portability
export async function getTournamentsWithPlans(
  db: PrismaClient,
  studentId: string,
  options?: { from?: Date; to?: Date }
): Promise<TournamentWithPlan[]> {
  const where: Record<string, unknown> = {};
  if (options?.from || options?.to) {
    where.startDate = {
      ...(options.from ? { gte: options.from } : {}),
      ...(options.to ? { lte: options.to } : {}),
    };
  }

  const tournaments = await db.tournament.findMany({
    where,
    orderBy: { startDate: "asc" },
    include: {
      playerPlans: {
        where: { studentId },
      },
    },
  });

  return tournaments.map((t) => {
    const plan = t.playerPlans[0];
    return {
      ...t,
      level: t.level as import("./types").TournamentLevel,
      startDate: t.startDate,
      endDate: t.endDate ?? undefined,
      registrationDeadline: t.registrationDeadline ?? undefined,
      playerPlan: plan
        ? ({
            ...plan,
            planLevel: plan.planLevel as import("./types").PlanLevel,
            goalType: plan.goalType as import("./types").GoalType,
          })
        : null,
    };
  }) as TournamentWithPlan[];
}

export async function planTournament(
  db: PrismaClient,
  data: PlanTournamentInput & { isRegistered?: boolean }
): Promise<void> {
  await db.playerTournamentPlan.upsert({
    where: {
      studentId_tournamentId: {
        studentId: data.studentId,
        tournamentId: data.tournamentId,
      },
    },
    create: {
      studentId: data.studentId,
      tournamentId: data.tournamentId,
      planLevel: data.planLevel,
      goalType: data.goalType,
      notes: data.notes,
      isRegistered: data.isRegistered ?? false,
    },
    update: {
      planLevel: data.planLevel,
      goalType: data.goalType,
      notes: data.notes,
      isRegistered: data.isRegistered ?? false,
    },
  });
}

export async function removeTournamentPlan(
  db: PrismaClient,
  studentId: string,
  tournamentId: string
): Promise<void> {
  await db.playerTournamentPlan.deleteMany({
    where: { studentId, tournamentId },
  });
}

export async function createTournament(
  db: PrismaClient,
  data: CreateTournamentInput
): Promise<void> {
  await db.tournament.create({ data });
}

// --- Fase 1: Coach "Denne uken" ---

export async function getThisWeekTournamentPlans(
  db: PrismaClient,
  options?: { from?: Date; to?: Date }
): Promise<TournamentPlanWithStudent[]> {
  const where: Record<string, unknown> = {};
  if (options?.from || options?.to) {
    where.tournament = {
      startDate: {
        ...(options.from ? { gte: options.from } : {}),
        ...(options.to ? { lte: options.to } : {}),
      },
    };
  }

  const plans = await db.playerTournamentPlan.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, image: true } },
      tournament: true,
    },
    orderBy: { tournament: { startDate: "asc" } },
  });

  return plans as unknown as TournamentPlanWithStudent[];
}

// --- Fase 4: Staff tournament admin ---

export async function updateTournament(
  db: PrismaClient,
  id: string,
  data: Partial<CreateTournamentInput>
): Promise<void> {
  await db.tournament.update({ where: { id }, data });
}

export async function deleteTournament(
  db: PrismaClient,
  id: string
): Promise<void> {
  await db.tournament.delete({ where: { id } });
}

export async function getTournamentWithPlayers(
  db: PrismaClient,
  tournamentId: string
): Promise<TournamentWithPlayers | null> {
  const tournament = await db.tournament.findUnique({
    where: { id: tournamentId },
    include: {
      playerPlans: {
        include: {
          student: { select: { id: true, name: true, image: true } },
        },
      },
    },
  });
  return tournament as unknown as TournamentWithPlayers | null;
}

// --- Fase 3: Periodization ---

export async function getPeriodizationForDateRange(
  db: PrismaClient,
  studentId: string,
  from: Date,
  to: Date
) {
  const periods = await db.periodizationPeriod.findMany({
    where: {
      OR: [{ studentId }, { studentId: null }],
      startDate: { lte: to },
      endDate: { gte: from },
    },
    orderBy: { startDate: "asc" },
  });

  // Prefer student-specific over global
  const studentPeriods = periods.filter((p) => p.studentId === studentId);
  const globalPeriods = periods.filter((p) => p.studentId === null);

  return studentPeriods.length > 0 ? studentPeriods : globalPeriods;
}

// --- Fase 5: Multi-source sync ---

export async function syncTournamentsFromSources(
  db: PrismaClient,
  year: number,
  createdById?: string
): Promise<{ created: number; updated: number; sources: string[]; errors: string[] }> {
  const { tournaments, sources, errors } = await fetchAllSources(year);

  let created = 0;
  let updated = 0;

  for (const t of tournaments) {
    const existing = await db.tournament.findUnique({
      where: { source_sourceId: { source: t.source, sourceId: t.sourceId } },
    });

    const data = {
      name: t.name,
      startDate: t.startDate,
      endDate: t.endDate ?? null,
      level: t.level ?? "nasjonal",
      course: t.venue ?? null,
      location: t.venue ?? null,
      registrationDeadline: t.registrationDeadline ?? null,
      numberOfHoles: t.numberOfHoles ?? null,
      series: t.series,
      externalUrl: t.externalUrl ?? null,
      source: t.source,
      sourceId: t.sourceId,
    };

    if (existing) {
      await db.tournament.update({
        where: { id: existing.id },
        data,
      });
      updated++;
    } else {
      await db.tournament.create({
        data: {
          ...data,
          createdById,
        },
      });
      created++;
    }
  }

  return { created, updated, sources, errors };
}

// --- Fase 5: Tournament Prep ---

export async function getTournamentPrep(
  db: PrismaClient,
  tournamentId: string,
  userId: string
): Promise<TournamentPrepData | null> {
  const prep = await db.tournamentPrep.findUnique({
    where: { tournamentId_userId: { tournamentId, userId } },
  });
  return prep as TournamentPrepData | null;
}

export async function saveTournamentPrep(
  db: PrismaClient,
  data: {
    tournamentId: string;
    userId: string;
    courseStrategy?: HoleStrategy[];
    checklist?: PrepChecklist;
    readinessScore?: number;
    mentalPrepNotes?: string;
    warmupPlan?: string;
  }
): Promise<void> {
  await db.tournamentPrep.upsert({
    where: {
      tournamentId_userId: {
        tournamentId: data.tournamentId,
        userId: data.userId,
      },
    },
    create: {
      tournamentId: data.tournamentId,
      userId: data.userId,
      courseStrategy: data.courseStrategy ? JSON.parse(JSON.stringify(data.courseStrategy)) : undefined,
      checklist: data.checklist ? JSON.parse(JSON.stringify(data.checklist)) : undefined,
      readinessScore: data.readinessScore ?? null,
      mentalPrepNotes: data.mentalPrepNotes ?? null,
      warmupPlan: data.warmupPlan ?? null,
    },
    update: {
      ...(data.courseStrategy !== undefined && { courseStrategy: JSON.parse(JSON.stringify(data.courseStrategy)) }),
      ...(data.checklist !== undefined && { checklist: JSON.parse(JSON.stringify(data.checklist)) }),
      ...(data.readinessScore !== undefined && { readinessScore: data.readinessScore }),
      ...(data.mentalPrepNotes !== undefined && { mentalPrepNotes: data.mentalPrepNotes }),
      ...(data.warmupPlan !== undefined && { warmupPlan: data.warmupPlan }),
    },
  });
}
