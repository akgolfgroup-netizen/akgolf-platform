import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getServiceTypes, getInstructors, getFacilities } from "../create-actions";
import { NyBookingClient } from "./ny-booking-client";

export const metadata = {
  title: "Ny Booking | AK Golf Mission Control",
};

export default async function NyBookingPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const [serviceTypes, instructors, facilities] = await Promise.all([
    getServiceTypes(),
    getInstructors(),
    getFacilities(),
  ]);

  return (
    <NyBookingClient
      serviceTypes={serviceTypes}
      instructors={instructors}
      facilities={facilities}
    />
  );
}
