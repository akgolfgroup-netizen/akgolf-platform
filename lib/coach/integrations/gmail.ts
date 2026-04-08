// lib/coach/integrations/gmail.ts

import { createServiceClient } from "@/lib/supabase/server";
import { generateAIResponse, AUTO_SEND_CONFIDENCE_THRESHOLD } from "../ai/generate-response";
import { notifyNewMessage } from "../push/send-notification";

interface GmailMessage {
  id: string;
  threadId: string;
  from: string;
  fromEmail: string;
  subject: string;
  body: string;
  date: Date;
}

/**
 * Prosesserer innkommende e-post fra Gmail.
 * - Oppretter UnifiedMessage
 * - Genererer AI-svar
 * - Sender push notification hvis konfidensen er under 95%
 */
export async function processIncomingEmail(
  message: GmailMessage,
  targetUserId: string | null
): Promise<void> {
  const supabase = createServiceClient();

  // Sjekk om meldingen allerede er prosessert
  const { data: existing } = await supabase
    .from("UnifiedMessage")
    .select("id")
    .eq("channel", "EMAIL")
    .eq("externalId", message.id)
    .single();

  if (existing) return;

  // Opprett melding
  const { data: unifiedMessage, error: createError } = await supabase
    .from("UnifiedMessage")
    .insert({
      channel: "EMAIL",
      direction: "INBOUND",
      externalId: message.id,
      senderName: message.from,
      senderHandle: message.fromEmail,
      subject: message.subject,
      content: message.body,
      receivedAt: message.date.toISOString(),
      threadId: message.threadId,
      assignedToId: targetUserId,
      status: "AI_PROCESSING",
    })
    .select()
    .single();

  if (createError || !unifiedMessage) {
    throw new Error(`Failed to create unified message: ${createError?.message}`);
  }

  // Generer AI-svar
  const aiResponse = await generateAIResponse(
    message.body,
    message.from,
    "EMAIL",
    targetUserId || "system"
  );

  await supabase
    .from("AIResponse")
    .insert({
      messageId: unifiedMessage.id,
      draftContent: aiResponse.content,
      confidence: aiResponse.confidence,
      category: aiResponse.category,
      modelUsed: aiResponse.modelUsed,
      autoSent: aiResponse.confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD,
    });

  // Oppdater status
  await supabase
    .from("UnifiedMessage")
    .update({
      status: aiResponse.confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD ? "SENT" : "AI_READY",
    })
    .eq("id", unifiedMessage.id);

  // Send push notification hvis konfidensen er under 95%
  if (targetUserId && aiResponse.confidence < AUTO_SEND_CONFIDENCE_THRESHOLD) {
    await notifyNewMessage(
      targetUserId,
      message.from,
      message.body,
      unifiedMessage.id
    );
  }
}

/**
 * Router e-post til riktig bruker basert på mottakeradresse.
 * - anders@akgolf.no → Anders
 * - markus@akgolf.no → Markus
 * - post@akgolf.no → null (alle trenere)
 */
export async function routeEmailToUser(toEmail: string): Promise<string | null> {
  const normalizedEmail = toEmail.toLowerCase().trim();

  // Hent e-post-bruker-mapping fra databasen
  const emailToUserMap: Record<string, string | null> = {
    "anders@akgolf.no": await findUserIdByEmail("anders@akgolf.no"),
    "markus@akgolf.no": await findUserIdByEmail("markus@akgolf.no"),
    "post@akgolf.no": null, // Null = alle trenere får tilgang
  };

  return emailToUserMap[normalizedEmail] ?? null;
}

/**
 * Finner bruker-ID basert på e-post.
 * Returnerer null hvis brukeren ikke finnes.
 */
async function findUserIdByEmail(email: string): Promise<string | null> {
  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("User")
    .select("id")
    .eq("email", email)
    .single();

  return user?.id ?? null;
}
