"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { isStaff } from "@/lib/portal/rbac";
import { nanoid } from "nanoid";

export async function getCoachingSessions() {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const supabase = await createServerSupabase();

  let query = supabase
    .from("CoachingSession")
    .select(`
      *,
      User (name, image),
      Instructor (
        title,
        User (name)
      )
    `)
    .order("sessionDate", { ascending: false })
    .limit(50);

  if (!isStaff(user.role)) {
    query = query.eq("studentId", user.id);
  }

  const { data: sessions } = await query;

  return sessions || [];
}

export async function createCoachingSession(data: {
  bookingId: string;
  studentId: string;
  instructorId: string;
  sessionDate: Date;
  primaryFocus?: string;
  instructorNotes?: string;
  studentNotes?: string;
}) {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = await createServerSupabase();

  const { data: created } = await supabase
    .from("CoachingSession")
    .insert({
      id: nanoid(),
      updatedAt: new Date().toISOString(),
      bookingId: data.bookingId,
      studentId: data.studentId,
      instructorId: data.instructorId,
      sessionDate: data.sessionDate.toISOString(),
      primaryFocus: data.primaryFocus,
      instructorNotes: data.instructorNotes,
      studentNotes: data.studentNotes,
      techniquesCovered: [],
      drillsAssigned: [],
      videoUrls: [],
    })
    .select()
    .single();

  revalidatePath("/coaching-historikk");
  return created;
}

const MAX_AI_ITEMS = 10;

function sanitizeStringArray(input: unknown, maxItems = MAX_AI_ITEMS): string[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .slice(0, maxItems);
}

export async function saveAISummary(
  sessionId: string,
  summary: {
    keyPoints: string[];
    focusAreas: string[];
    actionItems: string[];
  }
) {
  const user = await requirePortalUser();
  if (!user || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (!sessionId || typeof sessionId !== "string") {
    throw new Error("Ugyldig sesjons-ID");
  }

  const keyPoints = sanitizeStringArray(summary?.keyPoints);
  const focusAreas = sanitizeStringArray(summary?.focusAreas);
  const actionItems = sanitizeStringArray(summary?.actionItems);

  const supabase = await createServerSupabase();

  await supabase
    .from("CoachingSession")
    .update({
      aiKeyPoints: keyPoints,
      aiFocusAreas: focusAreas,
      aiActionItems: actionItems,
      aiGeneratedAt: new Date().toISOString(),
    })
    .eq("id", sessionId);

  revalidatePath("/coaching-historikk");
}
