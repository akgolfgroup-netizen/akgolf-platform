"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
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

  try {
    await prisma.coachingSession.update({
      where: { id: sessionId },
      data: { instructorNotes: notes },
    });

    revalidatePath("/admin/elever");
    return { success: true };
  } catch (error) {
    console.error("Failed to update coaching notes:", error);
    return { success: false, error: "Kunne ikke oppdatere notater" };
  }
}
