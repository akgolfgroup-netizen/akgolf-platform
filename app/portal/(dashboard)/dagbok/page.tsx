import { requirePortalUser } from "@/lib/portal/auth";
import { getTrainingLogs, getLoggedSessionIds, getLastSession } from "./actions";
import { DagbokClient } from "./dagbok-client";

export default async function DagbokPage() {
  await requirePortalUser();
  const [logs, loggedIds, lastSession] = await Promise.all([
    getTrainingLogs(),
    getLoggedSessionIds(),
    getLastSession(),
  ]);

  return (
    <DagbokClient
      initialLogs={logs}
      loggedSessionIds={loggedIds}
      lastSession={lastSession}
    />
  );
}
