import { requirePortalUser } from "@/lib/portal/auth";
import { getPlayerTournaments } from "./actions";
import { TurneringsplanClient } from "./turneringsplan-client";

export const metadata = {
  title: "Turneringsplan | AK Golf Portal",
};

export default async function TurneringsplanPage() {
  await requirePortalUser();

  const { tournaments, stats } = await getPlayerTournaments();

  return (
    <TurneringsplanClient
      tournaments={tournaments}
      stats={stats}
    />
  );
}
