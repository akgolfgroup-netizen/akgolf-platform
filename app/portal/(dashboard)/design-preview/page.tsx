import { requirePortalUser } from "@/lib/portal/auth";
import { isStaff } from "@/lib/portal/rbac";
import { redirect } from "next/navigation";
import { DesignPreviewClient } from "./design-preview-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Design Preview v3.1 | PlayersHQ",
};

export default async function DesignPreviewPage() {
  const user = await requirePortalUser();
  if (!isStaff(user.role)) {
    redirect("/portal");
  }

  return <DesignPreviewClient />;
}
