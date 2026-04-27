import Link from "next/link";
import { redirect } from "next/navigation";
import { Stepper } from "@/components/booking-v2/Stepper";
import {
  getBookingV2InstructorsAtLocation,
  getBookingV2Locations,
} from "@/lib/booking-v2/services";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ locationId?: string }>;
}

export default async function VelgTrenerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const locationId = params.locationId;

  if (!locationId) {
    redirect("/booking-v2/lokasjon");
  }

  const [instructors, locations] = await Promise.all([
    getBookingV2InstructorsAtLocation(locationId),
    getBookingV2Locations(),
  ]);
  const location = locations.find((l) => l.id === locationId);

  if (!location) {
    redirect("/booking-v2/lokasjon");
  }

  return (
    <>
      <Stepper current={2} />
      <section className="step-page active" data-step={2}>
        <p className="eyebrow">
          <span className="num">02 / 07</span>
          Velg trener
        </p>
        <h1 className="t-section">
          Med hvem vil <em>du</em> trene?
        </h1>
        <p className="lede">
          Trenere som er tilgjengelige på <strong>{location.name}</strong>.
          Hver trener har sine egne tjenester og tider.
        </p>

        {instructors.length === 0 ? (
          <div className="alert warn" style={{ maxWidth: 680, marginTop: 24 }}>
            <span className="ic">i</span>
            <div>
              <b>Ingen trenere på denne lokasjonen ennå.</b>
              <p>
                Velg en annen lokasjon, eller kontakt oss på{" "}
                <a href="mailto:hei@akgolf.no">hei@akgolf.no</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="svc-list" style={{ marginTop: 24 }}>
            {instructors.map((i) => {
              const carry = new URLSearchParams();
              carry.set("locationId", locationId);
              carry.set("instructorId", i.id);
              return (
                <Link
                  key={i.id}
                  href={`/booking-v2/velg-tjeneste?${carry.toString()}`}
                  className="svc-row"
                >
                  <span className="num">→</span>
                  <div style={{ flex: 1 }}>
                    <h3>{i.name}</h3>
                    {i.title ? <p>{i.title}</p> : null}
                    {i.bio ? (
                      <p style={{ opacity: 0.7, fontSize: 13 }}>{i.bio.slice(0, 140)}</p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Link href="/booking-v2/lokasjon" className="btn btn-secondary">
            ← Tilbake
          </Link>
        </div>
      </section>
    </>
  );
}
