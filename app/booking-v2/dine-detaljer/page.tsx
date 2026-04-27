import { Stepper } from "@/components/booking-v2/Stepper";
import { DetailsForm } from "@/components/booking-v2/DetailsForm";
import { RecapCard } from "@/components/booking-v2/RecapCard";
import { SummaryFooter } from "@/components/booking-v2/SummaryFooter";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";
import {
  getBookingV2Service,
  getBookingV2Instructor,
} from "@/lib/booking-v2/services";
import { getDraft } from "@/lib/booking-v2/draft";

interface PageProps {
  searchParams: Promise<{
    service?: string;
    trainer?: string;
    date?: string;
    time?: string;
    serviceTypeId?: string;
    instructorId?: string;
    locationId?: string;
    error?: string;
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
const DOWS_NB_SHORT = ["Sø", "Ma", "Ti", "On", "To", "Fr", "Lø"];

function formatBookingTime(date: string, time: string, durationMin: number): {
  dateLine: string;
  timeLine: string;
} {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  const dow = DOWS_NB_SHORT[dt.getDay()];
  const monthShort = MONTHS_NB_SHORT[m - 1];
  const dateLine = `${dow} ${d}. ${monthShort} ${y}`;

  const [hh, mm] = time.split(":").map(Number);
  const endTotal = hh * 60 + mm + durationMin;
  const eh = String(Math.floor(endTotal / 60)).padStart(2, "0");
  const em = String(endTotal % 60).padStart(2, "0");
  const timeLine = `${time} – ${eh}:${em}`;

  return { dateLine, timeLine };
}

export default async function DineDetaljerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceSlug = params.service ?? "performance";
  const trainerSlug = params.trainer ?? "anders";

  const sluggedService = SERVICES.find((s) => s.id === serviceSlug);
  const sluggedTrainer = TRAINERS.find((t) => t.id === trainerSlug);

  const dbService = params.serviceTypeId
    ? await getBookingV2Service(params.serviceTypeId)
    : null;
  const dbInstructor = params.instructorId
    ? await getBookingV2Instructor(params.instructorId)
    : null;

  // Pre-fyll fra eksisterende draft hvis bruker går tilbake.
  const draft = await getDraft();
  const prefill = draft?.customer
    ? {
        firstName: draft.customer.firstName,
        lastName: draft.customer.lastName,
        email: draft.customer.email,
        phone: draft.customer.phone,
        handicap: draft.customer.handicap,
        note: draft.customer.note,
        consent: draft.customer.consent,
      }
    : undefined;

  // Wizard-data — foretrekk URL-params, deretter draft hvis brukeren navigerer direkte hit.
  const date = params.date ?? draft?.date ?? "";
  const time = params.time ?? draft?.time ?? "";
  const serviceTypeId = params.serviceTypeId ?? draft?.serviceTypeId;
  const instructorId = params.instructorId ?? draft?.instructorId;
  const locationId = params.locationId ?? draft?.locationId;

  const serviceName = dbService?.name ?? sluggedService?.name ?? "";
  const serviceNameEm = sluggedService?.nameEm ?? "";
  const serviceMeta = sluggedService?.meta[0];
  const trainerName = dbInstructor?.name ?? sluggedTrainer?.name ?? "Begge";
  const trainerRole = sluggedTrainer?.role.split(" · ")[0];
  const duration = dbService?.duration ?? 20;
  const isSubscription =
    dbService?.category === "abonnement" ||
    sluggedService?.category === "abonnement";
  const priceLabel =
    dbService?.priceLabel ??
    `${sluggedService?.price ?? ""}${sluggedService?.priceUnit ?? ""}`;

  const { dateLine, timeLine } =
    date && time
      ? formatBookingTime(date, time, duration)
      : { dateLine: "Ikke valgt", timeLine: "Velg tid" };

  const backParams = new URLSearchParams();
  backParams.set("service", serviceSlug);
  backParams.set("trainer", trainerSlug);
  if (serviceTypeId) backParams.set("serviceTypeId", serviceTypeId);
  if (instructorId) backParams.set("instructorId", instructorId);
  if (locationId) backParams.set("locationId", locationId);
  if (date) backParams.set("date", date);
  if (time) backParams.set("time", time);

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
          <DetailsForm
            hidden={{
              serviceTypeId,
              instructorId,
              locationId,
              service: serviceSlug,
              trainer: trainerSlug,
              date,
              time,
            }}
            prefill={prefill}
            error={params.error}
          />

          <RecapCard
            heading="Din booking"
            lines={[
              {
                label: "Tjeneste",
                value: `${serviceName}${serviceNameEm ? " " + serviceNameEm : ""}`,
                small: serviceMeta,
              },
              {
                label: "Trener",
                value: trainerName,
                small: trainerRole,
              },
              {
                label: isSubscription ? "Første økt" : "Tid",
                value: dateLine,
                small: timeLine,
              },
              { label: "Sted", value: "AK Golf studio", small: "Oslo" },
            ]}
            total={{
              label: isSubscription ? "Månedlig" : "Pris",
              value: priceLabel,
            }}
            policy="Gratis avbestilling inntil 24 t før økten. 8–24 t: 50 % gebyr. Mindre enn 8 t: full betaling."
          />
        </div>

        <SummaryFooter
          backHref={`/booking-v2/tid?${backParams.toString()}`}
          nextHref="#"
          nextDisabled
          nextLabel="Til betaling"
          items={[
            { label: "Steg", value: "05 av 07" },
            {
              label: "Fortsett",
              value: "via knappen i skjemaet",
            },
          ]}
        />
      </section>
    </>
  );
}
