"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getResend, FROM_EMAIL } from "@/lib/portal/email/resend";
import { getTwilioClient } from "@/lib/portal/sms/twilio";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

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

    // Send melding via riktig kanal
    const message = await prisma.unifiedMessage.findUnique({
      where: { id: messageId },
      select: { channel: true, senderHandle: true },
    });

    let sent = false;
    if (message?.channel === "EMAIL" && message.senderHandle) {
      const resend = getResend();
      if (resend) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: message.senderHandle,
          subject: "Svar fra AK Golf",
          text: finalContent,
        });
        sent = true;
      }
    } else if (message?.channel === "SMS" && message.senderHandle) {
      const twilio = getTwilioClient();
      if (twilio) {
        const result = await twilio.sendSms(message.senderHandle, finalContent);
        sent = result.success;
      }
    }

    if (sent) {
      await prisma.unifiedMessage.update({
        where: { id: messageId },
        data: { status: "SENT" },
      });
    }

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

    const message = await prisma.unifiedMessage.findUnique({
      where: { id: messageId },
      select: { content: true, senderName: true, channel: true, assignedToId: true },
    });

    if (!message) {
      return { success: false, error: "Melding ikke funnet" };
    }

    await prisma.unifiedMessage.update({
      where: { id: messageId },
      data: { status: "AI_PROCESSING" },
    });

    // Generer nytt AI-svar asynkront
    try {
      const { generateAIResponse } = await import("@/lib/coach/ai/generate-response");

      const result = await generateAIResponse(
        message.content,
        message.senderName ?? "Ukjent",
        message.channel,
        message.assignedToId ?? user.id
      );

      await prisma.aIResponse.create({
        data: {
          id: nanoid(),
          messageId,
          draftContent: result.content,
          confidence: result.confidence,
          category: result.category,
          modelUsed: result.modelUsed,
          updatedAt: new Date(),
        },
      });

      await prisma.unifiedMessage.update({
        where: { id: messageId },
        data: { status: "AI_READY" },
      });
    } catch (aiError) {
      logger.error("[Meldinger] AI regenerering feilet:", aiError);
      await prisma.unifiedMessage.update({
        where: { id: messageId },
        data: { status: "FAILED" },
      });
    }

    revalidatePath("/portal/admin/meldinger");

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Ukjent feil",
    };
  }
}
