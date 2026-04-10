import { requirePortalUser } from "@/lib/portal/auth";
import { getHandicapEntries } from "./actions";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { PortalHeader, PortalCard, PremiumStatCard } from "@/components/portal/premium";
import {
  TrendingDown,
  Target,
  Activity,
  BarChart3,
  Upload,
  Lightbulb,
  Info,
  ChevronRight,
} from "lucide-react";
import { SubscriptionTier } from "@prisma/client";
import { hasTierAccess } from "@/lib/portal/rbac";

export default async function AnalysePage() {
  const user = await requirePortalUser();
  const userTier = (user?.subscriptionTier ?? "VISITOR") as SubscriptionTier;
  const isPro = hasTierAccess(userTier, SubscriptionTier.PRO);

  let chartData: { date: string; value: number }[] = [];
  let loadError = false;

  try {
    const handicapEntries = await getHandicapEntries(12);
    chartData = handicapEntries.map((entry) => ({
      date: entry.date.toISOString(),
      value: entry.handicapIndex,
    }));
  } catch {
    loadError = true;
  }

  return (
    <div className="space-y-8">
      <PortalHeader
        label="Analyse"
        title="Analyse"
        description="Dyp innsikt i din golf-utvikling"
      />

      {/* Data load error */}
      {loadError && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-2xl border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 p-4"
        >
          <Info className="h-5 w-5 flex-shrink-0 text-[var(--color-error)]" />
          <p className="text-sm font-medium text-[var(--color-error)]">
            Kunne ikke laste handicap-data. Prov a laste siden pa nytt.
          </p>
        </div>
      )}

      {/* Tier Gate for Pro Features */}
      {!isPro && (
        <div className="rounded-[24px] border border-[var(--color-warning)]/20 bg-gradient-to-br from-[var(--color-warning)]/10 to-[var(--color-warning)]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-warning)]/20">
              <Lightbulb className="h-6 w-6 text-[var(--color-warning)]" />
            </div>
            <div className="flex-1">
              <h3 className="mb-1 font-semibold text-[var(--color-text)]">
                Oppgrader for full analyse
              </h3>
              <p className="mb-3 text-sm text-[var(--color-muted)]">
                Fa tilgang til avansert statistikk, TrackMan-data, og AI-drevne anbefalinger med
                Pro-abonnement.
              </p>
              <button className="rounded-xl bg-[var(--color-warning)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
                Oppgrader til Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <PremiumStatCard label="GIR" value={42} unit="%" icon={Target} trend={5} trendLabel="siste mnd" />
        <PremiumStatCard
          label="Fairways"
          value={58}
          unit="%"
          icon={Activity}
          trend={-2}
          trendLabel="siste mnd"
        />
        <PremiumStatCard
          label="Putts/runde"
          value={32.5}
          decimals={1}
          icon={TrendingDown}
          lowerIsBetter
          trend={-1.2}
          trendLabel="siste mnd"
        />
        <PremiumStatCard
          label="Scrambling"
          value={38}
          unit="%"
          icon={BarChart3}
          trend={3}
          trendLabel="siste mnd"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PortalCard>
          <ProgressChart
            data={chartData}
            title="Handicap-trend"
            color="var(--color-primary)"
            height={220}
          />
        </PortalCard>

        {/* Strokes Gained Breakdown */}
        <PortalCard>
          <h3 className="mb-4 font-semibold text-[var(--color-text)]">Strokes Gained</h3>
          <div className="space-y-4">
            {[
              { label: "Off the Tee", value: 0.3, color: "var(--color-primary)" },
              { label: "Approach", value: -0.5, color: "var(--color-primary)" },
              { label: "Around Green", value: 0.1, color: "var(--color-warning)" },
              { label: "Putting", value: -0.8, color: "var(--color-ai)" },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm text-[var(--color-muted)]">{item.label}</span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color:
                        item.value >= 0
                          ? "var(--color-success)"
                          : "var(--color-error)",
                    }}
                  >
                    {item.value > 0 ? "+" : ""}
                    {item.value.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--color-surface)]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(Math.abs(item.value) * 50, 100)}%`,
                      backgroundColor: item.color,
                      marginLeft: item.value < 0 ? "auto" : 0,
                      marginRight: item.value < 0 ? 0 : "auto",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </PortalCard>
      </div>

      {/* TrackMan Data */}
      {isPro && (
        <PortalCard>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[var(--color-text)]">TrackMan Data</h3>
            <button className="text-xs font-medium text-[var(--color-primary)] hover:underline">
              Se alle sesjoner
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Klubbhastighet", value: "98.5", unit: "mph", club: "Driver" },
              { label: "Ballhastighet", value: "145.2", unit: "mph", club: "Driver" },
              { label: "Spin rate", value: "2450", unit: "rpm", club: "7-jern" },
              { label: "Launch angle", value: "12.5", unit: "°", club: "Driver" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl bg-[var(--color-surface)] p-4">
                <p className="text-xs uppercase tracking-wider text-[var(--color-muted)]">
                  {stat.label}
                </p>
                <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">
                  {stat.value}{" "}
                  <span className="text-sm text-[var(--color-muted)]">{stat.unit}</span>
                </p>
                <p className="mt-1 text-xs text-[var(--color-muted)]">{stat.club}</p>
              </div>
            ))}
          </div>
        </PortalCard>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">Handlinger</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickAction
            href="/portal/trackman"
            icon={Upload}
            label="Last opp TrackMan"
            description="Importer nye data"
          />
          <QuickAction
            href="/portal/statistikk/ny-runde"
            icon={Target}
            label="Registrer runde"
            description="Logg ny score"
          />
          <QuickAction
            href="/portal/ai-coach"
            icon={Lightbulb}
            label="Be om analyse"
            description="AI-vurdering"
          />
        </div>
      </div>

      {/* Info */}
      <details className="group overflow-hidden rounded-[24px] border border-black/5 bg-white">
        <summary className="flex cursor-pointer list-none items-center gap-3 p-4 transition-colors hover:bg-[var(--color-surface)]">
          <Info className="h-5 w-5 text-[var(--color-muted)]" />
          <span className="font-medium text-[var(--color-text)]">Om Strokes Gained</span>
          <ChevronRight className="ml-auto h-5 w-5 text-[var(--color-muted)] transition-transform group-open:rotate-90" />
        </summary>
        <div className="border-t border-black/5 p-4 pt-0">
          <p className="mt-4 text-sm text-[var(--color-muted)]">
            Strokes Gained er en statistisk metode som maler hvor mange slag du sparer eller taper
            sammenlignet med referansenivaet (typisk PGA Tour-gjennomsnitt eller ditt
            handicap-niva). Positive tall betyr at du er bedre enn gjennomsnittet, negative tall
            betyr at du har forbedringspotensial.
          </p>
        </div>
      </details>
    </div>
  );
}
