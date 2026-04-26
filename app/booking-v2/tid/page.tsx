import { Stepper } from "@/components/booking-v2/Stepper";
import { Calendar } from "@/components/booking-v2/Calendar";
import { SlotPicker } from "@/components/booking-v2/SlotPicker";
import { SummaryFooter } from "@/components/booking-v2/SummaryFooter";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";
import { getAvailableSlots } from "../actions";

interface PageProps {
  searchParams: Promise<{
    service?: string;
    trainer?: string;
    date?: string;
    serviceTypeId?: string;
    instructorId?: string;
  }>;
}

export default async function TidPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceId = params.service ?? "performance";
  const trainerId = params.trainer ?? "anders";
  const dateParam = params.date ?? "2026-04-28";

  const service = SERVICES.find((s) => s.id === serviceId);
  const trainer = TRAINERS.find((t) => t.id === trainerId);

  const advanceText =
    service?.maxAdvanceDays === 28
      ? "Performance-abonnement kan booke 4 uker frem."
      : "Flex-tjenester kan bookes 3 uker frem.";

  // Hvis URL-en inneholder ekte ServiceType.id (cuid) — hent ekte slots med smart packing.
  // Ellers: SlotPicker faller tilbake til placeholder-data.
  let realSlots: string[] = [];
  if (params.serviceTypeId) {
    try {
      realSlots = await getAvailableSlots({
        serviceTypeId: params.serviceTypeId,
        instructorId: params.instructorId,
        date: dateParam,
      });
    } catch {
      // Stille feil — placeholder-data overtar i SlotPicker
      realSlots = [];
    }
  }

  const next = new URLSearchParams();
  next.set("service", serviceId);
  next.set("trainer", trainerId);
  next.set("date", dateParam);
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
          <SlotPicker slots={realSlots.length > 0 ? realSlots : undefined} />
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
