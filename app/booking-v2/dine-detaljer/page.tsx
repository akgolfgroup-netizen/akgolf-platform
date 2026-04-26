import { Stepper } from "@/components/booking-v2/Stepper";
import { DetailsForm } from "@/components/booking-v2/DetailsForm";
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

export default async function DineDetaljerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceId = params.service ?? "performance";
  const trainerId = params.trainer ?? "anders";
  const time = params.time ?? "14:30";

  const service = SERVICES.find((s) => s.id === serviceId);
  const trainer = TRAINERS.find((t) => t.id === trainerId);

  const isSubscription = service?.category === "abonnement";

  const next = new URLSearchParams(params as Record<string, string>);

  return (
    <>
      <Stepper current={5} />
      <section className="step-page active" data-step={5}>
        <p className="eyebrow">
          <span className="num">05 / 07</span>
          Detaljer
        </p>
        <h1 className="t-section">
          Litt om <em>deg</em>.
        </h1>
        <p className="lede">
          Logger du inn, fyller vi inn alt automatisk. Er dette første gang, sender vi en
          innloggingslenke etter at bookingen er bekreftet.
        </p>

        <div className="details-grid">
          <DetailsForm />

          <RecapCard
            heading="Din booking"
            lines={[
              {
                label: "Tjeneste",
                value: `${service?.name ?? ""}${service?.nameEm ? " " + service.nameEm : ""}`,
                small: service?.meta[0],
              },
              {
                label: "Trener",
                value: trainer?.name ?? "Begge",
                small: trainer?.role.split(" · ")[0],
              },
              { label: isSubscription ? "Første økt" : "Tid", value: `Ti 28. apr 2026`, small: `${time} – ${time === "14:30" ? "14:50" : ""}` },
              { label: "Sted", value: "AK Golf studio", small: "Oslo" },
            ]}
            total={{
              label: isSubscription ? "Månedlig" : "Pris",
              value: service?.price ?? "",
            }}
            policy="Gratis avbestilling inntil 24 t før økten. 8–24 t: 50 % gebyr. Mindre enn 8 t: full betaling."
          />
        </div>

        <SummaryFooter
          backHref={`/booking-v2/tid?${new URLSearchParams({
            service: serviceId,
            trainer: trainerId,
          }).toString()}`}
          nextHref={`/booking-v2/betal?${next.toString()}`}
          nextLabel="Til betaling"
          items={[{ label: "Steg", value: "05 av 07" }]}
        />
      </section>
    </>
  );
}
