import { redirect } from "next/navigation";
import { BookingPageTemplate } from "@/components/booking-v2/BookingPageTemplate";
import { BookingSummary } from "@/components/booking-v2/BookingSummary";
import { Calendar } from "@/components/booking-v2/Calendar";
import { SlotPicker } from "@/components/booking-v2/SlotPicker";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";
import {
  getBookingV2Service,
  getBookingV2Instructor,
} from "@/lib/booking-v2/services";
import { getQuotaSnapshot, isQuotaExhausted } from "@/lib/booking-v2/quota-gate";
import { getPortalUser } from "@/lib/portal/auth";
import { getAvailableSlots } from "../actions";

export const dynamic = "force-dynamic";

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
  "jan","feb","mar","apr","mai","jun",
  "jul","aug","sep","okt","nov","des",
];
const DOWS_NB_LONG = [
  "Søndag","Mandag","Tirsdag","Onsdag","Torsdag","Fredag","Lørdag",
];

function isoToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDayLabel(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return `${DOWS_NB_LONG[date.getDay()]} ${d}. ${MONTHS_NB_SHORT[m - 1]}`;
}

function formatTimeLabel(iso: string, time: string | undefined): string {
  if (!time) return "Velg tid";
  const [, m, d] = iso.split("-").map(Number);
  return `${d}. ${MONTHS_NB_SHORT[m - 1]} · ${time}`;
}

export default async function TidPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceSlug = params.service ?? "performance";
  const trainerSlug = params.trainer ?? "anders";
  const sluggedService = SERVICES.find((s) => s.id === serviceSlug);
  const sluggedTrainer = TRAINERS.find((t) => t.id === trainerSlug);

  const dbService = params.serviceTypeId ? await getBookingV2Service(params.serviceTypeId) : null;
  const dbInstructor = params.instructorId ? await getBookingV2Instructor(params.instructorId) : null;

  const isSubscriptionService =
    dbService?.category === "abonnement" || sluggedService?.category === "abonnement";
  if (isSubscriptionService) {
    const portalUser = await getPortalUser();
    if (portalUser) {
      const snap = await getQuotaSnapshot(portalUser.id);
      if (snap && isQuotaExhausted(snap)) redirect("/booking-v2/kvota");
    }
  }

  const serviceName = dbService?.name ?? sluggedService?.name ?? "";
  const serviceNameEm = sluggedService?.nameEm ?? "";
  const servicePriceLabel =
    dbService?.priceLabel ?? `${sluggedService?.price ?? ""}${sluggedService?.priceUnit ?? ""}`;
  const trainerName = dbInstructor?.name ?? sluggedTrainer?.name ?? "Begge";
  const maxAdvanceDays = dbService?.maxAdvanceDays ?? sluggedService?.maxAdvanceDays ?? 28;
  const advanceText =
    maxAdvanceDays >= 28
      ? "Performance-abonnement kan booke 4 uker frem."
      : "Flex-tjenester kan bookes 3 uker frem.";

  const dateParam = params.date ?? isoToday();
  const timeParam = params.time;

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

  const carryOver = new URLSearchParams();
  carryOver.set("service", serviceSlug);
  carryOver.set("trainer", trainerSlug);
  if (params.serviceTypeId) carryOver.set("serviceTypeId", params.serviceTypeId);
  if (params.instructorId) carryOver.set("instructorId", params.instructorId);
  if (params.locationId) carryOver.set("locationId", params.locationId);
  carryOver.set("date", dateParam);
  if (timeParam) carryOver.set("time", timeParam);

  const backParams = new URLSearchParams();
  if (params.locationId) backParams.set("locationId", params.locationId);
  if (params.instructorId) backParams.set("instructorId", params.instructorId);
  backParams.set("service", serviceSlug);
  if (params.serviceTypeId) backParams.set("serviceTypeId", params.serviceTypeId);

  return (
    <BookingPageTemplate
      step={4}
      eyebrow="Steg 4 av 7 — Velg dato og tid"
      title={
        <>
          Når <em className="not-italic" style={{ color: "var(--color-primary)" }}>passer</em> det?
        </>
      }
      lede={`Tider vises i din lokale tidssone (Europe/Oslo). ${advanceText}`}
      sidebar={
        <BookingSummary
          items={[
            { label: "Tjeneste", value: `${serviceName}${serviceNameEm ? " " + serviceNameEm : ""}` },
            { label: "Trener", value: trainerName },
            { label: "Tid", value: formatTimeLabel(dateParam, timeParam) },
            { label: "Pris", value: servicePriceLabel },
          ]}
          backHref={`/booking-v2/velg-tjeneste?${backParams.toString()}`}
          nextHref={`/booking-v2/dine-detaljer?${carryOver.toString()}`}
          nextDisabled={!timeParam}
          nextLabel="Gå til dine detaljer"
        />
      }
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <Calendar selectedDate={dateParam} maxAdvanceDays={maxAdvanceDays} />
        <SlotPicker
          slots={params.serviceTypeId ? realSlots : undefined}
          selectedTime={timeParam}
          dayLabel={formatDayLabel(dateParam)}
        />
      </div>
    </BookingPageTemplate>
  );
}
