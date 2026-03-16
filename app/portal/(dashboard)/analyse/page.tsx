import { requirePortalUser } from "@/lib/portal/auth";
import { Topbar } from "@/components/portal/layout/topbar";
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
import { TrendingDown, Activity, BarChart2, Sparkles } from "lucide-react";

function Card({ title, icon: Icon, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl p-5 border"
      style={{
        background: "rgba(255,255,255,0.02)",
        borderColor: "rgba(15,41,80,0.7)",
      }}
    >
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
  const userTier = (user?.subscriptionTier ?? "FREE") as SubscriptionTier;
  const isElite = hasTierAccess(userTier, SubscriptionTier.ELITE);

  const [handicapEntries, consistencyDates, planVsActual] = await Promise.all([
    getHandicapEntries(12),
    getConsistencyData(84),
    getPlanVsActual(8),
  ]);

  return (
    <div>
      <Topbar title="Analyse" />
      <div className="p-6 max-w-4xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          <div className="space-y-6">
            {/* Handicap trend */}
            <Card title="Handicap-fremgang" icon={TrendingDown}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[var(--color-gold-muted)]">
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
              <p className="text-xs text-[var(--color-gold-muted)] mb-3">
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
                    <p className="text-xs text-[var(--color-gold-muted)]">
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
