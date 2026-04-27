"use client";

import { useEffect, useState, useTransition } from "react";
import { Inbox } from "lucide-react";
import type { ConversationSummary } from "@/app/portal/(dashboard)/meldinger/actions";
import {
  getConversationMessages,
  markConversationAsRead,
  sendDirectMessage,
} from "@/app/portal/(dashboard)/meldinger/actions";
import { ThreadList } from "./thread-list";
import { ConversationPane, type ChatMessage } from "./conversation-pane";
import { ContextPanel } from "./context-panel";

interface MeldingerV2ClientProps {
  conversations: ConversationSummary[];
  currentUserId: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

export function MeldingerV2Client({
  conversations: initialConversations,
  currentUserId,
}: MeldingerV2ClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(
    initialConversations[0]?.id ?? null,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSending, setIsSending] = useState(false);

  const selected = conversations.find((c) => c.id === selectedId) ?? null;

  useEffect(() => {
    if (!selectedId) return;
    startTransition(async () => {
      const msgs = await getConversationMessages(selectedId);
      setMessages(msgs);
      await markConversationAsRead(selectedId);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c)),
      );
    });
  }, [selectedId]);

  async function handleSend() {
    if (!selectedId || !newMessage.trim() || isSending) return;
    const content = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      senderName: "Deg",
      senderImage: null,
      content,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await sendDirectMessage(selectedId, content);
      if (res.success) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === selectedId
              ? { ...c, lastMessage: content, lastMessageAt: new Date() }
              : c,
          ),
        );
        const updated = await getConversationMessages(selectedId);
        setMessages(updated);
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
        setNewMessage(content);
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setNewMessage(content);
    } finally {
      setIsSending(false);
    }
  }

  if (initialConversations.length === 0) {
    return (
      <div
        className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center gap-3 rounded-2xl px-6 py-16 text-center"
        style={{
          background: "#0D2E23",
          border: "1px solid #1A4A3A",
          color: "rgba(255,255,255,0.7)",
        }}
      >
        <Inbox className="h-10 w-10 opacity-60" style={{ color: "#D1F843" }} />
        <p className="text-base font-semibold text-white">
          Ingen meldinger ennå
        </p>
        <p className="text-sm">
          Meldinger fra coachen din dukker opp her.
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid overflow-hidden rounded-2xl"
      style={{
        height: "calc(100vh - 96px)",
        gridTemplateColumns: "320px 1fr 300px",
        border: "1px solid #1A4A3A",
      }}
    >
      <ThreadList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />
      {selected ? (
        <ConversationPane
          participantName={selected.participantName}
          initials={initials(selected.participantName)}
          messages={messages}
          currentUserId={currentUserId}
          newMessage={newMessage}
          onChange={setNewMessage}
          onSend={handleSend}
          isLoading={isPending}
          isSending={isSending}
        />
      ) : (
        <div
          className="flex items-center justify-center text-sm"
          style={{
            background: "#102B1E",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Velg en samtale for å se meldinger
        </div>
      )}
      {selected ? (
        <ContextPanel
          participantName={selected.participantName}
          initials={initials(selected.participantName)}
          role="Coach"
          meta={[
            { label: "Siden", value: "Mar 2024" },
            { label: "Økter totalt", value: "—" },
            { label: "Neste økt", value: "Se kalender" },
          ]}
        />
      ) : (
        <div
          className="hidden lg:block"
          style={{
            background: "#0A1F18",
            borderLeft: "1px solid rgba(255,255,255,0.05)",
          }}
        />
      )}
    </div>
  );
}
