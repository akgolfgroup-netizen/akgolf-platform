import Link from "next/link";
import { redirect } from "next/navigation";
import { Stepper } from "@/components/booking-v2/Stepper";
import { getPortalUser } from "@/lib/portal/auth";
import {
  getQuotaSnapshot,
  tierLabel,
  type QuotaSnapshot,
} from "@/lib/booking-v2/quota-gate";

const MONTHS_NB_LONG = [
  "januar",
  "februar",
  "mars",
  "april",
  "mai",
  "juni",
  "juli",
  "august",
  "september",
  "oktober",
  "november",
  "desember",
];
const DOWS_NB_LONG = [
  "søndag",
  "mandag",
  "tirsdag",
  "onsdag",
  "torsdag",
  "fredag",
  "lørdag",
];

function formatBookingShort(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}.${month}`;
}

function formatLongDate(d: Date): string {
  const dow = DOWS_NB_LONG[d.getDay()];
  return `${dow} ${d.getDate()}. ${MONTHS_NB_LONG[d.getMonth()]}`;
}

function nextPeriodSessions(snap: QuotaSnapshot): number {
  // Antall økter i ny periode = sessionsAllowed (samme tier).
  return snap.sessionsAllowed;
}

export default async function KvotaPage() {
  const user = await getPortalUser();
  if (!user) {
    redirect("/portal/login?next=/booking-v2/kvota");
  }

  const snap = await getQuotaSnapshot(user.id);
  if (!snap) {
    // Ingen aktiv abo — bruker har ingenting å se her.
    redirect("/booking-v2/velg-tjeneste");
  }

  const periodMonth = MONTHS_NB_LONG[snap.periodStart.getMonth()];
  const tier = tierLabel(snap.tier);
  const allowed = snap.sessionsAllowed;
  const used = snap.sessionsUsed;
  const recentBookings = snap.bookingsInPeriod
    .slice(-allowed)
    .map(formatBookingShort)
    .join(" · ");

  const nextPeriodLabel = formatLongDate(snap.periodEnd);
  const nextSessionsCount = nextPeriodSessions(snap);

  return (
    <>
      <Stepper current={4} />
      <section className="step-page active" data-step="quota">
        <p className="eyebrow">
          <span className="num">!</span>
          Abonnement
        </p>
        <h1 className="t-section">
          Du har brukt <em>månedens</em> økter.
        </h1>
        <p className="lede">
          {tier} gir deg {allowed} 1:1-økter per måned. Du har booket alle{" "}
          {used} i {periodMonth}. Du kan velge en Flex-time som ekstrapris, eller vente til neste
          periode.
        </p>

        <div className="alert warn" style={{ maxWidth: 680 }}>
          <span className="ic">i</span>
          <div>
            <b>Neste periode starter {nextPeriodLabel}.</b>
            <p>
              Da nullstilles kvoten din til {nextSessionsCount} økter. Vi sender deg en påminnelse
              natten før.
            </p>
          </div>
        </div>

        <div className="confirm-meta" style={{ maxWidth: 680, margin: "32px 0" }}>
          <div className="cell dark">
            <div className="l">Brukt i {periodMonth}</div>
            <div className="v">
              {used} / {allowed}
              {recentBookings ? <small>{recentBookings}</small> : null}
            </div>
          </div>
          <div className="cell">
            <div className="l">Tilgjengelig {snap.periodEnd.getDate()}. {MONTHS_NB_LONG[snap.periodEnd.getMonth()].slice(0, 3)}</div>
            <div className="v">
              {nextSessionsCount} nye økter
              <small>Inkludert i {tier}</small>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
          <Link href="/booking-v2/velg-tjeneste" className="btn btn-primary">
            Book Flex-time i tillegg
          </Link>
          <Link href="/portal" className="btn btn-secondary">
            Tilbake til Min side
          </Link>
        </div>
      </section>
    </>
  );
}
