"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

/**
 * getStudent360 — henter alle 9 datagrupper for Spillerprofil 360°.
 * Designfasit: public/design-reference/student-360-reference.html
 *
 * **STATUS:** Foreløpig stub-data for de fleste feltene. Ekte Prisma-queries
 * wirer vi opp som separat oppgave (Sprint 4 + Sprint 6). Identity og enkelte
 * coaching-data hentes ekte. Resten er realistisk dummy basert på faktisk bruker.
 *
 * **TODO Bekreft med Anders:**
 *  - SG-beregningsmetode (i dag enkel proxy fra dispersion)
 *  - Churn-risiko-modell (i dag basert på betalingsstatus alene)
 *  - LTV-formel (i dag totalPaid + 12 mnd MRR * 0.7 retention)
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

  // Hent faktisk bruker (ekte data)
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

  // ───────── Identity (ekte data) ─────────
  const tier = dbUser.subscriptionTier;
  const identity: IdentityGroup = {
    name: dbUser.name,
    email: dbUser.email,
    phone: dbUser.phone,
    image: dbUser.image,
    klubb: "GFGK Bossum", // TODO: hent fra klubb-relasjon
    golfboxId: null, // TODO: hent fra UserGolfId
    abonnement: tier && tier !== "VISITOR"
      ? {
          name: prettifyTier(tier),
          pricePerMonthKr: tierPriceKr(tier),
          nextChargeDate: addMonths(new Date(), 1),
        }
      : null,
    laeringsstil: "Visuell", // TODO: hent fra MentalProfile
    memberSince: dbUser.createdAt,
  };

  // ───────── Golf (stub-data, realistic) ─────────
  // TODO: wire opp ekte handicap fra HandicapEntry-modellen
  const stubHcpHistory = makeHcpTrend(12.4, 6);
  const golf: GolfGroup = {
    hcpNow: 12.4,
    hcpDelta30d: -0.8,
    hcpHistory: stubHcpHistory,
    ferdighetsnivaa: "D",
    sgTotal: 1.8,
    sgDelta: 0.4,
    sgBreakdown: { driver: 0.4, approach: 0.7, aroundGreen: -0.2, putting: 0.9 },
    datagolfBenchmark: {
      peerName: "Wyndham Clark (PGA Tour)",
      reason: "Sterk approach + putt, svak rundt grønn",
    },
  };

  // ───────── Coaching (delvis ekte) ─────────
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

  const coaching: CoachingGroup = {
    lastFiveSessions: recentSessions.map((s) => ({
      id: s.id,
      date: s.sessionDate,
      title: s.primaryFocus ?? "Coaching-økt",
      instructorName: s.Instructor?.User?.name ?? "Anders",
      durationMinutes: 60,
      location: null,
      publishedToStudent: s.publishedToStudent,
    })),
    nextSession: {
      id: "stub-next",
      startTime: addHours(new Date(), 2),
      title: "Driver setup — kontroll av rightward bias",
      durationMinutes: 60,
      location: "Bossum range",
    },
    focusAreas: ["Driver setup", "Putting holdover", "Wedge 50–80m"],
  };

  // ───────── Training (stub) ─────────
  // TODO: wire opp ekte TrainingPlan + sessions
  const training: TrainingGroup = {
    hoursPerWeek: 3.2,
    drillsActive: 14,
    completionPct: 82,
    drills: [
      { id: "d1", name: "6 fot putting drill", phase: "Steg 3" },
      { id: "d2", name: "Wedge 50 m presisjon", phase: "Steg 2" },
      { id: "d3", name: "7-jern dispersion", phase: "Steg 4" },
    ],
  };

  // ───────── Mental (stub) ─────────
  // TODO: wire opp ekte MentalProfile
  const mental: MentalGroup = {
    trykktoleranse: 78,
    selvtillit: 65,
    aksept: 48,
    fokus: 82,
  };

  // ───────── Forecast (stub) ─────────
  // TODO: wire opp ekte CoachingForecast
  const forecast: ForecastGroup = {
    nextRoundEstimate: 76.4,
    nextRoundCi95: { low: 73, high: 80 },
    hcp6mEstimate: 10.2,
    hcp6mCi95: { low: 8.8, high: 11.6 },
    utviklingspotensial: 87,
    norwegianPercentile: 88,
  };

  // ───────── Tests (stub) ─────────
  // TODO: wire opp ekte TestResult
  const tests: TestsGroup = {
    results: [
      {
        id: "t1",
        testName: "50-100-150",
        value: 42,
        isPersonalBest: true,
        completedAt: addDaysAgo(13),
        nextRetestAt: addDaysAgo(-43),
        isOverdue: false,
      },
      {
        id: "t2",
        testName: "9-hull challenge",
        value: 3,
        isPersonalBest: false,
        completedAt: addDaysAgo(20),
        nextRetestAt: addDaysAgo(-37),
        isOverdue: false,
      },
      {
        id: "t3",
        testName: "3-putt avoidance",
        value: 15,
        isPersonalBest: false,
        completedAt: addDaysAgo(28),
        nextRetestAt: addDaysAgo(-29),
        isOverdue: true,
      },
    ],
  };

  // ───────── Economy (stub, kommer ekte i Sprint 2) ─────────
  // TODO: wire opp ekte PaymentTransaction-data fra Sprint 2
  const economy: EconomyGroup = {
    ltv: 52800,
    mrrContribution: tier ? tierPriceKr(tier) : 2000,
    marginPerSession: 340,
    marginPct: 68,
    churnRiskLevel: "LAV",
    churnRiskScore: 12,
    nextChargeAt: addMonths(new Date(), 1),
    paymentStatus: "OK",
    stripeOk: true,
  };

  // ───────── Signals (stub, kommer ekte i Sprint 3) ─────────
  // TODO: wire opp ekte DegradationTracking og MetricSnapshot
  const signals: SignalsGroup = {
    signals: [
      {
        id: "s1",
        type: "FRAMGANG",
        title: "Eleven er i framgang — putting",
        description: "+0.4 SG på putting siste 5 runder. Hold momentum med 6 fot drill 3x/uke.",
        detectedAt: addDaysAgo(2),
        source: "AI Coach",
      },
      {
        id: "s2",
        type: "TILBAKEGANG",
        title: "Wedge 50–80 m — tilbakegang oppdaget",
        description: "SG -0.6 over siste 5 runder. Anbefal ekstra wedge-fokus i neste økt.",
        detectedAt: addDaysAgo(4),
        source: "Sporing av tilbakegang",
      },
    ],
  };

  return {
    studentId,
    identity,
    golf,
    coaching,
    training,
    mental,
    forecast,
    tests,
    economy,
    signals,
  };
}

// ───────────────────────────────────────────────────────────────────────
// Hjelpefunksjoner
// ───────────────────────────────────────────────────────────────────────

function addDaysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d;
}

function addMonths(d: Date, months: number): Date {
  const r = new Date(d);
  r.setMonth(r.getMonth() + months);
  return r;
}

function addHours(d: Date, hours: number): Date {
  const r = new Date(d);
  r.setHours(r.getHours() + hours);
  return r;
}

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

function tierPriceKr(tier: string): number {
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

function makeHcpTrend(currentHcp: number, months: number): Array<{ date: Date; hcp: number }> {
  const trend: Array<{ date: Date; hcp: number }> = [];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const hcpOffset = i * 0.6 + (Math.random() * 0.4 - 0.2);
    trend.push({ date: d, hcp: round1(currentHcp + hcpOffset) });
  }
  return trend;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}
