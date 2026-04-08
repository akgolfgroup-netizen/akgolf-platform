"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { nanoid } from "nanoid";

export async function getGoals() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  const { data: goals } = await supabase
    .from("Goal")
    .select("*")
    .eq("userId", user.id)
    .order("status", { ascending: true })
    .order("createdAt", { ascending: false });

  return goals || [];
}

export async function createGoal(data: {
  title: string;
  description?: string;
  category: string;
  targetValue?: number;
  unit?: string;
  targetDate?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  await supabase.from("Goal").insert({
    id: nanoid(),
    updatedAt: new Date().toISOString(),
    userId: user.id,
    title: data.title,
    description: data.description ?? null,
    category: data.category,
    targetValue: data.targetValue ?? null,
    unit: data.unit ?? null,
    targetDate: data.targetDate ? new Date(data.targetDate).toISOString() : null,
  });

  revalidatePath("/profil");
}

export async function updateGoal(
  id: string,
  data: Partial<{
    title: string;
    description: string;
    category: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    targetDate: string;
    status: string;
  }>
) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("Goal")
    .select("id")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (!existing) throw new Error("Mål ikke funnet");

  const updateData: Record<string, unknown> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.category !== undefined) updateData.category = data.category;
  if (data.targetValue !== undefined) updateData.targetValue = data.targetValue;
  if (data.currentValue !== undefined) updateData.currentValue = data.currentValue;
  if (data.unit !== undefined) updateData.unit = data.unit;
  if (data.targetDate !== undefined) updateData.targetDate = new Date(data.targetDate).toISOString();
  if (data.status !== undefined) updateData.status = data.status;

  await supabase
    .from("Goal")
    .update(updateData)
    .eq("id", id);

  revalidatePath("/profil");
}

export async function deleteGoal(id: string) {
  const user = await requirePortalUser();
  if (!user?.id) throw new Error("Ikke innlogget");

  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("Goal")
    .select("id")
    .eq("id", id)
    .eq("userId", user.id)
    .single();

  if (!existing) throw new Error("Mål ikke funnet");

  await supabase.from("Goal").delete().eq("id", id);

  revalidatePath("/profil");
}
