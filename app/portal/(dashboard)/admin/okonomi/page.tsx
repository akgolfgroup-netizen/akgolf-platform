import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { OkonomiClient } from "./okonomi-client";

export const metadata = {
  title: "Okonomi | AK Golf Mission Control",
};

async function getFinanceData() {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

  // MTD Revenue
  const mtdRevenue = await prisma.paymentTransaction.aggregate({
    where: {
      createdAt: { gte: monthStart },
      status: "PAID",
    },
    _sum: { grossAmount: true },
    _count: { id: true },
  });

  // Last month revenue (for comparison)
  const lastMonthRevenue = await prisma.paymentTransaction.aggregate({
    where: {
      createdAt: { gte: lastMonthStart, lte: lastMonthEnd },
      status: "PAID",
    },
    _sum: { grossAmount: true },
  });

  // Active subscriptions
  const activeSubscriptions = await prisma.userSubscription.count({
    where: { status: "ACTIVE" },
  });

  // Recent transactions
  const recentTransactions = await prisma.paymentTransaction.findMany({
    where: { status: "PAID" },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      Booking: {
        include: {
          User: { select: { name: true, email: true } },
          ServiceType: { select: { name: true } },
        },
      },
    },
  });

  // Revenue by payment method
  const revenueByPaymentMethod = await prisma.paymentTransaction.groupBy({
    by: ["paymentMethod"],
    where: {
      createdAt: { gte: monthStart },
      status: "PAID",
    },
    _sum: { grossAmount: true },
  });

  return {
    mtdRevenue: mtdRevenue._sum?.grossAmount ?? 0,
    mtdTransactions: mtdRevenue._count?.id ?? 0,
    lastMonthRevenue: lastMonthRevenue._sum?.grossAmount ?? 0,
    activeSubscriptions,
    recentTransactions: recentTransactions.map((t) => ({
      id: t.id,
      amount: t.grossAmount,
      type: t.paymentMethod,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
      customerName: t.Booking?.User?.name || "Ukjent",
      customerEmail: t.Booking?.User?.email || "",
      serviceName: t.Booking?.ServiceType?.name || t.paymentMethod,
    })),
    revenueByService: revenueByPaymentMethod.map((r) => ({
      type: r.paymentMethod,
      amount: r._sum?.grossAmount ?? 0,
    })),
  };
}

export default async function OkonomiPage() {
  const user = await requirePortalUser();

  if (!isAdmin(user.role)) {
    redirect("/portal/admin");
  }

  const data = await getFinanceData();

  return <OkonomiClient data={data} />;
}
