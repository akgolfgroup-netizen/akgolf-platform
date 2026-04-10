import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { NotificationManager } from "./notification-manager";

export default async function AdminNotificationsPage() {
  const user = await requirePortalUser();
  
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-grey-900)]">
          Notifikasjoner
        </h1>
        <p className="text-sm text-[var(--color-grey-500)] mt-1">
          Send push-notifikasjoner til spillere
        </p>
      </div>

      <NotificationManager />
    </div>
  );
}
