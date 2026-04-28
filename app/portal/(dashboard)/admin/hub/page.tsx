import { ActivityPanel } from "@/components/admin/hub/activity-panel";
import { HubHero } from "@/components/admin/hub/hub-hero";
import { ModuleStrip } from "@/components/admin/hub/module-strip";
import { ShortcutsPanel } from "@/components/admin/hub/shortcuts-panel";
import {
  MOCK_ACTIVITY,
  MOCK_MODULES,
  MOCK_SHORTCUTS,
  MOCK_STATS,
} from "@/components/admin/hub/mock-data";

export const metadata = { title: "Hub-oversikt · CoachHQ" };

export default function HubPage() {
  // TODO: koble til ekte data — hent KPI-aggregater, ActivityLog og ulest meldings-count.
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-[#E6EAE8]">
      <HubHero
        label="/ HUB · TIRSDAG 30. APRIL · 09:14"
        greeting="God morgen, Erik."
        greetingAccent="Tett uke foran deg."
        body="4 økter i dag, 3 godkjenninger venter, refusjon Per Rasmussen er klar. Sofie ned 0.4 i HCP — ny PB! Trackman på Anders i går viste +2 mph, alignment-arbeidet sitter."
        stats={MOCK_STATS}
      />

      <ModuleStrip modules={MOCK_MODULES} />

      <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.5fr_1fr]">
        <ActivityPanel activity={MOCK_ACTIVITY} />
        <ShortcutsPanel shortcuts={MOCK_SHORTCUTS} />
      </div>
    </div>
  );
}
