"use client";

import { useState, useEffect } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { PeerRadarChart } from "./peer-radar-chart";
import { StatComparisonRow } from "./stat-comparison-row";
import { PeerSummary } from "./peer-summary";
import { SG_BENCHMARKS } from "@/lib/portal/golf/sg-benchmarks";
import { cn } from "@/lib/portal/utils/cn";

type SGStats = {
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
  avgScore?: number | null;
  fairwayPct?: number | null;
  girPct?: number | null;
  puttsPerGir?: number | null;
};

type TourPlayer = {
  id: number;
  name: string;
  sg: SGStats;
};

interface ComparisonSelectorProps {
  myStats: SGStats;
  peerData: {
    stats: SGStats;
    peerCount: number;
    myRoundCount: number;
    peerRoundCount: number;
    aboveAverageCount: number;
    totalSGCategories: number;
    skillLevelLabel: string;
  } | null;
}

type Mode = "peer" | "tour" | "tier";

const CARD_STYLE = {
  background: "rgba(10,25,41,0.7)",
  borderColor: "rgba(15,41,80,0.8)",
};

export function ComparisonSelector({ myStats, peerData }: ComparisonSelectorProps) {
  const [mode, setMode] = useState<Mode>(peerData ? "peer" : "tier");
  const [players, setPlayers] = useState<TourPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>(SG_BENCHMARKS[6].category); // default "E" Avansert

  // Fetch tour players when tour mode is activated
  useEffect(() => {
    if (mode !== "tour" || players.length > 0) return;
    setLoadingPlayers(true);
    setPlayerError(null);
    fetch("/portal/api/datagolf/players")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setPlayers(data.players ?? []);
        if (data.players?.length > 0) setSelectedPlayerId(data.players[0].id);
      })
      .catch((err) => setPlayerError(err.message ?? "Feil ved henting av spillere"))
      .finally(() => setLoadingPlayers(false));
  }, [mode, players.length]);

  // Derive comparison target stats
  const comparisonStats: SGStats | null = (() => {
    if (mode === "peer") return peerData?.stats ?? null;
    if (mode === "tour") {
      const p = players.find((pl) => pl.id === selectedPlayerId);
      return p?.sg ?? null;
    }
    // tier
    const b = SG_BENCHMARKS.find((b) => b.category === selectedTier);
    if (!b) return null;
    return {
      sgTotal: b.sg.total,
      sgOffTheTee: b.sg.offTheTee,
      sgApproach: b.sg.approach,
      sgAroundTheGreen: b.sg.aroundTheGreen,
      sgPutting: b.sg.putting,
    };
  })();

  const comparisonLabel = (() => {
    if (mode === "peer") return "Gruppe";
    if (mode === "tour") {
      const p = players.find((pl) => pl.id === selectedPlayerId);
      return p?.name ?? "Tour-spiller";
    }
    const b = SG_BENCHMARKS.find((b) => b.category === selectedTier);
    return b ? `Kat. ${b.category} — ${b.label}` : "Benchmark";
  })();

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const tabs: { key: Mode; label: string; disabled?: boolean }[] = [
    { key: "peer", label: "Peer-gruppe", disabled: !peerData },
    { key: "tour", label: "Tour-spiller" },
    { key: "tier", label: "Handicap-tier" },
  ];

  return (
    <div className="space-y-5">
      {/* Mode tabs */}
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => !tab.disabled && setMode(tab.key)}
            disabled={tab.disabled}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
              mode === tab.key
                ? "bg-[var(--color-gold)] text-white shadow-[0_2px_8px_rgba(184,151,92,0.3)]"
                : tab.disabled
                ? "bg-[var(--color-border)] text-[var(--color-text-tertiary)] cursor-not-allowed opacity-50"
                : "bg-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-gold-muted)] hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Selector for tour/tier */}
      {mode === "tour" && (
        <div
          className="rounded-2xl p-4 border space-y-3"
          style={CARD_STYLE}
        >
          {loadingPlayers ? (
            <div className="flex items-center gap-2 text-xs text-[var(--color-gold-muted)]">
              <Loader2 className="w-4 h-4 animate-spin" />
              Henter spillere...
            </div>
          ) : playerError ? (
            <div className="flex items-center gap-2 text-xs text-red-400">
              <AlertCircle className="w-4 h-4" />
              {playerError}
            </div>
          ) : (
            <>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Søk etter spiller..."
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
              />
              <select
                value={selectedPlayerId ?? ""}
                onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
                size={5}
              >
                {filteredPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      )}

      {mode === "tier" && (
        <div className="rounded-2xl p-4 border" style={CARD_STYLE}>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="w-full px-3 py-1.5 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] text-[var(--color-snow)] text-sm outline-none focus:border-[var(--color-gold)]"
          >
            {SG_BENCHMARKS.map((b) => (
              <option key={b.category} value={b.category}>
                {b.category} — {b.label} (HCP {b.handicapRange[0]}–{b.handicapRange[1]})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Peer summary — only in peer mode */}
      {mode === "peer" && peerData && (
        <PeerSummary
          skillLevelLabel={peerData.skillLevelLabel}
          peerCount={peerData.peerCount}
          aboveAverageCount={peerData.aboveAverageCount}
          totalCategories={peerData.totalSGCategories}
        />
      )}

      {/* Radar chart */}
      {comparisonStats && (
        <div className="rounded-2xl p-5 border" style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest">
              SG Profil vs. {comparisonLabel}
            </p>
            {mode === "peer" && peerData && (
              <p className="text-[10px] text-[var(--color-gold-muted)]">
                Dine {peerData.myRoundCount} runder vs. {peerData.peerRoundCount} runder i gruppen
              </p>
            )}
          </div>
          <PeerRadarChart
            myStats={myStats}
            peerStats={comparisonStats}
            comparisonLabel={comparisonLabel}
          />
        </div>
      )}

      {/* Detailed stats */}
      {comparisonStats && (
        <div className="rounded-2xl p-5 border" style={CARD_STYLE}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-[var(--color-snow-dim)]/50 uppercase tracking-widest">
              Detaljert sammenligning
            </p>
            <div className="flex gap-6 text-[10px] text-[var(--color-gold-muted)]">
              <span>Du</span>
              <span>{comparisonLabel}</span>
            </div>
          </div>
          <div className="space-y-1.5">
            {/* SG rows — always shown */}
            <StatComparisonRow label="SG Total" myValue={myStats.sgTotal ?? null} peerValue={comparisonStats.sgTotal ?? null} format={(v) => v.toFixed(2)} />
            <StatComparisonRow label="SG Off the Tee" myValue={myStats.sgOffTheTee ?? null} peerValue={comparisonStats.sgOffTheTee ?? null} format={(v) => v.toFixed(2)} />
            <StatComparisonRow label="SG Approach" myValue={myStats.sgApproach ?? null} peerValue={comparisonStats.sgApproach ?? null} format={(v) => v.toFixed(2)} />
            <StatComparisonRow label="SG Rundt Green" myValue={myStats.sgAroundTheGreen ?? null} peerValue={comparisonStats.sgAroundTheGreen ?? null} format={(v) => v.toFixed(2)} />
            <StatComparisonRow label="SG Putting" myValue={myStats.sgPutting ?? null} peerValue={comparisonStats.sgPutting ?? null} format={(v) => v.toFixed(2)} />

            {/* Extended rows — only in peer mode where data is available */}
            {mode === "peer" && peerData && (
              <>
                <StatComparisonRow label="Snitt Score" myValue={myStats.avgScore ?? null} peerValue={peerData.stats.avgScore ?? null} higherIsBetter={false} />
                <StatComparisonRow label="Fairway %" myValue={myStats.fairwayPct ?? null} peerValue={peerData.stats.fairwayPct ?? null} unit="%" format={(v) => `${v}`} />
                <StatComparisonRow label="GIR %" myValue={myStats.girPct ?? null} peerValue={peerData.stats.girPct ?? null} unit="%" format={(v) => `${v}`} />
                <StatComparisonRow label="Putts/GIR" myValue={myStats.puttsPerGir ?? null} peerValue={peerData.stats.puttsPerGir ?? null} higherIsBetter={false} format={(v) => v.toFixed(2)} />
              </>
            )}
          </div>
        </div>
      )}

      {!comparisonStats && mode === "tour" && !loadingPlayers && (
        <p className="text-xs text-center text-[var(--color-gold-muted)] py-8">
          Velg en spiller for å se sammenligning
        </p>
      )}
    </div>
  );
}
