/**
 * Subscription Quota Management for AK Golf Coaching
 *
 * Handles:
 * - Checking if user has available sessions
 * - Using sessions when booking
 * - Releasing sessions when canceling (>24h before)
 * - Resetting quota on subscription renewal
 */

import { createServiceClient } from "@/lib/supabase/server";
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
      return { sessionsPerPeriod: 4, bookingWindowDays: 28, maxPerWeek: 2 };
    case "PERFORMANCE":
      return { sessionsPerPeriod: 2, bookingWindowDays: 28, maxPerWeek: 1 };
    case "START":
      return { sessionsPerPeriod: 3, bookingWindowDays: 21, maxPerWeek: 1 };
    default:
      return { sessionsPerPeriod: 0, bookingWindowDays: 0, maxPerWeek: 0 };
  }
}

/**
 * Check if user has available booking quota
 */
export async function checkUserQuota(userId: string): Promise<QuotaCheckResult> {
  const supabase = createServiceClient();
  
  const { data: quota, error } = await supabase
    .from("SubscriptionQuota")
    .select("*")
    .eq("userId", userId)
    .single();

  if (error || !quota) {
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
  if (new Date() > new Date(quota.periodEnd)) {
    return {
      hasQuota: false,
      sessionsUsed: quota.sessionsUsed,
      sessionsAllowed: quota.sessionsAllowed,
      sessionsRemaining: 0,
      periodEnd: new Date(quota.periodEnd),
      reason: "Abonnementsperioden har utløpt. Venter på fornyelse.",
    };
  }

  const sessionsRemaining = quota.sessionsAllowed - quota.sessionsUsed;

  return {
    hasQuota: sessionsRemaining > 0,
    sessionsUsed: quota.sessionsUsed,
    sessionsAllowed: quota.sessionsAllowed,
    sessionsRemaining,
    periodEnd: new Date(quota.periodEnd),
    reason: sessionsRemaining <= 0
      ? `Du har brukt alle ${quota.sessionsAllowed} sesjonene dine denne måneden. Ny kvote fra ${new Date(quota.periodEnd).toLocaleDateString("nb-NO")}.`
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
  const supabase = createServiceClient();
  
  const { data: quota, error } = await supabase
    .from("SubscriptionQuota")
    .select("bookingWindowDays")
    .eq("userId", userId)
    .single();

  if (error || !quota) {
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
 * Consume a session from user's quota (called after successful booking).
 * Returns true if a session was successfully consumed.
 */
export async function consumeSession(userId: string): Promise<boolean> {
  const supabase = createServiceClient();
  
  try {
    // Use RPC for atomic increment
    const { data, error } = await supabase.rpc("increment_sessions_used", {
      p_user_id: userId,
    });

    if (error) {
      // Fallback: manual update with check
      const { data: quota } = await supabase
        .from("SubscriptionQuota")
        .select("sessionsUsed, sessionsAllowed")
        .eq("userId", userId)
        .single();

      if (!quota || quota.sessionsUsed >= quota.sessionsAllowed) {
        return false;
      }

      const { error: updateError } = await supabase
        .from("SubscriptionQuota")
        .update({
          sessionsUsed: quota.sessionsUsed + 1,
          updatedAt: new Date().toISOString(),
        })
        .eq("userId", userId)
        .lt("sessionsUsed", quota.sessionsAllowed);

      return !updateError;
    }

    return data || false;
  } catch {
    return false;
  }
}

/**
 * Release a session back to user's quota (called after cancellation >24h before)
 */
export async function releaseSession(userId: string): Promise<boolean> {
  const supabase = createServiceClient();
  
  try {
    // Use RPC for atomic decrement
    const { data, error } = await supabase.rpc("decrement_sessions_used", {
      p_user_id: userId,
    });

    if (error) {
      // Fallback: manual update with check
      const { data: quota } = await supabase
        .from("SubscriptionQuota")
        .select("sessionsUsed")
        .eq("userId", userId)
        .single();

      if (!quota || quota.sessionsUsed <= 0) {
        return false;
      }

      const { error: updateError } = await supabase
        .from("SubscriptionQuota")
        .update({
          sessionsUsed: quota.sessionsUsed - 1,
          updatedAt: new Date().toISOString(),
        })
        .eq("userId", userId)
        .gt("sessionsUsed", 0);

      return !updateError;
    }

    return data || false;
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
  const supabase = createServiceClient();
  const limits = getSessionLimits(tier);
  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const { error } = await supabase
    .from("SubscriptionQuota")
    .upsert({
      userId,
      subscriptionId: stripeSubscriptionId,
      tier,
      sessionsAllowed: limits.sessionsPerPeriod,
      sessionsUsed: 0,
      bookingWindowDays: limits.bookingWindowDays,
      periodStart: now.toISOString(),
      periodEnd: periodEnd.toISOString(),
      updatedAt: now.toISOString(),
    }, {
      onConflict: "userId",
    });

  if (error) throw error;
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
  const supabase = createServiceClient();
  const limits = getSessionLimits(tier);
  const now = new Date();
  const end = periodEnd ?? new Date(now.setMonth(now.getMonth() + 1));

  const { error } = await supabase
    .from("SubscriptionQuota")
    .upsert({
      id: nanoid(),
      userId,
      subscriptionId: stripeSubscriptionId,
      tier,
      sessionsAllowed: limits.sessionsPerPeriod,
      sessionsUsed: 0,
      bookingWindowDays: limits.bookingWindowDays,
      periodStart: new Date().toISOString(),
      periodEnd: end.toISOString(),
      updatedAt: new Date().toISOString(),
    }, {
      onConflict: "userId",
    });

  if (error) throw error;
}

/**
 * Cancel subscription and remove quota
 */
export async function cancelSubscriptionQuota(userId: string): Promise<void> {
  const supabase = createServiceClient();
  
  await supabase
    .from("SubscriptionQuota")
    .delete()
    .eq("userId", userId);
}

/**
 * Get user's current quota status (for display in UI)
 */
export async function getQuotaStatus(userId: string) {
  const supabase = createServiceClient();
  
  const { data: quota, error } = await supabase
    .from("SubscriptionQuota")
    .select(`
      *,
      User:userId (name, email)
    `)
    .eq("userId", userId)
    .single();

  if (error || !quota) return null;

  const limits = getSessionLimits(quota.tier as CoachingSubscriptionTier);
  const userData = quota.User as { name: string | null; email: string | null } | null;

  return {
    ...quota,
    User: userData,
    sessionsRemaining: quota.sessionsAllowed - quota.sessionsUsed,
    maxPerWeek: limits.maxPerWeek,
    isExpired: new Date() > new Date(quota.periodEnd),
    daysUntilRenewal: Math.ceil(
      (new Date(quota.periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    ),
  };
}
