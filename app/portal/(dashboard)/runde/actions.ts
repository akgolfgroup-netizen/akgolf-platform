"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import {
  generateHoleStrategy,
  type DecadeHoleStrategy,
  type HoleLayout,
} from "@/lib/portal/golf/decade-caddy";
import type { ClubDispersion } from "@/lib/portal/golf/dispersion";

export async function searchCourses(query: string) {
  const supabase = await createServerSupabase();

  const { data: courses } = await supabase
    .from("Course")
    .select("id, name, location, par, courseRating, slopeRating")
    .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
    .order("name", { ascending: true })
    .limit(20);

  return courses || [];
}

export async function getCourseHoles(courseId: string, teeColor = "yellow") {
  const supabase = await createServerSupabase();

  const { data: holes } = await supabase
    .from("Hole")
    .select("id, holeNumber, par, handicap, lengthMeter, teeColor")
    .eq("courseId", courseId)
    .eq("teeColor", teeColor)
    .order("holeNumber", { ascending: true });

  return holes || [];
}

export async function startRound(courseId: string, teeColor: string, weather?: string) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: course } = await supabase
    .from("Course")
    .select(`
      id,
      name,
      par,
      Hole (id, holeNumber, par, handicap, lengthMeter, teeColor)
    `)
    .eq("id", courseId)
    .eq("Hole.teeColor", teeColor)
    .order("Hole.holeNumber", { ascending: true })
    .single();

  if (!course) throw new Error("Bane ikke funnet");

  const { data: round } = await supabase
    .from("Round")
    .insert({
      id: nanoid(),
      userId: user.id,
      courseId,
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      teeColor,
      weather: weather ?? null,
      source: "LIVE",
      updatedAt: new Date().toISOString(),
    })
    .select()
    .single();

  return { roundId: round!.id, holes: course.Hole, courseName: course.name, coursePar: course.par };
}

export async function saveHoleResult(
  roundId: string,
  data: {
    holeId: string;
    holeNumber: number;
    par: number;
    score: number;
    putts: number;
    fairwayHit: boolean | null;
    gir: boolean;
    upAndDown?: boolean | null;
    sandSave?: boolean | null;
    penalty?: number;
    strategyFollowed?: boolean | null;
  }
) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select("userId")
    .eq("id", roundId)
    .single();

  if (!round || round.userId !== user.id) throw new Error("Runde ikke funnet");

  const scoreToPar = data.score - data.par;

  // Upsert using unique constraint on roundId_holeNumber
  const { data: existing } = await supabase
    .from("HoleResult")
    .select("id")
    .eq("roundId", roundId)
    .eq("holeNumber", data.holeNumber)
    .single();

  if (existing) {
    await supabase
      .from("HoleResult")
      .update({
        score: data.score,
        scoreToPar,
        putts: data.putts,
        fairwayHit: data.fairwayHit,
        gir: data.gir,
        upAndDown: data.upAndDown ?? null,
        sandSave: data.sandSave ?? null,
        penalty: data.penalty ?? 0,
        strategyFollowed: data.strategyFollowed ?? null,
      })
      .eq("id", existing.id);
  } else {
    await supabase.from("HoleResult").insert({
      id: nanoid(),
      roundId,
      holeId: data.holeId,
      holeNumber: data.holeNumber,
      par: data.par,
      score: data.score,
      scoreToPar,
      putts: data.putts,
      fairwayHit: data.fairwayHit,
      gir: data.gir,
      upAndDown: data.upAndDown ?? null,
      sandSave: data.sandSave ?? null,
      penalty: data.penalty ?? 0,
      strategyFollowed: data.strategyFollowed ?? null,
    });
  }
}

export async function completeRound(roundId: string) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select(`
      id,
      userId,
      Course (par),
      HoleResult (score, putts, gir, fairwayHit, sgTotal, sgTee, sgApproach, sgShortGame, sgPutting)
    `)
    .eq("id", roundId)
    .single();

  if (!round || round.userId !== user.id) throw new Error("Runde ikke funnet");

  const holes = (round.HoleResult as unknown as { score: number; putts: number; gir: boolean; fairwayHit: boolean | null; sgTotal: number | null; sgTee: number | null; sgApproach: number | null; sgShortGame: number | null; sgPutting: number | null }[]) ?? [];
  const totalScore = holes.reduce((sum, h) => sum + h.score, 0);
  const courseArr = round.Course as unknown as Array<{ par: number }>;
  const scoreToPar = totalScore - (courseArr?.[0]?.par ?? 72);
  const totalPutts = holes.reduce((sum, h) => sum + h.putts, 0);
  const girCount = holes.filter((h) => h.gir).length;
  const fairwayHoles = holes.filter((h) => h.fairwayHit !== null);
  const fairwaysHit = fairwayHoles.filter((h) => h.fairwayHit).length;

  const round3 = (n: number | null) => n !== null ? Math.round(n * 1000) / 1000 : null;
  const holesWithSG = holes.filter((h) => h.sgTotal !== null);

  const { data: updated } = await supabase
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
      sgTotal: round3(holesWithSG.reduce((s, h) => s + (h.sgTotal ?? 0), 0) || null),
      sgOffTheTee: round3(holesWithSG.reduce((s, h) => s + (h.sgTee ?? 0), 0) || null),
      sgApproach: round3(holesWithSG.reduce((s, h) => s + (h.sgApproach ?? 0), 0) || null),
      sgShortGame: round3(holesWithSG.reduce((s, h) => s + (h.sgShortGame ?? 0), 0) || null),
      sgPutting: round3(holesWithSG.reduce((s, h) => s + (h.sgPutting ?? 0), 0) || null),
      updatedAt: new Date().toISOString(),
    })
    .eq("id", roundId)
    .select()
    .single();

  return updated;
}

export async function getDecadeStrategy(
  courseId: string,
  teeColor: string,
  handicap: number
): Promise<DecadeHoleStrategy[]> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  // Hent hull for banen
  const { data: holes } = await supabase
    .from("Hole")
    .select("*")
    .eq("courseId", courseId)
    .eq("teeColor", teeColor)
    .order("holeNumber", { ascending: true });

  if (!holes || holes.length === 0) return [];

  // Hent spillerens bag og klubb-dispersjoner
  const { data: bag } = await supabase
    .from("PlayerBag")
    .select(`
      id,
      PlayerClub (
        name,
        avgCarry,
        avgTotal,
        avgOffline,
        shotCount,
        sortOrder
      )
    `)
    .eq("userId", user.id)
    .order("PlayerClub.sortOrder", { ascending: true })
    .single();

  // Konverter PlayerClub til ClubDispersion
  const clubs = (bag?.PlayerClub as { name: string; avgCarry: number | null; avgTotal: number | null; avgOffline: number | null; shotCount: number }[]) || [];
  const dispersions: ClubDispersion[] = clubs
    .filter((c) => c.avgCarry !== null && c.avgCarry > 0)
    .map((c) => {
      const avgCarry = c.avgCarry ?? 0;
      const avgTotal = c.avgTotal ?? avgCarry;
      const avgOffline = Math.abs(c.avgOffline ?? 5);
      // Estimer standardavvik fra gjennomsnitt (ca. 3-5% av carry for lengde, offline direkte)
      const carryStdDev = avgCarry * 0.04;
      const lateralStdDev = avgOffline;

      return {
        club: c.name,
        avgCarry,
        avgTotal,
        carryStdDev,
        lateralStdDev,
        shotCount: c.shotCount,
        dispersion68: {
          carry: Math.round(carryStdDev * 10) / 10,
          lateral: Math.round(lateralStdDev * 10) / 10,
        },
        dispersion95: {
          carry: Math.round(carryStdDev * 2 * 10) / 10,
          lateral: Math.round(lateralStdDev * 2 * 10) / 10,
        },
      };
    });

  // Generer strategi for hvert hull
  const strategies = holes.map((hole) => {
    const layout: HoleLayout = {
      holeNumber: hole.holeNumber,
      par: hole.par,
      lengthMeter: hole.lengthMeter,
      handicap: hole.handicap ?? undefined,
    };

    return generateHoleStrategy(layout, dispersions, handicap);
  });

  return strategies;
}

export async function getUserRounds(limit = 20) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: rounds } = await supabase
    .from("Round")
    .select(`
      *,
      Course (name, par, location),
      HoleResult (id)
    `)
    .eq("userId", user.id)
    .order("date", { ascending: false })
    .limit(limit);

  return (rounds || []).map((r) => ({
    ...r,
    _count: { HoleResult: (r.HoleResult as { id: string }[]).length },
  }));
}

export async function getRoundDetail(roundId: string) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: round } = await supabase
    .from("Round")
    .select(`
      *,
      Course (
        *,
        Hole (id, holeNumber, par, handicap, lengthMeter, teeColor)
      ),
      HoleResult (
        *,
        Shot (*)
      )
    `)
    .eq("id", roundId)
    .eq("Course.Hole.teeColor", "yellow")
    .order("Course.Hole.holeNumber", { ascending: true })
    .order("HoleResult.holeNumber", { ascending: true })
    .order("Shot.shotNumber", { ascending: true })
    .single();

  if (!round || round.userId !== user.id) return null;
  return round;
}
