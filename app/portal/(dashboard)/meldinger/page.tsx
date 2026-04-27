import { requirePortalUser } from "@/lib/portal/auth";
import { getMyConversations } from "./actions";
import { MeldingerV2Client } from "@/components/portal/meldinger/v2/meldinger-v2-client";

export const metadata = {
  title: "Meldinger | AK Golf",
};

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  const conversations = await getMyConversations();
  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-5 pb-12">
      <header className="space-y-1.5">
        <div
          className="font-mono text-[11px] font-semibold uppercase"
          style={{ color: "#D1F843", letterSpacing: "0.16em" }}
        >
          Min side · Meldinger
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Meldinger
        </h1>
        <p className="text-sm text-on-surface-variant">
          {totalUnread > 0
            ? `${totalUnread} ulest${totalUnread === 1 ? "" : "e"} · ${conversations.length} aktive tråder`
            : `${conversations.length} aktive tråder`}
        </p>
      </header>

      <MeldingerV2Client
        conversations={conversations.map((c) => ({
          ...c,
          lastMessageAt: c.lastMessageAt ?? null,
        }))}
        currentUserId={user.id}
      />
    </div>
  );
}
