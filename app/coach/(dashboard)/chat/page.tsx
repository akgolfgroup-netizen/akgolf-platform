import { requirePortalUser } from "@/lib/portal/auth";
import { ChatClient } from "./chat-client";

export default async function ChatPage() {
  await requirePortalUser();

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-white">AI Coach Assistent</h1>
        <p className="text-[var(--color-ink-40)] mt-1">
          Spor om spillere, statistikk, treningsplaner og mer
        </p>
      </div>

      <ChatClient />
    </div>
  );
}
