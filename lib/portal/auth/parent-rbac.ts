/**
 * Foreldre-RBAC.
 *
 * Standardvalg #6 (Anders' fullmakt):
 * Foreldre ser HCP-trend, økt-historikk (uten innhold), mål, aktivitet.
 * IKKE: AI-insights, mental, økonomi.
 *
 * Junior-aldersgrense: 18 år (Standardvalg #7).
 *
 * NB: Dette er backend-only foreløpig. Foreldre-rolle og ParentLink-modell
 * krever Prisma-migrering som kjøres separat. Stub-funksjoner her returnerer
 * `false`/`null` til migreringen er på plass.
 */

import { prisma } from "@/lib/portal/prisma";

/**
 * Type med felter foreldre KAN se. Bruk denne i alle parent-server actions.
 */
export interface ChildVisibleData {
  id: string;
  name: string | null;
  hcpTrend: Array<{ date: Date; hcp: number }>;
  bookingHistory: Array<{
    id: string;
    startTime: Date;
    serviceName: string;
    instructorName: string | null;
    status: string;
  }>;
  goals: Array<{ id: string; title: string; targetDate: Date | null }>;
  activityLevel: { sessionsLast30d: number; lastActiveAt: Date | null };
}

/**
 * Felter foreldre IKKE skal se (for kompilator-sjekk).
 * Brukes som negativ liste hvis vi ved en feil prøver å returnere disse.
 */
export const PARENT_FORBIDDEN_FIELDS = [
  "aiSummary",
  "aiKeyPoints",
  "aiFocusAreas",
  "rawTranscript",
  "mentalProfile",
  "MentalProfile",
  "MentalScorecardEntry",
  "PaymentTransaction",
  "stripeCustomerId",
  "ltv",
  "churn",
  "Sponsor",
] as const;

/**
 * Sjekk om en bruker (parentUserId) har tilgang til et barn (childUserId).
 *
 * NB: Krever ParentLink-modell i Prisma (ikke implementert ennå).
 * Returnerer false til migrering er kjørt.
 */
export async function isParentOf(
  parentUserId: string,
  childUserId: string,
): Promise<boolean> {
  // TODO: Når ParentLink er på plass:
  // const link = await prisma.parentLink.findFirst({
  //   where: { parentUserId, childUserId, isActive: true },
  // });
  // return link !== null;
  void parentUserId;
  void childUserId;
  return false;
}

/**
 * Hent barnets synlige data — kun felter foreldre har lov til å se.
 */
export async function getChildVisibleData(
  parentUserId: string,
  childUserId: string,
): Promise<ChildVisibleData | null> {
  if (!(await isParentOf(parentUserId, childUserId))) {
    return null;
  }

  const child = await prisma.user.findUnique({
    where: { id: childUserId },
    select: { id: true, name: true, lastActiveAt: true },
  });

  if (!child) return null;

  // Hent økt-historikk (uten AI-innhold)
  const bookings = await prisma.booking.findMany({
    where: {
      studentId: childUserId,
      status: { in: ["CONFIRMED", "COMPLETED"] },
    },
    orderBy: { startTime: "desc" },
    take: 20,
    include: {
      ServiceType: { select: { name: true } },
      Instructor: { include: { User: { select: { name: true } } } },
    },
  });

  // Aktivitetsnivå
  const last30dCutoff = new Date();
  last30dCutoff.setDate(last30dCutoff.getDate() - 30);
  const sessionsLast30d = bookings.filter(
    (b) => b.status === "COMPLETED" && b.startTime >= last30dCutoff,
  ).length;

  return {
    id: child.id,
    name: child.name,
    hcpTrend: [], // TODO: wire opp HandicapEntry når feltnavn er bekreftet
    bookingHistory: bookings.map((b) => ({
      id: b.id,
      startTime: b.startTime,
      serviceName: b.ServiceType.name,
      instructorName: b.Instructor.User?.name ?? null,
      status: b.status,
    })),
    goals: [], // TODO: wire opp Goal-modell
    activityLevel: {
      sessionsLast30d,
      lastActiveAt: child.lastActiveAt,
    },
  };
}
