import { redirect } from "next/navigation";
import { Stepper } from "@/components/booking-v2/Stepper";
import { Calendar } from "@/components/booking-v2/Calendar";
import { SlotPicker } from "@/components/booking-v2/SlotPicker";
import { SummaryFooter } from "@/components/booking-v2/SummaryFooter";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";
import {
  getBookingV2Service,
  getBookingV2Instructor,
} from "@/lib/booking-v2/services";
import { getQuotaSnapshot, isQuotaExhausted } from "@/lib/booking-v2/quota-gate";
import { getPortalUser } from "@/lib/portal/auth";
import { getAvailableSlots } from "../actions";

interface PageProps {
  searchParams: Promise<{
    service?: string;
    trainer?: string;
    date?: string;
    time?: string;
    serviceTypeId?: string;
    instructorId?: string;
    locationId?: string;
  }>;
}

const MONTHS_NB_SHORT = [
  "jan",
  "feb",
  "mar",
  "apr",
  "mai",
  "jun",
  "jul",
  "aug",
  "sep",
  "okt",
  "nov",
  "des",
];
const DOWS_NB_LONG = [
  "Søndag",
  "Mandag",
  "Tirsdag",
  "Onsdag",
  "Torsdag",
  "Fredag",
  "Lørdag",
];

function isoToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function formatDayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  const dow = DOWS_NB_LONG[date.getDay()];
  const monthShort = MONTHS_NB_SHORT[m - 1];
  return `${dow} ${d}. ${monthShort}`;
}

function formatTimeLabel(iso: string, time: string | undefined): string {
  if (!time) return "Velg tid";
  const [, m, d] = iso.split("-").map(Number);
  const monthShort = MONTHS_NB_SHORT[m - 1];
  return `${d}. ${monthShort} · ${time}`;
}

export default async function TidPage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Slug-baserte fallbacks for visning (gjelder helt til velg-tjeneste/velg-trener er DB-koblet).
  const serviceSlug = params.service ?? "performance";
  const trainerSlug = params.trainer ?? "anders";
  const sluggedService = SERVICES.find((s) => s.id === serviceSlug);
  const sluggedTrainer = TRAINERS.find((t) => t.id === trainerSlug);

  // DB-baserte oppslag for ekte data (når serviceTypeId/instructorId er satt).
  const dbService = params.serviceTypeId
    ? await getBookingV2Service(params.serviceTypeId)
    : null;
  const dbInstructor = params.instructorId
    ? await getBookingV2Instructor(params.instructorId)
    : null;

  // Kvota-gate: innloggede abonnement-brukere uten ledige økter sendes til kvota-siden.
  const isSubscriptionService =
    dbService?.category === "abonnement" || sluggedService?.category === "abonnement";
  if (isSubscriptionService) {
    const portalUser = await getPortalUser();
    if (portalUser) {
      const snap = await getQuotaSnapshot(portalUser.id);
      if (snap && isQuotaExhausted(snap)) {
        redirect("/booking-v2/kvota");
      }
    }
  }

  const serviceName = dbService?.name ?? sluggedService?.name ?? "";
  const serviceNameEm = sluggedService?.nameEm ?? "";
  const servicePriceLabel =
    dbService?.priceLabel ??
    `${sluggedService?.price ?? ""}${sluggedService?.priceUnit ?? ""}`;
  const trainerName = dbInstructor?.name ?? sluggedTrainer?.name ?? "Begge";
  const maxAdvanceDays =
    dbService?.maxAdvanceDays ?? sluggedService?.maxAdvanceDays ?? 28;

  const advanceText =
    maxAdvanceDays >= 28
      ? "Performance-abonnement kan booke 4 uker frem."
      : "Flex-tjenester kan bookes 3 uker frem.";

  // Default dato = i dag. Brukeren må aktivt klikke en dag for å velge.
  const dateParam = params.date ?? isoToday();
  const timeParam = params.time;

  // Hent slots kun når vi har ekte serviceTypeId. Ellers viser SlotPicker placeholder.
  let realSlots: string[] = [];
  if (params.serviceTypeId) {
    try {
      realSlots = await getAvailableSlots({
        serviceTypeId: params.serviceTypeId,
        instructorId: params.instructorId,
        date: dateParam,
      });
    } catch {
      realSlots = [];
    }
  }

  // Beholder slug-baserte params i back/next-href til wizard-state-cookien er på plass (Steg 3).
  const carryOver = new URLSearchParams();
  carryOver.set("service", serviceSlug);
  carryOver.set("trainer", trainerSlug);
  if (params.serviceTypeId) carryOver.set("serviceTypeId", params.serviceTypeId);
  if (params.instructorId) carryOver.set("instructorId", params.instructorId);
  if (params.locationId) carryOver.set("locationId", params.locationId);
  carryOver.set("date", dateParam);
  if (timeParam) carryOver.set("time", timeParam);

  // Tilbake til velg-tjeneste — krever locationId + instructorId i den nye flyten
  const backParams = new URLSearchParams();
  if (params.locationId) backParams.set("locationId", params.locationId);
  if (params.instructorId) backParams.set("instructorId", params.instructorId);
  // Beholder gamle slug-baserte for bakoverkompatibilitet
  backParams.set("service", serviceSlug);
  if (params.serviceTypeId) backParams.set("serviceTypeId", params.serviceTypeId);

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
        <p className="lede">
          Tider vises i din lokale tidssone (Europe/Oslo). {advanceText}
        </p>

        <div className="dt-grid">
          <Calendar
            selectedDate={dateParam}
            maxAdvanceDays={maxAdvanceDays}
          />
          <SlotPicker
            slots={realSlots.length > 0 ? realSlots : undefined}
            selectedTime={timeParam}
            dayLabel={formatDayLabel(dateParam)}
          />
        </div>

        <SummaryFooter
          backHref={`/booking-v2/velg-tjeneste?${backParams.toString()}`}
          nextHref={`/booking-v2/dine-detaljer?${carryOver.toString()}`}
          nextDisabled={!timeParam}
          items={[
            {
              label: "Tjeneste",
              value: `${serviceName}${serviceNameEm ? " " + serviceNameEm : ""}`,
            },
            { label: "Trener", value: trainerName },
            { label: "Tid", value: formatTimeLabel(dateParam, timeParam) },
            { label: "Pris", value: servicePriceLabel },
          ]}
        />
      </section>
    </>
  );
}
