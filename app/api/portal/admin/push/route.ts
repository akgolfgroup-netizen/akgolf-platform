import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { getPortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import webpush from "web-push";
import { z } from "zod";

const sendPushSchema = z.object({
  userId: z.string().optional(),
  userIds: z.array(z.string()).optional(),
  title: z.string().min(1).max(100),
  body: z.string().min(1).max(200),
  icon: z.string().optional(),
  badge: z.string().optional(),
  url: z.string().optional(),
  broadcast: z.boolean().optional(),
});

// Configure web-push with VAPID keys (midlertidig deaktivert)
// TODO: Fiks VAPID-nøkler etter lansering
// const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
// const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
// const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@akgolf.no";

// if (vapidPublicKey && vapidPrivateKey) {
//   webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
// }

const vapidPublicKey = null;
const vapidPrivateKey = null;

/**
 * POST /api/portal/admin/push
 * Send push notification to user(s)
 * Requires staff/admin role
 */
export async function POST(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return NextResponse.json({ error: "Uautorisert" }, { status: 403 });
  }

  // Check if push is configured
  if (!vapidPublicKey || !vapidPrivateKey) {
    return NextResponse.json(
      { error: "Push-notifikasjoner er ikke konfigurert" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const validation = sendPushSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Ugyldig data", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { userId, userIds, title, body: messageBody, icon, badge, url, broadcast } = validation.data;

    // Determine target user IDs
    let targetUserIds: string[] = [];
    if (broadcast) {
      // Get all users with push subscriptions
      const subscriptions = await prisma.pushSubscription.findMany({
        distinct: ["userId"],
        select: { userId: true },
      });
      targetUserIds = subscriptions.map((s) => s.userId);
    } else if (userIds) {
      targetUserIds = userIds;
    } else if (userId) {
      targetUserIds = [userId];
    } else {
      return NextResponse.json(
        { error: "Mangler userId, userIds eller broadcast" },
        { status: 400 }
      );
    }

    // Get all push subscriptions for target users
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: { in: targetUserIds } },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json(
        { error: "Ingen push-abonnementer funnet" },
        { status: 404 }
      );
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body: messageBody,
      icon: icon || "/icons/icon-192.png",
      badge: badge || "/icons/badge-72.png",
      data: { url: url || "/portal" },
    });

    // Send push notifications
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.p256dh,
                auth: sub.auth,
              },
            },
            payload
          );
          return { success: true, userId: sub.userId };
        } catch (error) {
          // Remove invalid subscription
          if ((error as webpush.WebPushError)?.statusCode === 410) {
            await prisma.pushSubscription.delete({
              where: { endpoint: sub.endpoint },
            });
          }
          return { success: false, userId: sub.userId, error: String(error) };
        }
      })
    );

    const successful = results.filter((r) => r.status === "fulfilled" && r.value.success).length;
    const failed = results.length - successful;

    return NextResponse.json({
      ok: true,
      sent: successful,
      failed,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("[Push Send] Error:", error);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}

/**
 * GET /api/portal/admin/push/stats
 * Get push notification statistics
 */
export async function GET(req: NextRequest) {
  const user = await getPortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return NextResponse.json({ error: "Uautorisert" }, { status: 403 });
  }

  try {
    const totalSubscriptions = await prisma.pushSubscription.count();
    const uniqueUsers = await prisma.pushSubscription.groupBy({
      by: ["userId"],
      _count: { userId: true },
    });

    return NextResponse.json({
      totalSubscriptions,
      uniqueUsers: uniqueUsers.length,
    });
  } catch (error) {
    console.error("[Push Stats] Error:", error);
    return NextResponse.json({ error: "Serverfeil" }, { status: 500 });
  }
}
