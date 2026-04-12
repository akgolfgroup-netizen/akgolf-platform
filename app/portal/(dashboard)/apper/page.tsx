import { HeroHeading } from "@/components/portal/premium";
import { ApperClient } from "./apper-client";
import { getApperPageData } from "./actions";

export default async function ApperPage() {
  const data = await getApperPageData();

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
        modules={data.modules}
        bundles={data.bundles}
        userModules={data.userModules}
        subscriptions={data.subscriptions}
        hasStripeCustomer={data.hasStripeCustomer}
        currentTier={data.currentTier}
      />
    </div>
  );
}
