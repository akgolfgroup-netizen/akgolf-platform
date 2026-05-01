// VERIFY: Kalender-aggregator — syncer 4 kilder til CalendarEvent
// Kilde: docs/superpowers/specs/2026-05-01-adaptiv-treningsmotor-masterplan.md DEL 4.4, Fase 6

import { prisma } from "@/lib/portal/prisma";
import type { CalendarEventSource } from "@prisma/client";

export interface CalendarEvent {
  id: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  location?: string;
  notes?: string;
  source: CalendarEventSource;
  sourceId: string;
}

/** Syncer alle kilder til CalendarEvent-tabellen */
export async function syncUserCalendar(userId: string, opts?: { fromDate?: Date; toDate?: Date }): Promise<void> {
  const fromDate = opts?.fromDate ?? new Date();
  const toDate = opts?.toDate ?? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);

  // 1. TrainingSession (individuelle)
  const sessions = await prisma.trainingPlanSession.findMany({
    where: {
      TrainingPlanWeek: {
        weekStart: { gte: fromDate, lte: toDate },
        TrainingPlan: { studentId: userId },
      },
    },
    include: {
      TrainingPlanWeek: {
        include: { TrainingPlan: true },
      },
    },
  });

  for (const s of sessions) {
    const weekStart = s.TrainingPlanWeek.weekStart;
    const start = new Date(weekStart);
    start.setDate(start.getDate() + (s.dayOfWeek - 1));
    start.setHours(9, 0, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + (s.durationMinutes ?? 60));

    await upsertCalendarEvent({
      userId,
      source: "TRAINING_SESSION_INDIVIDUAL",
      sourceId: s.id,
      title: s.title,
      startsAt: start,
      endsAt: end,
      location: undefined,
      notes: s.description ?? undefined,
    });
  }

  // 2. TournamentRegistration
  const tournaments = await prisma.tournamentRegistration.findMany({
    where: { userId, startsAt: { gte: fromDate, lte: toDate } },
  });

  for (const t of tournaments) {
    await upsertCalendarEvent({
      userId,
      source: "TOURNAMENT",
      sourceId: t.id,
      title: t.name,
      startsAt: t.startsAt,
      endsAt: t.endsAt ?? new Date(t.startsAt.getTime() + 8 * 60 * 60 * 1000),
      location: t.course ?? undefined,
      notes: `Turnering: ${t.name}`,
    });
  }

  // 3. Booking (hvis Booking-modell finnes med userId)
  // Placeholder — implementeres når Booking-tabellen har userId-link
}

/** Henter kalender-events for en bruker i et datoområde */
export async function getCalendarEvents(
  userId: string,
  opts: { fromDate: Date; toDate: Date },
): Promise<CalendarEvent[]> {
  const events = await prisma.calendarEvent.findMany({
    where: {
      userId,
      startsAt: { gte: opts.fromDate, lte: opts.toDate },
    },
    orderBy: { startsAt: "asc" },
  });

  return events.map((e) => ({
    id: e.id,
    title: e.title,
    startsAt: e.startsAt,
    endsAt: e.endsAt,
    location: e.location ?? undefined,
    notes: e.notes ?? undefined,
    source: e.source,
    sourceId: e.sourceId,
  }));
}

async function upsertCalendarEvent(data: {
  userId: string;
  source: CalendarEventSource;
  sourceId: string;
  title: string;
  startsAt: Date;
  endsAt: Date;
  location?: string;
  notes?: string;
}) {
  const existing = await prisma.calendarEvent.findUnique({
    where: {
      userId_source_sourceId: {
        userId: data.userId,
        source: data.source,
        sourceId: data.sourceId,
      },
    },
  });

  if (existing) {
    await prisma.calendarEvent.update({
      where: { id: existing.id },
      data: {
        title: data.title,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        location: data.location,
        notes: data.notes,
      },
    });
  } else {
    await prisma.calendarEvent.create({
      data: {
        userId: data.userId,
        source: data.source,
        sourceId: data.sourceId,
        title: data.title,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        location: data.location,
        notes: data.notes,
      },
    });
  }
}
