"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { revalidatePath } from "next/cache";

export async function getConversationMessages(conversationId: string) {
  const user = await requirePortalUser();

  // Verifiser at brukeren er deltaker
  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: user.id } },
    },
  });

  if (!conversation) throw new Error("Samtale ikke funnet");

  const messages = await prisma.message.findMany({
    where: { conversationId },
    include: { Sender: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((m) => ({
    id: m.id,
    content: m.content,
    senderId: m.senderId,
    senderName: m.Sender?.name ?? "Ukjent",
    senderImage: m.Sender?.image ?? null,
    createdAt: m.createdAt.toISOString(),
    readAt: m.readAt?.toISOString() ?? null,
  }));
}

export async function sendDirectMessage(
  conversationId: string,
  content: string
) {
  const user = await requirePortalUser();

  if (!content.trim()) throw new Error("Melding kan ikke være tom");

  const conversation = await prisma.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: user.id } },
    },
  });

  if (!conversation) throw new Error("Samtale ikke funnet");

  await prisma.message.create({
    data: {
      content: content.trim(),
      Conversation: { connect: { id: conversationId } },
      Sender: { connect: { id: user.id } },
    },
  });

  await prisma.conversation.update({
    where: { id: conversationId },
    data: { updatedAt: new Date() },
  });

  revalidatePath("/portal/meldinger");
  revalidatePath("/portal/admin/meldinger");

  return { success: true };
}

export type ConversationSummary = {
  id: string;
  participantName: string;
  participantId: string;
  lastMessage: string | null;
  lastMessageAt: Date | null;
  unreadCount: number;
};

export async function getMyConversations(): Promise<ConversationSummary[]> {
  const user = await requirePortalUser();

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { id: user.id } },
    },
    include: {
      participants: { select: { id: true, name: true } },
      Message: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { content: true, createdAt: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const summaries: ConversationSummary[] = [];

  for (const conv of conversations) {
    const otherUser = conv.participants.find((u) => u.id !== user.id);
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

export async function markConversationAsRead(conversationId: string) {
  const user = await requirePortalUser();

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: user.id },
      readAt: null,
    },
    data: { readAt: new Date() },
  });

  revalidatePath("/portal/meldinger");
}
