import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { getUserModuleSlugs } from "@/lib/portal/access";
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c16]">Apper og Abonnement</h1>
        <p className="text-sm text-[#6b7366] mt-1">Få tilgang til avanserte verktøy for å forbedre golfen din</p>
      </div>

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
