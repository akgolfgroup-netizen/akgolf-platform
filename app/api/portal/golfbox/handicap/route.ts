import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import {
  calculateHandicapDifferential,
  calculateHandicapIndex,
  calculatePlayingHandicap,
  calculateAdjustedGrossScore,
} from "@/lib/portal/golf/golfbox/handicap";

/**
 * GET /api/portal/golfbox/handicap — Beregn oppdatert handicap fra siste 20 runder
 */
export async function GET() {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const supabase = await createServerSupabase();

  // Hent siste 20 fullforte runder med bane-data
  const { data: rounds, error } = await supabase
    .from("Round")
    .select(`
      *,
      Course (par, courseRating, slopeRating),
      HoleResult (score, par)
    `)
    .eq("userId", user.id)
    .eq("isComplete", true)
    .order("date", { ascending: false })
    .limit(20);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente runder" }, { status: 500 });
  }

  if ((rounds || []).length < 3) {
    return NextResponse.json({
      handicapIndex: null,
      message: "Trenger minst 3 runder for handicap-beregning",
      roundCount: (rounds || []).length,
    });
  }

  // Beregn differensialer
  const differentials: number[] = [];
  const roundDetails: Array<{
    date: string;
    course: string | null;
    score: number;
    adjustedScore: number;
    differential: number;
  }> = [];

  for (const round of rounds || []) {
    const cr = round.Course?.courseRating;
    const sr = round.Course?.slopeRating;
    const par = round.Course?.par ?? 72;

    if (!cr || !sr) continue;

    // Beregn Playing Handicap (bruk forrige handicap eller 36 som default)
    const { data: currentHcp } = await supabase
      .from("HandicapEntry")
      .select("handicapIndex")
      .eq("userId", user.id)
      .lt("date", round.date)
      .order("date", { ascending: false })
      .limit(1)
      .single();

    const playingHcp = calculatePlayingHandicap(
      currentHcp?.handicapIndex ?? 36,
      sr,
      cr,
      par
    );

    const adjustedScore = calculateAdjustedGrossScore(
      (round.HoleResult || []).map((h: { score: number; par: number }) => ({ score: h.score, par: h.par })),
      playingHcp
    );

    const differential = calculateHandicapDifferential(adjustedScore, cr, sr);
    differentials.push(differential);

    roundDetails.push({
      date: round.date,
      course: null,
      score: round.totalScore ?? 0,
      adjustedScore,
      differential,
    });
  }

  const handicapIndex = calculateHandicapIndex(differentials);

  // Lagre ny handicap-entry
  const { error: insertError } = await supabase
    .from("HandicapEntry")
    .insert({
      id: nanoid(),
      userId: user.id,
      date: new Date().toISOString(),
      handicapIndex,
      source: "MANUAL",
    });

  if (insertError) {
    return NextResponse.json({ error: "Kunne ikke lagre handicap" }, { status: 500 });
  }

  return NextResponse.json({
    handicapIndex,
    roundCount: differentials.length,
    differentials: roundDetails,
    playingHandicapExample: rounds[0]?.Course
      ? calculatePlayingHandicap(
          handicapIndex,
          rounds[0].Course.slopeRating ?? 113,
          rounds[0].Course.courseRating ?? 72,
          rounds[0].Course.par ?? 72
        )
      : null,
  });
}
