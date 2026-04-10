"use server";

import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function saveRound(data: {
  date: string;
  courseName?: string;
  totalScore: number;
  scoreToPar: number;
  fairwaysHit?: number;
  fairwaysTotal?: number;
  gir?: number;
  girTotal?: number;
  totalPutts?: number;
  notes?: string;
}) {
  const user = await requirePortalUser();
  const supabase = await createServerSupabase();

  await supabase.from("RoundStats").insert({
    id: nanoid(),
    userId: user.id,
    date: data.date,
    courseName: data.courseName ?? null,
    totalScore: data.totalScore,
    scoreToPar: data.scoreToPar,
    fairwaysHit: data.fairwaysHit ?? null,
    fairwaysTotal: data.fairwaysTotal ?? null,
    gir: data.gir ?? null,
    girTotal: data.girTotal ?? null,
    totalPutts: data.totalPutts ?? null,
    notes: data.notes ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  revalidatePath("/portal/statistikk");
  return { success: true };
}

export async function getCourses() {
  const supabase = await createServerSupabase();

  const { data: courses } = await supabase
    .from("Course")
    .select("id, name, par, holes")
    .order("name");

  return courses || [];
}
