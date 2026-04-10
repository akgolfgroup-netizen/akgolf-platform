import { requirePortalUser } from "@/lib/portal/auth";
import { getMyConversations } from "./actions";
import { MeldingerChatClient } from "./meldinger-chat-client";

export const metadata = {
  title: "Meldinger | AK Golf",
};

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  const conversations = await getMyConversations();

  return (
    <div className="p-4 sm:p-6 h-full">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-[var(--color-grey-900)]">
          Meldinger
        </h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          Direkte meldinger med treneren din
        </p>
      </div>
      <MeldingerChatClient
        conversations={conversations}
        currentUserId={user.id}
      />
    </div>
  );
}
