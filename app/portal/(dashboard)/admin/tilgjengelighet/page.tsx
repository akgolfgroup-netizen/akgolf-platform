import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getInstructors } from "../kalender/actions";
import { AvailabilityManager } from "@/components/portal/admin/availability-manager";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const instructors = await getInstructors();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2950]">Tilgjengelighet</h1>
        <p className="text-sm text-gray-500 mt-1">
          Sett faste tider og blokkert tid for instruktorer
        </p>
      </div>
      <AvailabilityManager instructors={instructors} />
    </div>
  );
}
