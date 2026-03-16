"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { getSkillLevelByHandicap } from "@/lib/portal/golf/skill-levels";

export async function getPeerComparisonData() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  // Get current user's handicap to determine peer group
  const latestHandicap = await prisma.handicapEntry.findFirst({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  if (!latestHandicap) return null;

  const skillLevel = getSkillLevelByHandicap(Math.round(latestHandicap.handicapIndex));
  if (!skillLevel) return null;

  // Get user's stats (last 10 rounds)
  const myRounds = await prisma.roundStats.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    take: 10,
  });

  if (myRounds.length === 0) return null;

  // Get all users in same handicap range
  const peerUsers = await prisma.handicapEntry.findMany({
    where: {
      handicapIndex: {
        gte: skillLevel.handicapRange[0],
        lte: skillLevel.handicapRange[1],
      },
      userId: { not: user.id },
    },
    distinct: ["userId"],
    select: { userId: true },
  });

  const peerUserIds = peerUsers.map((p) => p.userId);

  // Get peer rounds
  const peerRounds = peerUserIds.length > 0
    ? await prisma.roundStats.findMany({
        where: { userId: { in: peerUserIds } },
        orderBy: { date: "desc" },
        take: 100,
      })
    : [];

  function avg(vals: (number | null)[]): number | null {
    const valid = vals.filter((v): v is number => v !== null);
    return valid.length > 0 ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
  }

  function pct(made: number, total: number): number | null {
    return total > 0 ? Math.round((made / total) * 100) : null;
  }

  const myStats = {
    sgTotal: avg(myRounds.map((r) => r.sgTotal)),
    sgOffTheTee: avg(myRounds.map((r) => r.sgOffTheTee)),
    sgApproach: avg(myRounds.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(myRounds.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(myRounds.map((r) => r.sgPutting)),
    avgScore: avg(myRounds.map((r) => r.totalScore)),
    fairwayPct: pct(
      myRounds.reduce((s, r) => s + (r.fairwaysHit ?? 0), 0),
      myRounds.reduce((s, r) => s + (r.fairwaysTotal ?? 0), 0)
    ),
    girPct: pct(
      myRounds.reduce((s, r) => s + (r.gir ?? 0), 0),
      myRounds.reduce((s, r) => s + (r.girTotal ?? 0), 0)
    ),
    puttsPerGir: avg(myRounds.map((r) => r.puttsPerGir)),
  };

  const peerStats = {
    sgTotal: avg(peerRounds.map((r) => r.sgTotal)),
    sgOffTheTee: avg(peerRounds.map((r) => r.sgOffTheTee)),
    sgApproach: avg(peerRounds.map((r) => r.sgApproach)),
    sgAroundTheGreen: avg(peerRounds.map((r) => r.sgAroundTheGreen)),
    sgPutting: avg(peerRounds.map((r) => r.sgPutting)),
    avgScore: avg(peerRounds.map((r) => r.totalScore)),
    fairwayPct: pct(
      peerRounds.reduce((s, r) => s + (r.fairwaysHit ?? 0), 0),
      peerRounds.reduce((s, r) => s + (r.fairwaysTotal ?? 0), 0)
    ),
    girPct: pct(
      peerRounds.reduce((s, r) => s + (r.gir ?? 0), 0),
      peerRounds.reduce((s, r) => s + (r.girTotal ?? 0), 0)
    ),
    puttsPerGir: avg(peerRounds.map((r) => r.puttsPerGir)),
  };

  // Count categories where player is above average
  const sgCategories = ["sgOffTheTee", "sgApproach", "sgAroundTheGreen", "sgPutting"] as const;
  const aboveCount = sgCategories.filter((k) => {
    const mine = myStats[k];
    const theirs = peerStats[k];
    return mine !== null && theirs !== null && mine > theirs;
  }).length;

  return {
    skillLevel,
    peerCount: peerUserIds.length,
    myStats,
    peerStats,
    myRoundCount: myRounds.length,
    peerRoundCount: peerRounds.length,
    aboveAverageCount: aboveCount,
    totalSGCategories: sgCategories.length,
  };
}
