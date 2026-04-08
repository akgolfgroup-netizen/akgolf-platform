/**
 * Notifikasjons-opprettelse service
 * Håndterer opprettelse av notifikasjoner i databasen og push-varsler
 */

import { createServiceClient } from "@/lib/supabase/server";
import { nanoid } from "nanoid";
import type { NotificationType } from "@prisma/client";
import { logger } from "@/lib/logger";
import {
  CreateNotificationInput,
  CreateBulkNotificationInput,
  PushNotificationPayload,
} from "./types";
import webpush from "web-push";

// Konfigurer web-push
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
const vapidSubject = process.env.VAPID_SUBJECT || "mailto:admin@akgolf.no";

if (vapidPublicKey && vapidPrivateKey) {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  } catch (e) {
    console.warn("[webpush] VAPID config failed:", e);
  }
}

/**
 * Opprett en enkelt notifikasjon
 */
export async function createNotification(
  input: CreateNotificationInput
): Promise<{ success: boolean; notificationId?: string; error?: string }> {
  const supabase = createServiceClient();

  try {
    const notificationId = nanoid();

    const { error } = await supabase
      .from("Notification")
      .insert({
        id: notificationId,
        userId: input.userId,
        senderId: input.senderId ?? null,
        type: input.type,
        title: input.title,
        message: input.message,
        linkUrl: input.linkUrl ?? null,
        linkText: input.linkText ?? null,
        metadata: input.metadata ? (JSON.parse(JSON.stringify(input.metadata)) as Record<string, unknown>) : null,
        isAdminNotification: input.isAdminNotification ?? false,
        adminType: input.adminType ?? null,
        expiresAt: input.expiresAt ? input.expiresAt.toISOString() : null,
        read: false,
      });

    if (error) throw error;

    // Send push-notifikasjon hvis konfigurert
    await sendPushNotification(input.userId, {
      title: input.title,
      body: input.message,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      tag: notificationId,
      data: {
        url: input.linkUrl || "/portal",
        notificationId,
        type: input.type,
        metadata: input.metadata,
      },
    });

    return { success: true, notificationId };
  } catch (error) {
    logger.error("[createNotification] Failed to create notification:", error);
    return { success: false, error: "Failed to create notification" };
  }
}

/**
 * Opprett flere notifikasjoner i batch
 */
export async function createBulkNotifications(
  input: CreateBulkNotificationInput
): Promise<{ success: boolean; count?: number; error?: string }> {
  const supabase = createServiceClient();

  try {
    const notifications = input.userIds.map((userId) => ({
      id: nanoid(),
      userId,
      type: input.type,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl ?? null,
      linkText: input.linkText ?? null,
      metadata: input.metadata ? (JSON.parse(JSON.stringify(input.metadata)) as Record<string, unknown>) : null,
      isAdminNotification: input.isAdminNotification ?? false,
      adminType: input.adminType ?? null,
      read: false,
    }));

    const { data, error } = await supabase
      .from("Notification")
      .insert(notifications)
      .select();

    if (error) throw error;

    // Send push-notifikasjoner i bakgrunn
    Promise.all(
      input.userIds.map(async (userId, index) => {
        await sendPushNotification(userId, {
          title: input.title,
          body: input.message,
          icon: "/icons/icon-192.png",
          badge: "/icons/badge-72.png",
          tag: notifications[index].id,
          data: {
            url: input.linkUrl || "/portal",
            notificationId: notifications[index].id,
            type: input.type,
            metadata: input.metadata,
          },
        });
      })
    ).catch((err) => logger.error("[createBulkNotifications] Push failed:", err));

    return { success: true, count: data?.length || 0 };
  } catch (error) {
    logger.error("[createBulkNotifications] Failed to create notifications:", error);
    return { success: false, error: "Failed to create notifications" };
  }
}

/**
 * Marker en notifikasjon som lest
 */
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createServiceClient();

  try {
    const { error } = await supabase
      .from("Notification")
      .update({
        read: true,
        readAt: new Date().toISOString(),
      })
      .eq("id", notificationId)
      .eq("userId", userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    logger.error("[markNotificationAsRead] Failed:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

/**
 * Marker alle notifikasjoner som lest for en bruker
 */
export async function markAllNotificationsAsRead(
  userId: string,
  filter?: { isAdminNotification?: boolean }
): Promise<{ success: boolean; count?: number; error?: string }> {
  const supabase = createServiceClient();

  try {
    let query = supabase
      .from("Notification")
      .update({
        read: true,
        readAt: new Date().toISOString(),
      })
      .eq("userId", userId)
      .eq("read", false);

    if (filter?.isAdminNotification !== undefined) {
      query = query.eq("isAdminNotification", filter.isAdminNotification);
    }

    const { data, error } = await query.select();

    if (error) throw error;

    return { success: true, count: data?.length || 0 };
  } catch (error) {
    logger.error("[markAllNotificationsAsRead] Failed:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}

/**
 * Hent notifikasjoner for en bruker
 */
export async function getNotifications(
  userId: string,
  options: {
    unreadOnly?: boolean;
    limit?: number;
    offset?: number;
    isAdminNotification?: boolean;
  } = {}
) {
  const supabase = createServiceClient();
  const { unreadOnly, limit = 50, offset = 0, isAdminNotification } = options;

  // Build base query for notifications
  let notificationsQuery = supabase
    .from("Notification")
    .select(`
      *,
      sender:senderId(id, name, image)
    `)
    .eq("userId", userId)
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);

  if (unreadOnly) {
    notificationsQuery = notificationsQuery.eq("read", false);
  }

  if (isAdminNotification !== undefined) {
    notificationsQuery = notificationsQuery.eq("isAdminNotification", isAdminNotification);
  }

  const [notificationsResult, unreadCountResult, totalCountResult] = await Promise.all([
    notificationsQuery,
    supabase
      .from("Notification")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId)
      .eq("read", false)
      .eq("isAdminNotification", isAdminNotification ?? false),
    supabase
      .from("Notification")
      .select("id", { count: "exact", head: true })
      .eq("userId", userId)
      .eq("isAdminNotification", isAdminNotification ?? false),
  ]);

  const notifications = notificationsResult.data || [];
  const unreadCount = unreadCountResult.count || 0;
  const totalCount = totalCountResult.count || 0;

  return {
    notifications,
    unreadCount,
    totalCount,
    hasMore: totalCount > offset + limit,
  };
}

/**
 * Slett gamle notifikasjoner
 */
export async function cleanupOldNotifications(
  daysOld: number = 90
): Promise<{ success: boolean; deletedCount?: number; error?: string }> {
  const supabase = createServiceClient();

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { data, error } = await supabase
      .from("Notification")
      .delete()
      .lt("createdAt", cutoffDate.toISOString())
      .eq("read", true)
      .select();

    if (error) throw error;

    logger.info(`[cleanupOldNotifications] Deleted ${data?.length || 0} old notifications`);
    return { success: true, deletedCount: data?.length || 0 };
  } catch (error) {
    logger.error("[cleanupOldNotifications] Failed:", error);
    return { success: false, error: "Failed to cleanup notifications" };
  }
}

/**
 * Send push-notifikasjon til en bruker
 */
async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
): Promise<{ success: boolean; sent?: number; failed?: number }> {
  if (!vapidPublicKey || !vapidPrivateKey) {
    return { success: false };
  }

  const supabase = createServiceClient();

  try {
    const { data: subscriptions } = await supabase
      .from("PushSubscription")
      .select("endpoint, p256dh, auth")
      .eq("userId", userId);

    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, sent: 0, failed: 0 };
    }

    const payloadString = JSON.stringify(payload);
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
            payloadString
          );
          return { success: true };
        } catch (error) {
          // Fjern ugyldig abonnement
          if ((error as webpush.WebPushError)?.statusCode === 410) {
            await supabase
              .from("PushSubscription")
              .delete()
              .eq("endpoint", sub.endpoint);
          }
          return { success: false, error };
        }
      })
    );

    const successful = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - successful;

    return { success: true, sent: successful, failed };
  } catch (error) {
    logger.error("[sendPushNotification] Failed:", error);
    return { success: false };
  }
}

/**
 * Hent antall uleste notifikasjoner for en bruker
 */
export async function getUnreadCount(
  userId: string,
  isAdminNotification?: boolean
): Promise<number> {
  const supabase = createServiceClient();

  let query = supabase
    .from("Notification")
    .select("id", { count: "exact", head: true })
    .eq("userId", userId)
    .eq("read", false);

  if (isAdminNotification !== undefined) {
    query = query.eq("isAdminNotification", isAdminNotification);
  }

  const { count } = await query;
  return count || 0;
}
