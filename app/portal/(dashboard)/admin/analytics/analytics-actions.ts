"use server";

import { prisma } from "@/lib/portal/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { subDays, subMonths, startOfMonth, endOfMonth, startOfWeek } from "date-fns";

// ─── Types ───────────────────────────────────────────────────

export interface CoachKPIs {
  activeStudentCount: number;
  avgHcpImprovement: number;
  trainingAdherence: number;
  totalBookingsThisMonth: number;
  totalRevenueThisMonth: number;
  topFocusArea: string | null;
}

export interface StudentOverviewRow {
  id: string;
  name: string;
  image: string | null;
  latestHandicap: number | null;
  handicapChange3m: number | null;
  lastTrainingDate: Date | null;
  planAdherence: { completed: number; total: number };
  biggestSGGap: string | null;
  nextBooking: Date | null;
  lastActiveAt: Date | null;
}

// ─── SG category labels ─────────────────────────────────────

const SG_CATEGORIES: Record<string, string> = {
  sgOffTheTee: "Off the Tee",
  sgApproach: "Approach",
  sgAroundTheGreen: "Around the Green",
  sgPutting: "Putting",
};

// ─── getCoachKPIs ────────────────────────────────────────────

export async function getCoachKPIs(): Promise<CoachKPIs> {
  const now = new Date();
  const sixtyDaysAgo = subDays(now, 60);
  const threeMonthsAgo = subMonths(now, 3);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });

  const [
    activeStudentCount,
    handicapEntries,
    studentsWithLogs,
    totalStudents,
    bookingsThisMonth,
    revenueResult,
    focusAreas,
  ] = await Promise.all([
    // Active students: had a booking in last 60 days
    prisma.user.count({
      where: {
        role: "STUDENT",
        Booking: {
          some: {
            startTime: { gte: sixtyDaysAgo },
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
          },
        },
      },
    }),

    // Handicap entries in the last 3 months for avg improvement
    prisma.handicapEntry.findMany({
      where: { date: { gte: threeMonthsAgo } },
      orderBy: { date: "asc" },
      select: { userId: true, handicapIndex: true, date: true },
    }),

    // Students who logged training this week
    prisma.user.count({
      where: {
        role: "STUDENT",
        TrainingLog: {
          some: { date: { gte: weekStart } },
        },
      },
    }),

    // Total active students (for adherence denominator)
    prisma.user.count({
      where: {
        role: "STUDENT",
        Booking: {
          some: {
            startTime: { gte: sixtyDaysAgo },
            status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] },
          },
        },
      },
    }),

    // Total bookings this month
    prisma.booking.count({
      where: {
        startTime: { gte: monthStart, lte: monthEnd },
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED, BookingStatus.PENDING] },
      },
    }),

    // Total revenue this month from PaymentTransaction
    prisma.paymentTransaction.aggregate({
      _sum: { grossAmount: true },
      where: {
        paidAt: { gte: monthStart, lte: monthEnd },
        status: PaymentStatus.PAID,
      },
    }),

    // Most common focus area from training logs
    prisma.trainingLog.groupBy({
      by: ["focusArea"],
      _count: { focusArea: true },
      where: {
        focusArea: { not: null },
        date: { gte: threeMonthsAgo },
      },
      orderBy: { _count: { focusArea: "desc" } },
      take: 1,
    }),
  ]);

  // Calculate avg handicap improvement across all students
  const userFirstLast = new Map<string, { first: number; last: number }>();
  for (const entry of handicapEntries) {
    const existing = userFirstLast.get(entry.userId);
    if (!existing) {
      userFirstLast.set(entry.userId, {
        first: entry.handicapIndex,
        last: entry.handicapIndex,
      });
    } else {
      existing.last = entry.handicapIndex;
    }
  }

  let totalChange = 0;
  let changeCount = 0;
  for (const [, { first, last }] of userFirstLast) {
    totalChange += first - last; // positive = improvement
    changeCount++;
  }

  const avgHcpImprovement = changeCount > 0 ? totalChange / changeCount : 0;

  const trainingAdherence =
    totalStudents > 0 ? Math.round((studentsWithLogs / totalStudents) * 100) : 0;

  return {
    activeStudentCount,
    avgHcpImprovement: Math.round(avgHcpImprovement * 10) / 10,
    trainingAdherence,
    totalBookingsThisMonth: bookingsThisMonth,
    totalRevenueThisMonth: revenueResult._sum.grossAmount ?? 0,
    topFocusArea: focusAreas[0]?.focusArea ?? null,
  };
}

// ─── getStudentOverview ──────────────────────────────────────

export async function getStudentOverview(): Promise<StudentOverviewRow[]> {
  const now = new Date();
  const threeMonthsAgo = subMonths(now, 3);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      Booking: { some: {} },
    },
    select: {
      id: true,
      name: true,
      image: true,
      lastActiveAt: true,
      HandicapEntry: {
        orderBy: { date: "desc" },
        take: 1,
        select: { handicapIndex: true },
      },
      Booking: {
        where: {
          startTime: { gte: now },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        },
        orderBy: { startTime: "asc" },
        take: 1,
        select: { startTime: true },
      },
      TrainingLog: {
        orderBy: { date: "desc" },
        take: 1,
        select: { date: true },
      },
      RoundStats: {
        orderBy: { date: "desc" },
        take: 5,
        select: {
          sgOffTheTee: true,
          sgApproach: true,
          sgAroundTheGreen: true,
          sgPutting: true,
        },
      },
    },
  });

  // Get handicap entries from 3 months ago for each student
  const studentIds = students.map((s) => s.id);
  const [oldHandicaps, trainingPlanData] = await Promise.all([
    prisma.handicapEntry.findMany({
      where: {
        userId: { in: studentIds },
        date: { lte: threeMonthsAgo },
      },
      orderBy: { date: "desc" },
      distinct: ["userId"],
      select: { userId: true, handicapIndex: true },
    }),
    // Training plan sessions this month for adherence
    prisma.trainingPlanSession.findMany({
      where: {
        TrainingPlanWeek: {
          TrainingPlan: {
            studentId: { in: studentIds },
            isActive: true,
            startDate: { lte: monthEnd },
            endDate: { gte: monthStart },
          },
        },
      },
      select: {
        id: true,
        TrainingLog: { select: { id: true } },
        TrainingPlanWeek: {
          select: {
            TrainingPlan: { select: { studentId: true } },
          },
        },
      },
    }),
  ]);

  const oldHcpMap = new Map<string, number>();
  for (const h of oldHandicaps) {
    oldHcpMap.set(h.userId, h.handicapIndex);
  }

  // Build adherence map: studentId -> { completed, total }
  const adherenceMap = new Map<string, { completed: number; total: number }>();
  for (const session of trainingPlanData) {
    const studentId = session.TrainingPlanWeek.TrainingPlan.studentId;
    const existing = adherenceMap.get(studentId) ?? { completed: 0, total: 0 };
    existing.total++;
    if (session.TrainingLog.length > 0) {
      existing.completed++;
    }
    adherenceMap.set(studentId, existing);
  }

  return students.map((s) => {
    const latestHcp = s.HandicapEntry[0]?.handicapIndex ?? null;
    const oldHcp = oldHcpMap.get(s.id) ?? null;
    const handicapChange3m =
      latestHcp !== null && oldHcp !== null
        ? Math.round((latestHcp - oldHcp) * 10) / 10
        : null;

    // Find weakest SG category from recent rounds
    let biggestSGGap: string | null = null;
    if (s.RoundStats.length > 0) {
      const avgSG: Record<string, { sum: number; count: number }> = {};
      for (const round of s.RoundStats) {
        for (const [key, label] of Object.entries(SG_CATEGORIES)) {
          const val = round[key as keyof typeof round] as number | null;
          if (val !== null) {
            if (!avgSG[key]) avgSG[key] = { sum: 0, count: 0 };
            avgSG[key].sum += val;
            avgSG[key].count++;
          }
        }
      }
      let worstKey: string | null = null;
      let worstAvg = Infinity;
      for (const [key, { sum, count }] of Object.entries(avgSG)) {
        const avg = sum / count;
        if (avg < worstAvg) {
          worstAvg = avg;
          worstKey = key;
        }
      }
      biggestSGGap = worstKey ? SG_CATEGORIES[worstKey] : null;
    }

    return {
      id: s.id,
      name: s.name ?? "Ukjent",
      image: s.image,
      latestHandicap: latestHcp,
      handicapChange3m,
      lastTrainingDate: s.TrainingLog[0]?.date ?? null,
      planAdherence: adherenceMap.get(s.id) ?? { completed: 0, total: 0 },
      biggestSGGap,
      nextBooking: s.Booking[0]?.startTime ?? null,
      lastActiveAt: s.lastActiveAt,
    };
  });
}
