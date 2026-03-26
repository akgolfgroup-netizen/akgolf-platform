import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { generateIcal, CalEvent } from "@/lib/portal/calendar/ical";
import { addMinutes } from "date-fns";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  // Look up user by calendar token
  const user = await prisma.user.findUnique({
    where: { calendarToken: token },
    select: { id: true, name: true },
  });

  if (!user) {
    return new NextResponse("Not found", { status: 404 });
  }

  const events: CalEvent[] = [];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  // Training plan sessions
  const plan = await prisma.trainingPlan.findFirst({
    where: { studentId: user.id, isActive: true },
    include: {
      TrainingPlanWeek: {
        include: {
          TrainingPlanSession: {
            include: {
              TrainingLog: {
                where: { userId: user.id },
                select: { id: true },
              },
            },
          },
        },
        orderBy: { weekNumber: "asc" },
      },
    },
  });

  if (plan) {
    for (const week of plan.TrainingPlanWeek) {
      for (const session of week.TrainingPlanSession) {
        const sessionDate = new Date(week.weekStart);
        sessionDate.setDate(sessionDate.getDate() + (session.dayOfWeek - 1));
        sessionDate.setUTCHours(8, 0, 0, 0); // Default 08:00 UTC

        const isLogged = session.TrainingLog.length > 0;
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
            .join("\\n"),
          dtstart: sessionDate,
          dtend,
          url: `${baseUrl}/treningsplan`,
        });
      }
    }
  }

  // Confirmed bookings
  const bookings = await prisma.booking.findMany({
    where: {
      studentId: user.id,
      status: { in: ["CONFIRMED", "PENDING"] },
      startTime: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    include: { ServiceType: true, Instructor: { include: { User: true } } },
  });

  for (const b of bookings) {
    events.push({
      uid: `booking-${b.id}@akgolf`,
      summary: `${b.status === "CONFIRMED" ? "" : "⏳ "}${b.ServiceType.name}`,
      description: [
        `Coach: ${b.Instructor.User.name ?? ""}`,
        `Status: ${b.status === "CONFIRMED" ? "Bekreftet" : "Venter"}`,
        `${baseUrl}/bookinger`,
      ].join("\\n"),
      dtstart: b.startTime,
      dtend: b.endTime,
      url: `${baseUrl}/bookinger`,
    });
  }

  // Tournament plans
  const tournaments = await prisma.playerTournamentPlan.findMany({
    where: { studentId: user.id },
    include: { Tournament: true },
  });

  for (const tp of tournaments) {
    const t = tp.Tournament;
    const dtstart = new Date(t.startDate);
    const dtend = t.endDate ? new Date(t.endDate) : new Date(t.startDate);

    events.push({
      uid: `tournament-${tp.id}@akgolf`,
      summary: `🏆 ${t.name}`,
      description: [
        t.location ? `Sted: ${t.location}` : "",
        t.course ? `Bane: ${t.course}` : "",
        `Nivå: ${t.level}`,
        `Plan: ${tp.planLevel} (${tp.goalType})`,
      ]
        .filter(Boolean)
        .join("\\n"),
      dtstart,
      dtend,
      location: t.location ?? undefined,
      allDay: true,
    });
  }

  // Training logs (as completed events)
  const logs = await prisma.trainingLog.findMany({
    where: {
      userId: user.id,
      date: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    },
    include: { TrainingPlanSession: { select: { title: true } } },
  });

  for (const log of logs) {
    const dtstart = new Date(log.date);
    dtstart.setUTCHours(8, 0, 0, 0);
    const dtend = addMinutes(dtstart, log.durationMinutes ?? 60);

    events.push({
      uid: `log-${log.id}@akgolf`,
      summary: `✓ ${log.TrainingPlanSession?.title ?? "Treningsøkt"}`,
      description: [
        log.focusArea ? `Fokus: ${log.focusArea}` : "",
        log.notes ?? "",
        log.rating ? `Vurdering: ${log.rating}/5` : "",
        `${baseUrl}/dagbok`,
      ]
        .filter(Boolean)
        .join("\\n"),
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
