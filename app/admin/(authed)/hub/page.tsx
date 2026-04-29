import { requirePortalUser } from "@/lib/portal/auth";
import { CoachHQDarkShell } from "@/components/admin/coachhq-dark/CoachHQDarkShell";
import { HubClient } from "./hub-client";
import { getHubStats, getHubModuleCounts, getHubActivity } from "./hub-actions";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Hub-oversikt | AK Golf CoachHQ",
};

export default async function HubPage() {
  const user = await requirePortalUser();

  // Tom-state fallbacks — siden skal aldri 500'e
  const safe = <T,>(p: Promise<T>, label: string, fallback: T): Promise<T> =>
    p.catch((err) => {
      console.error(`[hub] ${label} failed:`, err);
      return fallback;
    });

  const [stats, counts, activity] = await Promise.all([
    safe(getHubStats(), "getHubStats", {
      activeStudents: 0,
      weeklySessionsCount: 0,
      utilizationPct: 0,
      mtdRevenueK: 0,
    }),
    safe(getHubModuleCounts(), "getHubModuleCounts", {
      todaysFocusCount: 0,
      pendingApprovals: 0,
      unreadMessages: 0,
      activeStudents: 0,
    }),
    safe(getHubActivity(), "getHubActivity", []),
  ]);

  const userForShell = {
    id: user.id,
    name: user.name,
    email: user.email,
  };

  return (
    <CoachHQDarkShell
      user={userForShell}
      title="CoachHQ Hub"
      meta="ALL DRIFT EN PLASS"
    >
      <HubClient
        userName={user.name ?? "coach"}
        stats={stats}
        counts={counts}
        activity={activity}
      />
    </CoachHQDarkShell>
  );
}
