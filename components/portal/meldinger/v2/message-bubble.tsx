"use client";

import { CheckCheck } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";

export type ChatMessage = {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderImage: string | null;
  createdAt: string;
  readAt: string | null;
};

function formatBubbleTime(d: string): string {
  return new Date(d).toLocaleTimeString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface MessageBubbleProps {
  message: ChatMessage;
  isMe: boolean;
}

export function MessageBubble({ message, isMe }: MessageBubbleProps) {
  return (
    <div
      className={cn(
        "max-w-[75%] break-words rounded-[16px] px-4 py-3",
        isMe ? "self-end" : "self-start",
      )}
      style={{
        background: isMe ? "#D1F843" : "rgba(255,255,255,0.06)",
        color: isMe ? "#0A1F18" : "#E6EAE8",
        borderBottomRightRadius: isMe ? 5 : 16,
        borderBottomLeftRadius: isMe ? 16 : 5,
        fontSize: "13.5px",
        lineHeight: 1.5,
        fontWeight: isMe ? 500 : 400,
      }}
    >
      <p className="m-0 whitespace-pre-wrap">{message.content}</p>
      <span
        className="mt-1.5 block font-mono text-[10px]"
        style={{
          color: isMe ? "rgba(10,31,24,0.65)" : "rgba(255,255,255,0.55)",
          letterSpacing: "0.04em",
        }}
      >
        {formatBubbleTime(message.createdAt)}
        {isMe && message.readAt ? (
          <span className="ml-1 inline-flex items-center align-[-2px]">
            <CheckCheck className="h-2.5 w-2.5" />
          </span>
        ) : null}
      </span>
    </div>
  );
}

export function DayDivider({ label }: { label: string }) {
  return (
    <div
      className="relative my-2 text-center font-mono text-[9px] uppercase"
      style={{
        color: "rgba(255,255,255,0.35)",
        letterSpacing: "0.18em",
      }}
    >
      {label}
    </div>
  );
}

export function dayKey(d: string): string {
  return new Date(d).toLocaleDateString("nb-NO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}
