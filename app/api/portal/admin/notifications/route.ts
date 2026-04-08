/**
 * GET /api/portal/admin/notifications
 * Hent admin-notifikasjoner for Mission Control
 */

import { NextRequest, NextResponse } from "next/server";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { getNotifications, getUnreadCount } from "@/lib/portal/notifications/create";
import type { NotificationType, NotificationMetadata, NotificationWithDetails, GroupedNotifications } from "@/lib/portal/notifications/types";

export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await getPortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return NextResponse.json({ error: "Uautorisert" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";
    const adminType = searchParams.get("type") as "booking" | "system" | "urgent" | "coaching" | "video" | "diary" | null;
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);
    const offset = parseInt(searchParams.get("offset") ?? "0", 10);

    const result = await getNotifications(user.id, {
      unreadOnly,
      isAdminNotification: true,
      limit,
      offset,
    });

    // Filtrer på adminType hvis spesifisert
    let notifications = result.notifications;
    if (adminType) {
      notifications = notifications.filter((n) => n.adminType === adminType);
    }

    // Grupper notifikasjoner etter dato
    const typedNotifications = notifications.map(n => ({
      ...n,
      metadata: n.metadata as NotificationMetadata | null,
    })) as NotificationWithDetails[];
    const grouped = groupNotificationsByDate(typedNotifications);

    return NextResponse.json({
      notifications: typedNotifications,
      grouped,
      unreadCount: result.unreadCount,
      totalCount: result.totalCount,
      hasMore: result.hasMore,
    });
  } catch (error) {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}

/**
 * Hent antall uleste admin-notifikasjoner (for badge)
 */
export async function HEAD(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return NextResponse.json({ error: "Uautorisert" }, { status: 403 });
  }

  try {
    const unreadCount = await getUnreadCount(user.id, true);
    return NextResponse.json({ unreadCount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}

function groupNotificationsByDate(notifications: NotificationWithDetails[]): GroupedNotifications {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const grouped: GroupedNotifications = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  for (const notification of notifications) {
    const createdAt = new Date(notification.createdAt);
    createdAt.setHours(0, 0, 0, 0);

    if (createdAt.getTime() === today.getTime()) {
      grouped.today.push(notification);
    } else if (createdAt.getTime() === yesterday.getTime()) {
      grouped.yesterday.push(notification);
    } else if (createdAt >= weekAgo) {
      grouped.thisWeek.push(notification);
    } else {
      grouped.older.push(notification);
    }
  }

  return grouped;
}
