import { requirePortalUser } from "@/lib/portal/auth";
import { Topbar } from "@/components/portal/layout/topbar";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { ComparisonSelector } from "@/components/portal/sammenligning/comparison-selector";
import { getPeerComparisonData } from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { Users } from "lucide-react";

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "FREE") as SubscriptionTier;

  const data = await getPeerComparisonData();

  return (
    <div>
      <Topbar title="Sammenligning" />
      <div className="p-6 max-w-4xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          {!data ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="w-10 h-10 text-[var(--color-border)] mb-3" />
              <p className="text-sm text-[var(--color-gold-muted)]">
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
