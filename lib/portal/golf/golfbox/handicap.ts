/**
 * GolfBox Integration — Handicap sync og runde-innsending
 *
 * GolfBox er det offisielle handicap- og turneringssystemet for NGF.
 * Alle norske golfere bruker GolfBox for handicap-beregning.
 *
 * Merk: GolfBox har ikke et offentlig API. Denne modulen forbereder
 * integrasjon via screen scraping eller fremtidig API-tilgang.
 * For naa brukes manuell sync med handicap-import.
 */

export interface GolfBoxProfile {
  memberId: string;
  name: string;
  clubName: string;
  handicapIndex: number;
  handicapUpdatedAt: Date;
}

export interface GolfBoxRoundSubmission {
  playerId: string;
  courseId: string;       // GolfBox bane-ID
  teeColor: string;
  date: Date;
  scores: number[];      // 18 hull-scores
  attestedBy?: string;    // Medspiller som bekrefter
}

/**
 * Beregn handicap-differensial fra en runde
 * Formel: (Score - Course Rating) × (113 / Slope Rating)
 */
export function calculateHandicapDifferential(
  adjustedGrossScore: number,
  courseRating: number,
  slopeRating: number
): number {
  const differential = ((adjustedGrossScore - courseRating) * 113) / slopeRating;
  return Math.round(differential * 10) / 10;
}

/**
 * Beregn handicap-indeks fra de 8 beste av 20 siste differensialer
 * WHS (World Handicap System) formel
 */
export function calculateHandicapIndex(differentials: number[]): number {
  if (differentials.length < 3) return 54.0; // Maks handicap

  const sorted = [...differentials].sort((a, b) => a - b);

  // Antall differensialer som brukes basert pa antall runder
  const countMap: Record<number, number> = {
    3: 1, 4: 1, 5: 1, 6: 2, 7: 2, 8: 2, 9: 3, 10: 3,
    11: 3, 12: 4, 13: 4, 14: 4, 15: 5, 16: 5, 17: 6,
    18: 6, 19: 7, 20: 8,
  };

  const count = countMap[Math.min(differentials.length, 20)] ?? 8;
  const bestDiffs = sorted.slice(0, count);
  const average = bestDiffs.reduce((sum, d) => sum + d, 0) / bestDiffs.length;

  // Avrund ned til naermeste 0.1
  return Math.floor(average * 10) / 10;
}

/**
 * Beregn Playing Handicap for en spesifikk bane
 * Playing Handicap = Handicap Index × (Slope Rating / 113) + (Course Rating - Par)
 */
export function calculatePlayingHandicap(
  handicapIndex: number,
  slopeRating: number,
  courseRating: number,
  par: number
): number {
  const playingHcp = handicapIndex * (slopeRating / 113) + (courseRating - par);
  return Math.round(playingHcp);
}

/**
 * Beregn Adjusted Gross Score (maks double bogey per hull)
 * Brukes i WHS for handicap-beregning
 */
export function calculateAdjustedGrossScore(
  holeScores: Array<{ score: number; par: number }>,
  playingHandicap: number
): number {
  // Fordel ekstraslag per hull basert pa hull-handicap
  let totalAdjusted = 0;

  for (const hole of holeScores) {
    // Maks score = nett double bogey = par + 2 + ekstraslag
    // Forenklet: maks = par + 2 for spillere med HCP < 18
    const maxScore = hole.par + 2 + (playingHandicap > 18 ? 1 : 0);
    totalAdjusted += Math.min(hole.score, maxScore);
  }

  return totalAdjusted;
}

/**
 * Generer QR-kode data for attestering av runde
 * Medspiller skanner QR for a bekrefte scoren
 */
export function generateAttestationData(
  roundId: string,
  playerId: string,
  totalScore: number
): string {
  return JSON.stringify({
    type: "akgolf-attestation",
    roundId,
    playerId,
    totalScore,
    timestamp: new Date().toISOString(),
  });
}
