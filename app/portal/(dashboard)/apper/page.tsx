import { requirePortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { getUserModuleSlugs } from "@/lib/portal/access";
import { Topbar } from "@/components/portal/layout/topbar";
import { ApperClient } from "./apper-client";

export default async function ApperPage() {
  const user = await requirePortalUser();

  const [modules, bundles, userModules, subscriptions] = await Promise.all([
    prisma.appModule.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.appBundle.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        items: { include: { module: { select: { slug: true, name: true } } } },
      },
    }),
    getUserModuleSlugs(user.id),
    prisma.appSubscription.findMany({
      where: { userId: user.id },
      include: {
        module: { select: { slug: true } },
        bundle: { select: { slug: true } },
      },
    }),
  ]);

  const hasStripeCustomer = !!user.stripeCustomerId;

  return (
    <div>
      <Topbar title="Apper" />
      <div className="p-6 max-w-4xl">
        <ApperClient
          modules={modules}
          bundles={bundles}
          userModules={userModules}
          subscriptions={subscriptions}
          hasStripeCustomer={hasStripeCustomer}
        />
      </div>
    </div>
  );
}
