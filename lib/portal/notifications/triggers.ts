/**
 * Notifikasjons-triggere
 * Kalles fra ulike deler av applikasjonen for å sende notifikasjoner
 */

import { format, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import { logger } from "@/lib/logger";
import { NotificationType } from "./types";
import {
  createNotification,
  createBulkNotifications,
} from "./create";
import type {
  BookingNotificationMetadata,
  CoachingNotesMetadata,
  TrainingPlanMetadata,
  GoalAchievedMetadata,
  VideoNotificationMetadata,
  DiaryEntryMetadata,
  QuestionMetadata,
} from "./types";
import type { Booking, CoachingSession, TrainingPlan, Goal, User, ServiceType, Instructor, Location } from "@prisma/client";

// ============================================================================
// SPILLERPORTAL → MISSION CONTROL (Admin ser)
// ============================================================================

/**
 * Ny booking opprettet - Send til instruktør/admin
 */
export async function notifyNewBooking(
  booking: Booking & {
    User?: Pick<User, "name">;
    ServiceType?: Pick<ServiceType, "name">;
    Instructor?: { User?: Pick<User, "name"> };
    Location?: Pick<Location, "name"> | null;
  }
): Promise<void> {
  try {
    const studentName = booking.User?.name ?? "En elev";
    const serviceName = booking.ServiceType?.name ?? "coaching";
    const timeStr = format(new Date(booking.startTime), "HH:mm", { locale: nb });
    const dateStr = format(new Date(booking.startTime), "EEEE d. MMMM", { locale: nb });

    const metadata: BookingNotificationMetadata = {
      bookingId: booking.id,
      startTime: booking.startTime instanceof Date ? booking.startTime.toISOString() : booking.startTime,
      studentName: booking.User?.name ?? undefined,
      serviceTypeName: booking.ServiceType?.name ?? undefined,
      locationName: booking.Location?.name ?? undefined,
    };

    await createNotification({
      userId: booking.instructorId,
      type: NotificationType.BOOKING_CONFIRMED,
      title: "Ny booking",
      message: `${studentName} har booket ${serviceName} ${dateStr} kl ${timeStr}`,
      linkUrl: `/portal/admin/bookinger/${booking.id}`,
      linkText: "Se booking",
      metadata,
      isAdminNotification: true,
      adminType: "booking",
    });

    logger.info(`[notifyNewBooking] Sent to instructor ${booking.instructorId}`);
  } catch (error) {
    logger.error("[notifyNewBooking] Failed:", error);
  }
}

/**
 * Booking avbestilt - Send til instruktør/admin
 */
export async function notifyBookingCancelled(
  booking: Booking & {
    User?: Pick<User, "name">;
    ServiceType?: Pick<ServiceType, "name">;
    Instructor?: { User?: Pick<User, "name"> };
  },
  reason?: string
): Promise<void> {
  try {
    const studentName = booking.User?.name ?? "En elev";
    const serviceName = booking.ServiceType?.name ?? "coaching";
    const timeStr = format(new Date(booking.startTime), "HH:mm", { locale: nb });
    const dateStr = format(new Date(booking.startTime), "EEEE d. MMMM", { locale: nb });

    const metadata: BookingNotificationMetadata = {
      bookingId: booking.id,
      startTime: booking.startTime instanceof Date ? booking.startTime.toISOString() : booking.startTime,
      studentName: booking.User?.name ?? undefined,
      serviceTypeName: booking.ServiceType?.name ?? undefined,
    };

    await createNotification({
      userId: booking.instructorId,
      type: NotificationType.BOOKING_CANCELLED,
      title: "Booking avbestilt",
      message: `${studentName} avbestilte ${serviceName} ${dateStr} kl ${timeStr}${reason ? `. Årsak: ${reason}` : ""}`,
      linkUrl: `/portal/admin/bookinger/${booking.id}`,
      linkText: "Se detaljer",
      metadata,
      isAdminNotification: true,
      adminType: "booking",
    });

    logger.info(`[notifyBookingCancelled] Sent to instructor ${booking.instructorId}`);
  } catch (error) {
    logger.error("[notifyBookingCancelled] Failed:", error);
  }
}

/**
 * Ny TrackMan-video opplastet - Send til instruktør
 */
export async function notifyVideoUploaded(
  videoId: string,
  userId: string,
  instructorId: string,
  videoData?: {
    title?: string;
    thumbnailUrl?: string;
    sessionId?: string;
  }
): Promise<void> {
  try {
    const metadata: VideoNotificationMetadata = {
      videoId,
      title: videoData?.title,
      thumbnailUrl: videoData?.thumbnailUrl,
      sessionId: videoData?.sessionId,
    };

    await createNotification({
      userId: instructorId,
      type: NotificationType.GENERAL,
      title: "Ny video opplastet",
      message: `En elev har lastet opp en ny TrackMan-video${videoData?.title ? `: "${videoData.title}"` : ""}`,
      linkUrl: `/portal/admin/video/${videoId}`,
      linkText: "Se video",
      metadata,
      isAdminNotification: true,
      adminType: "video",
    });

    logger.info(`[notifyVideoUploaded] Sent to instructor ${instructorId}`);
  } catch (error) {
    logger.error("[notifyVideoUploaded] Failed:", error);
  }
}

/**
* Dagbok-innlegg logget - Send til instruktør
*/
export async function notifyDiaryEntry(
  roundId: string,
  userId: string,
  instructorId: string,
  entryData?: {
    date?: Date;
    courseName?: string;
    score?: number;
  }
): Promise<void> {
  try {
    const dateStr = entryData?.date
      ? format(new Date(entryData.date), "d. MMMM", { locale: nb })
      : "";
    const scoreStr = entryData?.score ? ` (${entryData.score} slag)` : "";

    const metadata: DiaryEntryMetadata = {
      roundId,
      date: entryData?.date?.toISOString() ?? new Date().toISOString(),
      courseName: entryData?.courseName,
      score: entryData?.score,
    };

    await createNotification({
      userId: instructorId,
      type: NotificationType.GENERAL,
      title: "Nytt dagbok-innlegg",
      message: `En elev logget en ny runde${entryData?.courseName ? ` på ${entryData.courseName}` : ""}${dateStr ? ` ${dateStr}` : ""}${scoreStr}`,
      linkUrl: `/portal/admin/elever/${userId}/dagbok`,
      linkText: "Se dagbok",
      metadata,
      isAdminNotification: true,
      adminType: "coaching",
    });

    logger.info(`[notifyDiaryEntry] Sent to instructor ${instructorId}`);
  } catch (error) {
    logger.error("[notifyDiaryEntry] Failed:", error);
  }
}

/**
 * Spørsmål fra spiller - Send til instruktør
 */
export async function notifyPlayerQuestion(
  questionId: string,
  userId: string,
  instructorId: string,
  questionData?: {
    questionPreview?: string;
    category?: string;
  }
): Promise<void> {
  try {
    const preview = questionData?.questionPreview
      ? questionData.questionPreview.slice(0, 50) + (questionData.questionPreview.length > 50 ? "..." : "")
      : "";

    const metadata: QuestionMetadata = {
      questionId,
      questionPreview: questionData?.questionPreview ?? "",
      category: questionData?.category,
    };

    await createNotification({
      userId: instructorId,
      type: NotificationType.GENERAL,
      title: "Nytt spørsmål fra elev",
      message: `En elev har et spørsmål${preview ? `: "${preview}"` : ""}`,
      linkUrl: `/portal/admin/meldinger?question=${questionId}`,
      linkText: "Svar",
      metadata,
      isAdminNotification: true,
      adminType: "coaching",
    });

    logger.info(`[notifyPlayerQuestion] Sent to instructor ${instructorId}`);
  } catch (error) {
    logger.error("[notifyPlayerQuestion] Failed:", error);
  }
}

// ============================================================================
// MISSION CONTROL → SPILLERPORTAL (Elev ser)
// ============================================================================

/**
 * Booking bekreftet - Send til elev
 */
export async function notifyBookingConfirmed(
  booking: Booking & {
    ServiceType?: Pick<ServiceType, "name" | "duration">;
    Instructor?: { User?: Pick<User, "name"> };
    Location?: Pick<Location, "name"> | null;
  }
): Promise<void> {
  try {
    const serviceName = booking.ServiceType?.name ?? "coaching";
    const instructorName = booking.Instructor?.User?.name ?? "din instruktør";
    const timeStr = format(new Date(booking.startTime), "HH:mm", { locale: nb });
    const dateStr = format(new Date(booking.startTime), "EEEE d. MMMM", { locale: nb });

    const metadata: BookingNotificationMetadata = {
      bookingId: booking.id,
      startTime: booking.startTime instanceof Date ? booking.startTime.toISOString() : booking.startTime,
      instructorName: booking.Instructor?.User?.name ?? undefined,
      serviceTypeName: booking.ServiceType?.name ?? undefined,
      locationName: booking.Location?.name ?? undefined,
    };

    await createNotification({
      userId: booking.studentId,
      type: NotificationType.BOOKING_CONFIRMED,
      title: "Din booking er bekreftet!",
      message: `Du har ${serviceName} med ${instructorName} ${dateStr} kl ${timeStr}${booking.Location?.name ? ` på ${booking.Location.name}` : ""}`,
      linkUrl: `/portal/bookinger/${booking.id}`,
      linkText: "Se booking",
      metadata,
    });

    logger.info(`[notifyBookingConfirmed] Sent to student ${booking.studentId}`);
  } catch (error) {
    logger.error("[notifyBookingConfirmed] Failed:", error);
  }
}

/**
 * Booking endret - Send til elev
 */
export async function notifyBookingRescheduled(
  booking: Booking & {
    ServiceType?: Pick<ServiceType, "name">;
    Instructor?: { User?: Pick<User, "name"> };
    Location?: Pick<Location, "name"> | null;
  },
  oldStartTime: Date
): Promise<void> {
  try {
    const serviceName = booking.ServiceType?.name ?? "coaching";
    const newTimeStr = format(new Date(booking.startTime), "HH:mm", { locale: nb });
    const newDateStr = format(new Date(booking.startTime), "EEEE d. MMMM", { locale: nb });
    const oldTimeStr = format(new Date(oldStartTime), "HH:mm", { locale: nb });
    const oldDateStr = format(new Date(oldStartTime), "EEEE d. MMMM", { locale: nb });

    const metadata: BookingNotificationMetadata = {
      bookingId: booking.id,
      startTime: booking.startTime instanceof Date ? booking.startTime.toISOString() : booking.startTime,
      endTime: booking.endTime instanceof Date ? booking.endTime.toISOString() : (booking.endTime ?? undefined),
      serviceTypeName: booking.ServiceType?.name ?? undefined,
      locationName: booking.Location?.name ?? undefined,
    };

    const timeChanged = oldTimeStr !== newTimeStr;
    const dateChanged = oldDateStr !== newDateStr;

    let changeMessage = "";
    if (dateChanged && timeChanged) {
      changeMessage = `fra ${oldDateStr} kl ${oldTimeStr} til ${newDateStr} kl ${newTimeStr}`;
    } else if (timeChanged) {
      changeMessage = `fra kl ${oldTimeStr} til kl ${newTimeStr}`;
    } else if (dateChanged) {
      changeMessage = `fra ${oldDateStr} til ${newDateStr}`;
    } else {
      changeMessage = "endret";
    }

    await createNotification({
      userId: booking.studentId,
      type: NotificationType.BOOKING_CANCELLED,
      title: "Booking endret",
      message: `Din ${serviceName} er ${changeMessage}. Ny tid: ${newDateStr} kl ${newTimeStr}`,
      linkUrl: `/portal/bookinger/${booking.id}`,
      linkText: "Se ny tid",
      metadata,
    });

    logger.info(`[notifyBookingRescheduled] Sent to student ${booking.studentId}`);
  } catch (error) {
    logger.error("[notifyBookingRescheduled] Failed:", error);
  }
}



/**
 * Coaching-notater lagt til - Send til elev
 */
export async function notifyCoachingNotesAdded(
  session: CoachingSession & {
    Instructor?: { User?: Pick<User, "name"> };
    Booking?: { ServiceType?: Pick<ServiceType, "name"> };
  }
): Promise<void> {
  try {
    const instructorName = session.Instructor?.User?.name ?? "Din coach";
    const sessionDate = format(new Date(session.sessionDate), "d. MMMM", { locale: nb });

    const metadata: CoachingNotesMetadata = {
      sessionId: session.id,
      instructorName: session.Instructor?.User?.name ?? "",
      sessionDate: session.sessionDate instanceof Date ? session.sessionDate.toISOString() : session.sessionDate,
      focusArea: session.primaryFocus ?? undefined,
    };

    await createNotification({
      userId: session.studentId,
      type: NotificationType.COACHING_SUMMARY,
      title: `${instructorName} har lagt til notater`,
      message: `Nye notater fra deres økt ${sessionDate}${session.primaryFocus ? ` (fokus: ${session.primaryFocus})` : ""}`,
      linkUrl: `/portal/coaching-historikk/${session.id}`,
      linkText: "Les notater",
      metadata,
    });

    logger.info(`[notifyCoachingNotesAdded] Sent to student ${session.studentId}`);
  } catch (error) {
    logger.error("[notifyCoachingNotesAdded] Failed:", error);
  }
}

/**
 * Treningsplan klar - Send til elev
 */
export async function notifyTrainingPlanReady(
  plan: TrainingPlan & {
    User_TrainingPlan_createdByIdToUser?: Pick<User, "name">;
  }
): Promise<void> {
  try {
    const creatorName = plan.User_TrainingPlan_createdByIdToUser?.name ?? "Din coach";
    const startDate = format(new Date(plan.startDate), "d. MMMM", { locale: nb });
    const endDate = format(new Date(plan.endDate), "d. MMMM", { locale: nb });

    const metadata: TrainingPlanMetadata = {
      planId: plan.id,
      planTitle: plan.title,
      startDate: plan.startDate instanceof Date ? plan.startDate.toISOString() : plan.startDate,
      endDate: plan.endDate instanceof Date ? plan.endDate.toISOString() : plan.endDate,
    };

    await createNotification({
      userId: plan.studentId,
      type: NotificationType.PLAN_READY,
      title: "Din treningsplan er klar!",
      message: `${creatorName} har laget en ny treningsplan for deg (${startDate} - ${endDate})${plan.aiGenerated ? " 💡 AI-generert" : ""}`,
      linkUrl: `/portal/treningsplan/${plan.id}`,
      linkText: "Se plan",
      metadata,
    });

    logger.info(`[notifyTrainingPlanReady] Sent to student ${plan.studentId}`);
  } catch (error) {
    logger.error("[notifyTrainingPlanReady] Failed:", error);
  }
}

/**
 * Påminnelse om booking - Send til elev
 */
export async function notifyBookingReminder(
  booking: Booking & {
    User?: Pick<User, "name">;
    ServiceType?: Pick<ServiceType, "name" | "duration">;
    Instructor?: { User?: Pick<User, "name"> };
    Location?: Pick<Location, "name"> | null;
  }
): Promise<void> {
  try {
    const serviceName = booking.ServiceType?.name ?? "coaching-time";
    const timeStr = format(new Date(booking.startTime), "HH:mm", { locale: nb });
    const dateStr = format(new Date(booking.startTime), "EEEE d. MMMM", { locale: nb });
    const instructorName = booking.Instructor?.User?.name ?? "din instruktør";

    const metadata: BookingNotificationMetadata = {
      bookingId: booking.id,
      startTime: booking.startTime instanceof Date ? booking.startTime.toISOString() : booking.startTime,
      instructorName: booking.Instructor?.User?.name ?? undefined,
      serviceTypeName: booking.ServiceType?.name ?? undefined,
      locationName: booking.Location?.name ?? undefined,
    };

    await createNotification({
      userId: booking.studentId,
      type: NotificationType.BOOKING_REMINDER,
      title: "Påminnelse om booking",
      message: `Du har ${serviceName} med ${instructorName} ${dateStr} kl ${timeStr}`,
      linkUrl: `/portal/bookinger/${booking.id}`,
      linkText: "Se detaljer",
      metadata,
    });

    logger.info(`[notifyBookingReminder] Sent to student ${booking.studentId}`);
  } catch (error) {
    logger.error("[notifyBookingReminder] Failed:", error);
  }
}

/**
 * Mål oppnådd - Send til elev
 */
export async function notifyGoalAchieved(
  goal: Goal & {
    User?: Pick<User, "name">;
  }
): Promise<void> {
  try {
    const metadata: GoalAchievedMetadata = {
      goalId: goal.id,
      goalTitle: goal.title,
      targetValue: goal.targetValue ?? 0,
      currentValue: goal.currentValue ?? 0,
      unit: goal.unit ?? undefined,
    };

    await createNotification({
      userId: goal.userId,
      type: NotificationType.ACHIEVEMENT_UNLOCKED,
      title: "🎉 Gratulerer! Mål oppnådd!",
      message: `Du nådde målet "${goal.title}"${goal.unit ? ` (${goal.currentValue} ${goal.unit})` : ""}!`,
      linkUrl: `/portal/profil#goals`,
      linkText: "Se mål",
      metadata,
    });

    logger.info(`[notifyGoalAchieved] Sent to user ${goal.userId}`);
  } catch (error) {
    logger.error("[notifyGoalAchieved] Failed:", error);
  }
}

// ============================================================================
// BATCH/CRON OPERASJONER
// ============================================================================

// Note: Functions that need direct database access for batch operations
// should be implemented in API routes or server actions instead

/**
 * Send påminnelser til alle med bookinger i morgen
 * Kjøres som cron-job daglig kl 08:00
 * 
 * NOTE: This function requires database access and should be called
 * from an API route with proper Supabase client setup
 */
export async function sendBookingReminders(
  bookings: (Booking & {
    User?: Pick<User, "name">;
    ServiceType?: Pick<ServiceType, "name" | "duration">;
    Instructor?: { User?: Pick<User, "name"> };
    Location?: Pick<Location, "name"> | null;
  })[]
): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    let count = 0;
    for (const booking of bookings) {
      await notifyBookingReminder(booking);
      count++;
    }

    logger.info(`[sendBookingReminders] Sent ${count} reminders`);
    return { success: true, count };
  } catch (error) {
    logger.error("[sendBookingReminders] Failed:", error);
    return { success: false, error: "Failed to send reminders" };
  }
}

/**
 * Send daglig oppsummering til admin
 * 
 * NOTE: This function should be called from an API route with
 * the counts pre-calculated
 */
export async function sendAdminDailySummary(
  adminId: string,
  stats: {
    todaysBookings: number;
    pendingBookings: number;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    await createNotification({
      userId: adminId,
      type: NotificationType.GENERAL,
      title: "Dagens oppsummering",
      message: `Du har ${stats.todaysBookings} bookinger i dag. ${stats.pendingBookings > 0 ? `${stats.pendingBookings} venter på bekreftelse.` : ""}`,
      linkUrl: "/portal/admin",
      linkText: "Åpne Mission Control",
      isAdminNotification: true,
      adminType: "system",
    });

    return { success: true };
  } catch (error) {
    logger.error("[sendAdminDailySummary] Failed:", error);
    return { success: false, error: "Failed to send summary" };
  }
}
