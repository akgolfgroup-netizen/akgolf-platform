"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getUserModuleSlugs } from "@/lib/portal/access";

// ── Types ──────────────────────────────────────────────────

export type PricingTier = "VISITOR" | "PRO" | "ELITE";

export interface AppModuleData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  monthlyPriceNok: number;
}

export interface AppBundleData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceNok: number;
  items: { module: { slug: string; name: string } }[];
}

export interface ApperPageData {
  modules: AppModuleData[];
  bundles: AppBundleData[];
  userModules: string[];
  subscriptions: {
    id: string;
    status: string;
    cancelAtPeriodEnd: boolean;
    module: { slug: string } | null;
    bundle: { slug: string } | null;
  }[];
  hasStripeCustomer: boolean;
  currentTier: PricingTier;
}

// ── Data fetching ──────────────────────────────────────────

export async function getApperPageData(): Promise<ApperPageData> {
  const user = await requirePortalUser();

  const [modules, bundles, userModules, subscriptions] = await Promise.all([
    prisma.appModule.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        icon: true,
        monthlyPriceNok: true,
      },
    }),
    prisma.appBundle.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        monthlyPriceNok: true,
        BundleItem: {
          select: {
            AppModule: {
              select: { slug: true, name: true },
            },
          },
        },
      },
    }),
    getUserModuleSlugs(user.id),
    prisma.appSubscription.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        status: true,
        cancelAtPeriodEnd: true,
        AppModule: { select: { slug: true } },
        AppBundle: { select: { slug: true } },
      },
    }),
  ]);

  const tier = user.subscriptionTier as string | null;
  const currentTier: PricingTier =
    tier === "PRO" ? "PRO" : tier === "ELITE" ? "ELITE" : "VISITOR";

  const transformedBundles: AppBundleData[] = bundles.map((b) => ({
    id: b.id,
    slug: b.slug,
    name: b.name,
    description: b.description,
    monthlyPriceNok: b.monthlyPriceNok,
    items: b.BundleItem.map((item) => ({
      module: { slug: item.AppModule.slug, name: item.AppModule.name },
    })),
  }));

  const transformedSubscriptions = subscriptions.map((s) => ({
    id: s.id,
    status: s.status,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    module: s.AppModule ? { slug: s.AppModule.slug } : null,
    bundle: s.AppBundle ? { slug: s.AppBundle.slug } : null,
  }));

  return {
    modules,
    bundles: transformedBundles,
    userModules,
    subscriptions: transformedSubscriptions,
    hasStripeCustomer: !!user.stripeCustomerId,
    currentTier,
  };
}
