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

  return (bookings || []).map((b) => ({
    id: b.id,
    startTime: new Date(b.startTime),
    endTime: new Date(b.endTime),
    status: b.status,
    student: { name: (b.User as { name: string | null }).name ?? null, email: (b.User as { email: string | null }).email ?? null },
    serviceType: { name: (b.ServiceType as { name: string }).name, color: (b.ServiceType as { color: string | null }).color, duration: (b.ServiceType as { duration: number }).duration },
    instructor: { id: (b.Instructor as { id: string }).id, user: { name: (b.Instructor as { User: { name: string | null } }).User?.name ?? null } },
    location: b.Location ? { name: (b.Location as { name: string }).name } : null,
    adminNotes: b.adminNotes,
  }));
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

  return (instructors || []).map((i) => ({
    id: i.id,
    user: { name: (i.User as { name: string | null }).name, image: (i.User as { image: string | null }).image },
  }));
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
