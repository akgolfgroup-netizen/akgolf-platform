import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff, isAdmin } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

/**
 * GET /api/portal/facilities
 * Henter alle fasiliteter (krever staff-tilgang)
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
  const locationId = searchParams.get("locationId");

  const supabase = await createServerSupabase();
  
  let query = supabase
    .from("Facility")
    .select(`
      *,
      Location (id, name)
    `)
    .eq("isActive", true);

  if (locationId) {
    query = query.eq("locationId", locationId);
  }

  const { data: facilities, error } = await query
    .order("sortOrder", { ascending: true });

  if (error) {
    return NextResponse.json({ error: "Kunne ikke hente fasiliteter" }, { status: 500 });
  }

  // Sort by Location name first, then sortOrder
  const sortedFacilities = (facilities || []).sort((a, b) => {
    const locationCompare = (a.Location?.name || "").localeCompare(b.Location?.name || "");
    if (locationCompare !== 0) return locationCompare;
    return (a.sortOrder || 0) - (b.sortOrder || 0);
  });

  return NextResponse.json(sortedFacilities);
}

/**
 * POST /api/portal/facilities
 * Opprett ny fasilitet (krever admin-tilgang)
 */
export async function POST(req: NextRequest) {
  const rateLimit = checkRateLimit(`api:${getClientIp(req)}`, RATE_LIMITS.API_GENERAL);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "For mange forespørsler" }, { status: 429 });
  }

  const user = await requirePortalUser();
  if (!isAdmin(user.role)) {
    return NextResponse.json({ error: "Kun admin kan opprette fasiliteter" }, { status: 403 });
  }

  const body = await req.json();
  const { locationId, name, slug, description, capacity, sortOrder } = body;

  if (!locationId || !name || !slug) {
    return NextResponse.json(
      { error: "Mangler obligatoriske felter: locationId, name, slug" },
      { status: 400 }
    );
  }

  const supabase = await createServerSupabase();

  // Sjekk at slug er unik
  const { data: existing } = await supabase
    .from("Facility")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Slug er allerede i bruk" }, { status: 400 });
  }

  const { data: facility, error } = await supabase
    .from("Facility")
    .insert({
      locationId,
      name,
      slug,
      description,
      capacity,
      sortOrder: sortOrder ?? 0,
    })
    .select(`
      *,
      Location (id, name)
    `)
    .single();

  if (error) {
    return NextResponse.json({ error: "Kunne ikke opprette fasilitet" }, { status: 500 });
  }

  return NextResponse.json(facility, { status: 201 });
}
