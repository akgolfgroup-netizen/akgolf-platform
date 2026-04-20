import { ApperClient } from "./apper-client";
import { getApperPageData } from "./actions";

import { MonoLabel, BentoCard } from "@/components/portal/patterns";
export default async function ApperPage() {
  const data = await getApperPageData();

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <MonoLabel as="p" size="xs" uppercase className="text-on-surface-variant block mb-2">
          Marketplace
        </MonoLabel>
        <h1 className="text-2xl font-bold text-on-surface">
          Apper og moduler
        </h1>
        <p className="text-on-surface-variant mt-1 max-w-xl">
          Lås opp avanserte moduler og bundles for å forbedre spillet ditt — enkeltmoduler eller komplette pakker.
        </p>
      </header>

      <BentoCard variant="light" padding="lg">
        <ApperClient
          modules={data.modules}
          bundles={data.bundles}
          userModules={data.userModules}
          subscriptions={data.subscriptions}
          hasStripeCustomer={data.hasStripeCustomer}
          currentTier={data.currentTier}
        />
      </BentoCard>
    </section>
  );
}
