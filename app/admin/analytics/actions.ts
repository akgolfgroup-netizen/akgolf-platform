"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

// ── Types ──────────────────────────────────────────────

export type AnalyticsPeriod = "week" | "month" | "quarter";

export interface AnalyticsData {
  periodLabel: string;
  previousPeriodLabel: string;

  // Students
  newStudents: number;
  activeStudents: number;
  churnedStudents: number;

  // Bookings
  totalBookings: number;
  completedBookings: number;
  bookingRate: number;
  noShowCount: number;

  // Revenue (kroner)
  revenue: number;
  revenueGrowth: number;
  avgRevenuePerStudent: number;

  // HCP
  avgHcpImprovement: number;
  topImprovers: { name: string; hcpChange: number }[];

  // Weekly breakdowns
  weeklyRevenue: { week: string; amount: number }[];
  weeklyBookings: { week: string; count: number }[];
}

// ── Auth guard ─────────────────────────────────────────

async function requireStaffUser() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

// ── Period helpers ─────────────────────────────────────

function getPeriodRange(period: AnalyticsPeriod): {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
  label: string;
  prevLabel: string;
  weeks: number;
} {
  const now = new Date();
  const end = new Date(now);
  let start: Date;
  let weeks: number;
  let label: string;

  switch (period) {
    case "week":
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      weeks = 1;
      label = "Denne uken";
      break;
    case "quarter":
      start = new Date(now);
      start.setDate(now.getDate() - 90);
      weeks = 13;
      label = "Dette kvartalet";
      break;
    case "month":
    default:
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      weeks = 4;
      label = "Denne maneden";
      break;
  }

  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start);
  const prevStart = new Date(prevEnd.getTime() - duration);

  return {
    start,
    end,
    prevStart,
    prevEnd,
    label,
    prevLabel: "forrige periode",
    weeks,
  };
}

// ── Main analytics query ───────────────────────────────

export async function getAnalyticsData(
  period: AnalyticsPeriod = "month"
): Promise<AnalyticsData> {
  await requireStaffUser();

  const { start, end, prevStart, prevEnd, label, prevLabel, weeks } =
    getPeriodRange(period);

  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [
    activeStudents,
    newStudents,
    churnedStudents,
    totalBookings,
    completedBookings,
    noShowCount,
    currentRevenue,
    previousRevenue,
  ] = await Promise.all([
    // Aktive elever: har booking i perioden
    prisma.user.count({
      where: {
        role: "STUDENT",
        isActive: true,
        Booking: {
          some: {
            startTime: { gte: start, lt: end },
            status: { in: ["CONFIRMED", "COMPLETED"] },
          },
        },
      },
    }),

    // Nye elever i perioden
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: { gte: start, lt: end },
      },
    }),

    // Churnet: aktive i forrige periode men ikke denne
    prisma.user.count({
      where: {
        role: "STUDENT",
        isActive: true,
        Booking: {
          some: {
            startTime: { gte: prevStart, lt: prevEnd },
            status: { in: ["CONFIRMED", "COMPLETED"] },
          },
          none: {
            startTime: { gte: start, lt: end },
            status: { in: ["CONFIRMED", "COMPLETED"] },
          },
        },
      },
    }),

    // Totale bookinger i perioden
    prisma.booking.count({
      where: {
        startTime: { gte: start, lt: end },
      },
    }),

    // Fullforte bookinger
    prisma.booking.count({
      where: {
        startTime: { gte: start, lt: end },
        status: "COMPLETED",
      },
    }),

    // No-shows
    prisma.booking.count({
      where: {
        startTime: { gte: start, lt: end },
        status: "NO_SHOW",
      },
    }),

    // Omsetning i perioden (kroner)
    prisma.paymentTransaction.aggregate({
      where: {
        status: "PAID",
        paidAt: { gte: start, lt: end },
      },
      _sum: { grossAmount: true },
    }),

    // Omsetning forrige periode
    prisma.paymentTransaction.aggregate({
      where: {
        status: "PAID",
        paidAt: { gte: prevStart, lt: prevEnd },
      },
      _sum: { grossAmount: true },
    }),
  ]);

  const revenue = currentRevenue._sum.grossAmount ?? 0;
  const prevRevenue = previousRevenue._sum.grossAmount ?? 0;
  const revenueGrowth =
    prevRevenue > 0
      ? ((revenue - prevRevenue) / prevRevenue) * 100
      : 0;
  const bookingRate =
    totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
  const avgRevenuePerStudent =
    activeStudents > 0 ? revenue / activeStudents : 0;

  // ── Weekly breakdowns ──────────────────────────────────

  const weeklyRevenue: { week: string; amount: number }[] = [];
  const weeklyBookings: { week: string; count: number }[] = [];

  for (let i = 0; i < weeks; i++) {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);

    if (weekEnd > end) weekEnd.setTime(end.getTime());

    const weekLabel = `Uke ${i + 1}`;

    const [revAgg, bookingCount] = await Promise.all([
      prisma.paymentTransaction.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: weekStart, lt: weekEnd },
        },
        _sum: { grossAmount: true },
      }),
      prisma.booking.count({
        where: {
          startTime: { gte: weekStart, lt: weekEnd },
          status: { in: ["CONFIRMED", "COMPLETED"] },
        },
      }),
    ]);

    weeklyRevenue.push({ week: weekLabel, amount: revAgg._sum.grossAmount ?? 0 });
    weeklyBookings.push({ week: weekLabel, count: bookingCount });
  }

  // ── HCP / top improvers (placeholder — krever handicap-tracking) ──

  const avgHcpImprovement = 0;
  const topImprovers: { name: string; hcpChange: number }[] = [];

  return {
    periodLabel: label,
    previousPeriodLabel: prevLabel,
    newStudents,
    activeStudents,
    churnedStudents,
    totalBookings,
    completedBookings,
    bookingRate,
    noShowCount,
    revenue,
    revenueGrowth,
    avgRevenuePerStudent,
    avgHcpImprovement,
    topImprovers,
    weeklyRevenue,
    weeklyBookings,
  };
}
