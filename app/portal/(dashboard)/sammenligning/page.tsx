import { Icon } from "@/components/ui/icon";
import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { ComparisonSelector } from "@/components/portal/sammenligning/comparison-selector";
import { PeerBenchmarkCard } from "@/components/portal/sammenligning/peer-benchmark-card";
import { BentoCard } from "@/components/portal/patterns";
import { getPeerComparisonData } from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { MonoLabel } from "@/components/portal/patterns";

export default async function SammenligningPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;

  const data = await getPeerComparisonData();

  return (
    <section className="space-y-6">
      {/* Header */}
      <header>
        <MonoLabel size="xs" uppercase className="text-on-surface-variant block mb-2">
          Peer-analyse
        </MonoLabel>
        <h1 className="text-3xl font-semibold tracking-tight text-primary">
          Sammenligning
        </h1>
        <p className="text-on-surface-variant max-w-xl mt-1">
          Sammenlign deg med spillere på ditt nivå, tour-proffer eller handicap-tier.
        </p>
      </header>

      <div className="max-w-5xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          {!data || "error" in data ? (
            <BentoCard variant="light" padding="lg">
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 mb-4">
                  <Icon name="groups" className="h-7 w-7 text-on-surface" />
                </div>
                <p className="text-sm font-medium text-on-surface mb-1">
                  Ingen data tilgjengelig
                </p>
                <p className="text-sm text-on-surface-variant max-w-sm">
                  {data && "error" in data
                    ? data.error
                    : "Registrer handicap og noen runder for å se sammenligning."}
                </p>
              </div>
            </BentoCard>
          ) : (
            <div className="space-y-6">
              <BentoCard variant="light" padding="lg">
                <p className="text-[10px] font-bold tracking-[0.22em] text-on-surface-variant uppercase mb-5 flex items-center gap-2">
                  <span className="w-6 h-px bg-outline-variant" />
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
              </BentoCard>

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
    </section>
  );
}
