import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getPortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import {
  parseTrackManCSV,
  convertToMetric,
  aggregateByClub,
} from "@/lib/portal/golf/trackman-parser";

/**
 * POST /api/portal/trackman/upload-csv — Last opp TrackMan CSV
 * Body: { csvContent: string, sessionDate?: string, club?: string }
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const body = await req.json();
  const { csvContent, sessionDate } = body;

  if (!csvContent || typeof csvContent !== "string") {
    return NextResponse.json(
      { error: "csvContent er paakrevd" },
      { status: 400 }
    );
  }

  let shots;
  try {
    const rawShots = parseTrackManCSV(csvContent);
    shots = rawShots.map(convertToMetric);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Feil ved parsing av CSV" },
      { status: 400 }
    );
  }

  if (shots.length === 0) {
    return NextResponse.json(
      { error: "Ingen gyldige slag funnet i CSV-filen" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();

  // Aggreger per klubb
  const clubAggregates = aggregateByClub(shots);

  // Lagre en TrackmanSession per klubb
  const sessions = [];
  for (const agg of clubAggregates) {
    const clubShots = shots.filter((s) => s.club === agg.club);
    const { data: session, error } = await supabase
      .from("TrackManSession")
      .insert({
        id: nanoid(),
        userId: user.id,
        sessionDate: sessionDate ? new Date(sessionDate).toISOString() : new Date().toISOString(),
        club: agg.club,
        shots: clubShots,
        averages: agg,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: "Kunne ikke lagre session" }, { status: 500 });
    }
    sessions.push(session);
  }

  // Oppdater PlayerBag med nye gjennomsnitt
  const { data: bag, error: bagError } = await supabase
    .from("PlayerBag")
    .select(`
      *,
      PlayerClub (*)
    `)
    .eq("userId", user.id)
    .single();

  let playerBag = bag;
  if (bagError || !bag) {
    // Create new bag
    const { data: newBag, error: createError } = await supabase
      .from("PlayerBag")
      .insert({
        id: nanoid(),
        userId: user.id,
      })
      .select(`
        *,
        PlayerClub (*)
      `)
      .single();

    if (createError) {
      return NextResponse.json({ error: "Kunne ikke opprette bag" }, { status: 500 });
    }
    playerBag = newBag;
  }

  for (const agg of clubAggregates) {
    const existingClub = (playerBag?.PlayerClub || []).find(
      (c: { name: string }) => c.name.toLowerCase() === agg.club.toLowerCase()
    );

    if (existingClub) {
      await supabase
        .from("PlayerClub")
        .update({
          avgCarry: agg.avgCarry,
          avgTotal: agg.avgTotal,
          avgOffline: agg.avgOffline,
          shotCount: existingClub.shotCount + agg.count,
        })
        .eq("id", existingClub.id);
    } else {
      await supabase
        .from("PlayerClub")
        .insert({
          id: nanoid(),
          bagId: playerBag.id,
          name: agg.club,
          avgCarry: agg.avgCarry,
          avgTotal: agg.avgTotal,
          avgOffline: agg.avgOffline,
          shotCount: agg.count,
        });
    }
  }

  return NextResponse.json({
    message: `${shots.length} slag importert fra ${clubAggregates.length} klubber`,
    sessions: sessions.length,
    clubSummary: clubAggregates.map((a) => ({
      club: a.club,
      count: a.count,
      avgCarry: a.avgCarry,
      avgTotal: a.avgTotal,
      lateralStdDev: a.lateralStdDev,
      carryStdDev: a.carryStdDev,
    })),
  });
}
