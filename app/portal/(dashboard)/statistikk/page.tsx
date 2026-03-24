import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { StatsOverview } from "@/components/portal/statistikk/stats-overview";
import { SGRadarChart } from "@/components/portal/statistikk/sg-radar-chart";
import { SkillLevelBadge } from "@/components/portal/statistikk/skill-level-badge";
import { StatistikkClient } from "./statistikk-client";
import { getRoundStats, getStatsAggregates } from "./actions";
import { getHandicapHistory } from "@/app/portal/(dashboard)/profil/actions";
import { getBenchmarkByHandicap } from "@/lib/portal/golf/sg-benchmarks";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";
import { BarChart3, Info } from "lucide-react";
import { PORTAL_EMPTY_STATES, PORTAL_CONTENT } from "@/lib/website-constants";

export default async function StatistikkPage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const isPro = hasTierAccess(userTier, SubscriptionTier.PRO);
  const isElite = hasTierAccess(userTier, SubscriptionTier.ELITE);

  const [rounds, aggregates, handicapHistory] = await Promise.all([
    getRoundStats(20),
    getStatsAggregates(),
    getHandicapHistory(12),
  ]);

  const currentHandicap = handicapHistory.length > 0
    ? handicapHistory[handicapHistory.length - 1].handicapIndex
    : null;

  const benchmark = currentHandicap !== null
    ? getBenchmarkByHandicap(Math.round(currentHandicap))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-[var(--color-snow)]">Statistikk</h1>
            {currentHandicap !== null && <SkillLevelBadge handicap={currentHandicap} />}
          </div>
        <StatistikkClient />
      </div>

      <div className="max-w-4xl">
        {!aggregates || rounds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="w-10 h-10 text-[var(--color-border)] mb-3" />
            <p className="text-sm font-medium text-[var(--color-snow)] mb-1">
              {PORTAL_EMPTY_STATES.statistikk.title}
            </p>
            <p className="text-sm text-[var(--color-gold-muted)]">
              {PORTAL_EMPTY_STATES.statistikk.description}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview cards */}
            <StatsOverview aggregates={aggregates} />

            {/* SG Radar (PRO+) */}
            <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
              <div
                className="rounded-2xl p-5 border"
                style={{ background: "rgba(10,25,41,0.7)", borderColor: "rgba(15,41,80,0.8)" }}
              >
                <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest mb-3">
                  Strokes Gained Profil
                </p>
                <SGRadarChart
                  playerSG={{
                    offTheTee: aggregates.avgSgOffTheTee ?? null,
                    approach: aggregates.avgSgApproach ?? null,
                    aroundTheGreen: aggregates.avgSgAroundTheGreen ?? null,
                    putting: aggregates.avgSgPutting ?? null,
                  }}
                  benchmark={isElite ? benchmark : null}
                />
                {isElite && benchmark && (
                  <p className="text-[10px] text-[var(--color-gold-muted)]/50 text-center mt-2">
                    Blå linje = Nivå {benchmark.category} benchmark ({benchmark.label})
                  </p>
                )}
              </div>
            </TierGate>

            {/* SG Explanation */}
            <details className="rounded-2xl border overflow-hidden" style={{ background: "rgba(10,25,41,0.5)", borderColor: "rgba(15,41,80,0.6)" }}>
              <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                <Info className="w-4 h-4 text-[var(--color-gold)]" />
                <span className="text-sm font-medium text-[var(--color-snow)]">Hva er Strokes Gained?</span>
              </summary>
              <div className="px-5 pb-5 pt-2 border-t border-[rgba(15,41,80,0.6)]">
                <p className="text-sm text-[var(--color-gold-muted)] mb-4">
                  {PORTAL_CONTENT.statistikk.sgExplanation.intro}
                </p>
                <div className="space-y-2">
                  {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
                    <div key={cat.key} className="flex gap-3">
                      <span className="text-xs font-semibold text-[var(--color-gold)] shrink-0 w-24">{cat.key}</span>
                      <span className="text-xs text-[var(--color-gold-muted)]">{cat.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </details>

            {/* Recent rounds list */}
            <div
              className="rounded-2xl p-5 border"
              style={{ background: "rgba(10,25,41,0.7)", borderColor: "rgba(15,41,80,0.8)" }}
            >
              <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest mb-3">
                Siste runder
              </p>
              <div className="space-y-2">
                {rounds.slice(0, 10).map((round) => (
                  <div
                    key={round.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-[var(--color-border)] hover:border-[var(--color-gold)]/20 transition-colors"
                    style={{ background: "rgba(255,255,255,0.02)" }}
                  >
                    <div>
                      <span className="text-xs font-medium text-[var(--color-gold)]">
                        {new Date(round.date).toLocaleDateString("nb-NO")}
                      </span>
                      {round.courseName && (
                        <span className="text-xs text-[var(--color-gold-muted)] ml-2">
                          {round.courseName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {round.totalScore && (
                        <span className="text-sm font-bold text-[var(--color-snow)]">
                          {round.totalScore}
                          {round.scoreToPar !== null && (
                            <span className={`text-xs ml-1 ${
                              round.scoreToPar < 0 ? "text-green-400" : round.scoreToPar > 0 ? "text-red-400" : "text-[var(--color-gold-muted)]"
                            }`}>
                              ({round.scoreToPar > 0 ? "+" : ""}{round.scoreToPar})
                            </span>
                          )}
                        </span>
                      )}
                      {round.sgTotal !== null && (
                        <span className={`text-xs font-medium ${
                          round.sgTotal > 0 ? "text-green-400" : "text-red-400"
                        }`}>
                          SG {round.sgTotal > 0 ? "+" : ""}{round.sgTotal.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
