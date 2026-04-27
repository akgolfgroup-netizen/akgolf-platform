/**
 * Booking V2 — kvota-gate.
 *
 * Brukes av tid/page.tsx for å sende abonnement-brukere til /booking-v2/kvota
 * når de har brukt opp månedens økter, og av kvota/page.tsx for å vise ekte tall
 * i stedet for hardkodet "april / 4 av 4".
 *
 * checkUserQuota() i lib/portal/booking/subscription-quota.ts dekker det meste,
 * men returnerer hasQuota=false også for brukere uten abo. Vi vil bare gate
 * brukere som har et aktivt abo og har brukt opp månedens kvote.
 */

import { prisma } from "@/lib/portal/prisma";
import type { CoachingSubscriptionTier } from "@prisma/client";

export interface QuotaSnapshot {
  tier: CoachingSubscriptionTier;
  sessionsUsed: number;
  sessionsAllowed: number;
  sessionsRemaining: number;
  periodStart: Date;
  periodEnd: Date;
  /** Datoene for bookinger gjort i inneværende periode (sortert kronologisk) */
  bookingsInPeriod: Date[];
}

/**
 * Henter kvota-snapshot for en bruker, eller null hvis bruker ikke har aktiv abo.
 * Returnerer null også hvis perioden er utløpt — da skal bruker fortsette uten gate
 * (Stripe vil fornye automatisk).
 */
export async function getQuotaSnapshot(
  userId: string,
): Promise<QuotaSnapshot | null> {
  const quota = await prisma.subscriptionQuota.findUnique({
    where: { userId },
    select: {
      tier: true,
      sessionsUsed: true,
      sessionsAllowed: true,
      periodStart: true,
      periodEnd: true,
    },
  });

  if (!quota) return null;

  const now = new Date();
  if (now > quota.periodEnd) return null;

  const bookings = await prisma.booking.findMany({
    where: {
      studentId: userId,
      status: { in: ["CONFIRMED", "PENDING", "COMPLETED"] },
      startTime: { gte: quota.periodStart, lt: quota.periodEnd },
    },
    select: { startTime: true },
    orderBy: { startTime: "asc" },
  });

  return {
    tier: quota.tier,
    sessionsUsed: quota.sessionsUsed,
    sessionsAllowed: quota.sessionsAllowed,
    sessionsRemaining: Math.max(0, quota.sessionsAllowed - quota.sessionsUsed),
    periodStart: quota.periodStart,
    periodEnd: quota.periodEnd,
    bookingsInPeriod: bookings.map((b) => b.startTime),
  };
}

/**
 * Skal gate-loggen sende brukeren til /booking-v2/kvota?
 * True bare hvis bruker har aktivt abo og har brukt opp inneværende periode.
 */
export function isQuotaExhausted(snap: QuotaSnapshot): boolean {
  return snap.sessionsUsed >= snap.sessionsAllowed;
}

const TIER_LABEL: Record<CoachingSubscriptionTier, string> = {
  PERFORMANCE: "Performance",
  PERFORMANCE_PRO: "Performance Pro",
  START: "Start",
  PORTAL: "Spillerportal",
};

export function tierLabel(tier: CoachingSubscriptionTier): string {
  return TIER_LABEL[tier] ?? tier;
}
