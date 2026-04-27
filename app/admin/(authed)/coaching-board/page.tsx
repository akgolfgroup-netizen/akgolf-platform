import { redirect } from "next/navigation";
import { UserRole, Capability } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { fetchCoachingBoardData } from "./actions";
import { CoachingBoardClient } from "./coaching-board-client";

export const metadata = {
  title: "Aktive økter | AK Golf CoachHQ",
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

  const canPromote =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_APPROVE_CATEGORY_PROMOTION));
  const canEditPlan =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_EDIT_TRAINING_PLAN));
  const canRegisterTest =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.MB_REGISTER_TEST_RESULT));

  const data = await fetchCoachingBoardData();

  return (
    <CoachingBoardClient
      initialData={data}
      permissions={{
        canPromote,
        canEditPlan,
        canRegisterTest,
      }}
    />
  );
}
