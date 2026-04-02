/**
 * Subscription Quota Management for AK Golf Coaching
 *
 * Handles:
 * - Checking if user has available sessions
 * - Using sessions when booking
 * - Releasing sessions when canceling (>24h before)
 * - Resetting quota on subscription renewal
 */

import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";
import { CoachingSubscriptionTier } from "@prisma/client";

export interface QuotaCheckResult {
  hasQuota: boolean;
  sessionsUsed: number;
  sessionsAllowed: number;
  sessionsRemaining: number;
  periodEnd: Date;
  reason?: string;
}

export interface BookingWindowResult {
  canBook: boolean;
  maxBookingDate: Date;
  reason?: string;
}

/**
 * Get session limits based on tier
 */
export function getSessionLimits(tier: CoachingSubscriptionTier): {
  sessionsPerPeriod: number;
  bookingWindowDays: number;
  maxPerWeek: number;
} {
  switch (tier) {
    case "PERFORMANCE_PRO":
      return { sessionsPerPeriod: 4, bookingWindowDays: 14, maxPerWeek: 2 };
    case "PERFORMANCE":
      return { sessionsPerPeriod: 2, bookingWindowDays: 7, maxPerWeek: 1 };
    case "START":
      return { sessionsPerPeriod: 3, bookingWindowDays: 30, maxPerWeek: 1 };
    default:
      return { sessionsPerPeriod: 0, bookingWindowDays: 0, maxPerWeek: 0 };
  }
}

/**
 * Check if user has available booking quota
 */
export async function checkUserQuota(userId: string): Promise<QuotaCheckResult> {
  const quota = await prisma.subscriptionQuota.findUnique({
    where: { userId },
  });

  if (!quota) {
    return {
      hasQuota: false,
      sessionsUsed: 0,
      sessionsAllowed: 0,
      sessionsRemaining: 0,
      periodEnd: new Date(),
      reason: "Ingen aktiv abonnement funnet. Vennligst oppgrader til Performance eller Performance Pro.",
    };
  }

  // Check if period has expired
  if (new Date() > quota.periodEnd) {
    return {
      hasQuota: false,
      sessionsUsed: quota.sessionsUsed,
      sessionsAllowed: quota.sessionsAllowed,
      sessionsRemaining: 0,
      periodEnd: quota.periodEnd,
      reason: "Abonnementsperioden har utløpt. Venter på fornyelse.",
    };
  }

  const sessionsRemaining = quota.sessionsAllowed - quota.sessionsUsed;

  return {
    hasQuota: sessionsRemaining > 0,
    sessionsUsed: quota.sessionsUsed,
    sessionsAllowed: quota.sessionsAllowed,
    sessionsRemaining,
    periodEnd: quota.periodEnd,
    reason: sessionsRemaining <= 0
      ? `Du har brukt alle ${quota.sessionsAllowed} sesjonene dine denne måneden. Ny kvote fra ${quota.periodEnd.toLocaleDateString("nb-NO")}.`
      : undefined,
  };
}

/**
 * Check if a booking date is within user's booking window
 */
export async function checkBookingWindow(
  userId: string,
  requestedDate: Date
): Promise<BookingWindowResult> {
  const quota = await prisma.subscriptionQuota.findUnique({
    where: { userId },
  });

  if (!quota) {
    return {
      canBook: false,
      maxBookingDate: new Date(),
      reason: "Ingen aktiv abonnement funnet.",
    };
  }

  const now = new Date();
  const maxBookingDate = new Date(now);
  maxBookingDate.setDate(maxBookingDate.getDate() + quota.bookingWindowDays);

  if (requestedDate > maxBookingDate) {
    return {
      canBook: false,
      maxBookingDate,
      reason: `Du kan bare booke ${quota.bookingWindowDays} dager frem i tid. Prøv en tidligere dato eller oppgrader til Performance Pro for 14 dagers bookingvindu.`,
    };
  }

  return {
    canBook: true,
    maxBookingDate,
  };
}

/**
 * Use a session from user's quota (called after successful booking)
 */
export async function useSession(userId: string): Promise<boolean> {
  try {
    const result = await prisma.subscriptionQuota.updateMany({
      where: {
        userId,
        sessionsUsed: { lt: prisma.subscriptionQuota.fields.sessionsAllowed },
      },
      data: {
        sessionsUsed: { increment: 1 },
        updatedAt: new Date(),
      },
    });

    return result.count > 0;
  } catch {
    return false;
  }
}

/**
 * Release a session back to user's quota (called after cancellation >24h before)
 */
export async function releaseSession(userId: string): Promise<boolean> {
  try {
    const result = await prisma.subscriptionQuota.updateMany({
      where: {
        userId,
        sessionsUsed: { gt: 0 },
      },
      data: {
        sessionsUsed: { decrement: 1 },
        updatedAt: new Date(),
      },
    });

    return result.count > 0;
  } catch {
    return false;
  }
}

/**
 * Reset quota for new billing period (called by Stripe webhook on invoice.paid)
 */
export async function resetQuotaForNewPeriod(
  userId: string,
  stripeSubscriptionId: string,
  tier: CoachingSubscriptionTier
): Promise<void> {
  const limits = getSessionLimits(tier);
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  await prisma.subscriptionQuota.upsert({
    where: { userId },
    create: {
      id: nanoid(),
      updatedAt: new Date(),
      userId,
      subscriptionId: stripeSubscriptionId,
      tier,
      sessionsAllowed: limits.sessionsPerPeriod,
      sessionsUsed: 0,
      bookingWindowDays: limits.bookingWindowDays,
      periodStart: now,
      periodEnd,
    },
    update: {
      subscriptionId: stripeSubscriptionId,
      tier,
      sessionsAllowed: limits.sessionsPerPeriod,
      sessionsUsed: 0,
      bookingWindowDays: limits.bookingWindowDays,
      periodStart: now,
      periodEnd,
    },
  });
}

/**
 * Create quota for new subscription
 */
export async function createQuotaForNewSubscription(
  userId: string,
  stripeSubscriptionId: string,
  tier: CoachingSubscriptionTier,
  periodEnd?: Date
): Promise<void> {
  const limits = getSessionLimits(tier);
  const now = new Date();
  const end = periodEnd ?? new Date(now.setMonth(now.getMonth() + 1));

  await prisma.subscriptionQuota.upsert({
    where: { userId },
    create: {
      id: nanoid(),
      updatedAt: new Date(),
      userId,
      subscriptionId: stripeSubscriptionId,
      tier,
      sessionsAllowed: limits.sessionsPerPeriod,
      sessionsUsed: 0,
      bookingWindowDays: limits.bookingWindowDays,
      periodStart: new Date(),
      periodEnd: end,
    },
    update: {
      subscriptionId: stripeSubscriptionId,
      tier,
      sessionsAllowed: limits.sessionsPerPeriod,
      sessionsUsed: 0,
      bookingWindowDays: limits.bookingWindowDays,
      periodStart: new Date(),
      periodEnd: end,
    },
  });
}

/**
 * Cancel subscription and remove quota
 */
export async function cancelSubscriptionQuota(userId: string): Promise<void> {
  await prisma.subscriptionQuota.delete({
    where: { userId },
  }).catch(() => {
    // Ignore if not found
  });
}

/**
 * Get user's current quota status (for display in UI)
 */
export async function getQuotaStatus(userId: string) {
  const quota = await prisma.subscriptionQuota.findUnique({
    where: { userId },
    include: {
      User: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!quota) return null;

  const limits = getSessionLimits(quota.tier);

  return {
    ...quota,
    sessionsRemaining: quota.sessionsAllowed - quota.sessionsUsed,
    maxPerWeek: limits.maxPerWeek,
    isExpired: new Date() > quota.periodEnd,
    daysUntilRenewal: Math.ceil(
      (quota.periodEnd.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
  };
}
