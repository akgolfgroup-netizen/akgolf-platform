"use client";

import { useMemo, useState } from "react";
import { Activity, Database } from "lucide-react";
import type {
  TrackManV2Data,
  TrackManShotV2,
} from "@/app/portal/(dashboard)/trackman/actions";
import { ClubComparison } from "@/components/portal/trackman/club-comparison";
import { ShotDispersionChart } from "@/components/portal/trackman/shot-dispersion-chart";
import { KpiRow } from "./kpi-row";
import { FilterBar, type Period } from "./filter-bar";
import { ShotsTable, type ShotRow } from "./shots-table";

const DAYS_PER_PERIOD: Record<Period, number> = {
  "30d": 30,
  "90d": 90,
  season: 240,
  "1y": 365,
};

interface TrackManV2ClientProps {
  data: TrackManV2Data;
}

export function TrackManV2Client({ data }: TrackManV2ClientProps) {
  const [period, setPeriod] = useState<Period>("90d");
  const [selectedClub, setSelectedClub] = useState<string | "ALL">("ALL");
  const [selectedSessionId, setSelectedSessionId] = useState<string | "ALL">("ALL");

  const filteredShots = useMemo(
    () =>
      filterShots(data.shots, {
        period,
        club: selectedClub,
        sessionId: selectedSessionId,
      }),
    [data.shots, period, selectedClub, selectedSessionId],
  );

  const tableRows: ShotRow[] = useMemo(
    () =>
      filteredShots.map((s) => ({
        id: s.id,
        shotNumber: s.shotNumber,
        club: s.club,
        carry: s.carry,
        ballSpeed: s.ballSpeed,
        smash: s.smash,
        spin: s.spin,
        launch: s.launch,
        offline: s.offline,
        date: s.date,
      })),
    [filteredShots],
  );

  const clubComparisonData = useMemo(
    () => buildClubComparisonData(data.overview.clubStats),
    [data.overview.clubStats],
  );

  const dispersionShots = useMemo(
    () =>
      filteredShots.slice(0, 200).map((s) => ({
        id: s.id,
        shotNumber: s.shotNumber,
        club: s.club,
        ballSpeed: s.ballSpeed,
        carryDistance: s.carry,
        totalDistance: null,
        spinRate: s.spin,
        launchAngle: s.launch,
        offlineDistance: s.offline,
      })),
    [filteredShots],
  );

  const totalShots = filteredShots.length;
  const sessionCount = data.overview.totalSessions;

  return (
    <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-6 lg:px-8 py-6 lg:py-8 min-h-screen bg-[#0b0d0c] text-[#E6EAE8]">
      <header className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="font-mono text-[10px] text-[#D1F843] tracking-[0.14em] flex items-center gap-1.5">
            <Activity className="w-3 h-3" />
            TRACKMAN LAB · V2
          </div>
          <h1 className="mt-1 mb-0.5 text-[26px] font-bold tracking-[-0.03em] text-[#F7FAF8]">
            TrackMan
          </h1>
          <div className="text-[13px] text-[#A5B2AD]">
            {totalShots.toLocaleString("nb-NO")} slag i utvalg ·{" "}
            {sessionCount.toLocaleString("nb-NO")} sesjoner totalt
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full bg-black/40 border border-white/10 px-3 py-1.5 text-xs text-white">
          <Database className="w-3 h-3 text-white/55" />
          {data.shots.length > 0 ? "Data tilgjengelig" : "Ingen data"}
        </div>
      </header>

      {/* KPI-rad */}
      <section className="mb-4">
        <KpiRow
          carry={data.carry}
          ballSpeed={data.ballSpeed}
          smash={data.smash}
          dispersion={data.dispersion}
        />
      </section>

      {/* Filter-bar */}
      <section className="mb-4">
        <FilterBar
          clubs={data.availableClubs}
          selectedClub={selectedClub}
          onClubChange={setSelectedClub}
          period={period}
          onPeriodChange={setPeriod}
          sessions={data.availableSessions}
          selectedSessionId={selectedSessionId}
          onSessionChange={setSelectedSessionId}
        />
      </section>

      {/* Charts grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <ChartCard
          title="Klubbesammenligning"
          subtitle="CARRY · ALLE KLUBBER"
        >
          {clubComparisonData ? (
            <ClubComparison data={clubComparisonData} highlightGaps={false} />
          ) : (
            <EmptyChart label="Ikke nok klubbedata for sammenligning" />
          )}
        </ChartCard>

        <ChartCard title="Spredning" subtitle="OFFLINE × CARRY · UTVALG">
          {dispersionShots.length > 0 ? (
            <ShotDispersionChart shots={dispersionShots} />
          ) : (
            <EmptyChart label="Ingen slag i utvalget med offline-data" />
          )}
        </ChartCard>
      </section>

      {/* Tabell */}
      <section className="mb-4">
        <ShotsTable shots={tableRows} limit={50} />
      </section>
    </div>
  );
}

// ── Subcomponents ────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#121614] p-5">
      <div className="mb-3">
        <h3 className="text-[13px] font-bold text-[#F7FAF8] mb-1">{title}</h3>
        <div className="font-mono text-[10px] text-white/45 tracking-[0.10em] uppercase">
          {subtitle}
        </div>
      </div>
      <div className="rounded-xl bg-[#0a0d0c] border border-white/[0.04] p-3">
        {children}
      </div>
    </div>
  );
}

function EmptyChart({ label }: { label: string }) {
  return (
    <div className="h-[260px] flex items-center justify-center text-sm text-white/45 text-center px-6">
      {label}
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────

function filterShots(
  shots: TrackManShotV2[],
  filter: { period: Period; club: string | "ALL"; sessionId: string | "ALL" },
): TrackManShotV2[] {
  const cutoff = Date.now() - DAYS_PER_PERIOD[filter.period] * 24 * 60 * 60 * 1000;
  return shots.filter((s) => {
    if (new Date(s.date).getTime() < cutoff) return false;
    if (filter.club !== "ALL" && s.club !== filter.club) return false;
    if (filter.sessionId !== "ALL" && s.sessionId !== filter.sessionId) return false;
    return true;
  });
}

function buildClubComparisonData(
  clubStats: TrackManV2Data["overview"]["clubStats"],
): Record<string, { carry: number }> | null {
  if (!clubStats || clubStats.length === 0) return null;
  const result: Record<string, { carry: number }> = {};
  for (const c of clubStats) {
    if (c.avgCarry > 0) {
      result[c.club] = { carry: Math.round(c.avgCarry) };
    }
  }
  return Object.keys(result).length > 0 ? result : null;
}
