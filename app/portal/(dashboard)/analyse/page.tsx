import { requirePortalUser } from "@/lib/portal/auth";
import { TierGate } from "@/components/portal/ui/tier-gate";
import { getHandicapEntries } from "./actions";
import { ProgressChart } from "@/components/portal/heritage/progress-chart";
import { QuickAction } from "@/components/portal/heritage/quick-action";
import { StatCard } from "@/components/portal/heritage/stat-card";
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
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1c1c16]">Analyse</h1>
        <p className="text-[#6b7366] mt-1">Dyp innsikt i din golf-utvikling</p>
      </div>

      {/* Data load error */}
      {loadError && (
        <div role="alert" className="rounded-2xl p-4 border flex items-center gap-3 bg-[var(--color-error)]/10 border-[var(--color-error)]/30">
          <Info className="w-5 h-5 text-[var(--color-error)] flex-shrink-0" />
          <p className="text-sm text-[var(--color-error)] font-medium">
            Kunne ikke laste handicap-data. Prøv å laste siden på nytt.
          </p>
        </div>
      )}

      {/* Tier Gate for Pro Features */}
      {!isPro && (
        <div className="bg-gradient-to-br from-[#f59e0b]/10 to-[#f59e0b]/5 rounded-2xl p-6 border border-[#f59e0b]/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f59e0b]/20 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#1c1c16] mb-1">Oppgrader for full analyse</h3>
              <p className="text-sm text-[#6b7366] mb-3">
                Få tilgang til avansert statistikk, TrackMan-data, og AI-drevne anbefalinger med Pro-abonnement.
              </p>
              <button className="px-4 py-2 rounded-xl bg-[#f59e0b] text-white text-sm font-medium hover:bg-[#d97706] transition-colors">
                Oppgrader til Pro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="GIR" value="42%" trend={{ value: 5, label: "siste mnd" }} icon={Target} iconColor="#22c55e" />
        <StatCard label="Fairways" value="58%" trend={{ value: -2, label: "siste mnd" }} icon={Activity} iconColor="#3b82f6" />
        <StatCard label="Putts/runde" value="32.5" trend={{ value: -1.2, label: "siste mnd" }} icon={TrendingDown} iconColor="#22c55e" />
        <StatCard label=" scrambling" value="38%" trend={{ value: 3, label: "siste mnd" }} icon={BarChart3} iconColor="#f59e0b" />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart data={chartData} title="Handicap-trend" color="#154212" height={220} />
        
        {/* Strokes Gained Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
          <h3 className="font-semibold text-[#1c1c16] mb-4">Strokes Gained</h3>
          <div className="space-y-4">
            {[
              { label: "Off the Tee", value: 0.3, color: "#154212" },
              { label: "Approach", value: -0.5, color: "#3b82f6" },
              { label: "Around Green", value: 0.1, color: "#f59e0b" },
              { label: "Putting", value: -0.8, color: "#8b5cf6" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#6b7366]">{item.label}</span>
                  <span className={`text-sm font-medium ${item.value >= 0 ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                    {item.value > 0 ? "+" : ""}{item.value.toFixed(1)}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#f7f3ea] overflow-hidden">
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
        </div>
      </div>

      {/* TrackMan Data */}
      {isPro && (
        <div className="bg-white rounded-2xl p-6 border border-[#c2c9bb]/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#1c1c16]">TrackMan Data</h3>
            <button className="text-xs font-medium text-[#154212] hover:underline">Se alle sesjoner</button>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Klubbhastighet", value: "98.5", unit: "mph", club: "Driver" },
              { label: "Ballhastighet", value: "145.2", unit: "mph", club: "Driver" },
              { label: "Spin rate", value: "2450", unit: "rpm", club: "7-jern" },
              { label: "Launch angle", value: "12.5", unit: "°", club: "Driver" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 rounded-xl bg-[#f7f3ea]">
                <p className="text-xs text-[#8a9385] uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-[#1c1c16] mt-1">
                  {stat.value} <span className="text-sm text-[#8a9385]">{stat.unit}</span>
                </p>
                <p className="text-xs text-[#6b7366] mt-1">{stat.club}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h3 className="text-sm font-semibold text-[#1c1c16] mb-4">Handlinger</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <QuickAction href="/portal/trackman" icon={Upload} label="Last opp TrackMan" description="Importer nye data" />
          <QuickAction href="/portal/statistikk/ny-runde" icon={Target} label="Registrer runde" description="Logg ny score" />
          <QuickAction href="/portal/ai-coach" icon={Lightbulb} label="Be om analyse" description="AI-vurdering" />
        </div>
      </div>

      {/* Info */}
      <details className="group bg-white rounded-2xl border border-[#c2c9bb]/50 overflow-hidden">
        <summary className="flex items-center gap-3 p-4 cursor-pointer list-none hover:bg-[#f7f3ea] transition-colors">
          <Info className="w-5 h-5 text-[#6b7366]" />
          <span className="font-medium text-[#1c1c16]">Om Strokes Gained</span>
          <ChevronRight className="w-5 h-5 text-[#8a9385] ml-auto transition-transform group-open:rotate-90" />
        </summary>
        <div className="p-4 pt-0 border-t border-[#c2c9bb]/30">
          <p className="text-sm text-[#6b7366] mt-4">
            Strokes Gained er en statistisk metode som måler hvor mange slag du sparer eller taper 
            sammenlignet med referansenivået (typisk PGA Tour-gjennomsnitt eller ditt handicap-nivå).
            Positive tall betyr at du er bedre enn gjennomsnittet, negative tall betyr at du har forbedringspotensial.
          </p>
        </div>
      </details>
    </div>
  );
}
