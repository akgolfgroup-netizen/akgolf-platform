"use client";


import { Icon } from "@/components/ui/icon";
import { motion } from "framer-motion";
import { User } from "lucide-react";
import type { Message } from "./chat-interface";
import {
  AIAttribution,
  MonoLabel,
  type AttributionSource,
} from "@/components/portal/patterns";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  sources?: AttributionSource[];
}

export function MessageBubble({ message, isStreaming, sources }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const showAttribution = !isUser && !!sources && sources.length > 0 && !!message.content && !isStreaming;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-ai-light">
          <Icon name="smart_toy" className="h-4 w-4 text-ai-text" />
        </div>
      )}

      <div className={`max-w-[80%] space-y-2 ${isUser ? "items-end" : "items-start"}`}>
        {/* Message content */}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser ? "rounded-br-md" : "rounded-bl-md"
          } ${
            isUser
              ? "bg-on-surface text-surface"
              : "border border-outline-variant/20 bg-surface text-on-surface"
          }`}
        >
          {message.content ? (
            <div className="whitespace-pre-wrap">
              {message.content}
              {isStreaming && (
                <span className="ml-1 inline-flex items-center">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ai" />
                </span>
              )}
            </div>
          ) : isStreaming ? (
            <div className="flex items-center gap-2">
              <Icon name="progress_activity" className="h-4 w-4 animate-spin text-ai-text" />
              <span className="text-on-surface-variant">AI Coach tenker...</span>
            </div>
          ) : null}
        </div>

        {/* AI Attribution + timestamp */}
        {!isUser && message.content && !isStreaming && (
          <div className="space-y-1.5">
            {showAttribution && <AIAttribution sources={sources!} />}
            <MonoLabel size="xs" className="text-on-surface-variant">
              {new Date(message.timestamp).toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </MonoLabel>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-surface-variant">
          <Icon name="person" className="h-4 w-4 text-on-surface-variant" />
        </div>
      )}
    </motion.div>
  );
}
