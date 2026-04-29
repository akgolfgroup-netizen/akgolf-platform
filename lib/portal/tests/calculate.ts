/**
 * Beregner aggregert `value` per test fra raw input-array.
 *
 * Kilde: prisma/seed-tests.ts — formula-feltet definerer matematikken.
 *
 * Brukes av:
 *   - submitTestResult() i submit-result.ts
 *   - Validation/preview i utfor-client
 */

/**
 * Standardavvik (population, ikke sample).
 */
function stdDev(values: number[]): number {
  if (values.length === 0) return 0;
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  const variance =
    values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function sum(values: number[]): number {
  return values.reduce((acc, v) => acc + v, 0);
}

function maxOf(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.max(...values);
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Hovedberegning. Returnerer `value` som lagres i TestResult.value.
 *
 * @param testNumber 1-20
 * @param rawInput Array med tall (input-felter)
 */
export function calculateValue(testNumber: number, rawInput: number[]): number {
  switch (testNumber) {
    // ── TRACKMAN ─────────────────────────────────────────────
    case 1: // Driver ballhastighet — max
      return roundTo(maxOf(rawInput), 1);
    case 2: // Driver carry — avg
      return roundTo(avg(rawInput), 1);
    case 3: // Driver spredning — stddev
      return roundTo(stdDev(rawInput), 1);
    case 4: // 7-jern carry — avg
      return roundTo(avg(rawInput), 1);
    case 5: // 7-jern spredning — stddev
      return roundTo(stdDev(rawInput), 1);
    case 6: { // Wedge avstandskontroll — % innenfor 3m fra 50m mal
      const target = 50;
      const tolerance = 3;
      const within = rawInput.filter((v) => Math.abs(v - target) <= tolerance).length;
      return rawInput.length > 0
        ? roundTo((within / rawInput.length) * 100, 1)
        : 0;
    }
    case 7: // Smash factor — avg ratio (input er pre-beregnet ratio)
      return roundTo(avg(rawInput), 2);

    // ── SHORT GAME ───────────────────────────────────────────
    case 8: // Up-and-down 10-punkt — sum av 0-2 score per slag
      return roundTo(sum(rawInput), 0);
    case 9: // Bunkertest 5-punkt — avg avstand til hull
      return roundTo(avg(rawInput), 1);
    case 10: // Pitch presisjon — avg avstand til hull
      return roundTo(avg(rawInput), 1);
    case 11: // Flop/lob kontroll — antall innenfor sone (1 eller 0 per slag)
      return roundTo(sum(rawInput), 0);

    // ── PUTTING ──────────────────────────────────────────────
    case 12:
    case 13:
    case 14: { // Putting 1m / 3m / 6m — % innhull (1 = innhull, 0 = miss)
      const made = rawInput.filter((v) => v >= 1).length;
      return rawInput.length > 0
        ? roundTo((made / rawInput.length) * 100, 1)
        : 0;
    }
    case 15: // Fartskontroll 10m — avg avstand forbi hull i cm
      return roundTo(avg(rawInput.map((v) => Math.abs(v))), 0);
    case 16: // Gronlesing — antall riktige (1 = riktig)
      return roundTo(sum(rawInput), 0);

    // ── PHYSICAL ─────────────────────────────────────────────
    case 17: // Rotasjonsmobilitet — grader (single input)
      return roundTo(rawInput[0] ?? 0, 0);
    case 18: // Balanse — sekunder (single input)
      return roundTo(rawInput[0] ?? 0, 0);
    case 19: // Eksplosivitet — broad jump i meter (3 forsok, beste)
      return roundTo(maxOf(rawInput), 2);

    // ── MENTAL ───────────────────────────────────────────────
    case 20: // Kognitivt under press — poeng (single input)
      return roundTo(rawInput[0] ?? 0, 0);

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — GOLFSLAG-TESTER (21-28)
    // ═════════════════════════════════════════════════════════
    case 21: // Chip 10m — avg proximity
    case 22: // Chip 30m — avg proximity
    case 23: // Wedge 20m — avg proximity
    case 24: // Wedge 40m — avg proximity
    case 25: // Lobb 15m — avg proximity
    case 26: // Lobb 25m — avg proximity
    case 27: // Bunker 10m — avg proximity
    case 28: // Bunker 20m — avg proximity
      return roundTo(avg(rawInput), 1);

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — PEI-TESTER (29-31)
    // ═════════════════════════════════════════════════════════
    case 29: // PEI Slagtest 27
    case 30: // PEI Wedgetest
    case 31: // PEI Test Bane
      return roundTo(avg(rawInput), 3);

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — TEKNIKK-TESTER (32-37)
    // ═════════════════════════════════════════════════════════
    case 32: // Teknikktest Utslag — Carry (median)
    case 34: // Teknikktest Inspill — Carry (median)
      return roundTo(median(rawInput), 1);

    case 33: // Teknikktest Utslag — Spredning (stddev)
    case 35: // Teknikktest Inspill — Spredning (stddev)
      return roundTo(stdDev(rawInput), 1);

    case 36: // Nærspill Gate — count innenfor sone
    case 37: // VISA Express — count innenfor sone
      return roundTo(sum(rawInput), 0);

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — BESLUTNINGSprotokoll (38)
    // ═════════════════════════════════════════════════════════
    case 38: // Beslutningsprotokoll — avg carry-feil
      return roundTo(avg(rawInput.map((v) => Math.abs(v))), 1);

    default:
      return 0;
  }
}

function roundTo(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

/**
 * Beskrivelse av hva hvert input-felt representerer per test.
 * Brukes til a generere riktige labels og hjelpetekster i utfor-form.
 */
export function getInputLabel(testNumber: number, index: number): string {
  switch (testNumber) {
    case 1:
      return `Slag ${index + 1} (mph)`;
    case 2:
    case 4:
      return `Carry ${index + 1} (m)`;
    case 3:
    case 5:
      return `Lateral ${index + 1} (m offline)`;
    case 6:
      return `Avstand ${index + 1} (m fra 50m mal)`;
    case 7:
      return `Smash ${index + 1} (ratio, f.eks. 1.45)`;
    case 8:
      return `Slag ${index + 1} (0-2 poeng)`;
    case 9:
      return `Slag ${index + 1} (m til hull)`;
    case 10:
      return `Slag ${index + 1} (m til hull, 20-50m pitch)`;
    case 11:
      return `Slag ${index + 1} (1 = innenfor sone, 0 = utenfor)`;
    case 12:
      return `Putt ${index + 1} fra 1m (1 = innhull, 0 = miss)`;
    case 13:
      return `Putt ${index + 1} fra 3m (1 = innhull, 0 = miss)`;
    case 14:
      return `Putt ${index + 1} fra 6m (1 = innhull, 0 = miss)`;
    case 15:
      return `Putt ${index + 1} (cm forbi hull, neg. = kort)`;
    case 16:
      return `Putt ${index + 1} (1 = lest riktig, 0 = feil)`;
    case 17:
      return `Maksimal rotasjon (grader)`;
    case 18:
      return `Sekunder pa et bein, lukkede oyne`;
    case 19:
      return `Forsok ${index + 1} (meter)`;
    case 20:
      return `Score (av 100)`;

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — GOLFSLAG-TESTER (21-28)
    // ═════════════════════════════════════════════════════════
    case 21:
      return `Chip ${index + 1} — restavstand (m)`;
    case 22:
      return `Chip ${index + 1} — restavstand (m)`;
    case 23:
      return `Wedge ${index + 1} — restavstand (m)`;
    case 24:
      return `Wedge ${index + 1} — restavstand (m)`;
    case 25:
      return `Lobb ${index + 1} — restavstand (m)`;
    case 26:
      return `Lobb ${index + 1} — restavstand (m)`;
    case 27:
      return `Bunker ${index + 1} — restavstand (m)`;
    case 28:
      return `Bunker ${index + 1} — restavstand (m)`;

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — PEI-TESTER (29-31)
    // ═════════════════════════════════════════════════════════
    case 29:
      return `Slag ${index + 1} — PEI (restavstand / malavstand)`;
    case 30:
      return `Slag ${index + 1} — PEI (restavstand / malavstand)`;
    case 31:
      return `Hull ${index + 1} — PEI (restavstand / malavstand)`;

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — TEKNIKK-TESTER (32-37)
    // ═════════════════════════════════════════════════════════
    case 32:
      return `Slag ${index + 1} — carry (m)`;
    case 33:
      return `Slag ${index + 1} — sideavvik (m)`;
    case 34:
      return `Slag ${index + 1} — carry (m)`;
    case 35:
      return `Slag ${index + 1} — sideavvik (m)`;
    case 36:
      return `Slag ${index + 1} (1 = innenfor sone, 0 = utenfor)`;
    case 37:
      return `Slag ${index + 1} (1 = innenfor sone, 0 = utenfor)`;

    // ═════════════════════════════════════════════════════════
    //  TEAM NORWAY — BESLUTNINGSprotokoll (38)
    // ═════════════════════════════════════════════════════════
    case 38:
      return `Hull ${index + 1} — carry-feil (m, neg = kort, pos = lang)`;

    default:
      return `Verdi ${index + 1}`;
  }
}
