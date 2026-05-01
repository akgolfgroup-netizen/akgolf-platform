// VERIFY: To-veis Google Calendar sync for treningsplaner
// Kalles fra plan-generator etter generering, og ved økt-endringer

import { createServiceClient } from "@/lib/supabase/server";
import { syncBookingToCalendar, removeFromCalendar } from "./google-calendar";
import { logger } from "@/lib/logger";

interface TrainingSessionEvent {
  id: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
  googleCalendarEventId?: string | null;
}

/** Syncer en treningsplan-økt til Google Calendar */
export async function syncTrainingSessionToCalendar(
  userId: string,
  session: TrainingSessionEvent,
): Promise<string> {
  try {
    const eventId = await syncBookingToCalendar(userId, {
      id: session.id,
      startTime: session.startTime,
      endTime: session.endTime,
      serviceName: session.title,
      location: "AK Golf",
      googleCalendarEventId: session.googleCalendarEventId,
    });

    // Persist event ID
    const supabase = createServiceClient();
    await supabase
      .from("TrainingPlanSession")
      .update({ googleCalendarEventId: eventId })
      .eq("id", session.id);

    return eventId;
  } catch (err) {
    logger.error(`[TrainingPlanSync] Failed to sync session ${session.id}:`, err);
    throw err;
  }
}

/** Fjerner en treningsplan-økt fra Google Calendar */
export async function removeTrainingSessionFromCalendar(
  userId: string,
  sessionId: string,
  eventId: string,
): Promise<void> {
  try {
    await removeFromCalendar(userId, eventId);

    const supabase = createServiceClient();
    await supabase
      .from("TrainingPlanSession")
      .update({ googleCalendarEventId: null })
      .eq("id", sessionId);
  } catch (err) {
    logger.error(`[TrainingPlanSync] Failed to remove session ${sessionId}:`, err);
    throw err;
  }
}

/** Batch-syncer alle økter i en treningsplan til Google Calendar */
export async function syncPlanToGoogleCalendar(
  userId: string,
  planId: string,
): Promise<{ synced: number; failed: number }> {
  const supabase = createServiceClient();

  const { data: sessions } = await supabase
    .from("TrainingPlanSession")
    .select(`
      id,
      title,
      description,
      durationMinutes,
      dayOfWeek,
      googleCalendarEventId,
      TrainingPlanWeek!inner(weekStart)
    `)
    .eq("TrainingPlanWeek.planId", planId);

  let synced = 0;
  let failed = 0;

  for (const s of sessions || []) {
    const week = (s.TrainingPlanWeek as unknown as Array<{ weekStart: string }>)?.[0];
    if (!week) continue;

    const startTime = new Date(week.weekStart);
    startTime.setDate(startTime.getDate() + (s.dayOfWeek - 1));
    startTime.setHours(9, 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + (s.durationMinutes ?? 60));

    try {
      await syncTrainingSessionToCalendar(userId, {
        id: s.id,
        title: s.title,
        description: s.description,
        startTime,
        endTime,
        googleCalendarEventId: s.googleCalendarEventId,
      });
      synced++;
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}
