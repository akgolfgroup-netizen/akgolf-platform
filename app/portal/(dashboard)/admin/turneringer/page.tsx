import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getTournaments } from "./actions";
import { TurneringerClient } from "./turneringer-client";

export default async function TurneringerPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const { tournaments, stats } = await getTournaments();

  return <TurneringerClient initialTournaments={tournaments} stats={stats} />;
}
