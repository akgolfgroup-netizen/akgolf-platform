import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { BookingStatus, FacilityActivityStatus } from "@prisma/client";
import { checkRateLimit, getClientIp, RATE_LIMITS } from "@/lib/portal/rate-limit";

// Farger for aktivitetstyper (Brand Guide 2026 - Apple Light)
const ACTIVITY_COLORS: Record<string, string> = {
  TOURNAMENT_CLUB: "#FF3B30", // Error red
  TOURNAMENT_REGION: "#FF3B30",
  TOURNAMENT_JUNIOR: "#FF3B30",
  VTG_COURSE: "#FF9500", // Warning
  GFGK_JUNIOR: "#34C759", // Success
  AK_GOLF: "#007AFF", // Info blue
  AK_GOLF_JUNIOR_ACADEMY: "#007AFF",
  SPONSOR_EVENT: "#5856D6", // Purple
  INTERNAL: "#86868B", // Grey
  CLOSURE: "#1D1D1F", // Black
  OTHER: "#86868B",
  BOOKING: "#86868B", // Grey for bookinger
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

  // Hent fasiliteter
  const facilities = await prisma.facility.findMany({
    where: {
      isActive: true,
      ...(facilityId && { id: facilityId }),
      ...(locationId && { locationId }),
    },
    include: {
      Location: {
        select: { id: true, name: true },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  const facilityIds = facilities.map((f) => f.id);

  // Hent aktiviteter
  const activities = await prisma.facilityActivity.findMany({
    where: {
      facilityId: { in: facilityIds },
      status: { not: FacilityActivityStatus.CANCELLED },
      OR: [
        { startTime: { gte: start, lte: end } },
        { endTime: { gte: start, lte: end } },
        { startTime: { lte: start }, endTime: { gte: end } },
      ],
    },
    include: {
      Facility: { select: { id: true, name: true } },
      CreatedBy: { select: { name: true } },
    },
    orderBy: { startTime: "asc" },
  });

  // Hent bookinger med fasilitet
  const bookings = await prisma.booking.findMany({
    where: {
      facilityId: { in: facilityIds },
      status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      OR: [
        { startTime: { gte: start, lte: end } },
        { endTime: { gte: start, lte: end } },
        { startTime: { lte: start }, endTime: { gte: end } },
      ],
    },
    include: {
      Facility: { select: { id: true, name: true } },
      User: { select: { name: true } },
      ServiceType: { select: { name: true } },
      Instructor: {
        include: {
          User: { select: { name: true } },
        },
      },
    },
    orderBy: { startTime: "asc" },
  });

  // Konverter til kalender-events
  const events: CalendarEvent[] = [];

  for (const activity of activities) {
    events.push({
      id: activity.id,
      type: "activity",
      title: activity.title,
      description: activity.description,
      facilityId: activity.facilityId,
      facilityName: activity.Facility.name,
      startTime: activity.startTime.toISOString(),
      endTime: activity.endTime.toISOString(),
      color: activity.color ?? ACTIVITY_COLORS[activity.activityType] ?? ACTIVITY_COLORS.OTHER,
      status: activity.status,
      createdBy: activity.CreatedBy.name,
      activityType: activity.activityType,
    });
  }

  for (const booking of bookings) {
    if (!booking.Facility) continue;
    events.push({
      id: booking.id,
      type: "booking",
      title: `${booking.ServiceType.name} - ${booking.User.name ?? "Ukjent"}`,
      description: `Instruktør: ${booking.Instructor.User.name}`,
      facilityId: booking.Facility.id,
      facilityName: booking.Facility.name,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
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
