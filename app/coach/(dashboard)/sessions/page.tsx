import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { SessionsClient } from "./sessions-client";
import { startOfDay, endOfDay, addDays } from "date-fns";

export default async function SessionsPage() {
  const user = await requirePortalUser();

  const today = startOfDay(new Date());
  const nextWeek = endOfDay(addDays(today, 7));

  // Hent kommende bookinger
  const upcomingBookings = await prisma.booking.findMany({
    where: {
      instructorId: user.id,
      startTime: {
        gte: today,
        lte: nextWeek,
      },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          HandicapEntry: {
            orderBy: { date: "desc" },
            take: 1,
            select: { handicapIndex: true },
          },
        },
      },
      ServiceType: {
        select: {
          name: true,
          duration: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  // Hent nylig fullforte okter
  const recentSessions = await prisma.booking.findMany({
    where: {
      instructorId: user.id,
      status: "COMPLETED",
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
        },
      },
      ServiceType: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { startTime: "desc" },
    take: 10,
  });

  const formattedUpcoming = upcomingBookings.map((b) => ({
    id: b.id,
    studentName: b.User?.name || "Ukjent",
    studentId: b.User?.id || "",
    studentHandicap: b.User?.HandicapEntry[0]?.handicapIndex ?? null,
    serviceName: b.ServiceType?.name || "Ukjent",
    duration: b.ServiceType?.duration || 60,
    startTime: b.startTime,
    status: b.status,
  }));

  const formattedRecent = recentSessions.map((b) => ({
    id: b.id,
    studentName: b.User?.name || "Ukjent",
    studentId: b.User?.id || "",
    serviceName: b.ServiceType?.name || "Ukjent",
    completedAt: b.startTime,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Coaching-okter</h1>
        <p className="text-[var(--color-ink-40)] mt-1">
          Administrer dine coaching-okter
        </p>
      </div>

      <SessionsClient
        upcomingSessions={formattedUpcoming}
        recentSessions={formattedRecent}
      />
    </div>
  );
}
