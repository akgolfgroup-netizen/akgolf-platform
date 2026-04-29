import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Check, Calendar, MapPin, User, CreditCard } from "lucide-react";
import { BookingStepper } from "@/components/booking-v2/BookingStepper";
import { POLICY } from "@/components/booking-v2/copy";
import { prisma } from "@/lib/portal/prisma";
import { generateIcal } from "@/lib/portal/calendar/ical";
import { ClearDraftOnMount } from "./clear-draft-on-mount";

interface PageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

function buildIcsDataUrl(booking: {
  id: string;
  startTime: Date;
  endTime: Date;
  ServiceType: { name: string } | null;
  Instructor: { User: { name: string | null } | null } | null;
}): string {
  const summary = `${booking.ServiceType?.name ?? "Coaching-økt"} med ${booking.Instructor?.User?.name ?? "AK Golf"}`;
  const ics = generateIcal(
    [{
      uid: `${booking.id}@akgolf.no`,
      summary,
      dtstart: booking.startTime,
      dtend: booking.endTime,
      location: "AK Golf studio, Oslo",
    }],
    "AK Golf Booking",
  );
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

export default async function BekreftelsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId;
  if (!bookingId) redirect("/booking-v2");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      startTime: true,
      endTime: true,
      amount: true,
      paymentMethod: true,
      paymentStatus: true,
      status: true,
      ServiceType: { select: { name: true, duration: true, category: true } },
      Instructor: { select: { User: { select: { name: true } } } },
      User: { select: { name: true, email: true } },
    },
  });
  if (!booking) redirect("/booking-v2");

  const start = new Date(booking.startTime);
  const dayWord = format(start, "EEEE", { locale: nb });
  const timeStr = format(start, "HH:mm");
  const dateLine = format(start, "d. MMM", { locale: nb });
  const trainerName = booking.Instructor?.User?.name ?? "AK Golf";
  const serviceName = booking.ServiceType?.name ?? "Coaching-økt";
  const duration = booking.ServiceType?.duration ?? 20;
  const isAbo = booking.amount === 0 || booking.paymentMethod === "NONE";
  const priceLabel = isAbo
    ? "Dekket av abo"
    : `${booking.amount.toLocaleString("nb-NO")} kr`;
  const icsUrl = buildIcsDataUrl({
    id: booking.id,
    startTime: start,
    endTime: new Date(booking.endTime),
    ServiceType: booking.ServiceType ? { name: booking.ServiceType.name } : null,
    Instructor: booking.Instructor,
  });

  const isPending = booking.status === "PENDING";

  return (
    <>
      <ClearDraftOnMount />
      <BookingStepper current={7} />

      <div className="mx-auto max-w-3xl">
        {/* Success mark */}
        <div className="mb-6 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ background: "var(--color-success-light)" }}
          >
            <Check className="h-5 w-5" style={{ color: "var(--color-success)" }} />
          </div>
          <div>
            <p
              className="text-[11px] font-medium uppercase tracking-[0.16em]"
              style={{ color: "var(--color-ink-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              {booking.id.slice(0, 12).toUpperCase()}
            </p>
            <p className="text-sm font-medium" style={{ color: "var(--color-success)" }}>
              {isPending ? "Venter på betaling" : "Bekreftet"}
            </p>
          </div>
        </div>

        <h1
          className="mb-4 text-[clamp(2rem,5vw,3rem)] font-bold leading-[1.05] tracking-[-0.025em]"
          style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}
        >
          Vi sees <em className="not-italic" style={{ color: "var(--color-primary)" }}>{dayWord}</em>.
        </h1>

        <p className="mb-8 max-w-lg text-base leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
          {isPending
            ? "Vi bekrefter slottet ditt så snart betalingen er gjennomført. Du får e-post når den er ferdig."
            : "Bekreftelse er sendt på e-post. Du får en påminnelse 24 t før økten, og en SMS én time før."}
        </p>

        {/* Meta cards */}
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <MetaCard
            icon={<Calendar className="h-4 w-4" />}
            label="Når"
            value={timeStr}
            small={`${dateLine} · ${duration} minutter`}
            highlight
          />
          <MetaCard
            icon={<User className="h-4 w-4" />}
            label="Med"
            value={trainerName}
            small={serviceName}
          />
          <MetaCard
            icon={<MapPin className="h-4 w-4" />}
            label="Hvor"
            value="AK Golf studio"
            small="Oslo"
          />
          <MetaCard
            icon={<CreditCard className="h-4 w-4" />}
            label="Betalt"
            value={priceLabel}
            small={isAbo ? "Trekkes fra månedens kvote" : "Kvittering på e-post"}
          />
        </div>

        {/* Calendar buttons */}
        <div className="mb-10 flex flex-wrap gap-3">
          <a
            href={icsUrl}
            download={`ak-golf-booking-${booking.id.slice(0, 8)}.ics`}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition-all hover:-translate-y-px"
            style={{ background: "var(--color-accent)", color: "var(--color-ink)" }}
          >
            <Calendar className="h-4 w-4" />
            Last ned .ics
          </a>
          <a
            href={icsUrl}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
            style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-line)" }}
          >
            Legg til i kalender
          </a>
        </div>

        {/* What next */}
        <div className="mb-10">
          <h3
            className="mb-4 text-sm font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-ink)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Hva skjer nå
          </h3>
          <ol className="space-y-4">
            {[
              { n: "01", title: "I dag", text: "Bekreftelses-e-post med et kort spørreskjema (3 spørsmål) — så treneren kan forberede seg." },
              { n: "02", title: "Påminnelse", text: "E-post med veibeskrivelse, parkering og hva du skal ha med." },
              { n: "03", title: "1 t før", text: "SMS med direktelink til treneren om noe skulle dukke opp." },
              { n: "04", title: "Etter økten", text: "Du får TrackMan-rapporten og en skriftlig hjemmeplan i appen — innen 24 timer." },
            ].map((item) => (
              <li key={item.n} className="flex items-start gap-4">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
                  style={{ background: "var(--color-primary-soft)", color: "var(--color-primary)" }}
                >
                  {item.n}
                </span>
                <div>
                  <b className="text-sm" style={{ color: "var(--color-ink)" }}>{item.title}</b>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-ink-muted)" }}>
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Policy */}
        <div
          className="rounded-2xl border p-5 md:p-6"
          style={{
            background: "var(--color-card)",
            borderColor: "var(--color-line)",
            boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
          }}
        >
          <h4 className="mb-4 text-base font-semibold" style={{ color: "var(--color-ink)", fontFamily: "var(--font-inter-tight)" }}>
            Avbestillingsregler
          </h4>
          <div className="space-y-3">
            {POLICY.rules.map((rule, i) => (
              <div key={i} className="flex gap-4 text-sm">
                <span
                  className="shrink-0 text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--color-ink-subtle)", fontFamily: "var(--font-jetbrains-mono)", minWidth: 64 }}
                >
                  {rule.when}
                </span>
                <div>
                  <b className="block" style={{ color: "var(--color-ink)" }}>{rule.title}</b>
                  <span style={{ color: "var(--color-ink-muted)" }}>{rule.text}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3 border-t pt-5" style={{ borderColor: "var(--color-line-soft)" }}>
            <Link
              href={`/portal/dashboard/bookinger/${booking.id}`}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
              style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-line)" }}
            >
              Min booking →
            </Link>
            <Link
              href="/portal"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors"
              style={{ color: "var(--color-ink-muted)", border: "1px solid var(--color-line)" }}
            >
              Min side →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function MetaCard({
  icon,
  label,
  value,
  small,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  small?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: highlight ? "var(--color-primary)" : "var(--color-card)",
        borderColor: highlight ? "var(--color-primary)" : "var(--color-line)",
        color: highlight ? "var(--color-card)" : "var(--color-ink)",
        boxShadow: "0 1px 2px rgba(15,31,24,0.04), 0 4px 12px rgba(15,31,24,0.04)",
      }}
    >
      <div className="mb-2 flex items-center gap-2">
        <span style={{ color: highlight ? "var(--color-accent)" : "var(--color-primary)" }}>
          {icon}
        </span>
        <span
          className="text-[11px] font-medium uppercase tracking-wider"
          style={{ color: highlight ? "var(--color-card)" : "var(--color-ink-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
        >
          {label}
        </span>
      </div>
      <div className="text-lg font-bold" style={{ fontFamily: "var(--font-inter-tight)" }}>
        {value}
      </div>
      {small && (
        <div
          className="mt-0.5 text-xs"
          style={{ color: highlight ? "rgba(255,255,255,0.7)" : "var(--color-ink-subtle)" }}
        >
          {small}
        </div>
      )}
    </div>
  );
}
