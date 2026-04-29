import { getSkillLevelByCode, getNextLevel } from "@/lib/portal/golf/skill-levels";
export {
  PEER_BENCHMARK,
  PYRAMID_BENCHMARK,
  percentile,
} from "@/lib/portal/golf/benchmarks";

// Smal kopi av RoundStats — kun feltene UI-en faktisk leser. Holder Prisma-genererte
// typer ute av client bundle og gjør server/client-kontrakt eksplisitt.
export type RoundStatsRow = {
  id: string;
  date: Date;
  courseName: string | null;
  totalScore: number | null;
  scoreToPar: number | null;
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
  drivingDistance: number | null;
  fairwaysHit: number | null;
  fairwaysTotal: number | null;
  gir: number | null;
  girTotal: number | null;
  totalPutts: number | null;
};

export type StatsAggregates = {
  roundCount: number;
  avgScore: number | null;
  avgSgTotal: number | null;
  avgSgOffTheTee: number | null;
  avgSgApproach: number | null;
  avgSgAroundTheGreen: number | null;
  avgSgPutting: number | null;
  avgDrivingDistance: number | null;
  avgFairwayPct: number | null;
  avgGirPct: number | null;
  avgPuttsPerGir: number | null;
  avgUpAndDownPct: number | null;
  scoreTrend: "up" | "down" | "flat";
  sgTrend: "up" | "down" | "flat";
};

import type { PeriodKey } from "@/app/portal/(dashboard)/statistikk/actions";

export const PERIOD_LABEL: Record<PeriodKey, string> = {
  "7d": "7 dager",
  "30d": "30 dager",
  "90d": "90 dager",
  season: "sesongen",
  "1y": "siste år",
};

// PEER_BENCHMARK + PYRAMID_BENCHMARK + percentile er flyttet til
// lib/portal/golf/benchmarks.ts og re-eksporteres ovenfor.

export function buildHeroLede(aggregates: StatsAggregates | null): string {
  if (!aggregates) {
    return "Vi trenger flere runder med Strokes Gained-data for å sammenligne deg.";
  }
  const sgOtt = aggregates.avgSgOffTheTee;
  const sgApp = aggregates.avgSgApproach;
  const sgPutt = aggregates.avgSgPutting;

  const strengths: string[] = [];
  if (sgApp !== null && sgApp > 0.2) strengths.push("approach");
  if (sgPutt !== null && sgPutt > 0.2) strengths.push("putting");

  const weaknesses: string[] = [];
  if (sgOtt !== null && sgOtt < -0.3) weaknesses.push("Off-the-tee");
  if (sgApp !== null && sgApp < -0.3) weaknesses.push("approach");

  const strengthsText =
    strengths.length > 0
      ? `Sterk på ${strengths.join(" og ")}.`
      : "Solid grunnspill med plass til vekst.";
  const weaknessesText =
    weaknesses.length > 0
      ? ` Hovedmulighet: ${weaknesses[0]} har størst forbedringspotensial.`
      : "";

  return strengthsText + weaknessesText;
}

export function pickBiggestOpportunity(
  aggregates: StatsAggregates | null,
):
  | { title: string; tag: string; description: string }
  | null {
  if (!aggregates) return null;

  const candidates = [
    {
      key: "ott" as const,
      value: aggregates.avgSgOffTheTee,
      title: "Største mulighet: SG Off-the-tee",
      description:
        "Drives havner ofte i feil semi-rough. En alignment-drill 3 dager før neste runde kan flytte deg flere percentiler.",
    },
    {
      key: "app" as const,
      value: aggregates.avgSgApproach,
      title: "Største mulighet: SG Approach",
      description:
        "Innspill fra 100–200 m gir mest poeng. Jobb med wedge-distance control og sjekk dispersion på TrackMan.",
    },
    {
      key: "arg" as const,
      value: aggregates.avgSgAroundTheGreen,
      title: "Største mulighet: Kortspill",
      description:
        "Up & down rundt green er en høyfrekvent stat. 3 økter med chip-ladder kan flytte scrambling-prosenten merkbart.",
    },
    {
      key: "putt" as const,
      value: aggregates.avgSgPutting,
      title: "Største mulighet: Putting",
      description:
        "Avgjørende for scoringen. 15 min putting-routine før hver runde har stor effekt på 6–12 fot.",
    },
  ];

  const valid = candidates.filter(
    (c): c is typeof c & { value: number } => c.value !== null,
  );
  if (valid.length === 0) return null;

  const worst = valid.reduce((acc, c) => (c.value < acc.value ? c : acc));
  if (worst.value > -0.1) return null;

  return {
    title: worst.title,
    tag: `${worst.value.toFixed(1)} slag/runde`,
    description: worst.description,
  };
}

/**
 * Avstand i HCP til neste niva (positiv = du ma ga NED i hcp).
 * Bruker SKILL_LEVELS som single source of truth for handicapRange.
 */
export function hcpToNextLevel(hcp: number, level: string): number | null {
  const next = getNextLevel(level);
  if (!next) return null;
  // Mal er den hoyeste hcp som regnes som neste niva (handicapRange[1])
  // — dvs. hcp ma vaere lavere eller lik dette for a kvalifisere.
  const target = next.handicapRange[1];
  return hcp - target;
}

/**
 * Norsk beskrivelse av kategori — lest fra SKILL_LEVELS.tournamentContext +
 * description (description er primaert technical, tournamentContext mer
 * leservennlig).
 */
export function describeLevel(level: string): string {
  const skill = getSkillLevelByCode(level);
  if (!skill) return "Aktiv golfer i utvikling.";
  return skill.tournamentContext;
}
