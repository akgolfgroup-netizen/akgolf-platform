import { OkterPageHeader } from "@/components/admin/okter/page-header";
import { OkterStatStrip } from "@/components/admin/okter/stat-strip";
import { HeatmapCard } from "@/components/admin/okter/heatmap-card";
import { OkterToolbar } from "@/components/admin/okter/toolbar";
import { SessionTable } from "@/components/admin/okter/session-table";
import {
  OKTER_STATS,
  HEAT_ROWS,
  DAY_GROUPS,
} from "@/components/admin/okter/mock-data";

// TODO: koble til ekte data
// - sessions: prisma.booking.findMany med Player, Coach og Location
// - heatmap: aggregat per coach per dag siste 28 dager
// - PR-tags: ny modell SessionAchievement eller flagg pa Booking
// - utnyttelse: kapasitet vs faktiske bookinger fra ServiceType

export default function OkterPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <OkterPageHeader
        eyebrow="Plan · Økter"
        title="Alle treningsøkter"
        subtitle="Fullførte og planlagte. Filtrer på type, coach eller spiller. Klikk for full øktdetalj."
      />

      <OkterStatStrip stats={OKTER_STATS} />

      <HeatmapCard rows={HEAT_ROWS} />

      <OkterToolbar />

      <SessionTable groups={DAY_GROUPS} />
    </div>
  );
}
