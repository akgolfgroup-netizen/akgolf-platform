/**
 * Trener-payout-kalkulator.
 *
 * Standardvalg #3 (Anders' fullmakt):
 *  - Markus Røinås Pedersen: fast lønn 60 000 kr/mnd
 *  - Andre trenere: 40% provisjon av økt-pris (etter MVA hvis aktuelt)
 *
 * TODO: Bekreft satser og hvilke trener-IDer som skal ha fast lønn.
 */

import { prisma } from "@/lib/portal/prisma";
import { startOfMonth, endOfMonth } from "date-fns";

const MARKUS_USER_EMAIL = "markus@akgolf.no";
const MARKUS_FIXED_SALARY_KR = 60_000;
const PROVISION_PCT = 40;

export interface PayoutLine {
  instructorId: string;
  instructorName: string;
  email: string | null;
  model: "FIXED" | "COMMISSION";
  monthlySalaryKr: number;
  commissionKr: number;
  totalPayoutKr: number;
  sessionCount: number;
  totalRevenueKr: number;
}

export interface PayoutMonth {
  monthStart: Date;
  monthEnd: Date;
  lines: PayoutLine[];
  totalKr: number;
}

export async function calculatePayoutForMonth(
  monthDate: Date = new Date(),
): Promise<PayoutMonth> {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);

  // Hent alle fullførte og betalte bookinger i måneden
  const bookings = await prisma.booking.findMany({
    where: {
      status: { in: ["COMPLETED"] },
      startTime: { gte: monthStart, lte: monthEnd },
    },
    include: {
      Instructor: {
        include: {
          User: { select: { id: true, email: true, name: true } },
        },
      },
      ServiceType: { select: { price: true } },
    },
  });

  // Grupperer per instruktør
  const byInstructor = new Map<string, {
    instructorId: string;
    name: string;
    email: string | null;
    sessions: number;
    revenue: number;
  }>();

  for (const b of bookings) {
    const id = b.instructorId;
    const existing = byInstructor.get(id) ?? {
      instructorId: id,
      name: b.Instructor.User?.name ?? "Ukjent",
      email: b.Instructor.User?.email ?? null,
      sessions: 0,
      revenue: 0,
    };
    existing.sessions += 1;
    existing.revenue += b.ServiceType?.price ?? 0;
    byInstructor.set(id, existing);
  }

  const lines: PayoutLine[] = [];
  for (const [, data] of byInstructor) {
    const isMarkus = data.email === MARKUS_USER_EMAIL;
    if (isMarkus) {
      lines.push({
        instructorId: data.instructorId,
        instructorName: data.name,
        email: data.email,
        model: "FIXED",
        monthlySalaryKr: MARKUS_FIXED_SALARY_KR,
        commissionKr: 0,
        totalPayoutKr: MARKUS_FIXED_SALARY_KR,
        sessionCount: data.sessions,
        totalRevenueKr: data.revenue,
      });
    } else {
      const commission = Math.round((data.revenue * PROVISION_PCT) / 100);
      lines.push({
        instructorId: data.instructorId,
        instructorName: data.name,
        email: data.email,
        model: "COMMISSION",
        monthlySalaryKr: 0,
        commissionKr: commission,
        totalPayoutKr: commission,
        sessionCount: data.sessions,
        totalRevenueKr: data.revenue,
      });
    }
  }

  const totalKr = lines.reduce((sum, l) => sum + l.totalPayoutKr, 0);

  return {
    monthStart,
    monthEnd,
    lines,
    totalKr,
  };
}
