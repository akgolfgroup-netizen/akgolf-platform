"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { startOfWeek, endOfWeek, format } from "date-fns";
import { nb } from "date-fns/locale";
import { BookingStatus, PaymentStatus } from "@prisma/client";

// ── Types ──────────────────────────────────────────────────────────────

export type WeekBooking = {
  id: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  amount: number;
  student: {
    id: string;
    name: string | null;
    image: string | null;
  };
  instructor: {
    name: string | null;
  };
  service: {
    name: string;
    duration: number;
    color: string | null;
  };
};

export type WeekStats = {
  totalBookings: number;
  uniqueStudents: number;
  confirmedBookings: number;
  weeklyRevenue: number;
  weekLabel: string;
};

// ── Data fetching ──────────────────────────────────────────────────────

export async function getThisWeekBookings(): Promise<WeekBooking[]> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) return [];

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const bookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: weekStart, lte: weekEnd },
      status: { not: BookingStatus.CANCELLED },
    },
    orderBy: { startTime: "asc" },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      status: true,
      amount: true,
      User: {
        select: { id: true, name: true, image: true },
      },
      Instructor: {
        select: {
          User: { select: { name: true } },
        },
      },
      ServiceType: {
        select: { name: true, duration: true, color: true },
      },
    },
  });

  return bookings.map((b) => ({
    id: b.id,
    startTime: b.startTime,
    endTime: b.endTime,
    status: b.status,
    amount: b.amount,
    student: {
      id: b.User.id,
      name: b.User.name,
      image: b.User.image,
    },
    instructor: {
      name: b.Instructor?.User?.name ?? "Ukjent",
    },
    service: {
      name: b.ServiceType.name,
      duration: b.ServiceType.duration,
      color: b.ServiceType.color,
    },
  }));
}

export async function getWeekStats(): Promise<WeekStats> {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return {
      totalBookings: 0,
      uniqueStudents: 0,
      confirmedBookings: 0,
      weeklyRevenue: 0,
      weekLabel: "",
    };
  }

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const [bookings, payments] = await Promise.all([
    prisma.booking.findMany({
      where: {
        startTime: { gte: weekStart, lte: weekEnd },
        status: { not: BookingStatus.CANCELLED },
      },
      select: {
        id: true,
        studentId: true,
        status: true,
      },
    }),
    prisma.paymentTransaction.aggregate({
      where: {
        status: PaymentStatus.PAID,
        paidAt: { gte: weekStart, lte: weekEnd },
      },
      _sum: { netAmount: true },
    }),
  ]);

  const uniqueStudentIds = new Set(bookings.map((b) => b.studentId));
  const confirmed = bookings.filter(
    (b) => b.status === BookingStatus.CONFIRMED || b.status === BookingStatus.COMPLETED
  ).length;

  const weekLabel = `${format(weekStart, "d.", { locale: nb })} - ${format(weekEnd, "d. MMMM", { locale: nb })}`;

  return {
    totalBookings: bookings.length,
    uniqueStudents: uniqueStudentIds.size,
    confirmedBookings: confirmed,
    weeklyRevenue: payments._sum.netAmount ?? 0,
    weekLabel,
  };
}
