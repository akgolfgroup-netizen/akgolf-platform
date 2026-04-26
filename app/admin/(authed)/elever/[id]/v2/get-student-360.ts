"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { getStudentEconomy } from "@/lib/portal/economy/student-metrics";

/**
 * getStudent360 — henter alle 9 datagrupper for Spillerprofil 360°.
 * Designfasit: public/design-reference/student-360-reference.html
 *
 * Wirer mot ekte Prisma-modeller der det er tilgjengelig:
 *   - User + UserGolfId + AppSubscription (identity)
 *   - HandicapEntry (golf historikk)
 *   - CoachingForecast (siste prognose)
 *   - MentalProfile (mental-skår)
 *   - TestResult + TestDefinition (tester)
 *   - getStudentEconomy() (økonomi via Sprint 2)
 *   - DegradationTracking (signaler)
 *   - TrainingPlan + TrainingPlanWeek (trening)
 *   - CoachingSession (coaching)
 *
 * **TODO:**
 *  - SG-breakdown krever USISnapshot-modell (ikke i schema enda)
 *  - DataGolf benchmark krever pgaPlayerId-mapping (Sprint 4 cache finnes)
 */

export interface Student360Data {
  studentId: string;
  identity: IdentityGroup;
  golf: GolfGroup;
  coaching: CoachingGroup;
  training: TrainingGroup;
  mental: MentalGroup;
  forecast: ForecastGroup;
  tests: TestsGroup;
  economy: EconomyGroup;
  signals: SignalsGroup;
}

export interface IdentityGroup {
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  klubb: string | null;
  golfboxId: string | null;
  abonnement: { name: string; pricePerMonthKr: number; nextChargeDate: Date | null } | null;
  laeringsstil: string | null;
  memberSince: Date | null;
}

export interface GolfGroup {
  hcpNow: number | null;
  hcpDelta30d: number | null;
  hcpHistory: Array<{ date: Date; hcp: number }>;
  ferdighetsnivaa: string | null;
  sgTotal: number | null;
  sgDelta: number | null;
  sgBreakdown: { driver: number; approach: number; aroundGreen: number; putting: number };
  datagolfBenchmark: { peerName: string; reason: string } | null;
}

export interface CoachingGroup {
  lastFiveSessions: Array<{
    id: string;
    date: Date;
    title: string;
    instructorName: string;
    durationMinutes: number;
    location: string | null;
    publishedToStudent: boolean;
  }>;
  nextSession: { id: string; startTime: Date; title: string; durationMinutes: number; location: string | null } | null;
  focusAreas: string[];
}

export interface TrainingGroup {
  hoursPerWeek: number;
  drillsActive: number;
  completionPct: number;
  drills: Array<{ id: string; name: string; phase: string }>;
}

export interface MentalGroup {
  trykktoleranse: number | null;
  selvtillit: number | null;
  aksept: number | null;
  fokus: number | null;
}

export interface ForecastGroup {
  nextRoundEstimate: number | null;
  nextRoundCi95: { low: number; high: number } | null;
  hcp6mEstimate: number | null;
  hcp6mCi95: { low: number; high: number } | null;
  utviklingspotensial: number | null;
  norwegianPercentile: number | null;
}

export interface TestsGroup {
  results: Array<{
    id: string;
    testName: string;
    value: number;
    isPersonalBest: boolean;
    completedAt: Date;
    nextRetestAt: Date | null;
    isOverdue: boolean;
  }>;
}

export interface EconomyGroup {
  ltv: number;
  mrrContribution: number;
  marginPerSession: number;
  marginPct: number;
  churnRiskLevel: "LAV" | "MEDIUM" | "HOY";
  churnRiskScore: number;
  nextChargeAt: Date | null;
  paymentStatus: string;
  stripeOk: boolean;
}

export interface SignalsGroup {
  signals: Array<{
    id: string;
    type: "FRAMGANG" | "TILBAKEGANG" | "INFO";
    title: string;
    description: string;
    detectedAt: Date;
    source: string;
  }>;
}

// ───────────────────────────────────────────────────────────────────────
// Hovedfunksjon
// ───────────────────────────────────────────────────────────────────────

export async function getStudent360(studentId: string): Promise<Student360Data | null> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
      subscriptionTier: true,
    },
  });

  if (!dbUser) return null;

  const [userGolfId, activeSub] = await Promise.all([
    prisma.userGolfId.findUnique({ where: { userId: studentId } }).catch(() => null),
    prisma.appSubscription.findFirst({
      where: { userId: studentId, status: "ACTIVE" },
      orderBy: { currentPeriodStart: "desc" },
      include: { AppModule: { select: { name: true, monthlyPriceNok: true } } },
    }).catch(() => null),
  ]);

  const tier = dbUser.subscriptionTier;

  const identity: IdentityGroup = {
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    image: dbUser.image,
    klubb: userGolfId?.clubName ?? null,
    golfboxId: userGolfId?.golfboxId ?? null,
    abonnement: activeSub?.AppModule
      ? {
          name: activeSub.AppModule.name,
          pricePerMonthKr: activeSub.AppModule.monthlyPriceNok ?? tierPriceKr(tier),
          nextChargeDate: activeSub.currentPeriodEnd,
        }
      : tier && tier !== "VISITOR"
        ? { name: prettifyTier(tier), pricePerMonthKr: tierPriceKr(tier), nextChargeDate: null }
        : null,
    laeringsstil: null,
    memberSince: dbUser.createdAt,
  };

  // ───────── Golf (HandicapEntry historikk) ─────────
  const hcpEntries = await prisma.handicapEntry.findMany({
    where: { userId: studentId },
    orderBy: { date: "desc" },
    take: 50,
    select: { date: true, handicapIndex: true },
  }).catch(() => []);

  const hcpNow = hcpEntries[0]?.handicapIndex ?? userGolfId?.handicap ?? null;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const hcp30dAgo = hcpEntries.find((e) => e.date <= thirtyDaysAgo)?.handicapIndex ?? null;
  const hcpDelta30d = hcpNow !== null && hcp30dAgo !== null ? round1(hcpNow - hcp30dAgo) : null;
  const hcpHistory = hcpEntries
    .slice()
    .reverse()
    .slice(-12)
    .map((e) => ({ date: e.date, hcp: e.handicapIndex }));

  const golf: GolfGroup = {
    hcpNow,
    hcpDelta30d,
    hcpHistory,
    ferdighetsnivaa: hcpNow !== null ? hcpToCategory(hcpNow) : null,
    sgTotal: null,
    sgDelta: null,
    sgBreakdown: { driver: 0, approach: 0, aroundGreen: 0, putting: 0 },
    datagolfBenchmark: null,
  };

  // ───────── Coaching ─────────
  const recentSessions = await prisma.coachingSession
    .findMany({
      where: { studentId },
      orderBy: { sessionDate: "desc" },
      take: 5,
      include: {
        Instructor: { select: { User: { select: { name: true } } } },
      },
    })
    .catch(() => []);

  const upcomingBooking = await prisma.booking
    .findFirst({
      where: { studentId, startTime: { gte: new Date() }, status: { in: ["CONFIRMED", "PENDING"] } },
      orderBy: { startTime: "asc" },
      include: {
        ServiceType: { select: { name: true, duration: true } },
        Instructor: { select: { User: { select: { name: true } } } },
      },
    })
    .catch(() => null);

  const coaching: CoachingGroup = {
    lastFiveSessions: recentSessions.map((s) => ({
      id: s.id,
      date: s.sessionDate,
      title: s.primaryFocus ?? "Coaching-økt",
      instructorName: s.Instructor?.User?.name ?? "Ukjent trener",
      durationMinutes: 60,
      location: null,
      publishedToStudent: s.publishedToStudent,
    })),
    nextSession: upcomingBooking
      ? {
          id: upcomingBooking.id,
          startTime: upcomingBooking.startTime,
          title: upcomingBooking.ServiceType?.name ?? "Coaching-økt",
          durationMinutes: upcomingBooking.ServiceType?.duration ?? 60,
          location: null,
        }
      : null,
    focusAreas: extractFocusAreas(recentSessions),
  };

  // ───────── Training (TrainingPlan + sessions via separate queries) ─────────
  const activePlan = await prisma.trainingPlan
    .findFirst({
      where: { studentId, isActive: true },
      orderBy: { startDate: "desc" },
    })
    .catch(() => null);

  let hoursPerWeek = 0;
  let drillsActive = 0;
  let completionPct = 0;
  const drills: Array<{ id: string; name: string; phase: string }> = [];

  if (activePlan) {
    const weeks = await prisma.trainingPlanWeek
      .findMany({
        where: { planId: activePlan.id },
        orderBy: { weekStart: "desc" },
        take: 4,
        include: {
          TrainingPlanSession: {
            select: { id: true, focusArea: true, durationMinutes: true },
          },
        },
      })
      .catch(() => []);

    const allSessions = weeks.flatMap((w) => w.TrainingPlanSession);
    // Completion via TrainingLog (separate query)
    const sessionIds = allSessions.map((s) => s.id);
    const logs = sessionIds.length > 0
      ? await prisma.trainingLog
          .findMany({
            where: { planSessionId: { in: sessionIds }, userId: studentId },
            select: { planSessionId: true },
          })
          .catch(() => [])
      : [];
    const loggedSet = new Set(logs.map((l) => l.planSessionId).filter((id): id is string => id !== null));
    completionPct = allSessions.length > 0
      ? Math.round((allSessions.filter((s) => loggedSet.has(s.id)).length / allSessions.length) * 100)
      : 0;
    const totalMinutes = allSessions.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
    const weekCount = weeks.length || 1;
    hoursPerWeek = round1(totalMinutes / 60 / weekCount);
    drillsActive = allSessions.length;
    for (const s of allSessions.slice(0, 3)) {
      drills.push({ id: s.id, name: s.focusArea ?? "Trening", phase: "Aktiv" });
    }
  }

  const training: TrainingGroup = { hoursPerWeek, drillsActive, completionPct, drills };

  // ───────── Mental ─────────
  const mp = await prisma.mentalProfile
    .findUnique({ where: { userId: studentId } })
    .catch(() => null);

  const mental: MentalGroup = {
    trykktoleranse: mp ? Math.round(((mp.pressureTolerance ?? 0) / 5) * 100) : null,
    selvtillit: mp?.baselineConfidence ?? null,
    aksept: mp?.acceptanceRate !== null && mp?.acceptanceRate !== undefined
      ? Math.round((mp.acceptanceRate ?? 0) * 100)
      : null,
    fokus: mp?.focusBaseline ?? null,
  };

  // ───────── Forecast (siste CoachingForecast) ─────────
  const lastForecast = await prisma.coachingForecast
    .findFirst({
      where: { userId: studentId },
      orderBy: { generatedAt: "desc" },
    })
    .catch(() => null);

  let forecastGroup: ForecastGroup = {
    nextRoundEstimate: null,
    nextRoundCi95: null,
    hcp6mEstimate: null,
    hcp6mCi95: null,
    utviklingspotensial: null,
    norwegianPercentile: null,
  };

  if (lastForecast) {
    const ci95 = Array.isArray(lastForecast.confidenceInterval95)
      ? (lastForecast.confidenceInterval95 as unknown as [number, number])
      : null;
    forecastGroup = {
      nextRoundEstimate: round1(lastForecast.targetScoreAvg),
      nextRoundCi95: ci95 ? { low: round1(ci95[0]), high: round1(ci95[1]) } : null,
      hcp6mEstimate: hcpNow !== null ? round1(hcpNow - lastForecast.requiredSgDelta * 2) : null,
      hcp6mCi95: hcpNow !== null
        ? { low: round1(hcpNow - lastForecast.requiredSgDelta * 2.5), high: round1(hcpNow - lastForecast.requiredSgDelta * 1.5) }
        : null,
      utviklingspotensial: Math.round(lastForecast.probabilityOfSuccess * 100),
      norwegianPercentile: null,
    };
  }

  // ───────── Tests ─────────
  const testResults = await prisma.testResult
    .findMany({
      where: { userId: studentId },
      orderBy: { createdAt: "desc" },
      take: 10,
    })
    .catch(() => []);

  const testNumbers = [...new Set(testResults.map((t) => t.testNumber))];
  const testDefs = testNumbers.length > 0
    ? await prisma.testDefinition
        .findMany({ where: { testNumber: { in: testNumbers } }, select: { testNumber: true, name: true } })
        .catch(() => [])
    : [];
  const testNameMap = new Map(testDefs.map((d) => [d.testNumber, d.name]));

  // Personal best per testNumber
  const bestPerTest = new Map<number, number>();
  for (const t of testResults) {
    const prev = bestPerTest.get(t.testNumber);
    if (prev === undefined || t.value > prev) bestPerTest.set(t.testNumber, t.value);
  }

  const RETEST_INTERVAL_DAYS = 56;
  const tests: TestsGroup = {
    results: testResults.map((t) => {
      const nextRetestAt = new Date(t.createdAt);
      nextRetestAt.setDate(nextRetestAt.getDate() + RETEST_INTERVAL_DAYS);
      return {
        id: t.id,
        testName: testNameMap.get(t.testNumber) ?? `Test #${t.testNumber}`,
        value: t.value,
        isPersonalBest: bestPerTest.get(t.testNumber) === t.value,
        completedAt: t.createdAt,
        nextRetestAt,
        isOverdue: nextRetestAt < new Date(),
      };
    }),
  };

  // ───────── Economy (ekte via getStudentEconomy fra Sprint 2) ─────────
  const econ = await getStudentEconomy(studentId).catch(() => null);
  const economy: EconomyGroup = econ
    ? {
        ltv: econ.ltvKr,
        mrrContribution: econ.mrrContributionKr,
        marginPerSession: econ.marginPerSessionKr,
        marginPct: econ.marginPct,
        churnRiskLevel: econ.churnRiskLevel,
        churnRiskScore: econ.churnRiskScore,
        nextChargeAt: activeSub?.currentPeriodEnd ?? null,
        paymentStatus: econ.failedPayments30d > 0 ? "ATTENTION" : "OK",
        stripeOk: econ.failedPayments30d === 0,
      }
    : {
        ltv: 0,
        mrrContribution: 0,
        marginPerSession: 0,
        marginPct: 0,
        churnRiskLevel: "LAV",
        churnRiskScore: 0,
        nextChargeAt: null,
        paymentStatus: "UNKNOWN",
        stripeOk: false,
      };

  // ───────── Signals (DegradationTracking + framgang fra MetricSnapshot) ─────────
  const degradations = await prisma.degradationTracking
    .findMany({
      where: { userId: studentId },
      orderBy: { lastUpdated: "desc" },
      take: 5,
    })
    .catch(() => []);

  const signals: SignalsGroup = {
    signals: degradations.map((d) => ({
      id: d.id,
      type: "TILBAKEGANG" as const,
      title: `${d.shotType} — tilbakegang oppdaget`,
      description: d.technicalChange,
      detectedAt: d.startedAt,
      source: "Sporing av tilbakegang",
    })),
  };

  return {
    studentId,
    identity,
    golf,
    coaching,
    training,
    mental,
    forecast: forecastGroup,
    tests,
    economy,
    signals,
  };
}

// ───────────────────────────────────────────────────────────────────────
// Hjelpefunksjoner
// ───────────────────────────────────────────────────────────────────────

function prettifyTier(tier: string): string {
  switch (tier) {
    case "PRO":
      return "Performance Pro";
    case "STARTER":
      return "Performance";
    case "ACADEMY":
      return "Academy";
    case "ELITE":
      return "Elite";
    default:
      return tier;
  }
}

function tierPriceKr(tier: string | null): number {
  switch (tier) {
    case "PRO":
      return 2000;
    case "STARTER":
      return 1600;
    case "ACADEMY":
      return 1295;
    case "ELITE":
      return 4000;
    default:
      return 0;
  }
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * HCP → Ferdighetsnivå A-K (AK Golf-skala).
 * A er høyest (proff/ekspert), K er lavest (nybegynner).
 */
function hcpToCategory(hcp: number): string {
  if (hcp <= 0) return "A";
  if (hcp <= 2) return "B";
  if (hcp <= 5) return "C";
  if (hcp <= 9) return "D";
  if (hcp <= 13) return "E";
  if (hcp <= 18) return "F";
  if (hcp <= 24) return "G";
  if (hcp <= 30) return "H";
  if (hcp <= 36) return "I";
  if (hcp <= 45) return "J";
  return "K";
}

function extractFocusAreas(sessions: Array<{ primaryFocus: string | null }>): string[] {
  const counts = new Map<string, number>();
  for (const s of sessions) {
    if (!s.primaryFocus) continue;
    counts.set(s.primaryFocus, (counts.get(s.primaryFocus) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([focus]) => focus);
}
