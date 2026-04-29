"use server";

/**
 * Treningsanalyse — server actions for 6-dimensjonsfiltrering.
 *
 * MERK: Prisma-skjemaet har ikke alle AK-taxonomy-feltene direkte på
 * TrainingPlanSession (de er planlagt men ikke migrert ennå).
 * Vi bruker TrainingLog + TrainingLogExercise + ExerciseDefinition
 * som kilde for faktisk gjennomført trening.
 *
 * CS-nivå hentes fra TrainingLogExercise.clubSpeed (prosent 0–100).
 * Miljø/press hentes fra TrainingLogExercise.environment/pressLevel
 * (heltall) med mapping til M0–M5 / PR1–PR5.
 */

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

// ─── Typer ──────────────────────────────────────────────────────────

export interface TrainingFilter {
  userId?: string;
  pyramidCodes?: string[];
  areas?: string[];
  lPhases?: string[];
  csLevels?: string[];
  environments?: string[];
  pressureLevels?: string[];
  fromDate?: Date;
  toDate?: Date;
}

export interface DimensionAggregate {
  sessions: number;
  minutes: number;
}

export interface WeeklyTrendPoint {
  weekStart: Date;
  minutes: number;
  byPyramid: Record<string, number>;
}

export interface TrainingAnalysisResult {
  totalSessions: number;
  totalMinutes: number;
  totalWeeks: number;
  byPyramid: Record<string, DimensionAggregate>;
  byArea: Record<string, DimensionAggregate>;
  byLPhase: Record<string, DimensionAggregate>;
  byCsLevel: Record<string, DimensionAggregate>;
  byEnvironment: Record<string, DimensionAggregate>;
  byPressure: Record<string, DimensionAggregate>;
  weeklyTrend: WeeklyTrendPoint[];
}

export interface CompareResult {
  filterA: TrainingAnalysisResult;
  filterB: TrainingAnalysisResult;
}

// ─── Hjelpefunksjoner ───────────────────────────────────────────────

function intToEnvCode(n: number | null | undefined): string | null {
  if (n === null || n === undefined) return null;
  if (n >= 0 && n <= 5) return `M${n}`;
  return null;
}

function intToPressCode(n: number | null | undefined): string | null {
  if (n === null || n === undefined) return null;
  if (n >= 1 && n <= 5) return `PR${n}`;
  return null;
}

function clubSpeedToCsLevel(speed: number | null | undefined): string | null {
  if (speed === null || speed === undefined) return null;
  // Runder til nærmeste CS-nivå (0, 20, 30, 40, 50, 60, 70, 80, 90, 100)
  if (speed === 0) return "CS0";
  if (speed <= 25) return "CS20";
  if (speed <= 35) return "CS30";
  if (speed <= 45) return "CS40";
  if (speed <= 55) return "CS50";
  if (speed <= 65) return "CS60";
  if (speed <= 75) return "CS70";
  if (speed <= 85) return "CS80";
  if (speed <= 95) return "CS90";
  return "CS100";
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addToAgg(
  map: Record<string, DimensionAggregate>,
  key: string | null,
  minutes: number
): void {
  if (!key) return;
  const existing = map[key] ?? { sessions: 0, minutes: 0 };
  existing.sessions += 1;
  existing.minutes += minutes;
  map[key] = existing;
}

function matchesFilter<T>(
  value: T | null,
  filterValues: T[] | undefined
): boolean {
  if (!filterValues || filterValues.length === 0) return true;
  if (value === null) return false;
  return filterValues.includes(value);
}

// ─── Hovedanalyse ───────────────────────────────────────────────────

export async function analyzeTraining(
  filter: TrainingFilter
): Promise<TrainingAnalysisResult> {
  const user = await requirePortalUser();
  const userId = filter.userId ?? user.id;

  const toDate = filter.toDate ?? new Date();
  const fromDate = filter.fromDate ?? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  // 1. Hent alle TrainingLog for perioden
  const logs = await prisma.trainingLog.findMany({
    where: {
      userId,
      date: { gte: fromDate, lte: toDate },
    },
    include: {
      TrainingLogExercises: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { date: "asc" },
  });

  // 2. Hent ExerciseDefinition for pyramid/area
  const exerciseIds = new Set<string>();
  for (const log of logs) {
    for (const ex of log.TrainingLogExercises) {
      if (ex.exerciseId) exerciseIds.add(ex.exerciseId);
    }
  }

  const exerciseDefs: Array<{ id: string; pyramid: string; area: string; lPhase: string | null }> =
    exerciseIds.size > 0
      ? await prisma.exerciseDefinition.findMany({
          where: { id: { in: Array.from(exerciseIds) } },
          select: { id: true, pyramid: true, area: true, lPhase: true },
        })
      : [];

  const exerciseMap = new Map<string, { id: string; pyramid: string; area: string; lPhase: string | null }>(
    exerciseDefs.map((e) => [e.id, e])
  );

  // 3. Aggregér
  const byPyramid: Record<string, DimensionAggregate> = {};
  const byArea: Record<string, DimensionAggregate> = {};
  const byLPhase: Record<string, DimensionAggregate> = {};
  const byCsLevel: Record<string, DimensionAggregate> = {};
  const byEnvironment: Record<string, DimensionAggregate> = {};
  const byPressure: Record<string, DimensionAggregate> = {};
  const weeklyTrendMap = new Map<string, WeeklyTrendPoint>();

  let totalSessions = 0;
  let totalMinutes = 0;
  const uniqueWeeks = new Set<string>();

  for (const log of logs) {
    const minutes = log.durationMinutes ?? 0;

    // Bruk første øvelse som representant for økten
    const firstEx = log.TrainingLogExercises[0];
    const exDef = firstEx?.exerciseId ? exerciseMap.get(firstEx.exerciseId) : undefined;

    const pyramid = exDef?.pyramid ?? null;
    const area = exDef?.area ?? null;
    const lPhase = firstEx?.lPhase ?? log.primaryLPhase ?? null;
    const csLevel = clubSpeedToCsLevel(firstEx?.clubSpeed ?? null);
    const env = intToEnvCode(firstEx?.environment ?? log.primaryEnvironment);
    const press = intToPressCode(firstEx?.pressLevel ?? log.primaryPressLevel);

    // Filtrer
    if (!matchesFilter(pyramid, filter.pyramidCodes)) continue;
    if (!matchesFilter(area, filter.areas)) continue;
    if (!matchesFilter(lPhase, filter.lPhases)) continue;
    if (!matchesFilter(csLevel, filter.csLevels)) continue;
    if (!matchesFilter(env, filter.environments)) continue;
    if (!matchesFilter(press, filter.pressureLevels)) continue;

    totalSessions++;
    totalMinutes += minutes;

    addToAgg(byPyramid, pyramid, minutes);
    addToAgg(byArea, area, minutes);
    addToAgg(byLPhase, lPhase, minutes);
    addToAgg(byCsLevel, csLevel, minutes);
    addToAgg(byEnvironment, env, minutes);
    addToAgg(byPressure, press, minutes);

    // Uketrend
    const monday = getMonday(new Date(log.date));
    const weekKey = monday.toISOString();
    uniqueWeeks.add(weekKey);

    let weekPoint = weeklyTrendMap.get(weekKey);
    if (!weekPoint) {
      weekPoint = { weekStart: new Date(monday), minutes: 0, byPyramid: {} };
      weeklyTrendMap.set(weekKey, weekPoint);
    }
    weekPoint.minutes += minutes;
    const pyKey = pyramid ?? "Ukjent";
    weekPoint.byPyramid[pyKey] = (weekPoint.byPyramid[pyKey] ?? 0) + minutes;
  }

  // 4. Bygg 12-ukers trend (alltid 12 uker, fyll med 0 der det mangler data)
  const now = new Date();
  const currentMonday = getMonday(now);
  const weeklyTrend: WeeklyTrendPoint[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() - i * 7);
    const key = d.toISOString();
    const existing = weeklyTrendMap.get(key);
    weeklyTrend.push(
      existing ?? { weekStart: new Date(d), minutes: 0, byPyramid: {} }
    );
  }

  return {
    totalSessions,
    totalMinutes,
    totalWeeks: uniqueWeeks.size,
    byPyramid,
    byArea,
    byLPhase,
    byCsLevel,
    byEnvironment,
    byPressure,
    weeklyTrend,
  };
}

// ─── Sammenligning ──────────────────────────────────────────────────

export async function compareTrainingFilters(
  filterA: TrainingFilter,
  filterB: TrainingFilter
): Promise<CompareResult> {
  const [resultA, resultB] = await Promise.all([
    analyzeTraining(filterA),
    analyzeTraining(filterB),
  ]);
  return { filterA: resultA, filterB: resultB };
}
