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

  const betaBanner = (
    <div
      className="mb-4 rounded-xl px-4 py-3 flex items-start gap-3"
      style={{
        background: "rgba(209,248,67,0.08)",
        border: "1px solid rgba(209,248,67,0.24)",
      }}
    >
      <span
        className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
        style={{ background: "var(--color-accent)", color: "#0A1F18" }}
      >
        Beta
      </span>
      <p className="text-sm text-ink-muted">
        AI Coach er under utvikling. Du ser foreløpig en forhåndsvisning av
        hvordan din personlige AI-trener vil fungere. Full integrasjon med
        spillerdata og treningsplan kommer snart.
      </p>
    </div>
  );

  if (params.v === "2") {
    return (
      <>
        {betaBanner}
        <AiCoachV2Client context={context} quickInsight={quickInsight} />
      </>
    );
  }

  return (
    <>
      {betaBanner}
      <AiCoachChatClient context={context} quickInsight={quickInsight} />
    </>
  );
}
