/**
 * Admin API for håndtering av instruktør-tilgjengelighet
 * 
 * GET  - Hent tilgjengelighet for en instruktør
 * POST - Opprett/oppdater tilgjengelighet
 * DELETE - Deaktiver tilgjengelighet
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { invalidateSlotsCache } from "@/lib/portal/booking/cache";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";
import { AvailabilityChangeType } from "@prisma/client";

// Hjelpefunksjoner for validering
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

function isValidTime(time: string): boolean {
  return timeRegex.test(time);
}

function isValidDayOfWeek(day: number): boolean {
  return Number.isInteger(day) && day >= 0 && day <= 6;
}

interface AvailabilityInput {
  instructorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
  validFrom?: string;
  validUntil?: string | null;
  id?: string;
}

function validateAvailabilityInput(data: unknown): { success: true; data: AvailabilityInput } | { success: false; error: string } {
  const d = data as Record<string, unknown>;
  
  if (!d.instructorId || typeof d.instructorId !== "string") {
    return { success: false, error: "instructorId er påkrevd" };
  }
  
  if (typeof d.dayOfWeek !== "number" || !isValidDayOfWeek(d.dayOfWeek)) {
    return { success: false, error: "dayOfWeek må være 0-6" };
  }
  
  if (!d.startTime || typeof d.startTime !== "string" || !isValidTime(d.startTime)) {
    return { success: false, error: "startTime må være i format HH:MM" };
  }
  
  if (!d.endTime || typeof d.endTime !== "string" || !isValidTime(d.endTime)) {
    return { success: false, error: "endTime må være i format HH:MM" };
  }
  
  return { 
    success: true, 
    data: {
      instructorId: d.instructorId,
      dayOfWeek: d.dayOfWeek,
      startTime: d.startTime,
      endTime: d.endTime,
      isActive: d.isActive !== false,
      validFrom: d.validFrom as string | undefined,
      validUntil: d.validUntil as string | null | undefined,
      id: d.id as string | undefined,
    }
  };
}

/**
 * GET /api/portal/admin/availability?instructorId=xxx
 * 
 * Henter tilgjengelighet for en instruktør med audit log
 */
export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`admin:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    }

    // Sjekk admin-tilgang
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Mangler tilgang" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get("instructorId");

    if (!instructorId) {
      return NextResponse.json(
        { error: "Mangler instructorId parameter" },
        { status: 400 }
      );
    }

    // Hent tilgjengelighet og recent changes
    const [availability, recentChanges] = await Promise.all([
      prisma.instructorAvailability.findMany({
        where: {
          instructorId,
          isActive: true,
          OR: [
            { validUntil: null },
            { validUntil: { gte: new Date() } },
          ],
        },
        orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
      }),
      prisma.availabilityChangeLog.findMany({
        where: { instructorId },
        orderBy: { createdAt: "desc" },
        take: 20,
        include: {
          Availability: {
            select: {
              dayOfWeek: true,
              startTime: true,
              endTime: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      availability,
      recentChanges: recentChanges.map((change) => ({
        id: change.id,
        changeType: change.changeType,
        dayOfWeek: change.Availability?.dayOfWeek,
        timeRange: change.Availability 
          ? `${change.Availability.startTime}-${change.Availability.endTime}`
          : null,
        changedAt: change.createdAt,
        changeReason: change.changeReason,
      })),
    });
  } catch (error) {
    logger.error("[admin/availability GET] Error:", error);
    return NextResponse.json(
      { error: "Kunne ikke hente tilgjengelighet" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/portal/admin/availability
 * 
 * Oppretter eller oppdaterer tilgjengelighet med audit logging
 * og invalidering av cache
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`admin:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    }

    // Sjekk admin-tilgang
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true, name: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Mangler tilgang" }, { status: 403 });
    }

    const body = await req.json();
    const parseResult = validateAvailabilityInput(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // Valider at startTime er før endTime
    const [startH, startM] = data.startTime.split(":").map(Number);
    const [endH, endM] = data.endTime.split(":").map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    if (startMinutes >= endMinutes) {
      return NextResponse.json(
        { error: "Starttid må være før sluttid" },
        { status: 400 }
      );
    }

    // Sjekk at instruktøren eksisterer
    const instructor = await prisma.instructor.findUnique({
      where: { id: data.instructorId },
      include: { User: { select: { name: true } } },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: "Instruktør ikke funnet" },
        { status: 404 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      let availability;
      let changeType: AvailabilityChangeType;
      let oldValue: object | undefined = undefined;

      if (data.id) {
        // Oppdater eksisterende
        const existing = await tx.instructorAvailability.findUnique({
          where: { id: data.id },
        });

        if (!existing) {
          throw new Error("Tilgjengelighet ikke funnet");
        }

        oldValue = {
          dayOfWeek: existing.dayOfWeek,
          startTime: existing.startTime,
          endTime: existing.endTime,
          isActive: existing.isActive,
        };

        availability = await tx.instructorAvailability.update({
          where: { id: data.id },
          data: {
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            isActive: data.isActive,
            validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
            validUntil: data.validUntil ? new Date(data.validUntil) : null,
            updatedAt: new Date(),
          },
        });

        changeType = AvailabilityChangeType.UPDATED;
      } else {
        // Sjekk for duplikat
        const existing = await tx.instructorAvailability.findFirst({
          where: {
            instructorId: data.instructorId,
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
          },
        });

        if (existing) {
          throw new Error("En tilgjengelighet for dette tidspunktet eksisterer allerede");
        }

        // Opprett ny
        availability = await tx.instructorAvailability.create({
          data: {
            id: nanoid(),
            instructorId: data.instructorId,
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            isActive: data.isActive,
            validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
            validUntil: data.validUntil ? new Date(data.validUntil) : null,
          },
        });

        changeType = AvailabilityChangeType.CREATED;
      }

      // Logg endringen
      await tx.availabilityChangeLog.create({
        data: {
          id: nanoid(),
          availabilityId: availability.id,
          instructorId: data.instructorId,
          changedBy: user.id,
          changeType,
          oldValue,
          newValue: {
            dayOfWeek: data.dayOfWeek,
            startTime: data.startTime,
            endTime: data.endTime,
            isActive: data.isActive,
          },
        },
      });

      return availability;
    });

    // Invalider cache for denne instruktøren
    await invalidateSlotsCache(data.instructorId);

    logger.info(
      `[admin/availability] ${data.id ? "Updated" : "Created"} availability for instructor ${data.instructorId} by ${user.id}`
    );

    return NextResponse.json({
      success: true,
      availability: result,
      message: data.id 
        ? "Tilgjengelighet oppdatert" 
        : "Tilgjengelighet opprettet",
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error("[admin/availability POST] Error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    logger.error("[admin/availability POST] Unexpected error:", error);
    return NextResponse.json(
      { error: "Kunne ikke lagre tilgjengelighet" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/portal/admin/availability
 * 
 * Deaktiverer eller sletter tilgjengelighet med audit logging
 */
export async function DELETE(req: NextRequest) {
  const rateLimit = checkRateLimit(`admin:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  try {
    const user = await requirePortalUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Ikke innlogget" }, { status: 401 });
    }

    // Sjekk admin-tilgang
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { role: true },
    });

    if (!dbUser || dbUser.role !== "ADMIN") {
      return NextResponse.json({ error: "Mangler tilgang" }, { status: 403 });
    }

    const body = await req.json() as { id?: string; reason?: string };
    
    if (!body.id || typeof body.id !== "string") {
      return NextResponse.json(
        { error: "id er påkrevd" },
        { status: 400 }
      );
    }

    const { id, reason } = body;

    const result = await prisma.$transaction(async (tx) => {
      const existing = await tx.instructorAvailability.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new Error("Tilgjengelighet ikke funnet");
      }

      // Soft-delete: deaktiver i stedet for å slette
      const availability = await tx.instructorAvailability.update({
        where: { id },
        data: {
          isActive: false,
          validUntil: new Date(), // Sett validUntil til nå
          updatedAt: new Date(),
        },
      });

      // Logg endringen
      await tx.availabilityChangeLog.create({
        data: {
          id: nanoid(),
          availabilityId: id,
          instructorId: existing.instructorId,
          changedBy: user.id,
          changeType: AvailabilityChangeType.DEACTIVATED,
          oldValue: existing ? {
            dayOfWeek: existing.dayOfWeek,
            startTime: existing.startTime,
            endTime: existing.endTime,
            isActive: existing.isActive,
          } : undefined,
          newValue: { isActive: false },
          changeReason: reason || null,
        },
      });

      return { availability, instructorId: existing.instructorId };
    });

    // Invalider cache
    await invalidateSlotsCache(result.instructorId);

    logger.info(
      `[admin/availability] Deactivated availability ${id} by ${user.id}`
    );

    return NextResponse.json({
      success: true,
      message: "Tilgjengelighet deaktivert",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Kunne ikke deaktivere tilgjengelighet" },
      { status: 500 }
    );
  }
}
