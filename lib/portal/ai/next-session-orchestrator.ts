import { prisma } from "@/lib/portal/prisma";
import { subDays } from "date-fns";
import {
  generateSessionPlan,
  type SessionPlan,
} from "@/lib/portal/ai/session-planner";
import {
  generateFocusRecommendation,
  type FocusRecommendation,
} from "@/lib/portal/ai/focus-recommendation";

export interface NextSessionContext {
  playerName: string;
  playerHandicap: number | null;
  recentSessions: string[];
  focusAreas: string[];
  trackmanAverages: Record<string, unknown> | null;
  activeGoals: Array<{ title: string; targetDate: string | null; priority: number }>;
  sources: {
    coachingSessions: number;
    trainingLogs: number;
    trackmanSessions: number;
    goals: number;
  };
}

export interface NextSessionDraft {
  focus: FocusRecommendation;
  plan: SessionPlan;
  context: NextSessionContext;
  generatedAt: string;
}

const FOCUS_TO_ENUM: Record<string, string> = {
  tee: "TEE_TOTAL",
  TEE_TOTAL: "TEE_TOTAL",
  approach: "APPROACH",
  APPROACH: "APPROACH",
  short_game: "SHORT_GAME",
  SHORT_GAME: "SHORT_GAME",
  putting: "PUTTING",
  PUTTING: "PUTTING",
};

function normalizeFocus(value: string): string {
  const direct = FOCUS_TO_ENUM[value];
  if (direct) return direct;
  const v = value.toLowerCase();
  if (v.includes("putt")) return "PUTTING";
  if (v.includes("kort") || v.includes("chip")) return "SHORT_GAME";
  if (v.includes("approach") || v.includes("jern") || v.includes("innspill"))
    return "APPROACH";
  if (v.includes("tee") || v.includes("driver") || v.includes("langt"))
    return "TEE_TOTAL";
  return "APPROACH";
}

/**
 * Orchestrate next-session draft generation for a student.
 *
 * Steps:
 *  1. Fetch context (recent sessions, training logs, trackman, goals, HCP)
 *  2. Generate focus recommendation
 *  3. Generate session plan
 *  4. Return combined draft + source attribution
 */
export async function generateNextSessionDraft(params: {
  studentId: string;
  durationMinutes?: number;
}): Promise<NextSessionDraft> {
  const { studentId, durationMinutes = 60 } = params;
  const thirtyDaysAgo = subDays(new Date(), 30);
  const fourteenDaysAgo = subDays(new Date(), 14);

  const [user, recentSessions, trainingLogs, trackman, goals, handicap] = await Promise.all([
    prisma.user.findUnique({
      where: { id: studentId },
      select: { id: true, name: true },
    }),
    prisma.coachingSession.findMany({
      where: { studentId, aiSummary: { not: null } },
      orderBy: { sessionDate: "desc" },
      take: 3,
      select: { aiSummary: true, sessionDate: true, aiFocusAreas: true },
    }),
    prisma.trainingLog.findMany({
      where: { userId: studentId, date: { gte: fourteenDaysAgo } },
      orderBy: { date: "desc" },
      take: 20,
      select: { focusArea: true, durationMinutes: true, rating: true },
    }),
    prisma.trackmanSession.findMany({
      where: { userId: studentId, sessionDate: { gte: thirtyDaysAgo } },
      orderBy: { sessionDate: "desc" },
      take: 10,
      select: { club: true, averages: true },
    }),
    prisma.playerGoals.findMany({
      where: { userId: studentId, isActive: true },
      orderBy: { priority: "asc" },
      take: 5,
      select: { title: true, targetDate: true, priority: true },
    }),
    prisma.handicapEntry.findFirst({
      where: { userId: studentId },
      orderBy: { date: "desc" },
      select: { handicapIndex: true },
    }),
  ]);

  if (!user) {
    throw new Error("Elev ikke funnet");
  }

  const recentSummaries = recentSessions
    .map((s) => `${s.sessionDate.toISOString().slice(0, 10)}: ${s.aiSummary}`)
    .filter((s): s is string => typeof s === "string" && s.length > 0);

  // Collect distinct focus areas from recent sessions
  const focusAreaSet = new Set<string>();
  for (const s of recentSessions) {
    for (const f of s.aiFocusAreas) focusAreaSet.add(f);
  }

  // Aggregate trackman averages by club (latest per club)
  const trackmanAverages: Record<string, unknown> = {};
  const seenClubs = new Set<string>();
  for (const s of trackman) {
    if (!seenClubs.has(s.club)) {
      trackmanAverages[s.club] = s.averages;
      seenClubs.add(s.club);
    }
  }

  // 1) Focus recommendation
  const focusRecommendation = await generateFocusRecommendation(studentId);
  const primaryArea = normalizeFocus(
    focusRecommendation.areas[0]?.title ?? "APPROACH"
  );

  // 2) Session plan
  const playerNotesParts: string[] = [];
  if (focusAreaSet.size > 0) {
    playerNotesParts.push(`Fokusområder siste økter: ${[...focusAreaSet].join(", ")}`);
  }
  if (Object.keys(trackmanAverages).length > 0) {
    playerNotesParts.push(
      `TrackMan-snitt: ${JSON.stringify(trackmanAverages).slice(0, 500)}`
    );
  }
  if (goals.length > 0) {
    playerNotesParts.push(
      `Mål: ${goals.map((g) => g.title).join("; ")}`
    );
  }

  const plan = await generateSessionPlan({
    focusArea: primaryArea,
    playerName: user.name ?? "Spiller",
    serviceDuration: durationMinutes,
    playerHandicap: handicap?.handicapIndex ?? undefined,
    previousSessions: recentSummaries,
    playerNotes: playerNotesParts.join("\n"),
  });

  const context: NextSessionContext = {
    playerName: user.name ?? "Spiller",
    playerHandicap: handicap?.handicapIndex ?? null,
    recentSessions: recentSummaries,
    focusAreas: [...focusAreaSet],
    trackmanAverages: Object.keys(trackmanAverages).length > 0 ? trackmanAverages : null,
    activeGoals: goals.map((g) => ({
      title: g.title,
      targetDate: g.targetDate?.toISOString() ?? null,
      priority: g.priority,
    })),
    sources: {
      coachingSessions: recentSessions.length,
      trainingLogs: trainingLogs.length,
      trackmanSessions: trackman.length,
      goals: goals.length,
    },
  };

  return {
    focus: focusRecommendation,
    plan,
    context,
    generatedAt: new Date().toISOString(),
  };
}
