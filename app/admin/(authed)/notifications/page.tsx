import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/portal/coach-hq/ui";
import { NotificationManager } from "./notification-manager";

export default async function AdminNotificationsPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl">
      <AdminPageHeader
        title="Notifikasjoner"
        subtitle="Send push-notifikasjoner til spillere"
      />
      <NotificationManager />
    </div>
  );
}
