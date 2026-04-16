"use client";

import { motion } from "framer-motion";
import { Bot, User, Loader2 } from "lucide-react";
import type { Message } from "./chat-interface";

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

export function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 bg-purple-50">
          <Bot className="w-4 h-4 text-purple-500" />
        </div>
      )}

      {/* Message content */}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? "rounded-br-md" : "rounded-bl-md"
        } ${
          isUser
            ? "bg-black text-white"
            : "bg-grey-50 text-black border border-grey-100"
        }`}
      >
        {message.content ? (
          <div className="whitespace-pre-wrap">
            {message.content}
            {isStreaming && (
              <span className="inline-flex items-center ml-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              </span>
            )}
          </div>
        ) : isStreaming ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
            <span className="text-grey-400">AI Coach tenker...</span>
          </div>
        ) : null}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 bg-grey-200">
          <User className="w-4 h-4 text-grey-400" />
        </div>
      )}
    </motion.div>
  );
}
