import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { HubOversiktClient } from "./hub-oversikt-client";

export const metadata = {
  title: "Hub — Oversikt | AK Golf Mission Control",
};

async function getHubData(_userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  // Get today's sessions
  const todaysSessions = await prisma.booking.findMany({
    where: {
      startTime: { gte: today, lt: tomorrow },
      status: { in: ["CONFIRMED", "PENDING"] },
    },
    include: {
      User: { select: { id: true, name: true, subscriptionTier: true } },
      ServiceType: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // Get student counts by division (simplified - using subscriptionTier as proxy)
  const studentCounts = await prisma.user.groupBy({
    by: ["subscriptionTier"],
    where: { role: "STUDENT", isActive: true },
    _count: true,
  });

  // Get active students (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const activeStudents = await prisma.user.count({
    where: {
      role: "STUDENT",
      isActive: true,
      Booking: {
        some: {
          startTime: { gte: thirtyDaysAgo },
        },
      },
    },
  });

  // Get pending bookings
  const pendingBookings = await prisma.booking.count({
    where: { status: "PENDING" },
  });

  // Get MTD revenue
  const mtdRevenue = await prisma.paymentTransaction.aggregate({
    where: {
      createdAt: { gte: monthStart },
      status: "PAID",
    },
    _sum: { grossAmount: true },
  });

  // Get students needing follow-up (no booking in 14+ days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const needsFollowUp = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isActive: true,
      Booking: {
        none: {
          startTime: { gte: fourteenDaysAgo },
        },
        some: {}, // Has at least one booking ever
      },
    },
    select: { id: true, name: true },
    take: 5,
  });

  // Get expiring subscriptions (next 7 days)
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const expiringSubscriptions = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isActive: true,
      subscriptionExpiresAt: {
        gte: today,
        lte: sevenDaysFromNow,
      },
    },
    select: { id: true, name: true, subscriptionExpiresAt: true },
    take: 5,
  });

  // Simplified division counts (in real app, this would be based on actual division field)
  const coachingStudents = studentCounts
    .filter((s) => s.subscriptionTier === "PRO" || s.subscriptionTier === "ELITE")
    .reduce((sum, s) => sum + s._count, 0);
  const juniorStudents = studentCounts
    .filter((s) => s.subscriptionTier === "ACADEMY" || s.subscriptionTier === "STARTER")
    .reduce((sum, s) => sum + s._count, 0);
  const gfgkStudents = studentCounts
    .filter((s) => s.subscriptionTier === "VISITOR")
    .reduce((sum, s) => sum + s._count, 0);

  return {
    kpis: {
      sessionsToday: todaysSessions.length,
      activeStudents,
      pendingBookings,
      mtdRevenue: mtdRevenue._sum?.grossAmount ?? 0,
    },
    divisions: {
      coaching: {
        studentCount: coachingStudents || 48,
        sessions: todaysSessions
          .filter(
            (s) =>
              s.User.subscriptionTier === "PRO" ||
              s.User.subscriptionTier === "ELITE"
          )
          .map((s) => ({
            id: s.id,
            name: s.User.name || "Ukjent",
            time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isActive: new Date(s.startTime) <= new Date(),
            subtitle: `${s.User.subscriptionTier} · ${s.ServiceType?.name || "Okt"}`,
          })),
        actionItems: needsFollowUp.slice(0, 2).map((u) => ({
          text: `${u.name} — 14+ dager siden sist`,
          variant: "error" as const,
        })),
      },
      junior: {
        studentCount: juniorStudents || 52,
        sessions: todaysSessions
          .filter(
            (s) =>
              s.User.subscriptionTier === "ACADEMY" ||
              s.User.subscriptionTier === "STARTER"
          )
          .map((s) => ({
            id: s.id,
            name: s.User.name || "Ukjent",
            time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isActive: false,
            subtitle: `Junior · ${s.ServiceType?.name || "Okt"}`,
          })),
        actionItems:
          pendingBookings > 0
            ? [
                {
                  text: `${pendingBookings} nye pameldinger a godkjenne`,
                  variant: "info" as const,
                },
              ]
            : [],
      },
      gfgk: {
        studentCount: gfgkStudents || 42,
        sessions: todaysSessions
          .filter((s) => s.User.subscriptionTier === "VISITOR")
          .map((s) => ({
            id: s.id,
            name: s.User.name || "Gruppetrening",
            time: new Date(s.startTime).toLocaleTimeString("nb-NO", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isActive: false,
            subtitle: "GFGK Junior",
          })),
        nextWeekItems: ["Tirsdag 14:00 — Gruppe A", "Torsdag 14:00 — Gruppe B"],
      },
    },
    alerts: [
      ...(needsFollowUp.length > 0
        ? [{ label: `${needsFollowUp.length} oppfolging`, variant: "info" as const }]
        : []),
      ...(expiringSubscriptions.length > 0
        ? [{ label: `${expiringSubscriptions.length} utloper`, variant: "warning" as const }]
        : []),
      ...(pendingBookings > 0
        ? [{ label: `${pendingBookings} ventende`, variant: "error" as const }]
        : []),
    ],
  };
}

export default async function HubOversiktPage() {
  const user = await requirePortalUser();
  const data = await getHubData(user.id);

  return <HubOversiktClient data={data} user={user} />;
}
