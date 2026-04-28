import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { startOfWeek, endOfWeek } from "date-fns";
import { getBookingsForPeriod, getInstructors } from "./actions";
import KalenderClient from "./kalender-client";

export const metadata = {
  title: "Kalender | AK Golf CoachHQ",
};

export default async function CalendarPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const now = new Date();
  const start = startOfWeek(now, { weekStartsOn: 1 });
  const end = endOfWeek(now, { weekStartsOn: 1 });

  const [initialBookings, instructors] = await Promise.all([
    getBookingsForPeriod(start.toISOString(), end.toISOString()),
    getInstructors(),
  ]);

  return (
    <KalenderClient
      initialBookings={initialBookings}
      instructors={instructors}
      initialWeekStart={start.toISOString()}
    />
  );
}
