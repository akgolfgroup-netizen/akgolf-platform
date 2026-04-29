"use client";

import { useEffect, useRef } from "react";
import { MoreVertical, Phone, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  DayDivider,
  MessageBubble,
  dayKey,
  type ChatMessage,
} from "./message-bubble";
import { Composer } from "./composer";

export type { ChatMessage } from "./message-bubble";

interface ConversationPaneProps {
  participantName: string;
  initials: string;
  messages: ChatMessage[];
  currentUserId: string;
  newMessage: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isLoading: boolean;
  isSending: boolean;
}

export function ConversationPane({
  participantName,
  initials,
  messages,
  currentUserId,
  newMessage,
  onChange,
  onSend,
  isLoading,
  isSending,
}: ConversationPaneProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const groups: { day: string; items: ChatMessage[] }[] = [];
  for (const m of messages) {
    const k = dayKey(m.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.day === k) last.items.push(m);
    else groups.push({ day: k, items: [m] });
  }

  return (
    <section className="flex flex-col" style={{ background: "#102B1E" }}>
      <div
        className="flex items-center gap-3.5 px-6 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="grid place-items-center rounded-full text-sm font-bold tracking-[-0.02em]"
          style={{
            background: "#D1F843",
            color: "#0A1F18",
            width: 42,
            height: 42,
          }}
        >
          {initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2.5 text-[15px] font-bold tracking-[-0.01em] text-white">
            {participantName}
            <span
              className="rounded font-mono text-[9px] font-bold uppercase"
              style={{
                background: "rgba(209,248,67,0.18)",
                color: "#D1F843",
                letterSpacing: "0.14em",
                padding: "2px 7px",
              }}
            >
              Coach
            </span>
          </div>
          <div
            className="mt-0.5 flex items-center gap-1.5 text-xs"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{
                background: "#6FCBA1",
                boxShadow: "0 0 6px rgba(111,203,161,0.6)",
              }}
            />
            Aktiv nå · svarer vanligvis innen 2 timer
          </div>
        </div>
        <div className="flex gap-1.5">
          <HeaderBtn title="Ring" Icon={Phone} />
          <HeaderBtn title="Video" Icon={Video} />
          <HeaderBtn title="Mer" Icon={MoreVertical} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-7 py-6">
        {isLoading && messages.length === 0 ? (
          <div
            className="flex flex-1 items-center justify-center text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Laster meldinger…
          </div>
        ) : groups.length === 0 ? (
          <div
            className="flex flex-1 items-center justify-center text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Ingen meldinger i denne tråden ennå.
          </div>
        ) : (
          groups.map((g) => (
            <div key={g.day} className="flex flex-col gap-3.5">
              <DayDivider label={g.day} />
              {g.items.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  isMe={m.senderId === currentUserId}
                />
              ))}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>

      <Composer
        participantFirstName={participantName.split(" ")[0] ?? participantName}
        value={newMessage}
        onChange={onChange}
        onSend={onSend}
        isSending={isSending}
      />
    </section>
  );
}

function HeaderBtn({ Icon, title }: { Icon: LucideIcon; title: string }) {
  return (
    <button
      type="button"
      title={title}
      className="grid h-9 w-9 place-items-center rounded-lg border border-white/5 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}
