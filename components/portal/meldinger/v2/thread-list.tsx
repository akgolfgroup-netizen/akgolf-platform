"use client";

import { PenLine, Search } from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import type { ConversationSummary } from "@/app/portal/(dashboard)/meldinger/actions";

interface ThreadListProps {
  conversations: ConversationSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

const AVATAR_COLORS = [
  "#D1F843",
  "#6BB1FF",
  "#E8B967",
  "#F49283",
  "#AF52DE",
  "#6FCBA1",
];

function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function formatTime(d: Date | null): string {
  if (!d) return "";
  const now = new Date();
  const diffMs = now.getTime() - new Date(d).getTime();
  const diffH = diffMs / (1000 * 60 * 60);
  if (diffH < 1) return `${Math.max(1, Math.round(diffMs / (1000 * 60)))}m`;
  if (diffH < 24) {
    return new Date(d).toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (diffH < 48) return "i går";
  return new Date(d).toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
  });
}

export function ThreadList({
  conversations,
  selectedId,
  onSelect,
}: ThreadListProps) {
  const totalUnread = conversations.reduce((s, c) => s + c.unreadCount, 0);

  return (
    <aside
      className="flex flex-col"
      style={{
        background: "#0A1F18",
        borderRight: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="px-5 pb-3.5 pt-5.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="m-0 text-lg font-bold tracking-[-0.02em] text-white">
            Meldinger
          </h2>
          <button
            type="button"
            title="Ny samtale"
            className="grid h-7 w-7 place-items-center rounded-lg"
            style={{ background: "#D1F843", color: "#0A1F18" }}
          >
            <PenLine className="h-3.5 w-3.5" strokeWidth={2.4} />
          </button>
        </div>
        <div
          className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/5 px-2.5 py-2 text-[12.5px]"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <Search className="h-3 w-3" />
          <span>Søk personer eller meldinger…</span>
        </div>
      </div>

      <div className="flex gap-0.5 px-3.5 pb-2.5 pt-3">
        <Tab active label="Alle" count={conversations.length} />
        {totalUnread > 0 ? <Tab label="Uleste" count={totalUnread} /> : null}
        <Tab label="Coach" />
        <Tab label="Arkiv" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div
            className="px-5 py-10 text-center text-sm"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            Ingen samtaler ennå.
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = selectedId === conv.id;
            const isUnread = conv.unreadCount > 0;
            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "relative flex w-full gap-3 px-4.5 py-3.5 text-left transition",
                  isActive && "border-l-[3px] pl-[15px]",
                )}
                style={{
                  borderBottom: "1px solid rgba(255,255,255,0.03)",
                  background: isActive ? "rgba(209,248,67,0.06)" : undefined,
                  borderLeftColor: isActive ? "#D1F843" : undefined,
                }}
              >
                <div
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold tracking-[-0.02em]"
                  style={{
                    background: avatarColor(conv.participantName),
                    color: "#0A1F18",
                  }}
                >
                  {initials(conv.participantName)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex justify-between gap-2">
                    <span
                      className="truncate text-[13.5px] font-semibold tracking-[-0.01em]"
                      style={{
                        color: isUnread ? "#D1F843" : "#fff",
                      }}
                    >
                      {conv.participantName}
                    </span>
                    <span
                      className="font-mono text-[10px] whitespace-nowrap"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div
                    className="truncate text-[12.5px] leading-[1.4]"
                    style={{
                      color: isUnread
                        ? "rgba(255,255,255,0.85)"
                        : "rgba(255,255,255,0.55)",
                    }}
                  >
                    {conv.lastMessage ?? "Ingen meldinger ennå"}
                  </div>
                </div>
                {isUnread ? (
                  <span
                    className="absolute right-4.5 top-5.5 h-2 w-2 rounded-full"
                    style={{
                      background: "#D1F843",
                      boxShadow: "0 0 8px rgba(209,248,67,0.5)",
                    }}
                  />
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}

function Tab({
  label,
  count,
  active,
}: {
  label: string;
  count?: number;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "flex-1 rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-medium transition",
      )}
      style={{
        background: active ? "rgba(255,255,255,0.08)" : "transparent",
        color: active ? "#fff" : "rgba(255,255,255,0.55)",
        fontWeight: active ? 600 : 500,
      }}
    >
      {label}
      {count != null ? (
        <span
          className="ml-1 rounded font-mono text-[10px]"
          style={{
            background: "rgba(209,248,67,0.20)",
            color: "#D1F843",
            padding: "1px 5px",
          }}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
