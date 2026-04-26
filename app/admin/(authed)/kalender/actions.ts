"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";
import { prisma } from "@/lib/portal/prisma";
import { nanoid } from "nanoid";

export interface CalendarBooking {
  id: string;
  startTime: Date;
  endTime: Date;
  status: string;
  student: { name: string | null; email: string | null };
  serviceType: { name: string; color: string | null; duration: number };
  instructor: { id: string; user: { name: string | null } };
  location: { name: string } | null;
  adminNotes: string | null;
}

export interface Instructor {
  id: string;
  user: { name: string | null; image: string | null };
}

export async function getBookingsForPeriod(
  startDate: string,
  endDate: string,
  instructorId?: string
): Promise<CalendarBooking[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = await createServerSupabase();
  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));

  let query = supabase
    .from("Booking")
    .select(`
      id,
      startTime,
      endTime,
      status,
      adminNotes,
      User (name, email),
      ServiceType (name, color, duration),
      Instructor (id, User (name)),
      Location (name)
    `)
    .gte("startTime", start.toISOString())
    .lte("endTime", end.toISOString())
    .in("status", ["PENDING", "CONFIRMED", "COMPLETED"]);

  if (instructorId) {
    query = query.eq("instructorId", instructorId);
  }

  const { data: bookings } = await query.order("startTime", { ascending: true });

  return (bookings || []).map((b) => {
    const bUser = Array.isArray(b.User) ? b.User[0] : b.User;
    const bService = Array.isArray(b.ServiceType) ? b.ServiceType[0] : b.ServiceType;
    const bInstructor = Array.isArray(b.Instructor) ? b.Instructor[0] : b.Instructor;
    const bLocation = Array.isArray(b.Location) ? b.Location[0] : b.Location;
    const bInstructorUser = bInstructor
      ? (Array.isArray((bInstructor as Record<string, unknown>).User)
          ? ((bInstructor as Record<string, unknown>).User as Record<string, unknown>[])[0]
          : (bInstructor as Record<string, unknown>).User) as Record<string, unknown> | undefined
      : undefined;

    return {
      id: b.id,
      startTime: new Date(b.startTime),
      endTime: new Date(b.endTime),
      status: b.status,
      student: {
        name: (bUser as Record<string, unknown> | undefined)?.name as string | null ?? null,
        email: (bUser as Record<string, unknown> | undefined)?.email as string | null ?? null,
      },
      serviceType: {
        name: ((bService as Record<string, unknown>)?.name as string) ?? "",
        color: ((bService as Record<string, unknown>)?.color as string | null) ?? null,
        duration: ((bService as Record<string, unknown>)?.duration as number) ?? 0,
      },
      instructor: {
        id: ((bInstructor as Record<string, unknown>)?.id as string) ?? "",
        user: { name: (bInstructorUser?.name as string | null) ?? null },
      },
      location: bLocation ? { name: (bLocation as Record<string, unknown>).name as string } : null,
      adminNotes: b.adminNotes,
    };
  });
}

export async function getInstructors() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const supabase = await createServerSupabase();

  const { data: instructors } = await supabase
    .from("Instructor")
    .select(`
      id,
      User (name, image)
    `)
    .order("User(name)", { ascending: true });

  return (instructors || []).map((i) => {
    const iUser = Array.isArray(i.User) ? i.User[0] : i.User;
    return {
      id: i.id,
      user: {
        name: (iUser as Record<string, unknown> | undefined)?.name as string | null ?? null,
        image: (iUser as Record<string, unknown> | undefined)?.image as string | null ?? null,
      },
    };
  });
}

export async function getBookingsForDay(date: string, instructorId?: string) {
  const start = startOfDay(new Date(date));
  const end = endOfDay(new Date(date));
  return getBookingsForPeriod(start.toISOString(), end.toISOString(), instructorId);
}

export async function getBookingsForWeek(date: string, instructorId?: string) {
  const d = new Date(date);
  const start = startOfWeek(d, { weekStartsOn: 1 }); // Monday
  const end = endOfWeek(d, { weekStartsOn: 1 }); // Sunday
  return getBookingsForPeriod(start.toISOString(), end.toISOString(), instructorId);
}

export async function markNoShow(bookingId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = await createServerSupabase();

  await supabase
    .from("Booking")
    .update({ status: "NO_SHOW" })
    .eq("id", bookingId);
}

/**
 * Marker en booking som fullført. Trigger automatisk:
 *  - onBookingCompleted-event (transkripsjon + AI-sammendrag hvis lyd er lastet opp)
 *  - Stripe payment-collect (Sprint 2 — kommer)
 *
 * Dette er flaskehalsen i dag — bookinger fullføres manuelt fra kalender/økter.
 */
export async function markBookingCompleted(bookingId: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = await createServerSupabase();

  const { error } = await supabase
    .from("Booking")
    .update({ status: "COMPLETED" })
    .eq("id", bookingId);

  if (error) throw new Error(`Kunne ikke markere fullført: ${error.message}`);

  // Fire-and-forget: trigger automatisk AI-pipeline i bakgrunn.
  // Hvis lyd er lastet opp, transkriberes og oppsummeres innen kort tid.
  const { onBookingCompleted } = await import("@/lib/portal/agents/runner");
  void onBookingCompleted(bookingId).catch((err) => {
    // Logget i agent-runner; vi ønsker ikke å feile selve markeringen
    console.error("[markBookingCompleted] runner failed", err);
  });

  return { ok: true };
}

export async function addAdminNote(bookingId: string, note: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  const supabase = await createServerSupabase();

  await supabase
    .from("Booking")
    .update({ adminNotes: note })
    .eq("id", bookingId);
}

// ————————————————————————————————————————————
// Prisma-baserte actions (nye)
// ————————————————————————————————————————————

export interface CalendarBlockedTime {
  id: string;
  startTime: Date;
  endTime: Date;
  reason: string | null;
}

export interface CalendarAvailability {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export async function getBlockedTimesForPeriod(
  startDate: string,
  endDate: string,
  instructorId?: string
): Promise<CalendarBlockedTime[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  const start = startOfDay(new Date(startDate));
  const end = endOfDay(new Date(endDate));

  return prisma.blockedTime.findMany({
    where: {
      startTime: { gte: start, lte: end },
      ...(instructorId ? { instructorId } : {}),
    },
    orderBy: { startTime: "asc" },
  });
}

export async function getInstructorAvailabilityPrisma(
  instructorId: string
): Promise<CalendarAvailability[]> {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.instructorAvailability.findMany({
    where: { instructorId },
    orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
  });
}

export async function upsertInstructorAvailabilityPrisma(
  instructorId: string,
  slots: Array<{ dayOfWeek: number; startTime: string; endTime: string }>
) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.instructorAvailability.deleteMany({
    where: { instructorId },
  });

  if (slots.length > 0) {
    await prisma.instructorAvailability.createMany({
      data: slots.map((slot) => ({
        id: nanoid(),
        instructorId,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
      })),
    });
  }
}

export async function deleteInstructorAvailabilityPrisma(id: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.instructorAvailability.delete({
    where: { id },
  });
}

export async function createBlockedTimePrisma(params: {
  instructorId: string | null;
  startTime: string;
  endTime: string;
  reason?: string;
}) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.blockedTime.create({
    data: {
      id: nanoid(),
      instructorId: params.instructorId,
      startTime: new Date(params.startTime),
      endTime: new Date(params.endTime),
      reason: params.reason || null,
      isRecurring: false,
    },
  });
}

export async function deleteBlockedTimePrisma(id: string) {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    throw new Error("Ikke autorisert");
  }

  await prisma.blockedTime.delete({
    where: { id },
  });
}

export async function getServiceTypesPrisma() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) return [];

  return prisma.serviceType.findMany({
    where: { isActive: true },
    select: { id: true, name: true, color: true, duration: true },
    orderBy: { sortOrder: "asc" },
  });
}
