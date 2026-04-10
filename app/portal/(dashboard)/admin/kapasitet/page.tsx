import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getCapacityData } from "./actions";
import { KapasitetClient } from "./kapasitet-client";

export default async function KapasitetPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const data = await getCapacityData();

  return <KapasitetClient data={data} />;
}
