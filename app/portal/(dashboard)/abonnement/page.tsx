import { requirePortalUser } from "@/lib/portal/auth";
import { getSubscriptionData } from "./actions";
import AbonnementClient from "./abonnement-client";

export default async function AbonnementPage() {
  await requirePortalUser();
  const data = await getSubscriptionData();
  return <AbonnementClient data={data} />;
}
