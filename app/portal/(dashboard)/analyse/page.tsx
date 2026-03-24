import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { HandicapChart } from "@/components/portal/analyse/handicap-chart";
import { ConsistencyHeatmap } from "@/components/portal/analyse/consistency-heatmap";
import { PlanVsActualChart } from "@/components/portal/analyse/plan-vs-actual-chart";
import { AIWeaknessCard } from "@/components/portal/analyse/ai-weakness-card";
import { AddHandicapForm } from "@/components/portal/analyse/add-handicap-form";
import {
  getHandicapEntries,
  getConsistencyData,
  getPlanVsActual,
} from "./actions";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";
import { TrendingDown, Activity, BarChart2, Sparkles, Info } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

function Card({ title, icon: Icon, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)]">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[var(--color-gold)]" />
        <h2 className="text-sm font-semibold text-[var(--color-snow)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default async function AnalysePage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const isElite = hasTierAccess(userTier, SubscriptionTier.ELITE);

  const [handicapEntries, consistencyDates, planVsActual] = await Promise.all([
    getHandicapEntries(12),
    getConsistencyData(84),
    getPlanVsActual(8),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-snow)]">Analyse</h1>

      <div className="max-w-4xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          <div className="space-y-6">
            {/* AI-analyse info */}
            <details className="rounded-2xl bg-[rgba(15,41,80,0.3)] border border-[rgba(15,41,80,0.4)] group">
              <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer list-none">
                <Info className="w-4 h-4 text-[var(--color-gold)]" />
                <span className="text-sm font-medium text-[var(--color-snow)]">Om AI-analyse</span>
                <span className="ml-auto text-xs text-[var(--color-ink-40)] group-open:hidden">Vis mer</span>
                <span className="ml-auto text-xs text-[var(--color-ink-40)] hidden group-open:inline">Skjul</span>
              </summary>
              <div className="px-5 pb-5 space-y-3">
                <p className="text-sm text-[var(--color-ink-40)]">
                  {PORTAL_CONTENT.analyse.aiIntro}
                </p>
                <div className="pt-2 border-t border-[rgba(15,41,80,0.4)]">
                  <p className="text-xs font-semibold text-[var(--color-ink-40)] uppercase tracking-widest mb-1">
                    Svakhetsanalyse
                  </p>
                  <p className="text-sm text-[var(--color-ink-40)]">
                    {PORTAL_CONTENT.analyse.weaknessExplanation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-ink-40)] uppercase tracking-widest mb-1">
                    Fokusanbefaling
                  </p>
                  <p className="text-sm text-[var(--color-ink-40)]">
                    {PORTAL_CONTENT.analyse.focusRecommendation}
                  </p>
                </div>
              </div>
            </details>
            {/* Handicap trend */}
            <Card title="Handicap-fremgang" icon={TrendingDown}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[var(--color-ink-40)]">
                  {handicapEntries.length} registrerte målinger
                </p>
                <AddHandicapForm />
              </div>
              <HandicapChart entries={handicapEntries} />
            </Card>

            {/* Consistency heatmap */}
            <Card title="Treningskonsistens" icon={Activity}>
              <ConsistencyHeatmap trainedDates={consistencyDates} />
            </Card>

            {/* Plan vs actual */}
            <Card title="Plan vs. faktisk" icon={BarChart2}>
              <p className="text-xs text-[var(--color-ink-40)] mb-3">
                Siste 8 uker
              </p>
              <PlanVsActualChart data={planVsActual} />
            </Card>

            {/* AI weakness — Elite only */}
            <div>
              {isElite ? (
                <AIWeaknessCard />
              ) : (
                <TierGate userTier={userTier} required={SubscriptionTier.ELITE}>
                  <Card title="Svakhetsanalyse" icon={Sparkles}>
                    <p className="text-xs text-[var(--color-ink-40)]">
                      Krever Elite-abonnement
                    </p>
                  </Card>
                </TierGate>
              )}
            </div>
          </div>
        </TierGate>
      </div>
    </div>
  );
}
