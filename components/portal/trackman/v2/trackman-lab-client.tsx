"use client";

import { useState } from "react";
import type { TrackManOverview } from "@/app/portal/(dashboard)/trackman/actions";
import { LabHeader } from "./lab-header";
import { KpiStrip, type KpiTile } from "./kpi-strip";
import { DispersionCard, type DispersionStat } from "./dispersion-card";
import {
  ClubComparisonCard,
  type ClubComparisonRow,
} from "./club-comparison-card";

const APPROACH_TABS = [
  { key: "7J", label: "7J" },
  { key: "6J", label: "6J" },
  { key: "8J", label: "8J" },
  { key: "PW", label: "PW" },
];

// Fallback / defaults når brukeren ikke har TrackMan-data ennå.
// Server-data overstyrer disse der det finnes.
const FALLBACK_KPI: KpiTile[] = [
  { label: "CLUB", value: "7J" },
  { label: "CARRY", value: "152.4", delta: "+2.1 m", deltaTone: "positive" },
  { label: "BALL MPH", value: "128.6", delta: "+1.2", deltaTone: "positive" },
  { label: "SPIN RPM", value: "6 820", delta: "−180", deltaTone: "negative" },
  { label: "LAUNCH°", value: "17.2", delta: "+0.4", deltaTone: "positive" },
  { label: "SMASH", value: "1.38", delta: "opt", deltaTone: "positive" },
];

const APPROACH_STATS: DispersionStat[] = [
  { label: "MEDIAN CARRY", value: "152m", hint: "mål 152m" },
  { label: "PROXIMITY", value: "5.8m", hint: "fra pin", tone: "lime" },
  { label: "SIDE BIAS", value: "−1.2m", hint: "venstre miss", tone: "red" },
  { label: "GIR", value: "65%", hint: "26 / 40", tone: "lime" },
];

const TEE_STATS: DispersionStat[] = [
  { label: "MEDIAN CARRY", value: "238m", hint: "mål 240m" },
  { label: "DEPTH SPREAD", value: "±18m", hint: "90% bånd" },
  { label: "SIDE BIAS", value: "+4.8m", hint: "høyre push", tone: "red" },
  { label: "FAIRWAY HIT", value: "71%", hint: "20 / 28", tone: "lime" },
];

const FALLBACK_CLUB_ROWS: ClubComparisonRow[] = [
  { club: "DR", carryPct: 82, benchmarkPct: 88, ballMph: "164.2", spin: "2 420", launch: "11.8", shots30d: 184 },
  { club: "3W", carryPct: 74, benchmarkPct: 80, ballMph: "158.8", spin: "3 180", launch: "13.2", shots30d: 92 },
  { club: "5J", carryPct: 60, benchmarkPct: 62, ballMph: "135.8", spin: "5 420", launch: "15.8", shots30d: 52 },
  { club: "6J", carryPct: 54, benchmarkPct: 56, ballMph: "144.2", spin: "6 140", launch: "16.4", shots30d: 68 },
  { club: "7J", carryPct: 48, benchmarkPct: 50, ballMph: "152.4", spin: "6 820", launch: "17.2", shots30d: 162, highlighted: true },
  { club: "8J", carryPct: 42, benchmarkPct: 44, ballMph: "130.2", spin: "7 240", launch: "18.8", shots30d: 88 },
  { club: "9J", carryPct: 36, benchmarkPct: 38, ballMph: "118.4", spin: "7 860", launch: "20.2", shots30d: 102 },
  { club: "PW", carryPct: 30, benchmarkPct: 32, ballMph: "104.8", spin: "8 420", launch: "22.1", shots30d: 144 },
];

const AI_INSIGHT =
  "Carry-tallene dine ligger 2–6m under tour-benchmark, men spredning er elite (±4.2m på 7-jern). Fokus videre: øk ballhastighet på 8J/9J (+2 m/s) for å tette gap mot 130m-snitt. Sjekk lie-vinkel — smash på 6J-7J tyder på toe-kontakt.";

export interface TrackManLabClientProps {
  data: TrackManOverview;
}

export function TrackManLabClient({ data }: TrackManLabClientProps) {
  const [approachTab, setApproachTab] = useState("7J");

  const hasData = data.totalSessions > 0;

  // Bruk server-data hvis tilgjengelig — ellers placeholder
  const kpis: KpiTile[] = hasData
    ? buildKpisFromData(data)
    : FALLBACK_KPI;

  const clubRows: ClubComparisonRow[] = hasData
    ? buildClubRowsFromData(data)
    : FALLBACK_CLUB_ROWS;

  const totalShots = hasData ? data.totalShots : 162;

  return (
    <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-6 lg:px-8 py-6 lg:py-8 min-h-screen bg-[#0b0d0c] text-[#E6EAE8]">
      <LabHeader
        isLive={false}
        sessionNumber="0418"
        location="TrackMan Lab"
        shotCount={totalShots}
        durationLabel={`${data.totalSessions} sesjoner`}
      />

      <KpiStrip tiles={kpis} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <DispersionCard
          title="Inn til green · 7-jern"
          subtitle="40 SLAG · MÅL 152m · SISTE 30d"
          tabs={APPROACH_TABS}
          activeTab={approachTab}
          onTabChange={setApproachTab}
          variant="approach"
          cornerInfo="40 SLAG"
          cornerSecondary="GIR 65% ↑"
          stats={APPROACH_STATS}
        />
        <DispersionCard
          title="Fra tee · Driver"
          subtitle="28 SLAG · 240m FAIRWAY · SISTE 30d"
          variant="tee"
          cornerInfo="28 SLAG"
          cornerSecondary="FW 71% ↑"
          stats={TEE_STATS}
        />
      </div>

      <ClubComparisonCard rows={clubRows} aiInsight={AI_INSIGHT} />
    </div>
  );
}

// ─── Mappers (server-data → UI) ──────────────────────────────────────────

function buildKpisFromData(data: TrackManOverview): KpiTile[] {
  // Velg den klubben med flest sesjoner
  const top = data.clubStats[0];
  if (!top) return FALLBACK_KPI;
  return [
    { label: "CLUB", value: clubShortCode(top.club) },
    { label: "CARRY", value: top.avgCarry > 0 ? `${top.avgCarry.toFixed(1)}` : "—" },
    { label: "BALL MPH", value: top.avgBallSpeed ? `${top.avgBallSpeed.toFixed(1)}` : "—" },
    { label: "SPIN RPM", value: top.avgSpin ? formatThousand(top.avgSpin) : "—" },
    { label: "LAUNCH°", value: top.avgLaunch ? `${top.avgLaunch.toFixed(1)}` : "—" },
    { label: "SHOTS 30d", value: `${top.sessionCount}` },
  ];
}

function buildClubRowsFromData(data: TrackManOverview): ClubComparisonRow[] {
  const maxCarry = Math.max(...data.clubStats.map((c) => c.avgCarry), 1);
  return data.clubStats.slice(0, 8).map((c) => {
    const pct = (c.avgCarry / maxCarry) * 100;
    return {
      club: clubShortCode(c.club),
      carryPct: pct,
      benchmarkPct: Math.min(100, pct + 4), // antydet tour-benchmark
      ballMph: c.avgBallSpeed ? c.avgBallSpeed.toFixed(1) : "—",
      spin: c.avgSpin ? formatThousand(c.avgSpin) : "—",
      launch: c.avgLaunch ? c.avgLaunch.toFixed(1) : "—",
      shots30d: c.sessionCount,
    };
  });
}

function clubShortCode(club: string): string {
  const lower = club.toLowerCase();
  if (lower.includes("driver")) return "DR";
  if (lower.includes("3 wood") || lower.includes("3-wood") || lower.includes("3w")) return "3W";
  if (lower.includes("5 iron") || lower.includes("5j") || lower.includes("5i")) return "5J";
  if (lower.includes("6 iron") || lower.includes("6j") || lower.includes("6i")) return "6J";
  if (lower.includes("7 iron") || lower.includes("7j") || lower.includes("7i")) return "7J";
  if (lower.includes("8 iron") || lower.includes("8j") || lower.includes("8i")) return "8J";
  if (lower.includes("9 iron") || lower.includes("9j") || lower.includes("9i")) return "9J";
  if (lower.includes("pw") || lower.includes("pitch")) return "PW";
  if (lower.includes("gw") || lower.includes("gap")) return "GW";
  if (lower.includes("sw") || lower.includes("sand")) return "SW";
  if (lower.includes("lw") || lower.includes("lob")) return "LW";
  return club.slice(0, 4).toUpperCase();
}

function formatThousand(n: number): string {
  return Math.round(n).toLocaleString("nb-NO").replace(/,/g, " ");
}
