// lib/coach/integrations/gmail.ts

import { prisma } from "@/lib/portal/prisma";
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
  // Sjekk om meldingen allerede er prosessert
  const existing = await prisma.unifiedMessage.findFirst({
    where: {
      channel: "EMAIL",
      externalId: message.id,
    },
  });

  if (existing) return;

  // Opprett melding
  const unifiedMessage = await prisma.unifiedMessage.create({
    data: {
      channel: "EMAIL",
      direction: "INBOUND",
      externalId: message.id,
      senderName: message.from,
      senderHandle: message.fromEmail,
      subject: message.subject,
      content: message.body,
      receivedAt: message.date,
      threadId: message.threadId,
      assignedToId: targetUserId,
      status: "AI_PROCESSING",
    },
  });

  // Generer AI-svar
  const aiResponse = await generateAIResponse(
    message.body,
    message.from,
    "EMAIL",
    targetUserId || "system"
  );

  await prisma.aIResponse.create({
    data: {
      messageId: unifiedMessage.id,
      draftContent: aiResponse.content,
      confidence: aiResponse.confidence,
      category: aiResponse.category,
      modelUsed: aiResponse.modelUsed,
      autoSent: aiResponse.confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD,
    },
  });

  // Oppdater status
  await prisma.unifiedMessage.update({
    where: { id: unifiedMessage.id },
    data: {
      status: aiResponse.confidence >= AUTO_SEND_CONFIDENCE_THRESHOLD ? "SENT" : "AI_READY",
    },
  });

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
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
}
