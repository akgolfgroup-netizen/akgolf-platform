import { describe, it, expect } from "vitest";
import {
  calculateDifferential,
  differentialToSgEquivalent,
  calculateWeatherAdjustment,
  computeRoundSg,
  computePlayerSgProfile,
  predictScoreFromSg,
  type RoundInput,
} from "@/lib/portal/golf/calculate-sg-from-rounds";

// ── WHS Differential ───────────────────────────────────────────────

describe("calculateDifferential", () => {
  it("beregner standard WHS-differential korrekt", () => {
    // Kjent eksempel fra USGA Rules of Handicapping Appendiks E:
    // Score 85, CR 70.2, Slope 124 → Differential = (85-70.2)×113/124 = 13.49
    const diff = calculateDifferential(85, 70.2, 124);
    expect(diff).toBeCloseTo(13.49, 2);
  });

  it("gir 0 differential når score = CR og slope = 113", () => {
    const diff = calculateDifferential(72, 72.0, 113);
    expect(diff).toBeCloseTo(0, 3);
  });

  it("negativ differential for under-scratch-spill", () => {
    // Score 68 på CR 70 med slope 113 → differential −2
    const diff = calculateDifferential(68, 70.0, 113);
    expect(diff).toBeCloseTo(-2.0, 2);
  });

  it("returnerer null ved manglende score", () => {
    expect(calculateDifferential(null, 70, 113)).toBeNull();
  });

  it("returnerer null ved manglende Course Rating", () => {
    expect(calculateDifferential(75, null, 113)).toBeNull();
  });

  it("returnerer null ved ugyldig Slope (≤0)", () => {
    expect(calculateDifferential(75, 70, 0)).toBeNull();
    expect(calculateDifferential(75, 70, -10)).toBeNull();
  });

  it("høyere slope gir mindre differential (vanskelig bane = mer forgjeving)", () => {
    // Samme score, men slope 150 vs 113:
    const diffEasy = calculateDifferential(80, 70, 113); // 10
    const diffHard = calculateDifferential(80, 70, 150); // 7.53
    expect(diffEasy).toBeGreaterThan(diffHard!);
  });

  it("Emil-scenariet fra metodologi-dokumentet", () => {
    // 75 på CR 71, Slope 125 → (75-71)*113/125 = 3.616
    const diff = calculateDifferential(75, 71, 125);
    expect(diff).toBeCloseTo(3.616, 2);

    // 72 på CR 71, Slope 125 → (72-71)*113/125 = 0.904
    const diffGoal = calculateDifferential(72, 71, 125);
    expect(diffGoal).toBeCloseTo(0.904, 2);

    // Delta differential: 3.616 − 0.904 = 2.712 ≈ 2.7 (metodologi seksjon 4.3)
    expect(diff! - diffGoal!).toBeCloseTo(2.712, 2);
  });
});

describe("differentialToSgEquivalent", () => {
  it("mapper differential til PGA-Tour-skalert SG via A–K-benchmark", () => {
    // Differential 4 ≈ HCP 4 → kategori B → SG ≈ +0.8 (PGA Tour: positiv = bedre enn snitt)
    const sg = differentialToSgEquivalent(4);
    expect(sg).toBeCloseTo(0.8, 1);
  });

  it("HCP 0-2 (scratch) ≈ kategori A ≈ SG +3.5", () => {
    const sg = differentialToSgEquivalent(1);
    expect(sg).toBeCloseTo(3.5, 1);
  });

  it("HCP 15 ≈ kategori F ≈ SG -2.0", () => {
    const sg = differentialToSgEquivalent(15);
    expect(sg).toBeCloseTo(-2.0, 1);
  });

  it("null-input gir null-output", () => {
    expect(differentialToSgEquivalent(null)).toBeNull();
  });
});

// ── Vær-justering ──────────────────────────────────────────────────

describe("calculateWeatherAdjustment", () => {
  it("gir 0 ved normale forhold", () => {
    expect(calculateWeatherAdjustment(2, 0, 18)).toBe(0);
  });

  it("legger til for vind over 3 m/s", () => {
    // 6 m/s → (6-3) * 0.25 = 0.75
    expect(calculateWeatherAdjustment(6, 0, 18)).toBeCloseTo(0.75, 3);
  });

  it("legger til for regn", () => {
    // 10 mm regn → 10 * 0.15 = 1.5
    expect(calculateWeatherAdjustment(0, 10, 18)).toBeCloseTo(1.5, 3);
  });

  it("legger til for kulde under 15°C", () => {
    // 5°C → (15-5) * 0.05 = 0.5
    expect(calculateWeatherAdjustment(0, 0, 5)).toBeCloseTo(0.5, 3);
  });

  it("kombinerer alle tre faktorer additivt", () => {
    // 8 m/s, 5 mm, 10°C → 1.25 + 0.75 + 0.25 = 2.25
    expect(calculateWeatherAdjustment(8, 5, 10)).toBeCloseTo(2.25, 3);
  });

  it("ignorer null-verdier gracefully", () => {
    expect(calculateWeatherAdjustment(null, null, null)).toBe(0);
    expect(calculateWeatherAdjustment(undefined, undefined, undefined)).toBe(0);
  });
});

// ── computeRoundSg ─────────────────────────────────────────────────

describe("computeRoundSg", () => {
  const baseRound: RoundInput = {
    id: "r1",
    date: new Date("2026-04-01"),
    totalScore: 75,
    par: 72,
    courseRating: 71,
    slopeRating: 125,
    sgTotal: null,
    sgOffTheTee: null,
    sgApproach: null,
    sgAroundTheGreen: null,
    sgPutting: null,
  };

  it("bruker shot-level SG når tilgjengelig (confidence = high)", () => {
    const round: RoundInput = {
      ...baseRound,
      sgTotal: -2.5,
      sgOffTheTee: -0.5,
      sgApproach: -1.2,
      sgAroundTheGreen: -0.3,
      sgPutting: -0.5,
    };
    const result = computeRoundSg(round);
    expect(result.source).toBe("shot_level");
    expect(result.confidence).toBe("high");
    expect(result.sgTotal).toBeCloseTo(-2.5, 3);
    expect(result.sgApproach).toBe(-1.2);
  });

  it("faller tilbake til WHS Differential (confidence = medium)", () => {
    const result = computeRoundSg(baseRound);
    expect(result.source).toBe("differential");
    expect(result.confidence).toBe("medium");
    // Differential 3.616 → HCP ~4 → kategori B → SG ≈ +0.8 (PGA-Tour-skala)
    expect(result.sgTotal).toBeCloseTo(0.8, 1);
    // Per-kategori skal være null uten shot-level data
    expect(result.sgOffTheTee).toBeNull();
    expect(result.sgApproach).toBeNull();
  });

  it("rapporterer low confidence og excluder-flagg når data mangler", () => {
    const round: RoundInput = {
      ...baseRound,
      courseRating: null,
      slopeRating: null,
      totalScore: 75,
    };
    const result = computeRoundSg(round);
    expect(result.source).toBe("none");
    expect(result.confidence).toBe("low");
    expect(result.notes.some((n) => n.toLowerCase().includes("utilstrekkelig"))).toBe(true);
  });

  it("legger vær-justering på toppen av SG", () => {
    const round: RoundInput = {
      ...baseRound,
      sgTotal: -2.0,
      windMs: 6,
      rainMm: 0,
      tempC: 18,
    };
    // windAdj = (6-3) * 0.25 = 0.75
    const result = computeRoundSg(round);
    expect(result.weatherAdjustment).toBeCloseTo(0.75, 3);
    expect(result.sgTotal).toBeCloseTo(-2.0 + 0.75, 3);
  });

  it("legger field-strength-justering til turneringsrunder", () => {
    const round: RoundInput = {
      ...baseRound,
      sgTotal: -1.5,
      isTournament: true,
      fieldStrength: 0.8,
    };
    const result = computeRoundSg(round);
    expect(result.fieldStrengthAdjustment).toBeCloseTo(0.8, 3);
    expect(result.sgTotal).toBeCloseTo(-1.5 + 0.8, 3);
  });

  it("ignorer field-strength for ikke-turneringsrunder", () => {
    const round: RoundInput = {
      ...baseRound,
      sgTotal: -1.5,
      isTournament: false,
      fieldStrength: 0.8,
    };
    const result = computeRoundSg(round);
    expect(result.fieldStrengthAdjustment).toBe(0);
    expect(result.sgTotal).toBeCloseTo(-1.5, 3);
  });
});

// ── computePlayerSgProfile ─────────────────────────────────────────

describe("computePlayerSgProfile", () => {
  function mkRound(partial: Partial<RoundInput> & { id: string; date: Date }): RoundInput {
    return {
      totalScore: null,
      par: 72,
      courseRating: null,
      slopeRating: null,
      sgTotal: null,
      sgOffTheTee: null,
      sgApproach: null,
      sgAroundTheGreen: null,
      sgPutting: null,
      ...partial,
    };
  }

  it("returnerer tom profil når ingen brukbare runder", () => {
    const profile = computePlayerSgProfile([
      mkRound({ id: "a", date: new Date("2026-03-01"), totalScore: 80 }), // mangler CR/slope
    ]);
    expect(profile.sampleSize).toBe(0);
    expect(profile.meanSgTotal).toBe(0);
    expect(profile.minConfidence).toBe("low");
  });

  it("aggregerer shot-level-runder med høy confidence", () => {
    const profile = computePlayerSgProfile([
      mkRound({
        id: "r1",
        date: new Date("2026-04-01"),
        sgTotal: -2.0,
        sgOffTheTee: -0.5,
        sgApproach: -1.0,
        sgAroundTheGreen: -0.3,
        sgPutting: -0.2,
      }),
      mkRound({
        id: "r2",
        date: new Date("2026-03-25"),
        sgTotal: -2.4,
        sgOffTheTee: -0.6,
        sgApproach: -1.2,
        sgAroundTheGreen: -0.4,
        sgPutting: -0.2,
      }),
    ]);
    expect(profile.sampleSize).toBe(2);
    expect(profile.shotLevelCoverage).toBe(1);
    expect(profile.minConfidence).toBe("high");
    // Nyeste runde (-2.0) vektes høyere enn eldre (-2.4), så snitt < -2.2
    expect(profile.meanSgTotal).toBeGreaterThan(-2.2);
    expect(profile.meanSgTotal).toBeLessThan(-2.0);
  });

  it("blander shot-level og differential-kilder", () => {
    const profile = computePlayerSgProfile([
      mkRound({
        id: "r1",
        date: new Date("2026-04-01"),
        sgTotal: -2.0,
        sgOffTheTee: -0.5,
        sgApproach: -1.0,
        sgAroundTheGreen: -0.3,
        sgPutting: -0.2,
      }),
      mkRound({
        id: "r2",
        date: new Date("2026-03-25"),
        totalScore: 75,
        courseRating: 71,
        slopeRating: 125,
      }),
    ]);
    expect(profile.sampleSize).toBe(2);
    expect(profile.shotLevelCoverage).toBe(0.5);
    expect(profile.minConfidence).toBe("medium");
  });

  it("respekterer maxRounds-parameter", () => {
    const rounds = Array.from({ length: 30 }, (_, i) =>
      mkRound({
        id: `r${i}`,
        date: new Date(2026, 3, 30 - i),
        sgTotal: -2.0,
        sgOffTheTee: 0,
        sgApproach: 0,
        sgAroundTheGreen: 0,
        sgPutting: 0,
      }),
    );
    const profile = computePlayerSgProfile(rounds, { maxRounds: 10 });
    expect(profile.sampleSize).toBe(10);
  });

  it("nyere runder vektes høyere enn eldre", () => {
    // To runder: ny = -1.0 (bra), gammel = -4.0 (dårlig)
    const profile = computePlayerSgProfile([
      mkRound({
        id: "ny",
        date: new Date("2026-04-10"),
        sgTotal: -1.0,
        sgOffTheTee: 0,
        sgApproach: 0,
        sgAroundTheGreen: 0,
        sgPutting: 0,
      }),
      mkRound({
        id: "gammel",
        date: new Date("2025-10-01"),
        sgTotal: -4.0,
        sgOffTheTee: 0,
        sgApproach: 0,
        sgAroundTheGreen: 0,
        sgPutting: 0,
      }),
    ]);
    // Snitt skal ligge nærmere -1.0 enn -4.0 pga recency-vekting
    // Med n=2 og decay=0.95 er vekter [1, 0.95], så snitt = (-1*1 + -4*0.95) / 1.95 = -2.461
    expect(profile.meanSgTotal).toBeCloseTo(-2.461, 2);
    expect(profile.meanSgTotal).toBeGreaterThan(-2.5);
  });
});

// ── predictScoreFromSg ─────────────────────────────────────────────

describe("predictScoreFromSg", () => {
  it("elite (SG ≈ +3.5) gir ca Course Rating på nøytral bane", () => {
    // SG +3.5 → HCP ~0 → score ≈ CR
    const score = predictScoreFromSg(3.5, 72, 113);
    expect(score).toBeGreaterThanOrEqual(71);
    expect(score).toBeLessThanOrEqual(73);
  });

  it("HCP 5-ish spiller (SG +0.8, kategori B) ≈ CR + 4 på slope 113", () => {
    // sgToHandicap(+0.8) ≈ 4 → score ≈ 72 + 4*113/113 = 76
    const score = predictScoreFromSg(0.8, 72, 113);
    expect(score).toBeGreaterThan(74);
    expect(score).toBeLessThan(78);
  });

  it("Emil-scenariet: SG +0.8 på CR 71, slope 125 → score ≈ 75", () => {
    // sgToHandicap(+0.8) ≈ 4 → score ≈ 71 + 4 * 125/113 = 75.4
    const score = predictScoreFromSg(0.8, 71, 125);
    expect(score).toBeGreaterThan(74);
    expect(score).toBeLessThan(77);
  });

  it("dårligere SG gir høyere score (monotoni)", () => {
    const betterPlayer = predictScoreFromSg(0.8, 71, 125);
    const worsePlayer = predictScoreFromSg(-2.0, 71, 125);
    expect(worsePlayer).toBeGreaterThan(betterPlayer);
  });

  it("vanskeligere bane (høyere slope) gir høyere score for samme SG", () => {
    const easyScore = predictScoreFromSg(-2, 70, 113);
    const hardScore = predictScoreFromSg(-2, 70, 150);
    expect(hardScore).toBeGreaterThan(easyScore);
  });
});
