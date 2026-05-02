import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFriends,
  getFriendsLeaderboard,
  getPendingRequests,
} from "./actions";
import { SosialtClientV2 } from "@/components/portal/social/v2/sosialt-client-v2";

export default async function SosialtPage() {
  await requirePortalUser();

  const [
    friends,
    leaderboardHandicap,
    leaderboardImprovement,
    leaderboardStreak,
    pendingRequests,
  ] = await Promise.all([
    getFriends(),
    getFriendsLeaderboard("handicap"),
    getFriendsLeaderboard("improvement"),
    getFriendsLeaderboard("streak"),
    getPendingRequests(),
  ]);

  return (
    <SosialtClientV2
      friends={friends}
      leaderboard={leaderboardHandicap}
      leaderboardImprovement={leaderboardImprovement}
      leaderboardStreak={leaderboardStreak}
      pendingRequests={pendingRequests}
    />
  );
}
