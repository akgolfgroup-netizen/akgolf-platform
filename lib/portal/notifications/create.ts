/**
 * Notifikasjons-opprettelse service
 * Håndterer opprettelse av notifikasjoner i databasen og push-varsler
 */

import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import type { NotificationType } from "@prisma/client";
import { logger } from "@/lib/logger";
import {
  CreateNotificationInput,
  CreateBulkNotificationInput,
  NotificationMetadata,
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
  try {
    const notificationId = nanoid();

    await prisma.notification.create({
      data: {
        id: notificationId,
        userId: input.userId,
        senderId: input.senderId,
        type: input.type,
        title: input.title,
        message: input.message,
        linkUrl: input.linkUrl,
        linkText: input.linkText,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
        isAdminNotification: input.isAdminNotification ?? false,
        adminType: input.adminType,
        expiresAt: input.expiresAt,
        read: false,
      },
    });

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
  try {
    const notifications = input.userIds.map((userId) => ({
      id: nanoid(),
      userId,
      type: input.type,
      title: input.title,
      message: input.message,
      linkUrl: input.linkUrl,
      linkText: input.linkText,
      metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : null,
      isAdminNotification: input.isAdminNotification ?? false,
      adminType: input.adminType,
      read: false,
    }));

    const result = await prisma.notification.createMany({
      data: notifications,
    });

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

    return { success: true, count: result.count };
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
  try {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

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
  try {
    const result = await prisma.notification.updateMany({
      where: {
        userId,
        read: false,
        ...(filter?.isAdminNotification !== undefined && {
          isAdminNotification: filter.isAdminNotification,
        }),
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    return { success: true, count: result.count };
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
  const { unreadOnly, limit = 50, offset = 0, isAdminNotification } = options;

  const [notifications, unreadCount, totalCount] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false }),
        ...(isAdminNotification !== undefined && { isAdminNotification }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    }),
    prisma.notification.count({
      where: {
        userId,
        read: false,
        ...(isAdminNotification !== undefined && { isAdminNotification }),
      },
    }),
    prisma.notification.count({
      where: {
        userId,
        ...(isAdminNotification !== undefined && { isAdminNotification }),
      },
    }),
  ]);

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
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate },
        read: true,
      },
    });

    logger.info(`[cleanupOldNotifications] Deleted ${result.count} old notifications`);
    return { success: true, deletedCount: result.count };
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

  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (subscriptions.length === 0) {
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
            await prisma.pushSubscription.delete({
              where: { endpoint: sub.endpoint },
            });
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
  return prisma.notification.count({
    where: {
      userId,
      read: false,
      ...(isAdminNotification !== undefined && { isAdminNotification }),
    },
  });
}
