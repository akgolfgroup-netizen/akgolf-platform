"use server";

import { requirePortalUser } from "@/lib/portal/auth";

import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
import { GOAL_TYPE_CONFIG } from "@/modules/tournament-planner";
import {
  startOfISOWeek,
  endOfISOWeek,
  isWithinInterval,
  addDays,
} from "date-fns";

export type CalendarEventType =
  | "booking"
  | "training"
  | "tournament"
  | "coaching";

export interface CalendarEvent {
  id: string;
  type: CalendarEventType;
  title: string;
  startDate: Date;
  endDate?: Date;
  color: string;
  allDay?: boolean;
}

export interface PeriodBand {
  periodType: string;
  startDate: Date;
  endDate: Date;
  label?: string | null;
  color: string;
}

const PERIOD_COLORS: Record<string, string> = {
  grunnperiode: "#3B82F6",
  spesialiseringsperiode: "#F97316",
  turneringsperiode: "#EF4444",
};

export async function getCalendarEvents(
  from: Date,
  to: Date,
  studentId?: string
): Promise<CalendarEvent[]> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;
  const events: CalendarEvent[] = [];

  const [bookings, coachingSessions, activePlan, playerTournaments] =
    await Promise.all([
      // Bookings
      prisma.booking.findMany({
        where: {
          studentId: id,
          startTime: { gte: from, lte: to },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: { serviceType: { select: { name: true } } },
      }),

      // Coaching sessions
      prisma.coachingSession.findMany({
        where: {
          studentId: id,
          sessionDate: { gte: from, lte: to },
        },
        select: { id: true, sessionDate: true, primaryFocus: true },
      }),

      // Active training plan weeks
      prisma.trainingPlan.findFirst({
        where: { studentId: id, isActive: true },
        include: {
          weeks: {
            where: {
              weekStart: { lte: to },
            },
            include: {
              sessions: { where: { dayOfWeek: { gte: 1, lte: 7 } } },
            },
          },
        },
      }),

      // Tournament plans (filter by tournament startDate)
      prisma.playerTournamentPlan.findMany({
        where: {
          studentId: id,
          tournament: { startDate: { gte: from, lte: to } },
        },
        include: { tournament: true },
      }),
    ]);

  // Bookings → blue
  for (const b of bookings) {
    events.push({
      id: b.id,
      type: "booking",
      title: b.serviceType.name,
      startDate: b.startTime,
      endDate: b.endTime,
      color: "#3B82F6",
    });
  }

  // Coaching sessions → gold
  for (const c of coachingSessions) {
    events.push({
      id: c.id,
      type: "coaching",
      title: c.primaryFocus ?? "Coachingsesjon",
      startDate: c.sessionDate,
      color: "#B8975C",
    });
  }

  // Training sessions → green (map dayOfWeek to actual date)
  if (activePlan) {
    for (const week of activePlan.weeks) {
      const weekMon = startOfISOWeek(week.weekStart);
      for (const s of week.sessions) {
        const sessionDate = addDays(weekMon, s.dayOfWeek - 1);
        if (sessionDate >= from && sessionDate <= to) {
          events.push({
            id: s.id,
            type: "training",
            title: s.title,
            startDate: sessionDate,
            color: "#22C55E",
          });
        }
      }
    }
  }

  // Tournament plans → goal type color
  for (const tp of playerTournaments) {
    if (!tp.tournament) continue;
    const goalConfig =
      GOAL_TYPE_CONFIG[tp.goalType as keyof typeof GOAL_TYPE_CONFIG];
    events.push({
      id: tp.id,
      type: "tournament",
      title: tp.tournament.name,
      startDate: tp.tournament.startDate,
      endDate: tp.tournament.endDate ?? undefined,
      color: goalConfig?.color ?? "#B8975C",
      allDay: true,
    });
  }

  return events.sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );
}

export async function getPeriodizationBands(
  year: number,
  studentId?: string
): Promise<PeriodBand[]> {
  const user = await requirePortalUser();
  if (!user?.id) return [];

  const id = studentId ?? user.id;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  const periods = await prisma.periodizationPeriod.findMany({
    where: {
      OR: [{ studentId: null }, { studentId: id }],
      startDate: { lte: yearEnd },
      endDate: { gte: yearStart },
    },
    orderBy: { startDate: "asc" },
  });

  return periods.map((p) => ({
    periodType: p.periodType,
    startDate: p.startDate,
    endDate: p.endDate,
    label: p.label,
    color: PERIOD_COLORS[p.periodType] ?? "#3B82F6",
  }));
}
