import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFriends,
  getPendingRequests,
  getActiveChallenges,
  getFriendsLeaderboard,
} from "./actions";
import { SosialtClient } from "./sosialt-client";

export default async function SosialtPage() {
  const user = await requirePortalUser();
  if (!user?.id) return null;

  const [friends, pendingRequests, challenges, leaderboard] =
    await Promise.all([
      getFriends(),
      getPendingRequests(),
      getActiveChallenges(),
      getFriendsLeaderboard("handicap"),
    ]);

  return (
    <SosialtClient
      friends={friends}
      pendingRequests={pendingRequests}
      challenges={challenges}
      leaderboard={leaderboard}
      currentUserId={user.id}
    />
  );
}
