import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";

/**
 * POST /api/portal/rounds/:id/complete — Fullfar runde og beregn aggregater
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id: roundId } = await params;
  const supabase = await createServerSupabase();

  const { data: round, error } = await supabase
    .from("Round")
    .select(`
      *,
      HoleResult (*),
      Course (par, name)
    `)
    .eq("id", roundId)
    .single();

  if (error || !round || round.userId !== user.id) {
    return NextResponse.json({ error: "Runde ikke funnet" }, { status: 404 });
  }

  const holes = round.HoleResult || [];
  if (holes.length === 0) {
    return NextResponse.json(
      { error: "Ingen hull-resultater registrert" },
      { status: 400 }
    );
  }

  // Beregn aggregater
  const totalScore = holes.reduce((sum: number, h: { score: number }) => sum + h.score, 0);
  const scoreToPar = totalScore - (round.Course?.par ?? 72);
  const totalPutts = holes.reduce((sum: number, h: { putts: number }) => sum + h.putts, 0);
  const girCount = holes.filter((h: { gir: boolean }) => h.gir).length;

  const fairwayHoles = holes.filter((h: { fairwayHit: boolean | null }) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h: { fairwayHit: boolean }) => h.fairwayHit === true).length;
  const fairwaysTotal = fairwayHoles.length;

  // SG aggregater (kun fra hull med SG-data)
  const holesWithSG = holes.filter((h: { sgTotal: number | null }) => h.sgTotal !== null);
  const sgTotal = holesWithSG.length > 0
    ? holesWithSG.reduce((sum: number, h: { sgTotal: number }) => sum + h.sgTotal, 0)
    : null;
  const sgOffTheTee = holesWithSG.length > 0
    ? holesWithSG.reduce((sum: number, h: { sgTee: number }) => sum + (h.sgTee ?? 0), 0)
    : null;
  const sgApproach = holesWithSG.length > 0
    ? holesWithSG.reduce((sum: number, h: { sgApproach: number }) => sum + (h.sgApproach ?? 0), 0)
    : null;
  const sgShortGame = holesWithSG.length > 0
    ? holesWithSG.reduce((sum: number, h: { sgShortGame: number }) => sum + (h.sgShortGame ?? 0), 0)
    : null;
  const sgPutting = holesWithSG.length > 0
    ? holesWithSG.reduce((sum: number, h: { sgPutting: number }) => sum + (h.sgPutting ?? 0), 0)
    : null;

  // DECADE score
  const holesWithStrategy = holes.filter((h: { strategyFollowed: boolean | null }) => h.strategyFollowed !== null);
  const decadeScore = holesWithStrategy.length > 0
    ? Math.round(
        (holesWithStrategy.filter((h: { strategyFollowed: boolean }) => h.strategyFollowed).length /
          holesWithStrategy.length) *
          100
      )
    : null;

  const round3 = (n: number | null) =>
    n !== null ? Math.round(n * 1000) / 1000 : null;

  // Oppdater runden
  const { data: updated, error: updateError } = await supabase
    .from("Round")
    .update({
      isComplete: true,
      endTime: new Date().toISOString(),
      totalScore,
      scoreToPar,
      totalPutts,
      girCount,
      fairwaysHit,
      fairwaysTotal,
      sgTotal: round3(sgTotal),
      sgOffTheTee: round3(sgOffTheTee),
      sgApproach: round3(sgApproach),
      sgShortGame: round3(sgShortGame),
      sgPutting: round3(sgPutting),
      decadeScore: decadeScore !== null ? decadeScore : null,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", roundId)
    .select(`
      *,
      Course (name, par),
      HoleResult (*)
    `)
    .single();

  if (updateError) {
    return NextResponse.json({ error: "Kunne ikke fullføre runde" }, { status: 500 });
  }

  return NextResponse.json(updated);
}
