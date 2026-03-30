"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

export async function approveMessage(
  messageId: string,
  finalContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await requirePortalUser();

    await prisma.$transaction([
      prisma.aIResponse.update({
        where: { messageId },
        data: {
          finalContent,
          wasEdited: true,
          approvedById: user.id,
          approvedAt: new Date(),
        },
      }),
      prisma.unifiedMessage.update({
        where: { id: messageId },
        data: { status: "APPROVED" },
      }),
    ]);

    // TODO: Send melding via riktig kanal

    await prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "SENT" },
    });

    revalidatePath("/coach/inbox");

    return { success: true };
  } catch (error) {
    console.error("Failed to approve message:", error);
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
    await requirePortalUser();

    await prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "FAILED" },
    });

    revalidatePath("/coach/inbox");

    return { success: true };
  } catch (error) {
    console.error("Failed to reject message:", error);
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
    await requirePortalUser();

    // TODO: Implementer AI-regenerering når AI-modulen er klar
    // For nå, sett status tilbake til AI_PROCESSING
    await prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "AI_PROCESSING" },
    });

    revalidatePath("/coach/inbox");

    return { success: true };
  } catch (error) {
    console.error("Failed to regenerate AI response:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
