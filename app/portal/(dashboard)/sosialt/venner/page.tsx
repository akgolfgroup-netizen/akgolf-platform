import { requirePortalUser } from "@/lib/portal/auth";
import { getFriends, getPendingRequests } from "../actions";
import VennerClient from "./venner-client";

export default async function VennerPage() {
  await requirePortalUser();

  const [friends, pendingRequests] = await Promise.all([
    getFriends(),
    getPendingRequests(),
  ]);

  return (
    <VennerClient
      friends={friends}
      pendingRequests={pendingRequests}
    />
  );
}
