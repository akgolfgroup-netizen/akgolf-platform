"use client";

import { useMemo, useState } from "react";
import { TrainingHero, type TrainingHeroData } from "./training-hero";
import { CategoryTabs, type CategoryKey } from "./category-tabs";
import {
  CategorySection,
  type CategorySectionData,
  type SectionCategory,
} from "./category-section";
import { LogSessionBar } from "./log-session-bar";

const HERO: TrainingHeroData = {
  weekProgressPct: 78,
  loggedSessions: 9,
  totalSessions: 12,
  description:
    "9 av 12 økter logget. To Steg 3-drills står igjen før helgen — fokus i dag bør være alignment + 6m putting. Coachen flagget at du droppet 23. apr — be om revurdert volum hvis det er mye.",
  weekHours: "7 t 24 min",
  weekGoalHours: "10 t",
  activeDaysPerWeek: 5,
  trendVsPrevious: "+12 %",
  weekVolume: [
    { day: "Man", pct: 70 },
    { day: "Tir", pct: 4, isEmpty: true },
    { day: "Ons", pct: 88 },
    { day: "Tor", pct: 56 },
    { day: "Fre", pct: 78 },
    { day: "Lør", pct: 95 },
    { day: "Søn", pct: 44, isToday: true },
  ],
};

const SECTIONS: CategorySectionData[] = [
  {
    category: "DR",
    count: 3,
    subtitle: "Største effekt på HCP — fokuser her",
    drills: [
      {
        id: "dr1",
        step: 3,
        name: "Alignment-stick gate",
        description:
          "2 sticks 8 cm fra hverandre · 10 driver-sving · klubb må gå mellom uten å treffe.",
        duration: "20 min",
        location: "Range",
        cadence: "3× / uke",
        progressPct: 60,
        loggedText: "6 / 10",
      },
      {
        id: "dr2",
        step: 2,
        name: "Tee-spread test",
        description:
          "10 driver mot punkt 220m · måle SD i landingspunkt · mål under 12m.",
        duration: "15 min",
        location: "TrackMan",
        cadence: "2× / uke",
        progressPct: 90,
        loggedText: "9 / 10",
      },
      {
        id: "dr3",
        step: 4,
        name: "Stinger m/ 3-wood",
        description:
          "Lavt utfall · ball bak senter · 220m + roll-out. Krever Steg 3 = 80%+.",
        duration: "20 min",
        location: "Range",
        cadence: "—",
        progressPct: null,
        locked: true,
        lockReason: "Låses opp på Steg 3 = 80%",
      },
    ],
  },
  {
    category: "APP",
    count: 3,
    subtitle: "Du er på 76. percentil — vedlikehold",
    drills: [
      {
        id: "app1",
        step: 3,
        name: "9-jern sirkel-drill",
        description:
          "130m flag · 15 baller · poeng for innenfor 5m / 3m / 1.5m sirkler.",
        duration: "25 min",
        location: "Studio",
        cadence: "2× / uke",
        progressPct: 65,
        loggedText: "7 / 12",
      },
      {
        id: "app2",
        step: 4,
        name: "Wedge-distansekontroll",
        description:
          "PW · GW · SW · 3 lengder per klubb (50/75/100m). Avvik <5%.",
        duration: "30 min",
        location: "TrackMan",
        cadence: "2× / uke",
        progressPct: 50,
        loggedText: "4 / 8",
      },
      {
        id: "app3",
        step: 2,
        name: "Smash-factor 7-jern",
        description: "Kontaktrenhet · 1.38+ smash factor over 10 swings.",
        duration: "15 min",
        location: "TrackMan",
        cadence: "—",
        progressPct: 100,
        mastered: true,
      },
    ],
  },
  {
    category: "ARG",
    count: 3,
    subtitle: "Scrambling 42 % · forbedringspotensial",
    drills: [
      {
        id: "arg1",
        step: 2,
        name: "Up-and-down · 10 baller",
        description:
          "5 chip-spots · 2 baller hver · score = par eller bedre. Mål 6/10.",
        duration: "20 min",
        location: "Short-game",
        cadence: "3× / uke",
        progressPct: 75,
        loggedText: "9 / 12",
      },
      {
        id: "arg2",
        step: 3,
        name: "Bunker-kontakt",
        description:
          "Linje i sand · klubb skal treffe 5cm bak · 8/10 må komme på green.",
        duration: "20 min",
        location: "Bunker",
        cadence: "2× / uke",
        progressPct: 35,
        loggedText: "3 / 8",
      },
      {
        id: "arg3",
        step: 3,
        name: "Flop-shot stigning",
        description:
          "Åpen klubbflate · høyt utfall · stoppe innen 3m fra landing.",
        duration: "15 min",
        location: "Short-game",
        cadence: "2× / uke",
        progressPct: 55,
        loggedText: "5 / 8",
      },
    ],
  },
  {
    category: "PT",
    count: 3,
    subtitle: "Steg 4–5 låst til Quintic-test 3. mai",
    drills: [
      {
        id: "pt1",
        step: 2,
        name: "3-fots klokke-drill",
        description:
          "8 baller rundt hull · 3 ft hver · skal lage 8 av 8 før du bryter.",
        duration: "10 min",
        location: "Putting green",
        cadence: "5× / uke",
        progressPct: 80,
        loggedText: "16 / 20",
      },
      {
        id: "pt2",
        step: 3,
        name: "Lag-putt 6m+",
        description: "10 putter fra 6m / 8m / 10m · stoppe innen 1m sirkel.",
        duration: "15 min",
        location: "Putting green",
        cadence: "3× / uke",
        progressPct: 40,
        loggedText: "4 / 12",
      },
      {
        id: "pt3",
        step: 5,
        name: "Press-putting · 9 hulls",
        description:
          "Score-runde · 9 hull · ekte avstander · 1 putt = par, 2 putt = bogey.",
        duration: "40 min",
        location: "Putting green",
        cadence: "—",
        progressPct: null,
        locked: true,
        lockReason: "Låst til Quintic 3. mai",
      },
    ],
  },
];

export function TrainingClient() {
  const [active, setActive] = useState<CategoryKey>("all");

  const counts = useMemo(
    () => ({
      all: SECTIONS.reduce((sum, s) => sum + s.drills.length, 0),
      DR: SECTIONS.find((s) => s.category === "DR")?.drills.length ?? 0,
      APP: SECTIONS.find((s) => s.category === "APP")?.drills.length ?? 0,
      ARG: SECTIONS.find((s) => s.category === "ARG")?.drills.length ?? 0,
      PT: SECTIONS.find((s) => s.category === "PT")?.drills.length ?? 0,
    }),
    [],
  );

  const visibleSections =
    active === "all"
      ? SECTIONS
      : SECTIONS.filter((s) => s.category === (active as SectionCategory));

  return (
    <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-6 lg:py-8 min-h-screen bg-[#102B1E] text-white">
      <header className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#D1F843] mb-2">
          / TRENING · AKTIVE ØVELSER
        </div>
        <h1 className="font-display m-0 text-[34px] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
          {counts.all} drills i programmet ditt nå.
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-[1.6] text-white/70">
          Fordelt på Driver, Approach, Around-Green og Putting. Steg 1–5 markerer
          vanskelighet — du er på Steg 3 i snitt.
        </p>
      </header>

      <TrainingHero data={HERO} />

      <CategoryTabs active={active} onChange={setActive} counts={counts} />

      {visibleSections.map((section) => (
        <CategorySection key={section.category} data={section} />
      ))}

      <LogSessionBar />
    </div>
  );
}
