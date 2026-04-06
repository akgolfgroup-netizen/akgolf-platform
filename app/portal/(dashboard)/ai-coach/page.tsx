import { requirePortalUser } from "@/lib/portal/auth";
import { getChatContext, getQuickInsight } from "./actions";
import { AiCoachClient } from "./ai-coach-client";

export default async function AiCoachPage() {
  await requirePortalUser();

  const [context, quickInsight] = await Promise.all([
    getChatContext(),
    getQuickInsight(),
  ]);

  return <AiCoachClient context={context} quickInsight={quickInsight} />;
}
