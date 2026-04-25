/**
 * Notifikasjons-typer for Spillerportal og CoachHQ
 * 
 * Spillerportal → CoachHQ (Admin ser)
 * - Ny booking, avbestilling, video opplastet, dagbok-innlegg, spørsmål
 * 
 * CoachHQ → Spillerportal (Elev ser)
 * - Booking bekreftet/endret, coaching-notater, treningsplan klar, påminnelser, mål oppnådd
 */

import { NotificationType as PrismaNotificationType } from "@prisma/client";

// Eksporter Prisma enum for bruk i hele applikasjonen
export { NotificationType } from "@prisma/client";

// Metadata-typer for ulike notifikasjoner
export interface BookingNotificationMetadata {
  bookingId: string;
  startTime: string;
  endTime?: string;
  instructorName?: string;
  studentName?: string;
  serviceTypeName?: string;
  locationName?: string;
}

export interface VideoNotificationMetadata {
  videoId: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  sessionId?: string;
  title?: string;
}

export interface DiaryEntryMetadata {
  roundId?: string;
  trainingLogId?: string;
  date: string;
  courseName?: string;
  score?: number;
}

export interface CoachingNotesMetadata {
  sessionId: string;
  instructorName: string;
  sessionDate: string;
  focusArea?: string;
}

export interface TrainingPlanMetadata {
  planId: string;
  planTitle: string;
  startDate: string;
  endDate: string;
}

export interface GoalAchievedMetadata {
  goalId: string;
  goalTitle: string;
  targetValue: number;
  currentValue: number;
  unit?: string;
}

export interface QuestionMetadata {
  questionId: string;
  questionPreview: string;
  category?: string;
}

// Union type for all metadata
export type NotificationMetadata =
  | BookingNotificationMetadata
  | VideoNotificationMetadata
  | DiaryEntryMetadata
  | CoachingNotesMetadata
  | TrainingPlanMetadata
  | GoalAchievedMetadata
  | QuestionMetadata
  | Record<string, unknown>;

// Input for å opprette en notifikasjon
export interface CreateNotificationInput {
  userId: string;
  senderId?: string;
  type: PrismaNotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  linkText?: string;
  metadata?: NotificationMetadata;
  isAdminNotification?: boolean;
  adminType?: "booking" | "system" | "urgent" | "coaching" | "video" | "diary";
  expiresAt?: Date;
}

// Input for å opprette flere notifikasjoner
export interface CreateBulkNotificationInput {
  userIds: string[];
  type: PrismaNotificationType;
  title: string;
  message: string;
  linkUrl?: string;
  linkText?: string;
  metadata?: NotificationMetadata;
  isAdminNotification?: boolean;
  adminType?: "booking" | "system" | "urgent" | "coaching" | "video" | "diary";
}

// Notifikasjon med full data (brukes i UI)
export interface NotificationWithDetails {
  id: string;
  userId: string;
  senderId: string | null;
  type: PrismaNotificationType;
  title: string;
  message: string;
  linkUrl: string | null;
  linkText: string | null;
  metadata: NotificationMetadata | null;
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
  isAdminNotification: boolean;
  adminType: string | null;
  expiresAt: Date | null;
  // Relasjoner
  sender?: {
    id: string;
    name: string | null;
    image: string | null;
  } | null;
}

// Filter for å hente notifikasjoner
export interface NotificationFilter {
  unreadOnly?: boolean;
  isAdminNotification?: boolean;
  adminType?: "booking" | "system" | "urgent" | "coaching" | "video" | "diary";
  type?: PrismaNotificationType;
  fromDate?: Date;
  toDate?: Date;
  limit?: number;
  offset?: number;
}

// Grupperte notifikasjoner (for UI-visning)
export interface GroupedNotifications {
  today: NotificationWithDetails[];
  yesterday: NotificationWithDetails[];
  thisWeek: NotificationWithDetails[];
  older: NotificationWithDetails[];
}

// Push-notifikasjon payload
export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data: {
    url: string;
    notificationId: string;
    type: PrismaNotificationType;
    metadata?: NotificationMetadata;
  };
}

// Lyd-type for admin-notifikasjoner
export type AdminNotificationSound = "booking" | "urgent" | "message" | "default";

// Konfigurasjon for admin-notifikasjoner
export interface AdminNotificationConfig {
  playSound: boolean;
  soundType: AdminNotificationSound;
  desktopNotification: boolean;
  showToast: boolean;
  autoMarkReadAfterSeconds?: number;
}

// Standard konfigurasjon
export const DEFAULT_ADMIN_CONFIG: AdminNotificationConfig = {
  playSound: true,
  soundType: "default",
  desktopNotification: true,
  showToast: true,
  autoMarkReadAfterSeconds: 30,
};
