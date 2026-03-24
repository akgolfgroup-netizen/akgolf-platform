import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getInstructors } from "./actions";
import { AdminCalendar } from "@/components/portal/admin/admin-calendar";
import { ADMIN_CONTENT } from "@/lib/website-constants";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const instructors = await getInstructors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-snow)]">Kalender</h1>
        <p className="text-sm text-[var(--color-ink-40)] mt-1">
          Oversikt over alle bookinger
        </p>
      </div>
      <AdminCalendar instructors={instructors} />
    </div>
  );
}
