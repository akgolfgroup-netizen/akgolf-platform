import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getTemplates } from "./actions";
import { EPostmalerClient } from "./e-postmaler-client";

export default async function EPostmalerPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const templates = await getTemplates();

  return <EPostmalerClient templates={templates} />;
}
