"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { prisma } from "@/lib/portal/prisma";
import { subDays, startOfDay, format } from "date-fns";
import { nb } from "date-fns/locale";

export interface MissionBoardCharts {
  bookingTrend: { label: string; value: number }[];
  serviceDistribution: { label: string; value: number }[];
  heatmap: { row: string; col: string; value: number }[];
  sparkBookings: number[];
  sparkRevenue: number[];
  sparkStudents: number[];
  monthlyGoal: number;
  monthlyCurrent: number;
}

const WEEKDAY_LABELS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const HOUR_LABELS = ["08", "10", "12", "14", "16", "18", "20"];

export async function getMissionBoardCharts(): Promise<MissionBoardCharts> {
  await requirePortalUser().then((u) => {
    if (!isStaff(u.role)) throw new Error("Ikke autorisert");
  });

  const now = new Date();
  const thirtyDaysAgo = startOfDay(subDays(now, 30));

  // Hent alle bookinger og betalinger siste 30 dager i to queries
  const [bookings, payments] = await Promise.all([
    prisma.booking.findMany({
      where: { startTime: { gte: thirtyDaysAgo }, status: { in: ["CONFIRMED", "COMPLETED"] } },
      select: { startTime: true, serviceTypeId: true },
    }),
    prisma.paymentTransaction.findMany({
      where: { status: "PAID", paidAt: { gte: thirtyDaysAgo } },
      select: { grossAmount: true, paidAt: true },
    }),
  ]);

  // Booking-trend per dag (30 dager)
  const bookingTrend: { label: string; value: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = startOfDay(subDays(now, i));
    const nextDay = startOfDay(subDays(now, i - 1));
    const count = bookings.filter((b) => b.startTime >= day && b.startTime < nextDay).length;
    bookingTrend.push({ label: format(day, "d. MMM", { locale: nb }), value: count });
  }

  // Service-fordeling
  const svcCounts = new Map<string, number>();
  bookings.forEach((b) => {
    svcCounts.set(b.serviceTypeId, (svcCounts.get(b.serviceTypeId) ?? 0) + 1);
  });
  const serviceTypeIds = [...svcCounts.keys()];
  const serviceTypes = serviceTypeIds.length > 0
    ? await prisma.serviceType.findMany({ where: { id: { in: serviceTypeIds } }, select: { id: true, name: true } })
    : [];
  const svcNameMap = new Map(serviceTypes.map((s) => [s.id, s.name]));
  const serviceDistribution = [...svcCounts.entries()]
    .map(([id, count]) => ({ label: svcNameMap.get(id) ?? "Ukjent", value: count }))
    .sort((a, b) => b.value - a.value);

  // Heatmap (dag x time)
  const grid: Record<string, number> = {};
  WEEKDAY_LABELS.forEach((d) => HOUR_LABELS.forEach((h) => { grid[`${d}-${h}`] = 0; }));
  bookings.forEach((b) => {
    const dayIdx = (b.startTime.getDay() + 6) % 7;
    const hour = b.startTime.getHours();
    const bucket = HOUR_LABELS.find((h) => Math.abs(hour - parseInt(h)) <= 1);
    if (bucket) grid[`${WEEKDAY_LABELS[dayIdx]}-${bucket}`]++;
  });
  const heatmap = Object.entries(grid).map(([key, value]) => {
    const [row, col] = key.split("-");
    return { row, col, value };
  });

  // Sparklines (14 dager)
  const sparkBookings: number[] = [];
  const sparkRevenue: number[] = [];
  for (let i = 13; i >= 0; i--) {
    const day = startOfDay(subDays(now, i));
    const nextDay = startOfDay(subDays(now, i - 1));
    sparkBookings.push(bookings.filter((b) => b.startTime >= day && b.startTime < nextDay).length);
    sparkRevenue.push(
      payments.filter((p) => p.paidAt && p.paidAt >= day && p.paidAt < nextDay).reduce((s, p) => s + p.grossAmount, 0) / 1000,
    );
  }

  // Sparkline nye elever (14 dager)
  const fourteenDaysAgo = startOfDay(subDays(now, 14));
  const newStudents = await prisma.user.findMany({
    where: { role: "STUDENT", createdAt: { gte: fourteenDaysAgo } },
    select: { createdAt: true },
  });
  const sparkStudents: number[] = [];
  let cumStudents = await prisma.user.count({
    where: { role: "STUDENT", createdAt: { lt: fourteenDaysAgo } },
  });
  for (let i = 13; i >= 0; i--) {
    const day = startOfDay(subDays(now, i));
    const nextDay = startOfDay(subDays(now, i - 1));
    cumStudents += newStudents.filter((s) => s.createdAt >= day && s.createdAt < nextDay).length;
    sparkStudents.push(cumStudents);
  }

  // Månedlig mål
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthlyCurrent = await prisma.booking.count({
    where: { startTime: { gte: monthStart }, status: { in: ["CONFIRMED", "COMPLETED"] } },
  });

  return {
    bookingTrend,
    serviceDistribution,
    heatmap,
    sparkBookings,
    sparkRevenue,
    sparkStudents,
    monthlyGoal: 240,
    monthlyCurrent,
  };
}
