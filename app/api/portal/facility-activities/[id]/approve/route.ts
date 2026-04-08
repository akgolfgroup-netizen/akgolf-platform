import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * POST /api/portal/facility-activities/[id]/approve
 * Godkjenn en aktivitet med konflikt (kun admin)
 */
export async function POST(req: NextRequest, { params }: RouteParams) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isAdmin(user.role)) {
    return NextResponse.json(
      { error: "Kun admin kan godkjenne konflikter" },
      { status: 403 }
    );
  }

  const { id } = await params;
  const supabase = await createServerSupabase();

  const { data: existing, error: existingError } = await supabase
    .from("FacilityActivity")
    .select("status")
    .eq("id", id)
    .single();

  if (existingError || !existing) {
    return NextResponse.json({ error: "Aktivitet ikke funnet" }, { status: 404 });
  }

  if (existing.status !== "PENDING") {
    return NextResponse.json(
      { error: "Aktiviteten er ikke i ventestatus" },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const { conflictNote } = body;

  const { data: activity, error } = await supabase
    .from("FacilityActivity")
    .update({
      status: "CONFIRMED",
      approvedById: user.id,
      conflictNote: conflictNote ?? `Godkjent av ${user.name ?? "admin"}`,
    })
    .eq("id", id)
    .select(`
      *,
      Facility (id, name, slug),
      CreatedBy (id, name),
      ApprovedBy (id, name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke godkjenne aktivitet" }, { status: 500 });
  }

  return NextResponse.json(activity);
}
