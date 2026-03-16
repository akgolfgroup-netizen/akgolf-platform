import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getInstructors } from "./actions";
import { AdminCalendar } from "@/components/portal/admin/admin-calendar";

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
        <h1 className="text-2xl font-bold text-[#0F2950]">Kalender</h1>
        <p className="text-sm text-gray-500 mt-1">
          Oversikt over alle bookinger
        </p>
      </div>
      <AdminCalendar instructors={instructors} />
    </div>
  );
}
