import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserModuleSlugs } from "@/lib/portal/access";
import { HeroHeading } from "@/components/portal/premium";
import { ApperClient } from "./apper-client";

export default async function ApperPage() {
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
      .select(`
        *,
        BundleItem(
          *,
          AppModule:moduleId(slug, name)
        )
      `)
      .eq("isActive", true)
      .order("sortOrder", { ascending: true }),
    getUserModuleSlugs(user.id),
    supabase
      .from("AppSubscription")
      .select(`
        id,
        status,
        cancelAtPeriodEnd,
        AppModule:moduleId(slug),
        AppBundle:bundleId(slug)
      `)
      .eq("userId", user.id),
    supabase
      .from("User")
      .select("subscriptionTier")
      .eq("id", user.id)
      .single(),
  ]);

  // Map SubscriptionTier to pricing tier
  type SubscriptionTier = "VISITOR" | "PRO" | "ELITE";
  const currentTier = (userData?.subscriptionTier as SubscriptionTier) ?? "VISITOR";
  const pricingTier: "VISITOR" | "PRO" | "ELITE" =
    currentTier === "PRO"
      ? "PRO"
      : currentTier === "ELITE"
        ? "ELITE"
        : "VISITOR";

  // Transform data to match client component interfaces
  const transformedBundles = (bundles ?? []).map((b) => ({
    ...b,
    items: (b.BundleItem ?? []).map((item: { AppModule: { slug: string; name: string } }) => ({
      module: item.AppModule,
    })),
  }));

  const transformedSubscriptions = (subscriptions ?? []).map((s) => ({
    id: s.id,
    status: s.status,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    module: s.AppModule?.[0] ?? null,
    bundle: s.AppBundle?.[0] ?? null,
  }));

  return (
    <div className="space-y-10">
      <HeroHeading
        label="Marketplace"
        title={
          <>
            Apper og{" "}
            <span className="font-serif italic text-[var(--color-primary)] font-normal">
              moduler
            </span>
            <span className="text-[var(--color-accent-cta)]">.</span>
          </>
        }
        description="Lås opp avanserte moduler og bundles for å forbedre spillet ditt — enkeltmoduler eller komplette pakker."
      />

      <ApperClient
        modules={modules ?? []}
        bundles={transformedBundles}
        userModules={userModules}
        subscriptions={transformedSubscriptions}
        hasStripeCustomer={!!user.stripeCustomerId}
        currentTier={pricingTier}
      />
    </div>
  );
}
