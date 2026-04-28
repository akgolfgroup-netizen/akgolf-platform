import { Layers, Download } from "lucide-react";
import { CoachHQPageHead } from "@/components/admin/coachhq-page-head";
import { PeriodFilter } from "@/components/admin/analytics/v2/period-filter";
import { KpiRow } from "@/components/admin/analytics/v2/kpi-row";
import { HeatmapCard } from "@/components/admin/analytics/v2/heatmap-card";
import { FreeSlotsCard } from "@/components/admin/analytics/v2/free-slots-card";
import { FunnelCard } from "@/components/admin/analytics/v2/funnel-card";
import { RevenueDonutCard } from "@/components/admin/analytics/v2/revenue-donut-card";
import { CoachTimeCard } from "@/components/admin/analytics/v2/coach-time-card";
import { NewPlayersCard } from "@/components/admin/analytics/v2/new-players-card";
import { NpsCard } from "@/components/admin/analytics/v2/nps-card";

export default function AnalyticsPage() {
  return (
    <div
      className="min-h-full px-7 pb-12 pt-6"
      style={{ background: "#102B1E", color: "#E6EAE8" }}
    >
      <CoachHQPageHead
        eyebrow="/ INNSIKT · ANALYTICS"
        title="Drift & effekt på et øyeblikk."
        description="Belegg per dag og time, konvertering fra besøk til betalt spiller, hvilke tjenester som vokser, hvor coach-tida brukes, og hva HCP-utviklingen ser ut som per kohort."
        actions={[
          { label: "Eksporter dashboard", icon: Layers, variant: "default" },
          { label: "PDF til styret", icon: Download, variant: "primary" },
        ]}
      />

      <PeriodFilter />
      <KpiRow />

      <div className="mb-[18px] grid gap-[18px]" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <HeatmapCard />
        <FreeSlotsCard />
      </div>

      <div className="mb-[18px] grid grid-cols-2 gap-[18px]">
        <FunnelCard />
        <RevenueDonutCard />
      </div>

      <div className="mb-[18px] grid grid-cols-3 gap-[18px]">
        <CoachTimeCard />
        <NewPlayersCard />
        <NpsCard />
      </div>
    </div>
  );
}
