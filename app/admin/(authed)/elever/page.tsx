import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { fetchStudents } from "./actions";
import { StudentsClient } from "./students-client";

export const metadata = {
  title: "Spillere | AK Golf CoachHQ",
};

export const dynamic = "force-dynamic";

export default async function StudentsPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const initialData = await fetchStudents("", 1);
  const total = initialData.stats.total;

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
      meta={`${initialData.stats.active} aktive · ${initialData.stats.newThisMonth} nye denne uken · ${total} totalt`}
    >
      <StudentsClient initialData={initialData} />
    </CoachHQDarkShell>
  );
}
