import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { getTasks } from "./actions";
import { FocusDarkClient } from "./focus-dark-client";

export const metadata = {
  title: "Dagens fokus | AK Golf CoachHQ",
};

export default async function FocusPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const tasks = await getTasks();

  return <FocusDarkClient user={user} initialTasks={tasks} />;
}
