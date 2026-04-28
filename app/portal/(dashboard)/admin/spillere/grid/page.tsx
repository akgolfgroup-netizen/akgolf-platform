import { PlayersGridClient } from "@/components/admin/spillere/players-grid-client";
import { MOCK_PLAYER_GROUPS } from "@/components/admin/spillere/mock-data";

// TODO: erstatt mock med ekte data fra getPlayerGroups() server action
// (lib/portal/players/get-player-groups.ts) i Sprint 1 Blokk D.
// Grupperingen "Trenger handling" / "Stiger" / "Stabile" kommer fra
// CoachingSignals + DataGolf SG-trend siste 30 dager.

export default function SpillereGridPage() {
  return <PlayersGridClient groups={MOCK_PLAYER_GROUPS} />;
}
