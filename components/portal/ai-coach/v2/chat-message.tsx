"use client";

import type { ReactNode } from "react";

export interface ChatMessageData {
  role: "user" | "assistant";
  initials: string;
  text: ReactNode;
  sources?: string[];
  rich?: ReactNode;
}

interface ChatMessageProps {
  message: ChatMessageData;
}

/**
 * Enkelt chat-bobbel for AI Coach v2.
 */
export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  return (
    <div
      className={[
        "flex gap-3 max-w-[780px]",
        isUser ? "ml-auto flex-row-reverse" : "",
      ].join(" ")}
    >
      <div
        className={[
          "w-8 h-8 rounded-lg flex-shrink-0 grid place-items-center text-[11px] font-bold",
          isUser ? "bg-[#0A1F18] text-[#D1F843]" : "bg-[#AF52DE] text-white",
        ].join(" ")}
      >
        {message.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div
          className={[
            "px-4 py-3.5 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "bg-[#0A1F18] text-white"
              : "bg-card text-ink border border-[color:var(--color-line)]",
          ].join(" ")}
        >
          {message.text}

          {message.sources && message.sources.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {message.sources.map((src, i) => (
                <span
                  key={i}
                  className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-[#AF52DE]/10 text-[#AF52DE] font-medium tracking-wide border border-[#AF52DE]/20"
                >
                  {src}
                </span>
              ))}
            </div>
          ) : null}

          {message.rich ? <div className="mt-3">{message.rich}</div> : null}
        </div>
      </div>
    </div>
  );
}
