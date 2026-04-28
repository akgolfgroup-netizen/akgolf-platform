import { PlayersListClient } from "@/components/admin/spillere/players-list-client";
import { MOCK_PLAYER_ROWS } from "@/components/admin/spillere/mock-data";

// TODO: erstatt mock med ekte data fra getPlayers() server action
// (lib/portal/players/get-players.ts) i Sprint 1 Blokk D.
// Kilder: prisma.user (rolle STUDENT) + Player + siste 5 PlayerSession + DataGolf.

export default function SpillerePage() {
  return <PlayersListClient rows={MOCK_PLAYER_ROWS} />;
}
