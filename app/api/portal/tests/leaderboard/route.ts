import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
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

  const supabase = await createServerSupabase();
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
  const { data: testDefinitions, error: testError } = await supabase
    .from("TestDefinition")
    .select("testNumber, name, unit, comparison")
    .order("testNumber", { ascending: true });

  if (testError) {
    return NextResponse.json({ error: "Kunne ikke hente testdefinisjoner" }, { status: 500 });
  }

  const testNumber = testNumberParam ? parseInt(testNumberParam, 10) : null;

  if (testNumber !== null) {
    const testDef = (testDefinitions || []).find((t: { testNumber: number }) => t.testNumber === testNumber);
    if (!testDef) {
      return NextResponse.json({ error: "Test ikke funnet" }, { status: 404 });
    }

    // Hent beste resultat per bruker for denne testen
    let resultsQuery = supabase
      .from("TestResult")
      .select(`
        *,
        User (id, name, image)
      `)
      .eq("testNumber", testNumber);

    if (dateFilter) {
      resultsQuery = resultsQuery.gte("createdAt", dateFilter.toISOString());
    }

    const { data: results, error: resultsError } = await resultsQuery;

    if (resultsError) {
      return NextResponse.json({ error: "Kunne ikke hente resultater" }, { status: 500 });
    }

    // Grupper per bruker — ta beste resultat
    const bestPerUser = new Map<
      string,
      {
        userId: string;
        name: string;
        image: string | null;
        bestValue: number;
        passed: boolean;
        date: string;
        isCurrentUser: boolean;
      }
    >();

    for (const r of results || []) {
      const existing = bestPerUser.get(r.userId);
      const isBetter = testDef.comparison === "higher"
        ? !existing || r.value > existing.bestValue
        : !existing || r.value < existing.bestValue;

      if (isBetter) {
        bestPerUser.set(r.userId, {
          userId: r.userId,
          name: r.User?.name ?? "Ukjent",
          image: r.User?.image ?? null,
          bestValue: r.value,
          passed: r.passed,
          date: r.createdAt,
          isCurrentUser: r.userId === user.id,
        });
      }
    }

    const leaderboard = Array.from(bestPerUser.values())
      .sort((a, b) =>
        testDef.comparison === "higher"
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
    (testDefinitions || []).map(async (testDef: { testNumber: number; comparison: string | null }) => {
      let userBestQuery = supabase
        .from("TestResult")
        .select("value, passed, createdAt")
        .eq("userId", user.id)
        .eq("testNumber", testDef.testNumber);

      if (testDef.comparison === "higher") {
        userBestQuery = userBestQuery.order("value", { ascending: false });
      } else {
        userBestQuery = userBestQuery.order("value", { ascending: true });
      }

      const { data: userBest } = await userBestQuery.limit(1).single();

      // Count total participants
      const { data: totalResults, error: countError } = await supabase
        .from("TestResult")
        .select("userId")
        .eq("testNumber", testDef.testNumber);

      const uniqueParticipants = new Set(totalResults?.map((r) => r.userId)).size;

      let userRank: number | null = null;
      if (userBest) {
        let betterCountQuery = supabase
          .from("TestResult")
          .select("userId")
          .eq("testNumber", testDef.testNumber);

        if (testDef.comparison === "higher") {
          betterCountQuery = betterCountQuery.gt("value", userBest.value);
        } else {
          betterCountQuery = betterCountQuery.lt("value", userBest.value);
        }

        const { data: betterResults } = await betterCountQuery;
        const betterCount = new Set(betterResults?.map((r) => r.userId)).size;
        userRank = betterCount + 1;
      }

      return {
        testNumber: testDef.testNumber,
        name: testDef.name,
        unit: testDef.unit,
        userBestValue: userBest?.value ?? null,
        userPassed: userBest?.passed ?? null,
        userRank,
        totalParticipants: uniqueParticipants,
      };
    })
  );

  return NextResponse.json({ tests: overview });
}
