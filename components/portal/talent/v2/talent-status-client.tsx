"use client";

import { TalentHero } from "./talent-hero";
import { TalentStatsGrid } from "./talent-stats-grid";
import { TournamentResultsCard } from "./tournament-results-card";
import type { MyTalentData } from "@/app/portal/(dashboard)/talent/actions";

const BANDS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K"] as const;
type Band = (typeof BANDS)[number];

/**
 * Mapper percentil (0-100) til USI-bånd A-K.
 * A er top 9 % (best), K er bunnen.
 */
function percentileToBand(percentile: number): Band {
  const p = Math.max(0, Math.min(100, percentile));
  const idx = Math.min(10, Math.floor((100 - p) / (100 / BANDS.length)));
  return BANDS[idx];
}

function nextBand(current: Band): Band {
  const idx = BANDS.indexOf(current);
  return idx > 0 ? BANDS[idx - 1] : current;
}

function targetHcpForBand(currentHcp: number, _targetBand: Band): number {
  return Math.max(0, currentHcp - 0.7);
}

interface TalentStatusClientProps {
  data: MyTalentData;
}

export function TalentStatusClient({ data }: TalentStatusClientProps) {
  const { player, currentHcp, hcpTrend90d, currentYearStats, ageGroupPercentile } =
    data;

  const percentile = ageGroupPercentile ?? 50;
  const currentBand = percentileToBand(percentile);
  const targetBand = nextBand(currentBand);
  const hcpDisplay = currentHcp ?? 0;
  const hcpTargetDisplay = targetHcpForBand(hcpDisplay, targetBand);

  const description = buildDescription({
    firstName: player.firstName,
    percentile,
    currentBand,
    ageGroupSize: data.ageGroupSize,
    hasHcp: currentHcp !== null,
    improvement: currentYearStats?.improvementPerYear ?? null,
  });

  return (
    <div className="-mx-4 lg:-mx-8 -mt-4 lg:-mt-8 px-4 lg:px-8 py-6 lg:py-8 min-h-screen bg-[#102B1E] text-white">
      <header className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#D1F843] mb-2">
          / TALENT · USI A–K
        </div>
        <h1 className="font-display m-0 text-[34px] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
          {player.firstName}, hvor langt kan du komme?
        </h1>
        <p className="mt-3 max-w-[60ch] text-sm leading-[1.6] text-white/70">
          USI (Universal Skill Index) gir deg en bånd-plassering A–K mot
          peer-gruppen. Nivå D er klubbelite, A er hovedtour. Tallene er hentet
          fra dine registrerte turneringsresultater.
        </p>
      </header>

      <TalentHero
        level={currentBand}
        targetLevel={targetBand}
        percentile={percentile}
        hcpCurrent={hcpDisplay}
        hcpTarget={hcpTargetDisplay}
        hcpTrend90d={hcpTrend90d ?? 0}
        description={description}
      />

      {currentYearStats ? (
        <TalentStatsGrid
          totalRounds={currentYearStats.totalRounds}
          avgRound={currentYearStats.avgRound}
          bestRound={currentYearStats.bestRound}
          top3Count={currentYearStats.top3Count}
          top10Count={currentYearStats.top10Count}
          improvementPerYear={currentYearStats.improvementPerYear}
          ageGroupPercentile={ageGroupPercentile}
          ageGroupSize={data.ageGroupSize}
          year={currentYearStats.year}
        />
      ) : (
        <EmptySection
          title="Nøkkeltall"
          message="Ingen turneringsstatistikk registrert enda. Tallene oppdateres automatisk når NGF / WAGR-data synkroniseres."
        />
      )}

      <TournamentResultsCard results={data.recentResults} />

      <EmptySection
        title="Strokes Gained · percentil mot peer"
        message="SG-data kommer når vi har koblet runde-tracking til turneringsdata. Ta opp shot-tracking med coachen din for å aktivere dette."
        muted
      />

      <EmptySection
        title="HCP-prognose · 12 måneder"
        message="Prognose-modell aktiveres når vi har minst 12 måneder med HCP-historikk og 6+ turneringer. Modellen oppdateres deretter daglig."
        muted
      />
    </div>
  );
}

function EmptySection({
  title,
  message,
  muted,
}: {
  title: string;
  message: string;
  muted?: boolean;
}) {
  return (
    <>
      <div className="flex items-end justify-between mb-3.5 mt-7">
        <h3 className="font-display m-0 text-lg font-bold tracking-[-0.02em] text-white">
          {title}
        </h3>
        <div className="font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          {muted ? "DATA KOMMER" : "INGEN DATA"}
        </div>
      </div>
      <section className="rounded-2xl border border-dashed border-[#1a4a3a] bg-[#0D2E23]/40 px-7 py-8 mb-2 text-sm text-white/55 leading-[1.6]">
        {message}
      </section>
    </>
  );
}

function buildDescription({
  firstName,
  percentile,
  currentBand,
  ageGroupSize,
  hasHcp,
  improvement,
}: {
  firstName: string;
  percentile: number;
  currentBand: Band;
  ageGroupSize: number | null;
  hasHcp: boolean;
  improvement: number | null;
}): string {
  const bandDescriptor: Record<Band, string> = {
    A: "hovedtour-nivå",
    B: "tour-spiller",
    C: "elite-amatør",
    D: "klubbelite",
    E: "kompetent klubbspiller",
    F: "etablert klubbspiller",
    G: "utviklingsspiller",
    H: "fritidsspiller",
    I: "nybegynner+",
    J: "nybegynner",
    K: "fersk i sporten",
  };

  const parts: string[] = [];
  parts.push(
    `${bandDescriptor[currentBand]} (nivå ${currentBand}) basert på turneringsresultater siste 12 måneder.`
  );

  if (ageGroupSize !== null) {
    parts.push(
      `Plasserer deg foran ${percentile} % av ${ageGroupSize} spillere i din aldersgruppe.`
    );
  }

  if (improvement !== null && improvement < 0) {
    parts.push(
      `Forbedring på ${Math.abs(improvement).toFixed(1)} slag per år — over snittet.`
    );
  } else if (improvement !== null && improvement > 0.5) {
    parts.push(
      `Snittscore har gått opp med ${improvement.toFixed(1)} slag — fokus på stabilitet anbefales.`
    );
  }

  if (!hasHcp) {
    parts.push(
      `Tips ${firstName}: registrer HCP i profilen din for å få full prognose.`
    );
  }

  return parts.join(" ");
}
