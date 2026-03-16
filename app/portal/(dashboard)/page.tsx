import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { Topbar } from "@/components/portal/layout/topbar";
import { BookingStatus } from "@prisma/client";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { DashboardCards } from "@/components/portal/dashboard/dashboard-cards";
import Link from "next/link";
import { Plus } from "lucide-react";

const THEME = {
  navy: "#0F2950",
  text: "#02060D",
  textSecondary: "#64748B",
  gold: "#B8975C",
  blue: "#3B82F6",
  green: "#22C55E",
  goldMuted: "#E8D4B0",
};

export default async function DashboardPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const userId = user.id;

  const [nextBooking, activePlan, nextTournament, lastSession] =
    await Promise.all([
      // Next upcoming booking
      prisma.booking.findFirst({
        where: {
          studentId: userId,
          startTime: { gte: new Date() },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: { serviceType: { select: { name: true } } },
        orderBy: { startTime: "asc" },
      }),

      // Active training plan this week
      prisma.trainingPlan.findFirst({
        where: { studentId: userId, isActive: true },
        select: { title: true, periodType: true, weeks: { take: 1 } },
      }),

      // Next planned tournament
      prisma.playerTournamentPlan.findFirst({
        where: { studentId: userId, tournament: { startDate: { gte: new Date() } } },
        include: {
          tournament: { select: { name: true, startDate: true } },
        },
        orderBy: { tournament: { startDate: "asc" } },
      }),

      // Last coaching session with AI summary
      prisma.coachingSession.findFirst({
        where: { studentId: userId },
        orderBy: { sessionDate: "desc" },
        select: {
          sessionDate: true,
          primaryFocus: true,
          aiKeyPoints: true,
          instructor: { select: { user: { select: { name: true } } } },
        },
      }),
    ]);

  const cards = [
    {
      label: "Neste booking",
      value: nextBooking
        ? `${nextBooking.serviceType.name}`
        : "Ingen kommende",
      sub: nextBooking
        ? format(nextBooking.startTime, "EEE d. MMM HH:mm", { locale: nb })
        : "Book en time",
      color: THEME.blue,
      href: "/bookinger",
    },
    {
      label: "Treningsplan",
      value: activePlan ? activePlan.title : "Ingen aktiv plan",
      sub: activePlan
        ? activePlan.periodType.charAt(0).toUpperCase() + activePlan.periodType.slice(1)
        : "Kontakt coach",
      color: THEME.green,
      href: "/treningsplan",
    },
    {
      label: "Neste turnering",
      value: nextTournament ? nextTournament.tournament.name : "Ingen planlagt",
      sub: nextTournament
        ? format(nextTournament.tournament.startDate, "d. MMMM yyyy", { locale: nb })
        : "Se turneringsplan",
      color: THEME.gold,
      href: "/turneringsplan",
    },
    {
      label: "Siste coaching",
      value: lastSession
        ? lastSession.primaryFocus ?? "Coachingsesjon"
        : "Ingen sesjoner",
      sub: lastSession
        ? `${format(lastSession.sessionDate, "d. MMM", { locale: nb })} · ${lastSession.instructor.user.name}`
        : "—",
      color: THEME.goldMuted,
      href: "/coaching-historikk",
    },
  ];

  return (
    <div>
      <Topbar title="Oversikt" />
      <div className="p-8 max-w-5xl">
        <div className="mb-10">
          <h1 
            className="text-3xl font-semibold tracking-tight mb-2"
            style={{ color: THEME.navy }}
          >
            Hei, {user.name?.split(" ")[0] ?? "spiller"}
          </h1>
          <p style={{ color: THEME.textSecondary }}>
            Her er din oppdaterte spilleroversikt
          </p>
        </div>

        <div className="mb-6">
          <Link
            href="/bookinger/ny"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${THEME.gold}, ${THEME.goldMuted})`,
              color: "#FFFFFF",
              boxShadow: "0 4px 20px rgba(184,151,92,0.25)",
            }}
          >
            <Plus className="w-5 h-5" />
            Book coaching
          </Link>
        </div>

        <DashboardCards cards={cards} />
      </div>
    </div>
  );
}
