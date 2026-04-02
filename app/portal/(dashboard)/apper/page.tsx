import { requirePortalUser } from "@/lib/portal/auth";
import { Topbar } from "@/components/portal/layout/topbar";
import { prisma } from "@/lib/portal/prisma";
import { getUserModuleSlugs } from "@/lib/portal/access";
import { ApperClient } from "./apper-client";
import { SubscriptionTier } from "@prisma/client";

export default async function ApperPage() {
  const user = await requirePortalUser();

  const [modules, bundles, userModules, subscriptions, userData] = await Promise.all([
    prisma.appModule.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.appBundle.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        BundleItems: {
          include: { AppModule: { select: { slug: true, name: true } } },
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
    prisma.user.findUnique({
      where: { id: user.id },
      select: { subscriptionTier: true },
    }),
  ]);

  // Map SubscriptionTier to pricing tier
  const currentTier = userData?.subscriptionTier ?? SubscriptionTier.VISITOR;
  const pricingTier: "VISITOR" | "PRO" | "ELITE" =
    currentTier === SubscriptionTier.PRO
      ? "PRO"
      : currentTier === SubscriptionTier.ELITE
        ? "ELITE"
        : "VISITOR";

  // Transform Prisma data to match client component interfaces
  const transformedBundles = bundles.map((b) => ({
    ...b,
    items: b.BundleItems.map((item) => ({
      module: item.AppModule,
    })),
  }));

  const transformedSubscriptions = subscriptions.map((s) => ({
    id: s.id,
    status: s.status,
    cancelAtPeriodEnd: s.cancelAtPeriodEnd,
    module: s.AppModule,
    bundle: s.AppBundle,
  }));

  return (
    <div>
      <Topbar title="Apper og Abonnement" />
      <div className="p-8 max-w-5xl">
        <ApperClient
          modules={modules}
          bundles={transformedBundles}
          userModules={userModules}
          subscriptions={transformedSubscriptions}
          hasStripeCustomer={!!user.stripeCustomerId}
          currentTier={pricingTier}
        />
      </div>
    </div>
  );
}
