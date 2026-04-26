import { getPortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { AdminShell } from "./admin-shell";

export const metadata = { title: "AK Golf — CoachHQ" };
export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPortalUser();

  if (!user) redirect("/admin/login");

  if (!canAccessMissionControl(user.role)) {
    redirect("/admin/login");
  }

  return (
    <AdminShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
    >
      {children}
    </AdminShell>
  );
}
