import { redirect } from "next/navigation";
import { UserRole, Capability } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { fetchTeamMembers, listPresets } from "./actions";
import { TeamClient } from "./team-client";

export const metadata = {
  title: "Team | AK Golf CoachHQ",
};
export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const user = await requirePortalUser();

  const canView =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.USERS_VIEW));
  if (!canView) {
    redirect("/admin");
  }

  const canAssign =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.USERS_ASSIGN_CAPABILITIES));
  const canAssignRole =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.USERS_ASSIGN_ROLE));
  const canDeactivate =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.USERS_DEACTIVATE));

  const [members, presets] = await Promise.all([
    fetchTeamMembers(),
    listPresets(),
  ]);

  return (
    <TeamClient
      initialMembers={members}
      presets={presets}
      permissions={{
        canAssignCapabilities: canAssign,
        canAssignRole,
        canDeactivate,
      }}
    />
  );
}
