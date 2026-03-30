"use client";

import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Send, Edit, X, Bot } from "lucide-react";
import { useState } from "react";
import type { Channel } from "./ChannelFilter";
import type { MessageStatus } from "./MessageList";

interface AIResponse {
  draftContent: string;
  confidence: number;
  category: string;
  modelUsed: string;
}

interface MessageDetailProps {
  message: {
    id: string;
    channel: Channel;
    senderName: string;
    senderHandle: string;
    subject: string | null;
    content: string;
    receivedAt: Date;
    status: MessageStatus;
    aiResponse: AIResponse | null;
  };
  onApprove: (messageId: string, content: string) => Promise<void>;
  onReject: (messageId: string) => Promise<void>;
}

export function MessageDetail({
  message,
  onApprove,
  onReject,
}: MessageDetailProps) {
  const [editedContent, setEditedContent] = useState(
    message.aiResponse?.draftContent || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleApprove = async () => {
    setIsSending(true);
    try {
      await onApprove(message.id, editedContent);
    } finally {
      setIsSending(false);
    }
  };

  const handleReject = async () => {
    setIsSending(true);
    try {
      await onReject(message.id);
    } finally {
      setIsSending(false);
    }
  };

  const confidenceColor =
    message.aiResponse && message.aiResponse.confidence >= 0.8
      ? "text-green-500"
      : message.aiResponse && message.aiResponse.confidence >= 0.5
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[var(--color-grey-200)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-grey-900)]">
              {message.senderName}
            </h2>
            <p className="text-sm text-[var(--color-grey-500)]">
              {message.senderHandle}
            </p>
          </div>
          <span className="text-sm text-[var(--color-grey-500)]">
            {format(new Date(message.receivedAt), "d. MMMM yyyy 'kl.' HH:mm", {
              locale: nb,
            })}
          </span>
        </div>
        {message.subject && (
          <p className="mt-2 text-[var(--color-grey-300)] font-medium">
            {message.subject}
          </p>
        )}
      </div>

      {/* Original message */}
      <div className="p-4 border-b border-[var(--color-grey-200)]">
        <p className="text-sm text-[var(--color-grey-400)] mb-2">
          Opprinnelig melding:
        </p>
        <div className="bg-[var(--color-grey-100)] rounded-lg p-4">
          <p className="text-[var(--color-grey-900)] whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>

      {/* AI Response */}
      {message.aiResponse && (
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="h-5 w-5 text-[var(--color-black)]" />
            <span className="text-sm font-medium text-[var(--color-grey-900)]">AI-forslag</span>
            <span className={`text-xs ${confidenceColor}`}>
              {Math.round(message.aiResponse.confidence * 100)}% konfidensert
            </span>
            <span className="text-xs bg-[var(--color-grey-100)] px-2 py-0.5 rounded text-[var(--color-grey-400)]">
              {message.aiResponse.category}
            </span>
            <span className="text-xs text-[var(--color-grey-500)]">
              via {message.aiResponse.modelUsed}
            </span>
          </div>

          {isEditing ? (
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-48 bg-[var(--color-grey-100)] rounded-lg p-4 text-[var(--color-grey-900)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-grey-400)]"
              placeholder="Skriv ditt svar her..."
            />
          ) : (
            <div className="bg-[var(--color-grey-100)] rounded-lg p-4">
              <p className="text-[var(--color-grey-900)] whitespace-pre-wrap">{editedContent}</p>
            </div>
          )}
        </div>
      )}

      {/* No AI response yet */}
      {!message.aiResponse && message.status === "PENDING" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Bot className="h-12 w-12 text-[var(--color-grey-500)] mx-auto mb-3" />
            <p className="text-[var(--color-grey-400)]">
              AI-svar genereres snart...
            </p>
          </div>
        </div>
      )}

      {message.status === "AI_PROCESSING" && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Bot className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-pulse" />
            <p className="text-[var(--color-grey-400)]">
              AI analyserer meldingen...
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      {message.status === "AI_READY" && message.aiResponse && (
        <div className="p-4 border-t border-[var(--color-grey-200)] flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setIsEditing(!isEditing)}
            className="text-[var(--color-grey-400)]"
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? "Ferdig redigering" : "Rediger"}
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={handleReject}
              disabled={isSending}
              className="text-red-500 hover:text-red-400"
            >
              <X className="h-4 w-4 mr-2" />
              Forkast
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSending}
              isLoading={isSending}
              className="bg-[var(--color-black)] hover:bg-[var(--color-grey-900)] text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              Godkjenn & Send
            </Button>
          </div>
        </div>
      )}

      {/* Already sent/approved */}
      {(message.status === "SENT" || message.status === "APPROVED") && (
        <div className="p-4 border-t border-[var(--color-grey-200)]">
          <p className="text-center text-green-500 text-sm">
            Denne meldingen er allerede besvart
          </p>
        </div>
      )}

      {/* Failed */}
      {message.status === "FAILED" && (
        <div className="p-4 border-t border-[var(--color-grey-200)]">
          <p className="text-center text-red-500 text-sm">
            Denne meldingen ble forkastet
          </p>
        </div>
      )}
    </div>
  );
}
