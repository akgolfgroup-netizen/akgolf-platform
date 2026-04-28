import { Download, ExternalLink } from "lucide-react";
import { CoachHQPageHead } from "@/components/admin/coachhq-page-head";
import { OkonomiHero } from "@/components/admin/okonomi/okonomi-hero";
import { PayoutCard } from "@/components/admin/okonomi/payout-card";
import { RevenueBarChart } from "@/components/admin/okonomi/revenue-bar-chart";
import { TransactionList } from "@/components/admin/okonomi/transaction-list";
import { CategoryBreakdown } from "@/components/admin/okonomi/category-breakdown";

export default function OkonomiPage() {
  return (
    <div
      className="min-h-full px-7 pb-12 pt-6"
      style={{ background: "#102B1E", color: "#E6EAE8" }}
    >
      <CoachHQPageHead
        eyebrow="/ ØKONOMI · OVERSIKT"
        title="Inntekter, utbetalinger, refusjoner."
        description="Live data fra Stripe. Utbetaling skjer 1. og 15. hver måned. Refusjoner og endringer godkjennes manuelt fra Godkjenninger-panelet."
        actions={[
          { label: "Eksporter", icon: Download, variant: "default" },
          { label: "Åpne Stripe", icon: ExternalLink, variant: "primary" },
        ]}
      />

      <OkonomiHero />
      <PayoutCard />
      <RevenueBarChart />

      <div
        className="grid gap-[18px]"
        style={{ gridTemplateColumns: "1.5fr 1fr" }}
      >
        <TransactionList />
        <CategoryBreakdown />
      </div>
    </div>
  );
}
