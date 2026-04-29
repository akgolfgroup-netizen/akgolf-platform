/**
 * Per-test input-validering.
 *
 * Sjekker at hver verdi er en gyldig number innenfor fornuftige grenser.
 * Brukes bade pa server (submit) og klient (live preview).
 */

export interface InputRange {
  min: number;
  max: number;
  step?: number;
  hint?: string;
}

/**
 * Range per test og input-index. Hvis index ikke er definert, gjelder den
 * felles range for alle felter i testen.
 */
const RANGES: Record<number, InputRange> = {
  1: { min: 80, max: 200, step: 0.1, hint: "Typisk 90-185 mph" },
  2: { min: 50, max: 350, step: 1, hint: "Carry i meter" },
  3: { min: 0, max: 100, step: 0.1, hint: "Avstand fra mal-linje (m)" },
  4: { min: 30, max: 200, step: 1, hint: "Carry i meter" },
  5: { min: 0, max: 80, step: 0.1, hint: "Avstand fra mal-linje (m)" },
  6: { min: 0, max: 80, step: 0.5, hint: "Avstand fra 50m-mal (m)" },
  7: { min: 1.0, max: 1.55, step: 0.01, hint: "Ratio mellom 1.0 og 1.55" },
  8: { min: 0, max: 2, step: 1, hint: "0, 1 eller 2 poeng per slag" },
  9: { min: 0, max: 30, step: 0.1, hint: "Avstand til hull i meter" },
  10: { min: 0, max: 25, step: 0.1, hint: "Avstand til hull i meter" },
  11: { min: 0, max: 1, step: 1, hint: "1 = innenfor, 0 = utenfor" },
  12: { min: 0, max: 1, step: 1, hint: "1 = innhull, 0 = miss" },
  13: { min: 0, max: 1, step: 1, hint: "1 = innhull, 0 = miss" },
  14: { min: 0, max: 1, step: 1, hint: "1 = innhull, 0 = miss" },
  15: { min: -200, max: 500, step: 1, hint: "cm forbi hull (neg = kort)" },
  16: { min: 0, max: 1, step: 1, hint: "1 = lest riktig, 0 = feil" },
  17: { min: 0, max: 120, step: 1, hint: "Grader (typisk 30-90)" },
  18: { min: 0, max: 300, step: 1, hint: "Sekunder" },
  19: { min: 0, max: 4, step: 0.01, hint: "Meter (typisk 1.5-3.0)" },
  20: { min: 0, max: 100, step: 1, hint: "Poeng av 100" },

  // ═══════════════════════════════════════════════════════════
  //  TEAM NORWAY — GOLFSLAG-TESTER (21-28)
  // ═══════════════════════════════════════════════════════════

  21: { min: 0, max: 15, step: 0.1, hint: "Restavstand i meter (Chip 10m)" },
  22: { min: 0, max: 25, step: 0.1, hint: "Restavstand i meter (Chip 30m)" },
  23: { min: 0, max: 20, step: 0.1, hint: "Restavstand i meter (Wedge 20m)" },
  24: { min: 0, max: 30, step: 0.1, hint: "Restavstand i meter (Wedge 40m)" },
  25: { min: 0, max: 18, step: 0.1, hint: "Restavstand i meter (Lobb 15m)" },
  26: { min: 0, max: 25, step: 0.1, hint: "Restavstand i meter (Lobb 25m)" },
  27: { min: 0, max: 20, step: 0.1, hint: "Restavstand i meter (Bunker 10m)" },
  28: { min: 0, max: 30, step: 0.1, hint: "Restavstand i meter (Bunker 20m)" },

  // ═══════════════════════════════════════════════════════════
  //  TEAM NORWAY — PEI-TESTER (29-31)
  // ═══════════════════════════════════════════════════════════

  29: { min: 0, max: 2.0, step: 0.001, hint: "PEI = restavstand / malavstand" },
  30: { min: 0, max: 2.0, step: 0.001, hint: "PEI = restavstand / malavstand" },
  31: { min: 0, max: 2.0, step: 0.001, hint: "PEI = restavstand / malavstand" },

  // ═══════════════════════════════════════════════════════════
  //  TEAM NORWAY — TEKNIKK-TESTER (32-37)
  // ═══════════════════════════════════════════════════════════

  32: { min: 50, max: 350, step: 1, hint: "Carry i meter" },
  33: { min: 0, max: 100, step: 0.1, hint: "Sideavvik i meter" },
  34: { min: 30, max: 200, step: 1, hint: "Carry i meter" },
  35: { min: 0, max: 80, step: 0.1, hint: "Sideavvik i meter" },
  36: { min: 0, max: 1, step: 1, hint: "1 = innenfor sone, 0 = utenfor" },
  37: { min: 0, max: 1, step: 1, hint: "1 = innenfor sone, 0 = utenfor" },

  // ═══════════════════════════════════════════════════════════
  //  TEAM NORWAY — BESLUTNINGSprotokoll (38)
  // ═══════════════════════════════════════════════════════════

  38: { min: -100, max: 100, step: 1, hint: "Carry-feil i meter (neg = kort, pos = lang)" },
};

export function getInputRange(testNumber: number): InputRange {
  return RANGES[testNumber] ?? { min: 0, max: 1000 };
}

export interface ValidationError {
  index: number;
  message: string;
}

/**
 * Validerer hele input-arrayet. Returnerer liste med feil per index.
 */
export function validateInputs(
  testNumber: number,
  inputs: (number | null | undefined)[],
  expectedCount: number,
): ValidationError[] {
  const errors: ValidationError[] = [];
  const range = getInputRange(testNumber);

  if (inputs.length !== expectedCount) {
    errors.push({
      index: -1,
      message: `Forventer ${expectedCount} verdier, fikk ${inputs.length}`,
    });
    return errors;
  }

  inputs.forEach((value, index) => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      errors.push({ index, message: "Mangler verdi" });
      return;
    }
    if (typeof value !== "number" || !Number.isFinite(value)) {
      errors.push({ index, message: "Ikke et gyldig tall" });
      return;
    }
    if (value < range.min || value > range.max) {
      errors.push({
        index,
        message: `Verdi ma vaere mellom ${range.min} og ${range.max}`,
      });
    }
  });

  return errors;
}

/**
 * Sjekker om input-arrayet er klart for submit (alle felter gyldige).
 */
export function isInputComplete(
  testNumber: number,
  inputs: (number | null | undefined)[],
  expectedCount: number,
): boolean {
  return validateInputs(testNumber, inputs, expectedCount).length === 0;
}
