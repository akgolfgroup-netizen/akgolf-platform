import { Stepper } from "@/components/booking-v2/Stepper";
import { Calendar } from "@/components/booking-v2/Calendar";
import { SlotPicker } from "@/components/booking-v2/SlotPicker";
import { SummaryFooter } from "@/components/booking-v2/SummaryFooter";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";

interface PageProps {
  searchParams: Promise<{ service?: string; trainer?: string }>;
}

export default async function TidPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceId = params.service ?? "performance";
  const trainerId = params.trainer ?? "anders";

  const service = SERVICES.find((s) => s.id === serviceId);
  const trainer = TRAINERS.find((t) => t.id === trainerId);

  const advanceText =
    service?.maxAdvanceDays === 28
      ? "Performance-abonnement kan booke 4 uker frem."
      : "Flex-tjenester kan bookes 3 uker frem.";

  const next = new URLSearchParams();
  next.set("service", serviceId);
  next.set("trainer", trainerId);
  next.set("date", "2026-04-28");
  next.set("time", "14:30");

  return (
    <>
      <Stepper current={4} />
      <section className="step-page active" data-step={4}>
        <p className="eyebrow">
          <span className="num">04 / 07</span>
          Velg dato og tid
        </p>
        <h1 className="t-section">
          Når <em>passer</em> det?
        </h1>
        <p className="lede">Tider vises i din lokale tidssone (Europe/Oslo). {advanceText}</p>

        <div className="dt-grid">
          <Calendar />
          <SlotPicker />
        </div>

        <SummaryFooter
          backHref={`/booking-v2/velg-trener?service=${serviceId}`}
          nextHref={`/booking-v2/dine-detaljer?${next.toString()}`}
          items={[
            { label: "Tjeneste", value: `${service?.name ?? ""}${service?.nameEm ? " " + service.nameEm : ""}` },
            { label: "Trener", value: trainer?.name ?? "Begge" },
            { label: "Tid", value: "28. apr · 14:30" },
            { label: "Pris", value: `${service?.price ?? ""}${service?.priceUnit ?? ""}` },
          ]}
        />
      </section>
    </>
  );
}
