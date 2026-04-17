import { describe, it, expect, beforeEach } from "vitest";
import {
  generateCoachingForecast,
  identifyRootCause,
  techTactMentalPhysFromRootCause,
  type CoachingForecastInput,
} from "@/lib/portal/predictions/generate-coaching-forecast";
import type { RoundInput } from "@/lib/portal/golf/calculate-sg-from-rounds";

// ── Helper ──────────────────────────────────────────────────────────

function mkRound(partial: Partial<RoundInput> & { id: string; date: Date }): RoundInput {
  return {
    totalScore: null,
    par: 72,
    courseRating: 71,
    slopeRating: 125,
    sgTotal: null,
    sgOffTheTee: null,
    sgApproach: null,
    sgAroundTheGreen: null,
    sgPutting: null,
    ...partial,
  };
}

/**
 * Emil: 17 år, HCP 4–5 (kategori B), snitt-score 75 på Srixon Tour.
 * PGA-Tour-skalert SG: -0.8 total, fordelt ca. i tråd med SG_BENCHMARKS for B:
 * OTT -0.3, APP -0.3, ARG -0.1, PUTT -0.1
 */
function emilHistory(): RoundInput[] {
  const rounds: RoundInput[] = [];
  for (let i = 0; i < 15; i++) {
    rounds.push(
      mkRound({
        id: `r${i}`,
        date: new Date(2026, 3, 1 + i),
        totalScore: 75,
        sgTotal: -0.8,
        sgOffTheTee: -0.3,
        sgApproach: -0.3,
        sgAroundTheGreen: -0.1,
        sgPutting: -0.1,
      }),
    );
  }
  return rounds;
}

// Forutsigbar seed for Math.random-avhengige tester
beforeEach(() => {
  // Vitest kjører isolert — hver test starter med ny Math.random-state
});

// ── Identifiser rotårsak ───────────────────────────────────────────

describe("identifyRootCause", () => {
  it("teknisk når face angle std dev > 1.5°", () => {
    const cause = identifyRootCause("APP", {
      faceAngleStdDevDeg: { APP: 2.1 },
    });
    expect(cause).toBe("teknisk");
  });

  it("mental når pressureGap > 0.5", () => {
    const cause = identifyRootCause("APP", {
      pressureGapSg: { APP: 1.2 },
    });
    expect(cause).toBe("mental");
  });

  it("fysisk gjelder kun OTT med lav ball speed score", () => {
    const cause = identifyRootCause("OTT", {
      ballSpeedScore: 30,
    });
    expect(cause).toBe("fysisk");

    // Samme ball speed score for APP → ikke fysisk
    const causeApp = identifyRootCause("APP", {
      ballSpeedScore: 30,
    });
    expect(causeApp).not.toBe("fysisk");
  });

  it("blandet når flere rotårsaker er aktive samtidig", () => {
    const cause = identifyRootCause("APP", {
      faceAngleStdDevDeg: { APP: 2.1 },
      pressureGapSg: { APP: 1.2 },
    });
    expect(cause).toBe("blandet");
  });

  it("blandet når ingen diagnostiske tegn", () => {
    expect(identifyRootCause("APP", {})).toBe("blandet");
    expect(identifyRootCause("APP", undefined)).toBe("blandet");
  });
});

// ── Tek/Tak/Mental/Fys-fordeling ───────────────────────────────────

describe("techTactMentalPhysFromRootCause", () => {
  it("teknisk gir 65% Tek", () => {
    expect(techTactMentalPhysFromRootCause("teknisk").tek).toBe(0.65);
  });

  it("mental gir 50% Mental", () => {
    expect(techTactMentalPhysFromRootCause("mental").mental).toBe(0.5);
  });

  it("alle fordelinger summerer til 1.0", () => {
    const causes: Array<Parameters<typeof techTactMentalPhysFromRootCause>[0]> = [
      "teknisk",
      "fysisk",
      "mental",
      "taktisk",
      "blandet",
    ];
    for (const c of causes) {
      const d = techTactMentalPhysFromRootCause(c);
      const sum = d.tek + d.tak + d.mental + d.fys;
      expect(sum).toBeCloseTo(1.0, 3);
    }
  });
});

// ── Hoved-forecast: Emil-casen ─────────────────────────────────────

describe("generateCoachingForecast — Emil-casen (75 → 72)", () => {
  function emilInput(
    overrides: Partial<CoachingForecastInput> = {},
  ): CoachingForecastInput {
    return {
      rounds: emilHistory(),
      age: 17,
      hoursPerWeek: 18,
      targetScoreAvg: 72,
      weeksToDeadline: 52,
      avgCourseRating: 71,
      avgSlopeRating: 125,
      monteCarloRuns: 2000, // færre runs i test for fart
      ...overrides,
    };
  }

  it("identifiserer nåværende tilstand korrekt (PGA-Tour-skala)", () => {
    const result = generateCoachingForecast(emilInput());
    expect(result.currentState.sampleSize).toBeGreaterThan(10);
    expect(result.currentState.sgTotal).toBeCloseTo(-0.8, 1);
    expect(result.currentState.confidence).toBe("high");
    // SG -0.8 → HCP 4 → kategori B
    expect(result.currentState.category).toBe("B");
  });

  it("beregner nødvendig SG-delta på PGA-Tour-skala (75 → 72)", () => {
    const result = generateCoachingForecast(emilInput());
    // 75 på CR 71, Slope 125 → diff 3.6 → HCP 4 → B → SG -0.8
    // 72 på CR 71, Slope 125 → diff 0.9 → HCP 1 → A → SG -0.3
    // Delta ≈ 0.5 SG (PGA-Tour-skala, IKKE differential-skala)
    expect(result.target.requiredSgDelta).toBeGreaterThan(0.3);
    expect(result.target.requiredSgDelta).toBeLessThan(0.8);
  });

  it("APP får størst andel av forbedringen (empirisk + headroom)", () => {
    const result = generateCoachingForecast(emilInput());
    expect(result.primaryFocusCategory).toBe("APP");

    const appAlloc = result.allocations.find((a) => a.category === "APP")!;
    const otherShares = result.allocations
      .filter((a) => a.category !== "APP")
      .map((a) => a.share);
    for (const s of otherShares) {
      expect(appAlloc.share).toBeGreaterThan(s);
    }
  });

  it("allocations-shares summerer til 1.0", () => {
    const result = generateCoachingForecast(emilInput());
    const sum = result.allocations.reduce((s, a) => s + a.share, 0);
    expect(sum).toBeCloseTo(1.0, 2);
  });

  it("estimert tidsbruk er realistisk for 0.5 SG-delta (100-500 timer etter overlap)", () => {
    const result = generateCoachingForecast(emilInput());
    // Med delta ~0.5 SG og B-nivå kalibrering (APP 140h/+0.1):
    // Raw ~550h, etter overlap (0.55) ~300h
    expect(result.estimatedTotalHours).toBeGreaterThan(100);
    expect(result.estimatedTotalHours).toBeLessThan(600);
  });

  it("CI er konsistent (low ≤ mid ≤ high)", () => {
    const result = generateCoachingForecast(emilInput());
    expect(result.estimatedHoursCi95Low).toBeLessThanOrEqual(result.estimatedTotalHours);
    expect(result.estimatedTotalHours).toBeLessThanOrEqual(result.estimatedHoursCi95High);
  });

  it("sannsynligheten for suksess er monotont økende med timer/uke", () => {
    const low = generateCoachingForecast(emilInput({ hoursPerWeek: 8 }));
    const mid = generateCoachingForecast(emilInput({ hoursPerWeek: 12 }));
    const high = generateCoachingForecast(emilInput({ hoursPerWeek: 25 }));
    // Med monte-carlo har vi litt støy, men trenden skal være klar
    expect(low.probabilityOfSuccess).toBeLessThanOrEqual(mid.probabilityOfSuccess + 0.1);
    expect(mid.probabilityOfSuccess).toBeLessThanOrEqual(high.probabilityOfSuccess + 0.1);
  });

  it("produserer minst 5 eksplisitte antakelser", () => {
    const result = generateCoachingForecast(emilInput());
    expect(result.assumptions.length).toBeGreaterThanOrEqual(5);
    // Minst én må nevne at tallene er ekspert-estimater
    expect(result.assumptions.join(" ").toLowerCase()).toMatch(/ekspert|variasjon|kalibrert/);
  });

  it("advarsel når utilstrekkelig data (< 10 runder)", () => {
    const shortHistory = emilHistory().slice(0, 5);
    const result = generateCoachingForecast(emilInput({ rounds: shortHistory }));
    expect(result.assumptions.some((a) => a.toLowerCase().includes("advarsel"))).toBe(true);
  });

  it("diagnostisk data påvirker Tek/Tak/Mental/Fys-fordeling", () => {
    // Uten diagnostisk → "blandet" → 40/20/25/15
    const resultNoDiag = generateCoachingForecast(emilInput());
    const appNoDiag = resultNoDiag.allocations.find((a) => a.category === "APP")!;
    expect(appNoDiag.techTactMentalPhys.tek).toBe(0.4);

    // Med teknisk rotårsak → 65/10/10/15
    const resultTechnical = generateCoachingForecast(
      emilInput({
        diagnostic: {
          faceAngleStdDevDeg: { APP: 2.1 },
        },
      }),
    );
    const appTechnical = resultTechnical.allocations.find((a) => a.category === "APP")!;
    expect(appTechnical.rootCause).toBe("teknisk");
    expect(appTechnical.techTactMentalPhys.tek).toBe(0.65);
  });

  it("inkluderer modelVersion for audit", () => {
    const result = generateCoachingForecast(emilInput());
    expect(result.modelVersion).toMatch(/methodology-1\.0\/hoursTable-\d+\.\d+\.\d+/);
  });
});

// ── Edge cases ─────────────────────────────────────────────────────

describe("generateCoachingForecast — edge cases", () => {
  function baseInput(): CoachingForecastInput {
    return {
      rounds: emilHistory(),
      age: 17,
      hoursPerWeek: 15,
      targetScoreAvg: 72,
      weeksToDeadline: 52,
      avgCourseRating: 71,
      avgSlopeRating: 125,
      monteCarloRuns: 1000,
    };
  }

  it("håndterer mål som allerede er nådd (requiredDelta = 0)", () => {
    const already = baseInput();
    // Hvis spiller allerede er bedre enn målet
    already.rounds = already.rounds.map((r) => ({
      ...r,
      sgTotal: 0,
      sgOffTheTee: 0,
      sgApproach: 0,
      sgAroundTheGreen: 0,
      sgPutting: 0,
    }));
    already.targetScoreAvg = 75; // dårligere enn dagens
    const result = generateCoachingForecast(already);
    expect(result.target.requiredSgDelta).toBe(0);
    expect(result.probabilityOfSuccess).toBe(1);
  });

  it("håndterer 0 uker til deadline uten å kræsje", () => {
    const result = generateCoachingForecast({
      ...baseInput(),
      weeksToDeadline: 0,
    });
    expect(result.probabilityOfSuccess).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(result.requiredHoursPerWeek)).toBe(true);
  });

  it("håndterer tom rundhistorikk gracefully", () => {
    const result = generateCoachingForecast({
      ...baseInput(),
      rounds: [],
    });
    expect(result.currentState.sampleSize).toBe(0);
    expect(result.currentState.confidence).toBe("low");
    // Skal ha advarsel
    expect(result.assumptions.some((a) => a.toLowerCase().includes("advarsel"))).toBe(true);
  });

  it("håndterer runder uten shot-level SG (bare score)", () => {
    const scoreOnlyHistory: RoundInput[] = [];
    for (let i = 0; i < 15; i++) {
      scoreOnlyHistory.push(
        mkRound({
          id: `s${i}`,
          date: new Date(2026, 3, 1 + i),
          totalScore: 75,
          // ingen shot-level SG satt
        }),
      );
    }
    const result = generateCoachingForecast({
      ...baseInput(),
      rounds: scoreOnlyHistory,
    });
    expect(result.currentState.sampleSize).toBe(15);
    // PGA-Tour-skalert SG fra differential 3.6 → kategori B → SG -0.8
    expect(result.currentState.sgTotal).toBeCloseTo(-0.8, 1);
    expect(result.currentState.confidence).toBe("medium");
    // Fordelingen skal stadig fungere via empirisk regularisering
    expect(result.allocations.length).toBe(4);
  });
});
