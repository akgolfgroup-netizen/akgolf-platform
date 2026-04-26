/**
 * Sponsor-data + månedlig rapport-data.
 *
 * Standardvalg #5: Felter pr sponsor-rapport: økter, elever, NPS, 3 høydepunkter.
 *
 * NB: Sponsor-modell kreves Prisma-migrering. Funksjonene her er stubs
 * som returnerer tom data til migreringen er kjørt.
 */

import { prisma } from "@/lib/portal/prisma";

export interface SponsorMonthlyData {
  sponsorId: string;
  sponsorName: string;
  monthStart: Date;
  monthEnd: Date;
  totalSessions: number;
  totalPlayers: number;
  averageNps: number | null;
  highlights: string[];
}

export interface SponsorOverview {
  id: string;
  name: string;
  playerCount: number;
  monthlyContributionKr: number;
  startedAt: Date;
}

/**
 * Hent oversikt over alle aktive sponsorer.
 *
 * TODO Sprint 5.2: bytt stub til ekte Sponsor-modell.
 */
export async function getActiveSponsors(): Promise<SponsorOverview[]> {
  // Stub: returnerer tom liste til Sponsor-modellen er på plass.
  void prisma;
  return [];
}

/**
 * Hent månedsdata for en sponsor.
 *
 * TODO Sprint 5.2: erstatt stub.
 */
export async function getSponsorMonthlyData(
  sponsorId: string,
  monthDate: Date = new Date(),
): Promise<SponsorMonthlyData | null> {
  // Stub
  void sponsorId;
  void monthDate;
  return null;
}
