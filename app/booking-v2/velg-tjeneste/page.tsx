import Link from "next/link";
import { redirect } from "next/navigation";
import { Stepper } from "@/components/booking-v2/Stepper";
import {
  getBookingV2Locations,
  getBookingV2Instructors,
  getBookingV2ServicesAtLocation,
} from "@/lib/booking-v2/services";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{
    locationId?: string;
    instructorId?: string;
  }>;
}

const CATEGORY_LABEL: Record<string, string> = {
  abonnement: "Abonnement",
  flex: "Flex",
  bane: "Banecoaching",
  kurs: "Kurs",
};

export default async function VelgTjenestePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { locationId, instructorId } = params;

  if (!locationId) {
    redirect("/booking-v2/lokasjon");
  }
  if (!instructorId) {
    redirect(`/booking-v2/velg-trener?locationId=${encodeURIComponent(locationId)}`);
  }

  const [services, locations, instructors] = await Promise.all([
    getBookingV2ServicesAtLocation(locationId, instructorId),
    getBookingV2Locations(),
    getBookingV2Instructors(),
  ]);

  const location = locations.find((l) => l.id === locationId);
  const instructor = instructors.find((i) => i.id === instructorId);

  if (!location || !instructor) {
    redirect("/booking-v2/lokasjon");
  }

  return (
    <>
      <Stepper current={3} />
      <section className="step-page active" data-step={3}>
        <p className="eyebrow">
          <span className="num">03 / 07</span>
          Velg tjeneste
        </p>
        <h1 className="t-section">
          Hva skal vi <em>jobbe</em> med?
        </h1>
        <p className="lede">
          Tjenester som <strong>{instructor.name}</strong> tilbyr på{" "}
          <strong>{location.name}</strong>. Abonnement gir lavere pris per økt.
        </p>

        {services.length === 0 ? (
          <div className="alert warn" style={{ maxWidth: 680, marginTop: 24 }}>
            <span className="ic">i</span>
            <div>
              <b>Ingen tjenester satt opp ennå.</b>
              <p>
                {instructor.name} har ikke aktivert noen tjenester på {location.name}.
                Velg en annen kombinasjon, eller kontakt oss.
              </p>
            </div>
          </div>
        ) : (
          <div className="svc-list" style={{ marginTop: 24 }}>
            {services.map((s) => {
              const carry = new URLSearchParams();
              carry.set("locationId", locationId);
              carry.set("instructorId", instructorId);
              carry.set("serviceTypeId", s.id);
              return (
                <Link
                  key={s.id}
                  href={`/booking-v2/tid?${carry.toString()}`}
                  className="svc-row"
                >
                  <span className="num">→</span>
                  <div style={{ flex: 1 }}>
                    <h3>{s.name}</h3>
                    {s.description ? (
                      <p style={{ opacity: 0.85 }}>{s.description}</p>
                    ) : null}
                    <div className="meta">
                      <span>{s.duration} min</span>
                      <span>·</span>
                      <span>
                        {s.priceLabel}
                        {s.category === "abonnement" ? " /mnd" : ""}
                      </span>
                      <span>·</span>
                      <span>{CATEGORY_LABEL[s.category] ?? s.category}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <Link
            href={`/booking-v2/velg-trener?locationId=${encodeURIComponent(locationId)}`}
            className="btn btn-secondary"
          >
            ← Tilbake
          </Link>
        </div>
      </section>
    </>
  );
}
