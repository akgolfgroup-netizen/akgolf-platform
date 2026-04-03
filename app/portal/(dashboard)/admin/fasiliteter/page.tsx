import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { FacilityCalendar } from "@/components/portal/admin/facility";
import { MapPin, Settings } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Fasiliteter | AK Golf Portal",
  description: "Oversikt over fasilitetbruk og aktiviteter",
};

export default async function FasiliteterPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  // Hent fasiliteter
  const facilities = await prisma.facility.findMany({
    where: { isActive: true },
    include: {
      Location: {
        select: { id: true, name: true },
      },
    },
    orderBy: [{ Location: { name: "asc" } }, { sortOrder: "asc" }],
  });

  // Hent antall ventende aktiviteter
  const pendingCount = await prisma.facilityActivity.count({
    where: { status: "PENDING" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
            Fasiliteter
          </h1>
          <p className="text-sm text-[var(--color-grey-500)] mt-1">
            Oversikt over fasilitetbruk, aktiviteter og bookinger
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Pending badge */}
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF9500]/10 text-[#FF9500] text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF9500] animate-pulse" />
              {pendingCount} venter på godkjenning
            </div>
          )}

          {/* Settings link */}
          <Link
            href="/portal/admin/fasiliteter/innstillinger"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--color-grey-200)] text-[var(--color-grey-600)] text-sm font-medium hover:border-[var(--color-grey-400)] hover:text-[var(--color-grey-900)] transition-[border-color,color]"
          >
            <Settings className="w-4 h-4" />
            Innstillinger
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {facilities.slice(0, 4).map((facility) => (
          <div
            key={facility.id}
            className="p-4 rounded-xl bg-white border border-[var(--color-grey-200)]"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[var(--color-grey-400)]" />
              <span className="text-sm font-medium text-[var(--color-grey-900)]">
                {facility.name}
              </span>
            </div>
            <p className="text-xs text-[var(--color-grey-500)]">
              Kapasitet: {facility.capacity ?? "—"} personer
            </p>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <FacilityCalendar initialFacilities={facilities} />
    </div>
  );
}
