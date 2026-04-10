"use client";

import { useState } from "react";
import {
  Search,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  Paperclip,
  Smile,
  CheckCheck,
  Star,
  Archive,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
  AdminCard,
  AdminButton,
  AdminBadge,
  AdminEmptyState,
} from "@/components/portal/mission-control/ui";

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
    content:
      "Hei! Jeg lurte på om vi kunne gjennomgå putting-teknikken min litt mer neste gang. Jeg føler jeg har problemer med avstandskontrollen.",
    timestamp: "10:20",
    incoming: true,
  },
  {
    id: "2",
    sender: "Meg",
    content:
      "Hei Olav! Selvfølgelig, vi kan fokusere på det. Jeg skal forberede noen øvelser som kan hjelpe deg med å få bedre følelse for avstand.",
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

type FilterType = "all" | "unread" | "starred";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "Alle" },
  { value: "unread", label: "Ulest" },
  { value: "starred", label: "Favoritter" },
];

export default function MeldingerPage() {
  const { toggle } = useMCSidebar();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [messageText, setMessageText] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  const filteredConversations = mockConversations.filter((conv) => {
    const matchesSearch =
      conv.contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "unread" && conv.unread > 0) ||
      (activeFilter === "starred" && conv.starred);
    return matchesSearch && matchesFilter;
  });

  const selectedConversationData = mockConversations.find(
    (c) => c.id === selectedConversation,
  );

  return (
    <>
      <MCTopbar
        title="Meldinger"
        subtitle="Innboks og kommunikasjon med elever"
        onMenuClick={toggle}
      />

      <div className="p-6">
        <AdminCard
          className="p-0 overflow-hidden"
          style={{ minHeight: "calc(100vh - 180px)" }}
        >
          <div className="flex h-full">
            {/* Sidebar - Conversations List */}
            <div
              className={cn(
                "w-full lg:w-80 border-r border-[var(--color-grey-200)] flex flex-col",
                selectedConversation && "hidden lg:flex",
              )}
            >
              {/* Search & Filters */}
              <div className="p-3 border-b border-[var(--color-grey-200)] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center gap-2 bg-white border border-[var(--color-grey-200)] rounded-lg px-3 py-2 focus-within:border-[var(--color-primary)]">
                    <Search className="w-4 h-4 text-[var(--color-muted)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Søk..."
                      className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none"
                    />
                  </div>
                  <AdminButton
                    variant="primary"
                    className="!p-2"
                    aria-label="Ny samtale"
                  >
                    <Plus className="w-4 h-4" />
                  </AdminButton>
                </div>
                <div className="flex gap-1">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setActiveFilter(filter.value)}
                      className={cn(
                        "flex-1 px-2 py-1.5 text-[11px] font-medium rounded-md transition-colors",
                        activeFilter === filter.value
                          ? "bg-[var(--color-primary)] text-white"
                          : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-grey-100)]",
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.map((conv) => {
                  const ChannelIcon = channelIcons[conv.channel];
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv.id)}
                      className={cn(
                        "w-full p-3 flex items-start gap-3 text-left hover:bg-[var(--color-grey-100)] transition-colors border-b border-[var(--color-grey-100)]",
                        selectedConversation === conv.id &&
                          "bg-[var(--color-grey-100)]",
                      )}
                    >
                      <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center shrink-0">
                        {conv.contact.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={cn(
                              "text-sm truncate text-[var(--color-text)]",
                              conv.unread > 0 && "font-semibold",
                            )}
                          >
                            {conv.contact.name}
                          </span>
                          <ChannelIcon className="w-3 h-3 text-[var(--color-muted)]" />
                          {conv.starred && (
                            <Star className="w-3 h-3 text-[var(--color-warning)] fill-current" />
                          )}
                        </div>
                        <p
                          className={cn(
                            "text-xs truncate mt-0.5",
                            conv.unread > 0
                              ? "text-[var(--color-text)]"
                              : "text-[var(--color-muted)]",
                          )}
                        >
                          {conv.lastMessage}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-[10px] text-[var(--color-muted)]">
                          {conv.timestamp}
                        </span>
                        {conv.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-white text-[10px] font-semibold flex items-center justify-center">
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
            <div
              className={cn(
                "flex-1 flex flex-col",
                !selectedConversation && "hidden lg:flex",
              )}
            >
              {selectedConversationData ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-[var(--color-grey-200)] flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[var(--color-grey-100)]"
                      aria-label="Tilbake"
                    >
                      <ChevronLeft className="w-5 h-5 text-[var(--color-text)]" />
                    </button>
                    <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold flex items-center justify-center">
                      {selectedConversationData.contact.initials}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-[var(--color-text)]">
                        {selectedConversationData.contact.name}
                      </h3>
                      <span className="text-xs text-[var(--color-muted)]">
                        {selectedConversationData.contact.email}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                        aria-label="Favoriser"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                        aria-label="Arkiver"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                        aria-label="Flere valg"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[var(--color-grey-50)]">
                    {mockMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          msg.incoming ? "" : "flex-row-reverse",
                        )}
                      >
                        <div className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[10px] font-semibold flex items-center justify-center shrink-0">
                          {msg.incoming
                            ? selectedConversationData.contact.initials
                            : "ME"}
                        </div>
                        <div
                          className={cn(
                            "max-w-[70%] p-3 rounded-2xl text-sm",
                            msg.incoming
                              ? "bg-white border border-[var(--color-grey-200)] text-[var(--color-text)] rounded-tl-sm"
                              : "bg-[var(--color-primary)] text-white rounded-tr-sm",
                          )}
                        >
                          {msg.content}
                          <div
                            className={cn(
                              "text-[10px] mt-1 flex items-center gap-1",
                              msg.incoming
                                ? "text-[var(--color-muted)]"
                                : "text-white/70",
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
                  <div className="p-3 border-t border-[var(--color-grey-200)] bg-white">
                    <div className="flex items-end gap-2 bg-white border border-[var(--color-grey-200)] rounded-xl p-2 focus-within:border-[var(--color-primary)]">
                      <button
                        className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                        aria-label="Legg ved fil"
                      >
                        <Paperclip className="w-4 h-4" />
                      </button>
                      <textarea
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        placeholder="Skriv en melding..."
                        rows={1}
                        className="flex-1 bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none resize-none py-2"
                        style={{ minHeight: "20px", maxHeight: "100px" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                          }
                        }}
                      />
                      <button
                        className="p-2 rounded-lg hover:bg-[var(--color-grey-100)] text-[var(--color-muted)]"
                        aria-label="Legg til emoji"
                      >
                        <Smile className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                        aria-label="Send melding"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-[var(--color-muted)]">
                        Maler:
                      </span>
                      {templates.slice(0, 3).map((t) => (
                        <AdminBadge key={t.id} variant="muted">
                          {t.name}
                        </AdminBadge>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <AdminEmptyState
                    icon={<MessageSquare className="w-6 h-6" />}
                    title="Velg en samtale"
                    description="Klikk på en samtale i listen for å se meldinger og svare"
                    className="border-0 shadow-none bg-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
