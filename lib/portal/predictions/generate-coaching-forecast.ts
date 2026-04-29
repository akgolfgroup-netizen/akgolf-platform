/**
 * Coaching Forecast — hovedmotoren.
 *
 * Syer sammen:
 *   - Trinn A: Bane-justert SG (calculate-sg-from-rounds.ts)
 *   - Trinn B: Score → SG-delta
 *   - Trinn C: Headroom + empirisk regularisering (hours-per-sg-table.ts)
 *   - Trinn D: Hours-per-SG kalibrering
 *   - Trinn E: Tek/Tak/Mental/Fys-rotårsak-analyse
 *   - Trinn F: Monte-Carlo sannsynlighet
 *
 * Full metodologi: docs/strategy/COACHING_FORECAST_METHODOLOGY.md.
 *
 * Pure TypeScript — ingen DB-avhengighet. DB-lagring gjøres i separat service.
 */

import {
  computePlayerSgProfile,
  predictScoreFromSg,
  sgFromScore,
  type RoundInput,
  type PlayerSgProfile,
} from "@/lib/portal/golf/calculate-sg-from-rounds";
import { sgToCategory } from "@/lib/portal/golf/sg-to-handicap";
import {
  estimateHoursForSgDelta,
  applyOverlapFactor,
  regularizeAllocation,
  levelGroupFromCategory,
  getTableVersion,
  type SgCategory,
} from "./hours-per-sg-table";

export type { SgCategory } from "./hours-per-sg-table";
import { SG_BENCHMARKS } from "@/lib/portal/golf/sg-benchmarks";

// ── Typer ───────────────────────────────────────────────────────────

/** Diagnostisk input for rotårsak-analyse (se metodologi seksjon 7.2) */
export interface DiagnosticInput {
  /** TrackMan: face angle std dev per kategori, i grader */
  faceAngleStdDevDeg?: Partial<Record<SgCategory, number>>;
  /** TrackMan: ball speed score 0–100 (lav = fysisk svakhet) */
  ballSpeedScore?: number;
  /** Score-gap mellom trening og konkurranse per kategori (SG-delta) */
  pressureGapSg?: Partial<Record<SgCategory, number>>;
  /** Rundevarians (stor = inkonsistens) per kategori */
  varianceSg?: Partial<Record<SgCategory, number>>;
}

export type RootCause = "teknisk" | "fysisk" | "mental" | "taktisk" | "blandet";

export interface TechTactMentalPhys {
  tek: number;
  tak: number;
  mental: number;
  fys: number;
}

export interface CategoryAllocation {
  category: SgCategory;
  deltaSg: number;
  share: number; // 0–1, andel av totalt delta
  estimatedHours: number;
  ci95Low: number;
  ci95High: number;
  rootCause: RootCause;
  techTactMentalPhys: TechTactMentalPhys;
}

export interface CoachingForecastInput {
  /** Spillerens runde-historikk (siste 20 brukes som standard) */
  rounds: RoundInput[];
  /** Spillerens nåværende A–K-kategori (hvis kjent) — ellers utledes fra SG */
  currentCategory?: string;
  /** Alder i år */
  age: number;
  /** Tilgjengelig trenings-timer per uke */
  hoursPerWeek: number;

  /** Mål: ønsket snitt-score */
  targetScoreAvg: number;
  /** Deadline — hvor mange uker til målet skal nås */
  weeksToDeadline: number;
  /** Representativ Course Rating for baner spilleren opererer på */
  avgCourseRating: number;
  /** Representativ Slope Rating */
  avgSlopeRating: number;

  /** Diagnostisk data for rotårsak-analyse (optional, gir bedre fordeling) */
  diagnostic?: DiagnosticInput;

  /** Monte-Carlo-runs (default 10 000) */
  monteCarloRuns?: number;
}

export interface CoachingForecastOutput {
  modelVersion: string;
  generatedAt: Date;

  /** Oppsummering av nåværende tilstand */
  currentState: {
    scoreAvg: number;
    sgTotal: number;
    sgOtt: number | null;
    sgApp: number | null;
    sgArg: number | null;
    sgPutt: number | null;
    category: string;
    sampleSize: number;
    confidence: "high" | "medium" | "low";
  };

  /** Mål */
  target: {
    scoreAvg: number;
    category: string;
    deadlineWeeks: number;
    requiredSgDelta: number;
  };

  /** Per-kategori fordeling og estimert tidsbruk */
  allocations: CategoryAllocation[];

  /** Primær fokus-kategori (størst andel av forbedringen) */
  primaryFocusCategory: SgCategory;

  /** Total estimert tidsbruk (etter overlap-justering) */
  estimatedTotalHours: number;
  estimatedHoursCi95Low: number;
  estimatedHoursCi95High: number;

  /** Hvor mye må spilleren trene per uke */
  requiredHoursPerWeek: number;

  /** Sannsynlighet for måloppnåelse gitt tilgjengelige timer */
  probabilityOfSuccess: number;
  /** 95% CI for oppnådd SG-delta */
  confidenceInterval95: [number, number];
  monteCarloRuns: number;

  /** Menneskelig lesbar rotårsak per kategori */
  rootCauseSummary: Record<string, RootCause>;

  /** Liste med antakelser som gjelder for denne prognosen */
  assumptions: string[];
  /** Konkrete anbefalinger (ikke auto-generert) */
  recommendations: string[];
}

// ── Hjelpere ───────────────────────────────────────────────────────

const CATEGORIES: SgCategory[] = ["OTT", "APP", "ARG", "PUTT"];

/**
 * Map PGA-Tour-skalert SG_total til A–K-kategori via sgToHandicap-splinen.
 * Garantert konsistent med resten av USI-systemet.
 */
function sgCategoryFromAKBenchmark(sgTotal: number): string {
  return sgToCategory(sgTotal);
}

function akBenchmarkByCategory(category: string) {
  return SG_BENCHMARKS.find((b) => b.category === category.toUpperCase()) ?? SG_BENCHMARKS[0];
}

/**
 * Beregn headroom (ubrukt potensial) per kategori mot målnivå.
 */
function computeHeadroom(
  current: { ott: number | null; app: number | null; arg: number | null; putt: number | null },
  targetCategory: string,
): Record<SgCategory, number> {
  const target = akBenchmarkByCategory(targetCategory);
  const result: Record<SgCategory, number> = { OTT: 0, APP: 0, ARG: 0, PUTT: 0 };

  // Fallback: hvis per-kategori-SG mangler, bruk kategori-benchmark for "current"
  // basert på samlet SG_total-kategori
  if (current.ott == null || current.app == null || current.arg == null || current.putt == null) {
    // Vi bruker totalverdier for å fordele proporsjonalt
    // Dette er en grov approksimasjon når shot-level mangler
    const share = { OTT: 0.22, APP: 0.46, ARG: 0.18, PUTT: 0.14 };
    for (const cat of CATEGORIES) {
      result[cat] = share[cat];
    }
    return result;
  }

  result.OTT = Math.max(0, target.sg.offTheTee - current.ott);
  result.APP = Math.max(0, target.sg.approach - current.app);
  result.ARG = Math.max(0, target.sg.aroundTheGreen - current.arg);
  result.PUTT = Math.max(0, target.sg.putting - current.putt);
  return result;
}

function normalizeShares(raw: Record<SgCategory, number>): Record<SgCategory, number> {
  const sum = CATEGORIES.reduce((acc, c) => acc + raw[c], 0);
  if (sum <= 0) return { OTT: 0.25, APP: 0.25, ARG: 0.25, PUTT: 0.25 };
  const out = {} as Record<SgCategory, number>;
  for (const c of CATEGORIES) out[c] = raw[c] / sum;
  return out;
}

// ── Rotårsak-analyse (Trinn E) ─────────────────────────────────────

/**
 * Identifiser primær rotårsak per kategori basert på diagnostisk data.
 * Metodologi seksjon 7.2.
 */
function identifyRootCause(
  category: SgCategory,
  diagnostic: DiagnosticInput | undefined,
): RootCause {
  if (!diagnostic) return "blandet";

  const faceStd = diagnostic.faceAngleStdDevDeg?.[category];
  const pressureGap = diagnostic.pressureGapSg?.[category];
  const variance = diagnostic.varianceSg?.[category];

  // Teknisk: høy face-angle std dev (> 1.5°)
  const hasTechnicalIssue = faceStd != null && faceStd > 1.5;

  // Fysisk: bare for OTT — lav ball speed score
  const hasPhysicalIssue =
    category === "OTT" && diagnostic.ballSpeedScore != null && diagnostic.ballSpeedScore < 50;

  // Mental: stor gap mellom trening og konkurranse (> 0.5 SG)
  const hasMentalIssue = pressureGap != null && pressureGap > 0.5;

  // Taktisk: inkonsistent varians men ikke tekniske problemer (heuristikk)
  const hasTacticalIssue =
    !hasTechnicalIssue && !hasPhysicalIssue && variance != null && variance > 0.8;

  // Prioritert: hvis flere samtidig → "blandet"
  const flags = [hasTechnicalIssue, hasPhysicalIssue, hasMentalIssue, hasTacticalIssue];
  const count = flags.filter(Boolean).length;

  if (count === 0) return "blandet";
  if (count > 1) return "blandet";
  if (hasTechnicalIssue) return "teknisk";
  if (hasPhysicalIssue) return "fysisk";
  if (hasMentalIssue) return "mental";
  return "taktisk";
}

/**
 * Fordel treningstiden på Tek/Tak/Mental/Fys basert på rotårsak.
 * Fra metodologi seksjon 7.3.
 */
function techTactMentalPhysFromRootCause(rootCause: RootCause): TechTactMentalPhys {
  switch (rootCause) {
    case "teknisk":
      return { tek: 0.65, tak: 0.1, mental: 0.1, fys: 0.15 };
    case "fysisk":
      return { tek: 0.3, tak: 0.05, mental: 0.1, fys: 0.55 };
    case "mental":
      return { tek: 0.25, tak: 0.2, mental: 0.5, fys: 0.05 };
    case "taktisk":
      return { tek: 0.15, tak: 0.6, mental: 0.15, fys: 0.1 };
    case "blandet":
    default:
      return { tek: 0.4, tak: 0.2, mental: 0.25, fys: 0.15 };
  }
}

// ── Monte-Carlo (Trinn F) ──────────────────────────────────────────

/**
 * Boks-Muller for normal-fordeling.
 */
function sampleNormal(mean: number, stdDev: number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + stdDev * z;
}

/**
 * Beta-sample via Marsaglia trick (via normal gamma-approksimasjon).
 * For Beta(α, β), approksimer via to uniforms når α, β > 1.
 */
function sampleBeta(alpha: number, beta: number): number {
  // Enkelt uniform-basert trick — brukbart for α, β ≥ 1
  // Gir tilnærmet skjev fordeling
  const u = Math.random();
  const v = Math.random();
  const x = Math.pow(u, 1 / alpha);
  const y = Math.pow(v, 1 / beta);
  return x / (x + y);
}

function sampleLogNormal(mu: number, sigma: number): number {
  return Math.exp(sampleNormal(mu, sigma));
}

function sampleBernoulli(p: number): boolean {
  return Math.random() < p;
}

function quantile(sorted: number[], q: number): number {
  if (sorted.length === 0) return 0;
  const pos = q * (sorted.length - 1);
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

interface MonteCarloResult {
  probability: number;
  ci95: [number, number];
}

function runMonteCarlo(
  plannedHours: number,
  effectiveHoursPerSgUnit: number,
  requiredDeltaSg: number,
  runs: number,
): MonteCarloResult {
  const achieved: number[] = [];
  for (let i = 0; i < runs; i++) {
    // Individuell variasjon i timer-behov
    const hoursMultiplier = sampleLogNormal(0, 0.3);
    // Treningseffektivitet
    const efficiency = sampleBeta(4, 2);
    // Værforstyrrelser/skader
    const disrupted = sampleBernoulli(0.15);
    const hoursAvailable = plannedHours * (disrupted ? 0.7 : 1);

    const achievedDelta =
      (hoursAvailable * efficiency) / (effectiveHoursPerSgUnit * hoursMultiplier);
    achieved.push(achievedDelta);
  }
  const reached = achieved.filter((a) => a >= requiredDeltaSg).length;
  const probability = reached / runs;

  achieved.sort((a, b) => a - b);
  const ci95: [number, number] = [quantile(achieved, 0.025), quantile(achieved, 0.975)];
  return { probability, ci95 };
}

// ── Hoved-motoren ──────────────────────────────────────────────────

export function generateCoachingForecast(
  input: CoachingForecastInput,
): CoachingForecastOutput {
  const monteCarloRuns = input.monteCarloRuns ?? 10_000;

  // ── Trinn A: SG-profil ────────────────────────────────────────────
  const profile: PlayerSgProfile = computePlayerSgProfile(input.rounds, { maxRounds: 20 });

  const currentCategory =
    input.currentCategory ?? sgCategoryFromAKBenchmark(profile.meanSgTotal);

  const currentScoreAvg = predictScoreFromSg(
    profile.meanSgTotal,
    input.avgCourseRating,
    input.avgSlopeRating,
  );

  // ── Trinn B: Score → SG-delta (PGA-Tour-skalert via A–K-benchmark) ─
  const targetSgTotal = sgFromScore(
    input.targetScoreAvg,
    input.avgCourseRating,
    input.avgSlopeRating,
  );
  const targetCategory = sgCategoryFromAKBenchmark(targetSgTotal);
  const requiredSgDelta = Math.max(0, targetSgTotal - profile.meanSgTotal);

  // ── Trinn C: Fordel delta på kategorier ──────────────────────────
  const headroom = computeHeadroom(
    {
      ott: profile.meanSgOtt,
      app: profile.meanSgApp,
      arg: profile.meanSgArg,
      putt: profile.meanSgPutt,
    },
    targetCategory,
  );
  const headroomShares = normalizeShares(headroom);
  const regShares = regularizeAllocation(headroomShares);

  const deltaPerCategory: Record<SgCategory, number> = {
    OTT: regShares.OTT * requiredSgDelta,
    APP: regShares.APP * requiredSgDelta,
    ARG: regShares.ARG * requiredSgDelta,
    PUTT: regShares.PUTT * requiredSgDelta,
  };

  // ── Trinn D: Hours-per-SG ─────────────────────────────────────────
  const allocations: CategoryAllocation[] = CATEGORIES.map((cat) => {
    const estRaw = estimateHoursForSgDelta(
      cat,
      levelGroupFromCategory(currentCategory),
      deltaPerCategory[cat],
    );
    const rootCause = identifyRootCause(cat, input.diagnostic);
    const ttmp = techTactMentalPhysFromRootCause(rootCause);

    return {
      category: cat,
      deltaSg: deltaPerCategory[cat],
      share: regShares[cat],
      estimatedHours: estRaw.hours,
      ci95Low: estRaw.ci95Low,
      ci95High: estRaw.ci95High,
      rootCause,
      techTactMentalPhys: ttmp,
    };
  });

  // ── Overlap-justering for total ──────────────────────────────────
  const rawTotalHours = allocations.reduce((sum, a) => sum + a.estimatedHours, 0);
  const rawCi95Low = allocations.reduce((sum, a) => sum + a.ci95Low, 0);
  const rawCi95High = allocations.reduce((sum, a) => sum + a.ci95High, 0);

  const estimatedTotalHours = applyOverlapFactor(rawTotalHours);
  const estimatedHoursCi95Low = applyOverlapFactor(rawCi95Low);
  const estimatedHoursCi95High = applyOverlapFactor(rawCi95High);

  const requiredHoursPerWeek =
    input.weeksToDeadline > 0 ? estimatedTotalHours / input.weeksToDeadline : 0;

  // ── Trinn F: Monte-Carlo ──────────────────────────────────────────
  const plannedHours = input.hoursPerWeek * input.weeksToDeadline;
  // Effektiv hours-per-SG-enhet: total timer / oppnådd delta i gjennomsnitt
  // Bruker 0.1 som enhet (som tabellen)
  const effectiveHoursPerTenthSg =
    requiredSgDelta > 0 ? estimatedTotalHours / (requiredSgDelta / 0.1) : 1;
  // Konvertér til "hours per 1 SG" for Monte-Carlo
  const hoursPerSgUnit = effectiveHoursPerTenthSg * 10;

  const mc =
    requiredSgDelta > 0 && plannedHours > 0
      ? runMonteCarlo(plannedHours, hoursPerSgUnit, requiredSgDelta, monteCarloRuns)
      : { probability: requiredSgDelta <= 0 ? 1 : 0, ci95: [0, 0] as [number, number] };

  // ── Primær fokus ──────────────────────────────────────────────────
  const primaryFocus =
    allocations.sort((a, b) => b.share - a.share)[0]?.category ?? "APP";

  // ── Antakelser (eksplisitt listet) ────────────────────────────────
  const assumptions: string[] = [
    "Timer forutsetter deliberate practice (målrettet med feedback), ikke 'ranslå'.",
    "Coach-tilstedeværelse minst 2 timer/uke antas.",
    "Ingen alvorlige skader eller lange avbrekk.",
    "Tilgang til TrackMan minst 1x/uke og bane minst 1x/uke.",
    "Estimatene er ekspert-basert, ikke kalibrert mot vår egen database per 2026-04-17.",
    `Aldersgruppe ${input.age} år: modellen er kalibrert for 13–21 år.`,
    "Individuell variasjon kan være ±40%.",
  ];

  if (profile.sampleSize < 10) {
    assumptions.push(
      `ADVARSEL: Bare ${profile.sampleSize} runder i historikken. Minst 10 anbefales for pålitelig prognose.`,
    );
  }

  if (profile.shotLevelCoverage < 0.5) {
    assumptions.push(
      `ADVARSEL: Kun ${Math.round(profile.shotLevelCoverage * 100)}% av rundene har shot-level SG-data. Per-kategori-fordeling er mindre pålitelig.`,
    );
  }

  // ── Anbefalinger (menneskelig-lesbare, coach skal bekrefte) ──────
  const recommendations: string[] = [];
  for (const alloc of allocations.slice(0, 3)) {
    if (alloc.share > 0.15) {
      const rootCauseLabel = alloc.rootCause;
      const hoursPerWeek = (
        applyOverlapFactor(alloc.estimatedHours) / input.weeksToDeadline
      ).toFixed(1);
      recommendations.push(
        `${alloc.category}: ${(alloc.share * 100).toFixed(0)}% av forbedringen — ${hoursPerWeek} t/uke, hovedrotårsak: ${rootCauseLabel}`,
      );
    }
  }

  // ── Output ────────────────────────────────────────────────────────
  return {
    modelVersion: `methodology-1.0/hoursTable-${getTableVersion()}`,
    generatedAt: new Date(),
    currentState: {
      scoreAvg: currentScoreAvg,
      sgTotal: profile.meanSgTotal,
      sgOtt: profile.meanSgOtt,
      sgApp: profile.meanSgApp,
      sgArg: profile.meanSgArg,
      sgPutt: profile.meanSgPutt,
      category: currentCategory,
      sampleSize: profile.sampleSize,
      confidence: profile.minConfidence,
    },
    target: {
      scoreAvg: input.targetScoreAvg,
      category: targetCategory,
      deadlineWeeks: input.weeksToDeadline,
      requiredSgDelta,
    },
    allocations,
    primaryFocusCategory: primaryFocus,
    estimatedTotalHours,
    estimatedHoursCi95Low,
    estimatedHoursCi95High,
    requiredHoursPerWeek,
    probabilityOfSuccess: mc.probability,
    confidenceInterval95: mc.ci95,
    monteCarloRuns,
    rootCauseSummary: Object.fromEntries(
      allocations.map((a) => [a.category, a.rootCause]),
    ) as Record<string, RootCause>,
    assumptions,
    recommendations,
  };
}

/**
 * Re-eksporter hjelpere for tester.
 */
export { runMonteCarlo, identifyRootCause, techTactMentalPhysFromRootCause };
