import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { StudentList } from "@/components/portal/admin/student-list";
import { ADMIN_CONTENT } from "@/lib/website-constants";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-snow)]">Elever</h1>
        <p className="text-sm text-[var(--color-ink-40)] mt-1">
          Oversikt over alle elever med booking- og coachinghistorikk
        </p>
      </div>
      <StudentList />
    </div>
  );
}
