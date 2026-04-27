"use client";

import { useMemo, useState } from "react";
import { isAfter, isBefore } from "date-fns";
import type { TournamentWithPlan } from "@/modules/tournament-planner";
import type { TourScheduleEvent } from "@/lib/portal/datagolf/client";
import { TurneringerHero } from "./turneringer-hero";
import { TurneringerTabs, type TabKey } from "./turneringer-tabs";
import { TurneringerKpiStrip, type Kpi } from "./turneringer-kpi";
import { UpcomingTournamentGrid } from "./upcoming-grid";
import { PastResultsTable } from "./results-table";
import { ExploreProTour } from "./explore-list";
import { accent, monoFont } from "./styles";

interface Props {
  tournaments: TournamentWithPlan[];
  pgaSchedule: TourScheduleEvent[];
  euroSchedule: TourScheduleEvent[];
}

export function TurneringerClientV2({ tournaments, pgaSchedule, euroSchedule }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("kommende");
  const [proTour, setProTour] = useState<"pga" | "euro">("pga");

  const myTournaments = useMemo(
    () => tournaments.filter((t) => t.playerPlan),
    [tournaments],
  );

  const now = new Date();
  const upcoming = useMemo(
    () =>
      myTournaments
        .filter((t) => isAfter(new Date(t.startDate), now))
        .sort(
          (a, b) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        ),
    [myTournaments, now],
  );
  const past = useMemo(
    () =>
      myTournaments
        .filter((t) => isBefore(new Date(t.startDate), now))
        .sort(
          (a, b) =>
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
        ),
    [myTournaments, now],
  );

  const next = upcoming[0] ?? null;
  const others = upcoming.slice(1);

  const registeredCount = upcoming.filter((t) => t.playerPlan?.isRegistered).length;
  const completedCount = past.length;

  const kpis: Kpi[] = [
    {
      label: "Pameldte turneringer",
      value: String(registeredCount),
      delta: `${upcoming.length} kommende totalt`,
    },
    {
      label: "Gjennomforte",
      value: String(completedCount),
      delta: `siden start`,
    },
    {
      label: "PGA Tour-events",
      value: String(pgaSchedule.length),
      delta: "kommende uker",
      deltaTone: "neutral",
    },
    {
      label: "DP World-events",
      value: String(euroSchedule.length),
      delta: "kommende uker",
      deltaTone: "neutral",
    },
  ];

  const handleSelect = (_t: TournamentWithPlan) => {
    // Placeholder — full detail-modal kommer i Sprint 2.
    void _t;
  };

  return (
    <div
      className="rounded-[24px] p-7 lg:p-9"
      style={{ background: "#0A1F18", minHeight: "calc(100vh - 120px)" }}
    >
      <header className="mb-6">
        <div
          className="text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: accent, fontFamily: monoFont }}
        >
          / Kampsesong {now.getFullYear()}
        </div>
        <h1 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-white sm:text-[48px]">
          Sesongen er i gang.
        </h1>
        <p className="mt-3 max-w-[60ch] text-[14px] leading-[1.6] text-white/65">
          {myTournaments.length === 0
            ? "Du har ingen turneringer planlagt enna. Se Pro Tour-fanen for inspirasjon eller legg til en turnering."
            : `${upcoming.length} kommende, ${completedCount} gjennomforte. Klikk en turnering for plan og forberedelser.`}
        </p>
      </header>

      <TurneringerTabs
        active={activeTab}
        onChange={setActiveTab}
        counts={{
          kommende: upcoming.length,
          gjennomforte: past.length,
          utforsk: pgaSchedule.length + euroSchedule.length,
        }}
      />

      <TurneringerKpiStrip items={kpis} />

      {activeTab === "kommende" ? (
        <>
          <TurneringerHero tournament={next} />
          <UpcomingTournamentGrid tournaments={others} onSelect={handleSelect} />
        </>
      ) : null}

      {activeTab === "gjennomforte" ? (
        <PastResultsTable tournaments={past} onSelect={handleSelect} />
      ) : null}

      {activeTab === "utforsk" ? (
        <ExploreProTour
          pgaSchedule={pgaSchedule}
          euroSchedule={euroSchedule}
          proTour={proTour}
          setProTour={setProTour}
        />
      ) : null}
    </div>
  );
}
