import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { fetchTalentPlayers } from "./actions";
import { TalentClient } from "./talent-client";

export const metadata = {
  title: "Talent | AK Golf CoachHQ",
};

export const dynamic = "force-dynamic";

export default async function TalentAdminPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) redirect("/portal");

  const initialData = await fetchTalentPlayers({ page: 1 });

  return <TalentClient initialData={initialData} />;
}
