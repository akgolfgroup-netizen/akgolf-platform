"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { logger } from "@/lib/logger";

export interface LocationSummary {
  id: string;
  name: string;
  address: string | null;
}

export interface InstructorSummary {
  id: string;
  name: string;
  userId: string;
}

export interface ServiceTypeSummary {
  id: string;
  name: string;
  category: string;
  isActive: boolean;
  isPublic: boolean;
}

export interface InstructorLocationConfig {
  instructorId: string;
  locationId: string;
  isActive: boolean;
  serviceTypeIds: string[];
}

/**
 * Hovedoppslag for lokasjoner-siden. Returnerer alt admin/coach trenger:
 * - Alle lokasjoner i systemet
 * - Alle tjenester (inkludert inaktive)
 * - Alle instruktører (filtrert per RBAC)
 * - Eksisterende koblinger (Instructor × Location + tjenester)
 */
export async function getLocationsConfigData(): Promise<{
  locations: LocationSummary[];
  services: ServiceTypeSummary[];
  instructors: InstructorSummary[];
  config: InstructorLocationConfig[];
}> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    return { locations: [], services: [], instructors: [], config: [] };
  }

  const [locations, services, instructorRows, instructorLocations, instructorLocationServices] =
    await Promise.all([
      prisma.location.findMany({
        select: { id: true, name: true, address: true },
        orderBy: { name: "asc" },
      }),
      prisma.serviceType.findMany({
        select: {
          id: true,
          name: true,
          category: true,
          isActive: true,
          isPublic: true,
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.instructor.findMany({
        include: { User: { select: { name: true } } },
      }),
      prisma.instructorLocation.findMany({
        select: { instructorId: true, locationId: true, isActive: true },
      }),
      prisma.instructorLocationService.findMany({
        select: { instructorId: true, locationId: true, serviceTypeId: true },
      }),
    ]);

  const allInstructors: InstructorSummary[] = instructorRows.map((i) => ({
    id: i.id,
    userId: i.userId,
    name: i.User?.name ?? "Ukjent",
  }));

  // INSTRUCTOR-rolle ser kun seg selv
  const instructors =
    user.role === "INSTRUCTOR"
      ? allInstructors.filter((i) => i.userId === user.id)
      : allInstructors;

  // Bygg config per (instructor × location)
  const configMap = new Map<string, InstructorLocationConfig>();
  for (const il of instructorLocations) {
    const key = `${il.instructorId}::${il.locationId}`;
    configMap.set(key, {
      instructorId: il.instructorId,
      locationId: il.locationId,
      isActive: il.isActive,
      serviceTypeIds: [],
    });
  }
  for (const ils of instructorLocationServices) {
    const key = `${ils.instructorId}::${ils.locationId}`;
    const entry = configMap.get(key);
    if (entry) {
      entry.serviceTypeIds.push(ils.serviceTypeId);
    } else {
      // Service uten tilhørende InstructorLocation — sjelden, men vi støtter det
      configMap.set(key, {
        instructorId: ils.instructorId,
        locationId: ils.locationId,
        isActive: true,
        serviceTypeIds: [ils.serviceTypeId],
      });
    }
  }

  // RBAC-filter på config: hvis INSTRUCTOR, vis bare egen
  const config = Array.from(configMap.values()).filter((c) =>
    instructors.some((i) => i.id === c.instructorId),
  );

  return { locations, services, instructors, config };
}

/**
 * Knytt en coach til en lokasjon (eller oppdater isActive).
 */
export async function setInstructorLocation(params: {
  instructorId: string;
  locationId: string;
  isActive: boolean;
}): Promise<void> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (user.role === "INSTRUCTOR") {
    const inst = await prisma.instructor.findUnique({
      where: { id: params.instructorId },
      select: { userId: true },
    });
    if (inst?.userId !== user.id) {
      throw new Error("Kan kun endre egne lokasjoner");
    }
  }

  await prisma.instructorLocation.upsert({
    where: {
      instructorId_locationId: {
        instructorId: params.instructorId,
        locationId: params.locationId,
      },
    },
    create: {
      id: randomUUID(),
      instructorId: params.instructorId,
      locationId: params.locationId,
      isActive: params.isActive,
    },
    update: {
      isActive: params.isActive,
    },
  });

  // Når en coach blir inaktiv på en lokasjon: rydd opp tjenester også (kaskaderer ikke automatisk siden tabellene er adskilt)
  if (!params.isActive) {
    await prisma.instructorLocationService.deleteMany({
      where: {
        instructorId: params.instructorId,
        locationId: params.locationId,
      },
    });
  }

  revalidatePath("/admin/lokasjoner");
  updateTag("instructor-locations");
}

/**
 * Sett komplett tjenesteliste for en (coach × lokasjon). Diff og oppdater.
 */
export async function setLocationServices(params: {
  instructorId: string;
  locationId: string;
  serviceTypeIds: string[];
}): Promise<void> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  if (user.role === "INSTRUCTOR") {
    const inst = await prisma.instructor.findUnique({
      where: { id: params.instructorId },
      select: { userId: true },
    });
    if (inst?.userId !== user.id) {
      throw new Error("Kan kun endre egne lokasjoner");
    }
  }

  // Sørg for at InstructorLocation finnes (kreves som forutsetning)
  const link = await prisma.instructorLocation.findUnique({
    where: {
      instructorId_locationId: {
        instructorId: params.instructorId,
        locationId: params.locationId,
      },
    },
  });
  if (!link || !link.isActive) {
    throw new Error("Coach er ikke aktiv på denne lokasjonen");
  }

  // Diff eksisterende → ønsket
  const existing = await prisma.instructorLocationService.findMany({
    where: {
      instructorId: params.instructorId,
      locationId: params.locationId,
    },
    select: { serviceTypeId: true },
  });
  const existingSet = new Set(existing.map((e) => e.serviceTypeId));
  const desiredSet = new Set(params.serviceTypeIds);

  const toAdd = params.serviceTypeIds.filter((id) => !existingSet.has(id));
  const toRemove = Array.from(existingSet).filter((id) => !desiredSet.has(id));

  if (toRemove.length > 0) {
    await prisma.instructorLocationService.deleteMany({
      where: {
        instructorId: params.instructorId,
        locationId: params.locationId,
        serviceTypeId: { in: toRemove },
      },
    });
  }

  if (toAdd.length > 0) {
    await prisma.instructorLocationService.createMany({
      data: toAdd.map((serviceTypeId) => ({
        id: randomUUID(),
        instructorId: params.instructorId,
        locationId: params.locationId,
        serviceTypeId,
      })),
      skipDuplicates: true,
    });
  }

  logger.info(
    `[setLocationServices] ${params.instructorId} × ${params.locationId}: +${toAdd.length} -${toRemove.length}`,
  );

  revalidatePath("/admin/lokasjoner");
  updateTag("instructor-locations");
}

/**
 * Opprett ny lokasjon (kun ADMIN). Brukes hvis coachen vil legge til en
 * lokasjon som ikke finnes i Location-tabellen ennå.
 */
export async function createLocation(params: {
  name: string;
  address?: string;
}): Promise<{ id: string }> {
  const user = await requirePortalUser();
  if (!user?.id || user.role !== "ADMIN") {
    throw new Error("Kun admin kan opprette nye lokasjoner");
  }

  if (!params.name.trim()) {
    throw new Error("Navn kreves");
  }

  const id = randomUUID();
  await prisma.location.create({
    data: {
      id,
      name: params.name.trim(),
      address: params.address?.trim() || null,
      updatedAt: new Date(),
    },
  });

  revalidatePath("/admin/lokasjoner");
  return { id };
}
