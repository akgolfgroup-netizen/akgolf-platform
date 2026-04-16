import { requirePortalUser } from "@/lib/portal/auth";
import { getChatContext, getQuickInsight } from "./actions";
import { AiCoachChatClient } from "./ai-coach-chat-client";

export const metadata = {
  title: "AI Coach | AK Golf",
  description: "Din personlige AI-drevne golfcoach",
};

export default async function AiCoachPage() {
  await requirePortalUser();

  const [context, quickInsight] = await Promise.all([
    getChatContext(),
    getQuickInsight(),
  ]);

  return (
    <AiCoachChatClient 
      context={context} 
      quickInsight={quickInsight} 
    />
  );
}
