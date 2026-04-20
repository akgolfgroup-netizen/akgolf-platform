"use client";

import { Icon } from "@/components/ui/icon";
import { useState, useEffect, useRef, useTransition } from "react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { AdminEmptyState } from "@/components/portal/mission-control/ui";
import { MonoLabel, GlassPanel } from "@/components/portal/patterns";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { ConversationSummary, ChatMessage } from "./chat-actions";
import {
  getConversationMessages,
  sendDirectMessage,
  markConversationAsRead,
} from "./chat-actions";

interface AdminChatClientProps {
  conversations: ConversationSummary[];
  currentUserId: string;
}

function getInitials(name: string): string {
  return name
    .split("")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminChatClient({
  conversations: initialConversations,
  currentUserId,
}: AdminChatClientProps) {
  const { toggle } = useMCSidebar();
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const filteredConversations = conversations.filter((conv) =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Last meldinger når samtale velges
  useEffect(() => {
    if (!selectedId) return;

    startTransition(async () => {
      const msgs = await getConversationMessages(selectedId);
      setMessages(msgs);

      await markConversationAsRead(selectedId);
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c))
      );
    });
  }, [selectedId]);

  // Scroll til bunnen ved nye meldinger
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!selectedId || !newMessage.trim() || isSending) return;

    const content = newMessage.trim();
    setNewMessage("");
    setIsSending(true);

    // Optimistisk oppdatering
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      senderName: "Deg",
      content,
      createdAt: new Date(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimistic]);

    const result = await sendDirectMessage(selectedId, content);

    if (result.success) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, lastMessage: content, lastMessageAt: new Date() }
            : c
        )
      );
      const updated = await getConversationMessages(selectedId);
      setMessages(updated);
    } else {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setNewMessage(content);
    }

    setIsSending(false);
  }

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  );

  return (
    <>
      <MCTopbar
        title="Meldinger"
        subtitle={
          totalUnread > 0
            ? `${totalUnread} uleste meldinger`
            : "Direktemeldinger med elever"
        }
        onMenuClick={toggle}
      />

      <div className="p-6">
        <GlassPanel
          variant="light"
          padding="none"
          className="overflow-hidden"
          style={{ minHeight: "calc(100vh - 180px)" }}
        >
          <div className="flex h-full">
            {/* Sidebar — Samtaleliste */}
            <div
              className={cn(
                "w-full lg:w-80 border-r border-outline-variant/30 flex flex-col",
                selectedId && "hidden lg:flex"
              )}
            >
              {/* Søk */}
              <div className="p-3 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-surface border border-outline-variant/30 rounded-lg px-3 py-2 focus-within:border-on-surface focus-within:ring-1 focus-within:ring-on-surface/20 transition-all">
                    <Icon name="search" className="w-4 h-4 text-on-surface-variant" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Søk i samtaler..."
                      className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Samtaler */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-sm text-on-surface-variant/80">
                      {searchQuery
                        ? "Ingen treff"
                        : "Ingen samtaler ennå"}
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedId(conv.id)}
                      className={cn(
                        "w-full p-3 flex items-start gap-3 text-left hover:bg-surface-container transition-colors border-b border-outline-variant/20 cursor-pointer",
                        selectedId === conv.id && "bg-surface-container"
                      )}
                    >
                      <div className="w-9 h-9 rounded-full bg-on-surface/10 text-on-surface text-xs font-semibold flex items-center justify-center shrink-0">
                        {getInitials(conv.participantName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm truncate text-on-surface",
                              conv.unreadCount > 0 && "font-semibold"
                            )}
                          >
                            {conv.participantName}
                          </span>
                        </div>
                        <p
                          className={cn(
                            "text-xs truncate mt-0.5",
                            conv.unreadCount > 0
                              ? "text-on-surface"
                              : "text-on-surface-variant/80"
                          )}
                        >
                          {conv.lastMessage ?? "Ingen meldinger ennå"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {conv.lastMessageAt && (
                          <MonoLabel
                            size="xs"
                            className="text-on-surface-variant/80 whitespace-nowrap"
                          >
                            {formatDistanceToNow(
                              new Date(conv.lastMessageAt),
                              { addSuffix: true, locale: nb }
                            )}
                          </MonoLabel>
                        )}
                        {conv.unreadCount > 0 && (
                          <span className="w-5 h-5 rounded-full bg-on-surface text-surface text-[10px] font-semibold flex items-center justify-center">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat-vindu */}
            <div
              className={cn(
                "flex-1 flex flex-col",
                !selectedId && "hidden lg:flex"
              )}
            >
              {selectedId && selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-outline-variant/30 flex items-center gap-3 bg-surface-container-lowest">
                    <button
                      onClick={() => setSelectedId(null)}
                      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-surface-container cursor-pointer"
                      aria-label="Tilbake"
                    >
                      <Icon name="chevron_left" className="w-5 h-5 text-on-surface" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-on-surface/10 text-on-surface text-xs font-semibold flex items-center justify-center">
                      {getInitials(selectedConversation.participantName)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-on-surface">
                        {selectedConversation.participantName}
                      </h3>
                    </div>
                  </div>

                  {/* Meldinger */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-surface">
                    {isPending && messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-on-surface-variant/80">
                        <p className="text-sm">Laster meldinger...</p>
                      </div>
                    ) : (
                      messages.map((msg) => {
                        const isMe = msg.senderId === currentUserId;
                        return (
                          <div
                            key={msg.id}
                            className={cn(
                              "flex gap-3",
                              isMe ? "flex-row-reverse" : ""
                            )}
                          >
                            <div className="w-8 h-8 rounded-full bg-on-surface/10 text-on-surface text-[10px] font-semibold flex items-center justify-center shrink-0">
                              {isMe
                                ? "ME"
                                : getInitials(msg.senderName)}
                            </div>
                            <div
                              className={cn(
                                "max-w-[70%] p-3 rounded-2xl text-sm",
                                isMe
                                  ? "bg-on-surface text-surface rounded-tr-sm"
                                  : "bg-surface-container text-on-surface rounded-tl-sm"
                              )}
                            >
                              <p className="whitespace-pre-wrap">
                                {msg.content}
                              </p>
                              <div
                                className={cn(
                                  "mt-1 flex items-center gap-1",
                                  isMe
                                    ? "text-surface/70"
                                    : "text-on-surface-variant/80"
                                )}
                              >
                                <MonoLabel size="xs">
                                  {new Date(msg.createdAt).toLocaleTimeString(
                                    "nb-NO",
                                    { hour: "2-digit", minute: "2-digit" }
                                  )}
                                </MonoLabel>
                                {isMe && msg.readAt && (
                                  <Icon name="check" className="w-3 h-3" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-outline-variant/30 bg-surface-container-lowest">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                      }}
                      className="flex items-end gap-2 bg-surface border border-outline-variant/30 rounded-xl p-2 focus-within:border-on-surface focus-within:ring-1 focus-within:ring-on-surface/20 transition-all"
                    >
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Skriv en melding..."
                        rows={1}
                        disabled={isSending}
                        className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant outline-none resize-none py-2"
                        style={{ minHeight: "20px", maxHeight: "100px" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="p-2 rounded-lg bg-on-surface text-surface hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                        aria-label="Send melding"
                      >
                        <Icon name="send" className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-surface">
                  <AdminEmptyState
                    icon={<Icon name="chat" className="w-6 h-6" />}
                    title="Velg en samtale"
                    description="Klikk på en samtale i listen for å se meldinger og svare"
                  />
                </div>
              )}
            </div>
          </div>
        </GlassPanel>
      </div>
    </>
  );
}
