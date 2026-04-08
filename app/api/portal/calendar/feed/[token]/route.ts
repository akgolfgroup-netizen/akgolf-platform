import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { generateIcal, CalEvent } from "@/lib/portal/calendar/ical";
import { addMinutes } from "date-fns";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const supabase = createServiceClient();

  // Look up user by calendar token
  const { data: user } = await supabase
    .from("User")
    .select("id, name")
    .eq("calendarToken", token)
    .single();

  if (!user) {
    return new NextResponse("Not found", { status: 404 });
  }

  const events: CalEvent[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://akgolf.no";

  // Training plan sessions
  const { data: plan } = await supabase
    .from("TrainingPlan")
    .select(`
      id,
      TrainingPlanWeek!inner(
        id,
        weekNumber,
        weekStart,
        TrainingPlanSession!inner(
          id,
          title,
          description,
          focusArea,
          durationMinutes,
          dayOfWeek,
          TrainingLog:userId(
            id
          )
        )
      )
    `)
    .eq("studentId", user.id)
    .eq("isActive", true)
    .order("weekNumber", { foreignTable: "TrainingPlanWeek", ascending: true })
    .single();

  if (plan) {
    // Supabase returns nested relations as arrays
    const weeks = plan.TrainingPlanWeek as unknown as Array<{
      id: string;
      weekNumber: number;
      weekStart: string;
      TrainingPlanSession: Array<{
        id: string;
        title: string;
        description: string | null;
        focusArea: string | null;
        durationMinutes: number | null;
        dayOfWeek: number;
        TrainingLog: Array<{ id: string }>;
      }>;
    }>;

    for (const week of weeks) {
      for (const session of week.TrainingPlanSession) {
        const sessionDate = new Date(week.weekStart);
        sessionDate.setDate(sessionDate.getDate() + (session.dayOfWeek - 1));
        sessionDate.setUTCHours(8, 0, 0, 0); // Default 08:00 UTC

        const isLogged = session.TrainingLog && session.TrainingLog.length > 0;
        const duration = session.durationMinutes ?? 60;
        const dtend = addMinutes(sessionDate, duration);

        events.push({
          uid: `training-session-${session.id}@akgolf`,
          summary: `${isLogged ? "✓ " : ""}${session.title}`,
          description: [
            session.description ?? "",
            session.focusArea ? `Fokus: ${session.focusArea}` : "",
            `Varighet: ${duration} min`,
            isLogged ? "Status: Fullført" : "",
            `${baseUrl}/treningsplan`,
          ]
            .filter(Boolean)
            .join("\n"),
          dtstart: sessionDate,
          dtend,
          url: `${baseUrl}/treningsplan`,
        });
      }
    }
  }

  // Confirmed bookings
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: bookings } = await supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      endTime,
      status,
      ServiceType!inner(name),
      Instructor!inner(
        User!inner(name)
      )
    `)
    .eq("studentId", user.id)
    .in("status", ["CONFIRMED", "PENDING"])
    .gte("startTime", thirtyDaysAgo);

  for (const b of bookings || []) {
    // Supabase returns nested relations as arrays - take first element
    const serviceType = (b.ServiceType as unknown as Array<{ name: string }>)?.[0];
    const instructor = (b.Instructor as unknown as Array<{ User: Array<{ name: string | null }> }>)?.[0];
    const userName = instructor?.User?.[0]?.name;

    events.push({
      uid: `booking-${b.id}@akgolf`,
      summary: `${b.status === "CONFIRMED" ? "" : "⏳ "}${serviceType?.name ?? ""}`,
      description: [
        `Coach: ${userName ?? ""}`,
        `Status: ${b.status === "CONFIRMED" ? "Bekreftet" : "Venter"}`,
        `${baseUrl}/bookinger`,
      ].join("\n"),
      dtstart: new Date(b.startTime),
      dtend: new Date(b.endTime),
      url: `${baseUrl}/bookinger`,
    });
  }

  // Tournament plans
  const { data: tournaments } = await supabase
    .from("PlayerTournamentPlan")
    .select(`
      id,
      planLevel,
      goalType,
      Tournament!inner(
        name,
        startDate,
        endDate,
        location,
        course,
        level
      )
    `)
    .eq("studentId", user.id);

  for (const tp of tournaments || []) {
    // Supabase returns nested relations as arrays - take first element
    const tournament = (tp.Tournament as unknown as Array<{
      name: string;
      startDate: string;
      endDate: string | null;
      location: string | null;
      course: string | null;
      level: string;
    }>)?.[0];

    if (!tournament) continue;

    const dtstart = new Date(tournament.startDate);
    const dtend = tournament.endDate ? new Date(tournament.endDate) : new Date(tournament.startDate);

    events.push({
      uid: `tournament-${tp.id}@akgolf`,
      summary: `🏆 ${tournament.name}`,
      description: [
        tournament.location ? `Sted: ${tournament.location}` : "",
        tournament.course ? `Bane: ${tournament.course}` : "",
        `Nivå: ${tournament.level}`,
        `Plan: ${tp.planLevel} (${tp.goalType})`,
      ]
        .filter(Boolean)
        .join("\n"),
      dtstart,
      dtend,
      location: tournament.location ?? undefined,
      allDay: true,
    });
  }

  // Training logs (as completed events)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
  const { data: logs } = await supabase
    .from("TrainingLog")
    .select(`
      id,
      date,
      durationMinutes,
      focusArea,
      notes,
      rating,
      TrainingPlanSession(title)
    `)
    .eq("userId", user.id)
    .gte("date", ninetyDaysAgo);

  for (const log of logs || []) {
    // Supabase returns nested relations as arrays - take first element
    const session = (log.TrainingPlanSession as unknown as Array<{ title: string | null }>)?.[0];

    const dtstart = new Date(log.date);
    dtstart.setUTCHours(8, 0, 0, 0);
    const dtend = addMinutes(dtstart, log.durationMinutes ?? 60);

    events.push({
      uid: `log-${log.id}@akgolf`,
      summary: `✓ ${session?.title ?? "Treningsøkt"}`,
      description: [
        log.focusArea ? `Fokus: ${log.focusArea}` : "",
        log.notes ?? "",
        log.rating ? `Vurdering: ${log.rating}/5` : "",
        `${baseUrl}/dagbok`,
      ]
        .filter(Boolean)
        .join("\n"),
      dtstart,
      dtend,
      url: `${baseUrl}/dagbok`,
    });
  }

  const ical = generateIcal(
    events,
    `AK Golf — ${user.name ?? "Portal"}`
  );

  return new NextResponse(ical, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="akgolf-trening.ics"`,
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
