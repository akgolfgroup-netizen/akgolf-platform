import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { ComparisonSelector } from "@/components/portal/sammenligning/comparison-selector";
import { PeerBenchmarkCard } from "@/components/portal/sammenligning/peer-benchmark-card";
import { PortalHeader, PortalCard } from "@/components/portal/premium";
import { getPeerComparisonData } from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { Users } from "lucide-react";

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const data = await getPeerComparisonData();

  return (
    <div className="space-y-8">
      <PortalHeader
        label="Sammenligning"
        title="Sammenligning"
        description="Sammenlign deg med spillere på ditt nivå, tour-proffer eller handicap-tier."
      />

      <div className="max-w-5xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          {!data || "error" in data ? (
            <PortalCard
              padding="lg"
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10 mb-4">
                <Users className="h-7 w-7 text-[var(--color-primary)]" />
              </div>
              <p className="text-sm font-medium text-[var(--color-text)] mb-1">
                Ingen data tilgjengelig
              </p>
              <p className="text-sm text-[var(--color-muted)] max-w-sm">
                {data && "error" in data
                  ? data.error
                  : "Registrer handicap og noen runder for å se sammenligning."}
              </p>
            </PortalCard>
          ) : (
            <div className="space-y-6">
              <PortalCard padding="lg" as="section">
                <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] mb-5">
                  Din spillerkategori
                </h2>
                <PeerBenchmarkCard
                  handicap={data.handicap}
                  playerSG={{
                    total: data.myStats.sgTotal,
                    offTheTee: data.myStats.sgOffTheTee,
                    approach: data.myStats.sgApproach,
                    aroundTheGreen: data.myStats.sgAroundTheGreen,
                    putting: data.myStats.sgPutting,
                  }}
                  avgScore={data.myStats.avgScore ?? undefined}
                />
              </PortalCard>

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
            </div>
          )}
        </TierGate>
      </div>
    </div>
  );
}
