"use client";

import { useState } from "react";
import { ChannelFilter, type Channel } from "@/components/coach/inbox/ChannelFilter";
import { MessageList, type Message, type MessageStatus } from "@/components/coach/inbox/MessageList";
import { MessageDetail } from "@/components/coach/inbox/MessageDetail";
import { approveMessage, rejectMessage } from "./actions";

interface AIResponse {
  draftContent: string;
  confidence: number;
  category: string;
  modelUsed: string;
}

interface MessageWithAI extends Message {
  aiResponse: AIResponse | null;
}

interface InboxClientProps {
  initialMessages: MessageWithAI[];
  channelCounts: Record<string, number>;
}

export function InboxClient({
  initialMessages,
  channelCounts,
}: InboxClientProps) {
  const [selectedChannel, setSelectedChannel] = useState<Channel | "ALL">("ALL");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const [messages, setMessages] = useState(initialMessages);

  const filteredMessages =
    selectedChannel === "ALL"
      ? messages
      : messages.filter((m) => m.channel === selectedChannel);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId);

  const handleApprove = async (messageId: string, content: string) => {
    const result = await approveMessage(messageId, content);
    if (result.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "SENT" as MessageStatus } : m
        )
      );
      setSelectedMessageId(null);
    }
  };

  const handleReject = async (messageId: string) => {
    const result = await rejectMessage(messageId);
    if (result.success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, status: "FAILED" as MessageStatus } : m
        )
      );
      setSelectedMessageId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[var(--color-ink-100)]">
      {/* Channel filter */}
      <div className="p-4 border-b border-[var(--color-ink-90)]">
        <ChannelFilter
          selected={selectedChannel}
          onChange={setSelectedChannel}
          counts={channelCounts as Record<Channel | "ALL", number>}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Message list */}
        <div className="w-96 border-r border-[var(--color-ink-90)] overflow-auto">
          <MessageList
            messages={filteredMessages}
            selectedId={selectedMessageId}
            onSelect={setSelectedMessageId}
          />
        </div>

        {/* Message detail */}
        <div className="flex-1 bg-[var(--color-ink-95)] overflow-hidden">
          {selectedMessage ? (
            <MessageDetail
              message={selectedMessage}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-[var(--color-ink-50)]">
              <div className="text-center">
                <p className="text-lg font-medium mb-1">
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
