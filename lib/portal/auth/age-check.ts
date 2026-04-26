/**
 * Aldersjekk for foreldre-portal-tilgang.
 *
 * Standardvalg #7: Junior < 18 år (myndighetsalder NO).
 * Foreldre-konto kan kun knyttes til elever under denne alderen.
 *
 * NB: User-modellen mangler `birthDate` per i dag.
 * Denne funksjonen tar derfor inn dato eksplisitt — wires opp via
 * UserGolfId eller egen utvidelse i Prisma senere.
 */

export const JUNIOR_AGE_LIMIT = 18;

export function calculateAge(birthDate: Date, refDate: Date = new Date()): number {
  const years = refDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = refDate.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && refDate.getDate() < birthDate.getDate())) {
    return years - 1;
  }
  return years;
}

export function isJunior(birthDate: Date): boolean {
  return calculateAge(birthDate) < JUNIOR_AGE_LIMIT;
}
