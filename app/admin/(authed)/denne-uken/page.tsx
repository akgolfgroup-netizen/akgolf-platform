import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getThisWeekBookings, getWeekStats } from "./actions";
import { ThisWeekClient } from "./this-week-client";

export const metadata = {
  title: "Denne uken | AK Golf CoachHQ",
};

export default async function DenneUkenPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const [bookings, stats] = await Promise.all([
    getThisWeekBookings(),
    getWeekStats(),
  ]);

  return <ThisWeekClient bookings={bookings} stats={stats} />;
}
