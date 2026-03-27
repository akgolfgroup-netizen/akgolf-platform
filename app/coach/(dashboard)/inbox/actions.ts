"use server";

import { revalidatePath } from "next/cache";
// TODO: Importer prisma når modellene er lagt til
// import { prisma } from "@/lib/portal/prisma";
// import { requirePortalUser } from "@/lib/portal/auth";

export async function approveMessage(
  messageId: string,
  finalContent: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // TODO: Aktiver når Prisma-modellene er lagt til
    // const user = await requirePortalUser();
    //
    // await prisma.$transaction([
    //   prisma.aIResponse.update({
    //     where: { messageId },
    //     data: {
    //       finalContent,
    //       wasEdited: true,
    //       approvedById: user.id,
    //       approvedAt: new Date(),
    //     },
    //   }),
    //   prisma.unifiedMessage.update({
    //     where: { id: messageId },
    //     data: { status: "APPROVED" },
    //   }),
    // ]);
    //
    // // TODO: Send melding via riktig kanal
    //
    // await prisma.unifiedMessage.update({
    //   where: { id: messageId },
    //   data: { status: "SENT" },
    // });

    console.log(`[Mock] Approved message ${messageId} with content:`, finalContent);

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
    // TODO: Aktiver når Prisma-modellene er lagt til
    // await requirePortalUser();
    //
    // await prisma.unifiedMessage.update({
    //   where: { id: messageId },
    //   data: { status: "FAILED" },
    // });

    console.log(`[Mock] Rejected message ${messageId}`);

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
    // TODO: Implementer AI-regenerering når AI-modulen er klar
    console.log(`[Mock] Regenerating AI response for message ${messageId}`);

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
