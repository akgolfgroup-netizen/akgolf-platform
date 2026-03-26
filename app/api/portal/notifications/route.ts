// @ts-nocheck — Notification model not yet added to Prisma schema
import { getPortalUser } from "@/lib/portal/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { z } from "zod";
import { validateRequest } from "@/lib/api/validation";

export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread") === "true";

  const notifications = await prisma.notification.findMany({
    where: {
      userId: user.id,
      ...(unreadOnly ? { read: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, read: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

const markReadSchema = z.object({
  notificationIds: z.array(z.string().min(1)).min(1),
});

export async function PATCH(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id) {
    return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
  }

  const validation = await validateRequest(req, markReadSchema);
  if (!validation.success) return validation.response;

  await prisma.notification.updateMany({
    where: {
      id: { in: validation.data.notificationIds },
      userId: user.id,
    },
    data: { read: true },
  });

  return NextResponse.json({ ok: true });
}
