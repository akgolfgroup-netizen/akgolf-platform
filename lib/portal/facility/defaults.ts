import { prisma } from "@/lib/portal/prisma";
import type { Facility } from "@prisma/client";

/**
 * Henter standard fasilitet for en instruktør basert på tjenestetype
 * @param instructorId - ID for instruktøren
 * @param serviceTypeId - ID for tjenestetypen (valgfritt)
 * @returns Fasilitet eller null hvis ingen default er satt
 */
export async function getDefaultFacility(
  instructorId: string,
  serviceTypeId?: string
): Promise<Facility | null> {
  // Hent alle defaults for instruktøren, sortert etter prioritet
  const defaults = await prisma.instructorFacilityDefault.findMany({
    where: {
      instructorId,
      OR: serviceTypeId
        ? [{ serviceTypeId }, { serviceTypeId: null }]
        : [{ serviceTypeId: null }],
    },
    include: {
      Facility: true,
    },
    orderBy: [
      // Prioriter spesifikk serviceType over null
      { serviceTypeId: "desc" },
      // Deretter etter prioritet
      { priority: "desc" },
    ],
  });

  // Returner første match
  if (defaults.length > 0) {
    // Hvis vi har en serviceTypeId, prioriter den som matcher
    const specificMatch = defaults.find((d) => d.serviceTypeId === serviceTypeId);
    if (specificMatch) {
      return specificMatch.Facility;
    }
    // Ellers returner høyeste prioritet
    return defaults[0].Facility;
  }

  return null;
}

/**
 * Henter alle fasiliteter for en lokasjon
 */
export async function getFacilitiesByLocation(locationId: string): Promise<Facility[]> {
  return prisma.facility.findMany({
    where: {
      locationId,
      isActive: true,
    },
    orderBy: { sortOrder: "asc" },
  });
}

/**
 * Henter alle aktive fasiliteter
 */
export async function getAllFacilities(): Promise<Facility[]> {
  return prisma.facility.findMany({
    where: { isActive: true },
    include: {
      Location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: [{ Location: { name: "asc" } }, { sortOrder: "asc" }],
  });
}

/**
 * Henter fasilitet basert på slug
 */
export async function getFacilityBySlug(slug: string): Promise<Facility | null> {
  return prisma.facility.findUnique({
    where: { slug },
    include: {
      Location: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}
