import { ConversationPanel } from "@/components/admin/meldinger/conversation-panel";
import { ContextPanel } from "@/components/admin/meldinger/context-panel";
import { InboxPanel } from "@/components/admin/meldinger/inbox-panel";
import {
  MOCK_CONVERSATION,
  MOCK_INBOX,
} from "@/components/admin/meldinger/mock-data";

// TODO: koble til ekte data
// - threads + messages: prisma + Supabase realtime
// - composer: server action -> ny melding via Twilio/Resend
// - context: spillerprofil, bookinger, foreldrekontakt fra Prisma

export default function MeldingerPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-6 pt-6 text-white">
      <div
        className="grid items-start gap-3.5"
        style={{
          gridTemplateColumns: "320px 1fr 280px",
          height: "calc(100vh - 120px)",
        }}
      >
        <InboxPanel rows={MOCK_INBOX} />
        <ConversationPanel bubbles={MOCK_CONVERSATION} />
        <ContextPanel />
      </div>
    </div>
  );
}
