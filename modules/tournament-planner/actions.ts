import { randomUUID } from "crypto";
import type { PrismaClient } from "@prisma/client";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  PlanTournamentInput,
  CreateTournamentInput,
  TournamentWithPlan,
  TournamentPlanWithStudent,
  TournamentWithPlayers,
  HoleStrategy,
  PrepChecklist,
  TournamentPrepData,
} from "./types";
import { fetchAllSources } from "./sources";

// Helper type to support both Prisma and Supabase clients
type DbClient = PrismaClient | SupabaseClient;

function isSupabase(client: DbClient): client is SupabaseClient {
  return "from" in client && typeof client.from === "function";
}

// Dependency-injected database client for portability (supports both Prisma and Supabase)
export async function getTournamentsWithPlans(
  db: DbClient,
  studentId: string,
  options?: { from?: Date; to?: Date }
): Promise<TournamentWithPlan[]> {
  if (isSupabase(db)) {
    // Supabase implementation — filtrer bort private turneringer som ikke eies av studenten
    let query = db
      .from("Tournament")
      .select(`
        *,
        PlayerTournamentPlan!inner(*)
      `)
      .eq("PlayerTournamentPlan.studentId", studentId)
      .or(`isPrivate.eq.false,createdById.eq.${studentId}`);

    if (options?.from) {
      query = query.gte("startDate", options.from.toISOString());
    }
    if (options?.to) {
      query = query.lte("startDate", options.to.toISOString());
    }

    const { data: tournaments, error } = await query.order("startDate", { ascending: true });

    if (error) {
      console.error("Error fetching tournaments:", error);
      return [];
    }

    return (tournaments ?? []).map((t) => {
      const plan = t.PlayerTournamentPlan?.[0];
      return {
        ...t,
        level: t.level as import("./types").TournamentLevel,
        startDate: new Date(t.startDate),
        endDate: t.endDate ? new Date(t.endDate) : undefined,
        registrationDeadline: t.registrationDeadline
          ? new Date(t.registrationDeadline)
          : undefined,
        playerPlan: plan
          ? ({
              ...plan,
              planLevel: plan.planLevel as import("./types").PlanLevel,
              goalType: plan.goalType as import("./types").GoalType,
            })
          : null,
      };
    }) as TournamentWithPlan[];
  } else {
    // Prisma implementation — filtrer bort private turneringer som ikke eies av studenten
    const where: Record<string, unknown> = {
      OR: [{ isPrivate: false }, { createdById: studentId }],
    };
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
        PlayerTournamentPlan: {
          where: { studentId },
        },
      },
    });

    return tournaments.map((t) => {
      const plan = t.PlayerTournamentPlan[0];
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
}

export async function planTournament(
  db: DbClient,
  data: PlanTournamentInput & { isRegistered?: boolean }
): Promise<void> {
  if (isSupabase(db)) {
    // Supabase implementation - use upsert
    const { error } = await db.from("PlayerTournamentPlan").upsert(
      {
        studentId: data.studentId,
        tournamentId: data.tournamentId,
        planLevel: data.planLevel,
        goalType: data.goalType,
        notes: data.notes,
        isRegistered: data.isRegistered ?? false,
        updatedAt: new Date().toISOString(),
      },
      {
        onConflict: "studentId,tournamentId",
      }
    );

    if (error) {
      console.error("Error planning tournament:", error);
      throw error;
    }
  } else {
    // Prisma implementation
    await db.playerTournamentPlan.upsert({
      where: {
        studentId_tournamentId: {
          studentId: data.studentId,
          tournamentId: data.tournamentId,
        },
      },
      create: {
        id: randomUUID(),
        studentId: data.studentId,
        tournamentId: data.tournamentId,
        planLevel: data.planLevel,
        goalType: data.goalType,
        notes: data.notes,
        isRegistered: data.isRegistered ?? false,
        updatedAt: new Date(),
      },
      update: {
        planLevel: data.planLevel,
        goalType: data.goalType,
        notes: data.notes,
        isRegistered: data.isRegistered ?? false,
      },
    });
  }
}

export async function removeTournamentPlan(
  db: DbClient,
  studentId: string,
  tournamentId: string
): Promise<void> {
  if (isSupabase(db)) {
    const { error } = await db
      .from("PlayerTournamentPlan")
      .delete()
      .eq("studentId", studentId)
      .eq("tournamentId", tournamentId);

    if (error) {
      console.error("Error removing tournament plan:", error);
      throw error;
    }
  } else {
    await db.playerTournamentPlan.deleteMany({
      where: { studentId, tournamentId },
    });
  }
}

export async function createTournament(
  db: DbClient,
  data: CreateTournamentInput
): Promise<void> {
  if (isSupabase(db)) {
    const { error } = await db.from("Tournament").insert({
      ...data,
      id: randomUUID(),
      updatedAt: new Date().toISOString(),
    });

    if (error) {
      console.error("Error creating tournament:", error);
      throw error;
    }
  } else {
    await db.tournament.create({
      data: { ...data, id: randomUUID(), updatedAt: new Date() },
    });
  }
}

// --- Fase 1: Coach "Denne uken" ---

export async function getThisWeekTournamentPlans(
  db: DbClient,
  options?: { from?: Date; to?: Date }
): Promise<TournamentPlanWithStudent[]> {
  if (isSupabase(db)) {
    let query = db
      .from("PlayerTournamentPlan")
      .select(`
        *,
        User:studentId(id, name, image),
        Tournament:tournamentId(*)
      `);

    if (options?.from) {
      query = query.gte("Tournament.startDate", options.from.toISOString());
    }
    if (options?.to) {
      query = query.lte("Tournament.startDate", options.to.toISOString());
    }

    const { data: plans, error } = await query.order("Tournament(startDate)", {
      ascending: true,
    });

    if (error) {
      console.error("Error fetching tournament plans:", error);
      return [];
    }

    return (plans ?? []) as unknown as TournamentPlanWithStudent[];
  } else {
    const where: Record<string, unknown> = {};
    if (options?.from || options?.to) {
      where.Tournament = {
        startDate: {
          ...(options.from ? { gte: options.from } : {}),
          ...(options.to ? { lte: options.to } : {}),
        },
      };
    }

    const plans = await db.playerTournamentPlan.findMany({
      where,
      include: {
        User: { select: { id: true, name: true, image: true } },
        Tournament: true,
      },
      orderBy: { Tournament: { startDate: "asc" } },
    });

    return plans as unknown as TournamentPlanWithStudent[];
  }
}

// --- Fase 4: Staff tournament admin ---

export async function updateTournament(
  db: DbClient,
  id: string,
  data: Partial<CreateTournamentInput>
): Promise<void> {
  if (isSupabase(db)) {
    const { error } = await db
      .from("Tournament")
      .update(data)
      .eq("id", id);

    if (error) {
      console.error("Error updating tournament:", error);
      throw error;
    }
  } else {
    await db.tournament.update({ where: { id }, data });
  }
}

export async function deleteTournament(
  db: DbClient,
  id: string
): Promise<void> {
  if (isSupabase(db)) {
    const { error } = await db.from("Tournament").delete().eq("id", id);

    if (error) {
      console.error("Error deleting tournament:", error);
      throw error;
    }
  } else {
    await db.tournament.delete({ where: { id } });
  }
}

export async function getTournamentWithPlayers(
  db: DbClient,
  tournamentId: string
): Promise<TournamentWithPlayers | null> {
  if (isSupabase(db)) {
    const { data: tournament, error } = await db
      .from("Tournament")
      .select(`
        *,
        PlayerTournamentPlan(
          *,
          User:studentId(id, name, image)
        )
      `)
      .eq("id", tournamentId)
      .single();

    if (error) {
      console.error("Error fetching tournament with players:", error);
      return null;
    }

    return tournament as unknown as TournamentWithPlayers | null;
  } else {
    const tournament = await db.tournament.findUnique({
      where: { id: tournamentId },
      include: {
        PlayerTournamentPlan: {
          include: {
            User: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });
    return tournament as unknown as TournamentWithPlayers | null;
  }
}

// --- Fase 3: Periodization ---

export async function getPeriodizationForDateRange(
  db: DbClient,
  studentId: string,
  from: Date,
  to: Date
) {
  if (isSupabase(db)) {
    const { data: periods, error } = await db
      .from("PeriodizationPeriod")
      .select("*")
      .or(`studentId.eq.${studentId},studentId.is.null`)
      .lte("startDate", to.toISOString())
      .gte("endDate", from.toISOString())
      .order("startDate", { ascending: true });

    if (error) {
      console.error("Error fetching periodization:", error);
      return [];
    }

    // Prefer student-specific over global
    const studentPeriods = (periods ?? []).filter((p) => p.studentId === studentId);
    const globalPeriods = (periods ?? []).filter((p) => p.studentId === null);

    return studentPeriods.length > 0 ? studentPeriods : globalPeriods;
  } else {
    const periods = await db.periodizationPeriod.findMany({
      where: {
        OR: [{ studentId }, { studentId: null }],
        startDate: { lte: to },
        endDate: { gte: from },
      },
      orderBy: { startDate: "asc" },
    });

    const studentPeriods = periods.filter((p) => p.studentId === studentId);
    const globalPeriods = periods.filter((p) => p.studentId === null);

    return studentPeriods.length > 0 ? studentPeriods : globalPeriods;
  }
}

// --- Fase 5: Multi-source sync ---

export async function syncTournamentsFromSources(
  db: DbClient,
  year: number,
  createdById?: string
): Promise<{ created: number; updated: number; sources: string[]; errors: string[] }> {
  const { tournaments, sources, errors } = await fetchAllSources(year);

  let created = 0;
  let updated = 0;

  for (const t of tournaments) {
    if (isSupabase(db)) {
      // Check for existing tournament
      const { data: existing } = await db
        .from("Tournament")
        .select("id")
        .eq("source", t.source)
        .eq("sourceId", t.sourceId)
        .single();

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
        await db.from("Tournament").update(data).eq("id", existing.id);
        updated++;
      } else {
        await db.from("Tournament").insert({
          ...data,
          id: randomUUID(),
          createdById,
          updatedAt: new Date().toISOString(),
        });
        created++;
      }
    } else {
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
            id: randomUUID(),
            createdById,
            updatedAt: new Date(),
          },
        });
        created++;
      }
    }
  }

  return { created, updated, sources, errors };
}

// --- Fase 5: Tournament Prep ---

export async function getTournamentPrep(
  db: DbClient,
  tournamentId: string,
  userId: string
): Promise<TournamentPrepData | null> {
  if (isSupabase(db)) {
    const { data: prep, error } = await db
      .from("TournamentPrep")
      .select("*")
      .eq("tournamentId", tournamentId)
      .eq("userId", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching tournament prep:", error);
    }

    return prep as TournamentPrepData | null;
  } else {
    const prep = await db.tournamentPrep.findUnique({
      where: { tournamentId_userId: { tournamentId, userId } },
    });
    return prep as TournamentPrepData | null;
  }
}

export async function saveTournamentPrep(
  db: DbClient,
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
  const prepData = {
    courseStrategy: data.courseStrategy
      ? JSON.parse(JSON.stringify(data.courseStrategy))
      : undefined,
    checklist: data.checklist
      ? JSON.parse(JSON.stringify(data.checklist))
      : undefined,
    readinessScore: data.readinessScore ?? null,
    mentalPrepNotes: data.mentalPrepNotes ?? null,
    warmupPlan: data.warmupPlan ?? null,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabase(db)) {
    const { error } = await db.from("TournamentPrep").upsert(
      {
        id: randomUUID(),
        tournamentId: data.tournamentId,
        userId: data.userId,
        ...prepData,
      },
      {
        onConflict: "tournamentId,userId",
      }
    );

    if (error) {
      console.error("Error saving tournament prep:", error);
      throw error;
    }
  } else {
    await db.tournamentPrep.upsert({
      where: {
        tournamentId_userId: {
          tournamentId: data.tournamentId,
          userId: data.userId,
        },
      },
      create: {
        id: randomUUID(),
        tournamentId: data.tournamentId,
        userId: data.userId,
        ...prepData,
      },
      update: prepData,
    });
  }
}
