// @ts-nocheck — AppSubscription, AppBundle, BundleItem, SubscriptionStatus not yet in Prisma schema
import { prisma } from "@/lib/portal/prisma";
import { SubscriptionStatus } from "@prisma/client";

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
