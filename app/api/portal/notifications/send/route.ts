/**
 * POST /api/portal/notifications/send
 * Send en notifikasjon (kun for admin/staff)
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { z } from "zod";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { createNotification, createBulkNotifications } from "@/lib/portal/notifications/create";
import { NotificationType } from "@/lib/portal/notifications/types";

const sendNotificationSchema = z.object({
  userId: z.string().min(1).optional(),
  userIds: z.array(z.string().min(1)).optional(),
  type: z.nativeEnum(NotificationType),
  title: z.string().min(1).max(100),
  message: z.string().min(1).max(500),
  linkUrl: z.string().optional(),
  linkText: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  isAdminNotification: z.boolean().optional(),
  adminType: z.enum(["booking", "system", "urgent", "coaching", "video", "diary"]).optional(),
});

export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return NextResponse.json({ error: "Uautorisert" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const validation = sendNotificationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Ugyldig data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Bulk notification
    if (data.userIds && data.userIds.length > 0) {
      const result = await createBulkNotifications({
        userIds: data.userIds,
        type: data.type,
        title: data.title,
        message: data.message,
        linkUrl: data.linkUrl,
        linkText: data.linkText,
        metadata: data.metadata,
        isAdminNotification: data.isAdminNotification,
        adminType: data.adminType,
      });

      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 500 });
      }

      return NextResponse.json({ ok: true, count: result.count });
    }

    // Single notification
    if (!data.userId) {
      return NextResponse.json(
        { error: "Mangler userId eller userIds" },
        { status: 400 }
      );
    }

    const result = await createNotification({
      userId: data.userId,
      type: data.type,
      title: data.title,
      message: data.message,
      linkUrl: data.linkUrl,
      linkText: data.linkText,
      metadata: data.metadata,
      isAdminNotification: data.isAdminNotification,
      adminType: data.adminType,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, notificationId: result.notificationId });
  } catch {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
