import Link from "next/link";
import { redirect } from "next/navigation";
import { Stepper } from "@/components/booking-v2/Stepper";
import { PaymentMethodPicker } from "@/components/booking-v2/PaymentMethodPicker";
import { RecapCard } from "@/components/booking-v2/RecapCard";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";
import { getDraft } from "@/lib/booking-v2/draft";
import {
  getBookingV2Service,
  getBookingV2Instructor,
} from "@/lib/booking-v2/services";
import { createBooking } from "../actions";

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

function formatTimeLine(date: string, time: string): string {
  const [, m, d] = date.split("-").map(Number);
  return `${d}. ${MONTHS_NB_SHORT[m - 1]} · ${time}`;
}

const ERROR_MESSAGES: Record<string, string> = {
  "service-not-found": "Tjenesten finnes ikke lenger. Gå tilbake og velg på nytt.",
  "validation-failed": "Bookingen kunne ikke valideres. Sjekk dato og tid og prøv igjen.",
  conflict: "Tidspunktet er ikke lenger ledig. Velg en annen tid.",
  "quota-failed": "Du har nådd ukens grense. Prøv en annen uke eller velg Flex.",
  "subscription-required":
    "Performance krever et aktivt abonnement. Start abo via Min side eller velg en Flex-time.",
  "user-create-failed":
    "Vi klarte ikke å opprette kontoen din. Prøv igjen eller logg inn først.",
  "stripe-error": "Betalingsleverandøren er nede. Prøv igjen om litt.",
  "missing-draft": "Bookingøkten din har utløpt. Start på nytt fra steg 1.",
  internal: "Noe gikk galt. Prøv igjen.",
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function BetalPage({ searchParams }: PageProps) {
  // Draft kreves — uten den har bruker ikke fylt ut detaljer.
  const draft = await getDraft();
  if (!draft) {
    redirect("/booking-v2/dine-detaljer");
  }

  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] ?? null : null;

  const sluggedService = SERVICES.find((s) => s.id === draft.serviceSlug);
  const sluggedTrainer = TRAINERS.find((t) => t.id === draft.trainerSlug);

  const dbService = await getBookingV2Service(draft.serviceTypeId);
  const dbInstructor = draft.instructorId
    ? await getBookingV2Instructor(draft.instructorId)
    : null;

  const serviceName = dbService?.name ?? sluggedService?.name ?? "";
  const serviceNameEm = sluggedService?.nameEm ?? "";
  const trainerName = dbInstructor?.name ?? sluggedTrainer?.name ?? "Begge";
  const isSubscription = sluggedService?.category === "abonnement";
  const priceLabel =
    dbService?.priceLabel ??
    `${sluggedService?.price ?? ""}${sluggedService?.priceUnit ?? ""}`;

  // Backlink må bære wizard-context tilbake til detaljer-skjemaet.
  const backParams = new URLSearchParams();
  backParams.set("service", draft.serviceSlug);
  backParams.set("trainer", draft.trainerSlug);
  backParams.set("serviceTypeId", draft.serviceTypeId);
  if (draft.instructorId) backParams.set("instructorId", draft.instructorId);
  backParams.set("date", draft.date);
  backParams.set("time", draft.time);

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
          Vi reserverer slottet ditt så snart betalingen går gjennom. Du blir ikke trukket
          to ganger.
        </p>

        {errorMessage ? (
          <div role="alert" className="form-error" style={{ maxWidth: 680, marginBottom: 24 }}>
            {errorMessage}
          </div>
        ) : null}

        <div className="details-grid">
          <PaymentMethodPicker />

          <RecapCard
            heading="Oppsummering"
            lines={[
              {
                label: "Tjeneste",
                value: `${serviceName}${serviceNameEm ? " " + serviceNameEm : ""}`,
              },
              { label: "Tid", value: formatTimeLine(draft.date, draft.time) },
              { label: "Trener", value: trainerName },
              {
                label: "Kunde",
                value: `${draft.customer.firstName} ${draft.customer.lastName}`,
                small: draft.customer.email,
              },
            ]}
            total={{ label: "Å betale nå", value: priceLabel }}
            policy={
              isSubscription
                ? "Abo-dekt økt — trekkes ikke nå. Vi tar fra månedens kvote."
                : "Engangsbetaling. Beløpet vises som AK GOLF OSLO på kontoutskriften."
            }
          />
        </div>

        <form action={createBooking}>
          <div className="summary-foot">
            <div className="recap">
              <div className="item">
                <span className="l">Steg</span>
                <span className="v">06 av 07</span>
              </div>
              <div className="item">
                <span className="l">Total</span>
                <span className="v">{priceLabel}</span>
              </div>
            </div>
            <div className="actions">
              <Link
                href={`/booking-v2/dine-detaljer?${backParams.toString()}`}
                className="btn btn-secondary"
              >
                ← Tilbake
              </Link>
              <button type="submit" className="btn btn-accent">
                Bekreft og betal →
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}
