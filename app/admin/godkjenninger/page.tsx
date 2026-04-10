import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getPendingItems } from "./actions";
import { GodkjenningerClient } from "./godkjenninger-client";

export default async function GodkjenningerPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  const { pendingBookings, pendingActivities } = await getPendingItems();

  const pendingItems = [
    ...pendingBookings.map((b) => ({
      id: b.id,
      type: "booking" as const,
      studentName: b.User.name ?? "Ukjent",
      studentEmail: b.User.email ?? "",
      serviceName: b.ServiceType.name,
      price: b.ServiceType.price,
      requestedTime: b.startTime,
      createdAt: b.createdAt,
    })),
    ...pendingActivities.map((a) => ({
      id: a.id,
      type: "activity" as const,
      studentName: a.CreatedBy.name ?? "Ukjent",
      studentEmail: a.CreatedBy.email ?? "",
      serviceName: a.title,
      price: 0,
      requestedTime: a.startTime,
      createdAt: a.createdAt,
      facilityName: a.Facility.name,
      activityType: a.activityType,
      conflictNote: a.conflictNote,
    })),
  ];

  return <GodkjenningerClient pendingItems={pendingItems} />;
}
