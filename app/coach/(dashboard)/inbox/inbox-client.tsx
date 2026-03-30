"use client";

import { useState } from "react";
import { Inbox } from "lucide-react";
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

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-[var(--color-grey-500)]">
        <div className="text-center">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium mb-1">Ingen meldinger ennå</p>
          <p className="text-sm">Nye meldinger fra spillere dukker opp her</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[var(--color-grey-100)]">
      {/* Channel filter */}
      <div className="p-4 border-b border-[var(--color-grey-200)]">
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
