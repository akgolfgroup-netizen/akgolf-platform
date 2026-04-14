/**
 * DECADE Caddy — Banguide og strategi basert pa DECADE-prinsippet
 *
 * DECADE: "Bruk din FAKTISKE spredning til a ta SMARTE beslutninger pa banen."
 *
 * Funksjoner:
 * 1. Forventet score per hull basert pa spillerens spredning
 * 2. Optimal klubbvalg og aimpoint
 * 3. Pre-shot rutine coaching per niva
 * 4. Post-hull evaluering og DECADE-score
 */

import type { ClubDispersion } from "./dispersion";
import { recommendClub } from "./dispersion";
import { getExpectedStrokes } from "./expected-strokes";
import type { ReferenceCourse, ClubDispersionData } from "@prisma/client";

// ════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════

export interface HoleLayout {
  holeNumber: number;
  par: number;
  lengthMeter: number;
  handicap?: number;
  fairwayWidth?: number;     // meter
  greenDepth?: number;       // meter (front to back)
  greenWidth?: number;       // meter
  hazardLeft?: boolean;
  hazardRight?: boolean;
  hazardShort?: boolean;
  hazardLong?: boolean;
  obLeft?: boolean;
  obRight?: boolean;
  dogleg?: "left" | "right" | "none";
  elevation?: number;        // meter (+ = oppover)
}

export interface DecadeHoleStrategy {
  holeNumber: number;
  par: number;
  length: number;
  expectedScore: number;
  teeClub: string;
  teeAimpoint: string;
  approachTarget: string;
  reasoning: string;
  riskLevel: "low" | "medium" | "high";
  keyDecision: string;
}

export interface DecadeHoleEvaluation {
  holeNumber: number;
  expectedScore: number;
  actualScore: number;
  vsExpected: number;         // actualScore - expectedScore
  strategyFollowed: boolean;
  sgBreakdown: {
    tee: number;
    approach: number;
    shortGame: number;
    putting: number;
  };
  decadeDecision: "SMART" | "NEUTRAL" | "RISKY";
}

export interface PreShotRoutine {
  level: string;              // A-K kategori
  steps: string[];
  durationSeconds: number;
  keyFocus: string;
}

// ════════════════════════════════════════════════════════════
// HOLE STRATEGY
// ════════════════════════════════════════════════════════════

/**
 * Generer DECADE-strategi for et hull basert pa spillerens spredning
 */
export function generateHoleStrategy(
  hole: HoleLayout,
  dispersions: ClubDispersion[],
  playerHandicap: number
): DecadeHoleStrategy {
  const isShortPar4 = hole.par === 4 && hole.lengthMeter < 340;
  const isLongPar4 = hole.par === 4 && hole.lengthMeter > 400;
  const fairwayWidth = hole.fairwayWidth ?? 30; // default 30m

  // Finn driver-spredning
  const driverDisp = dispersions.find((d) =>
    d.club.toLowerCase().includes("driver")
  );

  // Anbefalt tee-klubb
  let teeClub = "Driver";
  let teeAimpoint = "Midt fairway";
  let reasoning = "";
  let riskLevel: "low" | "medium" | "high" = "medium";

  if (hole.par === 3) {
    // Par 3: velg klubb for greenen
    const rec = recommendClub(hole.lengthMeter, dispersions, {
      preferShort: hole.hazardLong === true,
    });
    teeClub = rec?.recommended ?? "7 Iron";
    teeAimpoint = "Senter green";
    reasoning = rec?.reasoning ?? `Par 3, ${hole.lengthMeter}m.`;
    riskLevel = "low";
  } else if (driverDisp && driverDisp.dispersion95.lateral > fairwayWidth * 0.8) {
    // Driver-spredning er for bred for fairway — bruk kortere klubb
    const safeClubs = dispersions.filter(
      (d) =>
        d.dispersion95.lateral < fairwayWidth * 0.7 &&
        d.avgCarry > 150
    );
    const safest = safeClubs.sort((a, b) => b.avgCarry - a.avgCarry)[0];

    if (safest) {
      teeClub = safest.club;
      reasoning = `Din driver-spredning (${driverDisp.dispersion95.lateral}m) er bredere enn fairway (${fairwayWidth}m). ${safest.club} (${safest.dispersion95.lateral}m spredning) gir bedre treff-sjanse.`;
      riskLevel = "low";
    } else {
      teeClub = "Driver";
      reasoning = `Bred fairway-utfordring. Fokuser pa kontakt og retning.`;
      riskLevel = "high";
    }
  } else if (isShortPar4) {
    teeClub = "Driver";
    reasoning = `Kort par 4 (${hole.lengthMeter}m). Aggressiv strategi mulig.`;
    riskLevel = "medium";
  } else {
    teeClub = "Driver";
    reasoning = `Standard par ${hole.par}. ${hole.lengthMeter}m.`;
    riskLevel = driverDisp && driverDisp.dispersion95.lateral < fairwayWidth * 0.5
      ? "low"
      : "medium";
  }

  // Hazard-justeringer
  if (hole.hazardLeft || hole.obLeft) {
    teeAimpoint = "Hoyre side av fairway";
    reasoning += " Hazard/OB venstre — sikt hoyre.";
  } else if (hole.hazardRight || hole.obRight) {
    teeAimpoint = "Venstre side av fairway";
    reasoning += " Hazard/OB hoyre — sikt venstre.";
  }

  // Approach-strategi
  let approachTarget = "Senter green";
  if (hole.hazardShort) {
    approachTarget = "Bak midt green (unnga kort)";
  } else if (hole.hazardLong) {
    approachTarget = "Front av green (unnga lang)";
  }

  // Forventet score basert pa spillerens handicap
  const expectedScore = getExpectedStrokes(hole.lengthMeter, "tee") +
    (playerHandicap / 18) * (hole.handicap ? (19 - hole.handicap) / 18 : 0.5);

  const keyDecision = hole.par === 3
    ? `Klubbvalg til green: ${teeClub}`
    : `Tee-slag: ${teeClub} mot ${teeAimpoint}`;

  return {
    holeNumber: hole.holeNumber,
    par: hole.par,
    length: hole.lengthMeter,
    expectedScore: Math.round(expectedScore * 100) / 100,
    teeClub,
    teeAimpoint,
    approachTarget,
    reasoning: reasoning.trim(),
    riskLevel,
    keyDecision,
  };
}

/**
 * Estimer forventet score for en bane basert pa spillerens spredning
 */
export function estimateScoreForCourse(
  course: ReferenceCourse,
  dispersions: ClubDispersionData[]
): {
  expectedScore: number;
  scoreRangeLow: number;
  scoreRangeHigh: number;
  confidence: number;
  breakdown: Record<string, number>;
  reasoning: string[];
} {
  const holes = course.par === 72 ? 18 : 9;
  const par3s = Math.floor(holes / 6);
  const par5s = Math.floor(holes / 6);
  const par4s = holes - par3s - par5s;

  const avgLength = course.lengthMeter / holes;

  const driverDisp = dispersions.find((d) =>
    d.club.toLowerCase().includes("driver")
  );

  const hasReliableData = dispersions.length >= 3 && driverDisp && driverDisp.sampleSize >= 10;

  // Base expected strokes per hole type
  const par3Expected = getExpectedStrokes(avgLength * 0.6, "tee");
  const par4Expected = getExpectedStrokes(avgLength, "tee");
  const par5Expected = getExpectedStrokes(avgLength * 1.2, "tee");

  let expectedScore = par3s * par3Expected + par4s * par4Expected + par5s * par5Expected;

  // Adjust for course difficulty
  const slopeFactor = (course.slopeRating - 113) / 113;
  expectedScore += expectedScore * slopeFactor * 0.3;

  // Adjust for dispersion reliability
  const confidence = hasReliableData ? 85 : 60;
  const variance = hasReliableData ? 3 : 6;

  return {
    expectedScore: Math.round(expectedScore),
    scoreRangeLow: Math.round(expectedScore - variance),
    scoreRangeHigh: Math.round(expectedScore + variance),
    confidence,
    breakdown: {
      par3Contribution: Math.round(par3s * par3Expected * 10) / 10,
      par4Contribution: Math.round(par4s * par4Expected * 10) / 10,
      par5Contribution: Math.round(par5s * par5Expected * 10) / 10,
      slopeAdjustment: Math.round(expectedScore * slopeFactor * 0.3 * 10) / 10,
    },
    reasoning: [
      `Banelengde: ${course.lengthMeter}m over ${holes} hull`,
      `Gjennomsnittlig hullengde: ${Math.round(avgLength)}m`,
      `Slope-rating: ${course.slopeRating} gir ${slopeFactor > 0 ? "vanskeligere" : "lettere"} forhold`,
      hasReliableData
        ? `Pålitelig TrackMan-data (${dispersions.length} klubber)`
        : `Begrenset TrackMan-data — estimatet er usikkert`,
    ],
  };
}

// ════════════════════════════════════════════════════════════
// PRE-SHOT ROUTINE
// ════════════════════════════════════════════════════════════

/**
 * Hent pre-shot rutine basert pa spillerniva (A-K kategori)
 * Fra AK Golf metodikken i training-knowledge.ts
 */
export function getPreShotRoutine(playerCategory: string): PreShotRoutine {
  const cat = playerCategory.toUpperCase();

  if (cat >= "G" && cat <= "K") {
    // Nybegynner (K-J): 3 trinn
    return {
      level: cat,
      steps: ["SE — Velg mal", "FOL — Fol svingen", "SLA — Utfor"],
      durationSeconds: 18,
      keyFocus: "Hold det enkelt. Se malet, fol bevegelsen, sla.",
    };
  }

  if (cat >= "D" && cat <= "F") {
    // Mellom (I-H tilpasset): 5 trinn
    return {
      level: cat,
      steps: [
        "VURDER — Avstand, vind, lie",
        "VISUALISER — Se ballen fly til malet",
        "FOL — Provesving med riktig fart",
        "SETUP — Stilling og siktelinje",
        "UTFOR — Trigger og sving",
      ],
      durationSeconds: 30,
      keyFocus: "Visualiser slagbanen for du tar stilling.",
    };
  }

  // Avansert (A-C): 5 trinn med dypere fokus
  return {
    level: cat,
    steps: [
      "STRATEGISK VURDERING — Avstand, vind, lie, risiko, mal",
      "MULTISENSORISK VISUALISERING — Se, fol, hor slaget",
      "FYSISK REPETISJON — Provesving med eksakt tempo",
      "PRESIS SIKTING — Intermediate target, setup-sjekk",
      "TRIGGER OG UTFOR — Start-trigger, full commitment",
    ],
    durationSeconds: 45,
    keyFocus: "Full commitment til beslutningen. Ingen tvil i svingen.",
  };
}

// ════════════════════════════════════════════════════════════
// DECADE EVALUATION
// ════════════════════════════════════════════════════════════

/**
 * Evaluer et hull etter spill — var beslutningen SMART, NEUTRAL, eller RISKY?
 */
export function evaluateDecision(
  strategy: DecadeHoleStrategy,
  actualClubUsed: string,
  strategyFollowed: boolean,
  actualScore: number
): {
  decision: "SMART" | "NEUTRAL" | "RISKY";
  explanation: string;
} {
  const vsExpected = actualScore - strategy.expectedScore;

  if (strategyFollowed) {
    if (vsExpected <= 0) {
      return {
        decision: "SMART",
        explanation: `Fulgte strategien og scoret ${vsExpected === 0 ? "som forventet" : `${Math.abs(vsExpected).toFixed(1)} bedre enn forventet`}.`,
      };
    }
    return {
      decision: "NEUTRAL",
      explanation: `Fulgte strategien men scoret ${vsExpected.toFixed(1)} over forventet. Utforelsen kan forbedres.`,
    };
  }

  // Brote med strategi
  if (vsExpected <= -1) {
    return {
      decision: "NEUTRAL",
      explanation: `Avvek fra strategien (brukte ${actualClubUsed} i stedet for ${strategy.teeClub}) men fikk godt resultat. Likevel: konsistens > flaks.`,
    };
  }

  return {
    decision: "RISKY",
    explanation: `Avvek fra strategien og scoret ${vsExpected.toFixed(1)} over forventet. DECADE anbefaler a folge planen.`,
  };
}

/**
 * Beregn samlet DECADE-score for en runde (0-100)
 * Basert pa: strategietterlevelse, beslutningskvalitet, pre-shot rutine
 */
export function calculateRoundDecadeScore(
  evaluations: Array<{
    strategyFollowed: boolean;
    decision: "SMART" | "NEUTRAL" | "RISKY";
    preRoutineCompleted: boolean;
  }>
): number {
  if (evaluations.length === 0) return 0;

  let score = 0;
  const maxPerHole = 100 / evaluations.length;

  for (const ev of evaluations) {
    let holeScore = 0;

    // Strategi-etterlevelse (40%)
    if (ev.strategyFollowed) holeScore += maxPerHole * 0.4;

    // Beslutningskvalitet (40%)
    if (ev.decision === "SMART") holeScore += maxPerHole * 0.4;
    else if (ev.decision === "NEUTRAL") holeScore += maxPerHole * 0.2;

    // Pre-shot rutine (20%)
    if (ev.preRoutineCompleted) holeScore += maxPerHole * 0.2;

    score += holeScore;
  }

  return Math.round(score);
}
