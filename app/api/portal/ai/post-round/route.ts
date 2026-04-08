import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { checkRateLimit, RATE_LIMITS } from "@/lib/portal/rate-limit";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

/**
 * POST /api/portal/ai/post-round — AI-analyse etter runde
 * Body: { roundId: string }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const rateLimit = checkRateLimit(
    `post-round:${user.id}`,
    RATE_LIMITS.AI_ENDPOINTS
  );
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange foresporsler" }, { status: 429 });
  }

  const { roundId } = await req.json();
  if (!roundId) {
    return NextResponse.json({ error: "roundId er paakrevd" }, { status: 400 });
  }

  const supabase = await createServerSupabase();

  // Fetch round with related data
  const { data: round, error: roundError } = await supabase
    .from("Round")
    .select(
      `
      id,
      userId,
      courseId,
      totalScore,
      scoreToPar,
      totalPutts,
      fairwaysHit,
      fairwaysTotal,
      girCount,
      sgTotal,
      sgOffTheTee,
      sgApproach,
      sgShortGame,
      sgPutting,
      Course (name, par),
      HoleResult (
        holeNumber, par, score, putts, fairwayHit, gir, sgTotal, sgTee, sgApproach, sgShortGame, sgPutting,
        Shot (shotNumber, fromLie, fromDistance, toLie, toDistance, club, strokesGained, sgCategory)
      )
    `
    )
    .eq("id", roundId)
    .single();

  if (roundError || !round || round.userId !== user.id) {
    return NextResponse.json({ error: "Runde ikke funnet" }, { status: 404 });
  }

  // Hent siste 5 runder for sammenligning
  const { data: recentRounds, error: recentError } = await supabase
    .from("Round")
    .select(
      "totalScore, sgTotal, sgOffTheTee, sgApproach, sgShortGame, sgPutting, totalPutts, fairwaysHit, fairwaysTotal, girCount"
    )
    .eq("userId", user.id)
    .eq("isComplete", true)
    .neq("id", roundId)
    .order("date", { ascending: false })
    .limit(5);

  if (recentError) {
    console.error("Error fetching recent rounds:", recentError);
  }

  // Hent handicap
  const { data: handicap, error: handicapError } = await supabase
    .from("HandicapEntry")
    .select("handicapIndex")
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  if (handicapError && handicapError.code !== "PGRST116") {
    console.error("Error fetching handicap:", handicapError);
  }

  const holes = (round.HoleResult as unknown as Array<{
    holeNumber: number;
    par: number;
    score: number;
    putts: number;
    fairwayHit?: boolean;
    gir?: boolean;
    sgTotal?: number;
    sgTee?: number;
    sgApproach?: number;
    sgShortGame?: number;
    sgPutting?: number;
  }>) || [];

  const holesData = holes.map((h) => ({
    hull: h.holeNumber,
    par: h.par,
    score: h.score,
    putts: h.putts,
    fairway: h.fairwayHit,
    gir: h.gir,
    sgTotal: h.sgTotal,
    sgTee: h.sgTee,
    sgApproach: h.sgApproach,
    sgShortGame: h.sgShortGame,
    sgPutting: h.sgPutting,
  }));

  const recentAvg = recentRounds && recentRounds.length > 0
    ? {
        avgScore: Math.round(
          recentRounds.reduce((s, r) => s + (r.totalScore ?? 0), 0) / recentRounds.length
        ),
        avgSGTotal: recentRounds.reduce((s, r) => s + (r.sgTotal ?? 0), 0) / recentRounds.length,
        avgPutts: Math.round(
          recentRounds.reduce((s, r) => s + (r.totalPutts ?? 0), 0) / recentRounds.length
        ),
      }
    : null;

  const prompt = `Analyser denne golfrunden og gi konkrete, personaliserte tilbakemeldinger pa norsk.

RUNDE:
- Bane: ${(round.Course as unknown as { name?: string })?.name ?? "Ukjent"}
- Score: ${round.totalScore} (${(round.scoreToPar ?? 0) > 0 ? "+" : ""}${round.scoreToPar} mot par ${(round.Course as unknown as { par?: number })?.par})
- Putts: ${round.totalPutts}
- Fairways: ${round.fairwaysHit}/${round.fairwaysTotal}
- GIR: ${round.girCount}/18
${round.sgTotal !== null ? `- SG Total: ${round.sgTotal}` : ""}
${round.sgOffTheTee !== null ? `- SG Off The Tee: ${round.sgOffTheTee}` : ""}
${round.sgApproach !== null ? `- SG Approach: ${round.sgApproach}` : ""}
${round.sgShortGame !== null ? `- SG Short Game: ${round.sgShortGame}` : ""}
${round.sgPutting !== null ? `- SG Putting: ${round.sgPutting}` : ""}
${handicap ? `- Handicap: ${handicap.handicapIndex}` : ""}

HULL-FOR-HULL:
${JSON.stringify(holesData, null, 2)}

${recentAvg ? `SISTE 5 RUNDER GJENNOMSNITT:
- Score: ${recentAvg.avgScore}
- SG Total: ${recentAvg.avgSGTotal.toFixed(1)}
- Putts: ${recentAvg.avgPutts}` : ""}

RETURNER JSON:
{
  "headline": "string (kort oppsummering, 1 setning)",
  "strengths": ["string (2-3 styrker fra denne runden)"],
  "weaknesses": ["string (2-3 svakheter)"],
  "keyMoments": ["string (2-3 nokkelhull med forklaring)"],
  "trainingFocus": ["string (2-3 treningsanbefalinger med spesifikke drills)"],
  "comparedToRecent": "string (sammenligning med siste 5 runder, null hvis ingen data)",
  "mentalNote": "string (mental observasjon eller anbefaling)"
}`;

  const anthropic = new Anthropic();

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-5-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
    system:
      "Du er en ekspert golfcoach som analyserer runder. Bruk DECADE-prinsippet (datadrevet beslutninger) og AK Golf-metodikken. Svar pa norsk. Returner KUN gyldig JSON.",
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  let analysis;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
  } catch {
    analysis = {
      headline: "Runde analysert",
      strengths: ["Data mottatt"],
      weaknesses: [],
      keyMoments: [],
      trainingFocus: [],
      comparedToRecent: null,
      mentalNote: "Fortsett a logge runder for bedre analyse.",
    };
  }

  return NextResponse.json(analysis);
}
