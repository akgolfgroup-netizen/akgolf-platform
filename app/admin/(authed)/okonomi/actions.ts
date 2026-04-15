"use server";

import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";


// ── Types ────────────────────────────────────────────────────────────────────

export interface RevenueOverview {
  day: number;
  week: number;
  month: number;
  year: number;
}

export interface ServiceRevenue {
  name: string;
  amount: number;
  percentage: number;
}

export interface RefundEntry {
  id: string;
  customerName: string;
  customerEmail: string;
  serviceName: string;
  grossAmount: number;
  refundedAt: string | null;
}

export interface MonthlyDataPoint {
  label: string;
  value: number;
}

export interface UnpaidBooking {
  id: string;
  customerName: string;
  amount: number;
  createdAt: string;
  serviceName: string;
}

export interface OkonomiData {
  revenue: RevenueOverview;
  revenueByService: ServiceRevenue[];
  refunds: RefundEntry[];
  monthlyTrend: MonthlyDataPoint[];
  unpaid: UnpaidBooking[];
  totalRefunds: number;
  totalUnpaid: number;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeekMonday(date: Date): Date {
  const d = startOfDay(date);
  const dayOfWeek = d.getDay();
  // Mandag = 1, søndag = 0 → juster
  const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

// ── Actions ──────────────────────────────────────────────────────────────────

async function assertAdmin() {
  const user = await requirePortalUser();
  if (user.role !== "ADMIN") {
    throw new Error("Ikke autorisert");
  }
  return user;
}

export async function getOkonomiData(): Promise<OkonomiData> {
  await assertAdmin();

  const now = new Date();
  const dayStart = startOfDay(now);
  const weekStart = startOfWeekMonday(now);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  // Alle aggregeringer i parallell
  const aggregate = (gte: Date) =>
    prisma.paymentTransaction.aggregate({
      where: { status: "PAID", paidAt: { gte } },
      _sum: { grossAmount: true },
    });

  const [dayAgg, weekAgg, monthAgg, yearAgg, transactions, refundRows, unpaidRows] =
    await Promise.all([
      aggregate(dayStart),
      aggregate(weekStart),
      aggregate(monthStart),
      aggregate(yearStart),

      // Transaksjoner denne måneden for service-breakdown
      prisma.paymentTransaction.findMany({
        where: { status: "PAID", paidAt: { gte: monthStart } },
        include: {
          Booking: {
            include: { ServiceType: { select: { name: true } } },
          },
        },
      }),

      // Siste refusjoner
      prisma.paymentTransaction.findMany({
        where: { status: { in: ["REFUNDED", "PARTIALLY_REFUNDED"] } },
        include: {
          Booking: {
            include: {
              User: { select: { name: true, email: true } },
              ServiceType: { select: { name: true } },
            },
          },
        },
        orderBy: { updatedAt: "desc" },
        take: 20,
      }),

      // Ubetalte bookinger (PENDING betaling)
      prisma.booking.findMany({
        where: {
          paymentStatus: "PENDING",
          status: { in: ["CONFIRMED", "COMPLETED"] },
          amount: { gt: 0 },
        },
        include: {
          User: { select: { name: true } },
          ServiceType: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

  // Revenue overview
  const revenue: RevenueOverview = {
    day: dayAgg._sum.grossAmount ?? 0,
    week: weekAgg._sum.grossAmount ?? 0,
    month: monthAgg._sum.grossAmount ?? 0,
    year: yearAgg._sum.grossAmount ?? 0,
  };

  // Revenue by service
  const byService: Record<string, number> = {};
  for (const tx of transactions) {
    const name = tx.Booking?.ServiceType?.name ?? "Ukjent";
    byService[name] = (byService[name] ?? 0) + (tx.grossAmount ?? 0);
  }
  const serviceTotal = Object.values(byService).reduce((a, b) => a + b, 0);
  const revenueByService: ServiceRevenue[] = Object.entries(byService)
    .map(([name, amount]) => ({
      name,
      amount,
      percentage: serviceTotal > 0 ? Math.round((amount / serviceTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  // Refusjoner
  const refunds: RefundEntry[] = refundRows.map((r) => ({
    id: r.id,
    customerName: r.Booking?.User?.name ?? "Ukjent",
    customerEmail: r.Booking?.User?.email ?? "",
    serviceName: r.Booking?.ServiceType?.name ?? "Ukjent",
    grossAmount: r.grossAmount,
    refundedAt: r.refundedAt?.toISOString() ?? r.updatedAt.toISOString(),
  }));

  const totalRefunds = refundRows.reduce((sum, r) => sum + r.grossAmount, 0);

  // Ubetalte
  const unpaid: UnpaidBooking[] = unpaidRows.map((b) => ({
    id: b.id,
    customerName: b.User?.name ?? "Ukjent",
    amount: b.amount,
    createdAt: b.createdAt.toISOString(),
    serviceName: b.ServiceType?.name ?? "Ukjent",
  }));

  const totalUnpaid = unpaidRows.reduce((sum, b) => sum + b.amount, 0);

  // Månedlig trend (siste 6 måneder)
  const monthlyTrend: MonthlyDataPoint[] = [];
  for (let i = 5; i >= 0; i--) {
    const mStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const agg = await prisma.paymentTransaction.aggregate({
      where: { status: "PAID", paidAt: { gte: mStart, lt: mEnd } },
      _sum: { grossAmount: true },
    });
    monthlyTrend.push({
      label: mStart.toLocaleDateString("nb-NO", { month: "short" }),
      value: agg._sum.grossAmount ?? 0,
    });
  }

  return {
    revenue,
    revenueByService,
    refunds,
    monthlyTrend,
    unpaid,
    totalRefunds,
    totalUnpaid,
  };
}
