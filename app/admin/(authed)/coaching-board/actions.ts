"use server";

import { UserRole, Capability } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { prisma } from "@/lib/portal/prisma";
import { computeCoachingSignalsForUsers } from "@/lib/portal/coaching-signals";
import { getMyPlayers } from "@/lib/portal/kartlegging";
import { getTrainingIndex } from "@/lib/portal/kartlegging/training-index";
import type { CoachingSignal } from "@/lib/portal/coaching-signals";

export interface CoachingBoardPlayerRow {
  userId: string;
  name: string | null;
  email: string | null;
  category: string | null;
  averageScore: number | null;
  totalUsi: number | null;
  trend30d: number | null;
  usiSparkline: number[];
  biggestGap: {
    label: string;
    value: number;
  } | null;
  distributionPct: {
    onCourse: number;
    skillTechnical: number;
    shortGame: number;
    putting: number;
    physicalMental: number;
  } | null;
  lastTrainingAt: string | null;
  signal: CoachingSignal | null;
}

export interface CoachingBoardGroupHealth {
  totalPlayers: number;
  avgUsiChange30d: number;
  groupPlanAdherencePct: number;
  courseHeavyCount: number;
  missingTestsCount: number;
  distributionAvg: {
    onCourse: number;
    skillTechnical: number;
    shortGame: number;
    putting: number;
    physicalMental: number;
  };
}

export interface CoachingBoardData {
  players: CoachingBoardPlayerRow[];
  groupHealth: CoachingBoardGroupHealth;
  viewMode: "own" | "all";
  coachName: string | null;
}

export async function fetchCoachingBoardData(): Promise<CoachingBoardData> {
  const user = await requirePortalUser();

  const hasOwn =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_OWN_PLAYERS));
  const hasAll =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_ALL_PLAYERS));

  if (!hasOwn && !hasAll) {
    throw new Error("Manglende tilgang til Coaching Mission Board.");
  }

  const viewMode: "own" | "all" = hasAll ? "all" : "own";

  let userIds: string[] = [];
  let coachName: string | null = user.name ?? null;

  if (viewMode === "all") {
    const students = await prisma.user.findMany({
      where: { role: UserRole.STUDENT, isActive: true },
      select: { id: true },
      take: 200,
    });
    userIds = students.map((s) => s.id);
  } else {
    const relations = await getMyPlayers(user.id);
    userIds = relations.map((r) => r.playerUserId);
  }

  if (userIds.length === 0) {
    return {
      players: [],
      groupHealth: emptyGroupHealth(),
      viewMode,
      coachName,
    };
  }

  const [users, usis, snapshots, signals, lastTrainings] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    }),
    prisma.unifiedSkillIndex.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        totalUsi: true,
        sgOtt: true,
        sgApp: true,
        sgArg: true,
        sgPutt: true,
        trendMomentum: true,
        estimatedCategory: true,
        estimatedHandicap: true,
      },
    }),
    prisma.unifiedSkillSnapshot.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      take: userIds.length * 5,
      select: { userId: true, totalUsi: true, createdAt: true },
    }),
    computeCoachingSignalsForUsers(userIds),
    prisma.trainingLog.findMany({
      where: { userId: { in: userIds } },
      orderBy: { date: "desc" },
      take: userIds.length * 2,
      select: { userId: true, date: true },
    }),
  ]);

  const usiMap = new Map(usis.map((u) => [u.userId, u]));
  const signalMap = new Map(signals.map((s) => [s.userId, s]));

  const snapshotsByUser = new Map<string, typeof snapshots>();
  for (const s of snapshots) {
    const arr = snapshotsByUser.get(s.userId) ?? [];
    arr.push(s);
    snapshotsByUser.set(s.userId, arr);
  }

  const lastTrainingByUser = new Map<string, Date>();
  for (const log of lastTrainings) {
    if (!lastTrainingByUser.has(log.userId)) {
      lastTrainingByUser.set(log.userId, log.date);
    }
  }

  const trainingIdxs = await Promise.all(
    userIds.map(async (id) => {
      try {
        const idx = await getTrainingIndex(id, {
          category: usiMap.get(id)?.estimatedCategory,
        });
        return { userId: id, idx };
      } catch {
        return { userId: id, idx: null };
      }
    })
  );
  const trainingIdxMap = new Map(trainingIdxs.map((t) => [t.userId, t.idx]));

  const players: CoachingBoardPlayerRow[] = users.map((u) => {
    const usi = usiMap.get(u.id);
    const signal = signalMap.get(u.id) ?? null;
    const userSnapshots = snapshotsByUser.get(u.id) ?? [];
    const idx = trainingIdxMap.get(u.id);

    const sparkline = userSnapshots.slice(0, 5).map((s) => s.totalUsi).reverse();
    const trend =
      userSnapshots.length >= 2
        ? (userSnapshots[0].totalUsi -
            userSnapshots[userSnapshots.length - 1].totalUsi)
        : 0;

    const biggestGap = findBiggestGap(usi);

    return {
      userId: u.id,
      name: u.name,
      email: u.email,
      category: usi?.estimatedCategory ?? null,
      averageScore: null,
      totalUsi: usi?.totalUsi ?? null,
      trend30d: trend,
      usiSparkline: sparkline,
      biggestGap,
      distributionPct: idx?.distribution ?? null,
      lastTrainingAt: lastTrainingByUser.get(u.id)?.toISOString() ?? null,
      signal,
    };
  });

  players.sort(
    (a, b) => (b.signal?.priorityScore ?? 0) - (a.signal?.priorityScore ?? 0)
  );

  return {
    players,
    groupHealth: computeGroupHealth(players),
    viewMode,
    coachName,
  };
}

function findBiggestGap(
  usi:
    | {
        sgOtt: number;
        sgApp: number;
        sgArg: number;
        sgPutt: number;
      }
    | undefined
): { label: string; value: number } | null {
  if (!usi) return null;
  const values: { label: string; value: number }[] = [
    { label: "Langspill", value: usi.sgOtt },
    { label: "Innspill", value: usi.sgApp },
    { label: "Kortspill", value: usi.sgArg },
    { label: "Putting", value: usi.sgPutt },
  ];
  const worst = values.reduce((a, b) => (a.value < b.value ? a : b));
  return worst;
}

function emptyGroupHealth(): CoachingBoardGroupHealth {
  return {
    totalPlayers: 0,
    avgUsiChange30d: 0,
    groupPlanAdherencePct: 0,
    courseHeavyCount: 0,
    missingTestsCount: 0,
    distributionAvg: {
      onCourse: 0,
      skillTechnical: 0,
      shortGame: 0,
      putting: 0,
      physicalMental: 0,
    },
  };
}

function computeGroupHealth(
  players: CoachingBoardPlayerRow[]
): CoachingBoardGroupHealth {
  if (players.length === 0) return emptyGroupHealth();

  const withTrend = players.filter((p) => p.trend30d !== null);
  const avgTrend =
    withTrend.length > 0
      ? withTrend.reduce((acc, p) => acc + (p.trend30d ?? 0), 0) /
        withTrend.length
      : 0;

  const withDistribution = players.filter((p) => p.distributionPct !== null);
  const distAvg = {
    onCourse: 0,
    skillTechnical: 0,
    shortGame: 0,
    putting: 0,
    physicalMental: 0,
  };
  for (const p of withDistribution) {
    if (!p.distributionPct) continue;
    distAvg.onCourse += p.distributionPct.onCourse;
    distAvg.skillTechnical += p.distributionPct.skillTechnical;
    distAvg.shortGame += p.distributionPct.shortGame;
    distAvg.putting += p.distributionPct.putting;
    distAvg.physicalMental += p.distributionPct.physicalMental;
  }
  const n = withDistribution.length || 1;
  distAvg.onCourse /= n;
  distAvg.skillTechnical /= n;
  distAvg.shortGame /= n;
  distAvg.putting /= n;
  distAvg.physicalMental /= n;

  const courseHeavy = players.filter(
    (p) => (p.distributionPct?.onCourse ?? 0) > 0.6
  ).length;

  const missingTests = players.filter((p) =>
    p.signal?.kinds.includes("test-gap")
  ).length;

  return {
    totalPlayers: players.length,
    avgUsiChange30d: Math.round(avgTrend * 100) / 100,
    groupPlanAdherencePct: 0,
    courseHeavyCount: courseHeavy,
    missingTestsCount: missingTests,
    distributionAvg: distAvg,
  };
}
