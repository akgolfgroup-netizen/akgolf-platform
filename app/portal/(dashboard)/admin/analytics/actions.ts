"use server";

import { prisma } from "@/lib/portal/prisma";
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  subWeeks,
  subMonths,
  subQuarters,
  format,
} from "date-fns";
import { nb } from "date-fns/locale";
import { BookingStatus } from "@prisma/client";

export type AnalyticsPeriod = "week" | "month" | "quarter";

interface TopImprover {
  name: string;
  hcpChange: number;
}

interface WeeklyDataPoint {
  week: string;
  amount: number;
}

interface WeeklyBookingPoint {
  week: string;
  count: number;
}

export interface AnalyticsData {
  // KPIer
  newStudents: number;
  activeStudents: number;
  churnedStudents: number;

  // Bookinger
  totalBookings: number;
  completedBookings: number;
  noShowCount: number;
  bookingRate: number;

  // Revenue
  revenue: number;
  avgRevenuePerStudent: number;
  revenueGrowth: number;

  // Progresjon
  avgHcpImprovement: number;
  topImprovers: TopImprover[];

  // Trender
  weeklyRevenue: WeeklyDataPoint[];
  weeklyBookings: WeeklyBookingPoint[];

  // Periodeinfo
  periodLabel: string;
  previousPeriodLabel: string;
}

function getPeriodDates(period: AnalyticsPeriod) {
  const now = new Date();

  switch (period) {
    case "week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
        prevStart: startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
        prevEnd: endOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }),
      };
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
        prevStart: startOfMonth(subMonths(now, 1)),
        prevEnd: endOfMonth(subMonths(now, 1)),
      };
    case "quarter":
      return {
        start: startOfQuarter(now),
        end: endOfQuarter(now),
        prevStart: startOfQuarter(subQuarters(now, 1)),
        prevEnd: endOfQuarter(subQuarters(now, 1)),
      };
  }
}

export async function getAnalyticsData(
  period: AnalyticsPeriod = "month"
): Promise<AnalyticsData> {
  const { start, end, prevStart, prevEnd } = getPeriodDates(period);
  const thirtyDaysAgo = subMonths(new Date(), 1);
  const sixtyDaysAgo = subMonths(new Date(), 2);

  // Parallelle spørringer for ytelse
  const [
    newStudentsCount,
    activeStudentsCount,
    churnedStudentsCount,
    currentBookings,
    prevBookings,
    handicapData,
    weeklyData,
  ] = await Promise.all([
    // Nye elever i perioden
    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: { gte: start, lte: end },
      },
    }),

    // Aktive elever (booking siste 30 dager)
    prisma.user.count({
      where: {
        role: "STUDENT",
        Booking: {
          some: {
            startTime: { gte: thirtyDaysAgo },
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
          },
        },
      },
    }),

    // Churnede elever (ingen booking siste 60 dager, men hadde før)
    prisma.user.count({
      where: {
        role: "STUDENT",
        Booking: {
          some: {
            startTime: { lt: sixtyDaysAgo },
          },
          none: {
            startTime: { gte: sixtyDaysAgo },
          },
        },
      },
    }),

    // Bookinger i perioden
    prisma.booking.findMany({
      where: {
        startTime: { gte: start, lte: end },
      },
      include: {
        ServiceType: { select: { price: true } },
      },
    }),

    // Bookinger i forrige periode (for sammenligning)
    prisma.booking.findMany({
      where: {
        startTime: { gte: prevStart, lte: prevEnd },
      },
      include: {
        ServiceType: { select: { price: true } },
      },
    }),

    // Handicap-endringer for top improvers
    prisma.handicapEntry.findMany({
      where: {
        date: { gte: start, lte: end },
      },
      include: {
        User: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    }),

    // Ukentlige bookinger for chart (siste 8 uker)
    getWeeklyStats(),
  ]);

  // Booking-statistikk
  const totalBookings = currentBookings.length;
  const completedBookings = currentBookings.filter(
    (b) => b.status === BookingStatus.COMPLETED
  ).length;
  const noShowCount = currentBookings.filter(
    (b) => b.status === BookingStatus.NO_SHOW
  ).length;

  // Revenue
  const isValidStatus = (status: BookingStatus) =>
    status === BookingStatus.CONFIRMED || status === BookingStatus.COMPLETED;
  const revenue = currentBookings
    .filter((b) => isValidStatus(b.status))
    .reduce((sum, b) => sum + (b.ServiceType?.price ?? 0), 0);

  const prevRevenue = prevBookings
    .filter((b) => isValidStatus(b.status))
    .reduce((sum, b) => sum + (b.ServiceType?.price ?? 0), 0);

  const revenueGrowth =
    prevRevenue > 0 ? ((revenue - prevRevenue) / prevRevenue) * 100 : 0;

  // Gjennomsnittlig revenue per aktiv elev
  const avgRevenuePerStudent =
    activeStudentsCount > 0 ? revenue / activeStudentsCount : 0;

  // Booking rate (fullført / totalt)
  const bookingRate =
    totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  // Handicap-forbedring
  const userHandicaps = new Map<
    string,
    { first: number; last: number; name: string }
  >();
  for (const entry of handicapData) {
    const userId = entry.User.id;
    const existing = userHandicaps.get(userId);
    if (!existing) {
      userHandicaps.set(userId, {
        first: entry.handicapIndex,
        last: entry.handicapIndex,
        name: entry.User.name ?? "Ukjent",
      });
    } else {
      existing.first = entry.handicapIndex; // Eldre data kommer senere pga orderBy desc
    }
  }

  const improvements: TopImprover[] = [];
  let totalImprovement = 0;
  for (const [, data] of userHandicaps) {
    const change = data.first - data.last; // Positiv = forbedring (lavere HCP)
    if (change > 0) {
      totalImprovement += change;
      improvements.push({ name: data.name, hcpChange: change });
    }
  }

  const avgHcpImprovement =
    improvements.length > 0 ? totalImprovement / improvements.length : 0;
  const topImprovers = improvements
    .sort((a, b) => b.hcpChange - a.hcpChange)
    .slice(0, 5);

  // Periode-labels
  const periodLabels = {
    week: `Uke ${format(start, "w", { locale: nb })}`,
    month: format(start, "MMMM yyyy", { locale: nb }),
    quarter: `Q${Math.ceil((start.getMonth() + 1) / 3)} ${start.getFullYear()}`,
  };

  const prevPeriodLabels = {
    week: `Uke ${format(prevStart, "w", { locale: nb })}`,
    month: format(prevStart, "MMMM yyyy", { locale: nb }),
    quarter: `Q${Math.ceil((prevStart.getMonth() + 1) / 3)} ${prevStart.getFullYear()}`,
  };

  return {
    newStudents: newStudentsCount,
    activeStudents: activeStudentsCount,
    churnedStudents: churnedStudentsCount,
    totalBookings,
    completedBookings,
    noShowCount,
    bookingRate,
    revenue,
    avgRevenuePerStudent,
    revenueGrowth,
    avgHcpImprovement,
    topImprovers,
    weeklyRevenue: weeklyData.revenue,
    weeklyBookings: weeklyData.bookings,
    periodLabel: periodLabels[period],
    previousPeriodLabel: prevPeriodLabels[period],
  };
}

async function getWeeklyStats() {
  const weeks: { start: Date; end: Date; label: string }[] = [];
  const now = new Date();

  for (let i = 7; i >= 0; i--) {
    const weekStart = startOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(subWeeks(now, i), { weekStartsOn: 1 });
    weeks.push({
      start: weekStart,
      end: weekEnd,
      label: `Uke ${format(weekStart, "w")}`,
    });
  }

  const allBookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: weeks[0].start, lte: weeks[weeks.length - 1].end },
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
    },
    include: {
      ServiceType: { select: { price: true } },
    },
  });

  const revenue: WeeklyDataPoint[] = [];
  const bookings: WeeklyBookingPoint[] = [];

  for (const week of weeks) {
    const weekBookings = allBookings.filter(
      (b) => b.startTime >= week.start && b.startTime <= week.end
    );
    const weekRevenue = weekBookings.reduce(
      (sum, b) => sum + (b.ServiceType?.price ?? 0),
      0
    );

    revenue.push({ week: week.label, amount: weekRevenue });
    bookings.push({ week: week.label, count: weekBookings.length });
  }

  return { revenue, bookings };
}
