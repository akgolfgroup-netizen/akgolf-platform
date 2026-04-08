import { createServiceClient } from "@/lib/supabase/server";
import { SubscriptionTier, SubscriptionStatus } from "@prisma/client";
import {
  PORTAL_LIMITS,
  type PortalLimits,
} from "./tier-utils";

// Re-export client-safe utilities
export {
  PORTAL_LIMITS,
  isFreeTier,
  isPaidTier,
  getLimitsForTier,
  type PortalLimits,
} from "./tier-utils";

// ════════════════════════════════════════════════════════════
// Subscription & Usage
// ════════════════════════════════════════════════════════════

/**
 * Get portal limits for a user based on their subscription tier
 */
export async function getPortalLimits(userId: string): Promise<PortalLimits> {
  const supabase = createServiceClient();
  
  const { data: user } = await supabase
    .from("User")
    .select("subscriptionTier")
    .eq("id", userId)
    .single();

  return PORTAL_LIMITS[(user?.subscriptionTier as SubscriptionTier) ?? "VISITOR"];
}

/**
 * Get current usage stats for a user
 */
export async function getPortalUsage(userId: string): Promise<{
  logCount: number;
  aiCount: number;
  resetDate: Date;
  tier: SubscriptionTier;
}> {
  const supabase = createServiceClient();

  const { data: user } = await supabase
    .from("User")
    .select("portalMonthlyLogCount, portalMonthlyAiCount, portalUsageResetDate, subscriptionTier")
    .eq("id", userId)
    .single();

  if (!user) {
    return {
      logCount: 0,
      aiCount: 0,
      resetDate: new Date(),
      tier: "VISITOR" as SubscriptionTier,
    };
  }

  // Check if we need to reset (new month)
  const now = new Date();
  const resetDate = user.portalUsageResetDate ? new Date(user.portalUsageResetDate) : new Date();
  
  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    // Reset counters for new month
    await supabase
      .from("User")
      .update({
        portalMonthlyLogCount: 0,
        portalMonthlyAiCount: 0,
        portalUsageResetDate: now.toISOString(),
      })
      .eq("id", userId);

    return {
      logCount: 0,
      aiCount: 0,
      resetDate: now,
      tier: user.subscriptionTier as SubscriptionTier,
    };
  }

  return {
    logCount: user.portalMonthlyLogCount ?? 0,
    aiCount: user.portalMonthlyAiCount ?? 0,
    resetDate,
    tier: user.subscriptionTier as SubscriptionTier,
  };
}

/**
 * Check if user can log a training session
 */
export async function canLogTrainingSession(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: SubscriptionTier;
}> {
  const usage = await getPortalUsage(userId);
  const limits = PORTAL_LIMITS[usage.tier];

  const allowed = usage.logCount < limits.monthlyLogs;
  const remaining = Math.max(0, limits.monthlyLogs - usage.logCount);

  return {
    allowed,
    remaining,
    limit: limits.monthlyLogs,
    tier: usage.tier,
  };
}

/**
 * Check if user can use AI analysis
 */
export async function canUseAiAnalysis(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  limit: number;
  tier: SubscriptionTier;
}> {
  const usage = await getPortalUsage(userId);
  const limits = PORTAL_LIMITS[usage.tier];

  const allowed = usage.aiCount < limits.monthlyAiAnalysis;
  const remaining = Math.max(0, limits.monthlyAiAnalysis - usage.aiCount);

  return {
    allowed,
    remaining,
    limit: limits.monthlyAiAnalysis,
    tier: usage.tier,
  };
}

/**
 * Increment log count after successfully logging a session
 */
export async function incrementLogCount(userId: string): Promise<void> {
  const supabase = createServiceClient();
  
  // Get current value and increment
  const { data: user } = await supabase
    .from("User")
    .select("portalMonthlyLogCount")
    .eq("id", userId)
    .single();

  await supabase
    .from("User")
    .update({ portalMonthlyLogCount: (user?.portalMonthlyLogCount ?? 0) + 1 })
    .eq("id", userId);
}

/**
 * Increment AI analysis count after using AI
 */
export async function incrementAiCount(userId: string): Promise<void> {
  const supabase = createServiceClient();
  
  // Get current value and increment
  const { data: user } = await supabase
    .from("User")
    .select("portalMonthlyAiCount")
    .eq("id", userId)
    .single();

  await supabase
    .from("User")
    .update({ portalMonthlyAiCount: (user?.portalMonthlyAiCount ?? 0) + 1 })
    .eq("id", userId);
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const supabase = createServiceClient();
  
  const { data: user } = await supabase
    .from("User")
    .select("onboardingCompletedAt")
    .eq("id", userId)
    .single();

  return !!user?.onboardingCompletedAt;
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: string): Promise<void> {
  const supabase = createServiceClient();
  
  await supabase
    .from("User")
    .update({ onboardingCompletedAt: new Date().toISOString() })
    .eq("id", userId);
}

// ════════════════════════════════════════════════════════════
// Module Access Control
// ════════════════════════════════════════════════════════════

/**
 * Legacy tier → module mapping for backward compatibility.
 * Users with old subscriptionTier still get access to corresponding modules.
 */
const LEGACY_TIER_MAP: Record<string, string[]> = {
  PRO: ["dagbok-pro", "statistikk", "sammenligning"],
  ELITE: [
    "dagbok-premium",
    "ovelsesbank",
    "statistikk",
    "sammenligning",
    "treningsplan",
    "spilleranalyse",
    "turneringsplan",
  ],
};

const ACTIVE_STATUSES: SubscriptionStatus[] = [
  "ACTIVE",
  "TRIALING",
];

/**
 * Check if a user has access to a specific app module.
 * Checks: direct subscription → bundle subscription → legacy tier fallback.
 */
export async function hasModuleAccess(
  userId: string,
  moduleSlug: string
): Promise<boolean> {
  const supabase = createServiceClient();

  // 1. Direct module subscription
  const { data: directSub } = await supabase
    .from("AppSubscription")
    .select(`
      id,
      AppModule:moduleId(slug)
    `)
    .eq("userId", userId)
    .not("moduleId", "is", null)
    .in("status", ACTIVE_STATUSES)
    .gte("currentPeriodEnd", new Date().toISOString())
    .eq("AppModule.slug", moduleSlug)
    .single();

  if (directSub) return true;

  // 2. Bundle subscription that includes the module
  const { data: bundleSubs } = await supabase
    .from("AppSubscription")
    .select(`
      id,
      AppBundle:bundleId(
        BundleItem:AppBundleItem(
          AppModule:moduleId(slug)
        )
      )
    `)
    .eq("userId", userId)
    .not("bundleId", "is", null)
    .in("status", ACTIVE_STATUSES)
    .gte("currentPeriodEnd", new Date().toISOString())
    .returns<{
      id: string;
      AppBundle?: {
        BundleItem?: {
          AppModule?: { slug: string };
        }[];
      };
    }[]>();

  for (const sub of bundleSubs || []) {
    const items = sub.AppBundle?.BundleItem || [];
    for (const item of items) {
      if (item.AppModule?.slug === moduleSlug) return true;
    }
  }

  // 3. Legacy tier fallback
  const { data: user } = await supabase
    .from("User")
    .select("subscriptionTier")
    .eq("id", userId)
    .single();

  if (user) {
    const legacyModules = LEGACY_TIER_MAP[user.subscriptionTier as string] ?? [];
    if (legacyModules.includes(moduleSlug)) return true;
  }

  return false;
}

/**
 * Get all module slugs a user has access to.
 * Returns a flat array of slugs for use in UI gating.
 */
export async function getUserModuleSlugs(userId: string): Promise<string[]> {
  const supabase = createServiceClient();
  const slugs = new Set<string>();

  // 1. Direct module subscriptions
  const { data: directSubs } = await supabase
    .from("AppSubscription")
    .select(`
      id,
      AppModule:moduleId(slug)
    `)
    .eq("userId", userId)
    .not("moduleId", "is", null)
    .in("status", ACTIVE_STATUSES)
    .gte("currentPeriodEnd", new Date().toISOString())
    .returns<{ AppModule?: { slug: string } }[]>();

  for (const sub of directSubs || []) {
    if (sub.AppModule?.slug) slugs.add(sub.AppModule.slug);
  }

  // 2. Bundle subscriptions
  const { data: bundleSubs } = await supabase
    .from("AppSubscription")
    .select(`
      id,
      AppBundle:bundleId(
        BundleItem:AppBundleItem(
          AppModule:moduleId(slug)
        )
      )
    `)
    .eq("userId", userId)
    .not("bundleId", "is", null)
    .in("status", ACTIVE_STATUSES)
    .gte("currentPeriodEnd", new Date().toISOString())
    .returns<{
      AppBundle?: {
        BundleItem?: {
          AppModule?: { slug: string };
        }[];
      };
    }[]>();

  for (const sub of bundleSubs || []) {
    for (const item of sub.AppBundle?.BundleItem ?? []) {
      if (item.AppModule?.slug) slugs.add(item.AppModule.slug);
    }
  }

  // 3. Legacy tier fallback
  const { data: user } = await supabase
    .from("User")
    .select("subscriptionTier")
    .eq("id", userId)
    .single();

  if (user) {
    const legacyModules = LEGACY_TIER_MAP[user.subscriptionTier as string] ?? [];
    for (const slug of legacyModules) slugs.add(slug);
  }

  return Array.from(slugs);
}
