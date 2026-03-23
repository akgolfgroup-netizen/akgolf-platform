import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { Topbar } from "@/components/portal/layout/topbar";
import { BookingStatus } from "@prisma/client";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import { DashboardCards } from "@/components/portal/dashboard/dashboard-cards";
import Link from "next/link";
import { Plus, Calendar, TrendingDown, MessageSquare, ChevronRight } from "lucide-react";

const THEME = {
  navy: "#0F2950",
  text: "#02060D",
  textSecondary: "#64748B",
  gold: "#B8975C",
  goldMuted: "#E8D4B0",
  blue: "#3B82F6",
  green: "#22C55E",
  surface: "#FAFBFC",
  border: "#EBE5DA",
};

export default async function DashboardPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const userId = user.id;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [nextBooking, activePlan, nextTournament, lastSession, weekBookings, handicapHistory] =
    await Promise.all([
      // Next upcoming booking
      prisma.booking.findFirst({
        where: {
          studentId: userId,
          startTime: { gte: now },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: { serviceType: { select: { name: true } } },
        orderBy: { startTime: "asc" },
      }),

      // Active training plan
      prisma.trainingPlan.findFirst({
        where: { studentId: userId, isActive: true },
        select: {
          title: true,
          periodType: true,
          goals: true,
          weeks: {
            take: 1,
            orderBy: { weekNumber: "desc" },
            select: {
              sessions: {
                select: { dayOfWeek: true, title: true, durationMinutes: true }
              }
            }
          }
        },
      }),

      // Next tournament
      prisma.playerTournamentPlan.findFirst({
        where: { studentId: userId, tournament: { startDate: { gte: now } } },
        include: { tournament: { select: { name: true, startDate: true } } },
        orderBy: { tournament: { startDate: "asc" } },
      }),

      // Last coaching session
      prisma.coachingSession.findFirst({
        where: { studentId: userId },
        orderBy: { sessionDate: "desc" },
        select: {
          sessionDate: true,
          primaryFocus: true,
          aiKeyPoints: true,
          instructorNotes: true,
          instructor: { select: { user: { select: { name: true } } } },
        },
      }),

      // This week's bookings
      prisma.booking.findMany({
        where: {
          studentId: userId,
          startTime: { gte: weekStart, lte: weekEnd },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: { serviceType: { select: { name: true } } },
        orderBy: { startTime: "asc" },
      }),

      // Handicap history (last 6 entries)
      prisma.handicapEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 6,
        select: { handicapIndex: true, date: true },
      }),
    ]);

  // Calculate handicap change
  const currentHcp = handicapHistory[0]?.handicapIndex ?? null;
  const previousHcp = handicapHistory[handicapHistory.length - 1]?.handicapIndex ?? currentHcp;
  const hcpChange = currentHcp && previousHcp ? (previousHcp - currentHcp).toFixed(1) : null;

  const cards = [
    {
      label: "Neste økt",
      value: nextBooking ? nextBooking.serviceType.name : "Ingen kommende",
      sub: nextBooking
        ? format(nextBooking.startTime, "EEEE d. MMM 'kl' HH:mm", { locale: nb })
        : "Book en time",
      color: THEME.blue,
      href: "/portal/bookinger",
    },
    {
      label: "Treningsplan",
      value: activePlan?.title ?? "Ingen aktiv plan",
      sub: activePlan?.goals?.[0] ?? "Kontakt coach",
      color: THEME.green,
      href: "/portal/treningsplan",
    },
    {
      label: "Neste turnering",
      value: nextTournament?.tournament.name ?? "Ingen planlagt",
      sub: nextTournament
        ? format(nextTournament.tournament.startDate, "d. MMMM yyyy", { locale: nb })
        : "Se turneringsplan",
      color: THEME.gold,
      href: "/portal/turneringsplan",
    },
    {
      label: "Handicap",
      value: currentHcp ? currentHcp.toFixed(1) : "—",
      sub: hcpChange && parseFloat(hcpChange) > 0 ? `↓ ${hcpChange} siste periode` : "Logg runder for statistikk",
      color: THEME.goldMuted,
      href: "/portal/statistikk",
    },
  ];

  // Week days for training plan
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const currentWeekSessions = activePlan?.weeks?.[0]?.sessions ?? [];

  return (
    <div className="min-h-screen" style={{ background: THEME.surface }}>
      <Topbar title="Oversikt" />

      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-semibold tracking-tight"
              style={{ color: THEME.navy }}
            >
              Hei, {user.name?.split(" ")[0] ?? "spiller"}
            </h1>
            <p className="text-sm mt-1" style={{ color: THEME.textSecondary }}>
              {user.subscriptionTier === "FREE" ? "Gratis bruker" : `${user.subscriptionTier} medlem`}
            </p>
          </div>

          <Link
            href="/portal/bookinger/ny"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.02] cursor-pointer"
            style={{
              background: THEME.gold,
              color: "#FFFFFF",
              boxShadow: "0 4px 12px rgba(184,151,92,0.25)",
            }}
          >
            <Plus className="w-4 h-4" />
            Book økt
          </Link>
        </div>

        {/* Quick stats cards */}
        <DashboardCards cards={cards} />

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* This week's schedule */}
          <div
            className="rounded-2xl p-6 transition-shadow hover:shadow-lg cursor-pointer"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${THEME.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" style={{ color: THEME.gold }} />
                <h2 className="font-semibold" style={{ color: THEME.navy }}>Denne uken</h2>
              </div>
              <Link
                href="/portal/kalender"
                className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                style={{ color: THEME.gold }}
              >
                Se kalender <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const dayDate = addDays(weekStart, idx);
                const isToday = format(dayDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
                const dayBooking = weekBookings.find(
                  b => format(b.startTime, "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd")
                );
                const planSession = currentWeekSessions.find(s => s.dayOfWeek === idx + 1);

                return (
                  <div
                    key={day}
                    className="text-center p-2 rounded-lg transition-colors"
                    style={{
                      background: dayBooking ? `${THEME.gold}15` : THEME.surface,
                      boxShadow: isToday ? `inset 0 0 0 2px ${THEME.gold}` : "none",
                    }}
                  >
                    <p className="text-[10px] font-medium mb-1" style={{ color: THEME.textSecondary }}>
                      {day}
                    </p>
                    <p className="text-xs font-semibold" style={{ color: THEME.navy }}>
                      {format(dayDate, "d")}
                    </p>
                    {dayBooking && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mx-auto mt-1"
                        style={{ background: THEME.blue }}
                        title={dayBooking.serviceType.name}
                      />
                    )}
                    {planSession && !dayBooking && (
                      <div
                        className="w-1.5 h-1.5 rounded-full mx-auto mt-1"
                        style={{ background: THEME.green }}
                        title={planSession.title}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {weekBookings.length > 0 && (
              <div className="mt-4 pt-4 space-y-2" style={{ borderTop: `1px solid ${THEME.border}` }}>
                {weekBookings.slice(0, 2).map(booking => (
                  <div key={booking.id} className="flex items-center gap-3">
                    <div
                      className="w-1 h-8 rounded-full"
                      style={{ background: THEME.blue }}
                    />
                    <div>
                      <p className="text-sm font-medium" style={{ color: THEME.navy }}>
                        {booking.serviceType.name}
                      </p>
                      <p className="text-xs" style={{ color: THEME.textSecondary }}>
                        {format(booking.startTime, "EEEE 'kl' HH:mm", { locale: nb })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Last coaching notes */}
          <div
            className="rounded-2xl p-6 transition-shadow hover:shadow-lg cursor-pointer"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${THEME.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" style={{ color: THEME.gold }} />
                <h2 className="font-semibold" style={{ color: THEME.navy }}>Siste coaching</h2>
              </div>
              <Link
                href="/portal/coaching-historikk"
                className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                style={{ color: THEME.gold }}
              >
                Se alle <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {lastSession ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs" style={{ color: THEME.textSecondary }}>
                  <span>{format(lastSession.sessionDate, "d. MMMM yyyy", { locale: nb })}</span>
                  <span>·</span>
                  <span>{lastSession.instructor.user.name}</span>
                </div>

                {lastSession.primaryFocus && (
                  <div
                    className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: `${THEME.gold}20`, color: THEME.gold }}
                  >
                    {lastSession.primaryFocus}
                  </div>
                )}

                {lastSession.aiKeyPoints && (
                  <p className="text-sm leading-relaxed" style={{ color: THEME.text }}>
                    {lastSession.aiKeyPoints}
                  </p>
                )}

                {lastSession.instructorNotes && !lastSession.aiKeyPoints && (
                  <p className="text-sm leading-relaxed line-clamp-4" style={{ color: THEME.text }}>
                    {lastSession.instructorNotes}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm" style={{ color: THEME.textSecondary }}>
                  Ingen coaching-sesjoner ennå
                </p>
                <Link
                  href="/portal/bookinger/ny"
                  className="inline-block mt-3 text-sm font-medium cursor-pointer"
                  style={{ color: THEME.gold }}
                >
                  Book din første økt →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Handicap trend (if data exists) */}
        {handicapHistory.length >= 2 && (
          <div
            className="rounded-2xl p-6"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${THEME.border}`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5" style={{ color: THEME.green }} />
                <h2 className="font-semibold" style={{ color: THEME.navy }}>Handicap-utvikling</h2>
              </div>
              <Link
                href="/portal/statistikk"
                className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                style={{ color: THEME.gold }}
              >
                Full statistikk <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="flex items-end gap-4 h-24">
              {handicapHistory.slice().reverse().map((entry, idx) => {
                const maxHcp = Math.max(...handicapHistory.map(h => h.handicapIndex));
                const minHcp = Math.min(...handicapHistory.map(h => h.handicapIndex));
                const range = maxHcp - minHcp || 1;
                const height = ((entry.handicapIndex - minHcp) / range) * 60 + 20;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium" style={{ color: THEME.navy }}>
                      {entry.handicapIndex.toFixed(1)}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${height}%`,
                        background: idx === handicapHistory.length - 1
                          ? THEME.gold
                          : `${THEME.gold}40`,
                      }}
                    />
                    <span className="text-[10px]" style={{ color: THEME.textSecondary }}>
                      {format(entry.date, "MMM", { locale: nb })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
