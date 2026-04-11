"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";

// ── Types ──────────────────────────────────────────────────

export type AnalyticsPeriod = "week" | "month" | "quarter";

export interface AnalyticsData {
  periodLabel: string;
  previousPeriodLabel: string;
  newStudents: number;
  activeStudents: number;
  churnedStudents: number;
  totalBookings: number;
  completedBookings: number;
  bookingRate: number;
  noShowCount: number;
  revenue: number;
  revenueGrowth: number;
  avgRevenuePerStudent: number;
  avgHcpImprovement: number;
  topImprovers: { name: string; hcpChange: number }[];
  weeklyRevenue: { week: string; amount: number }[];
  weeklyBookings: { week: string; count: number }[];
}

export interface StudentHealth {
  id: string;
  name: string;
  status: "good" | "warning" | "critical";
  lastSession: string | null;
  nextSession: string | null;
  sessionsThisMonth: number;
}

export interface DashboardData extends AnalyticsData {
  churnRate: number;
  serviceDistribution: { label: string; value: number; color: string }[];
  heatmap: { row: string; col: string; value: number }[];
  studentHealth: StudentHealth[];
  monthlyGrowth: { label: string; value: number }[];
  monthlyRevenue: { label: string; value: number }[];
}

// ── Helpers ────────────────────────────────────────────────

const CONFIRMED_OR_COMPLETED = ["CONFIRMED", "COMPLETED"] as const;
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
const WEEKDAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const HOUR_LABELS = ["08", "10", "12", "14", "16", "18", "20"];
const FALLBACK_COLORS = [
  "var(--color-primary)", "var(--color-accent-cta)", "var(--color-success)",
  "var(--color-warning)", "var(--color-ai)", "var(--color-info)",
];

async function requireStaffUser() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) throw new Error("Ikke autorisert");
  return user;
}

function getPeriodRange(period: AnalyticsPeriod) {
  const now = new Date();
  const end = new Date(now);
  let start: Date, weeks: number, label: string;
  switch (period) {
    case "week":
      start = new Date(now); start.setDate(now.getDate() - 7);
      weeks = 1; label = "Denne uken"; break;
    case "quarter":
      start = new Date(now); start.setDate(now.getDate() - 90);
      weeks = 13; label = "Dette kvartalet"; break;
    default:
      start = new Date(now); start.setDate(now.getDate() - 30);
      weeks = 4; label = "Denne måneden"; break;
  }
  const duration = end.getTime() - start.getTime();
  const prevEnd = new Date(start);
  const prevStart = new Date(prevEnd.getTime() - duration);
  return { start, end, prevStart, prevEnd, label, prevLabel: "forrige periode", weeks };
}

// ── getAnalyticsData ───────────────────────────────────────

export async function getAnalyticsData(period: AnalyticsPeriod = "month"): Promise<AnalyticsData> {
  await requireStaffUser();
  const { start, end, prevStart, prevEnd, label, prevLabel, weeks } = getPeriodRange(period);
  const statusFilter = { in: [...CONFIRMED_OR_COMPLETED] };

  const [activeStudents, newStudents, churnedStudents, totalBookings, completedBookings, noShowCount, curRev, prevRev] =
    await Promise.all([
      prisma.user.count({ where: { role: "STUDENT", isActive: true, Booking: { some: { startTime: { gte: start, lt: end }, status: statusFilter } } } }),
      prisma.user.count({ where: { role: "STUDENT", createdAt: { gte: start, lt: end } } }),
      prisma.user.count({ where: { role: "STUDENT", isActive: true, Booking: { some: { startTime: { gte: prevStart, lt: prevEnd }, status: statusFilter }, none: { startTime: { gte: start, lt: end }, status: statusFilter } } } }),
      prisma.booking.count({ where: { startTime: { gte: start, lt: end } } }),
      prisma.booking.count({ where: { startTime: { gte: start, lt: end }, status: "COMPLETED" } }),
      prisma.booking.count({ where: { startTime: { gte: start, lt: end }, status: "NO_SHOW" } }),
      prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: start, lt: end } }, _sum: { grossAmount: true } }),
      prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: prevStart, lt: prevEnd } }, _sum: { grossAmount: true } }),
    ]);

  const revenue = curRev._sum.grossAmount ?? 0;
  const prev = prevRev._sum.grossAmount ?? 0;
  const revenueGrowth = prev > 0 ? ((revenue - prev) / prev) * 100 : 0;
  const bookingRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  const weekResults = await Promise.all(
    Array.from({ length: weeks }, (_, i) => {
      const ws = new Date(start); ws.setDate(start.getDate() + i * 7);
      const we = new Date(ws); we.setDate(ws.getDate() + 7);
      if (we > end) we.setTime(end.getTime());
      return Promise.all([
        prisma.paymentTransaction.aggregate({ where: { status: "PAID", paidAt: { gte: ws, lt: we } }, _sum: { grossAmount: true } }),
        prisma.booking.count({ where: { startTime: { gte: ws, lt: we }, status: statusFilter } }),
      ]).then(([r, c]) => ({ week: `Uke ${i + 1}`, amount: r._sum.grossAmount ?? 0, count: c }));
    }),
  );

  return {
    periodLabel: label, previousPeriodLabel: prevLabel,
    newStudents, activeStudents, churnedStudents,
    totalBookings, completedBookings, bookingRate, noShowCount,
    revenue, revenueGrowth,
    avgRevenuePerStudent: activeStudents > 0 ? revenue / activeStudents : 0,
    avgHcpImprovement: 0, topImprovers: [],
    weeklyRevenue: weekResults.map((w) => ({ week: w.week, amount: w.amount })),
    weeklyBookings: weekResults.map((w) => ({ week: w.week, count: w.count })),
  };
}

// ── getDashboardData ───────────────────────────────────────

export async function getDashboardData(period: AnalyticsPeriod = "month"): Promise<DashboardData> {
  const base = await getAnalyticsData(period);
  const { start, end } = getPeriodRange(period);
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const nineMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 8, 1);
  const fourteenDaysAgo = new Date(now); fourteenDaysAgo.setDate(now.getDate() - 14);
  const thirtyDaysAgo = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30);
  const statusFilter = { in: [...CONFIRMED_OR_COMPLETED] };

  const [svcGroups, svcTypes, heatBookings, growthBookings, growthPayments, students] = await Promise.all([
    prisma.booking.groupBy({ by: ["serviceTypeId"], where: { startTime: { gte: start, lt: end }, status: statusFilter }, _count: true }),
    prisma.serviceType.findMany({ select: { id: true, name: true, color: true } }),
    prisma.booking.findMany({ where: { startTime: { gte: start, lt: end }, status: statusFilter }, select: { startTime: true } }),
    prisma.booking.findMany({ where: { startTime: { gte: nineMonthsAgo }, status: statusFilter }, select: { studentId: true, startTime: true } }),
    prisma.paymentTransaction.findMany({ where: { status: "PAID", paidAt: { gte: nineMonthsAgo } }, select: { grossAmount: true, paidAt: true } }),
    prisma.user.findMany({
      where: { role: "STUDENT", isActive: true },
      select: { id: true, name: true, Booking: { where: { status: statusFilter }, orderBy: { startTime: "desc" }, take: 1, select: { startTime: true } } },
      take: 50, orderBy: { name: "asc" },
    }),
  ]);

  // Service distribution
  const svcMap = new Map(svcTypes.map((s) => [s.id, s]));
  const totalSvc = svcGroups.reduce((sum, b) => sum + b._count, 0);
  const serviceDistribution = svcGroups
    .map((b, i) => {
      const s = svcMap.get(b.serviceTypeId);
      return {
        label: s?.name ?? "Ukjent",
        value: totalSvc > 0 ? Math.round((b._count / totalSvc) * 100) : 0,
        color: s?.color ?? FALLBACK_COLORS[i % FALLBACK_COLORS.length],
      };
    })
    .sort((a, b) => b.value - a.value);

  // Heatmap
  const grid: Record<string, number> = {};
  WEEKDAY_LABELS.forEach((d) => HOUR_LABELS.forEach((h) => { grid[`${d}-${h}`] = 0; }));
  heatBookings.forEach((b) => {
    const dayIdx = (b.startTime.getDay() + 6) % 7;
    const hour = b.startTime.getHours();
    const bucket = HOUR_LABELS.find((h) => Math.abs(hour - parseInt(h)) <= 1);
    if (bucket) grid[`${WEEKDAY_LABELS[dayIdx]}-${bucket}`]++;
  });
  const heatmap = Object.entries(grid).map(([key, value]) => {
    const [row, col] = key.split("-");
    return { row, col, value };
  });

  // Monthly growth + revenue (9 months, aggregated in JS)
  const monthlyGrowth: { label: string; value: number }[] = [];
  const monthlyRevenue: { label: string; value: number }[] = [];
  for (let i = 8; i >= 0; i--) {
    const ms = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const me = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const unique = new Set(growthBookings.filter((b) => b.startTime >= ms && b.startTime < me).map((b) => b.studentId));
    const rev = growthPayments.filter((p) => p.paidAt && p.paidAt >= ms && p.paidAt < me).reduce((s, p) => s + p.grossAmount, 0);
    monthlyGrowth.push({ label: MONTH_NAMES[ms.getMonth()], value: unique.size });
    monthlyRevenue.push({ label: MONTH_NAMES[ms.getMonth()], value: rev });
  }

  // Student health (batched)
  const ids = students.map((s) => s.id);
  const [nextBookings, sessionCounts] = await Promise.all([
    prisma.booking.findMany({
      where: { studentId: { in: ids }, startTime: { gt: now }, status: { in: ["CONFIRMED", "PENDING"] } },
      orderBy: { startTime: "asc" }, distinct: ["studentId"],
      select: { studentId: true, startTime: true },
    }),
    prisma.booking.groupBy({
      by: ["studentId"],
      where: { studentId: { in: ids }, startTime: { gte: startOfMonth }, status: statusFilter },
      _count: true,
    }),
  ]);
  const nextMap = new Map(nextBookings.map((b) => [b.studentId, b.startTime]));
  const countMap = new Map(sessionCounts.map((g) => [g.studentId, g._count]));

  const studentHealth: StudentHealth[] = students.map((s) => {
    const last = s.Booking[0]?.startTime ?? null;
    let status: "good" | "warning" | "critical" = "good";
    if (!last || last < thirtyDaysAgo) status = "critical";
    else if (last < fourteenDaysAgo) status = "warning";
    return {
      id: s.id, name: s.name ?? "Ukjent", status,
      lastSession: last?.toISOString() ?? null,
      nextSession: nextMap.get(s.id)?.toISOString() ?? null,
      sessionsThisMonth: countMap.get(s.id) ?? 0,
    };
  });

  const churnRate = base.activeStudents + base.churnedStudents > 0
    ? (base.churnedStudents / (base.activeStudents + base.churnedStudents)) * 100 : 0;

  return { ...base, churnRate, serviceDistribution, heatmap, studentHealth, monthlyGrowth, monthlyRevenue };
}
