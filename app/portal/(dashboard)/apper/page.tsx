import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { ApperClient } from "./apper-client";
import { getApperPageData } from "./actions";

import { MonoLabel } from "@/components/portal/patterns";
export default async function ApperPage() {
  const data = await getApperPageData();

  return (
    <div className="space-y-8">
      {/* Neutral header */}
      <div className="space-y-2">
        <MonoLabel as="p" size="xs" uppercase className="text-portal-muted block">Marketplace</MonoLabel>
        <h1 className="text-3xl font-semibold tracking-tight text-portal-text">
          Apper og moduler
        </h1>
        <p className="text-portal-secondary max-w-xl">
          Lås opp avanserte moduler og bundles for å forbedre spillet ditt — enkeltmoduler eller komplette pakker.
        </p>
      </div>

      <PremiumCard>
        <ApperClient
          modules={data.modules}
          bundles={data.bundles}
          userModules={data.userModules}
          subscriptions={data.subscriptions}
          hasStripeCustomer={data.hasStripeCustomer}
          currentTier={data.currentTier}
        />
      </PremiumCard>
    </div>
  );
}
