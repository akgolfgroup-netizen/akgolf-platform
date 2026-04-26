import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getAgents, getAgentStats } from "./actions";
import { AgenterClient } from "./agenter-client";

export const metadata = {
  title: "AI Agenter | AK Golf CoachHQ",
};

export default async function AgenterPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const [agents, stats] = await Promise.all([getAgents(), getAgentStats()]);

  return <AgenterClient agents={agents} stats={stats} />;
}
