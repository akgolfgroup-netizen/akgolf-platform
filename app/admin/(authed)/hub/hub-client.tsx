import { HubHero } from "@/components/admin/coachhq-dark/d27/hub-hero";
import { ModuleStrip } from "@/components/admin/coachhq-dark/d27/module-strip";
import { ActivityPanel } from "@/components/admin/coachhq-dark/d27/activity-panel";
import { QuickActionsPanel } from "@/components/admin/coachhq-dark/d27/quick-actions-panel";
import type {
  HubStats,
  HubModuleCounts,
  HubActivityItem,
} from "./hub-actions";

interface HubClientProps {
  userName: string;
  stats: HubStats;
  counts: HubModuleCounts;
  activity: HubActivityItem[];
}

/**
 * Hub-oversikt — pixel-naer match til d27-hub-oversikt.html mockup.
 *
 * Layout (mockup d27):
 *   1. HubHero (gradient + greeting + 4 stats)
 *   2. ModuleStrip (8 modul-kort i 4-kolonne grid)
 *   3. Bottom-split (1.5fr 1fr): ActivityPanel | QuickActionsPanel
 *
 * Server Component — ingen interaktivitet pa selve siden, kun lenker.
 */
export function HubClient({
  userName,
  stats,
  counts,
  activity,
}: HubClientProps) {
  // Bygg kontekst-setning for hero basert pa modul-tellere
  const contextParts: string[] = [];
  if (counts.todaysFocusCount > 0) {
    contextParts.push(`${counts.todaysFocusCount} økter i dag`);
  }
  if (counts.pendingApprovals > 0) {
    contextParts.push(`${counts.pendingApprovals} godkjenninger venter`);
  }
  const contextLine =
    contextParts.length > 0
      ? `${contextParts.join(", ")}. Klikk en modul nedenfor eller bruk hurtig-handlinger til høyre.`
      : "Klikk en modul nedenfor eller bruk hurtig-handlinger til høyre.";

  return (
    <div className="space-y-6">
      <HubHero
        userName={userName}
        stats={stats}
        contextLine={contextLine}
      />

      <ModuleStrip counts={counts} stats={stats} />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <ActivityPanel items={activity} />
        <QuickActionsPanel />
      </div>
    </div>
  );
}
