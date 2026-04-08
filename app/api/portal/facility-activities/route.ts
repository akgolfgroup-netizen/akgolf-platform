import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkFacilityConflicts } from "@/lib/portal/facility/conflict-check";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * GET /api/portal/facility-activities
 * Henter aktiviteter med filter
 */
export async function GET(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const facilityId = searchParams.get("facilityId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const status = searchParams.get("status");

  const supabase = await createServerSupabase();
  
  let query = supabase
    .from("FacilityActivity")
    .select(`
      *,
      Facility (id, name, slug),
      CreatedBy (id, name),
      ApprovedBy (id, name)
    `);

  if (facilityId) {
    query = query.eq("facilityId", facilityId);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (startDate && endDate) {
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();
    // OR logic for overlapping events
    query = query.or(`startTime.gte.${start},startTime.lte.${end},and(startTime.lte.${start},endTime.gte.${end})`);
  }

  const { data: activities, error } = await query.order("startTime", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente aktiviteter" }, { status: 500 });
  }

  return NextResponse.json(activities || []);
}

/**
 * POST /api/portal/facility-activities
 * Opprett ny aktivitet
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const body = await req.json();
  const {
    facilityId,
    title,
    description,
    activityType,
    startTime,
    endTime,
    isRecurring,
    recurrenceRule,
    color,
  } = body;

  if (!facilityId || !title || !activityType || !startTime || !endTime) {
    return NextResponse.json(
      { error: "Mangler obligatoriske felter" },
      { status: 400 }
    );
  }

  // Valider aktivitetstype
  const validActivityTypes = ["TOURNAMENT_CLUB", "TOURNAMENT_REGION", "TOURNAMENT_JUNIOR", "VTG_COURSE", "GFGK_JUNIOR", "AK_GOLF", "AK_GOLF_JUNIOR_ACADEMY", "SPONSOR_EVENT", "INTERNAL", "CLOSURE", "OTHER", "BOOKING"];
  if (!validActivityTypes.includes(activityType)) {
    return NextResponse.json(
      { error: "Ugyldig aktivitetstype" },
      { status: 400 }
    );
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    return NextResponse.json(
      { error: "Sluttid må være etter starttid" },
      { status: 400 }
    );
  }

  // Sjekk konflikter
  const conflicts = await checkFacilityConflicts(facilityId, start, end);

  // Bestem status basert på konflikter
  let activityStatus: string = "CONFIRMED";
  let conflictNote: string | null = null;

  if (conflicts.hasConflict) {
    // Kun admin kan godkjenne konflikter direkte
    if (isAdmin(user.role)) {
      activityStatus = "CONFIRMED";
      conflictNote = `Godkjent med ${conflicts.conflictingItems.length} konflikter`;
    } else {
      activityStatus = "PENDING";
      conflictNote = `Venter på godkjenning - ${conflicts.conflictingItems.length} konflikter`;
    }
  }

  const supabase = await createServerSupabase();
  const { data: activity, error } = await supabase
    .from("FacilityActivity")
    .insert({
      facilityId,
      title,
      description,
      activityType,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      isRecurring: isRecurring ?? false,
      recurrenceRule,
      createdById: user.id,
      approvedById: activityStatus === "CONFIRMED" ? user.id : null,
      status: activityStatus,
      conflictNote,
      color,
    })
    .select(`
      *,
      Facility (id, name, slug),
      CreatedBy (id, name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke opprette aktivitet" }, { status: 500 });
  }

  return NextResponse.json(
    {
      activity,
      conflicts: conflicts.hasConflict ? conflicts.conflictingItems : null,
    },
    { status: 201 }
  );
}
