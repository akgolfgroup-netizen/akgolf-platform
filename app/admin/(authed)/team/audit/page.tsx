import { redirect } from "next/navigation";
import { UserRole, Capability } from "@prisma/client";
import { requirePortalUser } from "@/lib/portal/auth";
import { hasCapability } from "@/lib/portal/capabilities/check";
import { fetchAuditLog } from "../actions";
import { AuditClient } from "./audit-client";

export const metadata = {
  title: "Audit-logg | AK Golf Mission Control",
};
export const dynamic = "force-dynamic";

export default async function AuditPage() {
  const user = await requirePortalUser();

  const allowed =
    user.role === UserRole.ADMIN ||
    (await hasCapability(user.id, Capability.GDPR_VIEW_AUDIT_LOG)) ||
    (await hasCapability(user.id, Capability.USERS_ASSIGN_CAPABILITIES));

  if (!allowed) {
    redirect("/admin/team");
  }

  const rows = await fetchAuditLog({ limit: 300 });

  return <AuditClient initialRows={rows} />;
}
