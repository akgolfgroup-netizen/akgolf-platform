import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { startOfMonth, endOfMonth } from "date-fns";
import { getBookingsForPeriod, getInstructors } from "./actions";
import KalenderClient from "./kalender-client";

export default async function CalendarPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const now = new Date();
  const start = startOfMonth(now);
  const end = endOfMonth(now);

  const [initialBookings, instructors] = await Promise.all([
    getBookingsForPeriod(start.toISOString(), end.toISOString()),
    getInstructors(),
  ]);

  return (
    <KalenderClient
      initialBookings={initialBookings}
      instructors={instructors}
    />
  );
}
