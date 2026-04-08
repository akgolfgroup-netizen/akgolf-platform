"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";

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
