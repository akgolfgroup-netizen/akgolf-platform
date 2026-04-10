import { NextRequest, NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

// Farger for aktivitetstyper (Brand Guide 2026 - Apple Light)
const ACTIVITY_COLORS: Record<string, string> = {
  TOURNAMENT_CLUB: "#D14343", // Error red
  TOURNAMENT_REGION: "#D14343",
  TOURNAMENT_JUNIOR: "#D14343",
  VTG_COURSE: "#C48A32", // Warning
  GFGK_JUNIOR: "#005840", // Success
  AK_GOLF: "#007AFF", // Info blue
  AK_GOLF_JUNIOR_ACADEMY: "#007AFF",
  SPONSOR_EVENT: "#5856D6", // Purple
  INTERNAL: "#7A8C85", // Grey
  CLOSURE: "#0A1F18", // Black
  OTHER: "#7A8C85",
  BOOKING: "#7A8C85", // Grey for bookinger
};

interface CalendarEvent {
  id: string;
  type: "booking" | "activity";
  title: string;
  description?: string | null;
  facilityId: string;
  facilityName: string;
  startTime: string;
  endTime: string;
  color: string;
  status: string;
  createdBy?: string | null;
  activityType?: string;
}

/**
 * GET /api/portal/facility-calendar
 * Henter aggregert kalenderdata for alle fasiliteter
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
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const facilityId = searchParams.get("facilityId");
  const locationId = searchParams.get("locationId");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "Mangler startDate og/eller endDate" },
      { status: 400 }
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  const supabase = await createServerSupabase();

  // Hent fasiliteter
  let facilitiesQuery = supabase
    .from("Facility")
    .select(`
      *,
      Location (id, name)
    `)
    .eq("isActive", true);

  if (facilityId) {
    facilitiesQuery = facilitiesQuery.eq("id", facilityId);
  }
  if (locationId) {
    facilitiesQuery = facilitiesQuery.eq("locationId", locationId);
  }

  const { data: facilities, error: facilitiesError } = await facilitiesQuery.order("sortOrder", { ascending: true });

  if (facilitiesError) {
    return NextResponse.json({ error: "Kunne ikke hente fasiliteter" }, { status: 500 });
  }

  const facilityIds = (facilities || []).map((f: { id: string }) => f.id);

  if (facilityIds.length === 0) {
    return NextResponse.json({ facilities: [], events: [], activityColors: ACTIVITY_COLORS });
  }

  // Hent aktiviteter
  const { data: activities, error: activitiesError } = await supabase
    .from("FacilityActivity")
    .select(`
      *,
      Facility (id, name),
      CreatedBy (name)
    `)
    .in("facilityId", facilityIds)
    .neq("status", "CANCELLED")
    .or(`startTime.gte.${start.toISOString()},startTime.lte.${end.toISOString()},and(startTime.lte.${start.toISOString()},endTime.gte.${end.toISOString()})`)
    .order("startTime", { ascending: true });

  if (activitiesError) {
    return NextResponse.json({ error: "Kunne ikke hente aktiviteter" }, { status: 500 });
  }

  // Hent bookinger med fasilitet
  const { data: bookings, error: bookingsError } = await supabase
    .from("Booking")
    .select(`
      *,
      Facility (id, name),
      User (name),
      ServiceType (name),
      Instructor (
        User (name)
      )
    `)
    .in("facilityId", facilityIds)
    .in("status", ["CONFIRMED", "PENDING"])
    .or(`startTime.gte.${start.toISOString()},startTime.lte.${end.toISOString()},and(startTime.lte.${start.toISOString()},endTime.gte.${end.toISOString()})`)
    .order("startTime", { ascending: true });

  if (bookingsError) {
    return NextResponse.json({ error: "Kunne ikke hente bookinger" }, { status: 500 });
  }

  // Konverter til kalender-events
  const events: CalendarEvent[] = [];

  for (const activity of activities || []) {
    events.push({
      id: activity.id,
      type: "activity",
      title: activity.title,
      description: activity.description,
      facilityId: activity.facilityId,
      facilityName: activity.Facility?.name,
      startTime: activity.startTime,
      endTime: activity.endTime,
      color: activity.color ?? ACTIVITY_COLORS[activity.activityType] ?? ACTIVITY_COLORS.OTHER,
      status: activity.status,
      createdBy: activity.CreatedBy?.name,
      activityType: activity.activityType,
    });
  }

  for (const booking of bookings || []) {
    if (!booking.Facility) continue;
    events.push({
      id: booking.id,
      type: "booking",
      title: `${booking.ServiceType?.name} - ${booking.User?.name ?? "Ukjent"}`,
      description: `Instruktør: ${booking.Instructor?.User?.name}`,
      facilityId: booking.Facility.id,
      facilityName: booking.Facility.name,
      startTime: booking.startTime,
      endTime: booking.endTime,
      color: ACTIVITY_COLORS.BOOKING,
      status: booking.status,
    });
  }

  // Sorter events etter starttid
  events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  return NextResponse.json({
    facilities,
    events,
    activityColors: ACTIVITY_COLORS,
  });
}
