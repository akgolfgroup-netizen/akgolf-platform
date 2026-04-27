import { Plus, Download } from "lucide-react";
import { CoachHQPageHead } from "@/components/admin/coachhq-page-head";
import { ReportSidebar } from "@/components/admin/rapporter/report-sidebar";
import { FilterBar } from "@/components/admin/rapporter/filter-bar";
import { KpiRow } from "@/components/admin/rapporter/kpi-row";
import { HcpLineChart } from "@/components/admin/rapporter/hcp-line-chart";
import { TopPlayersCard } from "@/components/admin/rapporter/top-players-card";
import { ServiceMixCard } from "@/components/admin/rapporter/service-mix-card";

export default function RapporterPage() {
  return (
    <div
      className="min-h-full px-7 pb-12 pt-6"
      style={{ background: "#102B1E", color: "#E6EAE8" }}
    >
      <CoachHQPageHead
        eyebrow="/ ØKONOMI · RAPPORTER"
        title="Innsikt og effekt-måling."
        description="Ferdigbygde rapporter for coaching-effekt, drift og økonomi. Eksporter til PDF eller send rett til klubb-styret. Egen rapport-bygger for tilpassede dashboards."
        actions={[
          { label: "Ny rapport", icon: Plus, variant: "default" },
          { label: "Eksport PDF", icon: Download, variant: "primary" },
        ]}
      />

      <div className="grid items-start gap-[18px]" style={{ gridTemplateColumns: "280px 1fr" }}>
        <ReportSidebar />

        <div>
          <FilterBar />
          <KpiRow />
          <HcpLineChart />
          <div className="grid grid-cols-2 gap-[18px]">
            <TopPlayersCard />
            <ServiceMixCard />
          </div>
        </div>
      </div>
    </div>
  );
}
