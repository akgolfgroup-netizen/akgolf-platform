"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Flag, Target, Circle, TrendingUp } from "lucide-react";
import { PeerRadarChart } from "./peer-radar-chart";
import { StatComparisonRow } from "./stat-comparison-row";
import { PeerSummary } from "./peer-summary";
import { SG_BENCHMARKS } from "@/lib/portal/golf/sg-benchmarks";
import { cn } from "@/lib/portal/utils/cn";
import {
  GlassCard,
  DarkStatCard,
  staggerContainer,
  fadeInUp,
} from "@/components/portal/premium";

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

function calcTrend(mine: number | null, theirs: number | null): number | null {
  if (mine === null || theirs === null) return null;
  return Number((mine - theirs).toFixed(2));
}

export function ComparisonSelector({ myStats, peerData }: ComparisonSelectorProps) {
  const [mode, setMode] = useState<Mode>(peerData ? "peer" : "tier");
  const [players, setPlayers] = useState<TourPlayer[]>([]);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
  const [selectedTier, setSelectedTier] = useState<string>(SG_BENCHMARKS[6].category);

  useEffect(() => {
    if (mode !== "tour" || players.length > 0) return;

    const fetchPlayers = async () => {
      setLoadingPlayers(true);
      setPlayerError(null);

      try {
        const response = await fetch("/portal/api/datagolf/players");
        const data = await response.json();

        if (data.error) throw new Error(data.error);
        setPlayers(data.players ?? []);
        if (data.players?.length > 0) setSelectedPlayerId(data.players[0].id);
      } catch (err) {
        setPlayerError(
          err instanceof Error ? err.message : "Feil ved henting av spillere"
        );
      } finally {
        setLoadingPlayers(false);
      }
    };

    void Promise.resolve().then(fetchPlayers);
  }, [mode, players.length]);

  const comparisonStats: SGStats | null = (() => {
    if (mode === "peer") return peerData?.stats ?? null;
    if (mode === "tour") {
      const p = players.find((pl) => pl.id === selectedPlayerId);
      return p?.sg ?? null;
    }
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="space-y-6"
    >
      {/* Mode tabs — glassmorphism pill */}
      <motion.div variants={fadeInUp}>
        <div className="inline-flex gap-1 p-1 rounded-full bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_24px_-12px_rgba(10,31,24,0.15)]">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => !tab.disabled && setMode(tab.key)}
              disabled={tab.disabled}
              className={cn(
                "px-5 py-2 rounded-full text-[12px] font-semibold transition-all duration-200",
                mode === tab.key
                  ? "bg-[var(--color-primary)] text-white shadow-[0_4px_16px_-4px_rgba(0,88,64,0.3)]"
                  : tab.disabled
                    ? "text-[var(--color-muted)] cursor-not-allowed opacity-50"
                    : "text-[var(--color-text)] hover:text-[var(--color-primary)]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Selector for tour/tier */}
      {mode === "tour" && (
        <motion.div variants={fadeInUp}>
          <GlassCard variant="light" padding="md" className="space-y-3">
            {loadingPlayers ? (
              <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                <Loader2 className="w-4 h-4 animate-spin" />
                Henter spillere…
              </div>
            ) : playerError ? (
              <div className="flex items-center gap-2 text-sm text-[var(--color-error)]">
                <AlertCircle className="w-4 h-4" />
                {playerError}
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Søk etter spiller…"
                  className="w-full px-4 py-2 rounded-xl bg-white border border-black/10 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-primary)]/40 transition-colors"
                />
                <select
                  value={selectedPlayerId ?? ""}
                  onChange={(e) => setSelectedPlayerId(Number(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl bg-white border border-black/10 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]/40 transition-colors"
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
          </GlassCard>
        </motion.div>
      )}

      {mode === "tier" && (
        <motion.div variants={fadeInUp}>
          <GlassCard variant="light" padding="md">
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-white border border-black/10 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]/40 transition-colors"
            >
              {SG_BENCHMARKS.map((b) => (
                <option key={b.category} value={b.category}>
                  {b.category} — {b.label} (HCP {b.handicapRange[0]}–{b.handicapRange[1]})
                </option>
              ))}
            </select>
          </GlassCard>
        </motion.div>
      )}

      {/* Peer summary — only in peer mode */}
      {mode === "peer" && peerData && (
        <motion.div variants={fadeInUp}>
          <PeerSummary
            skillLevelLabel={peerData.skillLevelLabel}
            peerCount={peerData.peerCount}
            aboveAverageCount={peerData.aboveAverageCount}
            totalCategories={peerData.totalSGCategories}
          />
        </motion.div>
      )}

      {/* Key stat cards (peer mode only — requires extended data) */}
      {mode === "peer" && peerData && (
        <motion.div
          variants={fadeInUp}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <DarkStatCard
            label="SG Total"
            value={myStats.sgTotal ?? 0}
            decimals={2}
            trend={calcTrend(myStats.sgTotal, peerData.stats.sgTotal)}
            trendLabel="vs gruppe"
            icon={TrendingUp}
            variant="primary"
            delay={0}
          />
          <DarkStatCard
            label="Snitt Score"
            value={myStats.avgScore ?? 0}
            decimals={1}
            trend={calcTrend(myStats.avgScore ?? null, peerData.stats.avgScore ?? null)}
            trendLabel="vs gruppe"
            lowerIsBetter
            icon={Flag}
            variant="default"
            delay={0.08}
          />
          <DarkStatCard
            label="GIR"
            value={myStats.girPct ?? 0}
            unit="%"
            trend={calcTrend(myStats.girPct ?? null, peerData.stats.girPct ?? null)}
            trendLabel="vs gruppe"
            icon={Target}
            variant="default"
            delay={0.16}
          />
          <DarkStatCard
            label="Putts/GIR"
            value={myStats.puttsPerGir ?? 0}
            decimals={2}
            trend={calcTrend(myStats.puttsPerGir ?? null, peerData.stats.puttsPerGir ?? null)}
            trendLabel="vs gruppe"
            lowerIsBetter
            icon={Circle}
            variant="accent"
            delay={0.24}
          />
        </motion.div>
      )}

      {/* Radar chart */}
      {comparisonStats && (
        <motion.div variants={fadeInUp}>
          <GlassCard variant="light" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase flex items-center gap-2">
                <span className="w-6 h-px bg-[var(--color-muted)]" />
                SG-profil vs. {comparisonLabel}
              </p>
              {mode === "peer" && peerData && (
                <p className="text-[11px] text-[var(--color-muted)]">
                  {peerData.myRoundCount} runder vs. {peerData.peerRoundCount} runder
                </p>
              )}
            </div>
            <PeerRadarChart
              myStats={myStats}
              peerStats={comparisonStats}
              comparisonLabel={comparisonLabel}
            />
          </GlassCard>
        </motion.div>
      )}

      {/* Detailed stats */}
      {comparisonStats && (
        <motion.div variants={fadeInUp}>
          <GlassCard variant="light" padding="lg">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold tracking-[0.22em] text-[var(--color-muted)] uppercase flex items-center gap-2">
                <span className="w-6 h-px bg-[var(--color-muted)]" />
                Detaljert sammenligning
              </p>
              <div className="flex gap-6 text-[11px] text-[var(--color-muted)]">
                <span>Du</span>
                <span>{comparisonLabel}</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <StatComparisonRow label="SG Total" myValue={myStats.sgTotal ?? null} peerValue={comparisonStats.sgTotal ?? null} format={(v) => v.toFixed(2)} />
              <StatComparisonRow label="SG Off the Tee" myValue={myStats.sgOffTheTee ?? null} peerValue={comparisonStats.sgOffTheTee ?? null} format={(v) => v.toFixed(2)} />
              <StatComparisonRow label="SG Approach" myValue={myStats.sgApproach ?? null} peerValue={comparisonStats.sgApproach ?? null} format={(v) => v.toFixed(2)} />
              <StatComparisonRow label="SG Rundt Green" myValue={myStats.sgAroundTheGreen ?? null} peerValue={comparisonStats.sgAroundTheGreen ?? null} format={(v) => v.toFixed(2)} />
              <StatComparisonRow label="SG Putting" myValue={myStats.sgPutting ?? null} peerValue={comparisonStats.sgPutting ?? null} format={(v) => v.toFixed(2)} />

              {mode === "peer" && peerData && (
                <>
                  <StatComparisonRow label="Snitt Score" myValue={myStats.avgScore ?? null} peerValue={peerData.stats.avgScore ?? null} higherIsBetter={false} />
                  <StatComparisonRow label="Fairway %" myValue={myStats.fairwayPct ?? null} peerValue={peerData.stats.fairwayPct ?? null} unit="%" format={(v) => `${v}`} />
                  <StatComparisonRow label="GIR %" myValue={myStats.girPct ?? null} peerValue={peerData.stats.girPct ?? null} unit="%" format={(v) => `${v}`} />
                  <StatComparisonRow label="Putts/GIR" myValue={myStats.puttsPerGir ?? null} peerValue={peerData.stats.puttsPerGir ?? null} higherIsBetter={false} format={(v) => v.toFixed(2)} />
                </>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}

      {!comparisonStats && mode === "tour" && !loadingPlayers && (
        <p className="text-sm text-center text-[var(--color-muted)] py-8">
          Velg en spiller for å se sammenligning
        </p>
      )}
    </motion.div>
  );
}
