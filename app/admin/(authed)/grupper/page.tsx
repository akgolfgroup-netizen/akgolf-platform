import { listGroups, listAvailablePlayers } from "./actions";
import { GrupperClient } from "./grupper-client";

export const metadata = { title: "Treningsgrupper — AK Golf" };
export const dynamic = "force-dynamic";

export default async function GrupperPage() {
  const groups = await listGroups();
  const availablePlayers = await listAvailablePlayers();

  return (
    <GrupperClient
      initialGroups={groups}
      initialPlayers={availablePlayers}
    />
  );
}
