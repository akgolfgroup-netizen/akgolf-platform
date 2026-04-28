import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFriends,
  getFriendsLeaderboard,
  getPendingRequests,
} from "./actions";
import { SosialtClientV2 } from "@/components/portal/social/v2/sosialt-client-v2";

export default async function SosialtPage() {
  await requirePortalUser();

  const [friends, leaderboard, pendingRequests] = await Promise.all([
    getFriends(),
    getFriendsLeaderboard("handicap"),
    getPendingRequests(),
  ]);

  return (
    <SosialtClientV2
      friends={friends}
      leaderboard={leaderboard}
      pendingRequests={pendingRequests}
    />
  );
}
