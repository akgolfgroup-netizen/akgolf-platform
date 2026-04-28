import { ChatArea } from "@/components/admin/ai-assistent/chat-area";
import { ConversationSidebar } from "@/components/admin/ai-assistent/conversation-sidebar";
import { ContextPanel } from "@/components/admin/ai-assistent/context-panel";

// TODO: koble til ekte data
// - conversations: prisma.aiConversation.findMany med messages
// - context: lib/portal/ai/coach-copilot.ts mot Anthropic Claude
// - tools: opprette tasks, sende meldinger, hente spiller-data

export default function AiAssistentPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-6 pt-6 text-white">
      <div
        className="grid items-start gap-3.5"
        style={{
          gridTemplateColumns: "260px 1fr 280px",
          height: "calc(100vh - 120px)",
        }}
      >
        <ConversationSidebar />
        <ChatArea />
        <ContextPanel />
      </div>
    </div>
  );
}
