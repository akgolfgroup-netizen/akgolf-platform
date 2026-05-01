import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { TechnicalPlanPlayerClient } from "./technical-plan-player-client";

export const metadata: Metadata = {
  title: "Teknisk Plan | AK Golf Group",
  description: "Din individuelle tekniske utviklingsplan",
};

export const dynamic = "force-dynamic";

export default async function TechnicalPlanPlayerPage() {
  const user = await requirePortalUser();

  return <TechnicalPlanPlayerClient userId={user.id} userName={user.name} />;
}
