import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { StatsCard } from "@/components/coach/dashboard/StatsCard";
import { RecentSessions } from "@/components/coach/dashboard/RecentSessions";
import { CalendarCheck, Clock, Users, BookOpen } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";

export default async function CoachDashboardPage() {
  const user = await requirePortalUser();

  // Finn instruktør-profilen knyttet til denne brukeren
  const instructor = await prisma.instructor.findUnique({
    where: { userId: user.id },
    select: { id: true },
  });

  const instructorId = instructor?.id;
  const today = new Date();

  const [playerCount, pendingCount, todayBookings, recentSessions] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT" } }),
      instructorId
        ? prisma.booking.count({
            where: { instructorId, status: "PENDING" },
          })
        : Promise.resolve(0),
      instructorId
        ? prisma.booking.count({
            where: {
              instructorId,
              startTime: {
                gte: startOfDay(today),
                lte: endOfDay(today),
              },
              status: { in: ["CONFIRMED", "COMPLETED"] },
            },
          })
        : Promise.resolve(0),
      instructorId
        ? prisma.coachingSession.findMany({
            where: { instructorId },
            orderBy: { sessionDate: "desc" },
            take: 5,
            include: {
              User: { select: { name: true } },
            },
          })
        : Promise.resolve([]),
    ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          God morgen, {user.name?.split(" ")[0] || "Coach"}
        </h1>
        <p className="text-[var(--color-grey-400)] mt-1">
          Her er oversikten din for i dag
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Ventende bookinger"
          value={pendingCount}
          icon={
            <Clock className="h-5 w-5 text-[var(--color-grey-500)]" />
          }
        />
        <StatsCard
          title="Timer i dag"
          value={todayBookings}
          icon={
            <CalendarCheck className="h-5 w-5 text-[var(--color-grey-500)]" />
          }
        />
        <StatsCard
          title="Siste økter"
          value={recentSessions.length}
          subtitle="Siste 5 coaching-økter"
          icon={
            <BookOpen className="h-5 w-5 text-[var(--color-grey-500)]" />
          }
        />
        <StatsCard
          title="Aktive spillere"
          value={playerCount}
          icon={
            <Users className="h-5 w-5 text-[var(--color-grey-500)]" />
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentSessions sessions={recentSessions} />
      </div>
    </div>
  );
}
