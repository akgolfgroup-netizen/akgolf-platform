import { requirePortalUser } from "@/lib/portal/auth";
import {
  getFriends,
  getFriendsLeaderboard,
  getPendingRequests,
} from "./actions";
import SosialtClient from "./sosialt-client";

export default async function SosialtPage() {
  const user = await requirePortalUser();

  const [friends, leaderboard, pendingRequests] = await Promise.all([
    getFriends(),
    getFriendsLeaderboard("handicap"),
    getPendingRequests(),
  ]);

  return (
    <SosialtClient
      friends={friends}
      leaderboard={leaderboard}
      pendingRequests={pendingRequests}
      currentUserName={user.name ?? "Ukjent"}
    />
  );
}
