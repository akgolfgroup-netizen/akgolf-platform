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
        <h1 className="text-2xl font-bold text-white">Statistikk</h1>
        <div className="flex gap-1 p-1 rounded-lg bg-[#F5F5F5]">
          {["7 dager", "30 dager", "90 dager", "1 ar"].map((period, idx) => (
            <button
              key={period}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                idx === 1
                  ? "bg-white shadow-sm text-[#171717]"
                  : "text-[#737373] hover:text-[#171717]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl space-y-4">
        {/* Handicap Chart */}
        <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[#171717]">Handicap-utvikling</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#171717]">
                {currentHandicap?.toFixed(1) ?? "12.4"}
              </span>
              <span className="text-xs font-medium text-green-500 flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                -0.6
              </span>
            </div>
          </div>
          <div className="h-[200px] flex items-center justify-center rounded-lg border-2 border-dashed border-[#D4D4D4] bg-[#F5F5F5]">
            <div className="text-center text-[#737373]">
              <TrendingDown className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Handicap-graf</p>
              <p className="text-[11px]">Viser trend over valgt periode</p>
            </div>
          </div>
        </div>

        {/* Two column: SG Radar and Training Volume */}
        <div className="grid grid-cols-2 gap-4">
          {/* Strokes Gained Radar */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Strokes Gained</span>
              <button className="w-6 h-6 rounded flex items-center justify-center text-[#737373] hover:bg-[#F5F5F5]">
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="h-[180px] w-[180px] mx-auto rounded-full border-2 border-dashed border-[#D4D4D4] flex items-center justify-center bg-[#F5F5F5]">
              <span className="text-xs text-[#737373]">SG Radar Chart</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 rounded-md bg-[#F5F5F5] text-center">
                <p className="text-[11px] text-[#737373]">Tee Total</p>
                <p className="font-semibold text-green-500">+{sgData.teeTotal.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-md bg-[#F5F5F5] text-center">
                <p className="text-[11px] text-[#737373]">Approach</p>
                <p className="font-semibold text-red-500">{sgData.approach.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-md bg-[#F5F5F5] text-center">
                <p className="text-[11px] text-[#737373]">Naerspill</p>
                <p className="font-semibold text-green-500">+{sgData.naerspill.toFixed(1)}</p>
              </div>
              <div className="p-2 rounded-md bg-[#F5F5F5] text-center">
                <p className="text-[11px] text-[#737373]">Putting</p>
                <p className="font-semibold text-orange-500">{sgData.putting.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* Training Volume */}
          <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-[#171717]">Treningsvolum</span>
            </div>
            <div className="h-[180px] flex items-center justify-center rounded-lg border-2 border-dashed border-[#D4D4D4] bg-[#F5F5F5]">
              <div className="text-center text-[#737373]">
                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">Ukentlig treningsvolum</p>
              </div>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-[#E5E5E5]">
              <div>
                <p className="text-[11px] text-[#737373]">Totalt denne mnd</p>
                <p className="font-semibold text-[#171717]">12 timer 30 min</p>
              </div>
              <div className="text-right">
                <p className="text-[11px] text-[#737373]">Snitt per uke</p>
                <p className="font-semibold text-[#171717]">3 timer 8 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Area Distribution */}
        <div className="rounded-lg p-4 bg-white border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-[#171717]">Fokusomrade-fordeling</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { name: "Putting", percent: 35 },
              { name: "Naerspill", percent: 28 },
              { name: "Approach", percent: 22 },
              { name: "Tee Total", percent: 15 },
            ].map((area) => (
              <div key={area.name} className="text-center">
                <div className="h-[100px] rounded-md bg-[#E5E5E5] relative overflow-hidden mb-2">
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#171717] transition-all"
                    style={{ height: `${area.percent}%` }}
                  />
                </div>
                <p className="text-xs font-medium text-[#171717]">{area.name}</p>
                <p className="text-xs text-[#737373]">{area.percent}%</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-md bg-yellow-50 border border-yellow-200">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600" />
              <span className="text-xs text-yellow-800">
                <strong>AI-anbefaling:</strong> Basert pa SG-data bor du oke fokus pa Approach-trening.
              </span>
            </div>
          </div>
        </div>

        {/* SG Explanation */}
        <details className="rounded-lg border border-[#E5E5E5] overflow-hidden bg-white">
          <summary className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-[#F5F5F5] transition-colors">
            <Info className="w-4 h-4 text-[#B8975C]" />
            <span className="text-sm font-medium text-[#171717]">Hva er Strokes Gained?</span>
          </summary>
          <div className="px-4 pb-4 pt-2 border-t border-[#E5E5E5]">
            <p className="text-sm text-[#525252] mb-4">
              {PORTAL_CONTENT.statistikk.sgExplanation.intro}
            </p>
            <div className="space-y-2">
              {PORTAL_CONTENT.statistikk.sgExplanation.categories.map((cat) => (
                <div key={cat.key} className="flex gap-3">
                  <span className="text-xs font-semibold text-[#B8975C] shrink-0 w-24">{cat.key}</span>
                  <span className="text-xs text-[#525252]">{cat.description}</span>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
