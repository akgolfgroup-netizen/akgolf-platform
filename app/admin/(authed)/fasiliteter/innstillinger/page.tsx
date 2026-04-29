import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getAllFacilities, getInstructorFacilityDefaults } from "../actions-legacy";
import { InnstillingerClient } from "./innstillinger-client";

export default async function FasilitetInnstillingerPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const [facilities, defaults] = await Promise.all([
    getAllFacilities(),
    getInstructorFacilityDefaults(),
  ]);

  const serializedFacilities = facilities.map((f) => ({
    id: f.id,
    name: f.name,
    locationName: f.Location?.name ?? "Ukjent",
    capacity: f.capacity,
    isActive: f.isActive,
  }));

  const serializedDefaults = defaults.map((d) => ({
    id: d.id,
    instructorName: d.Instructor?.User?.name ?? "Ukjent",
    facilityName: d.Facility?.name ?? "Ukjent",
    serviceType: d.ServiceType?.name ?? null,
    priority: d.priority,
  }));

  return (
    <InnstillingerClient
      facilities={serializedFacilities}
      defaults={serializedDefaults}
    />
  );
}
