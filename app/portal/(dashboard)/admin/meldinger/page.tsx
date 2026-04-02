import { Suspense } from "react";
import { redirect } from "next/navigation";
import { MeldingerClient } from "./meldinger-client";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { Inbox } from "lucide-react";
import type { Channel } from "@/components/portal/admin/meldinger/ChannelFilter";
import type { MessageStatus } from "@/components/portal/admin/meldinger/MessageList";

export const dynamic = "force-dynamic";

async function getMessages(userId: string) {
  return prisma.unifiedMessage.findMany({
    where: {
      OR: [{ assignedToId: userId }, { assignedToId: null }],
    },
    orderBy: { receivedAt: "desc" },
    take: 50,
    include: {
      AIResponses: true,
    },
  });
}

async function getChannelCounts() {
  const counts = await prisma.unifiedMessage.groupBy({
    by: ["channel"],
    where: { status: "PENDING" },
    _count: true,
  });

  const result: Record<string, number> = { ALL: 0 };
  counts.forEach((c) => {
    result[c.channel] = c._count;
    result.ALL += c._count;
  });

  return result;
}

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const [rawMessages, counts] = await Promise.all([
    getMessages(user.id),
    getChannelCounts(),
  ]);

  // Transform messages to match client component interface
  const messages = rawMessages.map((msg) => ({
    id: msg.id,
    channel: msg.channel as Channel,
    senderName: msg.senderName ?? "",
    senderHandle: msg.senderHandle ?? "",
    subject: msg.subject,
    content: msg.content,
    receivedAt: msg.receivedAt,
    status: msg.status as MessageStatus,
    aiResponse:
      msg.AIResponses.length > 0
        ? {
            draftContent: msg.AIResponses[0].draftContent,
            confidence: msg.AIResponses[0].confidence ?? 0,
            category: msg.AIResponses[0].category ?? "",
            modelUsed: msg.AIResponses[0].modelUsed ?? "",
          }
        : null,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
            Meldinger
          </h1>
          <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
            Unified inbox — e-post, Instagram, Messenger, WhatsApp og iMessage
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
          <Inbox className="h-4 w-4 text-[var(--color-grey-500)]" />
          <span className="text-sm text-[var(--color-grey-500)]">
            {counts.ALL ?? 0} uleste
          </span>
        </div>
      </div>

      {/* Inbox */}
      <div className="h-[calc(100vh-14rem)]">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
              Laster meldinger...
            </div>
          }
        >
          <MeldingerClient
            initialMessages={messages}
            channelCounts={counts}
          />
        </Suspense>
      </div>
    </div>
  );
}
