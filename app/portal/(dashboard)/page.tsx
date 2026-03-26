import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { BookingStatus } from "@prisma/client";
import { format, startOfWeek, endOfWeek, addDays } from "date-fns";
import { nb } from "date-fns/locale";
import Link from "next/link";
import { PORTAL_CONTENT } from "@/lib/website-constants";
import {
  Bell,
  Plus,
  TrendingDown,
  Target,
  Flame,
  Activity,
  Check,
  User,
  Clock,
  CalendarCheck,
  Trophy,
  BookOpen,
  Dumbbell,
  Circle,
  Bed,
  Lock,
} from "lucide-react";

import { WelcomeHeader } from "@/components/portal/home/welcome-header";
import { NextSessionCard } from "@/components/portal/home/next-session-card";
import { QuickActions } from "@/components/portal/home/quick-actions";
import { TrendAlerts, type TrendAlert } from "@/components/portal/home/trend-alerts";
import { KpiStrip } from "@/components/portal/dashboard/kpi-strip";
import { DailyChecklist } from "@/components/portal/dashboard/daily-checklist";
import { WeeklyProgress } from "@/components/portal/dashboard/weekly-progress";

export default async function DashboardPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const userId = user.id;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [nextBooking, activePlan, recentLogs, weekBookings, handicapHistory, achievements] =
    await Promise.all([
      prisma.booking.findFirst({
        where: {
          studentId: userId,
          startTime: { gte: now },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: {
          serviceType: { select: { name: true } },
          instructor: { select: { user: { select: { name: true } } } },
        },
        orderBy: { startTime: "asc" },
      }),

      prisma.trainingPlan.findFirst({
        where: { studentId: userId, isActive: true },
        select: {
          title: true,
          weeks: {
            take: 1,
            orderBy: { weekNumber: "desc" },
            select: {
              sessions: {
                select: { dayOfWeek: true, title: true, durationMinutes: true },
              },
            },
          },
        },
      }),

      prisma.trainingLog.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 7,
        select: {
          id: true,
          date: true,
          focusArea: true,
          durationMinutes: true,
          notes: true,
        },
      }),

      prisma.booking.findMany({
        where: {
          studentId: userId,
          startTime: { gte: weekStart, lte: weekEnd },
          status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        },
        include: {
          serviceType: { select: { name: true } },
          instructor: { select: { user: { select: { name: true } } } },
        },
        orderBy: { startTime: "asc" },
      }),

      prisma.handicapEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 6,
        select: { handicapIndex: true, date: true },
      }),

      prisma.playerAchievement.findMany({
        where: { userId },
        include: { definition: true },
        orderBy: { unlockedAt: "desc" },
        take: 4,
      }),
    ]);

  // Calculate stats
  const currentHcp = handicapHistory[0]?.handicapIndex ?? null;
  const previousHcp = handicapHistory[handicapHistory.length - 1]?.handicapIndex ?? currentHcp;
  const hcpChange = currentHcp && previousHcp ? (previousHcp - currentHcp).toFixed(1) : null;

  const firstName = user.name?.split(" ")[0] ?? "spiller";
  const dateString = format(now, "EEEE d. MMMM", { locale: nb });

  // Weekly training data
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
  const currentWeekSessions = activePlan?.weeks?.[0]?.sessions ?? [];

  // Calculate training streak
  const sortedLogs = recentLogs.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const hasLog = sortedLogs.some(
      (log) =>
        format(new Date(log.date), "yyyy-MM-dd") === format(checkDate, "yyyy-MM-dd")
    );
    if (hasLog) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  // Weekly progress data
  const weeklyProgressData = weekDays.map((day, idx) => {
    const dayDate = addDays(weekStart, idx);
    const isToday = format(dayDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
    const isPast = dayDate < now && !isToday;
    const dayLog = sortedLogs.find(
      (log) => format(new Date(log.date), "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd")
    );

    return {
      dayLabel: day,
      trained: !!dayLog,
      habitsCompleted: dayLog ? 1 : 0,
      mood: isPast ? Math.floor(Math.random() * 2) + 4 : undefined,
      isToday,
    };
  });

  // Daily checklist
  const checklistItems = [
    {
      id: "log",
      label: "Logg dagens treningsokt",
      completed: sortedLogs.some(
        (log) => format(new Date(log.date), "yyyy-MM-dd") === format(now, "yyyy-MM-dd")
      ),
      href: "/portal/dagbok",
    },
    {
      id: "plan",
      label: "Sjekk ukens treningsplan",
      completed: !!activePlan,
      href: "/portal/treningsplan",
    },
    {
      id: "booking",
      label: "Se kommende timer",
      completed: weekBookings.length > 0,
      href: "/portal/bookinger",
    },
  ];

  // Next session for card
  const nextSession = nextBooking
    ? {
        id: nextBooking.id,
        title: nextBooking.serviceType.name,
        date: format(nextBooking.startTime, "yyyy-MM-dd"),
        startTime: format(nextBooking.startTime, "HH:mm"),
        instructor: nextBooking.instructor?.user.name ?? "Anders",
        location: "Sarpsborg Golfklubb",
      }
    : null;

  // Trend alerts (example data - in production, calculate from real trends)
  const alerts: TrendAlert[] = [];

  // KPI items (icon som streng - resolves i KpiStrip client component)
  const kpiItems = [
    {
      label: "Handicap",
      value: currentHcp ?? 0,
      icon: "Target",
      color: "text-gold",
      bg: "bg-gold/10",
    },
    {
      label: "Treningsstreak",
      value: streak,
      icon: "Flame",
      color: "text-orange-500",
      bg: "bg-orange-50",
      suffix: " dager",
    },
    {
      label: "Okter denne mnd",
      value: recentLogs.length,
      icon: "Activity",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Achievements",
      value: achievements.length,
      icon: "Trophy",
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Header */}
      <div className="flex items-center justify-between">
        <WelcomeHeader firstName={firstName} dateString={dateString} />
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#E5E5E5] bg-white text-[#171717] hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <Link
            href="/portal/dagbok"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-gold text-white hover:bg-gold/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Logg okt
          </Link>
        </div>
      </div>

      {/* 2. KPI Strip */}
      <KpiStrip items={kpiItems} />

      {/* 3. Next Session Card */}
      {nextSession && <NextSessionCard session={nextSession} />}

      {/* 4. Trend Alerts */}
      {alerts.length > 0 && <TrendAlerts alerts={alerts} />}

      {/* 5. Quick Actions */}
      <QuickActions />

      {/* 6. Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Checklist */}
          <DailyChecklist items={checklistItems} />

          {/* Weekly Progress */}
          <WeeklyProgress days={weeklyProgressData} />

          {/* Weekly Training Plan */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Ukeplan</span>
              <Link
                href="/portal/treningsplan"
                className="text-xs text-[#737373] hover:text-[#171717] transition-colors"
              >
                Se hele planen
              </Link>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const dayDate = addDays(weekStart, idx);
                const isToday = format(dayDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
                const isPast = dayDate < now && !isToday;
                const planSession = currentWeekSessions.find((s) => s.dayOfWeek === idx + 1);
                const dayBooking = weekBookings.find(
                  (b) => format(b.startTime, "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd")
                );

                return (
                  <div
                    key={day}
                    className={`text-center p-3 rounded-lg border ${
                      isToday
                        ? "border-gold border-2"
                        : isPast
                        ? "bg-green-50 border-green-200"
                        : "border-[#E5E5E5]"
                    } bg-white`}
                  >
                    <p className="text-[11px] text-[#737373] uppercase">{day}</p>
                    <p className="text-lg font-semibold text-[#171717] my-1">
                      {format(dayDate, "d")}
                    </p>
                    <div className="mt-2">
                      {isPast ? (
                        <Check className="w-5 h-5 mx-auto text-green-500" />
                      ) : isToday ? (
                        <Dumbbell className="w-5 h-5 mx-auto text-gold" />
                      ) : dayBooking ? (
                        <User className="w-5 h-5 mx-auto text-blue-500" />
                      ) : planSession ? (
                        <Target className="w-5 h-5 mx-auto text-[#171717]" />
                      ) : idx === 6 ? (
                        <Bed className="w-5 h-5 mx-auto text-[#A3A3A3]" />
                      ) : (
                        <Circle className="w-5 h-5 mx-auto text-[#D4D4D4]" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-3 p-3 rounded-md bg-[#F5F5F5]">
              <p className="text-sm font-medium text-[#171717] mb-1">
                I dag:{" "}
                {currentWeekSessions.find((s) => s.dayOfWeek === now.getDay())?.title ??
                  "Putting-fokus"}
              </p>
              <p className="text-xs text-[#737373]">45 min ovelser - Gate drill, Avstandskontroll</p>
            </div>
          </div>
        </div>

        {/* Right Column - 1/3 */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Kommende okter</span>
              <Link
                href="/portal/bookinger"
                className="text-xs text-[#737373] hover:text-[#171717] transition-colors"
              >
                Se alle
              </Link>
            </div>
            <div className="space-y-2">
              {weekBookings.slice(0, 2).map((booking) => (
                <div key={booking.id} className="flex gap-4 p-3 rounded-lg border border-[#E5E5E5]">
                  <div className="text-center pr-4 border-r border-[#E5E5E5]">
                    <p className="text-xl font-bold text-[#171717]">
                      {format(booking.startTime, "d")}
                    </p>
                    <p className="text-xs text-[#737373] uppercase">
                      {format(booking.startTime, "MMM", { locale: nb })}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-[#171717]">
                      {booking.serviceType.name}
                    </p>
                    <div className="flex gap-4 mt-1 text-xs text-[#737373]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(booking.startTime, "HH:mm")}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {booking.instructor?.user.name ?? "Anders"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {weekBookings.length === 0 && (
                <p className="text-sm text-[#737373] text-center py-4">
                  {PORTAL_CONTENT.dashboard.emptyBookings}
                </p>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Siste aktiviteter</span>
            </div>
            <div className="space-y-0">
              <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F5]">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#171717]">Fullforte treningsokt</p>
                  <p className="text-xs text-[#737373]">I dag, 09:30 - Putting - 45 min</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3 border-b border-[#F5F5F5]">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#171717]">Coaching-okt fullfort</p>
                  <p className="text-xs text-[#737373]">I gar - Med Anders - Naerspill</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <div className="w-9 h-9 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#171717]">Ny achievement last opp!</p>
                  <p className="text-xs text-[#737373]">22. mars - &quot;7-dagers streak&quot;</p>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Achievements</span>
              <span className="px-2 py-1 rounded text-[11px] font-semibold bg-[#F5F5F5] text-[#525252]">
                {achievements.length}/12
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Flame, name: "7-dagers streak", date: "22. mars", unlocked: true, color: "orange" },
                { icon: Target, name: "Forste birdie", date: "15. mars", unlocked: true, color: "green" },
                { icon: BookOpen, name: "10 logger", date: "10. mars", unlocked: true, color: "blue" },
                { icon: Lock, name: "30-dagers streak", date: "Last", unlocked: false, color: "gray" },
              ].map((achievement, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center p-4 rounded-lg border border-[#E5E5E5] ${
                    !achievement.unlocked ? "opacity-50" : ""
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      achievement.unlocked
                        ? achievement.color === "orange"
                          ? "bg-yellow-100"
                          : achievement.color === "green"
                          ? "bg-green-100"
                          : "bg-blue-100"
                        : "bg-[#F5F5F5]"
                    }`}
                  >
                    <achievement.icon
                      className={`w-6 h-6 ${
                        achievement.unlocked
                          ? achievement.color === "orange"
                            ? "text-orange-500"
                            : achievement.color === "green"
                            ? "text-green-500"
                            : "text-blue-500"
                          : "text-[#A3A3A3]"
                      }`}
                    />
                  </div>
                  <p className="text-xs font-medium text-[#171717] text-center">{achievement.name}</p>
                  <p className="text-[11px] text-[#737373]">{achievement.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
