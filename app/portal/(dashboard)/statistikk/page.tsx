import { requirePortalUser } from "@/lib/portal/auth";
import { getStatsAggregates } from "./actions";
import { getHandicapHistory } from "@/app/portal/(dashboard)/profil/actions";
import { BarChart3, Info, TrendingDown, Lightbulb } from "lucide-react";
import { PORTAL_CONTENT } from "@/lib/website-constants";

export default async function StatistikkPage() {
  await requirePortalUser();

  const [aggregates, handicapHistory] = await Promise.all([
    getStatsAggregates(),
    getHandicapHistory(12),
  ]);

  const currentHandicap = handicapHistory.length > 0
    ? handicapHistory[handicapHistory.length - 1].handicapIndex
    : null;

  // Demo data for wireframe visualization
  const sgData = {
    teeTotal: aggregates?.avgSgOffTheTee ?? 0.8,
    approach: aggregates?.avgSgApproach ?? -0.3,
    naerspill: aggregates?.avgSgAroundTheGreen ?? 0.2,
    putting: aggregates?.avgSgPutting ?? -0.1,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--portal-text-primary)]">Statistikk</h1>
        <div className="flex gap-1 p-1 rounded-lg bg-[var(--portal-surface-sunken)]">
          {["7 dager", "30 dager", "90 dager", "1 ar"].map((period, idx) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                idx === 1
                  ? "bg-[var(--portal-card-bg-solid)] text-[var(--portal-text-primary)] shadow-sm"
                  : "text-[var(--portal-text-muted)] hover:text-[var(--portal-text-primary)]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl space-y-4">
        {/* Handicap Chart */}
        <div className="portal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--portal-text-primary)]">Handicap-utvikling</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[var(--portal-text-primary)]">
                {currentHandicap?.toFixed(1) ?? "12.4"}
              </span>
              <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                -0.6
              </span>
            </div>
          </div>
          <div className="h-[200px] flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--portal-card-border)] bg-[var(--portal-surface-sunken)]">
            <div className="text-center text-[var(--portal-text-muted)]">
              <TrendingDown className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Handicap-graf</p>
              <p className="text-[11px]">Viser trend over valgt periode</p>
            </div>
          </div>
        </div>

        {/* Two column: SG Radar and Training Volume */}
        <div className="grid grid-cols-2 gap-4">
          {/* Strokes Gained Radar */}
          <div className="portal-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[var(--portal-text-primary)]">Strokes Gained</span>
              <button className="w-6 h-6 rounded flex items-center justify-center text-[var(--portal-text-muted)] hover:bg-[var(--portal-surface-raised)]">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-[180px] w-[180px] mx-auto rounded-full border-2 border-dashed border-[var(--portal-card-border)] flex items-center justify-center bg-[var(--portal-surface-sunken)]">
              <span className="text-xs text-[var(--portal-text-muted)]">SG Radar Chart</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 rounded-md bg-[var(--portal-surface-raised)] text-center">
                <p className="text-[11px] text-[var(--portal-text-muted)]">Tee Total</p>
                <p className="font-semibold text-green-500">+{sgData.teeTotal.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-md bg-[var(--portal-surface-raised)] text-center">
                <p className="text-[11px] text-[var(--portal-text-muted)]">Approach</p>
                <p className="font-semibold text-red-500">{sgData.approach.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-md bg-[var(--portal-surface-raised)] text-center">
                <p className="text-[11px] text-[var(--portal-text-muted)]">Naerspill</p>
                <p className="font-semibold text-green-500">+{sgData.naerspill.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-md bg-[var(--portal-surface-raised)] text-center">
                <p className="text-[11px] text-[var(--portal-text-muted)]">Putting</p>
                <p className="font-semibold text-orange-500">{sgData.putting.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Training Volume */}
          <div className="portal-card rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[var(--portal-text-primary)]">Treningsvolum</span>
            </div>
            <div className="h-[180px] flex items-center justify-center rounded-lg border-2 border-dashed border-[var(--portal-card-border)] bg-[var(--portal-surface-sunken)]">
              <div className="text-center text-[var(--portal-text-muted)]">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Ukentlig treningsvolum</p>
              </div>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-[var(--portal-card-border)]">
              <div>
                <p className="text-[11px] text-[var(--portal-text-muted)]">Totalt denne mnd</p>
                <p className="font-semibold text-[var(--portal-text-primary)]">12 timer 30 min</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[var(--portal-text-muted)]">Snitt per uke</p>
                <p className="font-semibold text-[var(--portal-text-primary)]">3 timer 8 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Area Distribution */}
        <div className="portal-card rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[var(--portal-text-primary)]">Fokusomrade-fordeling</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: "Putting", percent: 35 },
              { name: "Naerspill", percent: 28 },
              { name: "Approach", percent: 22 },
              { name: "Tee Total", percent: 15 },
            ].map((area) => (
              <div key={area.name} className="text-center">
                <div className="h-[100px] rounded-md bg-[var(--portal-surface-sunken)] relative overflow-hidden mb-2">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[var(--portal-accent)] transition-all"
                    style={{ height: `${area.percent}%` }}
                  />
                </div>
                <p className="text-xs font-medium text-[var(--portal-text-primary)]">{area.name}</p>
                <p className="text-xs text-[var(--portal-text-muted)]">{area.percent}%</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-md bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-yellow-300">
                <strong>AI-anbefaling:</strong> Basert pa SG-data bor du oke fokus pa Approach-trening.
              </span>
            </div>
          </div>
        </div>

        {/* SG Explanation */}
        <details className="portal-card rounded-lg overflow-hidden">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-[var(--portal-surface-raised)] transition-colors">
            <Info className="w-4 h-4 text-[var(--portal-accent)]" />
            <span className="text-sm font-medium text-[var(--portal-text-primary)]">Hva er Strokes Gained?</span>
          </summary>
          <div className="px-4 pb-4 pt-2 border-t border-[var(--portal-card-border)]">
            <p className="text-sm text-[var(--portal-text-secondary)] mb-4">
              {PORTAL_CONTENT.statistikk.sgExplanation.intro}
            </p>
            <div className="space-y-2">
              {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
                <div key={cat.key} className="flex gap-3">
                  <span className="text-xs font-semibold text-[var(--portal-accent)] shrink-0 w-24">{cat.key}</span>
                  <span className="text-xs text-[var(--portal-text-secondary)]">{cat.description}</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
