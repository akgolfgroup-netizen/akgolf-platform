import { prisma } from "@/lib/portal/prisma";
import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { FacilityActivityStatus } from "@prisma/client";
import { GodkjenningerClient } from "./godkjenninger-client";

export const dynamic = "force-dynamic";

export default async function GodkjenningerPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  // Hent ventende bookinger
  const pendingBookings = await prisma.booking.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      ServiceType: {
        select: {
          name: true,
          price: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Hent ventende aktiviteter
  const pendingActivities = await prisma.facilityActivity.findMany({
    where: {
      status: FacilityActivityStatus.PENDING,
    },
    include: {
      Facility: {
        select: {
          name: true,
        },
      },
      CreatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedBookings = pendingBookings.map((b) => ({
    id: b.id,
    type: "booking" as const,
    studentName: b.User?.name ?? "Ukjent",
    studentEmail: b.User?.email ?? "",
    serviceName: b.ServiceType?.name ?? "Ukjent",
    price: b.ServiceType?.price ?? 0,
    requestedTime: b.startTime,
    createdAt: b.createdAt,
  }));

  const formattedActivities = pendingActivities.map((a) => ({
    id: a.id,
    type: "activity" as const,
    studentName: a.CreatedBy?.name ?? "Ukjent",
    studentEmail: a.CreatedBy?.email ?? "",
    serviceName: a.title,
    price: 0,
    requestedTime: a.startTime,
    createdAt: a.createdAt,
    facilityName: a.Facility?.name ?? "Ukjent fasilitet",
    activityType: a.activityType,
    conflictNote: a.conflictNote,
  }));

  const allPendingItems = [...formattedBookings, ...formattedActivities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
          Godkjenninger
        </h1>
        <p className="text-[15px] text-[var(--color-grey-500)] mt-1">
          {allPendingItems.length === 0
            ? "Ingen ventende godkjenninger"
            : `${allPendingItems.length} ventende godkjenning${allPendingItems.length === 1 ? "" : "er"}`}
        </p>
      </div>

      <GodkjenningerClient pendingItems={allPendingItems} />
    </div>
  );
}
