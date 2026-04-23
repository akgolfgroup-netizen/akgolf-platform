import type { Metadata } from "next";
import { requirePortalUser } from "@/lib/portal/auth";
import { getKartleggingData } from "./actions";
import { KartleggingClient } from "./kartlegging-client";

export const metadata: Metadata = {
  title: "Kartlegging | PlayersHQ",
  description:
    "Din samlede spillerprofil — nivå, styrker, gap og anbefalinger.",
};

export const dynamic = "force-dynamic";

export default async function KartleggingPage() {
  await requirePortalUser();
  const data = await getKartleggingData();
  return <KartleggingClient data={data} />;
}
