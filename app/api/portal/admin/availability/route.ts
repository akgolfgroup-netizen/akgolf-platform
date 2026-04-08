/**
 * Admin API for håndtering av instruktør-tilgjengelighet
 * 
 * GET  - Hent tilgjengelighet for en instruktør
 * POST - Opprett/oppdater tilgjengelighet
 * DELETE - Deaktiver tilgjengelighet
 * 
 * NOTE: Converted from Prisma to Supabase
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";
import { logger } from "@/lib/logger";
import { nanoid } from "nanoid";

// Enum for change types (previously from Prisma)
enum AvailabilityChangeType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DEACTIVATED = "DEACTIVATED",
}

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
 * Henter tilgjengelighet for en instruktør
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

    const supabase = await createServerSupabase();

    // Sjekk admin-tilgang
    const { data: dbUser } = await supabase
      .from("User")
      .select("role")
      .eq("id", user.id)
      .single();

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

    // Hent tilgjengelighet
    const { data: availability } = await supabase
      .from("InstructorAvailability")
      .select("*")
      .eq("instructorId", instructorId)
      .eq("isActive", true)
      .or("validUntil.is.null,validUntil.gte." + new Date().toISOString())
      .order("dayOfWeek", { ascending: true })
      .order("startTime", { ascending: true });

    // Hent recent changes (simplified without join)
    const { data: recentChanges } = await supabase
      .from("AvailabilityChangeLog")
      .select("*")
      .eq("instructorId", instructorId)
      .order("createdAt", { ascending: false })
      .limit(20);

    return NextResponse.json({
      availability: availability || [],
      recentChanges: (recentChanges || []).map((change) => ({
        id: change.id,
        changeType: change.changeType,
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
 * Oppretter eller oppdaterer tilgjengelighet
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

    const supabase = await createServerSupabase();

    // Sjekk admin-tilgang
    const { data: dbUser } = await supabase
      .from("User")
      .select("role, name")
      .eq("id", user.id)
      .single();

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
    const { data: instructor } = await supabase
      .from("Instructor")
      .select("id, User(name)")
      .eq("id", data.instructorId)
      .single();

    if (!instructor) {
      return NextResponse.json(
        { error: "Instruktør ikke funnet" },
        { status: 404 }
      );
    }

    let availability;
    let changeType: AvailabilityChangeType;
    let oldValue: object | undefined = undefined;

    if (data.id) {
      // Oppdater eksisterende
      const { data: existing } = await supabase
        .from("InstructorAvailability")
        .select("*")
        .eq("id", data.id)
        .single();

      if (!existing) {
        return NextResponse.json(
          { error: "Tilgjengelighet ikke funnet" },
          { status: 404 }
        );
      }

      oldValue = {
        dayOfWeek: existing.dayOfWeek,
        startTime: existing.startTime,
        endTime: existing.endTime,
        isActive: existing.isActive,
      };

      const { data: updated } = await supabase
        .from("InstructorAvailability")
        .update({
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          isActive: data.isActive,
          validFrom: data.validFrom ? new Date(data.validFrom).toISOString() : new Date().toISOString(),
          validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", data.id)
        .select()
        .single();

      availability = updated;
      changeType = AvailabilityChangeType.UPDATED;
    } else {
      // Sjekk for duplikat
      const { data: existing } = await supabase
        .from("InstructorAvailability")
        .select("id")
        .eq("instructorId", data.instructorId)
        .eq("dayOfWeek", data.dayOfWeek)
        .eq("startTime", data.startTime)
        .maybeSingle();

      if (existing) {
        return NextResponse.json(
          { error: "En tilgjengelighet for dette tidspunktet eksisterer allerede" },
          { status: 400 }
        );
      }

      // Opprett ny
      const { data: created } = await supabase
        .from("InstructorAvailability")
        .insert({
          id: nanoid(),
          instructorId: data.instructorId,
          dayOfWeek: data.dayOfWeek,
          startTime: data.startTime,
          endTime: data.endTime,
          isActive: data.isActive,
          validFrom: data.validFrom ? new Date(data.validFrom).toISOString() : new Date().toISOString(),
          validUntil: data.validUntil ? new Date(data.validUntil).toISOString() : null,
        })
        .select()
        .single();

      availability = created;
      changeType = AvailabilityChangeType.CREATED;
    }

    // Logg endringen
    await supabase
      .from("AvailabilityChangeLog")
      .insert({
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
      });

    logger.info(
      `[admin/availability] ${data.id ? "Updated" : "Created"} availability for instructor ${data.instructorId} by ${user.id}`
    );

    return NextResponse.json({
      success: true,
      availability,
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
 * Deaktiverer tilgjengelighet
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

    const supabase = await createServerSupabase();

    // Sjekk admin-tilgang
    const { data: dbUser } = await supabase
      .from("User")
      .select("role")
      .eq("id", user.id)
      .single();

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

    const { data: existing } = await supabase
      .from("InstructorAvailability")
      .select("*")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "Tilgjengelighet ikke funnet" },
        { status: 404 }
      );
    }

    // Soft-delete: deaktiver
    await supabase
      .from("InstructorAvailability")
      .update({
        isActive: false,
        validUntil: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id);

    // Logg endringen
    await supabase
      .from("AvailabilityChangeLog")
      .insert({
        id: nanoid(),
        availabilityId: id,
        instructorId: existing.instructorId,
        changedBy: user.id,
        changeType: AvailabilityChangeType.DEACTIVATED,
        oldValue: {
          dayOfWeek: existing.dayOfWeek,
          startTime: existing.startTime,
          endTime: existing.endTime,
          isActive: existing.isActive,
        },
        newValue: { isActive: false },
        changeReason: reason || null,
      });

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
