import { getPlayerBag } from "./actions";
import { BagClientV2 } from "@/components/portal/bag/v2/bag-client-v2";

export default async function BagPage() {
  const { clubs, gapAnalysis } = await getPlayerBag();

  return <BagClientV2 clubs={clubs} gapAnalysis={gapAnalysis} />;
}
