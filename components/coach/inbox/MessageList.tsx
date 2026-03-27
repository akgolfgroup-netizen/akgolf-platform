"use client";

import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Mail,
  Instagram,
  MessageCircle,
  Phone,
  MessageSquare,
  Bot,
  Clock,
  Check,
} from "lucide-react";
import type { Channel } from "./ChannelFilter";

// Midlertidig type til Prisma-modeller er lagt til
export type MessageStatus =
  | "PENDING"
  | "AI_PROCESSING"
  | "AI_READY"
  | "APPROVED"
  | "SENT"
  | "FAILED";

const channelIcons: Record<Channel, React.ReactNode> = {
  EMAIL: <Mail className="h-4 w-4" />,
  INSTAGRAM: <Instagram className="h-4 w-4" />,
  MESSENGER: <MessageCircle className="h-4 w-4" />,
  WHATSAPP: <Phone className="h-4 w-4" />,
  IMESSAGE: <MessageSquare className="h-4 w-4" />,
};

const channelColors: Record<Channel, string> = {
  EMAIL: "border-l-red-500",
  INSTAGRAM: "border-l-pink-500",
  MESSENGER: "border-l-blue-500",
  WHATSAPP: "border-l-green-500",
  IMESSAGE: "border-l-emerald-500",
};

const statusBadges: Record<
  MessageStatus,
  { label: string; className: string; icon: React.ReactNode }
> = {
  PENDING: {
    label: "Venter",
    className: "bg-yellow-500/20 text-yellow-500",
    icon: <Clock className="h-3 w-3" />,
  },
  AI_PROCESSING: {
    label: "AI jobber",
    className: "bg-blue-500/20 text-blue-500",
    icon: <Bot className="h-3 w-3 animate-pulse" />,
  },
  AI_READY: {
    label: "AI klar",
    className: "bg-green-500/20 text-green-500",
    icon: <Bot className="h-3 w-3" />,
  },
  APPROVED: {
    label: "Godkjent",
    className: "bg-purple-500/20 text-purple-500",
    icon: <Check className="h-3 w-3" />,
  },
  SENT: {
    label: "Sendt",
    className: "bg-[var(--color-ink-80)] text-[var(--color-ink-40)]",
    icon: <Check className="h-3 w-3" />,
  },
  FAILED: {
    label: "Feilet",
    className: "bg-red-500/20 text-red-500",
    icon: <Clock className="h-3 w-3" />,
  },
};

export interface Message {
  id: string;
  channel: Channel;
  senderName: string;
  senderHandle: string;
  subject: string | null;
  content: string;
  receivedAt: Date;
  status: MessageStatus;
}

interface MessageListProps {
  messages: Message[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function MessageList({
  messages,
  selectedId,
  onSelect,
}: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-[var(--color-ink-50)]">
        Ingen meldinger
      </div>
    );
  }

  return (
    <div className="divide-y divide-[var(--color-ink-90)]">
      {messages.map((message) => {
        const status = statusBadges[message.status];
        return (
          <div
            key={message.id}
            onClick={() => onSelect(message.id)}
            className={cn(
              "p-4 cursor-pointer transition-colors border-l-4",
              channelColors[message.channel],
              selectedId === message.id
                ? "bg-[var(--color-ink-90)]"
                : "hover:bg-[var(--color-ink-95)]"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-ink-50)]">
                    {channelIcons[message.channel]}
                  </span>
                  <span className="font-medium text-white truncate">
                    {message.senderName}
                  </span>
                  <span className="text-[var(--color-ink-50)] text-sm truncate">
                    {message.senderHandle}
                  </span>
                </div>
                {message.subject && (
                  <p className="text-sm text-[var(--color-ink-30)] truncate mt-0.5">
                    {message.subject}
                  </p>
                )}
                <p className="text-sm text-[var(--color-ink-50)] truncate mt-1">
                  {message.content}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs text-[var(--color-ink-50)] whitespace-nowrap">
                  {formatDistanceToNow(new Date(message.receivedAt), {
                    addSuffix: true,
                    locale: nb,
                  })}
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-0.5 rounded-full",
                    status.className
                  )}
                >
                  {status.icon}
                  {status.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
