"use server";

import { revalidatePath } from "next/cache";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { redirect } from "next/navigation";
import { sendPushNotification } from "@/lib/coach/push/send-notification";
import { createNotification } from "@/lib/portal/notifications/create";
import { logger } from "@/lib/logger";

// ── Typer ──────────────────────────────────────────────

export type ConversationSummary = {
  id: string;
  participantName: string;
  participantId: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: Date;
  readAt: Date | null;
};

// ── Actions ───────────────────────────────────────────

/**
 * Finn eksisterende samtale mellom innlogget bruker og student, eller opprett ny.
 * Returnerer conversationId.
 */
export async function getOrCreateConversation(
  studentId: string
): Promise<{ conversationId: string; error?: string }> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/");

  try {
    // Finn eksisterende samtale der begge brukere er deltakere
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          { User: { some: { id: user.id } } },
          { User: { some: { id: studentId } } },
        ],
      },
      select: { id: true },
    });

    if (existing) {
      return { conversationId: existing.id };
    }

    // Opprett ny samtale med begge som deltakere
    const conversation = await prisma.conversation.create({
      data: {
        id: nanoid(),
        updatedAt: new Date(),
        User: {
          connect: [{ id: user.id }, { id: studentId }],
        },
      },
    });

    return { conversationId: conversation.id };
  } catch (error) {
    logger.error("[chat-actions] getOrCreateConversation failed:", error);
    return { conversationId: "", error: "Kunne ikke opprette samtale" };
  }
}

/**
 * Hent alle meldinger i en samtale, sortert kronologisk.
 */
export async function getConversationMessages(
  conversationId: string
): Promise<ChatMessage[]> {
  const user = await requirePortalUser();

  // Verifiser at brukeren er deltaker i samtalen
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      User: { some: { id: user.id } },
    },
  });

  if (!conversation) return [];

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
    include: {
      User: {
        select: { id: true, name: true },
      },
    },
  });

  return messages.map((m) => ({
    id: m.id,
    senderId: m.senderId,
    senderName: m.User.name ?? "Ukjent",
    content: m.content,
    createdAt: m.createdAt,
    readAt: m.readAt,
  }));
}

/**
 * Send en direktemelding i en samtale.
 */
export async function sendDirectMessage(
  conversationId: string,
  content: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();

  if (!content.trim()) {
    return { success: false, error: "Meldingen kan ikke vaere tom" };
  }

  try {
    // Verifiser at brukeren er deltaker
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        User: { some: { id: user.id } },
      },
      include: {
        User: {
          select: { id: true, name: true },
        },
      },
    });

    if (!conversation) {
      return { success: false, error: "Samtale ikke funnet" };
    }

    // Opprett melding
    const message = await prisma.message.create({
      data: {
        id: nanoid(),
        conversationId,
        senderId: user.id,
        content: content.trim(),
      },
    });

    // Oppdater samtalen
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Send push-notifikasjon til alle andre deltakere
    const recipients = conversation.User.filter((u) => u.id !== user.id);
    const senderName = user.name ?? "Trener";
    const preview = content.trim().substring(0, 100);

    for (const recipient of recipients) {
      try {
        await sendPushNotification(recipient.id, {
          title: `Ny melding fra ${senderName}`,
          body: preview,
          icon: "/icons/icon-192.png",
          badge: "/icons/badge-72.png",
          data: {
            url: "/portal/meldinger",
            messageId: message.id,
            type: "direct_message",
          },
        });

        await createNotification({
          userId: recipient.id,
          senderId: user.id,
          type: "GENERAL",
          title: `Ny melding fra ${senderName}`,
          message: preview,
          linkUrl: "/portal/meldinger",
          linkText: "Se melding",
        });
      } catch (err) {
        logger.error("[chat-actions] Push notification failed:", err);
      }
    }

    revalidatePath("/portal/meldinger");
    revalidatePath("/portal/admin/meldinger");

    return { success: true };
  } catch (error) {
    logger.error("[chat-actions] sendDirectMessage failed:", error);
    return { success: false, error: "Kunne ikke sende melding" };
  }
}

/**
 * Hent alle samtaler for innlogget bruker med siste melding og ulest-teller.
 */
export async function getMyConversations(): Promise<ConversationSummary[]> {
  const user = await requirePortalUser();

  const conversations = await prisma.conversation.findMany({
    where: {
      User: { some: { id: user.id } },
    },
    include: {
      User: {
        select: { id: true, name: true },
      },
      Message: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          content: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  // Hent ulest-teller per samtale (meldinger IKKE sendt av meg, uten readAt)
  const summaries: ConversationSummary[] = [];

  for (const conv of conversations) {
    const otherUser = conv.User.find((u) => u.id !== user.id);
    if (!otherUser) continue;

    const unreadCount = await prisma.message.count({
      where: {
        conversationId: conv.id,
        senderId: { not: user.id },
        readAt: null,
      },
    });

    const lastMsg = conv.Message[0];

    summaries.push({
      id: conv.id,
      participantName: otherUser.name ?? "Ukjent",
      participantId: otherUser.id,
      lastMessage: lastMsg?.content ?? null,
      lastMessageAt: lastMsg?.createdAt ?? null,
      unreadCount,
    });
  }

  return summaries;
}

/**
 * Marker alle uleste meldinger i en samtale som lest.
 */
export async function markConversationAsRead(
  conversationId: string
): Promise<{ success: boolean; error?: string }> {
  const user = await requirePortalUser();

  try {
    // Verifiser at brukeren er deltaker
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        User: { some: { id: user.id } },
      },
    });

    if (!conversation) {
      return { success: false, error: "Samtale ikke funnet" };
    }

    // Marker alle meldinger fra ANDRE som lest
    await prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: user.id },
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });

    revalidatePath("/portal/meldinger");
    revalidatePath("/portal/admin/meldinger");

    return { success: true };
  } catch (error) {
    logger.error("[chat-actions] markConversationAsRead failed:", error);
    return { success: false, error: "Kunne ikke markere som lest" };
  }
}
