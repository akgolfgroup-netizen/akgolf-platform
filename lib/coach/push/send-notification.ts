import { logger } from "@/lib/logger";
import { createServiceClient } from "@/lib/supabase/server";
import { webpush, ensureVapidConfigured } from "./vapid";

interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: {
    url?: string;
    messageId?: string;
    type?: string;
  };
}

export async function sendPushNotification(
  userId: string,
  payload: NotificationPayload
): Promise<void> {
  if (!ensureVapidConfigured()) {
    logger.warn("Push notifications not available - VAPID not configured");
    return;
  }

  const supabase = createServiceClient();

  const { data: subscriptions } = await supabase
    .from("PushSubscription")
    .select("id, endpoint, p256dh, auth")
    .eq("userId", userId);

  if (!subscriptions || subscriptions.length === 0) {
    return;
  }

  const notifications = subscriptions.map(async (sub) => {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          },
        },
        JSON.stringify(payload)
      );
    } catch (error: unknown) {
      const webPushError = error as { statusCode?: number };
      if (webPushError.statusCode === 410) {
        // Subscription expired, delete it
        await supabase
          .from("PushSubscription")
          .delete()
          .eq("id", sub.id);
      }
      logger.error("Push notification failed", error);
    }
  });

  await Promise.all(notifications);
}

export async function notifyNewMessage(
  userId: string,
  senderName: string,
  preview: string,
  messageId: string
): Promise<void> {
  await sendPushNotification(userId, {
    title: `Ny melding fra ${senderName}`,
    body: preview.substring(0, 100),
    icon: "/icons/icon-192.png",
    badge: "/icons/badge-72.png",
    data: {
      url: `/coach/inbox?message=${messageId}`,
      messageId,
      type: "new_message",
    },
  });
}

export async function notifyAIReady(
  userId: string,
  count: number
): Promise<void> {
  await sendPushNotification(userId, {
    title: "AI-svar klare",
    body: `${count} melding${count > 1 ? "er" : ""} venter på godkjenning`,
    icon: "/icons/icon-192.png",
    data: {
      url: "/coach/inbox?filter=ai_ready",
      type: "ai_ready",
    },
  });
}
