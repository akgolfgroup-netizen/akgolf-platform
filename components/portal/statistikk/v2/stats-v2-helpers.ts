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

// Faste peer-benchmarks for HCP 6–10 (kilde: AK pyramide-snitt).
// Dette er placeholder-verdier til vi får ekte peer-tall fra databasen.
export const PEER_BENCHMARK = {
  drivingDistance: 215, // m, snitt for HCP 6–10
  sgOffTheTee: 0.3,
  girPct: 52,
  puttsPerRound: 31.4,
  scramblingPct: 51,
  approachProx: 9.1, // m
};

export const PYRAMID_BENCHMARK = {
  drivingDistance: 200,
  sgOffTheTee: 0,
  girPct: 48,
  puttsPerRound: 32.1,
  scramblingPct: 46,
  approachProx: 10.2,
};

export function percentile(
  value: number,
  peer: number,
  lowerIsBetter = false,
): number {
  // Enkel heuristikk: 50. percentil = peer-snitt, ±0.5*peer = ±50 percentiler.
  // Bare for å vise plassering i UI til vi har riktig peer-pool.
  if (peer === 0) return 50;
  const ratio = value / peer;
  const adjusted = lowerIsBetter ? 2 - ratio : ratio;
  return Math.max(0, Math.min(100, Math.round(50 + (adjusted - 1) * 80)));
}

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

export function hcpToNextLevel(hcp: number, level: string): number | null {
  // Approksimering: hver kategori er ~3-4 hcp bred. Returner avstand til
  // neste niva (positiv = du må gå NED i hcp).
  const NEXT_TARGET: Record<string, number> = {
    A: -5,
    B: 0,
    C: 4.0,
    D: 7.5,
    E: 11.0,
    F: 15.0,
    G: 20.0,
  };
  const target = NEXT_TARGET[level];
  if (target === undefined) return null;
  return hcp - target;
}

export function describeLevel(level: string): string {
  const DESC: Record<string, string> = {
    A: "Tour-spiller. Hovedtour eller proff på topp 0,1 %-nivå.",
    B: "Challenge-tour-nivå. Scratch-spillere som konkurrerer regelmessig på elite-nivå.",
    C: "Elite amatør. Topp 5 % av alle norske golfere — nasjonalt nivå.",
    D: "Klubbelite. Topp klubb-amatører og turneringsspillere på regionalt nivå.",
    E: "Kompetent klubbspiller. Hovedtyngden av aktive turneringsspillere.",
    F: "Erfaren spiller med jevn utvikling. Aktiv klubbspiller med solid grunnspill.",
    G: "Bogey-spiller. God hverdagsspiller med stabilt fundament.",
    H: "Aktiv klubbspiller. Trener jevnlig og konkurrerer i klubbturneringer.",
    I: "Rekrutt — i god utvikling fra nybegynner-stadiet.",
    J: "Nybegynner. Trygg på grunnferdighetene, klar for å bygge struktur.",
    K: "Nybegynner. Lærer fundamentet — alle gode golfere starter her.",
  };
  return DESC[level] ?? "Aktiv golfer i utvikling.";
}
