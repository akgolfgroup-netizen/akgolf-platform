import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";

/**
 * GET /api/portal/tests/leaderboard — Leaderboard for DECADE-tester
 * Query: ?testNumber=1&period=all|month|week
 *
 * Viser topp-resultater pa tvers av alle spillere for en gitt test.
 * Bruker TestResult-modellen som allerede finnes.
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const testNumberParam = req.nextUrl.searchParams.get("testNumber");
  const period = req.nextUrl.searchParams.get("period") ?? "all";

  // Tidsfilter
  let dateFilter: Date | undefined;
  if (period === "week") {
    dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - 7);
  } else if (period === "month") {
    dateFilter = new Date();
    dateFilter.setMonth(dateFilter.getMonth() - 1);
  }

  // Hent alle tilgjengelige tester
  const testDefinitions = await prisma.testDefinition.findMany({
    select: { testNumber: true, name: true, unit: true, comparison: true },
    orderBy: { testNumber: "asc" },
  });

  const testNumber = testNumberParam ? parseInt(testNumberParam, 10) : null;

  if (testNumber !== null) {
    const testDef = testDefinitions.find((t) => t.testNumber === testNumber);
    if (!testDef) {
      return NextResponse.json({ error: "Test ikke funnet" }, { status: 404 });
    }

    // Hent beste resultat per bruker for denne testen
    const results = await prisma.testResult.findMany({
      where: {
        testNumber,
        ...(dateFilter ? { createdAt: { gte: dateFilter } } : {}),
      },
      include: {
        User: { select: { id: true, name: true, image: true } },
      },
      orderBy: testDef.comparison === "higher"
        ? { value: "desc" as const }
        : { value: "asc" as const },
    });

    // Grupper per bruker — ta beste resultat
    const bestPerUser = new Map<
      string,
      {
        userId: string;
        name: string;
        image: string | null;
        bestValue: number;
        passed: boolean;
        date: Date;
        isCurrentUser: boolean;
      }
    >();

    for (const r of results) {
      const existing = bestPerUser.get(r.userId);
      const isBetter = testDef.comparison === "higher"
        ? !existing || r.value > existing.bestValue
        : !existing || r.value < existing.bestValue;

      if (isBetter) {
        bestPerUser.set(r.userId, {
          userId: r.userId,
          name: r.User.name ?? "Ukjent",
          image: r.User.image,
          bestValue: r.value,
          passed: r.passed,
          date: r.createdAt,
          isCurrentUser: r.userId === user.id,
        });
      }
    }

    const leaderboard = Array.from(bestPerUser.values())
      .sort((a, b) =>
        testDef.comparison
          ? b.bestValue - a.bestValue
          : a.bestValue - b.bestValue
      )
      .map((entry, i) => ({ ...entry, rank: i + 1 }));

    // Finn brukerens posisjon
    const userRank = leaderboard.find((e) => e.isCurrentUser)?.rank ?? null;

    return NextResponse.json({
      test: {
        testNumber: testDef.testNumber,
        name: testDef.name,
        unit: testDef.unit,
        higherIsBetter: testDef.comparison === "higher",
      },
      period,
      leaderboard: leaderboard.slice(0, 50),
      userRank,
      totalParticipants: leaderboard.length,
    });
  }

  // Ingen spesifikk test — vis oversikt over alle tester med brukerens ranking
  const overview = await Promise.all(
    testDefinitions.map(async (testDef) => {
      const userBest = await prisma.testResult.findFirst({
        where: { userId: user.id, testNumber: testDef.testNumber },
        orderBy: testDef.comparison
          ? { value: "desc" }
          : { value: "asc" },
        select: { value: true, passed: true, createdAt: true },
      });

      const totalResults = await prisma.testResult.groupBy({
        by: ["userId"],
        where: { testNumber: testDef.testNumber },
      });

      let userRank: number | null = null;
      if (userBest) {
        const betterCount = await prisma.testResult.groupBy({
          by: ["userId"],
          where: {
            testNumber: testDef.testNumber,
            value: testDef.comparison
              ? { gt: userBest.value }
              : { lt: userBest.value },
          },
        });
        userRank = betterCount.length + 1;
      }

      return {
        testNumber: testDef.testNumber,
        name: testDef.name,
        unit: testDef.unit,
        userBestValue: userBest?.value ?? null,
        userPassed: userBest?.passed ?? null,
        userRank,
        totalParticipants: totalResults.length,
      };
    })
  );

  return NextResponse.json({ tests: overview });
}
