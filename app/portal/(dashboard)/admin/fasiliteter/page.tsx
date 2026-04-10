import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getFacilities, getTodaySchedule, getTodayBookingCounts } from "./actions";
import FasiliteterClient from "./fasiliteter-client";

export default async function FasiliteterPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const [facilities, todaySchedule, bookingCounts] = await Promise.all([
    getFacilities(),
    getTodaySchedule(),
    getTodayBookingCounts(),
  ]);

  // Serialiser datoer for klientkomponent
  const serializedSchedule = todaySchedule.map((item) => ({
    id: item.id,
    facilityId: item.facilityId,
    title: item.title,
    description: item.description,
    activityType: item.activityType,
    startTime: item.startTime.toISOString(),
    endTime: item.endTime.toISOString(),
    status: item.status,
    color: item.color,
    Facility: { id: item.Facility.id, name: item.Facility.name },
    CreatedBy: {
      id: item.CreatedBy.id,
      name: item.CreatedBy.name,
      email: item.CreatedBy.email,
    },
  }));

  return (
    <FasiliteterClient
      facilities={facilities}
      todaySchedule={serializedSchedule}
      bookingCounts={bookingCounts}
    />
  );
}
