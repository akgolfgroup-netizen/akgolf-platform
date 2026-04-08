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

  const where = isStaff(user.role)
    ? {} // Staff sees all sessions
    : { studentId: user.id };

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

  const supabase = await createServerSupabase();

  await supabase
    .from("CoachingSession")
    .update({
      aiKeyPoints: summary.keyPoints,
      aiFocusAreas: summary.focusAreas,
      aiActionItems: summary.actionItems,
      aiGeneratedAt: new Date().toISOString(),
    })
    .eq("id", sessionId);

  revalidatePath("/coaching-historikk");
}
