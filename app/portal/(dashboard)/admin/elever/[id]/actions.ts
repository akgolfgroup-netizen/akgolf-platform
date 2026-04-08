"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { revalidatePath } from "next/cache";

export async function updateCoachingNotes(
  sessionId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { success: false, error: "Ingen tilgang" };
  }

  const supabase = await createServerSupabase();

  try {
    await supabase
      .from("CoachingSession")
      .update({ instructorNotes: notes })
      .eq("id", sessionId);

    revalidatePath("/admin/elever");
    return { success: true };
  } catch {
    return { success: false, error: "Kunne ikke oppdatere notater" };
  }
}
