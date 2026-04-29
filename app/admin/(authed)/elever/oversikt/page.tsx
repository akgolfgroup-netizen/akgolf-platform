import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark";
import { getElevOversikt } from "./actions";
import { ElevOversiktClient } from "./elev-oversikt-client";

export const metadata = {
  title: "Spillere · Oversikt | AK Golf CoachHQ",
};

export const dynamic = "force-dynamic";

export default async function ElevOversiktPage() {
  const user = await requirePortalUser();

  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  const rows = await getElevOversikt();

  return (
    <CoachHQDarkShell
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }}
      title="Spillere — Oversikt"
      meta={`${rows.length} spillere · gruppert på framgang`}
    >
      <ElevOversiktClient rows={rows} />
    </CoachHQDarkShell>
  );
}
