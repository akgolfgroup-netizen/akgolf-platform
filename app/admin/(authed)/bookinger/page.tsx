import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { format, getISOWeek, startOfWeek, endOfWeek } from "date-fns";
import { createServerSupabase } from "@/lib/supabase/server";
import { BookingerClient } from "@/components/admin/bookinger/bookinger-client";
import type { BookingStat } from "@/components/admin/bookinger/booking-types";
import {
  groupBookingsByDay,
  computeStats,
  coachFilters,
} from "./bookinger-data";
import type { AdminBooking } from "./actions";

export const metadata = {
  title: "Bookinger | AK Golf CoachHQ",
};

async function loadBookings(): Promise<AdminBooking[]> {
  const supabase = await createServerSupabase();
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 35);
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14);

  const { data } = await supabase
    .from("Booking")
    .select(
      "*, User:studentId(name, email, phone), ServiceType:serviceTypeId(name, color, duration), Instructor:instructorId(User(name)), Location:locationId(name)",
    )
    .gte("startTime", start.toISOString())
    .lte("startTime", end.toISOString())
    .order("startTime", { ascending: true });

  return (data ?? []) as AdminBooking[];
}

export default async function AdminBookingerPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const bookings = await loadBookings();
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  const weekBookings = bookings.filter((b) => {
    const t = new Date(b.startTime);
    return t >= weekStart && t <= weekEnd;
  });

  const groups = groupBookingsByDay(weekBookings, now);
  const computed = computeStats(bookings, now);
  const coaches = coachFilters(weekBookings);
  const todayCount = groups
    .filter((g) => g.label.startsWith("I DAG"))
    .reduce((s, g) => s + g.count, 0);
  const totalCount = weekBookings.filter((b) => b.status !== "CANCELLED").length;

  const stats: BookingStat[] = [
    { label: "I dag", value: String(computed.todayCount), tone: "default" },
    { label: "Denne uken", value: String(computed.weekCount), tone: "default" },
    { label: "Pending", value: String(computed.pendingCount), tone: "warning" },
    { label: "Avlyst 30d", value: String(computed.cancelledLast30), tone: "danger" },
    { label: "No-show 30d", value: String(computed.noShowLast30), tone: "danger" },
  ];

  const weekLabel = `Uke ${getISOWeek(now)}`;
  void format;

  return (
    <BookingerClient
      groups={groups}
      stats={stats}
      coaches={coaches}
      totalCount={totalCount}
      todayCount={todayCount}
      pendingCount={computed.pendingCount}
      weekLabel={weekLabel}
    />
  );
}
