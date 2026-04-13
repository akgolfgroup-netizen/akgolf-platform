"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import {
 Search,
 Send,
 ChevronLeft,
 MessageSquare,
 CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import { AdminEmptyState } from "@/components/portal/mission-control/ui";
import { formatDistanceToNow } from "date-fns";
import { nb } from "date-fns/locale";
import type { ConversationSummary, ChatMessage } from "./chat-actions";
import {
 getConversationMessages,
 sendDirectMessage,
 markConversationAsRead,
} from "./chat-actions";

interface AdminChatClientProps {
 conversations: ConversationSummary[];
 currentUserId: string;
}

function getInitials(name: string): string {
 return name
 .split("")
 .map((n) => n[0])
 .join("")
 .toUpperCase()
 .slice(0, 2);
}

export function AdminChatClient({
 conversations: initialConversations,
 currentUserId,
}: AdminChatClientProps) {
 const { toggle } = useMCSidebar();
 const [conversations, setConversations] = useState(initialConversations);
 const [selectedId, setSelectedId] = useState<string | null>(null);
 const [messages, setMessages] = useState<ChatMessage[]>([]);
 const [newMessage, setNewMessage] = useState("");
 const [searchQuery, setSearchQuery] = useState("");
 const [isPending, startTransition] = useTransition();
 const [isSending, setIsSending] = useState(false);
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const selectedConversation = conversations.find((c) => c.id === selectedId);

 const filteredConversations = conversations.filter((conv) =>
 conv.participantName.toLowerCase().includes(searchQuery.toLowerCase())
 );

 // Last meldinger nar samtale velges
 useEffect(() => {
 if (!selectedId) return;

 startTransition(async () => {
 const msgs = await getConversationMessages(selectedId);
 setMessages(msgs);

 await markConversationAsRead(selectedId);
 setConversations((prev) =>
 prev.map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c))
 );
 });
 }, [selectedId]);

 // Scroll til bunnen ved nye meldinger
 useEffect(() => {
 messagesEndRef.current?.scrollIntoView({ behavior: "smooth"});
 }, [messages]);

 async function handleSend() {
 if (!selectedId || !newMessage.trim() || isSending) return;

 const content = newMessage.trim();
 setNewMessage("");
 setIsSending(true);

 // Optimistisk oppdatering
 const optimistic: ChatMessage = {
 id: `temp-${Date.now()}`,
 senderId: currentUserId,
 senderName: "Deg",
 content,
 createdAt: new Date(),
 readAt: null,
 };
 setMessages((prev) => [...prev, optimistic]);

 const result = await sendDirectMessage(selectedId, content);

 if (result.success) {
 setConversations((prev) =>
 prev.map((c) =>
 c.id === selectedId
 ? { ...c, lastMessage: content, lastMessageAt: new Date() }
 : c
 )
 );
 const updated = await getConversationMessages(selectedId);
 setMessages(updated);
 } else {
 setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
 setNewMessage(content);
 }

 setIsSending(false);
 }

 const totalUnread = conversations.reduce(
 (sum, c) => sum + c.unreadCount,
 0
 );

 return (
 <>
 <MCTopbar
 title="Meldinger"
 subtitle={
 totalUnread > 0
 ? `${totalUnread} uleste meldinger`
 : "Direktemeldinger med elever"
 }
 onMenuClick={toggle}
 />

 <div className="p-6">
 <div
 className="bg-white rounded-xl border border-[#D5DFDB] rounded-xl overflow-hidden"
 style={{ minHeight: "calc(100vh - 180px)"}}
 >
 <div className="flex h-full">
 {/* Sidebar - Samtaleliste */}
 <div
 className={cn(
 "w-full lg:w-80 border-r border-[#D5DFDB] flex flex-col",
 selectedId && "hidden lg:flex"
 )}
 >
 {/* Sok */}
 <div className="p-3 border-b border-[#D5DFDB]">
 <div className="flex items-center gap-2">
 <div className="flex-1 flex items-center gap-2 bg-[#F5F8F7] border border-[#D5DFDB] rounded-lg px-3 py-2 focus-within:border-[#0A1F18] focus-within:ring-1 focus-within:ring-[#0A1F18]/20 transition-all">
 <Search className="w-4 h-4 text-[#7A8C85]"/>
 <input
 type="text"
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 placeholder="Sok i samtaler..."
 className="flex-1 bg-transparent text-sm text-[#0A1F18] placeholder:text-[#7A8C85] outline-none"
 />
 </div>
 </div>
 </div>

 {/* Samtaler */}
 <div className="flex-1 overflow-y-auto">
 {filteredConversations.length === 0 ? (
 <div className="p-6 text-center">
 <p className="text-sm text-[#5A6E66]">
 {searchQuery
 ? "Ingen treff"
 : "Ingen samtaler enna"}
 </p>
 </div>
 ) : (
 filteredConversations.map((conv) => (
 <button
 key={conv.id}
 onClick={() => setSelectedId(conv.id)}
 className={cn(
 "w-full p-3 flex items-start gap-3 text-left hover:bg-[#ECF0EF] transition-colors border-b border-[#ECF0EF] cursor-pointer",
 selectedId === conv.id && "bg-[#ECF0EF]"
 )}
 >
 <div className="w-9 h-9 rounded-full bg-[#0A1F18]/10 text-[#0A1F18] text-xs font-semibold flex items-center justify-center shrink-0">
 {getInitials(conv.participantName)}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <span
 className={cn(
 "text-sm truncate text-[#0A1F18]",
 conv.unreadCount > 0 && "font-semibold"
 )}
 >
 {conv.participantName}
 </span>
 </div>
 <p
 className={cn(
 "text-xs truncate mt-0.5",
 conv.unreadCount > 0
 ? "text-[#0A1F18]"
 : "text-[#5A6E66]"
 )}
 >
 {conv.lastMessage ?? "Ingen meldinger enna"}
 </p>
 </div>
 <div className="flex flex-col items-end gap-1">
 {conv.lastMessageAt && (
 <span className="text-[10px] text-[#5A6E66] whitespace-nowrap">
 {formatDistanceToNow(
 new Date(conv.lastMessageAt),
 { addSuffix: true, locale: nb }
 )}
 </span>
 )}
 {conv.unreadCount > 0 && (
 <span className="w-5 h-5 rounded-full bg-[#0A1F18] text-white text-[10px] font-semibold flex items-center justify-center">
 {conv.unreadCount}
 </span>
 )}
 </div>
 </button>
 ))
 )}
 </div>
 </div>

 {/* Chat-vindu */}
 <div
 className={cn(
 "flex-1 flex flex-col",
 !selectedId && "hidden lg:flex"
 )}
 >
 {selectedId && selectedConversation ? (
 <>
 {/* Chat Header */}
 <div className="p-3 border-b border-[#D5DFDB] flex items-center gap-3 bg-white">
 <button
 onClick={() => setSelectedId(null)}
 className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-[#ECF0EF] cursor-pointer"
 aria-label="Tilbake"
 >
 <ChevronLeft className="w-5 h-5 text-[#324D45]"/>
 </button>
 <div className="w-9 h-9 rounded-full bg-[#0A1F18]/10 text-[#0A1F18] text-xs font-semibold flex items-center justify-center">
 {getInitials(selectedConversation.participantName)}
 </div>
 <div className="flex-1">
 <h3 className="font-semibold text-[#0A1F18]">
 {selectedConversation.participantName}
 </h3>
 </div>
 </div>

 {/* Meldinger */}
 <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F8F7]">
 {isPending && messages.length === 0 ? (
 <div className="flex items-center justify-center h-full text-[#5A6E66]">
 <p className="text-sm">Laster meldinger...</p>
 </div>
 ) : (
 messages.map((msg) => {
 const isMe = msg.senderId === currentUserId;
 return (
 <div
 key={msg.id}
 className={cn(
 "flex gap-3",
 isMe ? "flex-row-reverse":""
 )}
 >
 <div className="w-8 h-8 rounded-full bg-[#0A1F18]/10 text-[#0A1F18] text-[10px] font-semibold flex items-center justify-center shrink-0">
 {isMe
 ? "ME"
 : getInitials(msg.senderName)}
 </div>
 <div
 className={cn(
 "max-w-[70%] p-3 rounded-2xl text-sm",
 isMe
 ? "bg-[#0A1F18] text-white rounded-tr-sm"
 : "bg-[#ECF0EF] text-[#0A1F18] rounded-tl-sm"
 )}
 >
 <p className="whitespace-pre-wrap">
 {msg.content}
 </p>
 <div
 className={cn(
 "text-[10px] mt-1 flex items-center gap-1",
 isMe
 ? "text-white/70"
 : "text-[#5A6E66]"
 )}
 >
 {new Date(msg.createdAt).toLocaleTimeString(
 "nb-NO",
 { hour: "2-digit", minute: "2-digit"}
 )}
 {isMe && msg.readAt && (
 <CheckCheck className="w-3 h-3"/>
 )}
 </div>
 </div>
 </div>
 );
 })
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Input */}
 <div className="p-3 border-t border-[#D5DFDB] bg-white">
 <form
 onSubmit={(e) => {
 e.preventDefault();
 handleSend();
 }}
 className="flex items-end gap-2 bg-[#F5F8F7] border border-[#D5DFDB] rounded-xl p-2 focus-within:border-[#0A1F18] focus-within:ring-1 focus-within:ring-[#0A1F18]/20 transition-all"
 >
 <textarea
 value={newMessage}
 onChange={(e) => setNewMessage(e.target.value)}
 placeholder="Skriv en melding..."
 rows={1}
 disabled={isSending}
 className="flex-1 bg-transparent text-sm text-[#0A1F18] placeholder:text-[#7A8C85] outline-none resize-none py-2"
 style={{ minHeight: "20px", maxHeight: "100px"}}
 onKeyDown={(e) => {
 if (e.key === "Enter"&& !e.shiftKey) {
 e.preventDefault();
 handleSend();
 }
 }}
 />
 <button
 type="submit"
 disabled={!newMessage.trim() || isSending}
 className="p-2 rounded-lg bg-[#0A1F18] text-white hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
 aria-label="Send melding"
 >
 <Send className="w-4 h-4"/>
 </button>
 </form>
 </div>
 </>
 ) : (
 <div className="flex-1 flex items-center justify-center p-8 bg-[#F5F8F7]">
 <AdminEmptyState
 icon={<MessageSquare className="w-6 h-6"/>}
 title="Velg en samtale"
 description="Klikk pa en samtale i listen for a se meldinger og svare"
 />
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </>
 );
}
