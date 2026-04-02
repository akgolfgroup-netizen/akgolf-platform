import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { HandicapChart } from "@/components/portal/analyse/handicap-chart";
import { ConsistencyHeatmap } from "@/components/portal/analyse/consistency-heatmap";
import { PlanVsActualChart } from "@/components/portal/analyse/plan-vs-actual-chart";
import { AIWeaknessCard } from "@/components/portal/analyse/ai-weakness-card";
import { AddHandicapForm } from "@/components/portal/analyse/add-handicap-form";
import { DegradationCurve } from "@/components/portal/analyse/degradation-curve";
import { TekSlagSpillGap } from "@/components/portal/analyse/tek-slag-spill-gap";
import { EnvironmentDistribution } from "@/components/portal/analyse/environment-distribution";
import { LPhaseProgress, type LPhaseEntry } from "@/components/portal/analyse/l-phase-progress";
import {
  getHandicapEntries,
  getConsistencyData,
  getPlanVsActual,
} from "./actions";
import {
  calculateDegradation,
  getTekSlagSpillGap,
  getEnvironmentDistribution,
  type DegradationCurve as DegradationCurveData,
  type TekSlagSpillGap as TekSlagSpillGapData,
} from "@/lib/portal/training/degradation-service";
import {
  getAllLPhasesForUser,
  getLPhaseHistory,
  type ShotType,
} from "@/lib/portal/training/l-phase-service";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";
import { TrendingDown, Activity, BarChart2, Sparkles, Info, Layers } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

function Card({ title, icon: Icon, children }: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl p-5 bg-[var(--color-grey-100)] border border-[var(--color-grey-200)]">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-4 h-4 text-[var(--color-grey-900)]" />
        <h2 className="text-sm font-semibold text-[var(--color-grey-900)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default async function AnalysePage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const isElite = hasTierAccess(userTier, SubscriptionTier.ELITE);
  const isPro = hasTierAccess(userTier, SubscriptionTier.PRO);

  const [handicapEntries, consistencyDates, planVsActual] = await Promise.all([
    getHandicapEntries(12),
    getConsistencyData(84),
    getPlanVsActual(8),
  ]);

  // Foundation Method data (only fetch if PRO+ tier)
  let degradationData: Record<ShotType, DegradationCurveData> | null = null;
  let tekSlagSpillData: Record<ShotType, TekSlagSpillGapData> | null = null;
  let environmentData: Awaited<ReturnType<typeof getEnvironmentDistribution>> | null = null;
  let lPhaseCurrentData: Record<ShotType, LPhaseEntry | null> | null = null;
  let lPhaseHistoryData: Record<ShotType, LPhaseEntry[]> | null = null;

  if (isPro && user?.id) {
    const [
      degradationDriver,
      degradationIron,
      degradationWedge,
      degradationPutt,
      gapDriver,
      gapIron,
      gapWedge,
      gapPutt,
      envDistribution,
      lPhaseMap,
      historyDriver,
      historyIron,
      historyWedge,
      historyPutt,
    ] = await Promise.all([
      calculateDegradation(user.id, "DRIVER"),
      calculateDegradation(user.id, "IRON"),
      calculateDegradation(user.id, "WEDGE"),
      calculateDegradation(user.id, "PUTT"),
      getTekSlagSpillGap(user.id, "DRIVER"),
      getTekSlagSpillGap(user.id, "IRON"),
      getTekSlagSpillGap(user.id, "WEDGE"),
      getTekSlagSpillGap(user.id, "PUTT"),
      getEnvironmentDistribution(user.id),
      getAllLPhasesForUser(user.id),
      getLPhaseHistory(user.id, "DRIVER"),
      getLPhaseHistory(user.id, "IRON"),
      getLPhaseHistory(user.id, "WEDGE"),
      getLPhaseHistory(user.id, "PUTT"),
    ]);

    degradationData = {
      DRIVER: degradationDriver,
      IRON: degradationIron,
      WEDGE: degradationWedge,
      PUTT: degradationPutt,
    };

    tekSlagSpillData = {
      DRIVER: gapDriver,
      IRON: gapIron,
      WEDGE: gapWedge,
      PUTT: gapPutt,
    };

    environmentData = envDistribution;

    // Transform L-phase data to LPhaseEntry format
    const transformLPhase = (entry: Awaited<ReturnType<typeof getAllLPhasesForUser>> extends Map<ShotType, infer T> ? T : never): LPhaseEntry => ({
      shotType: entry.shotType,
      lPhase: entry.lPhase,
      setAt: entry.setAt,
      setBy: entry.setBy,
      notes: entry.notes,
    });

    const transformHistory = (entries: Awaited<ReturnType<typeof getLPhaseHistory>>): LPhaseEntry[] =>
      entries.map((entry) => ({
        shotType: entry.shotType,
        lPhase: entry.lPhase,
        setAt: entry.setAt,
        setBy: entry.setBy,
        notes: entry.notes,
      }));

    lPhaseCurrentData = {
      DRIVER: lPhaseMap.get("DRIVER") ? transformLPhase(lPhaseMap.get("DRIVER")!) : null,
      IRON: lPhaseMap.get("IRON") ? transformLPhase(lPhaseMap.get("IRON")!) : null,
      WEDGE: lPhaseMap.get("WEDGE") ? transformLPhase(lPhaseMap.get("WEDGE")!) : null,
      PUTT: lPhaseMap.get("PUTT") ? transformLPhase(lPhaseMap.get("PUTT")!) : null,
    };

    lPhaseHistoryData = {
      DRIVER: transformHistory(historyDriver),
      IRON: transformHistory(historyIron),
      WEDGE: transformHistory(historyWedge),
      PUTT: transformHistory(historyPutt),
    };
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">Analyse</h1>

      <div className="max-w-4xl">
        <TierGate userTier={userTier} required={SubscriptionTier.PRO}>
          <div className="space-y-6">
            {/* AI-analyse info */}
            <details className="rounded-2xl bg-[var(--color-grey-100)] border border-[var(--color-grey-200)] group">
              <summary className="flex items-center gap-2 px-5 py-4 cursor-pointer list-none">
                <Info className="w-4 h-4 text-[var(--color-grey-900)]" />
                <span className="text-sm font-medium text-[var(--color-grey-900)]">Om AI-analyse</span>
                <span className="ml-auto text-xs text-[var(--color-grey-400)] group-open:hidden">Vis mer</span>
                <span className="ml-auto text-xs text-[var(--color-grey-400)] hidden group-open:inline">Skjul</span>
              </summary>
              <div className="px-5 pb-5 space-y-3">
                <p className="text-sm text-[var(--color-grey-400)]">
                  {PORTAL_CONTENT.analyse.aiIntro}
                </p>
                <div className="pt-2 border-t border-[var(--color-grey-200)]">
                  <p className="text-xs font-semibold text-[var(--color-grey-400)] uppercase tracking-widest mb-1">
                    Svakhetsanalyse
                  </p>
                  <p className="text-sm text-[var(--color-grey-400)]">
                    {PORTAL_CONTENT.analyse.weaknessExplanation}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[var(--color-grey-400)] uppercase tracking-widest mb-1">
                    Fokusanbefaling
                  </p>
                  <p className="text-sm text-[var(--color-grey-400)]">
                    {PORTAL_CONTENT.analyse.focusRecommendation}
                  </p>
                </div>
              </div>
            </details>
            {/* Handicap trend */}
            <Card title="Handicap-fremgang" icon={TrendingDown}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-[var(--color-grey-400)]">
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
              <p className="text-xs text-[var(--color-grey-400)] mb-3">
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
                    <p className="text-xs text-[var(--color-grey-400)]">
                      Krever Elite-abonnement
                    </p>
                  </Card>
                </TierGate>
              )}
            </div>

            {/* The Foundation Method Section */}
            {degradationData && tekSlagSpillData && environmentData && lPhaseCurrentData && lPhaseHistoryData && (
              <div className="space-y-6 pt-6 border-t border-[var(--color-grey-200)]">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[var(--color-grey-900)]" />
                  <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">
                    The Foundation Method
                  </h2>
                </div>

                {/* Degradation Curve */}
                <Card title="Degraderingskurve" icon={TrendingDown}>
                  <p className="text-xs text-[var(--color-grey-400)] mb-3">
                    Viser hvordan teknikk endres fra lav til hoy hastighet og press
                  </p>
                  <DegradationCurve data={degradationData} />
                </Card>

                {/* TEK-SLAG-SPILL Gap */}
                <Card title="TEK-SLAG-SPILL Gap" icon={BarChart2}>
                  <p className="text-xs text-[var(--color-grey-400)] mb-3">
                    Analyse av teknikkfall mellom pyramideniva
                  </p>
                  <TekSlagSpillGap data={tekSlagSpillData} />
                </Card>

                {/* Environment Distribution */}
                <Card title="Treningsmilje-fordeling" icon={Activity}>
                  <p className="text-xs text-[var(--color-grey-400)] mb-3">
                    Fordeling av trening pa tvers av M0-M5 miljer
                  </p>
                  <EnvironmentDistribution data={environmentData} />
                </Card>

                {/* L-Phase Progress */}
                <Card title="L-fase fremgang" icon={Layers}>
                  <p className="text-xs text-[var(--color-grey-400)] mb-3">
                    Laringsfase for hver slagtype (KROPP - ARM - KOLLE - BALL - AUTO)
                  </p>
                  <LPhaseProgress
                    currentPhases={lPhaseCurrentData}
                    history={lPhaseHistoryData}
                  />
                </Card>
              </div>
            )}
          </div>
        </TierGate>
      </div>
    </div>
  );
}
