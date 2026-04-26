/**
 * DECADE-strategi for turneringsforberedelse.
 *
 * Bygger på decade-caddy.ts (eksisterende per-shot-anbefaling).
 * Denne modulen genererer hull-spesifikk strategi for et helt turneringsformat.
 *
 * Brukes av:
 *  - generateTournamentPrep() server action (Sprint 5.3)
 *  - Turnerings-wizard UI (utsettes — ingen ny visuell design nå)
 */

import { prisma } from "@/lib/portal/prisma";

export interface HoleStrategy {
  holeNumber: number;
  par: number;
  distance: number; // yards
  recommendedClub: string;
  primaryTarget: string;
  fairwayWidthRecommendation: string; // bredde i yards
  bogeyWatchout: string;
  mentalNote: string;
}

export interface TournamentStrategy {
  userId: string;
  courseId: string;
  courseName: string;
  totalHoles: number;
  par: number;
  holes: HoleStrategy[];
  overallNote: string;
}

/**
 * Generer DECADE-strategi for hele banen for en gitt spiller.
 *
 * Bruker spillerens HCP og dispersion-data for å foreslå:
 *  - Klubb-valg på tee
 *  - Aim-linje (basert på dispersion + fairway-bredde)
 *  - Bogey-risiko-områder
 *  - Mental note (pre-shot rutine)
 */
export async function generateTournamentStrategy(
  userId: string,
  courseId: string,
): Promise<TournamentStrategy | null> {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { Hole: { orderBy: { holeNumber: "asc" } } },
  });

  if (!course) return null;

  // Hent spillerens dispersion (for klubb-valg)
  const dispersion = await prisma.clubDispersionData.findMany({
    where: { userId },
  });

  // Per-hull strategi
  const holes: HoleStrategy[] = course.Hole.map((hole) => {
    // Hole har lengthMeter — konverter til yards (1m ≈ 1.094y)
    const distance = Math.round(hole.lengthMeter * 1.094);
    const recommendedClub = recommendClubForDistance(distance, dispersion);

    return {
      holeNumber: hole.holeNumber,
      par: hole.par,
      distance,
      recommendedClub,
      primaryTarget: distance > 400 ? "Bredeste del av fairway" : "Sentrum av green",
      fairwayWidthRecommendation: dispersion.length > 0 ? "Sikt 10y inn fra venstre kant" : "Sikt midten",
      bogeyWatchout:
        hole.par === 3
          ? "Pin tucked til høyre — sikt midten"
          : hole.par === 5
          ? "Layup hvis water in play på 3. slag"
          : "Vurder strategy-shot ved tett pin",
      mentalNote:
        hole.holeNumber === 1
          ? "Ta tid på første slag — pre-shot rutine helt nede"
          : hole.holeNumber === 18
          ? "Spill smart hvis du leder — bogey er greit"
          : "Hold rytme + pust",
    };
  });

  return {
    userId,
    courseId,
    courseName: course.name,
    totalHoles: course.Hole.length,
    par: course.Hole.reduce((sum, h) => sum + h.par, 0),
    holes,
    overallNote: dispersion.length > 0
      ? `Strategi tilpasset din dispersion-data. Spill konservativt på par 4-er over 420y.`
      : `Mangler dispersion-data — bruk konservativ standard-strategi. Logg drives på neste range-økt.`,
  };
}

/**
 * Enkel klubb-anbefaler basert på distanse og dispersion-data.
 * TODO Sprint 6: erstatt med ekte AK-formel (lib/portal/golf/ak-formula.ts).
 */
function recommendClubForDistance(
  distance: number,
  dispersion: Array<{ club: string; carryDistance: number }>,
): string {
  if (dispersion.length === 0) {
    // Fallback: standard tabell
    if (distance < 100) return "Wedge";
    if (distance < 150) return "9-jern";
    if (distance < 175) return "7-jern";
    if (distance < 200) return "5-jern";
    if (distance < 240) return "3-jern / hybrid";
    return "Driver";
  }

  // Finn nærmeste klubb basert på carry
  let best: { club: string; diff: number } = { club: "Driver", diff: Infinity };
  for (const d of dispersion) {
    const diff = Math.abs(distance - d.carryDistance);
    if (diff < best.diff) {
      best = { club: d.club, diff };
    }
  }
  return best.club;
}
