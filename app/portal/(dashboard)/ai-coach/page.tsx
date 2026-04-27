import { requirePortalUser } from "@/lib/portal/auth";
import { getChatContext, getQuickInsight } from "./actions";
import { AiCoachChatClient } from "./ai-coach-chat-client";
import { AiCoachV2Client } from "@/components/portal/ai-coach/v2/ai-coach-v2-client";

export const metadata = {
  title: "AI Coach | AK Golf",
  description: "Din personlige AI-drevne golfcoach",
};

interface AiCoachPageProps {
  searchParams: Promise<{ v?: string }>;
}

export default async function AiCoachPage({ searchParams }: AiCoachPageProps) {
  await requirePortalUser();
  const params = await searchParams;

  const [context, quickInsight] = await Promise.all([
    getChatContext(),
    getQuickInsight(),
  ]);

  if (params.v === "2") {
    return <AiCoachV2Client context={context} quickInsight={quickInsight} />;
  }

  return (
    <AiCoachChatClient context={context} quickInsight={quickInsight} />
  );
}
