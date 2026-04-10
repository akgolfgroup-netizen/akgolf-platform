import { requirePortalUser } from "@/lib/portal/auth";
import { getTrackManOverview } from "./actions";
import { TrackManClient } from "./trackman-client";

export default async function TrackManPage() {
  await requirePortalUser();

  const data = await getTrackManOverview();

  return <TrackManClient data={data} />;
}
