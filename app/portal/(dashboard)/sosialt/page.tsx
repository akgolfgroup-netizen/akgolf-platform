import { requirePortalUser } from "@/lib/portal/auth";
import { getFriends, getFriendsLeaderboard } from "./actions";
import SosialtClient from "./sosialt-client";
import type {
  SosialtActivity,
  SosialtGroup,
} from "./sosialt-client";

export default async function SosialtPage() {
  const user = await requirePortalUser();

  // Hent venner og leaderboard parallelt
  const [friends, leaderboard] = await Promise.all([
    getFriends(),
    getFriendsLeaderboard("handicap"),
  ]);

  // Aktivitetsfeed og grupper finnes ikke i actions enn\u00e5.
  // Sender tomme arrays — klar for fremtidig implementasjon.
  const activity: SosialtActivity[] = [];
  const groups: SosialtGroup[] = [];

  return (
    <SosialtClient
      friends={friends}
      activity={activity}
      leaderboard={leaderboard}
      groups={groups}
      currentUserName={user.name ?? "Ukjent"}
    />
  );
}
