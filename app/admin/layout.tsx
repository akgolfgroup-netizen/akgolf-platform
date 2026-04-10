import { requirePortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { MCLayout } from "@/components/portal/mission-control";

export const metadata = { title: "AK Golf — Mission Control" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requirePortalUser();

  if (!user) redirect("/admin/login");

  if (!canAccessMissionControl(user.role)) {
    redirect("/portal");
  }

  return (
    <MCLayout
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
    >
      {children}
    </MCLayout>
  );
}
