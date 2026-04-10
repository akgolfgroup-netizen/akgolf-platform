"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

export interface PlayerClubData {
  id: string;
  name: string;
  brand: string | null;
  model: string | null;
  loft: number | null;
  avgCarry: number | null;
  avgTotal: number | null;
  avgOffline: number | null;
  shotCount: number;
  sortOrder: number;
}

export interface GapAnalysisItem {
  between: string;
  gap: number;
  recommended: string;
}

function computeGapAnalysis(clubs: PlayerClubData[]): GapAnalysisItem[] {
  const sorted = clubs
    .filter((c) => (c.avgCarry ?? 0) > 0)
    .sort((a, b) => (b.avgCarry ?? 0) - (a.avgCarry ?? 0));

  if (sorted.length < 2) return [];

  const gaps: GapAnalysisItem[] = [];
  for (let i = 0; i < sorted.length - 1; i++) {
    const carryA = sorted[i].avgCarry ?? 0;
    const carryB = sorted[i + 1].avgCarry ?? 0;
    const gap = carryA - carryB;

    let recommended = "OK";
    if (gap > 20) recommended = "Legg til klubb";
    else if (gap > 15) recommended = "Justert loft";

    gaps.push({
      between: `${sorted[i].name} - ${sorted[i + 1].name}`,
      gap,
      recommended,
    });
  }

  return gaps.filter((g) => g.gap > 10).slice(0, 5);
}

export async function getPlayerBag(): Promise<{
  clubs: PlayerClubData[];
  gapAnalysis: GapAnalysisItem[];
}> {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: bag } = await supabase
    .from("PlayerBag")
    .select(`
      id,
      PlayerClub (*)
    `)
    .eq("userId", user.id)
    .single();

  if (!bag) {
    return { clubs: [], gapAnalysis: [] };
  }

  const clubs = (
    (bag.PlayerClub as PlayerClubData[]) || []
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    clubs,
    gapAnalysis: computeGapAnalysis(clubs),
  };
}

export async function addClub(data: {
  name: string;
  brand?: string;
  model?: string;
  loft?: number;
  avgCarry?: number;
  avgTotal?: number;
}) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  let { data: bag } = await supabase
    .from("PlayerBag")
    .select("id")
    .eq("userId", user.id)
    .single();

  if (!bag) {
    const { data: newBag } = await supabase
      .from("PlayerBag")
      .insert({ id: nanoid(), userId: user.id })
      .select("id")
      .single();
    bag = newBag;
  }

  const { count } = await supabase
    .from("PlayerClub")
    .select("*", { count: "exact", head: true })
    .eq("bagId", bag!.id);

  const { data: club } = await supabase
    .from("PlayerClub")
    .insert({
      id: nanoid(),
      bagId: bag!.id,
      name: data.name,
      brand: data.brand ?? null,
      model: data.model ?? null,
      loft: data.loft ?? null,
      avgCarry: data.avgCarry ?? null,
      avgTotal: data.avgTotal ?? null,
      sortOrder: count ?? 0,
    })
    .select()
    .single();

  return club;
}

export async function updateClub(
  clubId: string,
  data: {
    name?: string;
    brand?: string;
    model?: string;
    loft?: number;
    avgCarry?: number;
    avgTotal?: number;
  }
) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: club } = await supabase
    .from("PlayerClub")
    .select(`
      *,
      PlayerBag (userId)
    `)
    .eq("id", clubId)
    .single();

  if (!club || (club.PlayerBag as { userId: string }).userId !== user.id) {
    throw new Error("Klubb ikke funnet");
  }

  return supabase
    .from("PlayerClub")
    .update({
      name: data.name ?? club.name,
      brand: data.brand ?? club.brand,
      model: data.model ?? club.model,
      loft: data.loft ?? club.loft,
      avgCarry: data.avgCarry ?? club.avgCarry,
      avgTotal: data.avgTotal ?? club.avgTotal,
    })
    .eq("id", clubId)
    .select()
    .single();
}

export async function deleteClub(clubId: string) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: club } = await supabase
    .from("PlayerClub")
    .select(`
      *,
      PlayerBag (userId)
    `)
    .eq("id", clubId)
    .single();

  if (!club || (club.PlayerBag as { userId: string }).userId !== user.id) {
    throw new Error("Klubb ikke funnet");
  }

  await supabase.from("PlayerClub").delete().eq("id", clubId);
}

export async function getClubDispersions() {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  const { data: bag } = await supabase
    .from("PlayerBag")
    .select(`
      id,
      PlayerClub (*)
    `)
    .eq("userId", user.id)
    .order("PlayerClub.sortOrder", { ascending: true })
    .single();

  if (!bag) return [];

  const clubs = (bag.PlayerClub as { name: string; avgCarry: number | null; avgTotal: number | null; avgOffline: number | null; shotCount: number }[]) || [];

  return clubs.map((c) => ({
    club: c.name,
    avgCarry: c.avgCarry ?? 0,
    avgTotal: c.avgTotal ?? 0,
    avgOffline: c.avgOffline ?? 0,
    shotCount: c.shotCount,
    carryStdDev: 0, // Beregnes fra TrackMan
    lateralStdDev: c.avgOffline ?? 0,
  }));
}
