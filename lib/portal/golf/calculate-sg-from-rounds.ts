/**
 * Bane-justert SG-beregning fra rundehistorikk.
 *
 * Full metodologi: docs/strategy/COACHING_FORECAST_METHODOLOGY.md seksjon 3.
 *
 * Funksjonen gir en spillers SG-profil fra en historikk av runder, hvor hver
 * runde kan ha ulik Course Rating, Slope Rating og værforhold. Tre datakilder
 * håndteres i prioritert rekkefølge:
 *   1. Shot-level SG (beste) — hvis raw sg-felt er satt på RoundStats
 *   2. WHS Differential (fallback) — Score, CourseRating, SlopeRating
 *   3. Aggregert SG over siste N runder
 *
 * Output-strukturen har confidence-flagg og source-flag slik at downstream-kode
 * (coaching forecast) kan vite hvor robust tallene er.
 */

import { getExpectedStrokes } from "./expected-strokes";
import { sgToHandicap, handicapToCategory } from "./sg-to-handicap";
import { SG_BENCHMARKS } from "./sg-benchmarks";

// ── Typer ───────────────────────────────────────────────────────────

export type SgSource = "shot_level" | "differential" | "none";
export type SgConfidence = "high" | "medium" | "low";

export interface RoundInput {
  /** Unik ID for runden (for logging/debugging) */
  id: string;
  /** Dato spilleren spilte */
  date: Date;
  /** Totalt antall slag på 18 hull */
  totalScore: number | null;
  /** Par for banen (typisk 70–72) */
  par: number;
  /** Course Rating — forventet score for scratch. Null = ukjent */
  courseRating: number | null;
  /** Slope Rating 55–155, 113 = nøytral. Null = ukjent */
  slopeRating: number | null;

  /** Shot-level SG-felter (hvis tilgjengelig fra TrackMan/Arccos/manual entry) */
  sgTotal: number | null;
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;

  /** Værdata (optional, brukt til justering) */
  windMs?: number | null;
  rainMm?: number | null;
  tempC?: number | null;

  /** Field-strength for turneringsrunder (gj.snitt sg_total for feltet) */
  fieldStrength?: number | null;

  /** Var runden en turnering? Bare da brukes field-strength-justering */
  isTournament?: boolean;
}

export interface RoundSg {
  roundId: string;
  date: Date;
  /** Beste estimat på SG_total for denne runden */
  sgTotal: number;
  /** Dekomponert SG (bare hvis shot_level-source) */
  sgOffTheTee: number | null;
  sgApproach: number | null;
  sgAroundTheGreen: number | null;
  sgPutting: number | null;
  /** WHS Differential — normalisert score-indikator */
  differential: number | null;
  /** Justeringer lagt på toppen av rå SG */
  weatherAdjustment: number;
  fieldStrengthAdjustment: number;
  /** Hvor dataen kommer fra */
  source: SgSource;
  /** Hvor pålitelig tallet er (påvirker nedstrøms vekting) */
  confidence: SgConfidence;
  /** Menneskelig forklaring av eventuelle forbehold */
  notes: string[];
}

export interface PlayerSgProfile {
  /** Antall runder brukt i beregningen */
  sampleSize: number;
  /** Vektet snitt SG_total over siste N runder */
  meanSgTotal: number;
  /** Standardavvik (for usikkerhet) */
  stdDevSgTotal: number;
  /** Vektet snitt per kategori (null hvis for få shot-level-runder) */
  meanSgOtt: number | null;
  meanSgApp: number | null;
  meanSgArg: number | null;
  meanSgPutt: number | null;
  /** Andelen runder som har shot-level data (0–1) */
  shotLevelCoverage: number;
  /** Laveste confidence-nivå brukt i aggregatet */
  minConfidence: SgConfidence;
  /** Detalj per runde for debugging/visualisering */
  rounds: RoundSg[];
}

// ── WHS Differential (Metodologi seksjon 3.2) ───────────────────────

/**
 * Beregn WHS Differential: (Score − CR) × 113 / Slope.
 * Kilde: USGA/R&A World Handicap System Rules of Handicapping (2024).
 *
 * Returnerer null hvis input er ufullstendig.
 */
export function calculateDifferential(
  score: number | null,
  courseRating: number | null,
  slopeRating: number | null,
): number | null {
  if (score == null || courseRating == null || slopeRating == null) return null;
  if (slopeRating <= 0) return null;
  return ((score - courseRating) * 113) / slopeRating;
}

/**
 * Konverter WHS Differential til PGA-Tour-skalert SG_total.
 *
 * VIKTIG: Differential og PGA-Tour-SG er ulike skalaer:
 *   - Differential ≈ HCP-indeks (f.eks. 5 for en HCP 5-spiller)
 *   - PGA-Tour-SG = avvik fra PGA Tour-snitt (f.eks. -0.8 for en HCP 5-spiller)
 *
 * Derfor går vi: differential → HCP-kategori (A–K) → SG fra SG_BENCHMARKS.
 * Dette gir konsistens med `sgToHandicap()` og resten av USI-systemet.
 */
export function differentialToSgEquivalent(differential: number | null): number | null {
  if (differential == null) return null;
  // Differential behandles som HCP-ekvivalent for en typisk runde.
  const category = handicapToCategory(differential);
  const benchmark = SG_BENCHMARKS.find((b) => b.category === category);
  return benchmark?.sg.total ?? null;
}

// ── Vær-justering (Metodologi seksjon 3.4) ─────────────────────────

const WIND_COEFF = 0.25; // slag per m/s over 3 m/s — ekspert-estimat, må kalibreres
const RAIN_COEFF = 0.15; // slag per mm nedbør — ekspert-estimat, må kalibreres
const TEMP_COEFF = 0.05; // slag per °C under 15°C — ekspert-estimat, må kalibreres
const WIND_THRESHOLD_MS = 3;
const TEMP_THRESHOLD_C = 15;

/**
 * Beregn værjusteringens størrelse i slag.
 * Positiv verdi = banen var vanskeligere enn normalt (skal trekkes fra score).
 *
 * Alle koeffisienter er ekspert-estimater og skal kalibreres mot egen database
 * når n > 500 runder med værdata.
 */
export function calculateWeatherAdjustment(
  windMs: number | null | undefined,
  rainMm: number | null | undefined,
  tempC: number | null | undefined,
): number {
  let adj = 0;
  if (windMs != null && windMs > WIND_THRESHOLD_MS) {
    adj += WIND_COEFF * (windMs - WIND_THRESHOLD_MS);
  }
  if (rainMm != null && rainMm > 0) {
    adj += RAIN_COEFF * rainMm;
  }
  if (tempC != null && tempC < TEMP_THRESHOLD_C) {
    adj += TEMP_COEFF * (TEMP_THRESHOLD_C - tempC);
  }
  return adj;
}

// ── Per-runde-beregning ────────────────────────────────────────────

/**
 * Beregn bane-justert SG for én runde.
 *
 * Prioritet:
 *   1. Shot-level SG (sgTotal felt satt) → confidence = high
 *   2. WHS Differential (score + CR + Slope) → confidence = medium
 *   3. Score + par uten bane-info → confidence = low (null SG-estimat)
 */
export function computeRoundSg(round: RoundInput): RoundSg {
  const notes: string[] = [];

  // Værjustering (gjelder uansett kilde)
  const weatherAdj = calculateWeatherAdjustment(round.windMs, round.rainMm, round.tempC);
  if (weatherAdj > 0) {
    notes.push(
      `Vær-justering: +${weatherAdj.toFixed(2)} slag (vind/regn/temp). Score nedjusteres med dette.`,
    );
  }

  // Field-strength (kun turneringsrunder)
  let fieldAdj = 0;
  if (round.isTournament && round.fieldStrength != null) {
    fieldAdj = round.fieldStrength;
    notes.push(
      `Turnerings-felt-styrke: ${fieldAdj.toFixed(2)}. Bedre felt = høyere påslag på faktisk SG.`,
    );
  }

  const differential = calculateDifferential(
    round.totalScore,
    round.courseRating,
    round.slopeRating,
  );

  // 1. Shot-level SG (beste kilde)
  if (round.sgTotal != null) {
    const adjustedSg = round.sgTotal + weatherAdj + fieldAdj;
    return {
      roundId: round.id,
      date: round.date,
      sgTotal: adjustedSg,
      sgOffTheTee: round.sgOffTheTee,
      sgApproach: round.sgApproach,
      sgAroundTheGreen: round.sgAroundTheGreen,
      sgPutting: round.sgPutting,
      differential,
      weatherAdjustment: weatherAdj,
      fieldStrengthAdjustment: fieldAdj,
      source: "shot_level",
      confidence: "high",
      notes,
    };
  }

  // 2. WHS Differential fallback
  if (differential != null) {
    const sgEquivalent = differentialToSgEquivalent(differential)!;
    const adjustedSg = sgEquivalent + weatherAdj + fieldAdj;
    notes.push(
      "SG estimert fra WHS Differential (ikke shot-level). Per-kategori-SG ikke tilgjengelig.",
    );
    return {
      roundId: round.id,
      date: round.date,
      sgTotal: adjustedSg,
      sgOffTheTee: null,
      sgApproach: null,
      sgAroundTheGreen: null,
      sgPutting: null,
      differential,
      weatherAdjustment: weatherAdj,
      fieldStrengthAdjustment: fieldAdj,
      source: "differential",
      confidence: "medium",
      notes,
    };
  }

  // 3. Ingen brukbar data
  notes.push(
    "Utilstrekkelig data: mangler enten shot-level SG eller (score + courseRating + slopeRating). Runden ekskluderes fra prognose.",
  );
  return {
    roundId: round.id,
    date: round.date,
    sgTotal: 0,
    sgOffTheTee: null,
    sgApproach: null,
    sgAroundTheGreen: null,
    sgPutting: null,
    differential: null,
    weatherAdjustment: weatherAdj,
    fieldStrengthAdjustment: fieldAdj,
    source: "none",
    confidence: "low",
    notes,
  };
}

// ── Aggregering over flere runder ──────────────────────────────────

/**
 * Beregn vektet snitt og standardavvik.
 * Nyere runder vektes høyere (eksponentiell decay).
 *
 * decay-parameter: 0.95 per runde → siste 20 runder dekker ~63% av vekten.
 */
const RECENCY_DECAY = 0.95;

function weightedStats(
  values: number[],
): { mean: number; stdDev: number } {
  if (values.length === 0) return { mean: 0, stdDev: 0 };

  // Nyeste runde får høyest vekt (values[0] antas nyest)
  const weights = values.map((_, i) => Math.pow(RECENCY_DECAY, i));
  const totalWeight = weights.reduce((a, b) => a + b, 0);

  const mean = values.reduce((sum, v, i) => sum + v * weights[i], 0) / totalWeight;
  const variance =
    values.reduce((sum, v, i) => sum + weights[i] * (v - mean) ** 2, 0) / totalWeight;
  return { mean, stdDev: Math.sqrt(variance) };
}

/**
 * Beregn spillerens SG-profil fra en historikk av runder.
 *
 * Runder sorteres nyeste først før vekting. Lavest confidence i noen av
 * rundene rapporteres som minConfidence for hele profilen.
 *
 * @param rounds Alle tilgjengelige runder (nyeste først eller ikke, sorteres internt)
 * @param options Konfigurasjon — f.eks. maks antall runder å bruke
 */
export function computePlayerSgProfile(
  rounds: RoundInput[],
  options: { maxRounds?: number } = {},
): PlayerSgProfile {
  const maxRounds = options.maxRounds ?? 20;

  // Sorter nyeste først, ta de N siste
  const sorted = [...rounds].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, maxRounds);

  // Beregn SG per runde
  const perRound = sorted.map(computeRoundSg);

  // Filtrer bort runder uten brukbar SG
  const usable = perRound.filter((r) => r.source !== "none");

  if (usable.length === 0) {
    return {
      sampleSize: 0,
      meanSgTotal: 0,
      stdDevSgTotal: 0,
      meanSgOtt: null,
      meanSgApp: null,
      meanSgArg: null,
      meanSgPutt: null,
      shotLevelCoverage: 0,
      minConfidence: "low",
      rounds: perRound,
    };
  }

  // Aggreger total
  const totals = usable.map((r) => r.sgTotal);
  const totalStats = weightedStats(totals);

  // Aggreger per kategori (bare shot-level-runder bidrar)
  const shotLevelRounds = usable.filter((r) => r.source === "shot_level");
  const shotLevelCoverage = shotLevelRounds.length / usable.length;

  let meanSgOtt: number | null = null;
  let meanSgApp: number | null = null;
  let meanSgArg: number | null = null;
  let meanSgPutt: number | null = null;

  if (shotLevelRounds.length > 0) {
    const ott = shotLevelRounds.map((r) => r.sgOffTheTee).filter((v): v is number => v != null);
    const app = shotLevelRounds.map((r) => r.sgApproach).filter((v): v is number => v != null);
    const arg = shotLevelRounds
      .map((r) => r.sgAroundTheGreen)
      .filter((v): v is number => v != null);
    const putt = shotLevelRounds.map((r) => r.sgPutting).filter((v): v is number => v != null);

    meanSgOtt = ott.length > 0 ? weightedStats(ott).mean : null;
    meanSgApp = app.length > 0 ? weightedStats(app).mean : null;
    meanSgArg = arg.length > 0 ? weightedStats(arg).mean : null;
    meanSgPutt = putt.length > 0 ? weightedStats(putt).mean : null;
  }

  // Laveste confidence = laveste ledd
  const confidenceOrder: Record<SgConfidence, number> = { high: 3, medium: 2, low: 1 };
  const minConf: SgConfidence = usable
    .map((r) => r.confidence)
    .reduce(
      (acc, cur) => (confidenceOrder[cur] < confidenceOrder[acc] ? cur : acc),
      "high" as SgConfidence,
    );

  return {
    sampleSize: usable.length,
    meanSgTotal: totalStats.mean,
    stdDevSgTotal: totalStats.stdDev,
    meanSgOtt,
    meanSgApp,
    meanSgArg,
    meanSgPutt,
    shotLevelCoverage,
    minConfidence: minConf,
    rounds: perRound,
  };
}

// ── Eksponerte hjelpere for prediction/forecast-kode ──────────────

/**
 * Estimer forventet score på en gitt bane gitt spillerens SG-profil.
 *
 * Matematisk kjede (konsistent med PGA-Tour-skalert SG):
 *   SG_total → HCP (via sgToHandicap spline)
 *           → expected differential
 *           → expected score = CR + diff × slope / 113
 *
 * For en scratch-spiller (HCP 0), returnerer omtrent CR.
 * For en HCP 5-spiller (kategori B, SG_total ≈ −0.8), returnerer CR + 5×slope/113.
 */
export function predictScoreFromSg(
  sgTotal: number,
  courseRating: number,
  slopeRating: number,
): number {
  const hcp = sgToHandicap(sgTotal);
  return courseRating + (hcp * slopeRating) / 113;
}

/**
 * Invers: gitt en forventet snitt-score på en bane, estimer PGA-Tour-skalert SG.
 * Brukes i coaching forecast for å konvertere mål-score til mål-SG.
 */
export function sgFromScore(
  score: number,
  courseRating: number,
  slopeRating: number,
): number {
  const diff = calculateDifferential(score, courseRating, slopeRating);
  if (diff == null) return 0;
  // Differential ≈ HCP for denne runden. Slå opp SG-benchmark.
  const category = handicapToCategory(Math.max(0, diff));
  const bench = SG_BENCHMARKS.find((b) => b.category === category);
  return bench?.sg.total ?? 0;
}

// Re-eksporter noen typer for bruk i tester/downstream
export type { LieType } from "./expected-strokes";

// Re-eksport slik at tester kan bruke expected-strokes direkte
export { getExpectedStrokes };
