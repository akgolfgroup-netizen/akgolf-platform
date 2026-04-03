import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getInstructors } from "../kalender/actions";
import { AvailabilityManager } from "@/components/portal/admin/availability-manager";
import { ADMIN_CONTENT } from "@/lib/website-constants";
import { AppleCard } from "@/components/portal/apple/apple-card";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const instructors = await getInstructors();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F8FC] via-[#F0F4F8] to-[#F5F5F7]">
      <div className="max-w-[1200px] mx-auto p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-grey-900)] to-[var(--color-grey-700)] flex items-center justify-center shadow-lg shadow-[var(--color-grey-900)]/20">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-display text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
                Tilgjengelighet
              </h1>
              <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
                {ADMIN_CONTENT.kalender.setupGuide.description}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <AppleCard variant="glass" padding="lg" hover={false}>
          <AvailabilityManager instructors={instructors} />
        </AppleCard>
      </div>
    </div>
  );
}
