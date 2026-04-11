"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { format } from "date-fns";
import { nb } from "date-fns/locale";

export interface ReportData {
  totalStudents: number;
  newStudents: number;
  activeStudents: number;
  retentionRate: number;
  completedSessions: number;
  cancelledSessions: number;
  cancellationRate: number;
  handicapImprovement: number;
  bookingTrends: { week: string; count: number }[];
  tierDistribution: { tier: string; count: number }[];
}

interface CsvResult {
  csv: string;
  filename: string;
}

async function requireStaff() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/");
  return user;
}

export async function generateReport(
  from: string,
  to: string
): Promise<ReportData> {
  await requireStaff();

  const fromDate = new Date(from);
  const toDate = new Date(to);
  const thirtyDaysAgo = new Date(toDate);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Parallelle queries
  const [
    totalStudents,
    newStudents,
    activeStudentIds,
    completedSessions,
    cancelledSessions,
    tierGroups,
    weeklyBookings,
  ] = await Promise.all([
    prisma.user.count({
      where: { role: "STUDENT" },
    }),

    prisma.user.count({
      where: {
        role: "STUDENT",
        createdAt: { gte: thirtyDaysAgo, lte: toDate },
      },
    }),

    prisma.booking.findMany({
      where: {
        startTime: { gte: thirtyDaysAgo, lte: toDate },
        status: { in: ["CONFIRMED", "COMPLETED"] },
      },
      select: { studentId: true },
      distinct: ["studentId"],
    }),

    prisma.booking.count({
      where: {
        startTime: { gte: fromDate, lte: toDate },
        status: "COMPLETED",
      },
    }),

    prisma.booking.count({
      where: {
        startTime: { gte: fromDate, lte: toDate },
        status: "CANCELLED",
      },
    }),

    prisma.user.groupBy({
      by: ["subscriptionTier"],
      where: { role: "STUDENT" },
      _count: true,
    }),

    prisma.booking.groupBy({
      by: ["startTime"],
      where: {
        startTime: { gte: fromDate, lte: toDate },
        status: { in: ["CONFIRMED", "COMPLETED", "PENDING"] },
      },
      _count: true,
    }),
  ]);

  const activeStudents = activeStudentIds.length;
  const totalSessions = completedSessions + cancelledSessions;
  const cancellationRate =
    totalSessions > 0
      ? Math.round((cancelledSessions / totalSessions) * 100)
      : 0;
  const retentionRate =
    totalStudents > 0
      ? Math.round((activeStudents / totalStudents) * 100)
      : 0;

  // Grupper bookinger per uke
  const weekMap = new Map<string, number>();
  for (const b of weeklyBookings) {
    const weekStart = getWeekStart(new Date(b.startTime));
    const key = format(weekStart, "d. MMM", { locale: nb });
    weekMap.set(key, (weekMap.get(key) ?? 0) + b._count);
  }
  const bookingTrends = Array.from(weekMap.entries())
    .map(([week, count]) => ({ week, count }))
    .slice(-8);

  const tierDistribution = tierGroups.map((g) => ({
    tier: g.subscriptionTier,
    count: g._count,
  }));

  return {
    totalStudents,
    newStudents,
    activeStudents,
    retentionRate,
    completedSessions,
    cancelledSessions,
    cancellationRate,
    handicapImprovement: 0, // Krever HCP-data vi ikke har enna
    bookingTrends,
    tierDistribution,
  };
}

export async function exportBookingsCSV(
  from: string,
  to: string
): Promise<CsvResult> {
  await requireStaff();

  const bookings = await prisma.booking.findMany({
    where: {
      startTime: { gte: new Date(from), lte: new Date(to) },
    },
    include: {
      User: { select: { name: true, email: true } },
      ServiceType: { select: { name: true, category: true, duration: true } },
      Instructor: {
        select: { User: { select: { name: true } } },
      },
      Location: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
    take: 5000,
  });

  const headers = [
    "Dato",
    "Tid",
    "Slutt",
    "Elev",
    "E-post",
    "Tjeneste",
    "Kategori",
    "Varighet (min)",
    "Instruktor",
    "Sted",
    "Status",
    "Betalingsstatus",
    "Belop (kr)",
  ];

  const rows = bookings.map((b) => [
    format(b.startTime, "yyyy-MM-dd"),
    format(b.startTime, "HH:mm"),
    format(b.endTime, "HH:mm"),
    b.User.name ?? "",
    b.User.email ?? "",
    b.ServiceType.name,
    b.ServiceType.category,
    String(b.ServiceType.duration),
    b.Instructor.User.name ?? "",
    b.Location?.name ?? "",
    b.status,
    b.paymentStatus,
    String(b.amount),
  ]);

  const csv = toCsv(headers, rows);
  const fromStr = format(new Date(from), "yyyy-MM-dd");
  const toStr = format(new Date(to), "yyyy-MM-dd");

  return {
    csv,
    filename: `bookinger_${fromStr}_${toStr}.csv`,
  };
}

export async function exportRevenueCSV(
  from: string,
  to: string
): Promise<CsvResult> {
  await requireStaff();

  const transactions = await prisma.paymentTransaction.findMany({
    where: {
      createdAt: { gte: new Date(from), lte: new Date(to) },
    },
    include: {
      Booking: {
        select: {
          User: { select: { name: true, email: true } },
          ServiceType: { select: { name: true } },
          Instructor: {
            select: { User: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
    take: 5000,
  });

  const headers = [
    "Dato",
    "Elev",
    "E-post",
    "Tjeneste",
    "Instruktor",
    "Betalingsmetode",
    "Brutto (kr)",
    "MVA (kr)",
    "MVA-sats (%)",
    "Gebyr (kr)",
    "Netto (kr)",
    "Status",
    "Referanse",
  ];

  const rows = transactions.map((t) => [
    format(t.createdAt, "yyyy-MM-dd"),
    t.Booking.User.name ?? "",
    t.Booking.User.email ?? "",
    t.Booking.ServiceType.name,
    t.Booking.Instructor.User.name ?? "",
    t.paymentMethod,
    String(t.grossAmount),
    String(t.vatAmount),
    String(t.vatRate),
    String(t.feeAmount),
    String(t.netAmount),
    t.status,
    t.providerRef ?? "",
  ]);

  const csv = toCsv(headers, rows);
  const fromStr = format(new Date(from), "yyyy-MM-dd");
  const toStr = format(new Date(to), "yyyy-MM-dd");

  return {
    csv,
    filename: `okonomi_${fromStr}_${toStr}.csv`,
  };
}

function toCsv(headers: string[], rows: string[][]): string {
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel-kompatibilitet
  const escape = (val: string) => {
    if (val.includes(";") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const lines = [
    headers.map(escape).join(";"),
    ...rows.map((row) => row.map(escape).join(";")),
  ];
  return BOM + lines.join("\n");
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
