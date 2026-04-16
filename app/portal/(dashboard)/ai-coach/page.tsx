import { requirePortalUser } from "@/lib/portal/auth";
import { getChatContext, getQuickInsight } from "./actions";
import { AiCoachDashboardClient } from "./ai-coach-dashboard-client";

export default async function AiCoachPage() {
  await requirePortalUser();

  const [context, quickInsight] = await Promise.all([
    getChatContext(),
    getQuickInsight(),
  ]);

  return <AiCoachDashboardClient context={context} quickInsight={quickInsight} />;
}
