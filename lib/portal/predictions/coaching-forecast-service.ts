/**
 * Coaching Forecast Service — DB-integrasjon.
 *
 * Kobler generateCoachingForecast-motoren til Prisma:
 *   - buildForecastInput(): henter runder fra RoundStats og normaliserer til RoundInput
 *   - runAndSaveForecast(): kjører motoren og lagrer i CoachingForecast-tabellen
 *   - getLatestForecast(): henter spillerens siste forecast
 *   - listForecasts(): historikk for backtesting
 *   - backfillActualOutcome(): fylle inn faktisk utfall ved deadline
 *
 * Alle metoder tar prisma-klient som første argument (dependency injection)
 * slik at tester kan bruke mock-Prisma uten å hitte databasen.
 */

import { nanoid } from "nanoid";
import type { PrismaClient } from "@prisma/client";
import {
  generateCoachingForecast,
  type CoachingForecastInput,
  type CoachingForecastOutput,
  type DiagnosticInput,
} from "./generate-coaching-forecast";
import type { RoundInput } from "@/lib/portal/golf/calculate-sg-from-rounds";

// ── Typer ───────────────────────────────────────────────────────────

export interface GenerateForecastRequest {
  userId: string;
  targetScoreAvg: number;
  deadline: Date;
  avgCourseRating: number;
  avgSlopeRating: number;
  hoursPerWeek: number;
  age: number;
  currentCategory?: string;
  diagnostic?: DiagnosticInput;
  monteCarloRuns?: number;
  /** Maks antall runder å hente fra historikk (default 20) */
  maxRounds?: number;
}

// ── Helpers ────────────────────────────────────────────────────────

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function weeksBetween(from: Date, to: Date): number {
  return Math.max(0, Math.ceil((to.getTime() - from.getTime()) / MS_PER_WEEK));
}

/**
 * Hent RoundStats for en bruker og konverter til RoundInput-format
 * som motoren kan bruke.
 *
 * NB: RoundStats har ikke courseRating/slopeRating direkte. Vi bruker
 * globale defaults fra request-input som representative verdier.
 */
export async function buildForecastInput(
  prisma: PrismaClient,
  req: GenerateForecastRequest,
): Promise<CoachingForecastInput> {
  const rounds = await prisma.roundStats.findMany({
    where: { userId: req.userId },
    orderBy: { date: "desc" },
    take: req.maxRounds ?? 20,
  });

  const roundInputs: RoundInput[] = rounds.map((r) => ({
    id: r.id,
    date: r.date,
    totalScore: r.totalScore ?? null,
    par: 72, // antakelse — kan senere forbedres ved å join'e mot Course
    courseRating: req.avgCourseRating,
    slopeRating: req.avgSlopeRating,
    sgTotal: r.sgTotal ?? null,
    sgOffTheTee: r.sgOffTheTee ?? null,
    sgApproach: r.sgApproach ?? null,
    sgAroundTheGreen: r.sgAroundTheGreen ?? null,
    sgPutting: r.sgPutting ?? null,
    // Vær-data lagres ikke på RoundStats i dag — null-defaults
    windMs: null,
    rainMm: null,
    tempC: null,
  }));

  const now = new Date();
  const weeksToDeadline = weeksBetween(now, req.deadline);

  return {
    rounds: roundInputs,
    age: req.age,
    hoursPerWeek: req.hoursPerWeek,
    targetScoreAvg: req.targetScoreAvg,
    weeksToDeadline,
    avgCourseRating: req.avgCourseRating,
    avgSlopeRating: req.avgSlopeRating,
    currentCategory: req.currentCategory,
    diagnostic: req.diagnostic,
    monteCarloRuns: req.monteCarloRuns,
  };
}

/**
 * Kjør motoren og lagre resultatet i CoachingForecast-tabellen.
 * Returnerer både motorens output og databaseraden.
 */
export async function runAndSaveForecast(
  prisma: PrismaClient,
  req: GenerateForecastRequest,
): Promise<{
  output: CoachingForecastOutput;
  forecastId: string;
}> {
  const input = await buildForecastInput(prisma, req);
  const output = generateCoachingForecast(input);

  const hoursPerCategoryJson: Record<string, { hours: number; ci95Low: number; ci95High: number }> = {};
  const deltaAllocationJson: Record<string, number> = {};
  const techTactMentalPhysJson: Record<string, { tek: number; tak: number; mental: number; fys: number }> = {};
  const rootCauseJson: Record<string, string> = {};

  for (const alloc of output.allocations) {
    hoursPerCategoryJson[alloc.category] = {
      hours: alloc.estimatedHours,
      ci95Low: alloc.ci95Low,
      ci95High: alloc.ci95High,
    };
    deltaAllocationJson[alloc.category] = alloc.deltaSg;
    techTactMentalPhysJson[alloc.category] = alloc.techTactMentalPhys;
    rootCauseJson[alloc.category] = alloc.rootCause;
  }

  const forecastId = nanoid();
  await prisma.coachingForecast.create({
    data: {
      id: forecastId,
      userId: req.userId,
      modelVersion: output.modelVersion,
      currentScoreAvg: output.currentState.scoreAvg,
      currentSgTotal: output.currentState.sgTotal,
      currentSgOtt: output.currentState.sgOtt,
      currentSgApp: output.currentState.sgApp,
      currentSgArg: output.currentState.sgArg,
      currentSgPutt: output.currentState.sgPutt,
      currentCategory: output.currentState.category,
      currentAge: req.age,
      currentHoursPerWk: req.hoursPerWeek,
      targetScoreAvg: req.targetScoreAvg,
      targetCategory: output.target.category,
      deadline: req.deadline,
      avgCourseRating: req.avgCourseRating,
      avgSlopeRating: req.avgSlopeRating,
      requiredSgDelta: output.target.requiredSgDelta,
      deltaAllocationJson,
      estimatedTotalHours: output.estimatedTotalHours,
      estimatedHoursCi95Low: output.estimatedHoursCi95Low,
      estimatedHoursCi95High: output.estimatedHoursCi95High,
      estimatedHoursPerWeek: output.requiredHoursPerWeek,
      hoursPerCategoryJson,
      techTactMentalPhysJson,
      probabilityOfSuccess: output.probabilityOfSuccess,
      confidenceInterval95: output.confidenceInterval95,
      monteCarloRuns: output.monteCarloRuns,
      primaryFocusCategory: output.primaryFocusCategory,
      rootCauseJson,
      recommendationsJson: output.recommendations,
      assumptionsJson: output.assumptions,
    },
  });

  return { output, forecastId };
}

/**
 * Hent spillerens siste forecast.
 */
export async function getLatestForecast(prisma: PrismaClient, userId: string) {
  return prisma.coachingForecast.findFirst({
    where: { userId },
    orderBy: { generatedAt: "desc" },
  });
}

/**
 * List alle forecasts for en spiller (for backtesting-visning).
 */
export async function listForecasts(
  prisma: PrismaClient,
  userId: string,
  options: { limit?: number } = {},
) {
  return prisma.coachingForecast.findMany({
    where: { userId },
    orderBy: { generatedAt: "desc" },
    take: options.limit ?? 20,
  });
}

/**
 * Fyll inn faktisk utfall for en forecast (brukes av backtesting-CRON).
 * Setter actualScoreAvg, actualSgTotal, withinCi95, predictionErrorSg.
 */
export async function backfillActualOutcome(
  prisma: PrismaClient,
  forecastId: string,
  actual: {
    scoreAvg: number;
    sgTotal: number;
    hoursSpent?: number;
    measuredAt: Date;
  },
): Promise<void> {
  const forecast = await prisma.coachingForecast.findUnique({
    where: { id: forecastId },
  });
  if (!forecast) throw new Error(`Forecast ${forecastId} finnes ikke`);

  // Beregn om faktisk SG-delta var innenfor 95% CI
  const actualDelta = actual.sgTotal - forecast.currentSgTotal;
  const ci = forecast.confidenceInterval95 as [number, number];
  const withinCi95 = actualDelta >= ci[0] && actualDelta <= ci[1];

  // Prediction error: faktisk − predikert SG_delta
  const predictionErrorSg = actualDelta - forecast.requiredSgDelta;

  await prisma.coachingForecast.update({
    where: { id: forecastId },
    data: {
      actualScoreAvg: actual.scoreAvg,
      actualSgTotal: actual.sgTotal,
      actualHoursSpent: actual.hoursSpent,
      actualOutcomeMeasuredAt: actual.measuredAt,
      withinCi95,
      predictionErrorSg,
    },
  });
}

/**
 * Finn alle forecasts hvor deadline har passert men faktisk utfall ikke er logget.
 * Brukes av CRON-jobben.
 */
export async function findForecastsReadyForBacktest(
  prisma: PrismaClient,
  now: Date = new Date(),
) {
  return prisma.coachingForecast.findMany({
    where: {
      deadline: { lte: now },
      actualOutcomeMeasuredAt: null,
    },
    orderBy: { deadline: "asc" },
  });
}
