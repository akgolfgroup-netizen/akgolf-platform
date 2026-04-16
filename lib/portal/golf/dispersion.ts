/**
 * Dispersion Analysis — Spredningsberegning for DECADE caddy
 *
 * Beregner spredningsprofil per klubb fra historisk data (TrackMan eller runder).
 * Brukes av DECADE Caddy for klubbvalg og strategi.
 */

export interface ClubDispersion {
  club: string;
  avgCarry: number;         // meter
  avgTotal: number;         // meter
  carryStdDev: number;      // meter
  lateralStdDev: number;    // meter
  shotCount: number;
  /** 68% av slag lander innenfor denne ellipsen */
  dispersion68: { carry: number; lateral: number };
  /** 95% av slag lander innenfor denne ellipsen */
  dispersion95: { carry: number; lateral: number };
}

/**
 * Beregn spredningsellipse fra standardavvik
 * 68% = 1 stddev, 95% = 2 stddev
 */
export function calculateDispersionEllipse(
  avgCarry: number,
  carryStdDev: number,
  lateralStdDev: number,
  shotCount: number
): ClubDispersion["dispersion68"] & { dispersion95: { carry: number; lateral: number } } {
  void shotCount;
  return {
    carry: Math.round(carryStdDev * 10) / 10,
    lateral: Math.round(lateralStdDev * 10) / 10,
    dispersion95: {
      carry: Math.round(carryStdDev * 2 * 10) / 10,
      lateral: Math.round(lateralStdDev * 2 * 10) / 10,
    },
  };
}

/**
 * Sjekk om en spredningsellipse treffer et maal (fairway eller green)
 * @param targetWidth — bredde pa maalet (meter)
 * @param targetDepth — dybde pa maalet (meter)
 * @param lateralOffset — lateral avstand fra midt av maal (meter)
 * @param carryOffset — carry avstand fra midt av maal (meter)
 * @param dispersion — spredningsellipse (95%)
 */
export function dispersionHitsTarget(
  targetWidth: number,
  targetDepth: number,
  lateralOffset: number,
  carryOffset: number,
  dispersion95: { carry: number; lateral: number }
): { hitProbability: number; overlapPct: number } {
  // Forenklet: sjekk om 95%-ellipsen overlapper med maalrektangelet
  const halfWidth = targetWidth / 2;
  const halfDepth = targetDepth / 2;

  // Gaussisk tilnaerming av treff-sannsynlighet

  // Phi(z) tilnaerming
  const phi = (z: number) => 1 / (1 + Math.exp(-1.7 * z));

  const lateralHit = phi(halfWidth / (dispersion95.lateral / 2 || 1)) -
    phi(-halfWidth / (dispersion95.lateral / 2 || 1));
  const carryHit = phi(halfDepth / (dispersion95.carry / 2 || 1)) -
    phi(-halfDepth / (dispersion95.carry / 2 || 1));

  const hitProbability = Math.round(lateralHit * carryHit * 100);
  const overlapPct = Math.max(0, Math.min(100, hitProbability));

  return { hitProbability: overlapPct, overlapPct };
}

/**
 * Beregn anbefalt klubb basert pa avstand og spredning
 * Velger klubben der avg carry er naermest malet og 95%-ellipsen unngaar hazards
 */
export function recommendClub(
  distanceToPin: number,
  dispersions: ClubDispersion[],
  constraints?: {
    maxLateral?: number;   // Maks lateral spredning tillatt (meter)
    preferShort?: boolean; // Foretrekk kort fremfor lang (front of green)
  }
): {
  recommended: string;
  alternatives: string[];
  reasoning: string;
} | null {
  if (dispersions.length === 0) return null;

  const sorted = dispersions
    .filter((d) => d.shotCount >= 3)
    .map((d) => ({
      ...d,
      carryDiff: Math.abs(d.avgCarry - distanceToPin),
      isShort: d.avgCarry < distanceToPin,
    }))
    .sort((a, b) => a.carryDiff - b.carryDiff);

  if (sorted.length === 0) return null;

  // Filtrer ut klubber med for stor lateral spredning
  const maxLateral = constraints?.maxLateral ?? 999;
  const viable = sorted.filter((d) => d.dispersion95.lateral <= maxLateral);

  if (viable.length === 0) {
    return {
      recommended: sorted[0].club,
      alternatives: sorted.slice(1, 3).map((d) => d.club),
      reasoning: `Ingen klubber har smal nok spredning for dette malet. Beste alternativ: ${sorted[0].club} (${sorted[0].avgCarry}m carry, ${sorted[0].dispersion95.lateral}m lateral spredning).`,
    };
  }

  const best = constraints?.preferShort
    ? viable.find((d) => d.isShort) ?? viable[0]
    : viable[0];

  const diff = Math.round(best.avgCarry - distanceToPin);
  const direction = diff > 0 ? "lang" : diff < 0 ? "kort" : "perfekt";

  return {
    recommended: best.club,
    alternatives: viable
      .filter((d) => d.club !== best.club)
      .slice(0, 2)
      .map((d) => d.club),
    reasoning: `${best.club} (${best.avgCarry}m avg carry, ${direction} ${Math.abs(diff)}m). Spredning: ${best.dispersion68.lateral}m lateral (68%), ${best.dispersion95.lateral}m (95%).`,
  };
}
