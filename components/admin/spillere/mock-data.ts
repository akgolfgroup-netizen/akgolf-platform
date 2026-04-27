// Aggregat av mock-data for spillere-sider.
// TODO: erstatt med ekte data fra getPlayers() / getPlayerGroups() server actions.

import { ALERT_CARDS } from "./mock-cards-alert";
import { RISING_CARDS, STABLE_CARDS } from "./mock-cards-rising";
import type { PlayerGroup } from "./types";

export { MOCK_PLAYER_ROWS } from "./mock-rows";

export const MOCK_PLAYER_GROUPS: PlayerGroup[] = [
  {
    id: "trenger-handling",
    title: "Trenger handling",
    count: "7 spillere",
    tone: "alert",
    cards: ALERT_CARDS,
  },
  {
    id: "stiger",
    title: "Stiger",
    count: "14 spillere — viser 6",
    tone: "up",
    cards: RISING_CARDS,
  },
  {
    id: "stabile",
    title: "Stabile",
    count: "21 spillere — viser 3",
    tone: "default",
    cards: STABLE_CARDS,
  },
];
