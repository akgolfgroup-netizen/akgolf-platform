import { requirePortalUser } from "@/lib/portal/auth";
import { getMyConversations } from "./actions";
import { MeldingerChatClient } from "./meldinger-chat-client";
import { PremiumCard } from "@/components/portal/dashboard/premium-card";

export const metadata = {
  title: "Meldinger | AK Golf",
};

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  const conversations = await getMyConversations();

  return (
    <PremiumCard>
      <div className="mb-4">
        <h1 className="text-xl font-bold text-portal-text">
          Meldinger
        </h1>
        <p className="text-sm text-portal-secondary mt-1">
          Direkte meldinger med treneren din
        </p>
      </div>
      <MeldingerChatClient
        conversations={conversations}
        currentUserId={user.id}
      />
    </PremiumCard>
  );
}
