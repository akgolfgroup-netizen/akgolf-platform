"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  Star,
  Trash2,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/portal/utils/cn";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";

// Mock data
const mockConversations = [
  {
    id: "1",
    contact: { name: "Olav Hansen", initials: "OH", email: "olav@example.com" },
    lastMessage: "Takk for en flott økt i går! Ser frem til neste time.",
    timestamp: "10:23",
    unread: 0,
    channel: "email" as const,
    starred: true,
  },
  {
    id: "2",
    contact: { name: "Mari Kristiansen", initials: "MK", email: "mari@example.com" },
    lastMessage: "Kan vi flytte timen på fredag til 14:00?",
    timestamp: "09:45",
    unread: 2,
    channel: "sms" as const,
    starred: false,
  },
  {
    id: "3",
    contact: { name: "Erik Johansen", initials: "EJ", email: "erik@example.com" },
    lastMessage: "Jeg ønsker å avbestille min time neste uke.",
    timestamp: "I går",
    unread: 0,
    channel: "app" as const,
    starred: false,
  },
  {
    id: "4",
    contact: { name: "Sofie Berg", initials: "SB", email: "sofie@example.com" },
    lastMessage: "Takk for videoen! Det var veldig hjelpsomt.",
    timestamp: "I går",
    unread: 0,
    channel: "email" as const,
    starred: true,
  },
];

const mockMessages = [
  {
    id: "1",
    sender: "Olav Hansen",
    content: "Hei! Jeg lurte på om vi kunne gjennomgå putting-teknikken min litt mer neste gang. Jeg føler jeg har problemer med avstandskontrollen.",
    timestamp: "10:20",
    incoming: true,
  },
  {
    id: "2",
    sender: "Meg",
    content: "Hei Olav! Selvfølgelig, vi kan fokusere på det. Jeg skal forberede noen øvelser som kan hjelpe deg med å få bedre følelse for avstand.",
    timestamp: "10:22",
    incoming: false,
  },
  {
    id: "3",
    sender: "Olav Hansen",
    content: "Takk for en flott økt i går! Ser frem til neste time.",
    timestamp: "10:23",
    incoming: true,
  },
];

const channelIcons = {
  email: Mail,
  sms: Phone,
  app: MessageSquare,
};

const templates = [
  { id: "1", name: "Velkomst e-post", subject: "Velkommen til AK Golf Academy!" },
  { id: "2", name: "Booking bekreftelse", subject: "Din booking er bekreftet" },
  { id: "3", name: "Påminnelse", subject: "Påminnelse: Time i morgen" },
  { id: "4", name: "Oppfølging", subject: "Hvordan går det med treningen?" },
];

export default function MeldingerPage() {
  const { toggle } = useMCSidebar();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "starred">("all");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch = conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "unread" && conv.unread > 0) ||
                         (activeFilter === "starred" && conv.starred);
    return matchesSearch && matchesFilter;
  });

  const selectedConversationData = mockConversations.find((c) => c.id === selectedConversation);

  return (
    <>
      <MCTopbar
        title="Meldinger"
        subtitle="Innboks og kommunikasjon med elever"
        onMenuClick={toggle}
      />

      <div className="p-5">
        <div className="hg-card overflow-hidden" style={{ minHeight: "calc(100vh - 180px)" }}>
          <div className="flex h-full">
            {/* Sidebar - Conversations List */}
            <div className={cn(
              "w-full lg:w-80 border-r border-[var(--hg-border)] flex flex-col",
              selectedConversation && "hidden lg:flex"
            )}>
              {/* Search & Filters */}
              <div className="p-3 border-b border-[var(--hg-border)] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-lg px-3 py-2">
                    <Search className="w-4 h-4 text-[var(--hg-text-muted)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Søk..."
                      className="flex-1 bg-transparent text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none"
                    />
                  </div>
                  <button className="hg-btn hg-btn-primary p-2">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex gap-1">
                  {(["all", "unread", "starred"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={cn(
                        "flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors capitalize",
                        activeFilter === filter
                          ? "bg-[var(--hg-surface-raised)] text-[var(--hg-text)]"
                          : "text-[var(--hg-text-muted)] hover:text-[var(--hg-text)]"
                      )}
                    >
                      {filter === "all" && "Alle"}
                      {filter === "unread" && "Ulest"}
                      {filter === "starred" && "Favoritter"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto hg-scrollbar">
                {filteredConversations.map((conv) => {
                  const ChannelIcon = channelIcons[conv.channel];
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={cn(
                        "w-full p-3 flex items-start gap-3 text-left hover:bg-[var(--hg-surface-raised)] transition-colors border-b border-[var(--hg-border-subtle)]",
                        selectedConversation === conv.id && "bg-[var(--hg-surface-raised)]"
                      )}
                    >
                      <div className="hg-avatar hg-avatar-sm shrink-0">{conv.contact.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "text-sm truncate",
                            conv.unread > 0 ? "font-semibold text-[var(--hg-text)]" : "text-[var(--hg-text)]"
                          )}>
                            {conv.contact.name}
                          </span>
                          <ChannelIcon className="w-3 h-3 text-[var(--hg-text-muted)]" />
                          {conv.starred && <Star className="w-3 h-3 text-[var(--hg-warning)] fill-current" />}
                        </div>
                        <p className={cn(
                          "text-xs truncate mt-0.5",
                          conv.unread > 0 ? "text-[var(--hg-text)]" : "text-[var(--hg-text-muted)]"
                        )}>
                          {conv.lastMessage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-[var(--hg-text-muted)]">{conv.timestamp}</span>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[var(--hg-primary)] text-[var(--hg-bg)] text-[10px] font-semibold flex items-center justify-center">
                            {conv.unread}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Content - Chat */}
            <div className={cn(
              "flex-1 flex flex-col",
              !selectedConversation && "hidden lg:flex"
            )}>
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-[var(--hg-border)] flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--hg-surface-raised)]"
                    >
                      <ChevronLeft className="w-5 h-5 text-[var(--hg-text)]" />
                    </button>
                    <div className="hg-avatar hg-avatar-sm">{selectedConversationData.contact.initials}</div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[var(--hg-text)]">
                        {selectedConversationData.contact.name}
                      </h3>
                      <span className="text-xs text-[var(--hg-text-muted)]">
                        {selectedConversationData.contact.email}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                        <Star className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          msg.incoming ? "" : "flex-row-reverse"
                        )}
                      >
                        <div className="hg-avatar hg-avatar-sm shrink-0">
                          {msg.incoming ? selectedConversationData.contact.initials : "ME"}
                        </div>
                        <div
                          className={cn(
                            "max-w-[70%] p-3 rounded-2xl text-sm",
                            msg.incoming
                              ? "bg-[var(--hg-surface-raised)] text-[var(--hg-text)] rounded-tl-sm"
                              : "bg-[var(--hg-primary)] text-[var(--hg-bg)] rounded-tr-sm"
                          )}
                        >
                          {msg.content}
                          <div
                            className={cn(
                              "text-[10px] mt-1 flex items-center gap-1",
                              msg.incoming ? "text-[var(--hg-text-muted)]" : "text-[var(--hg-bg)]/70"
                            )}
                          >
                            {msg.timestamp}
                            {!msg.incoming && <CheckCheck className="w-3 h-3" />}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-[var(--hg-border)]">
                    <div className="flex items-end gap-2 bg-[var(--hg-surface)] border border-[var(--hg-border)] rounded-xl p-2">
                      <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Skriv en melding..."
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-[var(--hg-text)] placeholder:text-[var(--hg-text-muted)] outline-none resize-none py-2"
                        style={{ minHeight: "20px", maxHeight: "100px" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            // Send message
                          }
                        }}
                      />
                      <button className="p-2 rounded-lg hover:bg-[var(--hg-surface-raised)] text-[var(--hg-text-muted)]">
                        <Smile className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[var(--hg-primary)] text-[var(--hg-bg)] hover:opacity-90 transition-opacity">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--hg-text-muted)]">Maler:</span>
                      {templates.slice(0, 3).map((t) => (
                        <button
                          key={t.id}
                          className="text-[10px] px-2 py-1 rounded bg-[var(--hg-surface-raised)] text-[var(--hg-text-secondary)] hover:text-[var(--hg-text)] transition-colors"
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-[var(--hg-surface-raised)] flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-[var(--hg-text-muted)]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--hg-text)] mb-2">
                    Velg en samtale
                  </h3>
                  <p className="text-sm text-[var(--hg-text-muted)] max-w-xs">
                    Klikk på en samtale i listen for å se meldinger og svare
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
