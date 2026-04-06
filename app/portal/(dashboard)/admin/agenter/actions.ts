"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function toggleAgent(
  agentId: string,
  enabled: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!isAdmin(user.role)) redirect("/");

    await prisma.agentConfig.upsert({
      where: {
        userId_agentId: { userId: user.id, agentId },
      },
      update: { isActive: enabled },
      create: {
        userId: user.id,
        agentId,
        isActive: enabled,
      },
    });

    revalidatePath("/portal/admin/agenter");
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function getAgentStates(): Promise<Record<string, boolean>> {
  const user = await requirePortalUser();
  if (!isAdmin(user.role)) redirect("/");

  const configs = await prisma.agentConfig.findMany({
    where: { userId: user.id },
    select: { agentId: true, isActive: true },
  });

  return Object.fromEntries(configs.map((c) => [c.agentId, c.isActive]));
}
