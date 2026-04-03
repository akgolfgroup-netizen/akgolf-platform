import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { RapporterClient } from "./rapporter-client";

export const metadata = {
  title: "Rapporter | AK Golf Mission Control",
};

async function getReportData() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  // Total students
  const totalStudents = await prisma.user.count({
    where: { role: "STUDENT", isActive: true },
  });

  // New students last 30 days
  const newStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      createdAt: { gte: thirtyDaysAgo },
    },
  });

  // Active students (booked in last 30 days)
  const activeStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      isActive: true,
      Booking: { some: { startTime: { gte: thirtyDaysAgo } } },
    },
  });

  // Retention rate (students active in both periods)
  const retainedStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      isActive: true,
      Booking: {
        some: {
          AND: [
            { startTime: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
          ],
        },
      },
    },
  });

  // Sessions completed
  const completedSessions = await prisma.booking.count({
    where: {
      status: "COMPLETED",
      startTime: { gte: thirtyDaysAgo },
    },
  });

  // Cancelled sessions
  const cancelledSessions = await prisma.booking.count({
    where: {
      status: "CANCELLED",
      startTime: { gte: thirtyDaysAgo },
    },
  });

  // Average handicap improvement (mock - would need actual tracking)
  const handicapImprovement = -1.2; // Mock data

  // Get booking trends by week
  const bookingTrends = await prisma.$queryRaw<{ week: string; count: bigint }[]>`
    SELECT
      DATE_TRUNC('week', "startTime") as week,
      COUNT(*) as count
    FROM "Booking"
    WHERE "startTime" >= ${thirtyDaysAgo}
      AND status IN ('CONFIRMED', 'COMPLETED')
    GROUP BY DATE_TRUNC('week', "startTime")
    ORDER BY week DESC
    LIMIT 4
  `;

  // Subscription tier distribution
  const tierDistribution = await prisma.user.groupBy({
    by: ["subscriptionTier"],
    where: { role: "STUDENT", isActive: true },
    _count: true,
  });

  return {
    totalStudents,
    newStudents,
    activeStudents,
    retentionRate: retainedStudents > 0 ? Math.round((activeStudents / retainedStudents) * 100) : 0,
    completedSessions,
    cancelledSessions,
    cancellationRate: completedSessions + cancelledSessions > 0
      ? Math.round((cancelledSessions / (completedSessions + cancelledSessions)) * 100)
      : 0,
    handicapImprovement,
    bookingTrends: bookingTrends.map((t) => ({
      week: new Date(t.week).toLocaleDateString("nb-NO", { day: "numeric", month: "short" }),
      count: Number(t.count),
    })),
    tierDistribution: tierDistribution.map((t) => ({
      tier: t.subscriptionTier,
      count: t._count,
    })),
  };
}

export default async function RapporterPage() {
  const user = await requirePortalUser();

  if (!isAdmin(user.role)) {
    redirect("/portal/admin");
  }

  const data = await getReportData();

  return <RapporterClient data={data} />;
}
