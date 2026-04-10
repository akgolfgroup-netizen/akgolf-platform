import { requirePortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { getOkonomiData } from "./actions";
import { OkonomiClient } from "./okonomi-client";

export default async function OkonomiPage() {
  const user = await requirePortalUser();

  if (user.role !== "ADMIN") {
    redirect("/portal");
  }

  const data = await getOkonomiData();

  return <OkonomiClient data={data} />;
}
