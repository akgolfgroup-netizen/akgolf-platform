import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { ChatClient } from "./chat-client";

export default async function AIAssistentPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal/login");

  return <ChatClient />;
}
