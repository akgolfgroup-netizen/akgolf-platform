import "server-only";
import { prisma } from "@/lib/portal/prisma";
import {
  SG_DIMENSION_LABEL,
  type SGDimension,
} from "@/lib/portal/golf/sg-benchmarks";
import { getTrainingIndex } from "@/lib/portal/kartlegging/training-index";
import { getGapAnalysis } from "@/lib/portal/kartlegging/profile";
import type {
  CoachingSignal,
  CoachingSignalEvidence,
  CoachingRecommendation,
  SignalKind,
  SignalSeverity,
} from "./types";

const cache = new Map<string, { at: number; signals: CoachingSignal[] }>();
const CACHE_MS = 15 * 60 * 1000;

function clearStaleCache() {
  const now = Date.now();
  for (const [key, entry] of cache.entries()) {
    if (now - entry.at > CACHE_MS) cache.delete(key);
  }
}

export function invalidateSignalCache(coachUserId?: string) {
  if (coachUserId) cache.delete(coachUserId);
  else cache.clear();
}

async function computeOneSignal(
  userId: string,
  playerName: string | null
): Promise<CoachingSignal> {
  const kinds: SignalKind[] = [];
  const evidence: CoachingSignalEvidence[] = [];
  const recommendations: CoachingRecommendation[] = [];
  let priority = 0;
  let primaryFocus: SGDimension | null = null;
  let primaryKind: SignalKind = "on-track";
  let confidence: "low" | "medium" | "high" = "medium";

  const [usi, snapshots, trainingIdx, gap, upcomingTournament, latestTest] =
    await Promise.all([
      prisma.unifiedSkillIndex.findUnique({
        where: { userId },
        select: {
          totalUsi: true,
          trendMomentum: true,
          trainingEfficiency: true,
          sgOtt: true,
          sgApp: true,
          sgArg: true,
          sgPutt: true,
        },
      }),
      prisma.unifiedSkillSnapshot.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { totalUsi: true, createdAt: true },
      }),
      getTrainingIndex(userId).catch(() => null),
      getGapAnalysis(userId).catch(() => null),
      prisma.tournament.findFirst({
        where: {
          startDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
          PlayerTournamentPlan: { some: { studentId: userId } },
        },
        include: {
          TournamentPrep: { where: { userId } },
        },
      }),
      prisma.testResult.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
    ]);

  if (!usi) {
    return {
      userId,
      playerName,
      priorityScore: 30,
      severity: "low",
      primaryKind: "test-gap",
      primaryFocus: null,
      headline: "Mangler data for full vurdering",
      evidence: [{ kind: "no-usi", label: "Ingen USI beregnet ennå" }],
      recommendedActions: [
        { label: "Registrer minst én runde eller TrackMan-økt" },
      ],
      confidenceLevel: "low",
      kinds: ["test-gap"],
    };
  }

  // Stagnasjon: flat trend over flere snapshots
  if (snapshots.length >= 3) {
    const deltas = snapshots
      .slice(0, 3)
      .map((s) => s.totalUsi)
      .map((v, i, arr) => (i > 0 ? v - arr[i - 1] : 0))
      .slice(1);
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    if (Math.abs(avgDelta) < 0.05) {
      kinds.push("stagnation");
      priority += 35;
      primaryKind = "stagnation";
      evidence.push({
        kind: "stagnation",
        label: "USI flat 30 dager",
        value: `Δ ${avgDelta.toFixed(2)}`,
      });
    } else if (avgDelta < -0.15) {
      kinds.push("regression");
      priority += 50;
      primaryKind = "regression";
      evidence.push({
        kind: "regression",
        label: "USI faller",
        value: `Δ ${avgDelta.toFixed(2)}`,
      });
    }
  }

  // Største SG-gap → primaryFocus
  if (gap && gap.rows.length > 0) {
    const bottleneck = gap.rows.find((r) => r.isBottleneck);
    if (bottleneck) {
      primaryFocus = bottleneck.dimension;
      if (bottleneck.gap > 0.3) {
        priority += 20;
        evidence.push({
          kind: "sg-gap",
          label: `Flaskehals: ${bottleneck.label}`,
          value: `+${bottleneck.gap.toFixed(2)} SG til ${gap.targetCategory ?? "-"}`,
        });
        recommendations.push({
          label: `Planlegg fokusøkter på ${SG_DIMENSION_LABEL[bottleneck.dimension]}`,
        });
      }
    }
  }

  // Planfølging lav
  if (trainingIdx && trainingIdx.planAdherencePct < 70) {
    kinds.push("low-plan-adherence");
    priority += 25;
    if (primaryKind === "on-track") primaryKind = "low-plan-adherence";
    evidence.push({
      kind: "plan-adherence",
      label: "Planfølging lav",
      value: `${trainingIdx.planAdherencePct}%`,
    });
    recommendations.push({
      label: "Ta samtale om barrierer og juster plan",
    });
  }

  // Banegolf overveiende
  if (trainingIdx && trainingIdx.courseGolfRatio > 0.6) {
    kinds.push("course-heavy");
    priority += 20;
    if (primaryKind === "on-track") primaryKind = "course-heavy";
    evidence.push({
      kind: "course-heavy",
      label: "Banegolf overveiende",
      value: `${Math.round(trainingIdx.courseGolfRatio * 100)}%`,
    });
    recommendations.push({
      label: "Vri mot ferdighetstrening",
      detail: "ROI per time er ~17x høyere enn bane for utvikling",
    });
  }

  // Turnering uten prep
  if (upcomingTournament && upcomingTournament.TournamentPrep.length === 0) {
    kinds.push("tournament-ready-missing-prep");
    priority += 40;
    primaryKind = "tournament-ready-missing-prep";
    evidence.push({
      kind: "tournament",
      label: `Turnering ${upcomingTournament.name}`,
      value: upcomingTournament.startDate.toLocaleDateString("nb-NO"),
    });
    recommendations.push({
      label: "Registrer TournamentPrep",
      link: `/admin/turneringer`,
    });
  }

  // Test-gap: ingen tester siste 90 dager
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  if (!latestTest || latestTest.createdAt < ninetyDaysAgo) {
    kinds.push("test-gap");
    priority += 15;
    if (primaryKind === "on-track") primaryKind = "test-gap";
    evidence.push({
      kind: "test-gap",
      label: latestTest
        ? `Siste test: ${latestTest.createdAt.toLocaleDateString("nb-NO")}`
        : "Ingen tester registrert",
    });
    recommendations.push({ label: "Book testøkt" });
  }

  if (kinds.length === 0) {
    kinds.push("on-track");
    evidence.push({
      kind: "on-track",
      label: "På rett vei",
      value: `USI ${usi.totalUsi.toFixed(2)}`,
    });
  }

  // Confidence avhenger av datamengde
  confidence =
    snapshots.length >= 4 && usi.trainingEfficiency > 0
      ? "high"
      : snapshots.length >= 2
        ? "medium"
        : "low";

  const severity: SignalSeverity =
    priority >= 50 ? "high" : priority >= 25 ? "medium" : "low";

  const headline = buildHeadline(primaryKind, primaryFocus);

  return {
    userId,
    playerName,
    priorityScore: Math.min(100, priority),
    severity,
    primaryKind,
    primaryFocus,
    headline,
    evidence,
    recommendedActions: recommendations,
    confidenceLevel: confidence,
    kinds,
  };
}

function buildHeadline(kind: SignalKind, focus: SGDimension | null): string {
  switch (kind) {
    case "stagnation":
      return focus
        ? `Stagnasjon — trenger variasjon i ${SG_DIMENSION_LABEL[focus]}`
        : "Stagnasjon — vurder å endre fokus";
    case "regression":
      return focus
        ? `Regresjon i ${SG_DIMENSION_LABEL[focus]} — teknisk sjekk`
        : "Regresjon — sjekk data og teknikk";
    case "low-plan-adherence":
      return "Planfølging lav — samtale om barrierer";
    case "tournament-ready-missing-prep":
      return "Kommende turnering mangler prep";
    case "promotion-ready":
      return "Klar for opprykk";
    case "test-gap":
      return "Tester mangler — book testøkt";
    case "course-heavy":
      return "For mye banegolf — vri mot ferdighet";
    case "on-track":
    default:
      return focus
        ? `På rett vei — behold fokus på ${SG_DIMENSION_LABEL[focus]}`
        : "På rett vei";
  }
}

export async function computeCoachingSignal(
  userId: string,
  playerName: string | null = null
): Promise<CoachingSignal> {
  return computeOneSignal(userId, playerName);
}

export async function computeCoachingSignalsForCoach(
  coachUserId: string
): Promise<CoachingSignal[]> {
  clearStaleCache();
  const cached = cache.get(coachUserId);
  if (cached && Date.now() - cached.at < CACHE_MS) {
    return cached.signals;
  }

  const relations = await prisma.coachPlayerRelation.findMany({
    where: { coachUserId, status: "ACTIVE" },
    include: {
      Player: { select: { id: true, name: true } },
    },
  });

  const signals = await Promise.all(
    relations.map((r) => computeOneSignal(r.Player.id, r.Player.name))
  );

  signals.sort((a, b) => b.priorityScore - a.priorityScore);

  cache.set(coachUserId, { at: Date.now(), signals });
  return signals;
}

export async function computeCoachingSignalsForUsers(
  userIds: string[]
): Promise<CoachingSignal[]> {
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true },
  });
  const nameMap = new Map(users.map((u) => [u.id, u.name]));

  const signals = await Promise.all(
    userIds.map((id) => computeOneSignal(id, nameMap.get(id) ?? null))
  );

  signals.sort((a, b) => b.priorityScore - a.priorityScore);
  return signals;
}
