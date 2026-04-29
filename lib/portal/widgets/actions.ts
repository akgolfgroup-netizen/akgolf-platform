"use server";

/**
 * Widget Server Actions — typed datakilder for dashboard-widgets.
 *
 * Hver action:
 *  - Bruker `requirePortalUser()` for auth.
 *  - Returnerer `null`/tomme arrays ved feil (kaster aldri 500 til UI).
 *  - Henter fra Prisma med PascalCase-relasjoner (`User`, `HandicapEntry`, ...).
 *
 * Widget-komponentene er ikke koblet til UI ennå. Disse actionene er klare
 * når widgets aktiveres i dashboard.
 */

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { PYRAMIDE } from "@/lib/portal/training/ak-taxonomy";

// ── Returtyper ───────────────────────────────────────────

export interface LeaderboardEntry {
  name: string;
  hcp: number;
  trend: number;
  rank: number;
  isMe: boolean;
}

export interface NextCompetition {
  daysLeft: number;
  tournamentName: string;
  date: Date;
  location: string | null;
}

export interface TrainingVolumeBucket {
  name: string;
  hours: number;
  color: string;
}

export interface DegradationAlert {
  name: string;
  status: "good" | "warning" | "alert";
  score: number;
  change: number;
}

export interface MentalTrend {
  label: string;
  value: number;
  trend: number;
  benchmark: number;
}

export interface SeasonPlanMonth {
  name: string;
  phase: string;
  active: boolean;
}

export interface RecentCoachingFeedback {
  coach: string;
  date: Date;
  rating: number | null;
  text: string;
  focusArea: string | null;
}

export interface PlanProgress {
  planName: string;
  completed: number;
  total: number;
  percentage: number;
}

export interface PeriodSummaryPhase {
  name: string;
  weeks: number;
  completed: boolean;
  active: boolean;
}

// ── Konstanter ───────────────────────────────────────────

const MAANEDER_KORT = [
  "Jan", "Feb", "Mar", "Apr", "Mai", "Jun",
  "Jul", "Aug", "Sep", "Okt", "Nov", "Des",
];

const LEADERBOARD_USER_LIMIT = 500;
const STREAK_TRAINING_LOOKBACK_DAYS = 365;

// ── Hjelpefunksjoner ─────────────────────────────────────

function daysBetween(a: Date, b: Date): number {
  const ms = a.getTime() - b.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

/**
 * Mapper TrainingLog.focusArea (fri tekst eller pyramide-kode) til en
 * pyramide-kategori. Bruker PYRAMIDE som single source of truth — koden
 * trenger ikke aliaser fordi PYRAMIDE.code matcher direkte.
 */
function categorizeFocusArea(focusArea: string | null): string | null {
  if (!focusArea) return null;
  const upper = focusArea.toUpperCase();
  for (const level of PYRAMIDE) {
    if (
      upper === level.code ||
      upper === level.label.toUpperCase() ||
      upper.startsWith(`${level.code}_`)
    ) {
      return level.label;
    }
  }
  return null;
}

/**
 * Felles wrapper for alle widget-actions: requirePortalUser + try/catch +
 * fallback. Kutter ~120 linjer copy-paste try/catch og sentraliserer
 * feil-loggformat.
 */
async function withWidgetGuard<T>(
  name: string,
  fallback: T,
  fn: () => Promise<T>,
): Promise<T> {
  try {
    await requirePortalUser();
    return await fn();
  } catch (error) {
    console.error(`[widgets/${name}] failed:`, error);
    return fallback;
  }
}

// ── Actions ──────────────────────────────────────────────

/**
 * Topp 5 spillere etter HCP. Trend = current - 30d siden.
 *
 * Cap pa antall hentede brukere er LEADERBOARD_USER_LIMIT (500). Med flere
 * spillere bor dette skrives om til DISTINCT ON (raw SQL) for a finne kun
 * topp 5 i DB i stedet for a laste alle og sortere i JS.
 */
export async function getLeaderboard(
  currentUserId: string,
): Promise<LeaderboardEntry[]> {
  return withWidgetGuard("getLeaderboard", [], async () => {
    const users = await prisma.user.findMany({
      where: { role: "STUDENT", isActive: true },
      take: LEADERBOARD_USER_LIMIT,
      select: {
        id: true,
        name: true,
        // Kun siste + en eldre HCP — to entries er nok for trend.
        // 60 var unodvendig; siste er current og first match <= 30d gir trend.
        HandicapEntry: {
          orderBy: { date: "desc" },
          take: 12,
          select: { handicapIndex: true, date: true },
        },
      },
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ranked = users
      .map((u) => {
        const latest = u.HandicapEntry[0];
        if (!latest) return null;

        const past = u.HandicapEntry.find((e) => e.date <= thirtyDaysAgo);
        const trend = past ? latest.handicapIndex - past.handicapIndex : 0;

        return {
          userId: u.id,
          name: u.name ?? "Spiller",
          hcp: latest.handicapIndex,
          trend,
        };
      })
      .filter(
        (x): x is { userId: string; name: string; hcp: number; trend: number } =>
          x !== null,
      )
      .sort((a, b) => a.hcp - b.hcp)
      .slice(0, 5);

    return ranked.map((entry, index) => ({
      name: entry.name,
      hcp: entry.hcp,
      trend: entry.trend,
      rank: index + 1,
      isMe: entry.userId === currentUserId,
    }));
  });
}

/**
 * Naermeste fremtidige Tournament der userId har TournamentPrep.
 */
export async function getNextCompetition(
  userId: string,
): Promise<NextCompetition | null> {
  return withWidgetGuard("getNextCompetition", null, async () => {
    const now = new Date();
    const prep = await prisma.tournamentPrep.findFirst({
      where: { userId, Tournament: { startDate: { gte: now } } },
      orderBy: { Tournament: { startDate: "asc" } },
      select: {
        Tournament: {
          select: { name: true, startDate: true, location: true },
        },
      },
    });

    if (!prep?.Tournament) return null;

    return {
      daysLeft: Math.max(0, daysBetween(prep.Tournament.startDate, now)),
      tournamentName: prep.Tournament.name,
      date: prep.Tournament.startDate,
      location: prep.Tournament.location,
    };
  });
}

/**
 * Aggreger TrainingLog (timer) per pyramide-kategori for siste uke/maned.
 * Bruker PYRAMIDE som farge- og kategori-kilde.
 */
export async function getTrainingVolume(
  userId: string,
  period: "week" | "month",
): Promise<TrainingVolumeBucket[]> {
  return withWidgetGuard("getTrainingVolume", [], async () => {
    const since = new Date();
    if (period === "week") {
      since.setDate(since.getDate() - 7);
    } else {
      since.setMonth(since.getMonth() - 1);
    }

    const logs = await prisma.trainingLog.findMany({
      where: { userId, date: { gte: since } },
      select: { durationMinutes: true, focusArea: true },
    });

    const totals = new Map<string, number>();
    for (const level of PYRAMIDE) {
      totals.set(level.label, 0);
    }

    for (const log of logs) {
      const minutes = log.durationMinutes ?? 0;
      if (minutes <= 0) continue;
      const category = categorizeFocusArea(log.focusArea);
      if (!category) continue;
      totals.set(category, (totals.get(category) ?? 0) + minutes);
    }

    return PYRAMIDE.map((level) => ({
      name: level.label,
      hours: Math.round(((totals.get(level.label) ?? 0) / 60) * 10) / 10,
      color: level.color,
    }));
  });
}

/**
 * Siste DegradationTracking per skill-area (shotType).
 */
export async function getDegradationAlerts(
  userId: string,
): Promise<DegradationAlert[]> {
  return withWidgetGuard("getDegradationAlerts", [], async () => {
    const tracking = await prisma.degradationTracking.findMany({
      where: { userId },
      orderBy: { lastUpdated: "desc" },
      select: {
        shotType: true,
        tekScore: true,
        m0Score: true,
        m1Score: true,
      },
    });

    const seen = new Set<string>();
    const latest: typeof tracking = [];
    for (const item of tracking) {
      if (seen.has(item.shotType)) continue;
      seen.add(item.shotType);
      latest.push(item);
    }

    return latest.map((item) => {
      const score = item.tekScore ?? item.m0Score ?? 0;
      const change =
        item.m0Score != null && item.m1Score != null
          ? item.m0Score - item.m1Score
          : 0;

      let status: "good" | "warning" | "alert";
      if (score >= 75) status = "good";
      else if (score >= 50) status = "warning";
      else status = "alert";

      return {
        name: item.shotType,
        status,
        score: Math.round(score * 10) / 10,
        change: Math.round(change * 10) / 10,
      };
    });
  });
}

/**
 * Mental-trender — fra MentalProfile + siste 5 MentalScorecardEntry-snapshots.
 */
export async function getMentalTrends(userId: string): Promise<MentalTrend[]> {
  return withWidgetGuard("getMentalTrends", [], async () => {
    const [profile, snapshots] = await Promise.all([
      prisma.mentalProfile.findUnique({
        where: { userId },
        select: {
          baselineConfidence: true,
          pressureTolerance: true,
          focusBaseline: true,
          focusTrend: true,
          acceptanceRate: true,
        },
      }),
      prisma.mentalScorecardEntry.findMany({
        where: { userId },
        orderBy: { timestamp: "desc" },
        take: 5,
        select: {
          focusLevel: true,
          confidence: true,
          pressureLevel: true,
          acceptedResult: true,
        },
      }),
    ]);

    function avg(values: Array<number | null | undefined>): number {
      const filtered = values.filter(
        (v): v is number => typeof v === "number",
      );
      if (filtered.length === 0) return 0;
      return filtered.reduce((s, v) => s + v, 0) / filtered.length;
    }

    const focusAvg = avg(snapshots.map((s) => s.focusLevel));
    const confidenceAvg = avg(snapshots.map((s) => s.confidence));
    const pressureAvg = avg(snapshots.map((s) => s.pressureLevel));
    const acceptanceCount = snapshots.filter((s) => s.acceptedResult).length;
    const acceptanceRate =
      snapshots.length > 0 ? (acceptanceCount / snapshots.length) * 100 : 0;

    const focusBaseline = profile?.focusBaseline ?? 0;
    const confidenceBaseline = profile?.baselineConfidence ?? 0;
    const pressureBaseline = profile?.pressureTolerance ?? 3;
    const acceptanceBaseline =
      profile?.acceptanceRate != null ? profile.acceptanceRate * 100 : 0;

    return [
      {
        label: "Fokus",
        value: Math.round(focusAvg * 10) / 10,
        trend: profile?.focusTrend ?? 0,
        benchmark: focusBaseline,
      },
      {
        label: "Selvtillit",
        value: Math.round(confidenceAvg * 10) / 10,
        trend:
          confidenceBaseline > 0
            ? Math.round((confidenceAvg - confidenceBaseline) * 10) / 10
            : 0,
        benchmark: confidenceBaseline,
      },
      {
        label: "Press-toleranse",
        value: Math.round(pressureAvg * 10) / 10,
        trend:
          pressureBaseline > 0
            ? Math.round((pressureAvg - pressureBaseline) * 10) / 10
            : 0,
        benchmark: pressureBaseline,
      },
      {
        label: "Aksept",
        value: Math.round(acceptanceRate * 10) / 10,
        trend:
          acceptanceBaseline > 0
            ? Math.round((acceptanceRate - acceptanceBaseline) * 10) / 10
            : 0,
        benchmark: Math.round(acceptanceBaseline * 10) / 10,
      },
    ];
  });
}

/**
 * Alle PeriodizationPeriod for inneverende ar, mappet til maneder.
 */
export async function getSeasonPlan(userId: string): Promise<SeasonPlanMonth[]> {
  return withWidgetGuard("getSeasonPlan", [], async () => {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const periods = await prisma.periodizationPeriod.findMany({
      where: {
        studentId: userId,
        startDate: { lte: yearEnd },
        endDate: { gte: yearStart },
      },
      orderBy: { startDate: "asc" },
      select: { periodType: true, startDate: true, endDate: true },
    });

    return MAANEDER_KORT.map((monthName, monthIdx) => {
      const monthStart = new Date(now.getFullYear(), monthIdx, 1);
      const monthEnd = new Date(now.getFullYear(), monthIdx + 1, 0, 23, 59, 59);

      const matching = periods.find(
        (p) => p.startDate <= monthEnd && p.endDate >= monthStart,
      );

      return {
        name: monthName,
        phase: matching?.periodType ?? "Ingen",
        active: now >= monthStart && now <= monthEnd && !!matching,
      };
    });
  });
}

/**
 * Siste publiserte CoachingSession for userId.
 */
export async function getRecentCoachingFeedback(
  userId: string,
): Promise<RecentCoachingFeedback | null> {
  return withWidgetGuard("getRecentCoachingFeedback", null, async () => {
    const session = await prisma.coachingSession.findFirst({
      where: { studentId: userId, publishedToStudent: true },
      orderBy: { sessionDate: "desc" },
      select: {
        sessionDate: true,
        progressRating: true,
        instructorNotes: true,
        homework: true,
        primaryFocus: true,
        aiSummary: true,
        Instructor: { select: { User: { select: { name: true } } } },
      },
    });

    if (!session) return null;

    return {
      coach: session.Instructor?.User?.name ?? "Coach",
      date: session.sessionDate,
      rating: session.progressRating,
      text: session.aiSummary ?? session.homework ?? session.instructorNotes ?? "",
      focusArea: session.primaryFocus,
    };
  });
}

/**
 * Aktiv TrainingPlan + completedSessions vs totalSessions.
 *
 * Bruker _count i Prisma for a unnga over-fetch (var: hentet hver Week +
 * Session + take:1 pa TrainingLog → ~50 nostete rader for 12-ukers plan).
 */
export async function getPlanProgress(
  userId: string,
): Promise<PlanProgress | null> {
  return withWidgetGuard("getPlanProgress", null, async () => {
    const plan = await prisma.trainingPlan.findFirst({
      where: { studentId: userId, isActive: true },
      orderBy: { startDate: "desc" },
      select: { id: true, title: true },
    });

    if (!plan) return null;

    // Tell totalt antall sesjoner og antall med minst en log — to lette aggregat-queries
    // i stedet for a hente hele treet.
    const [total, completed] = await Promise.all([
      prisma.trainingPlanSession.count({
        where: { TrainingPlanWeek: { planId: plan.id } },
      }),
      prisma.trainingPlanSession.count({
        where: {
          TrainingPlanWeek: { planId: plan.id },
          TrainingLog: { some: {} },
        },
      }),
    ]);

    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      planName: plan.title,
      completed,
      total,
      percentage,
    };
  });
}

/**
 * Alle PeriodizationPeriod for studentId i inneverende ar.
 */
export async function getPeriodSummary(
  userId: string,
): Promise<PeriodSummaryPhase[]> {
  return withWidgetGuard("getPeriodSummary", [], async () => {
    const now = new Date();
    const yearStart = new Date(now.getFullYear(), 0, 1);
    const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59);

    const periods = await prisma.periodizationPeriod.findMany({
      where: {
        studentId: userId,
        startDate: { lte: yearEnd },
        endDate: { gte: yearStart },
      },
      orderBy: { startDate: "asc" },
      select: {
        periodType: true,
        label: true,
        startDate: true,
        endDate: true,
      },
    });

    return periods.map((p) => {
      const days = daysBetween(p.endDate, p.startDate) + 1;
      const weeks = Math.max(1, Math.round(days / 7));
      const active = now >= p.startDate && now <= p.endDate;
      const completed = p.endDate < now;

      return {
        name: p.label ?? p.periodType,
        weeks,
        completed,
        active,
      };
    });
  });
}

// Eksporter konstant slik at andre widget-konsumenter kan referere
// streak-cappen ved behov (f.eks. for varsler "X dager pa rad").
export { STREAK_TRAINING_LOOKBACK_DAYS };
