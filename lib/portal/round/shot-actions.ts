"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import {
  calculateShotSg,
  getSgCategory,
  expectedStrokesFromLie,
  type LieType,
} from "@/lib/portal/strokes-gained/expected-strokes";

export async function logShot(
  roundId: string,
  data: {
    holeNumber: number;
    holeId: string;
    shotNumber: number;
    club: string;
    fromLie: string;
    fromDistance: number;
    toLie: string;
    toDistance: number;
    fromLat?: number;
    fromLng?: number;
    toLat?: number;
    toLng?: number;
    par: number;
  }
): Promise<{ shotId: string; sgEstimate: number }> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select("userId")
    .eq("id", roundId)
    .single();
  if (!round || round.userId !== user.id)
    throw new Error("Runde ikke funnet");

  const { data: existingHr } = await supabase
    .from("HoleResult")
    .select("id")
    .eq("roundId", roundId)
    .eq("holeNumber", data.holeNumber)
    .single();

  let holeResultId = existingHr?.id;
  if (!holeResultId) {
    const { data: newHr, error: hrErr } = await supabase
      .from("HoleResult")
      .insert({
        id: nanoid(),
        roundId,
        holeId: data.holeId,
        holeNumber: data.holeNumber,
        par: data.par,
        score: data.par,
        scoreToPar: 0,
        putts: 0,
        gir: false,
      })
      .select("id")
      .single();
    if (hrErr || !newHr)
      throw new Error("Kunne ikke opprette hull-resultat");
    holeResultId = newHr.id;
  }

  const fromLie = normalizeLie(data.fromLie);
  const toLie = normalizeLie(data.toLie);

  const sg = calculateShotSg(
    { lie: fromLie, distance: data.fromDistance, par: data.par },
    { lie: toLie, distance: data.toDistance, par: data.par }
  );

  const sgCategory = getSgCategory(
    fromLie,
    data.fromDistance,
    data.par,
    data.shotNumber
  );

  const expectedBefore =
    Math.round(expectedStrokesFromLie(fromLie, data.fromDistance, data.par) * 1000) / 1000;

  const expectedAfter =
    Math.round(expectedStrokesFromLie(toLie, data.toDistance, data.par) * 1000) / 1000;

  const shotId = nanoid();
  const { error: shotErr } = await supabase.from("Shot").insert({
    id: shotId,
    holeResultId,
    holeId: data.holeId,
    shotNumber: data.shotNumber,
    fromLie: data.fromLie,
    fromDistance: data.fromDistance,
    toLie: data.toLie,
    toDistance: data.toDistance,
    club: data.club,
    expectedBefore,
    expectedAfter,
    strokesGained: sg,
    sgCategory,
    fromLat: data.fromLat ?? null,
    fromLng: data.fromLng ?? null,
    toLat: data.toLat ?? null,
    toLng: data.toLng ?? null,
    loggedAt: new Date().toISOString(),
  });

  if (shotErr) throw new Error("Kunne ikke lagre slag: " + shotErr.message);

  await supabase
    .from("RoundLiveState")
    .update({
      currentShotNumber: data.shotNumber,
      lastActivityAt: new Date().toISOString(),
    })
    .eq("roundId", roundId);

  return { shotId, sgEstimate: sg };
}

export async function completeHole(
  roundId: string,
  holeNumber: number,
  finalScore: number,
  putts: number
): Promise<void> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select("userId")
    .eq("id", roundId)
    .single();
  if (!round || round.userId !== user.id)
    throw new Error("Runde ikke funnet");

  const { data: hr } = await supabase
    .from("HoleResult")
    .select("id, par")
    .eq("roundId", roundId)
    .eq("holeNumber", holeNumber)
    .single();

  if (!hr) throw new Error("Hull-resultat ikke funnet");

  const { data: shots } = await supabase
    .from("Shot")
    .select("fromLie, toLie, strokesGained, sgCategory")
    .eq("holeResultId", hr.id)
    .order("shotNumber", { ascending: true });

  const shotList = shots ?? [];

  let fairwayHit: boolean | null = null;
  const firstShot = shotList[0];
  const par = hr.par;

  if (par !== 3 && firstShot) {
    fairwayHit = firstShot.toLie === "fairway" || firstShot.toLie === "green";
  }

  const girThreshold = par - 2;
  let gir = false;
  for (let i = 0; i < shotList.length; i++) {
    if (i < girThreshold && shotList[i].toLie === "green") {
      gir = true;
      break;
    }
  }

  const sgAgg = {
    sgTotal: 0,
    sgTee: 0,
    sgApproach: 0,
    sgShortGame: 0,
    sgPutting: 0,
  };
  for (const s of shotList) {
    sgAgg.sgTotal += s.strokesGained ?? 0;
    if (s.sgCategory === "OTT") sgAgg.sgTee += s.strokesGained ?? 0;
    if (s.sgCategory === "APP") sgAgg.sgApproach += s.strokesGained ?? 0;
    if (s.sgCategory === "ARG") sgAgg.sgShortGame += s.strokesGained ?? 0;
    if (s.sgCategory === "PUT") sgAgg.sgPutting += s.strokesGained ?? 0;
  }

  await supabase
    .from("HoleResult")
    .update({
      score: finalScore,
      scoreToPar: finalScore - par,
      putts,
      fairwayHit,
      gir,
      sgTotal: Math.round(sgAgg.sgTotal * 1000) / 1000 || null,
      sgTee: Math.round(sgAgg.sgTee * 1000) / 1000 || null,
      sgApproach: Math.round(sgAgg.sgApproach * 1000) / 1000 || null,
      sgShortGame: Math.round(sgAgg.sgShortGame * 1000) / 1000 || null,
      sgPutting: Math.round(sgAgg.sgPutting * 1000) / 1000 || null,
    })
    .eq("id", hr.id);

  await supabase
    .from("RoundLiveState")
    .update({
      currentHoleNumber: holeNumber + 1,
      currentShotNumber: 0,
      lastActivityAt: new Date().toISOString(),
    })
    .eq("roundId", roundId);
}

export async function completeRound(roundId: string): Promise<{
  totalScore: number;
  sgTotal: number;
  sgBreakdown: { ott: number; app: number; arg: number; put: number };
}> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select("userId, Course(par)")
    .eq("id", roundId)
    .single();

  if (!round || round.userId !== user.id)
    throw new Error("Runde ikke funnet");

  const { data: holeResults } = await supabase
    .from("HoleResult")
    .select(
      "score, putts, gir, fairwayHit, sgTotal, sgTee, sgApproach, sgShortGame, sgPutting"
    )
    .eq("roundId", roundId);

  const holes = holeResults ?? [];
  const totalScore = holes.reduce((s, h) => s + (h.score ?? 0), 0);
  const coursePar = (round.Course as { par?: number } | null)?.par ?? 72;
  const scoreToPar = totalScore - coursePar;
  const totalPutts = holes.reduce((s, h) => s + (h.putts ?? 0), 0);
  const girCount = holes.filter((h) => h.gir).length;
  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;

  const sgTotal =
    Math.round(holes.reduce((s, h) => s + (h.sgTotal ?? 0), 0) * 1000) / 1000;
  const sgOtt =
    Math.round(holes.reduce((s, h) => s + (h.sgTee ?? 0), 0) * 1000) / 1000;
  const sgApp =
    Math.round(holes.reduce((s, h) => s + (h.sgApproach ?? 0), 0) * 1000) / 1000;
  const sgArg =
    Math.round(holes.reduce((s, h) => s + (h.sgShortGame ?? 0), 0) * 1000) / 1000;
  const sgPutt =
    Math.round(holes.reduce((s, h) => s + (h.sgPutting ?? 0), 0) * 1000) / 1000;

  await supabase
    .from("Round")
    .update({
      isComplete: true,
      endTime: new Date().toISOString(),
      totalScore,
      scoreToPar,
      totalPutts,
      girCount,
      fairwaysHit,
      fairwaysTotal: fairwayHoles.length,
      sgTotal,
      sgOffTheTee: sgOtt,
      sgApproach: sgApp,
      sgShortGame: sgArg,
      sgPutting: sgPutt,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", roundId);

  await supabase.from("RoundStats").insert({
    id: nanoid(),
    userId: user.id,
    date: new Date(),
    source: "LIVE",
    totalScore,
    scoreToPar,
    sgTotal,
    sgOffTheTee: sgOtt,
    sgApproach: sgApp,
    sgAroundTheGreen: sgArg,
    sgPutting: sgPutt,
    fairwaysHit,
    fairwaysTotal: fairwayHoles.length,
    gir: girCount,
    girTotal: holes.length,
    totalPutts,
    puttsPerGir:
      girCount > 0
        ? Math.round((totalPutts / girCount) * 100) / 100
        : null,
    upAndDownMade: 0,
    upAndDownTotal: 0,
    sandSaveMade: 0,
    sandSaveTotal: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return {
    totalScore,
    sgTotal,
    sgBreakdown: { ott: sgOtt, app: sgApp, arg: sgArg, put: sgPutt },
  };
}

function normalizeLie(lie: string): LieType {
  if (lie === "tee") return "tee";
  if (lie === "green") return "green";
  if (lie.includes("rough")) return "rough";
  if (lie.includes("bunker")) return "bunker";
  return "fairway";
}
