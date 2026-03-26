import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { ComparisonSelector } from "@/components/portal/sammenligning/comparison-selector";
import { getPeerComparisonData } from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { Users } from "lucide-react";

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const data = await getPeerComparisonData();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Sammenligning</h1>

      <div className="max-w-4xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          {!data ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
              <Users className="w-10 h-10 text-[var(--color-ink-40)] mb-3" />
              <p className="text-sm text-[var(--color-ink-40)]">
                Registrer handicap og noen runder for å se sammenligning.
              </p>
            </div>
          ) : (
            <ComparisonSelector
              myStats={data.myStats}
              peerData={{
                stats: data.peerStats,
                peerCount: data.peerCount,
                myRoundCount: data.myRoundCount,
                peerRoundCount: data.peerRoundCount,
                aboveAverageCount: data.aboveAverageCount,
                totalSGCategories: data.totalSGCategories,
                skillLevelLabel: data.skillLevel.labelNO,
              }}
            />
          )}
        </TierGate>
      </div>
    </div>
  );
}
