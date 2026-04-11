"use server";

import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { isStaff } from "@/lib/portal/rbac";
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from "date-fns";

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
