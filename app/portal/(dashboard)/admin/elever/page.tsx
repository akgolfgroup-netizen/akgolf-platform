import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { StudentList } from "@/components/portal/admin/student-list";

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2950]">Elever</h1>
        <p className="text-sm text-gray-500 mt-1">
          Oversikt over alle elever med booking- og coachinghistorikk
        </p>
      </div>
      <StudentList />
    </div>
  );
}
