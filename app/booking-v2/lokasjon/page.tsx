import Link from "next/link";
import { Stepper } from "@/components/booking-v2/Stepper";
import { getBookingV2Locations } from "@/lib/booking-v2/services";

export const dynamic = "force-dynamic";

export default async function LokasjonPage() {
  const locations = await getBookingV2Locations();

  return (
    <>
      <Stepper current={1} />
      <section className="step-page active" data-step={1}>
        <p className="eyebrow">
          <span className="num">01 / 07</span>
          Velg lokasjon
        </p>
        <h1 className="t-section">
          Hvor vil <em>du</em> trene?
        </h1>
        <p className="lede">
          Velg klubb eller anlegg først — så viser vi hvilke trenere som er
          tilgjengelige der, og hvilke tjenester de tilbyr.
        </p>

        {locations.length === 0 ? (
          <div className="alert warn" style={{ maxWidth: 680, marginTop: 24 }}>
            <span className="ic">i</span>
            <div>
              <b>Ingen lokasjoner satt opp ennå.</b>
              <p>
                Trenere må aktivere minst én lokasjon i CoachHQ før booking blir
                tilgjengelig. Kontakt oss på{" "}
                <a href="mailto:hei@akgolf.no">hei@akgolf.no</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="svc-list" style={{ marginTop: 24 }}>
            {locations.map((loc) => (
              <Link
                key={loc.id}
                href={`/booking-v2/velg-trener?locationId=${encodeURIComponent(loc.id)}`}
                className="svc-row"
              >
                <span className="num">→</span>
                <div style={{ flex: 1 }}>
                  <h3>{loc.name}</h3>
                  {loc.address ? <p>{loc.address}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
