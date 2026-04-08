import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";

/**
 * GET /api/portal/game-session/:id/leaderboard — Live leaderboard for spillokt
 * Returnerer alle spilleres score hull-for-hull i sanntid
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: session, error } = await supabase
    .from("GameSession")
    .select(`
      *,
      Course (name, par),
      Players (
        *,
        User (id, name, image)
      ),
      Rounds (
        *,
        User (id, name),
        HoleResult (
          holeNumber,
          score,
          scoreToPar,
          putts,
          gir
        )
      )
    `)
    .eq("id", id)
    .single();

  if (error || !session) {
    return NextResponse.json({ error: "Spillokt ikke funnet" }, { status: 404 });
  }

  // Sjekk at brukeren er med
  const isPlayer = (session.Players || []).some((p: { User: { id: string } }) => p.User.id === user.id);
  if (!isPlayer) {
    return NextResponse.json({ error: "Du er ikke med i denne spillokten" }, { status: 403 });
  }

  const coursePar = session.Course?.par ?? 72;

  // Bygg leaderboard
  const leaderboard = (session.Players || []).map((player: {
    User: { id: string; name: string | null; image: string | null };
    displayName: string | null;
    playingHandicap: number | null;
  }) => {
    const round = (session.Rounds || []).find((r: { User: { id: string } }) => r.User.id === player.User.id);
    const holes = round?.HoleResult || [];
    const holesPlayed = holes.length;
    const totalScore = holes.reduce((sum: number, h: { score: number }) => sum + h.score, 0);
    const totalPar = holes.reduce((sum: number, h: { scoreToPar: number }) => sum + h.scoreToPar, 0);
    const totalPutts = holes.reduce((sum: number, h: { putts: number }) => sum + h.putts, 0);

    // Stableford-beregning (hvis format = STABLEFORD)
    let stablefordPoints = 0;
    if (session.format === "STABLEFORD") {
      for (const hole of holes) {
        const nettScore = hole.scoreToPar; // Forenklet uten handicap
        if (nettScore <= -3) stablefordPoints += 5;      // Albatross
        else if (nettScore === -2) stablefordPoints += 4; // Eagle
        else if (nettScore === -1) stablefordPoints += 3; // Birdie
        else if (nettScore === 0) stablefordPoints += 2;  // Par
        else if (nettScore === 1) stablefordPoints += 1;  // Bogey
        // Double bogey+ = 0
      }
    }

    return {
      playerId: player.User.id,
      playerName: player.displayName ?? player.User.name ?? "Spiller",
      playerImage: player.User.image,
      playingHandicap: player.playingHandicap,
      holesPlayed,
      totalScore: holesPlayed > 0 ? totalScore : null,
      scoreToPar: holesPlayed > 0 ? totalPar : null,
      totalPutts: holesPlayed > 0 ? totalPutts : null,
      stablefordPoints: session.format === "STABLEFORD" ? stablefordPoints : null,
      thru: holesPlayed > 0 ? `${holesPlayed}` : "-",
      holeScores: holes.map((h: { holeNumber: number; score: number; scoreToPar: number }) => ({
        hole: h.holeNumber,
        score: h.score,
        toPar: h.scoreToPar,
      })),
    };
  });

  // Sorter leaderboard
  const sorted = leaderboard.sort((a: { stablefordPoints: number | null; holesPlayed: number; scoreToPar: number | null }, b: { stablefordPoints: number | null; holesPlayed: number; scoreToPar: number | null }) => {
    if (session.format === "STABLEFORD") {
      return (b.stablefordPoints ?? 0) - (a.stablefordPoints ?? 0);
    }
    if (a.holesPlayed === 0 && b.holesPlayed === 0) return 0;
    if (a.holesPlayed === 0) return 1;
    if (b.holesPlayed === 0) return -1;
    return (a.scoreToPar ?? 0) - (b.scoreToPar ?? 0);
  });

  return NextResponse.json({
    sessionId: session.id,
    courseName: session.Course?.name,
    coursePar,
    format: session.format,
    isActive: session.isActive,
    joinCode: session.joinCode,
    leaderboard: sorted,
  });
}
