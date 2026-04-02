import { prisma } from "@/lib/portal/prisma";
import { SubscriptionStatus, SubscriptionTier } from "@prisma/client";
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

/**
 * Get portal limits for a user based on their subscription tier
 */
export async function getPortalLimits(userId: string): Promise<PortalLimits> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });
  return PORTAL_LIMITS[user?.subscriptionTier ?? SubscriptionTier.VISITOR];
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      portalMonthlyLogCount: true,
      portalMonthlyAiCount: true,
      portalUsageResetDate: true,
      subscriptionTier: true,
    },
  });

  if (!user) {
    return {
      logCount: 0,
      aiCount: 0,
      resetDate: new Date(),
      tier: SubscriptionTier.VISITOR,
    };
  }

  // Check if we need to reset (new month)
  const now = new Date();
  const resetDate = user.portalUsageResetDate ?? new Date();
  if (
    now.getMonth() !== resetDate.getMonth() ||
    now.getFullYear() !== resetDate.getFullYear()
  ) {
    // Reset counters for new month
    await prisma.user.update({
      where: { id: userId },
      data: {
        portalMonthlyLogCount: 0,
        portalMonthlyAiCount: 0,
        portalUsageResetDate: now,
      },
    });
    return {
      logCount: 0,
      aiCount: 0,
      resetDate: now,
      tier: user.subscriptionTier,
    };
  }

  return {
    logCount: user.portalMonthlyLogCount ?? 0,
    aiCount: user.portalMonthlyAiCount ?? 0,
    resetDate,
    tier: user.subscriptionTier,
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
  await prisma.user.update({
    where: { id: userId },
    data: { portalMonthlyLogCount: { increment: 1 } },
  });
}

/**
 * Increment AI analysis count after using AI
 */
export async function incrementAiCount(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { portalMonthlyAiCount: { increment: 1 } },
  });
}

/**
 * Check if user has completed onboarding
 */
export async function hasCompletedOnboarding(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { portalOnboardingCompleted: true },
  });
  return user?.portalOnboardingCompleted ?? false;
}

/**
 * Mark onboarding as completed
 */
export async function completeOnboarding(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { portalOnboardingCompleted: true },
  });
}

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
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

/**
 * Check if a user has access to a specific app module.
 * Checks: direct subscription → bundle subscription → legacy tier fallback.
 */
export async function hasModuleAccess(
  userId: string,
  moduleSlug: string
): Promise<boolean> {
  // 1. Direct module subscription
  const directSub = await prisma.appSubscription.findFirst({
    where: {
      userId,
      module: { slug: moduleSlug },
      status: { in: ACTIVE_STATUSES },
      currentPeriodEnd: { gte: new Date() },
    },
  });
  if (directSub) return true;

  // 2. Bundle subscription that includes the module
  const bundleSub = await prisma.appSubscription.findFirst({
    where: {
      userId,
      bundleId: { not: null },
      status: { in: ACTIVE_STATUSES },
      currentPeriodEnd: { gte: new Date() },
      bundle: {
        items: { some: { module: { slug: moduleSlug } } },
      },
    },
  });
  if (bundleSub) return true;

  // 3. Legacy tier fallback
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });
  if (user) {
    const legacyModules = LEGACY_TIER_MAP[user.subscriptionTier] ?? [];
    if (legacyModules.includes(moduleSlug)) return true;
  }

  return false;
}

/**
 * Get all module slugs a user has access to.
 * Returns a flat array of slugs for use in UI gating.
 */
export async function getUserModuleSlugs(userId: string): Promise<string[]> {
  const slugs = new Set<string>();

  // 1. Direct module subscriptions
  const directSubs = await prisma.appSubscription.findMany({
    where: {
      userId,
      moduleId: { not: null },
      status: { in: ACTIVE_STATUSES },
      currentPeriodEnd: { gte: new Date() },
    },
    include: { module: { select: { slug: true } } },
  });
  for (const sub of directSubs) {
    if (sub.module?.slug) slugs.add(sub.module.slug);
  }

  // 2. Bundle subscriptions
  const bundleSubs = await prisma.appSubscription.findMany({
    where: {
      userId,
      bundleId: { not: null },
      status: { in: ACTIVE_STATUSES },
      currentPeriodEnd: { gte: new Date() },
    },
    include: {
      bundle: {
        include: { items: { include: { module: { select: { slug: true } } } } },
      },
    },
  });
  for (const sub of bundleSubs) {
    for (const item of sub.bundle?.items ?? []) {
      if (item.module?.slug) slugs.add(item.module.slug);
    }
  }

  // 3. Legacy tier fallback
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  });
  if (user) {
    const legacyModules = LEGACY_TIER_MAP[user.subscriptionTier] ?? [];
    for (const slug of legacyModules) slugs.add(slug);
  }

  return Array.from(slugs);
}
