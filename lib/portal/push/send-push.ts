import webpush from "web-push";
import { prisma } from "@/lib/portal/prisma";
import { logger } from "@/lib/logger";

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@akgolf.no";

let configured = false;
function ensureConfigured(): boolean {
  if (configured) return true;
  if (!vapidPublicKey || !vapidPrivateKey) return false;
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
    configured = true;
    return true;
  } catch (err) {
    logger.warn("[push] VAPID config failed", err);
    return false;
  }
}

interface SendPushParams {
  userId: string;
  title: string;
  body: string;
  url?: string;
  icon?: string;
  badge?: string;
}

interface SendPushResult {
  sent: number;
  failed: number;
  total: number;
}

export async function sendPushToUser(params: SendPushParams): Promise<SendPushResult> {
  if (!ensureConfigured()) {
    return { sent: 0, failed: 0, total: 0 };
  }

  const subscriptions = await prisma.pushSubscription.findMany({
    where: { userId: params.userId },
  });

  if (subscriptions.length === 0) {
    return { sent: 0, failed: 0, total: 0 };
  }

  const payload = JSON.stringify({
    title: params.title,
    body: params.body,
    icon: params.icon || "/icons/icon-192.png",
    badge: params.badge || "/icons/badge-72.png",
    data: { url: params.url || "/portal" },
  });

  let sent = 0;
  let failed = 0;
  const expiredEndpoints: string[] = [];

  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          payload
        );
        sent += 1;
      } catch (error) {
        failed += 1;
        const statusCode = (error as webpush.WebPushError)?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          expiredEndpoints.push(sub.endpoint);
        } else {
          logger.warn("[push] send failed", { userId: params.userId, statusCode });
        }
      }
    })
  );

  if (expiredEndpoints.length > 0) {
    await prisma.pushSubscription.deleteMany({
      where: { endpoint: { in: expiredEndpoints } },
    });
  }

  return { sent, failed, total: subscriptions.length };
}
