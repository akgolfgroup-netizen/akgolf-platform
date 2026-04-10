"use server";

/**
 * Server actions for spillerens meldingsside.
 * Re-eksporterer fra chat-actions for gjenbruk.
 */

export {
  getMyConversations,
  getConversationMessages,
  sendDirectMessage,
  markConversationAsRead,
} from "@/app/portal/(dashboard)/admin/meldinger/chat-actions";
