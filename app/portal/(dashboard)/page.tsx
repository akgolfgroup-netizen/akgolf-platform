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
  PlusCircle,
  CalendarPlus,
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

export default async function DashboardPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const userId = user.id;
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [nextBooking, activePlan, recentLogs, weekBookings, handicapHistory, achievements] =
    await Promise.all([
      // Next upcoming booking
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

      // Active training plan
      prisma.trainingPlan.findFirst({
        where: { studentId: userId, isActive: true },
        select: {
          title: true,
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

      // Recent training logs
      prisma.trainingLog.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 3,
        select: {
          id: true,
          date: true,
          focusArea: true,
          durationMinutes: true,
          notes: true,
        },
      }),

      // This week's bookings
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

      // Handicap history
      prisma.handicapEntry.findMany({
        where: { userId },
        orderBy: { date: "desc" },
        take: 6,
        select: { handicapIndex: true, date: true },
      }),

      // Player achievements
      prisma.playerAchievement.findMany({
        where: { userId },
        include: { definition: true },
        orderBy: { unlockedAt: "desc" },
        take: 4,
      }),
    ]);

  // Calculate handicap
  const currentHcp = handicapHistory[0]?.handicapIndex ?? null;
  const previousHcp = handicapHistory[handicapHistory.length - 1]?.handicapIndex ?? currentHcp;
  const hcpChange = currentHcp && previousHcp ? (previousHcp - currentHcp).toFixed(1) : null;

  // Week days for training plan
  const weekDays = ["Man", "Tir", "Ons", "Tor", "Fre", "Lor", "Son"];
  const currentWeekSessions = activePlan?.weeks?.[0]?.sessions ?? [];

  // Calculate days until next booking
  const daysUntil = nextBooking
    ? Math.ceil((new Date(nextBooking.startTime).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {PORTAL_CONTENT.dashboard.welcomeTemplate.replace("{name}", user.name?.split(" ")[0] ?? "spiller")}
          </h1>
          <p className="text-sm text-[#737373] mt-1">
            Her er din oversikt for {format(now, "EEEE d. MMMM", { locale: nb })}.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-lg flex items-center justify-center border border-[#333] bg-white text-[#171717] hover:bg-gray-100 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <Link
            href="/portal/dagbok"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-[#171717] text-white border border-[#333] hover:bg-[#262626] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Logg okt
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/portal/dagbok"
          className="flex items-center gap-3 p-4 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#171717] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-[#171717]" />
          </div>
          <span className="text-sm font-medium text-[#171717]">Logg treningsokt</span>
        </Link>
        <Link
          href="/portal/bookinger/ny"
          className="flex items-center gap-3 p-4 rounded-lg bg-white border border-[#E5E5E5] hover:border-[#171717] transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-[#F5F5F5] flex items-center justify-center">
            <CalendarPlus className="w-5 h-5 text-[#171717]" />
          </div>
          <span className="text-sm font-medium text-[#171717]">Book ny time</span>
        </Link>
      </div>

      {/* Next Session Card */}
      {nextBooking && (
        <div className="rounded-xl p-6 bg-[#171717] text-white">
          <p className="text-xs text-[#A3A3A3] uppercase tracking-widest mb-2">Neste okt</p>
          <h2 className="text-xl font-semibold mb-1">
            {nextBooking.serviceType.name} med {nextBooking.instructor?.user.name ?? "Anders"}
          </h2>
          <p className="text-base text-[#D4D4D4] mb-4">
            {format(nextBooking.startTime, "EEEE d. MMMM 'kl.' HH:mm", { locale: nb })}
            {" - "}
            {format(new Date(nextBooking.startTime.getTime() + 60 * 60 * 1000), "HH:mm")}
          </p>
          <div className="flex gap-6">
            <div>
              <p className="text-[11px] text-[#A3A3A3]">Lokasjon</p>
              <p className="text-sm">Sarpsborg Golfklubb</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A3A3A3]">Fokusomrade</p>
              <p className="text-sm">Naerspill</p>
            </div>
            <div>
              <p className="text-[11px] text-[#A3A3A3]">Om</p>
              <p className="text-sm">{daysUntil} {daysUntil === 1 ? "dag" : "dager"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#737373]">Handicap</span>
            <TrendingDown className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-[28px] font-bold text-[#171717]">
            {currentHcp?.toFixed(1) ?? "—"}
          </p>
          {hcpChange && parseFloat(hcpChange) > 0 && (
            <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
              <TrendingDown className="w-3 h-3" />
              -{hcpChange} siste mnd
            </p>
          )}
        </div>

        <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#737373]">Maloppnaelse</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-[28px] font-bold text-[#171717]">68%</p>
          <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
            +5% denne uken
          </p>
        </div>

        <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#737373]">Treningsstreak</span>
            <Flame className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-[28px] font-bold text-[#171717]">7 dager</p>
          <p className="text-xs text-green-500 mt-1">Personlig rekord!</p>
        </div>

        <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[#737373]">Okter denne mnd</span>
            <Activity className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-[28px] font-bold text-[#171717]">
            {recentLogs.length > 0 ? recentLogs.length : 12}
          </p>
          <p className="text-xs text-[#737373] mt-1">av 15 planlagt</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Weekly Training Plan */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Ukeplan</span>
              <Link
                href="/portal/treningsplan"
                className="text-xs text-[#737373] hover:text-[#171717] transition-colors"
              >
                Se hele planen →
              </Link>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((day, idx) => {
                const dayDate = addDays(weekStart, idx);
                const isToday = format(dayDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
                const isPast = dayDate < now && !isToday;
                const planSession = currentWeekSessions.find(s => s.dayOfWeek === idx + 1);
                const dayBooking = weekBookings.find(
                  b => format(b.startTime, "yyyy-MM-dd") === format(dayDate, "yyyy-MM-dd")
                );

                return (
                  <div
                    key={day}
                    className={`text-center p-3 rounded-lg border ${
                      isToday
                        ? "border-[#171717] border-2"
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
                        <Dumbbell className="w-5 h-5 mx-auto text-[#171717]" />
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
                I dag: {currentWeekSessions.find(s => s.dayOfWeek === now.getDay())?.title ?? "Putting-fokus"}
              </p>
              <p className="text-xs text-[#737373]">45 min ovelser - Gate drill, Avstandskontroll</p>
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
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Upcoming Sessions */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Kommende okter</span>
              <Link
                href="/portal/bookinger"
                className="text-xs text-[#737373] hover:text-[#171717] transition-colors"
              >
                Se alle →
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
                    <p className="font-semibold text-sm text-[#171717]">{booking.serviceType.name}</p>
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
