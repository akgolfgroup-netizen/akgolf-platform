"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";

export async function approveMessage(
  messageId: string,
  finalContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!isStaff(user.role)) redirect("/");

    // Find the AI response for this message
    const aiResponse = await prisma.aIResponse.findFirst({
      where: { messageId },
    });

    await prisma.$transaction([
      ...(aiResponse
        ? [
            prisma.aIResponse.update({
              where: { id: aiResponse.id },
              data: {
                finalContent,
                wasEdited: true,
                approvedById: user.id,
                approvedAt: new Date(),
              },
            }),
          ]
        : []),
      prisma.unifiedMessage.update({
        where: { id: messageId },
        data: { status: "APPROVED" },
      }),
    ]);

    // TODO: Send melding via riktig kanal — sett status til SENT når faktisk sendt

    revalidatePath("/portal/admin/meldinger");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function rejectMessage(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!isStaff(user.role)) redirect("/");

    await prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "FAILED" },
    });

    revalidatePath("/portal/admin/meldinger");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}

export async function regenerateAIResponse(
  messageId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();
    if (!isStaff(user.role)) redirect("/");

    // TODO: Implementer AI-regenerering når AI-modulen er klar
    await prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "AI_PROCESSING" },
    });

    revalidatePath("/portal/admin/meldinger");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
