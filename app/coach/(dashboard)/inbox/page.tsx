import { Suspense } from "react";
import { InboxClient } from "./inbox-client";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";

async function getMessages(userId: string) {
  return prisma.unifiedMessage.findMany({
    where: {
      OR: [{ assignedToId: userId }, { assignedToId: null }],
    },
    orderBy: { receivedAt: "desc" },
    take: 50,
    include: {
      aiResponse: true,
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

export default async function InboxPage() {
  const user = await requirePortalUser();
  const [messages, counts] = await Promise.all([
    getMessages(user.id),
    getChannelCounts(),
  ]);

  return (
    <div className="h-[calc(100vh-8rem)]">
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full text-[var(--color-ink-50)]">
            Laster meldinger...
          </div>
        }
      >
        <InboxClient
          initialMessages={messages}
          channelCounts={counts}
        />
      </Suspense>
    </div>
  );
}
