"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { GOAL_TYPE_CONFIG } from "@/modules/tournament-planner";
import {
  startOfISOWeek,
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
  grunnperiode: "#38BDF8",
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

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;
  const events: CalendarEvent[] = [];

  const fromStr = from.toISOString();
  const toStr = to.toISOString();

  const [
    { data: bookings },
    { data: coachingSessions },
    { data: activePlan },
    { data: playerTournaments },
  ] = await Promise.all([
    // Bookings
    supabase
      .from("Booking")
      .select(`
        id,
        startTime,
        endTime,
        ServiceType (name)
      `)
      .eq("studentId", id)
      .gte("startTime", fromStr)
      .lte("startTime", toStr)
      .in("status", ["PENDING", "CONFIRMED"]),

    // Coaching sessions
    supabase
      .from("CoachingSession")
      .select("id, sessionDate, primaryFocus")
      .eq("studentId", id)
      .gte("sessionDate", fromStr)
      .lte("sessionDate", toStr),

    // Active training plan weeks
    supabase
      .from("TrainingPlan")
      .select(`
        id,
        TrainingPlanWeek (
          id,
          weekStart,
          TrainingPlanSession (
            id,
            dayOfWeek,
            title
          )
        )
      `)
      .eq("studentId", id)
      .eq("isActive", true)
      .lte("TrainingPlanWeek.weekStart", toStr)
      .single(),

    // Tournament plans
    supabase
      .from("PlayerTournamentPlan")
      .select(`
        id,
        goalType,
        Tournament (name, startDate, endDate)
      `)
      .eq("studentId", id)
      .gte("Tournament.startDate", fromStr)
      .lte("Tournament.startDate", toStr),
  ]);

  // Bookings → blue
  for (const b of bookings || []) {
    events.push({
      id: b.id,
      type: "booking",
      title: (b.ServiceType as { name: string }).name,
      startDate: new Date(b.startTime),
      endDate: new Date(b.endTime),
      color: "#38BDF8",
    });
  }

  // Coaching sessions → gold
  for (const c of coachingSessions || []) {
    events.push({
      id: c.id,
      type: "coaching",
      title: c.primaryFocus ?? "Coachingsesjon",
      startDate: new Date(c.sessionDate),
      color: "#1D1D1F",
    });
  }

  // Training sessions → green (map dayOfWeek to actual date)
  if (activePlan) {
    const weeks = (activePlan.TrainingPlanWeek as { weekStart: string; TrainingPlanSession: { id: string; dayOfWeek: number; title: string }[] }[]) || [];
    for (const week of weeks) {
      const weekMon = startOfISOWeek(new Date(week.weekStart));
      for (const s of week.TrainingPlanSession) {
        const sessionDate = addDays(weekMon, s.dayOfWeek - 1);
        if (sessionDate >= from && sessionDate <= to) {
          events.push({
            id: s.id,
            type: "training",
            title: s.title,
            startDate: sessionDate,
            color: "#10B981",
          });
        }
      }
    }
  }

  // Tournament plans → goal type color
  for (const tp of playerTournaments || []) {
    const tournament = tp.Tournament as { name: string; startDate: string; endDate: string | null };
    if (!tournament) continue;
    const goalConfig =
      GOAL_TYPE_CONFIG[tp.goalType as keyof typeof GOAL_TYPE_CONFIG];
    events.push({
      id: tp.id,
      type: "tournament",
      title: tournament.name,
      startDate: new Date(tournament.startDate),
      endDate: tournament.endDate ? new Date(tournament.endDate) : undefined,
      color: goalConfig?.color ?? "#1D1D1F",
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

  const supabase = await createServerSupabase();
  const id = studentId ?? user.id;
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);

  const { data: periods } = await supabase
    .from("PeriodizationPeriod")
    .select("*")
    .or(`studentId.is.null,studentId.eq.${id}`)
    .lte("startDate", yearEnd.toISOString())
    .gte("endDate", yearStart.toISOString())
    .order("startDate", { ascending: true });

  return (periods || []).map((p) => ({
    periodType: p.periodType,
    startDate: new Date(p.startDate),
    endDate: new Date(p.endDate),
    label: p.label,
    color: PERIOD_COLORS[p.periodType] ?? "#38BDF8",
  }));
}
