import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getMyConversations } from "./chat-actions";
import { AdminChatClient } from "./admin-chat-client";

export const metadata = {
  title: "Meldinger | CoachHQ",
};

export default async function MeldingerPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/");

  const conversations = await getMyConversations();

  return (
    <AdminChatClient
      conversations={conversations}
      currentUserId={user.id}
    />
  );
}
