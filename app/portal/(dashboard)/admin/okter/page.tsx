import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { OkterClient } from "./okter-client";
import { startOfDay, endOfDay, addDays } from "date-fns";

export const dynamic = "force-dynamic";

export default async function OkterPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const today = startOfDay(new Date());
  const nextWeek = endOfDay(addDays(today, 7));

  // Hent kommende bookinger (for staff: alle instruktørers bookinger)
  const upcomingBookings = await prisma.booking.findMany({
    where: {
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
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
          Coaching-okter
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
          Administrer alle coaching-okter
        </p>
      </div>

      <OkterClient
        upcomingSessions={formattedUpcoming}
        recentSessions={formattedRecent}
      />
    </div>
  );
}
