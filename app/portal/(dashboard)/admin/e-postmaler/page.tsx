import { requirePortalUser } from "@/lib/portal/auth";
import { isAdmin } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getTemplates } from "./actions";
import { EmailTemplateEditor } from "@/components/portal/admin/email-template-editor";

export const dynamic = "force-dynamic";

export default async function EmailTemplatesPage() {
  const user = await requirePortalUser();
  if (!user?.id || !isAdmin(user.role)) {
    redirect("/portal");
  }

  const templates = await getTemplates();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          E-postmaler
        </h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          Opprett og rediger e-postmaler med dynamiske variabler
        </p>
      </div>
      <EmailTemplateEditor initialTemplates={templates} />
    </div>
  );
}
