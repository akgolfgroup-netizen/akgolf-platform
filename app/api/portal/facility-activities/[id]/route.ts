import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkFacilityConflicts } from "@/lib/portal/facility/conflict-check";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/portal/facility-activities/[id]
 * Hent en aktivitet
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: activity, error } = await supabase
    .from("FacilityActivity")
    .select(`
      *,
      Facility (id, name, slug),
      CreatedBy (id, name),
      ApprovedBy (id, name)
    `)
    .eq("id", id)
    .single();

  if (error || !activity) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  return NextResponse.json(activity);
}

/**
 * PUT /api/portal/facility-activities/[id]
 * Oppdater en aktivitet
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("FacilityActivity")
    .select("*")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  // Kun admin eller oppretter kan endre
  if (!isAdmin(user.role) && existing.createdById !== user.id) {
    return NextResponse.json(
      { error: "Du kan kun endre egne aktiviteter" },
      { status: 403 }
    );
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
    status,
  } = body;

  const start = startTime ? new Date(startTime) : new Date(existing.startTime);
  const end = endTime ? new Date(endTime) : new Date(existing.endTime);

  if (end <= start) {
    return NextResponse.json(
      { error: "Sluttid må være etter starttid" },
      { status: 400 }
    );
  }

  // Sjekk konflikter hvis tidsrom eller fasilitet endres
  let conflictNote = existing.conflictNote;
  let activityStatus = status ?? existing.status;

  const targetFacilityId = facilityId ?? existing.facilityId;
  const timeChanged =
    (startTime && new Date(startTime).getTime() !== new Date(existing.startTime).getTime()) ||
    (endTime && new Date(endTime).getTime() !== new Date(existing.endTime).getTime());
  const facilityChanged = facilityId && facilityId !== existing.facilityId;

  if (timeChanged || facilityChanged) {
    const conflicts = await checkFacilityConflicts(
      targetFacilityId,
      start,
      end,
      id
    );

    if (conflicts.hasConflict && !isAdmin(user.role)) {
      activityStatus = "PENDING";
      conflictNote = `Venter på godkjenning - ${conflicts.conflictingItems.length} konflikter`;
    }
  }

  const updateData: Record<string, unknown> = {
    status: activityStatus,
    conflictNote,
  };

  if (facilityId) updateData.facilityId = facilityId;
  if (title) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (activityType && ["TOURNAMENT_CLUB", "TOURNAMENT_REGION", "TOURNAMENT_JUNIOR", "VTG_COURSE", "GFGK_JUNIOR", "AK_GOLF", "AK_GOLF_JUNIOR_ACADEMY", "SPONSOR_EVENT", "INTERNAL", "CLOSURE", "OTHER", "BOOKING"].includes(activityType)) {
    updateData.activityType = activityType;
  }
  if (startTime) updateData.startTime = start.toISOString();
  if (endTime) updateData.endTime = end.toISOString();
  if (isRecurring !== undefined) updateData.isRecurring = isRecurring;
  if (recurrenceRule !== undefined) updateData.recurrenceRule = recurrenceRule;
  if (color !== undefined) updateData.color = color;

  const { data: activity, error } = await supabase
    .from("FacilityActivity")
    .update(updateData)
    .eq("id", id)
    .select(`
      *,
      Facility (id, name, slug),
      CreatedBy (id, name),
      ApprovedBy (id, name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke oppdatere aktivitet" }, { status: 500 });
  }

  return NextResponse.json(activity);
}

/**
 * DELETE /api/portal/facility-activities/[id]
 * Slett/kanseller en aktivitet
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    return NextResponse.json({ error: "Ikke tilgang" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("FacilityActivity")
    .select("createdById")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  // Kun admin eller oppretter kan slette
  if (!isAdmin(user.role) && existing.createdById !== user.id) {
    return NextResponse.json(
      { error: "Du kan kun slette egne aktiviteter" },
      { status: 403 }
    );
  }

  // Sett status til CANCELLED i stedet for å slette
  const { error } = await supabase
    .from("FacilityActivity")
    .update({ status: "CANCELLED" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Kunne ikke kansellere aktivitet" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
