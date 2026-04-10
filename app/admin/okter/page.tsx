import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getSessionOverview } from "./actions";
import { OkterClient } from "./okter-client";

export default async function OkterPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const { sessions, stats } = await getSessionOverview();

  return <OkterClient initialSessions={sessions} stats={stats} />;
}
