import Link from "next/link";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { Stepper } from "@/components/booking-v2/Stepper";
import { POLICY } from "@/components/booking-v2/copy";
import { prisma } from "@/lib/portal/prisma";
import { generateIcal } from "@/lib/portal/calendar/ical";
import { ClearDraftOnMount } from "./clear-draft-on-mount";

interface PageProps {
  searchParams: Promise<{ bookingId?: string }>;
}

const NB_DAYS_SHORT = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];
const NB_MONTHS_SHORT = [
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

/**
 * Bygg ICS-fil fra ekte booking-data via shared generator. Returner som data: URI.
 */
function buildIcsDataUrl(booking: {
  id: string;
  startTime: Date;
  endTime: Date;
  ServiceType: { name: string } | null;
  Instructor: { User: { name: string | null } | null } | null;
}): string {
  const summary = `${booking.ServiceType?.name ?? "Coaching-økt"} med ${
    booking.Instructor?.User?.name ?? "AK Golf"
  }`;
  const ics = generateIcal(
    [
      {
        uid: `${booking.id}@akgolf.no`,
        summary,
        dtstart: booking.startTime,
        dtend: booking.endTime,
        location: "AK Golf studio, Oslo",
      },
    ],
    "AK Golf Booking",
  );
  return "data:text/calendar;charset=utf-8," + encodeURIComponent(ics);
}

export default async function BekreftelsePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const bookingId = params.bookingId;

  if (!bookingId) {
    redirect("/booking-v2");
  }

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
      Instructor: {
        select: { User: { select: { name: true } } },
      },
      User: { select: { name: true, email: true } },
    },
  });

  if (!booking) {
    redirect("/booking-v2");
  }

  // Draft-cookie ryddes via klient-side useEffect som kaller server action
  // (cookies kan ikke settes fra server component render — Next.js-regel).

  const start = new Date(booking.startTime);
  const dayShort = NB_DAYS_SHORT[start.getDay()];
  const monthShort = NB_MONTHS_SHORT[start.getMonth()];
  const dayWord = format(start, "EEEE", { locale: nb });
  const timeStr = format(start, "HH:mm");
  const dateLine = `${dayShort} ${start.getDate()}. ${monthShort}`;

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
    ServiceType: booking.ServiceType
      ? { name: booking.ServiceType.name }
      : null,
    Instructor: booking.Instructor,
  });

  // Påminnelse-tider for "Hva skjer nå"-listen
  const day = start.getDate();
  const reminderDate = `${day - 1}. ${monthShort}`;
  const sessionDate = `${day}. ${monthShort}`;

  const isPending = booking.status === "PENDING";

  return (
    <>
      <ClearDraftOnMount />
      <Stepper current={7} />
      <section className="step-page active" data-step={7}>
        <div className="confirm-grid">
          <div>
            <div className="confirm-mark">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className="eyebrow">
              <span className="num">{booking.id.slice(0, 12).toUpperCase()}</span>
              {isPending ? "Venter på betaling" : "Bekreftet"}
            </p>
            <h1 className="t-section">
              Vi sees <em>{dayWord}</em>.
            </h1>
            <p className="lede">
              {isPending
                ? "Vi bekrefter slottet ditt så snart betalingen er gjennomført. Du får e-post når den er ferdig."
                : "Bekreftelse er sendt på e-post. Du får en påminnelse 24 t før økten, og en SMS én time før."}
            </p>

            <div className="confirm-meta">
              <div className="cell dark">
                <div className="l">Når</div>
                <div className="v">
                  {timeStr}
                  <small>
                    {dateLine} · {duration} minutter
                  </small>
                </div>
              </div>
              <div className="cell">
                <div className="l">Med</div>
                <div className="v">
                  {trainerName}
                  <small>{serviceName}</small>
                </div>
              </div>
              <div className="cell">
                <div className="l">Hvor</div>
                <div className="v">
                  AK Golf studio<small>Oslo</small>
                </div>
              </div>
              <div className="cell">
                <div className="l">Betalt</div>
                <div className="v">
                  {priceLabel}
                  <small>
                    {isAbo
                      ? "Trekkes fra månedens kvote"
                      : "Kvittering på e-post"}
                  </small>
                </div>
              </div>
            </div>

            <div className="add-cal">
              <a
                className="btn btn-primary"
                href={icsUrl}
                download={`ak-golf-booking-${booking.id.slice(0, 8)}.ics`}
              >
                Last ned .ics
              </a>
              <a className="btn btn-secondary" href={icsUrl}>
                Legg til i kalender
              </a>
            </div>

            <div className="what-next">
              <h3>Hva skjer nå</h3>
              <ol>
                <li>
                  <span className="n">01</span>
                  <div>
                    <b>I dag</b>
                    <p>
                      Bekreftelses-e-post med et kort spørreskjema (3 spørsmål) — så
                      treneren kan forberede seg.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="n">02</span>
                  <div>
                    <b>{reminderDate} · {timeStr}</b>
                    <p>
                      Påminnelse på e-post med veibeskrivelse, parkering og hva du
                      skal ha med.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="n">03</span>
                  <div>
                    <b>{sessionDate} · 1 t før</b>
                    <p>SMS med direktelink til treneren om noe skulle dukke opp.</p>
                  </div>
                </li>
                <li>
                  <span className="n">04</span>
                  <div>
                    <b>Etter økten</b>
                    <p>
                      Du får TrackMan-rapporten og en skriftlig hjemmeplan i appen
                      — innen 24 timer.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </div>

          <aside className="policy-card">
            <h4>Avbestillingsregler</h4>
            {POLICY.rules.map((rule, i) => (
              <div key={i} className="rule">
                <span className="when">{rule.when}</span>
                <div>
                  <b className={rule.className}>{rule.title}</b>
                  {rule.text}
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: 24,
                paddingTop: 20,
                borderTop: "1px solid var(--line)",
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
              }}
            >
              <Link
                href={`/portal/dashboard/bookinger/${booking.id}`}
                className="btn btn-secondary"
                style={{ fontSize: 13 }}
              >
                Min booking →
              </Link>
              <Link
                href="/portal"
                className="btn btn-secondary"
                style={{ fontSize: 13 }}
              >
                Min side →
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
