import { requirePortalUser } from "@/lib/portal/auth";
import { Topbar } from "@/components/portal/layout/topbar";
import { prisma } from "@/lib/portal/prisma";
import { getUserModuleSlugs } from "@/lib/portal/access";
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
        items: {
          include: { module: { select: { slug: true, name: true } } },
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
        module: { select: { slug: true } },
        bundle: { select: { slug: true } },
      },
    }),
  ]);

  return (
    <div>
      <Topbar title="Apper" />
      <div className="p-8 max-w-5xl">
        <ApperClient
          modules={modules}
          bundles={bundles}
          userModules={userModules}
          subscriptions={subscriptions}
          hasStripeCustomer={!!user.stripeCustomerId}
        />
      </div>
    </div>
  );
}
