import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { Sparkles, Calendar, TrendingDown, MessageSquare, ChevronRight, Target, BarChart3, Trophy } from "lucide-react";
import { PORTAL_EMPTY_STATES } from "@/lib/website-constants";

export default async function DashboardPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const userId = user.id;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [nextBooking, activePlan, lastSession, weekBookings, handicapHistory] =
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

  // Calculate handicap
  const currentHcp = handicapHistory[0]?.handicapIndex ?? null;
  const previousHcp = handicapHistory[handicapHistory.length - 1]?.handicapIndex ?? currentHcp;
  const hcpChange = currentHcp && previousHcp ? (previousHcp - currentHcp).toFixed(1) : null;

  // Week days for training plan
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
  const currentWeekSessions = activePlan?.weeks?.[0]?.sessions ?? [];

  // Greeting based on time
  const hour = now.getHours();
  const greeting = hour < 12 ? "God morgen" : hour < 17 ? "God dag" : "God kveld";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0F2950]">
            {greeting}, {user.name?.split(" ")[0] ?? "spiller"}
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            {PORTAL_EMPTY_STATES.dashboard.welcome.replace("{name}", user.name?.split(" ")[0] ?? "spiller")}
          </p>
        </div>

        <Link
          href="/portal/bookinger/ny"
          className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#B8975C] text-white hover:brightness-110 transition-all cursor-pointer"
          style={{ boxShadow: "0 4px 12px rgba(184,151,92,0.25)" }}
        >
          <Sparkles className="w-4 h-4" />
          Book time
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Next training - Large card */}
        <div className="md:col-span-2 md:row-span-2 rounded-2xl p-6 bg-white border border-[#EBE5DA]">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-[#B8975C]" />
            <h2 className="font-semibold text-[#0F2950]">Neste trening</h2>
          </div>

          {nextBooking ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#B8975C]/10 border border-[#B8975C]/20">
                <p className="text-lg font-semibold text-[#0F2950]">
                  {nextBooking.serviceType.name}
                </p>
                <p className="text-sm text-[#64748B] mt-2">
                  {format(nextBooking.startTime, "EEEE d. MMMM 'kl' HH:mm", { locale: nb })}
                </p>
              </div>

              <Link
                href="/portal/bookinger"
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#FAFBFC] hover:bg-[#F0F2F5] transition-colors cursor-pointer group"
              >
                <span className="text-sm font-medium text-[#0F2950]">
                  Se alle bookinger
                </span>
                <ChevronRight className="w-4 h-4 text-[#64748B] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-12 h-12 rounded-full bg-[#F0F2F5] flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-[#64748B]" />
              </div>
              <p className="text-[#64748B] mb-4">
                {PORTAL_EMPTY_STATES.dashboard.noBookings}
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-[#B8975C] text-white hover:brightness-110 transition-all cursor-pointer"
              >
                {PORTAL_EMPTY_STATES.bookinger.cta}
              </Link>
            </div>
          )}
        </div>

        {/* Handicap */}
        <div className="rounded-2xl p-5 bg-white border border-[#EBE5DA]">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#B8975C]" />
            <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
              Handicap
            </span>
          </div>
          <p className="text-3xl font-bold text-[#0F2950]">
            {currentHcp?.toFixed(1) ?? "—"}
          </p>
          <p className="text-sm text-[#64748B]">
            hcp index
          </p>
          {hcpChange && parseFloat(hcpChange) > 0 && (
            <div className="flex items-center gap-1 mt-2 text-xs text-[#16a34a]">
              <TrendingDown className="w-3 h-3" />
              <span>↓ {hcpChange} siste periode</span>
            </div>
          )}
        </div>

        {/* Training plan status */}
        <div className="rounded-2xl p-5 bg-white border border-[#EBE5DA]">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-[#16a34a]" />
            <span className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide">
              Treningsplan
            </span>
          </div>
          <p className="text-lg font-bold text-[#0F2950] line-clamp-1">
            {activePlan?.title ?? "Ingen aktiv"}
          </p>
          <p className="text-sm text-[#64748B] line-clamp-1">
            {activePlan?.goals?.[0] ?? PORTAL_EMPTY_STATES.dashboard.noPlan}
          </p>
          <Link
            href="/portal/treningsplan"
            className="text-xs text-[#B8975C] mt-2 inline-block hover:underline cursor-pointer"
          >
            Se plan →
          </Link>
        </div>

        {/* This week's schedule */}
        <div className="md:col-span-2 rounded-2xl p-6 bg-white border border-[#EBE5DA]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#B8975C]" />
              <h2 className="font-semibold text-[#0F2950]">Denne uken</h2>
            </div>
            <Link
              href="/portal/kalender"
              className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer text-[#B8975C]"
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
                  className={`text-center p-2 rounded-lg transition-colors ${
                    dayBooking ? "bg-[#B8975C]/15" : "bg-[#FAFBFC]"
                  } ${isToday ? "ring-2 ring-[#B8975C]" : ""}`}
                >
                  <p className="text-[10px] font-medium mb-1 text-[#9CA3AF]">
                    {day}
                  </p>
                  <p className="text-xs font-semibold text-[#0F2950]">
                    {format(dayDate, "d")}
                  </p>
                  {dayBooking && (
                    <div
                      className="w-1.5 h-1.5 rounded-full mx-auto mt-1 bg-[#3B82F6]"
                      title={dayBooking.serviceType.name}
                    />
                  )}
                  {planSession && !dayBooking && (
                    <div
                      className="w-1.5 h-1.5 rounded-full mx-auto mt-1 bg-[#16a34a]"
                      title={planSession.title}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {weekBookings.length > 0 && (
            <div className="mt-4 pt-4 space-y-2 border-t border-[#EBE5DA]">
              {weekBookings.slice(0, 2).map(booking => (
                <div key={booking.id} className="flex items-center gap-3">
                  <div className="w-1 h-8 rounded-full bg-[#3B82F6]" />
                  <div>
                    <p className="text-sm font-medium text-[#0F2950]">
                      {booking.serviceType.name}
                    </p>
                    <p className="text-xs text-[#64748B]">
                      {format(booking.startTime, "EEEE 'kl' HH:mm", { locale: nb })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Last coaching notes */}
        <div className="md:col-span-2 rounded-2xl p-6 bg-white border border-[#EBE5DA]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#B8975C]" />
              <h2 className="font-semibold text-[#0F2950]">Siste coaching</h2>
            </div>
            <Link
              href="/portal/coaching-historikk"
              className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer text-[#B8975C]"
            >
              Se alle <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {lastSession ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span>{format(lastSession.sessionDate, "d. MMMM yyyy", { locale: nb })}</span>
                <span>·</span>
                <span>{lastSession.instructor.user.name}</span>
              </div>

              {lastSession.primaryFocus && (
                <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#B8975C]/20 text-[#8B7243]">
                  {lastSession.primaryFocus}
                </div>
              )}

              {lastSession.aiKeyPoints && (
                <p className="text-sm leading-relaxed text-[#0F2950]">
                  {lastSession.aiKeyPoints}
                </p>
              )}

              {lastSession.instructorNotes && !lastSession.aiKeyPoints && (
                <p className="text-sm leading-relaxed line-clamp-4 text-[#0F2950]">
                  {lastSession.instructorNotes}
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-[#64748B]">
                Ingen coaching-sesjoner ennå
              </p>
              <Link
                href="/portal/bookinger/ny"
                className="inline-block mt-3 text-sm font-medium cursor-pointer text-[#B8975C]"
              >
                Book din første økt →
              </Link>
            </div>
          )}
        </div>

        {/* Handicap trend (if data exists) */}
        {handicapHistory.length >= 2 && (
          <div className="md:col-span-2 lg:col-span-4 rounded-2xl p-6 bg-white border border-[#EBE5DA]">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#16a34a]" />
                <h2 className="font-semibold text-[#0F2950]">Handicap-utvikling</h2>
              </div>
              <Link
                href="/portal/statistikk"
                className="text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all cursor-pointer text-[#B8975C]"
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
                    <span className="text-xs font-medium text-[#0F2950]">
                      {entry.handicapIndex.toFixed(1)}
                    </span>
                    <div
                      className="w-full rounded-t-md transition-all"
                      style={{
                        height: `${height}%`,
                        background: idx === handicapHistory.length - 1
                          ? "#B8975C"
                          : "rgba(184,151,92,0.4)",
                      }}
                    />
                    <span className="text-[10px] text-[#9CA3AF]">
                      {format(entry.date, "MMM", { locale: nb })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile CTA */}
      <div className="sm:hidden">
        <Link
          href="/portal/bookinger/ny"
          className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl text-sm font-semibold bg-[#B8975C] text-white hover:brightness-110 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Book time
        </Link>
      </div>
    </div>
  );
}
