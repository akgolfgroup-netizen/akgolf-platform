import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getFacilities } from "../actions";
import { NyAktivitetClient } from "./ny-aktivitet-client";

export default async function NyAktivitetPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const facilities = await getFacilities();
  const serialized = facilities.map((f) => ({
    id: f.id,
    name: f.name,
    locationName: f.Location?.name ?? null,
  }));

  return <NyAktivitetClient facilities={serialized} />;
}
