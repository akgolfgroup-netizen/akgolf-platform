import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildForecastInput,
  runAndSaveForecast,
  getLatestForecast,
  listForecasts,
  backfillActualOutcome,
  findForecastsReadyForBacktest,
  type GenerateForecastRequest,
} from "@/lib/portal/predictions/coaching-forecast-service";
import type { PrismaClient } from "@prisma/client";

// ── Mock Prisma ────────────────────────────────────────────────────

interface MockRoundStat {
  id: string;
  userId: string;
  date: Date;
  totalScore: number | null;
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
}

interface MockForecast {
  id: string;
  userId: string;
  generatedAt: Date;
  deadline: Date;
  currentSgTotal: number;
  requiredSgDelta: number;
  confidenceInterval95: [number, number];
  actualOutcomeMeasuredAt: Date | null;
  [key: string]: unknown;
}

function createMockPrisma(opts: {
  rounds?: MockRoundStat[];
  forecasts?: MockForecast[];
} = {}): PrismaClient {
  const rounds = opts.rounds ?? [];
  const forecasts: MockForecast[] = opts.forecasts ?? [];

  const prisma = {
    roundStats: {
      findMany: vi.fn(async (query: { where?: { userId?: string }; take?: number }) => {
        const filtered = rounds.filter(
          (r) => !query.where?.userId || r.userId === query.where.userId,
        );
        return filtered.slice(0, query.take ?? filtered.length);
      }),
    },
    coachingForecast: {
      create: vi.fn(async (data: { data: MockForecast }) => {
        const withDefaults: MockForecast = {
          ...data.data,
          generatedAt: data.data.generatedAt ?? new Date(),
          actualOutcomeMeasuredAt: data.data.actualOutcomeMeasuredAt ?? null,
        };
        forecasts.push(withDefaults);
        return withDefaults;
      }),
      findFirst: vi.fn(async (query: { where?: { userId?: string } }) => {
        return (
          forecasts
            .filter((f) => !query.where?.userId || f.userId === query.where.userId)
            .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())[0] ?? null
        );
      }),
      findMany: vi.fn(
        async (query: {
          where?: Record<string, unknown>;
          orderBy?: unknown;
          take?: number;
        }) => {
          let result = forecasts.slice();
          const w = query.where as
            | {
                userId?: string;
                deadline?: { lte?: Date };
                actualOutcomeMeasuredAt?: null;
              }
            | undefined;
          if (w?.userId) result = result.filter((f) => f.userId === w.userId);
          if (w?.deadline?.lte)
            result = result.filter((f) => f.deadline <= w.deadline!.lte!);
          if ("actualOutcomeMeasuredAt" in (w ?? {}) && w?.actualOutcomeMeasuredAt === null)
            result = result.filter((f) => f.actualOutcomeMeasuredAt === null);
          return result.slice(0, query.take ?? result.length);
        },
      ),
      findUnique: vi.fn(async (query: { where: { id: string } }) => {
        return forecasts.find((f) => f.id === query.where.id) ?? null;
      }),
      update: vi.fn(async (args: { where: { id: string }; data: Partial<MockForecast> }) => {
        const idx = forecasts.findIndex((f) => f.id === args.where.id);
        if (idx >= 0) {
          forecasts[idx] = { ...forecasts[idx], ...args.data };
          return forecasts[idx];
        }
        throw new Error("not found");
      }),
    },
  } as unknown as PrismaClient;

  return prisma;
}

// ── Test data ──────────────────────────────────────────────────────

function emilRounds(userId: string, count = 15): MockRoundStat[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `r${i}`,
    userId,
    date: new Date(2026, 3, 1 + i),
    totalScore: 75,
    sgTotal: -0.8,
    sgOffTheTee: -0.3,
    sgApproach: -0.3,
    sgAroundTheGreen: -0.1,
    sgPutting: -0.1,
  }));
}

function emilRequest(overrides: Partial<GenerateForecastRequest> = {}): GenerateForecastRequest {
  return {
    userId: "emil-id",
    targetScoreAvg: 72,
    deadline: new Date(Date.now() + 52 * 7 * 24 * 60 * 60 * 1000),
    avgCourseRating: 71,
    avgSlopeRating: 125,
    hoursPerWeek: 18,
    age: 17,
    monteCarloRuns: 500,
    ...overrides,
  };
}

// ── buildForecastInput ─────────────────────────────────────────────

describe("buildForecastInput", () => {
  it("henter runder fra Prisma og konverterer til RoundInput", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    const input = await buildForecastInput(prisma, emilRequest());

    expect(input.rounds).toHaveLength(15);
    expect(input.rounds[0].sgTotal).toBe(-0.8);
    expect(input.rounds[0].courseRating).toBe(71);
    expect(input.rounds[0].slopeRating).toBe(125);
  });

  it("beregner weeksToDeadline korrekt", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    const req = emilRequest({
      deadline: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000),
    });
    const input = await buildForecastInput(prisma, req);
    expect(input.weeksToDeadline).toBeGreaterThanOrEqual(9);
    expect(input.weeksToDeadline).toBeLessThanOrEqual(11);
  });

  it("respekterer maxRounds-parameter", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id", 30) });
    const input = await buildForecastInput(prisma, emilRequest({ maxRounds: 10 }));
    expect(input.rounds.length).toBe(10);
  });

  it("filtrerer bare runder for riktig userId", async () => {
    const mixed = [...emilRounds("emil-id", 5), ...emilRounds("andre-id", 5)];
    const prisma = createMockPrisma({ rounds: mixed });
    const input = await buildForecastInput(prisma, emilRequest());
    expect(input.rounds.length).toBe(5);
  });
});

// ── runAndSaveForecast ─────────────────────────────────────────────

describe("runAndSaveForecast", () => {
  it("kjører motoren og lagrer resultatet", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    const { output, forecastId } = await runAndSaveForecast(prisma, emilRequest());

    expect(forecastId).toBeTruthy();
    expect(output.currentState.sgTotal).toBeCloseTo(-0.8, 1);
    expect(output.primaryFocusCategory).toBe("APP");
    expect(prisma.coachingForecast.create).toHaveBeenCalledOnce();
  });

  it("lagrer alle output-felter til riktig schema", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    await runAndSaveForecast(prisma, emilRequest());

    const createCall = vi.mocked(prisma.coachingForecast.create).mock.calls[0][0];
    const data = createCall.data as Record<string, unknown>;
    expect(data.userId).toBe("emil-id");
    expect(data.modelVersion).toMatch(/methodology-/);
    expect(data.currentSgTotal).toBeCloseTo(-0.8, 1);
    expect(data.targetScoreAvg).toBe(72);
    expect(data.avgCourseRating).toBe(71);
    expect(data.monteCarloRuns).toBe(500);
    expect(data.assumptionsJson).toBeInstanceOf(Array);
    expect(data.recommendationsJson).toBeInstanceOf(Array);
    expect(data.hoursPerCategoryJson).toHaveProperty("APP");
  });
});

// ── getLatestForecast + listForecasts ──────────────────────────────

describe("getLatestForecast og listForecasts", () => {
  it("returnerer null når ingen forecast finnes", async () => {
    const prisma = createMockPrisma();
    const result = await getLatestForecast(prisma, "emil-id");
    expect(result).toBeNull();
  });

  it("henter nyeste forecast først", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    await runAndSaveForecast(prisma, emilRequest());
    // Vent litt og lag en ny
    await new Promise((r) => setTimeout(r, 5));
    await runAndSaveForecast(prisma, emilRequest({ hoursPerWeek: 20 }));

    const latest = await getLatestForecast(prisma, "emil-id");
    expect(latest).not.toBeNull();
  });

  it("listForecasts respekterer limit", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    await runAndSaveForecast(prisma, emilRequest());
    await runAndSaveForecast(prisma, emilRequest({ hoursPerWeek: 20 }));
    await runAndSaveForecast(prisma, emilRequest({ hoursPerWeek: 25 }));

    const list = await listForecasts(prisma, "emil-id", { limit: 2 });
    expect(list.length).toBeLessThanOrEqual(2);
  });
});

// ── backfillActualOutcome ──────────────────────────────────────────

describe("backfillActualOutcome", () => {
  it("fyller inn faktisk utfall og beregner withinCi95 + predictionErrorSg", async () => {
    const prisma = createMockPrisma({ rounds: emilRounds("emil-id") });
    const { forecastId } = await runAndSaveForecast(prisma, emilRequest());

    // Anta spilleren faktisk forbedret seg med 0.5 SG
    await backfillActualOutcome(prisma, forecastId, {
      scoreAvg: 72,
      sgTotal: -0.3,
      hoursSpent: 350,
      measuredAt: new Date(),
    });

    expect(prisma.coachingForecast.update).toHaveBeenCalledOnce();
    const updateCall = vi.mocked(prisma.coachingForecast.update).mock.calls[0][0];
    const data = updateCall.data as Record<string, unknown>;
    expect(data.actualSgTotal).toBe(-0.3);
    expect(data.actualHoursSpent).toBe(350);
    expect(typeof data.predictionErrorSg).toBe("number");
    expect(typeof data.withinCi95).toBe("boolean");
  });

  it("kaster feil ved ukjent forecastId", async () => {
    const prisma = createMockPrisma();
    await expect(
      backfillActualOutcome(prisma, "ukjent-id", {
        scoreAvg: 72,
        sgTotal: -0.3,
        measuredAt: new Date(),
      }),
    ).rejects.toThrow("finnes ikke");
  });
});

// ── findForecastsReadyForBacktest ─────────────────────────────────

describe("findForecastsReadyForBacktest", () => {
  it("returnerer forecasts med utløpt deadline og null outcome", async () => {
    const past = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const future = new Date(Date.now() + 52 * 7 * 24 * 60 * 60 * 1000);

    const prisma = createMockPrisma({
      forecasts: [
        {
          id: "f1",
          userId: "u1",
          generatedAt: new Date(),
          deadline: past,
          currentSgTotal: -0.8,
          requiredSgDelta: 0.5,
          confidenceInterval95: [0.2, 0.8],
          actualOutcomeMeasuredAt: null,
        },
        {
          id: "f2",
          userId: "u2",
          generatedAt: new Date(),
          deadline: future,
          currentSgTotal: -0.8,
          requiredSgDelta: 0.5,
          confidenceInterval95: [0.2, 0.8],
          actualOutcomeMeasuredAt: null,
        },
        {
          id: "f3",
          userId: "u3",
          generatedAt: new Date(),
          deadline: past,
          currentSgTotal: -0.8,
          requiredSgDelta: 0.5,
          confidenceInterval95: [0.2, 0.8],
          actualOutcomeMeasuredAt: new Date(), // allerede logget
        },
      ],
    });

    const ready = await findForecastsReadyForBacktest(prisma);
    expect(ready).toHaveLength(1);
    expect(ready[0].id).toBe("f1");
  });
});
