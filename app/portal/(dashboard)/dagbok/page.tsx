import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds } from "./actions";
import { DagbokClient } from "./dagbok-client";

export default async function DagbokPage() {
  const user = await requirePortalUser();
  const [logs, loggedIds] = await Promise.all([
    getTrainingLogs(),
    getLoggedSessionIds(),
  ]);

  return <DagbokClient initialLogs={logs} loggedSessionIds={loggedIds} />;
}
