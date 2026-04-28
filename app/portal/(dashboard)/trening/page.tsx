import { requirePortalUser } from "@/lib/portal/auth";
import { TrainingClient } from "@/components/portal/trening/v2/training-client";

export const metadata = {
  title: "Aktive øvelser | AK Golf",
  description: "Dine aktive drills fordelt på Driver, Approach, Around-Green og Putting",
};

export const dynamic = "force-dynamic";

export default async function TreningPage() {
  await requirePortalUser();

  return <TrainingClient />;
}
