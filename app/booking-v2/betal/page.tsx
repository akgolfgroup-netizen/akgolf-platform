import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { BookingPageTemplate } from "@/components/booking-v2/BookingPageTemplate";
import { BookingSummary } from "@/components/booking-v2/BookingSummary";
import { PaymentMethodPicker } from "@/components/booking-v2/PaymentMethodPicker";
import { SERVICES, TRAINERS } from "@/components/booking-v2/copy";
import { getDraft } from "@/lib/booking-v2/draft";
import {
  getBookingV2Service,
  getBookingV2Instructor,
} from "@/lib/booking-v2/services";
import { createBooking } from "../actions";

export const dynamic = "force-dynamic";

const MONTHS_NB_SHORT = [
  "jan","feb","mar","apr","mai","jun",
  "jul","aug","sep","okt","nov","des",
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
  "subscription-required": "Performance krever et aktivt abonnement. Start abo via Min side eller velg en Flex-time.",
  "user-create-failed": "Vi klarte ikke å opprette kontoen din. Prøv igjen eller logg inn først.",
  "stripe-error": "Betalingsleverandøren er nede. Prøv igjen om litt.",
  "missing-draft": "Bookingøkten din har utløpt. Start på nytt fra steg 1.",
  internal: "Noe gikk galt. Prøv igjen.",
};

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function BetalPage({ searchParams }: PageProps) {
  const draft = await getDraft();
  if (!draft) redirect("/booking-v2/dine-detaljer");

  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] ?? null : null;

  const sluggedService = SERVICES.find((s) => s.id === draft.serviceSlug);
  const sluggedTrainer = TRAINERS.find((t) => t.id === draft.trainerSlug);

  const dbService = await getBookingV2Service(draft.serviceTypeId);
  const dbInstructor = draft.instructorId ? await getBookingV2Instructor(draft.instructorId) : null;

  const serviceName = dbService?.name ?? sluggedService?.name ?? "";
  const serviceNameEm = sluggedService?.nameEm ?? "";
  const trainerName = dbInstructor?.name ?? sluggedTrainer?.name ?? "Begge";
  const isSubscription =
    dbService?.category === "abonnement" || sluggedService?.category === "abonnement";
  const priceLabel =
    dbService?.priceLabel ?? `${sluggedService?.price ?? ""}${sluggedService?.priceUnit ?? ""}`;

  const backParams = new URLSearchParams();
  backParams.set("service", draft.serviceSlug);
  backParams.set("trainer", draft.trainerSlug);
  backParams.set("serviceTypeId", draft.serviceTypeId);
  if (draft.instructorId) backParams.set("instructorId", draft.instructorId);
  backParams.set("date", draft.date);
  backParams.set("time", draft.time);

  return (
    <BookingPageTemplate
      step={6}
      eyebrow="Steg 6 av 7 — Betaling"
      title={
        <>
          Bekreft og <em className="not-italic" style={{ color: "var(--color-primary)" }}>betal</em>.
        </>
      }
      lede="Vi reserverer slottet ditt så snart betalingen går gjennom. Du blir ikke trukket to ganger."
      sidebar={
        <BookingSummary
          items={[
            { label: "Tjeneste", value: `${serviceName}${serviceNameEm ? " " + serviceNameEm : ""}` },
            { label: "Tid", value: formatTimeLine(draft.date, draft.time) },
            { label: "Trener", value: trainerName },
            { label: "Kunde", value: `${draft.customer.firstName} ${draft.customer.lastName}`, small: draft.customer.email },
          ]}
          total={{ label: "Å betale nå", value: priceLabel }}
        />
      }
    >
      {errorMessage && (
        <div
          className="mb-6 rounded-xl border p-4 text-sm"
          role="alert"
          style={{ background: "var(--color-error-light)", borderColor: "var(--color-error)", color: "var(--color-error)" }}
        >
          {errorMessage}
        </div>
      )}

      <PaymentMethodPicker />

      <form action={createBooking} className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={`/booking-v2/dine-detaljer?${backParams.toString()}`}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors"
            style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-line)" }}
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
            Tilbake
          </Link>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-bold transition-all hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(209,248,67,0.35)]"
            style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
          >
            Bekreft og betal
            <ArrowRight className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>
      </form>
    </BookingPageTemplate>
  );
}
