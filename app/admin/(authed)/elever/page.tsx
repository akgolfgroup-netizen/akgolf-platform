import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { EleverClientV2 } from "./elever-client-v2";
import { fetchStudents } from "./actions";

export const metadata = {
  title: "Spillere | AK Golf CoachHQ",
};
export const dynamic = "force-dynamic";

export default async function EleverPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const data = await fetchStudents("", 1);

  return (
    <CoachHQDarkShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
      title="Spillere"
      meta={`${data.total} totalt · ${data.stats.active} aktive`}
    >
      <EleverClientV2 initialData={data} />
    </CoachHQDarkShell>
  );
}
