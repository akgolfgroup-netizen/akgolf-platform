import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getElevOversikt } from "./actions";
import { ElevOversiktClient } from "./elev-oversikt-client";

export const metadata = {
  title: "Elev-oversikt | AK Golf CoachHQ",
};

export const dynamic = "force-dynamic";

export default async function ElevOversiktPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const rows = await getElevOversikt();

  return <ElevOversiktClient rows={rows} />;
}
