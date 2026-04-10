import { getPlayerBag } from "./actions";
import { BagClient } from "./bag-client";

export default async function BagPage() {
  const { clubs, gapAnalysis } = await getPlayerBag();

  return <BagClient clubs={clubs} gapAnalysis={gapAnalysis} />;
}
