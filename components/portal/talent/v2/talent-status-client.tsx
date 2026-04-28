"use client";

import { TalentHero } from "./talent-hero";
import { SgPercentileGrid, type SgPercentileItem } from "./sg-percentile-grid";
import { ForecastCard, type ForecastData } from "./forecast-card";
import { RecommendedActions, type ActionItem } from "./recommended-actions";

const SG_ITEMS: SgPercentileItem[] = [
  { category: "SG", label: "Off-the-tee", percentile: 23, strokes: -1.2, tone: "bad" },
  { category: "SG", label: "Approach", percentile: 76, strokes: 0.9, tone: "good" },
  { category: "SG", label: "Around-green", percentile: 52, strokes: 0.1, tone: "warn" },
  { category: "SG", label: "Putting", percentile: 68, strokes: 0.6, tone: "good" },
];

const FORECAST: ForecastData = {
  expectedHcp: 6.2,
  errorMargin: 1.4,
  best5pct: 4.8,
  worst5pct: 7.6,
  probabilityTarget: 73,
  trainingHoursWeek: 10,
  description:
    "Modellen tar inn alder, treningsvolum, runder spilt, swing-progresjon og siste 24 mnd HCP-trend. Prognosen oppdateres hver natt basert på nye data.",
};

const ACTIONS: ActionItem[] = [
  {
    iconName: "zap",
    impact: "+0.6 HCP",
    title: "Driver alignment-program",
    description:
      "12 ukers fokus på SG Off-the-tee. 3 økter / uke med Trackman + coach. Reduserer høyre miss fra 12 yds til 4 yds.",
    duration: "12 uker",
    ctaLabel: "Start",
  },
  {
    iconName: "circle-dot",
    impact: "+0.4 HCP",
    title: "Putting · 6m+ make-rate",
    description:
      "Quintic-stroke clinic + lag-putting-drills 4 dager / uke. Mål: hev 6m+ make-rate fra 11 % til 18 %.",
    duration: "8 uker",
    ctaLabel: "Start",
  },
  {
    iconName: "user-cog",
    impact: "+0.3 HCP",
    title: "Hofte-mobilitet",
    description:
      "TPI flagget LQR + 90/90. Daglig 15-min program i 6 uker, deretter re-test. Frigjør 4–6° rotasjon i sving.",
    duration: "6 uker",
    ctaLabel: "Start",
  },
  {
    iconName: "trophy",
    impact: "+0.2 HCP",
    title: "Turneringseksponering",
    description:
      "Spill 6 turneringer / sesong (mot dagens 2). Stress-trening senker SG-variansen din i kamp med ~30 %.",
    duration: "Sesong",
    ctaLabel: "Se kalender",
  },
  {
    iconName: "brain",
    impact: "+0.1 HCP",
    title: "Pre-shot routine-treff",
    description:
      "Hev rutinetreff fra 84 % til 95 % på alle press-shots. Mental-coach 2× / mnd.",
    duration: "Vedvarende",
    ctaLabel: "Konfigurer",
  },
  {
    iconName: "moon",
    impact: "+0.1 HCP",
    title: "Søvn 7+ t per natt",
    description:
      "Snitt 6:48 nå. Hver halvtime ekstra korrelerer med +0.04 SG / runde i din historikk. Sett soveritual.",
    duration: "Vedvarende",
    ctaLabel: "Hjelpeguide",
  },
];

export function TalentStatusClient() {
  return (
    <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-6 lg:py-8 min-h-screen bg-[#102B1E] text-white">
      <header className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#D1F843] mb-2">
          / TALENT · USI A–K
        </div>
        <h1 className="font-display m-0 text-[34px] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
          Hvor langt kan du komme?
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-[1.6] text-white/70">
          USI (Universal Skill Index) gir deg en bånd-plassering A–K mot peer-gruppen. Nivå
          D er klubbelite, A er hovedtour. Prognosen er statistisk modellert med Sikkerhet 95 %.
        </p>
      </header>

      <TalentHero
        level="E"
        targetLevel="D"
        percentile={47}
        hcpCurrent={8.4}
        hcpTarget={7.0}
        hcpTrend90d={-1.4}
        description="Kompetent klubbspiller med raskere progresjon enn 78 % av peer-gruppen siste 90d. Prognosemodellen flytter deg til nivå D (klubbelite) i februar 2026 hvis nåværende treningsvolum holdes."
      />

      <SgPercentileGrid items={SG_ITEMS} />
      <ForecastCard data={FORECAST} />
      <RecommendedActions actions={ACTIONS} />
    </div>
  );
}
