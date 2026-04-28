import { TjenesterPageHeader } from "@/components/admin/tjenester/page-header";
import { SummaryKpis } from "@/components/admin/tjenester/summary-kpis";
import { ServiceTabs } from "@/components/admin/tjenester/service-tabs";
import {
  ServiceRow,
  ServiceTableHeader,
} from "@/components/admin/tjenester/service-row";
import { SERVICES } from "@/components/admin/tjenester/mock-data";

// TODO: koble til ekte data
// - services: prisma.serviceType.findMany med Stripe-priser
// - bookingsPerMonth: aggregat fra Booking siste 30 dager
// - tabs: counts pr kategori
// - status: ny field på ServiceType (live/draft/archived)

export default function TjenesterPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <TjenesterPageHeader />
      <SummaryKpis />
      <ServiceTabs />

      <section className="overflow-hidden rounded-2xl border border-[#1a4a3a] bg-[#0D2E23]">
        <ServiceTableHeader />
        {SERVICES.map((service, idx) => (
          <ServiceRow
            key={service.id}
            service={service}
            isLast={idx === SERVICES.length - 1}
          />
        ))}
      </section>
    </div>
  );
}
