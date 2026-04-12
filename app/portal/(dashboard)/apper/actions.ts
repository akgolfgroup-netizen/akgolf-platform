"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
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
  [key: string]: unknown;
}

export interface AppBundleData {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  monthlyPriceNok: number;
  items: { module: { slug: string; name: string } }[];
  [key: string]: unknown;
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
  const supabase = await createServerSupabase();

  const [
    { data: modules },
    { data: bundles },
    userModules,
    { data: subscriptions },
    { data: userData },
  ] = await Promise.all([
    supabase
      .from("AppModule")
      .select("*")
      .eq("isActive", true)
      .order("sortOrder", { ascending: true }),
    supabase
      .from("AppBundle")
      .select(`*, BundleItem(*, AppModule:moduleId(slug, name))`)
      .eq("isActive", true)
      .order("sortOrder", { ascending: true }),
    getUserModuleSlugs(user.id),
    supabase
      .from("AppSubscription")
      .select(`id, status, cancelAtPeriodEnd, AppModule:moduleId(slug), AppBundle:bundleId(slug)`)
      .eq("userId", user.id),
    supabase
      .from("User")
      .select("subscriptionTier")
      .eq("id", user.id)
      .single(),
  ]);

  const tier = (userData?.subscriptionTier as string) ?? "VISITOR";
  const currentTier: PricingTier =
    tier === "PRO" ? "PRO" : tier === "ELITE" ? "ELITE" : "VISITOR";

  const transformedBundles = (bundles ?? []).map((b) => ({
    ...b,
    items: (b.BundleItem ?? []).map((item: { AppModule: { slug: string; name: string } }) => ({
      module: item.AppModule,
    })),
  }));

  const transformedSubscriptions = (subscriptions ?? []).map((s) => ({
    id: s.id as string,
    status: s.status as string,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd as boolean,
    module: (s.AppModule as { slug: string }[])?.[0] ?? null,
    bundle: (s.AppBundle as { slug: string }[])?.[0] ?? null,
  }));

  return {
    modules: (modules ?? []) as AppModuleData[],
    bundles: transformedBundles,
    userModules,
    subscriptions: transformedSubscriptions,
    hasStripeCustomer: !!user.stripeCustomerId,
    currentTier,
  };
}
