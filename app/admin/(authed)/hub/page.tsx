import { requirePortalUser } from "@/lib/portal/auth";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark/CoachHQDarkShell";
import { HubClient } from "./hub-client";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Hub-oversikt | AK Golf CoachHQ",
};

export default async function HubPage() {
  const user = await requirePortalUser();

  const userForShell = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return (
    <CoachHQDarkShell user={userForShell} title="CoachHQ Hub" meta="ALL DRIFT EN PLASS">
      <HubClient userName={user.name ?? "coach"} />
    </CoachHQDarkShell>
  );
}
