"use client";

import { useState } from "react";
import { Inbox, AlertCircle, X } from "lucide-react";
import {
  ChannelFilter,
  type Channel,
} from "@/components/portal/admin/meldinger/ChannelFilter";
import {
  MessageList,
  type Message,
  type MessageStatus,
} from "@/components/portal/admin/meldinger/MessageList";
import { MessageDetail } from "@/components/portal/admin/meldinger/MessageDetail";
import {
  approveMessage,
  rejectMessage,
  regenerateAIResponse,
} from "./actions";
import type { MessageWithAI, ChannelCounts } from "./actions";

interface MeldingerClientProps {
  initialMessages: MessageWithAI[];
  channelCounts: ChannelCounts;
}

export function MeldingerClient({
  initialMessages,
  channelCounts,
}: MeldingerClientProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | "ALL">(
    "ALL"
  );
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState<string | null>(null);

  const filteredMessages =
    selectedChannel === "ALL"
      ? messages
      : messages.filter((m) => m.channel === selectedChannel);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const handleApprove = async (messageId: string, content: string) => {
    setError(null);
    const result = await approveMessage(messageId, content);
    if (result.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, status: "APPROVED" as MessageStatus }
            : m
        )
      );
      setSelectedMessageId(null);
    } else {
      setError(result.error || "Kunne ikke godkjenne meldingen");
    }
  };

  const handleReject = async (messageId: string) => {
    setError(null);
    const result = await rejectMessage(messageId);
    if (result.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "FAILED" as MessageStatus } : m
        )
      );
      setSelectedMessageId(null);
    } else {
      setError(result.error || "Kunne ikke forkaste meldingen");
    }
  };

  const handleRegenerate = async (messageId: string) => {
    setError(null);
    // Sett status til AI_PROCESSING optimistisk
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId
          ? { ...m, status: "AI_PROCESSING" as MessageStatus }
          : m
      )
    );
    const result = await regenerateAIResponse(messageId);
    if (!result.success) {
      setError(result.error || "Kunne ikke regenerere AI-svar");
      // Sett tilbake til forrige status
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, status: "FAILED" as MessageStatus }
            : m
        )
      );
    }
    // Revalidering fra server action oppdaterer ved neste navigering
  };

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
        <div className="text-center">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium mb-1 text-[var(--color-grey-900)]">
            Ingen meldinger ennå
          </p>
          <p className="text-sm">Nye meldinger fra spillere dukker opp her</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-grey-50)] rounded-2xl border border-[var(--color-grey-200)] overflow-hidden">
      {/* Error banner */}
      {error && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[var(--color-error)]/5 border-b border-[var(--color-error)]/20">
          <div className="flex items-center gap-2 text-[var(--color-error)]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-[var(--color-error)] hover:text-[var(--color-error)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Channel filter */}
      <div className="p-4 border-b border-[var(--color-grey-200)] bg-white">
        <ChannelFilter
          selected={selectedChannel}
          onChange={setSelectedChannel}
          counts={channelCounts as Record<Channel | "ALL", number>}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Message list */}
        <div className="w-96 border-r border-[var(--color-grey-200)] overflow-auto bg-white">
          <MessageList
            messages={filteredMessages}
            selectedId={selectedMessageId}
            onSelect={setSelectedMessageId}
          />
        </div>

        {/* Message detail */}
        <div className="flex-1 bg-white overflow-hidden">
          {selectedMessage ? (
            <MessageDetail
              message={selectedMessage}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-1 text-[var(--color-grey-900)]">
                  Velg en melding for å se detaljer
                </p>
                <p className="text-sm">
                  {filteredMessages.length} meldinger i denne visningen
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
