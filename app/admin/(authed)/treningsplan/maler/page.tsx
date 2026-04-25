import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { listTemplatesForAdmin } from "./actions";
import { TemplatesClient } from "./templates-client";

export default async function TemplatesAdminPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const templates = await listTemplatesForAdmin();

  return (
    <TemplatesClient
      initialTemplates={templates.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        iconName: t.iconName,
        badge: t.badge,
        periodType: t.periodType,
        weekPattern: t.weekPattern,
        weeklyFocusTemplate: t.weeklyFocusTemplate,
        isPublic: t.isPublic,
        isActive: t.isActive,
        sortOrder: t.sortOrder,
        sessionCount: t.weekPattern.length,
      }))}
    />
  );
}
