import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { ComparisonSelector } from "@/components/portal/sammenligning/comparison-selector";
import { PeerBenchmarkCard } from "@/components/portal/sammenligning/peer-benchmark-card";
import { getPeerComparisonData } from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { Users } from "lucide-react";

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const data = await getPeerComparisonData();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c16]">Sammenligning</h1>
        <p className="text-sm text-[#6b7366] mt-1">Sammenlign deg med andre spillere</p>
      </div>

      <div className="max-w-4xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          {!data ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl bg-white border border-[#c2c9bb]/50">
              <Users className="w-10 h-10 text-[#c2c9bb] mb-3" />
              <p className="text-sm text-[#6b7366]">
                Registrer handicap og noen runder for å se sammenligning.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Peer Benchmark Card */}
              <div className="p-6 rounded-2xl bg-white border border-[#c2c9bb]/50">
                <h2 className="text-lg font-semibold text-[#1c1c16] mb-4">
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
              </div>

              {/* Existing Peer Comparison */}
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
