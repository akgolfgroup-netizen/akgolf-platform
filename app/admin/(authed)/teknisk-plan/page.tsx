import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import {
  getTechnicalPlansForAdmin,
  getPlayerOptions,
  getDrillOptions,
} from "./actions";
import { TekniskPlanClient } from "./teknisk-plan-client";

export const metadata = { title: "Teknisk Plan — CoachHQ" };
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ planId?: string; playerId?: string }>;
}

export default async function TekniskPlanPage({ searchParams }: PageProps) {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const params = await searchParams;
  const [plans, players, drills] = await Promise.all([
    getTechnicalPlansForAdmin(),
    getPlayerOptions(),
    getDrillOptions(),
  ]);

  return (
    <TekniskPlanClient
      plans={plans}
      players={players}
      drills={drills}
      initialPlanId={params.planId}
      initialPlayerId={params.playerId}
    />
  );
}
