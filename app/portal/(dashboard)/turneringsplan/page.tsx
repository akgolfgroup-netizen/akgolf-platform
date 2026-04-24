import { requirePortalUser } from "@/lib/portal/auth";
import { getPlayerTournaments } from "./actions";
import { TurneringsplanClient } from "./turneringsplan-client";

export const metadata = {
  title: "Turneringsplan | PlayersHQ",
};

export default async function TurneringsplanPage() {
  await requirePortalUser();

  const { tournaments, stats, completedTournaments } = await getPlayerTournaments();

  return (
    <TurneringsplanClient
      tournaments={tournaments}
      stats={stats}
      completedTournaments={completedTournaments}
    />
  );
}
