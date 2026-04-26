import { Stepper } from "@/components/booking-v2/Stepper";
import { PaymentMethodPicker } from "@/components/booking-v2/PaymentMethodPicker";
import { RecapCard } from "@/components/booking-v2/RecapCard";
import { SummaryFooter } from "@/components/booking-v2/SummaryFooter";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";

interface PageProps {
  searchParams: Promise<{
    service?: string;
    trainer?: string;
    date?: string;
    time?: string;
  }>;
}

export default async function BetalPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceId = params.service ?? "performance";
  const trainerId = params.trainer ?? "anders";

  const service = SERVICES.find((s) => s.id === serviceId);
  const trainer = TRAINERS.find((t) => t.id === trainerId);
  const isSubscription = service?.category === "abonnement";

  const next = new URLSearchParams(params as Record<string, string>);

  return (
    <>
      <Stepper current={6} />
      <section className="step-page active" data-step={6}>
        <p className="eyebrow">
          <span className="num">06 / 07</span>
          Betaling
        </p>
        <h1 className="t-section">
          Bekreft og <em>betal</em>.
        </h1>
        <p className="lede">
          Vi reserverer slottet ditt så snart betalingen går gjennom. Du blir ikke trukket to ganger.
        </p>

        <div className="details-grid">
          <PaymentMethodPicker />

          <RecapCard
            heading="Oppsummering"
            lines={[
              {
                label: "Tjeneste",
                value: `${service?.name ?? ""}${service?.nameEm ? " " + service.nameEm : ""}`,
              },
              { label: "Tid", value: "28. apr · 14:30" },
              { label: "Trener", value: trainer?.name ?? "Begge" },
            ]}
            total={{ label: "Å betale nå", value: service?.price ?? "" }}
            policy={
              isSubscription
                ? "Løpende abonnement — trekkes hver 30. dag. Du kan si opp når som helst fra Min side."
                : "Engangsbetaling. Beløpet vises som AK GOLF OSLO på kontoutskriften."
            }
          />
        </div>

        <SummaryFooter
          backHref={`/booking-v2/dine-detaljer?${new URLSearchParams(params as Record<string, string>).toString()}`}
          nextHref={`/booking-v2/bekreftelse?${next.toString()}`}
          nextLabel={`Bekreft og betal`}
          nextVariant="accent"
          items={[{ label: "Steg", value: "06 av 07" }]}
        />
      </section>
    </>
  );
}
