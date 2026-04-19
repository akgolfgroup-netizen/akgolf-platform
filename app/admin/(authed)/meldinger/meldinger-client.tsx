"use client";


import { Icon } from "@/components/ui/icon";
import { useState } from "react";

import { MCTopbar, useMCSidebar } from "@/components/portal/mission-control";
import {
 ChannelFilter,
 type Channel,
} from "@/components/portal/admin/meldinger/ChannelFilter";
import {
 MessageList,
 type MessageStatus,
} from "@/components/portal/admin/meldinger/MessageList";
import { MessageDetail } from "@/components/portal/admin/meldinger/MessageDetail";
import {
 approveMessage,
 rejectMessage,
} from "./actions";
import type { MessageWithAI, ChannelCounts } from "./actions";

interface MeldingerClientProps {
 initialMessages: MessageWithAI[];
 channelCounts: ChannelCounts;
}

export function MeldingerClient({
 initialMessages,
 channelCounts,
}: MeldingerClientProps) {
 const { toggle } = useMCSidebar();
 const [selectedChannel, setSelectedChannel] = useState<Channel | "ALL">(
 "ALL"
 );
 const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
 null
 );
 const [messages, setMessages] = useState(initialMessages);
 const [error, setError] = useState<string | null>(null);

 const filteredMessages =
 selectedChannel === "ALL"
 ? messages
 : messages.filter((m) => m.channel === selectedChannel);

 const selectedMessage = messages.find((m) => m.id === selectedMessageId);

 const handleApprove = async (messageId: string, content: string) => {
 setError(null);
 const result = await approveMessage(messageId, content);
 if (result.success) {
 setMessages((prev) =>
 prev.map((m) =>
 m.id === messageId
 ? { ...m, status: "APPROVED"as MessageStatus }
 : m
 )
 );
 setSelectedMessageId(null);
 } else {
 setError(result.error || "Kunne ikke godkjenne meldingen");
 }
 };

 const handleReject = async (messageId: string) => {
 setError(null);
 const result = await rejectMessage(messageId);
 if (result.success) {
 setMessages((prev) =>
 prev.map((m) =>
 m.id === messageId ? { ...m, status: "FAILED"as MessageStatus } : m
 )
 );
 setSelectedMessageId(null);
 } else {
 setError(result.error || "Kunne ikke forkaste meldingen");
 }
 };

 if (messages.length === 0) {
 return (
 <>
 <MCTopbar
 title="Meldingskø"
 subtitle="Ingen meldinger ennå"
 onMenuClick={toggle}
 />
 <div className="p-6">
 <div className="flex items-center justify-center py-20 text-grey-400">
 <div className="text-center">
 <Icon name="inbox" className="w-12 h-12 mx-auto mb-3 opacity-40" />
 <p className="text-lg font-medium mb-1 text-black">
 Ingen meldinger ennå
 </p>
 <p className="text-sm">Nye meldinger fra spillere dukker opp her</p>
 </div>
 </div>
 </div>
 </>
 );
 }

 return (
 <>
 <MCTopbar
 title="Meldingskø"
 subtitle={`${messages.length} meldinger`}
 onMenuClick={toggle}
 />
 <div className="p-6">
 <div 
 className="flex flex-col bg-white rounded-xl border border-grey-200 rounded-xl overflow-hidden"
 style={{ height: "calc(100vh - 180px)"}}
 >
 {/* Error banner */}
 {error && (
 <div className="flex items-center justify-between gap-3 px-4 py-3 bg-red-50 border-b border-red-200">
 <div className="flex items-center gap-2 text-red-600">
 <Icon name="error" className="h-4 w-4 flex-shrink-0" />
 <span className="text-sm">{error}</span>
 </div>
 <button
 onClick={() => setError(null)}
 className="text-red-600 hover:text-red-700 transition-colors"
 >
 <Icon name="close" className="h-4 w-4" />
 </button>
 </div>
 )}

 {/* Channel filter */}
 <div className="p-4 border-b border-grey-200 bg-grey-50">
 <ChannelFilter
 selected={selectedChannel}
 onChange={setSelectedChannel}
 counts={channelCounts as Record<Channel | "ALL", number>}
 />
 </div>

 {/* Main content */}
 <div className="flex-1 flex min-h-0">
 {/* Message list */}
 <div className="w-96 border-r border-grey-200 overflow-auto bg-white">
 <MessageList
 messages={filteredMessages}
 selectedId={selectedMessageId}
 onSelect={setSelectedMessageId}
 />
 </div>

 {/* Message detail */}
 <div className="flex-1 bg-grey-50 overflow-hidden">
 {selectedMessage ? (
 <MessageDetail
 message={selectedMessage}
 onApprove={handleApprove}
 onReject={handleReject}
 />
 ) : (
 <div className="flex items-center justify-center h-full text-grey-400">
 <div className="text-center">
 <p className="text-lg font-medium mb-1 text-black">
 Velg en melding for å se detaljer
 </p>
 <p className="text-sm">
 {filteredMessages.length} meldinger i denne visningen
 </p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </>
 );
}
