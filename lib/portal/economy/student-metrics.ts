/**
 * Per-elev økonomidata for Spillerprofil 360 og Økonomi-kontrollsenter.
 *
 * Returnerer: LTV, fast inntekt-bidrag, fortjeneste/økt, churn-risiko.
 *
 * Standardvalg (TODO Bekreft med Anders):
 *  - LTV-formel: totalPaid + estimat 12 mnd MRR * 0.7 retention
 *  - Margin: 68% av MRR (etter trener-andel + plattform-kost)
 *  - Churn-risiko: kombinasjon av betalings-status + dager siden aktivitet
 */

import { prisma } from "@/lib/portal/prisma";

const RETENTION_FACTOR = 0.7;
const FORECAST_MONTHS = 12;
const MARGIN_PCT = 68;
const SESSIONS_PER_MONTH_DEFAULT = 4;

export interface StudentEconomyMetrics {
  userId: string;
  ltvKr: number;
  mrrContributionKr: number;
  marginPerSessionKr: number;
  marginPct: number;
  churnRiskScore: number;
  churnRiskLevel: "LAV" | "MEDIUM" | "HOY";
  daysSinceLastActivity: number | null;
  failedPayments30d: number;
}

export async function getStudentEconomy(userId: string): Promise<StudentEconomyMetrics> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true, lastActiveAt: true },
  });

  // Hent betalingsdata
  const allPayments = await prisma.paymentTransaction.findMany({
    where: { Booking: { studentId: userId } },
    orderBy: { createdAt: "desc" },
    select: { grossAmount: true, createdAt: true, status: true },
  });

  const successfulPayments = allPayments.filter((p) => p.status === "PAID");
  const totalPaid = successfulPayments.reduce((sum, p) => sum + p.grossAmount, 0);

  const tierPrice = tierMonthlyPriceKr(user?.subscriptionTier ?? null);
  const ltvKr = Math.round(totalPaid + tierPrice * FORECAST_MONTHS * RETENTION_FACTOR);
  const marginPerSessionKr = Math.round((tierPrice * MARGIN_PCT) / 100 / SESSIONS_PER_MONTH_DEFAULT);

  // Churn-risiko
  const last30dCutoff = new Date();
  last30dCutoff.setDate(last30dCutoff.getDate() - 30);
  const failedPayments30d = allPayments.filter(
    (p) => p.status === "FAILED" && p.createdAt >= last30dCutoff,
  ).length;

  const daysSinceLastActivity = user?.lastActiveAt
    ? Math.floor((Date.now() - user.lastActiveAt.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  let churnRiskScore = 0;
  if (failedPayments30d > 0) churnRiskScore += failedPayments30d * 25;
  if (daysSinceLastActivity !== null) {
    if (daysSinceLastActivity > 60) churnRiskScore += 40;
    else if (daysSinceLastActivity > 30) churnRiskScore += 20;
    else if (daysSinceLastActivity > 14) churnRiskScore += 10;
  }
  churnRiskScore = Math.min(100, churnRiskScore);

  const churnRiskLevel: "LAV" | "MEDIUM" | "HOY" =
    churnRiskScore < 25 ? "LAV" : churnRiskScore < 60 ? "MEDIUM" : "HOY";

  return {
    userId,
    ltvKr,
    mrrContributionKr: tierPrice,
    marginPerSessionKr,
    marginPct: MARGIN_PCT,
    churnRiskScore,
    churnRiskLevel,
    daysSinceLastActivity,
    failedPayments30d,
  };
}

export function tierMonthlyPriceKr(tier: string | null): number {
  switch (tier) {
    case "PRO":
      return 2000;
    case "STARTER":
      return 1600;
    case "ACADEMY":
      return 1295;
    case "ELITE":
      return 4000;
    default:
      return 0;
  }
}
