import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { ChatClient } from "./chat-client";
import { Bot } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AiAssistentPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isStaff(user.role)) {
    redirect("/");
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--color-grey-100)] flex items-center justify-center">
            <Bot className="w-5 h-5 text-[var(--color-grey-900)]" />
          </div>
          <div>
            <h1 className="text-[32px] font-bold text-[var(--color-grey-900)] tracking-[-0.02em]">
              AI-assistent
            </h1>
            <p className="text-[15px] text-[var(--color-grey-500)] mt-0.5">
              Spør om spillere, statistikk, treningsplaner og mer
            </p>
          </div>
        </div>
      </div>

      <ChatClient />
    </div>
  );
}
