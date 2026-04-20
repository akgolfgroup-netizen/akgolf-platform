"use server";

/**
 * Exercise-actions — server-side søk/CRUD mot ExerciseDefinition.
 *
 * Kanonisk kilde for all drill/øvelse-data i portalen.
 * Erstatter hardkodet DRILL_LIBRARY og legacy "drills"-tabell.
 *
 * Brukes av:
 * - /portal/treningsplan sidebar (øvelsesbank-filtre)
 * - /portal/trening/ovelser (bibliotek-visning)
 * - /portal/treningsplan/[sessionId] (session-view drill-picker)
 */

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import type { Prisma } from "@prisma/client";

export interface ExerciseSearchFilters {
  /** Fritekst-søk på name + description */
  query?: string;
  /** Filtrer på pyramide (FYS/TEK/SLAG/SPILL/TURN) */
  pyramid?: string;
  /** Filtrer på spesifikt treningsområde (TEE, INN200, CHIP, osv.) */
  area?: string;
  /** Filtrer på L-fase (L-KROPP, L-ARM, L-KØLLE, L-BALL, L-AUTO) */
  lPhase?: string;
  /** Filtrer på LIFE-tag (LIFE-SELV, LIFE-SOS, osv.) — matcher mot tags-array */
  lifeCode?: string;
  /** Maks vanskelighet (1-5) */
  maxDifficulty?: number;
  /** Kun brukerens egne drills */
  onlyOwn?: boolean;
  /** Kun favoritter fra UserExerciseBank */
  onlyFavorites?: boolean;
  /** Paginering */
  limit?: number;
  offset?: number;
}

export interface ExerciseSearchResult {
  id: string;
  name: string;
  description: string | null;
  instructions: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  pyramid: string;
  area: string;
  lPhase: string | null;
  pPositionStart: string | null;
  pPositionEnd: string | null;
  equipment: string[];
  minDurationMinutes: number;
  maxDurationMinutes: number;
  difficulty: number;
  isPublic: boolean;
  isSystemDrill: boolean;
  tags: string[];
  /** Hvis brukeren har favorisert denne */
  isFavorite: boolean;
  /** Antall ganger brukeren har brukt øvelsen */
  usageCount: number;
}

/**
 * Søk i ExerciseDefinition med filter-støtte.
 * Returnerer kun publiserte drills (isPublic=true) pluss brukerens egne.
 */
export async function searchExercises(
  filters: ExerciseSearchFilters = {}
): Promise<ExerciseSearchResult[]> {
  const user = await requirePortalUser();

  const limit = Math.min(filters.limit ?? 50, 200);
  const offset = filters.offset ?? 0;

  // Bygg WHERE-clause
  const where: Prisma.ExerciseDefinitionWhereInput = {
    AND: [],
  };
  const conditions: Prisma.ExerciseDefinitionWhereInput[] = [];

  // Synlighet: publiserte + brukerens egne
  if (filters.onlyOwn) {
    conditions.push({ createdById: user.id });
  } else {
    conditions.push({
      OR: [{ isPublic: true }, { isSystemDrill: true }, { createdById: user.id }],
    });
  }

  if (filters.pyramid) conditions.push({ pyramid: filters.pyramid });
  if (filters.area) conditions.push({ area: filters.area });
  if (filters.lPhase) conditions.push({ lPhase: filters.lPhase });
  if (filters.maxDifficulty) {
    conditions.push({ difficulty: { lte: filters.maxDifficulty } });
  }
  if (filters.lifeCode) {
    conditions.push({ tags: { has: filters.lifeCode } });
  }
  if (filters.query) {
    const q = filters.query.trim();
    if (q.length > 0) {
      conditions.push({
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      });
    }
  }

  where.AND = conditions;

  // Favoritter krever join med UserExerciseBank
  if (filters.onlyFavorites) {
    const favorites = await prisma.userExerciseBank.findMany({
      where: { userId: user.id, isFavorite: true },
      select: { exerciseId: true },
    });
    const favIds = favorites.map((f) => f.exerciseId);
    if (favIds.length === 0) return [];
    conditions.push({ id: { in: favIds } });
  }

  // Hent drills + user-bank-data i parallell
  const [drills, bankEntries] = await Promise.all([
    prisma.exerciseDefinition.findMany({
      where,
      orderBy: [{ isSystemDrill: "desc" }, { name: "asc" }],
      take: limit,
      skip: offset,
    }),
    prisma.userExerciseBank.findMany({
      where: { userId: user.id },
      select: { exerciseId: true, isFavorite: true, usageCount: true },
    }),
  ]);

  const bankMap = new Map(
    bankEntries.map((e) => [e.exerciseId, { isFavorite: e.isFavorite, usageCount: e.usageCount }])
  );

  return drills.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    instructions: d.instructions,
    videoUrl: d.videoUrl,
    imageUrl: d.imageUrl,
    pyramid: d.pyramid,
    area: d.area,
    lPhase: d.lPhase,
    pPositionStart: d.pPositionStart,
    pPositionEnd: d.pPositionEnd,
    equipment: d.equipment,
    minDurationMinutes: d.minDurationMinutes,
    maxDurationMinutes: d.maxDurationMinutes,
    difficulty: d.difficulty,
    isPublic: d.isPublic,
    isSystemDrill: d.isSystemDrill,
    tags: d.tags,
    isFavorite: bankMap.get(d.id)?.isFavorite ?? false,
    usageCount: bankMap.get(d.id)?.usageCount ?? 0,
  }));
}

/**
 * Opprett bruker-definert øvelse (isPublic=false, isSystemDrill=false).
 */
export async function createUserExercise(input: {
  name: string;
  description?: string;
  pyramid: string;
  area: string;
  lPhase?: string;
  pPositionStart?: string;
  pPositionEnd?: string;
  equipment?: string[];
  minDurationMinutes?: number;
  maxDurationMinutes?: number;
  difficulty?: number;
  tags?: string[];
}): Promise<{ id: string } | { error: string }> {
  const user = await requirePortalUser();

  if (!input.name || input.name.trim().length === 0) {
    return { error: "Navn kan ikke være tomt" };
  }
  if (!input.pyramid || !input.area) {
    return { error: "Pyramide og område er påkrevd" };
  }

  const exercise = await prisma.exerciseDefinition.create({
    data: {
      id: nanoid(),
      name: input.name.trim(),
      description: input.description?.trim() ?? null,
      pyramid: input.pyramid,
      area: input.area,
      lPhase: input.lPhase ?? null,
      pPositionStart: input.pPositionStart ?? null,
      pPositionEnd: input.pPositionEnd ?? null,
      equipment: input.equipment ?? [],
      minDurationMinutes: input.minDurationMinutes ?? 10,
      maxDurationMinutes: input.maxDurationMinutes ?? 30,
      difficulty: input.difficulty ?? 2,
      isPublic: false,
      isSystemDrill: false,
      createdById: user.id,
      tags: input.tags ?? [],
      updatedAt: new Date(),
    },
    select: { id: true },
  });

  return { id: exercise.id };
}

/**
 * Toggle favoritt-status for en øvelse.
 * Oppretter UserExerciseBank-entry hvis den ikke finnes.
 */
export async function toggleFavoriteExercise(
  exerciseId: string
): Promise<{ isFavorite: boolean }> {
  const user = await requirePortalUser();

  const existing = await prisma.userExerciseBank.findUnique({
    where: {
      userId_exerciseId: { userId: user.id, exerciseId },
    },
  });

  if (existing) {
    const updated = await prisma.userExerciseBank.update({
      where: { userId_exerciseId: { userId: user.id, exerciseId } },
      data: { isFavorite: !existing.isFavorite },
      select: { isFavorite: true },
    });
    return updated;
  }

  const created = await prisma.userExerciseBank.create({
    data: {
      id: nanoid(),
      userId: user.id,
      exerciseId,
      isFavorite: true,
    },
    select: { isFavorite: true },
  });
  return created;
}

/**
 * Registrer at brukeren har brukt øvelsen i en økt.
 * Oppdaterer usageCount og lastUsedAt.
 */
export async function registerExerciseUsage(
  exerciseId: string
): Promise<void> {
  const user = await requirePortalUser();

  await prisma.userExerciseBank.upsert({
    where: {
      userId_exerciseId: { userId: user.id, exerciseId },
    },
    update: {
      usageCount: { increment: 1 },
      lastUsedAt: new Date(),
    },
    create: {
      id: nanoid(),
      userId: user.id,
      exerciseId,
      usageCount: 1,
      lastUsedAt: new Date(),
    },
  });
}
