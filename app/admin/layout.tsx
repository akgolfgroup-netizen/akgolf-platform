import { getPortalUser } from "@/lib/portal/auth";
import { canAccessMissionControl } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { MCLayout } from "@/components/portal/mission-control";

export const metadata = { title: "AK Golf — Mission Control" };

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
