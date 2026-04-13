import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { ComparisonSelector } from "@/components/portal/sammenligning/comparison-selector";
import { PeerBenchmarkCard } from "@/components/portal/sammenligning/peer-benchmark-card";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";
import { getPeerComparisonData } from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { Users } from "lucide-react";

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const data = await getPeerComparisonData();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold tracking-[0.22em] text-portal-muted uppercase">
          Peer-analyse
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-portal-text">
          Sammenligning
        </h1>
        <p className="text-portal-secondary max-w-xl">
          Sammenlign deg med spillere på ditt nivå, tour-proffer eller handicap-tier.
        </p>
      </div>

      <div className="max-w-5xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          {!data || "error" in data ? (
            <PremiumCard>
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Users className="h-7 w-7 text-portal-text" />
                </div>
                <p className="text-sm font-medium text-portal-text mb-1">
                  Ingen data tilgjengelig
                </p>
                <p className="text-sm text-portal-secondary max-w-sm">
                  {data && "error" in data
                    ? data.error
                    : "Registrer handicap og noen runder for å se sammenligning."}
                </p>
              </div>
            </PremiumCard>
          ) : (
            <div className="space-y-6">
              <PremiumCard>
                <p className="text-[10px] font-bold tracking-[0.22em] text-portal-muted uppercase mb-5 flex items-center gap-2">
                  <span className="w-6 h-px bg-portal-border" />
                  Din spillerkategori
                </p>
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
              </PremiumCard>

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
