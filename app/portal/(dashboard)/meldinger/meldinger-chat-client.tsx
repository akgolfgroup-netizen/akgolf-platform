"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { MessageSquare, Send, ArrowLeft, Inbox } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { ConversationSummary } from "./actions";
import {
  getConversationMessages,
  sendDirectMessage,
  markConversationAsRead,
} from "./actions";

type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage: string | null;
  createdAt: string;
  readAt: string | null;
};

interface MeldingerChatClientProps {
  conversations: ConversationSummary[];
  currentUserId: string;
}

export function MeldingerChatClient({
  conversations: initialConversations,
  currentUserId,
}: MeldingerChatClientProps) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  // Last meldinger når samtale velges
  useEffect(() => {
    if (!selectedId) return;

    startTransition(async () => {
      const msgs = await getConversationMessages(selectedId);
      setMessages(msgs);

      // Marker som lest
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
    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: currentUserId,
      senderName: "Deg",
      senderImage: null,
      content,
      createdAt: new Date().toISOString(),
      readAt: null,
    };
    setMessages((prev) => [...prev, optimisticMessage]);

    const result = await sendDirectMessage(selectedId, content);

    if (result.success) {
      // Oppdater samtalelisten
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId
            ? { ...c, lastMessage: content, lastMessageAt: new Date() }
            : c
        )
      );
      // Last meldinger på nytt for å få riktig ID
      const updated = await getConversationMessages(selectedId);
      setMessages(updated);
    } else {
      // Fjern optimistisk melding ved feil
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id));
      setNewMessage(content);
    }

    setIsSending(false);
  }

  if (conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
        <div className="text-center">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium mb-1 text-[var(--color-grey-900)]">
            Ingen meldinger ennå
          </p>
          <p className="text-sm">
            Meldinger fra treneren din dukker opp her
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[var(--color-grey-50)] rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
      {/* Samtaleliste */}
      <div
        className={cn(
          "w-full sm:w-80 border-r border-[var(--color-grey-200)] bg-white flex flex-col",
          selectedId && "hidden sm:flex"
        )}
      >
        <div className="p-4 border-b border-[var(--color-grey-200)]">
          <h2 className="text-sm font-semibold text-[var(--color-grey-900)]">
            Meldinger
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedId(conv.id)}
              className={cn(
                "w-full text-left px-4 py-3 border-b border-[var(--color-grey-100)] transition-colors cursor-pointer",
                selectedId === conv.id
                  ? "bg-[var(--color-grey-100)]"
                  : "hover:bg-[var(--color-grey-50)]"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={cn(
                    "text-sm",
                    conv.unreadCount > 0
                      ? "font-semibold text-[var(--color-grey-900)]"
                      : "font-medium text-[var(--color-grey-700)]"
                  )}
                >
                  {conv.participantName}
                </span>
                {conv.lastMessageAt && (
                  <span className="text-[11px] text-[var(--color-grey-400)]">
                    {formatDistanceToNow(new Date(conv.lastMessageAt), {
                      addSuffix: true,
                      locale: nb,
                    })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-[var(--color-grey-500)] truncate flex-1">
                  {conv.lastMessage ?? "Ingen meldinger ennå"}
                </p>
                {conv.unreadCount > 0 && (
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-bold flex items-center justify-center">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat-vindu */}
      <div
        className={cn(
          "flex-1 flex flex-col bg-white",
          !selectedId && "hidden sm:flex"
        )}
      >
        {selectedId && selectedConversation ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--color-grey-200)]">
              <button
                onClick={() => setSelectedId(null)}
                className="sm:hidden p-1 rounded-lg hover:bg-[var(--color-grey-100)] cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--color-grey-600)]" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[var(--color-grey-200)] flex items-center justify-center">
                <span className="text-xs font-semibold text-[var(--color-grey-600)]">
                  {selectedConversation.participantName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </span>
              </div>
              <span className="text-sm font-semibold text-[var(--color-grey-900)]">
                {selectedConversation.participantName}
              </span>
            </div>

            {/* Meldinger */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isPending && messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-[var(--color-grey-400)]">
                  <p className="text-sm">Laster meldinger...</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.senderId === currentUserId;
                  return (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex",
                        isMe ? "justify-end" : "justify-start"
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[75%] rounded-2xl px-4 py-2.5",
                          isMe
                            ? "bg-[var(--color-primary)] text-white"
                            : "bg-[var(--color-grey-100)] text-[var(--color-grey-900)]"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">
                          {msg.content}
                        </p>
                        <p
                          className={cn(
                            "text-[10px] mt-1",
                            isMe
                              ? "text-white/60"
                              : "text-[var(--color-grey-400)]"
                          )}
                        >
                          {new Date(msg.createdAt).toLocaleTimeString("nb-NO", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Skriv melding */}
            <div className="p-3 border-t border-[var(--color-grey-200)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Skriv en melding..."
                  className="flex-1 px-4 py-2.5 text-sm rounded-xl border border-[var(--color-grey-200)] bg-[var(--color-grey-50)] text-[var(--color-grey-900)] placeholder:text-[var(--color-grey-400)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || isSending}
                  className="p-2.5 rounded-xl bg-[var(--color-primary)] text-white disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
            <div className="text-center">
              <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Velg en samtale for å se meldinger</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
