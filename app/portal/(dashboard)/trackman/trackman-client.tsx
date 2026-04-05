"use client";

import { useState, useRef, useTransition } from "react";
import { Upload, FileText, Camera, Target, BarChart3, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

interface ClubData {
  club: string;
  totalShots: number;
  avgCarry: number;
  avgTotal: number;
  avgOffline: number;
  avgClubSpeed: number | null;
  avgBallSpeed: number | null;
  avgSmashFactor: number | null;
  avgSpinRate: number | null;
  avgLaunchAngle: number | null;
  carryStdDev: number;
  lateralStdDev: number;
}

interface Props {
  clubData: ClubData[];
  sessionCount: number;
}

export function TrackManClient({ clubData, sessionCount }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"spredning" | "teknikk" | "import">("spredning");
  const [uploadResult, setUploadResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleCSVUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    startTransition(async () => {
      const res = await fetch("/api/portal/trackman/upload-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvContent: text }),
      });
      const data = await res.json();
      if (res.ok) {
        setUploadResult(data.message);
        router.refresh();
      } else {
        setUploadResult(`Feil: ${data.error}`);
      }
    });
  }

  const maxCarry = Math.max(...clubData.map((c) => c.avgCarry), 1);
  const maxLateral = Math.max(...clubData.map((c) => c.lateralStdDev * 2), 1);

  const tabs = [
    { id: "spredning" as const, label: "Spredning", icon: Target },
    { id: "teknikk" as const, label: "Teknikk", icon: BarChart3 },
    { id: "import" as const, label: "Import", icon: Upload },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-[var(--color-grey-100)] rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-[var(--color-grey-900)] shadow-sm"
                : "text-[var(--color-grey-500)] hover:text-[var(--color-grey-700)]"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Spredning */}
      {activeTab === "spredning" && (
        <div className="space-y-4">
          {clubData.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-8 text-center">
              <Target className="h-12 w-12 text-[var(--color-grey-300)] mx-auto" />
              <h3 className="text-lg font-semibold text-[var(--color-grey-700)] mt-4">
                Ingen TrackMan-data
              </h3>
              <p className="text-sm text-[var(--color-grey-500)] mt-2">
                Last opp CSV eller ta bilde av TrackMan-skjermen for a se spredningsanalyse
              </p>
              <button
                onClick={() => setActiveTab("import")}
                className="mt-4 px-6 py-2.5 rounded-full bg-[var(--color-brand)] text-white text-sm font-medium"
              >
                Last opp data
              </button>
            </div>
          ) : (
            <>
              {/* Spredningsdiagram — forenklet scatter-representasjon */}
              <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
                <h2 className="text-sm font-semibold text-[var(--color-grey-700)] mb-4">
                  Spredning per klubb (68% ellipse)
                </h2>
                <div className="space-y-4">
                  {clubData.map((club) => {
                    const widthPct = Math.min(100, (club.lateralStdDev * 2 / maxLateral) * 80 + 20);
                    const carryPct = (club.avgCarry / maxCarry) * 100;

                    return (
                      <div key={club.club} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-[var(--color-grey-600)] w-16 shrink-0 text-right">
                          {club.club}
                        </span>
                        <div className="flex-1 relative h-8 bg-[var(--color-grey-100)] rounded-lg">
                          {/* Carry bar */}
                          <div
                            className="absolute top-0 left-0 h-full bg-[var(--color-brand)]/20 rounded-lg"
                            style={{ width: `${carryPct}%` }}
                          />
                          {/* Spredningsellipse */}
                          <div
                            className="absolute top-1 h-6 bg-[var(--color-brand)]/40 rounded-full border border-[var(--color-brand)]"
                            style={{
                              left: `${carryPct - widthPct / 2}%`,
                              width: `${widthPct}%`,
                              maxWidth: "90%",
                            }}
                          />
                          {/* Center dot */}
                          <div
                            className="absolute top-2 w-4 h-4 rounded-full bg-[var(--color-brand)]"
                            style={{ left: `calc(${carryPct}% - 8px)` }}
                          />
                        </div>
                        <span className="text-xs text-[var(--color-grey-500)] w-20 shrink-0">
                          {club.avgCarry}m ±{club.lateralStdDev}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Klubb-gap */}
              <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
                <h2 className="text-sm font-semibold text-[var(--color-grey-700)] mb-4">
                  Klubb-gap analyse
                </h2>
                <div className="space-y-1">
                  {clubData.map((club, i) => {
                    const nextClub = clubData[i + 1];
                    const gap = nextClub ? Math.round(club.avgCarry - nextClub.avgCarry) : null;
                    const gapOk = gap !== null && gap >= 8 && gap <= 18;
                    const gapWarn = gap !== null && (gap > 20 || gap < 5);

                    return (
                      <div key={club.club}>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-sm font-medium text-[var(--color-grey-900)]">
                            {club.club}
                          </span>
                          <span className="text-sm text-[var(--color-grey-600)] tabular-nums">
                            {club.avgCarry}m carry
                          </span>
                        </div>
                        {gap !== null && (
                          <div
                            className={`text-xs text-center py-1 rounded ${
                              gapWarn
                                ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                                : gapOk
                                  ? "bg-[var(--color-success)]/10 text-[var(--color-success-text)]"
                                  : "bg-[var(--color-grey-100)] text-[var(--color-grey-500)]"
                            }`}
                          >
                            {gap}m gap {gapWarn ? "(for stort)" : gapOk ? "" : ""}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Teknikk */}
      {activeTab === "teknikk" && (
        <div className="space-y-4">
          {clubData.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-8 text-center">
              <BarChart3 className="h-12 w-12 text-[var(--color-grey-300)] mx-auto" />
              <h3 className="text-lg font-semibold text-[var(--color-grey-700)] mt-4">
                Ingen teknikkdata
              </h3>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-grey-100)]">
                    <th className="text-left px-4 py-3 font-medium text-[var(--color-grey-600)]">Klubb</th>
                    <th className="text-right px-3 py-3 font-medium text-[var(--color-grey-600)]">CS</th>
                    <th className="text-right px-3 py-3 font-medium text-[var(--color-grey-600)]">BS</th>
                    <th className="text-right px-3 py-3 font-medium text-[var(--color-grey-600)]">Smash</th>
                    <th className="text-right px-3 py-3 font-medium text-[var(--color-grey-600)]">Launch</th>
                    <th className="text-right px-3 py-3 font-medium text-[var(--color-grey-600)]">Spin</th>
                    <th className="text-right px-3 py-3 font-medium text-[var(--color-grey-600)]">Slag</th>
                  </tr>
                </thead>
                <tbody>
                  {clubData.map((club) => (
                    <tr key={club.club} className="border-t border-[var(--color-grey-100)]">
                      <td className="px-4 py-3 font-medium text-[var(--color-grey-900)]">
                        {club.club}
                      </td>
                      <td className="text-right px-3 py-3 text-[var(--color-grey-600)] tabular-nums">
                        {club.avgClubSpeed ?? "-"}
                      </td>
                      <td className="text-right px-3 py-3 text-[var(--color-grey-600)] tabular-nums">
                        {club.avgBallSpeed ?? "-"}
                      </td>
                      <td className="text-right px-3 py-3 text-[var(--color-grey-600)] tabular-nums">
                        {club.avgSmashFactor ?? "-"}
                      </td>
                      <td className="text-right px-3 py-3 text-[var(--color-grey-600)] tabular-nums">
                        {club.avgLaunchAngle ? `${club.avgLaunchAngle}°` : "-"}
                      </td>
                      <td className="text-right px-3 py-3 text-[var(--color-grey-600)] tabular-nums">
                        {club.avgSpinRate ?? "-"}
                      </td>
                      <td className="text-right px-3 py-3 text-[var(--color-grey-500)] tabular-nums">
                        {club.totalShots}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Import */}
      {activeTab === "import" && (
        <div className="space-y-4">
          {/* CSV Upload */}
          <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-[var(--color-brand)]" />
              <div>
                <h3 className="font-semibold text-[var(--color-grey-900)]">
                  Last opp CSV
                </h3>
                <p className="text-sm text-[var(--color-grey-500)]">
                  Eksporter fra TrackMan Range eller Performance Studio
                </p>
              </div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={isPending}
              className="w-full py-3 rounded-xl border-2 border-dashed border-[var(--color-grey-200)] text-[var(--color-grey-600)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-colors disabled:opacity-50"
            >
              {isPending ? "Laster opp..." : "Velg CSV-fil"}
            </button>
          </div>

          {/* Screenshot Upload */}
          <div className="bg-white rounded-2xl border border-[var(--color-grey-200)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="h-5 w-5 text-[var(--color-ai)]" />
              <div>
                <h3 className="font-semibold text-[var(--color-grey-900)]">
                  Ta bilde av skjermen
                </h3>
                <p className="text-sm text-[var(--color-grey-500)]">
                  AI leser TrackMan-data fra screenshot (Claude Vision)
                </p>
              </div>
            </div>
            <p className="text-xs text-[var(--color-grey-400)]">
              Kommer snart — ta et tydelig bilde av TrackMan-skjermen
            </p>
          </div>

          {/* Upload result */}
          {uploadResult && (
            <div className={`rounded-xl p-4 text-sm ${
              uploadResult.startsWith("Feil")
                ? "bg-[var(--color-error)]/10 text-[var(--color-error)]"
                : "bg-[var(--color-success)]/10 text-[var(--color-success-text)]"
            }`}>
              {uploadResult}
            </div>
          )}

          {/* Session count */}
          <div className="text-sm text-[var(--color-grey-500)] text-center">
            {sessionCount} TrackMan-okter registrert
          </div>
        </div>
      )}
    </div>
  );
}
