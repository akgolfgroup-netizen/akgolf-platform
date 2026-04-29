import { redirect } from "next/navigation";
import { UserRole, Capability } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { fetchCoachingBoardData } from "./actions";
import { CoachingBoardDarkClient } from "./coaching-board-dark-client";

export const metadata = {
  title: "Coaching Board | AK Golf CoachHQ",
};
export const dynamic = "force-dynamic";

export default async function CoachingBoardPage() {
  const user = await requirePortalUser();

  const canView =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_VIEW_OWN_PLAYERS)) ||
    (await hasCapability(user.id, Capability.MB_VIEW_ALL_PLAYERS));

  if (!canView) {
    redirect("/admin");
  }

  const data = await fetchCoachingBoardData();

  return (
    <CoachingBoardDarkClient
      user={user}
      weekSessionCount={data.players.length}
    />
  );
}
