"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function getCommunicationLogs(studentId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = await createServerSupabase();

  const { data: logs } = await supabase
    .from("CommunicationLog")
    .select(`
      id,
      type,
      subject,
      content,
      sentAt,
      Instructor (User (name))
    `)
    .eq("studentId", studentId)
    .order("sentAt", { ascending: false })
    .limit(50);

  return logs || [];
}

export async function addCommunicationLog(
  studentId: string,
  type: string,
  subject: string | null,
  content: string
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ikke tilgang" };
  }

  const supabase = await createServerSupabase();

  // Finn instruktørprofilen til innlogget bruker
  const { data: instructor } = await supabase
    .from("Instructor")
    .select("id")
    .eq("userId", user.id)
    .single();

  if (!instructor) {
    return { success: false, error: "Fant ikke instruktørprofil for innlogget bruker" };
  }

  if (!content.trim()) {
    return { success: false, error: "Innhold kan ikke være tomt" };
  }

  await supabase.from("CommunicationLog").insert({
    id: nanoid(),
    studentId,
    instructorId: instructor.id,
    type,
    subject: subject?.trim() || null,
    content: content.trim(),
  });

  revalidatePath(`/admin/elever/${studentId}`);
  return { success: true };
}
