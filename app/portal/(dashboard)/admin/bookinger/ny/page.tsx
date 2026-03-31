import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { AdminCreateBookingForm } from "@/components/portal/admin/admin-create-booking-form";

export const dynamic = "force-dynamic";

export default async function AdminNewBookingPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const [serviceTypes, instructors] = await Promise.all([
    prisma.serviceType.findMany({
      where: { isActive: true },
      select: { id: true, name: true, duration: true, price: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.instructor.findMany({
      select: { id: true, User: { select: { name: true } } },
      orderBy: { User: { name: "asc" } },
    }),
  ]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Opprett booking
        </h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          Book pa vegne av en kunde
        </p>
      </div>
      <AdminCreateBookingForm
        serviceTypes={serviceTypes}
        instructors={instructors.map((i) => ({ id: i.id, user: { name: i.User?.name ?? null } }))}
      />
    </div>
  );
}
