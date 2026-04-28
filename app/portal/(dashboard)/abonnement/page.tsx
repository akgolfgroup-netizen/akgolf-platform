import { requirePortalUser } from "@/lib/portal/auth";
import { getSubscriptionData } from "./actions";
import { AbonnementV2Client } from "@/components/portal/abonnement/v2/abonnement-v2-client";

export default async function AbonnementPage() {
  await requirePortalUser();
  const data = await getSubscriptionData();
  return <AbonnementV2Client data={data} />;
}
