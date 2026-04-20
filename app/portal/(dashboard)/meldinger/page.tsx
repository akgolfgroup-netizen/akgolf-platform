import { requirePortalUser } from "@/lib/portal/auth";
import { getMyConversations } from "./actions";
import { MeldingerChatClient } from "./meldinger-chat-client";
import { Icon } from "@/components/ui/icon";
import {
  MonoLabel,
  BentoGrid,
  BentoCard,
  BentoEyebrow,
  NightSurface,
  GlassPanel,
} from "@/components/portal/patterns";

export const metadata = {
  title: "Meldinger | AK Golf",
};

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  const conversations = await getMyConversations();

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <MonoLabel size="xs" uppercase className="block text-outline">
          Kommunikasjon
        </MonoLabel>
        <h1 className="text-2xl font-bold tracking-tight text-on-surface">
          Meldinger
        </h1>
        <p className="text-sm text-outline">
          Direkte meldinger med treneren din
        </p>
      </div>

      {/* Data-visualisering */}
      <NightSurface variant="ambient" className="rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <MonoLabel size="xs" uppercase>Inbox-statistikk</MonoLabel>
          <Icon name="analytics" size={20} className="text-on-surface" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <MonoLabel size="lg" className="text-primary font-bold">
              {conversations.length}
            </MonoLabel>
            <p className="text-xs text-surface/60 mt-1">Samtaler</p>
          </div>
          <div className="text-center">
            <MonoLabel size="lg" className="text-primary font-bold">
              {totalUnread}
            </MonoLabel>
            <p className="text-xs text-surface/60 mt-1">Uleste</p>
          </div>
        </div>
      </NightSurface>

      {/* Hovedinnhold */}
      <BentoGrid cols={1} gap="md">
        <BentoCard variant="light" padding="none" className="overflow-hidden">
          <div className="p-4 border-b border-outline-variant/10 flex items-center justify-between">
            <BentoEyebrow>Inbox</BentoEyebrow>
            <Icon name="chat" size={18} className="text-on-surface-variant" />
          </div>
          <MeldingerChatClient
            conversations={conversations}
            currentUserId={user.id}
          />
        </BentoCard>
      </BentoGrid>

      {/* Handlinger */}
      <GlassPanel variant="light" padding="md">
        <div className="flex items-center gap-4">
          <Icon name="info" size={24} className="text-primary" />
          <div>
            <h3 className="font-semibold text-on-surface">Meldinger</h3>
            <p className="text-sm text-outline">
              Svarer vanligvis innen 24 timer
            </p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
}
