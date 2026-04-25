import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { fetchStudents } from "./actions";
import { StudentsClient } from "./students-client";

export const metadata = {
  title: "Elever | AK Golf CoachHQ",
};

export default async function StudentsPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const initialData = await fetchStudents("", 1);

  return <StudentsClient initialData={initialData} />;
}
