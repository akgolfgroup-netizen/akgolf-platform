"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabase } from "@/lib/supabase/server";
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

    const supabase = await createServerSupabase();

    // Find the AI response for this message
    const { data: aiResponse } = await supabase
      .from("AIResponse")
      .select("id")
      .eq("messageId", messageId)
      .single();

    if (aiResponse) {
      await supabase
        .from("AIResponse")
        .update({
          finalContent,
          wasEdited: true,
          approvedById: user.id,
          approvedAt: new Date().toISOString(),
        })
        .eq("id", aiResponse.id);
    }

    await supabase
      .from("UnifiedMessage")
      .update({ status: "APPROVED" })
      .eq("id", messageId);

    // Send melding via riktig kanal
    const { data: message } = await supabase
      .from("UnifiedMessage")
      .select("channel, senderHandle")
      .eq("id", messageId)
      .single();

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
      await supabase
        .from("UnifiedMessage")
        .update({ status: "SENT" })
        .eq("id", messageId);
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

    const supabase = await createServerSupabase();

    await supabase
      .from("UnifiedMessage")
      .update({ status: "FAILED" })
      .eq("id", messageId);

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

    const supabase = await createServerSupabase();

    const { data: message } = await supabase
      .from("UnifiedMessage")
      .select("content, senderName, channel, assignedToId")
      .eq("id", messageId)
      .single();

    if (!message) {
      return { success: false, error: "Melding ikke funnet" };
    }

    await supabase
      .from("UnifiedMessage")
      .update({ status: "AI_PROCESSING" })
      .eq("id", messageId);

    // Generer nytt AI-svar asynkront
    try {
      const { generateAIResponse } = await import("@/lib/coach/ai/generate-response");

      const result = await generateAIResponse(
        message.content,
        message.senderName ?? "Ukjent",
        message.channel,
        message.assignedToId ?? user.id
      );

      await supabase.from("AIResponse").insert({
        id: nanoid(),
        messageId,
        draftContent: result.content,
        confidence: result.confidence,
        category: result.category,
        modelUsed: result.modelUsed,
        updatedAt: new Date().toISOString(),
      });

      await supabase
        .from("UnifiedMessage")
        .update({ status: "AI_READY" })
        .eq("id", messageId);
    } catch (aiError) {
      logger.error("[Meldinger] AI regenerering feilet:", aiError);
      await supabase
        .from("UnifiedMessage")
        .update({ status: "FAILED" })
        .eq("id", messageId);
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
