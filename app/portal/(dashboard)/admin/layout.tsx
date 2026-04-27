import { redirect } from "next/navigation";
import { getPortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import { CoachHQShell } from "@/components/admin/coachhq-shell";

export const metadata = { title: "AK Golf — CoachHQ" };
export const dynamic = "force-dynamic";

export default async function CoachHQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getPortalUser();

  if (!user) {
    redirect("/portal/login");
  }

  if (!canAccessMissionControl(user.role)) {
    redirect("/portal");
  }

  return <CoachHQShell>{children}</CoachHQShell>;
}
