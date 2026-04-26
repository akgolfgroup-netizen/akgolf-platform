import Link from "next/link";
import { Stepper } from "@/components/booking-v2/Stepper";
import { InstructorCard } from "@/components/booking-v2/InstructorCard";
import { TRAINERS, SERVICES } from "@/components/booking-v2/copy";

interface PageProps {
  searchParams: Promise<{ service?: string }>;
}

export default async function VelgTrenerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const serviceId = params.service ?? "performance";
  const service = SERVICES.find((s) => s.id === serviceId);

  // Pre-select trainer if the service is locked to one
  const lockedTrainer = service && service.trainer !== "begge" ? service.trainer : null;

  const tidParams = new URLSearchParams();
  tidParams.set("service", serviceId);

  const baseHref = `/booking-v2/tid?${tidParams.toString()}`;

  return (
    <>
      <Stepper current={3} />
      <section className="step-page active" data-step={3}>
        <p className="eyebrow">
          <span className="num">03 / 07</span>
          Velg trener
        </p>
        <h1 className="t-section">
          Med hvem vil <em>du</em> trene?
        </h1>
        <p className="lede">
          Anders følger spillere som vil ha langsiktig utvikling. Markus følger nye golfere,
          juniorer og gruppetrening.
        </p>

        <div className="inst-grid">
          {TRAINERS.map((t) => (
            <InstructorCard
              key={t.id}
              id={t.id}
              name={t.name}
              role={t.role}
              badge={t.badge}
              bio={t.bio}
              image={t.image}
              fallbackBg={t.fallbackBg}
              stats={t.stats}
              availability={t.id === "anders" ? "5 ledige denne uken" : "3 ledige denne uken"}
              selected={lockedTrainer === t.id}
              hrefBase={baseHref}
            />
          ))}
        </div>

        {!lockedTrainer && (
          <Link
            href={`${baseHref}&trainer=any`}
            className="inst-noprefer"
          >
            <span>
              <b>Ingen preferanse</b> — vis tider for begge trenere.
            </span>
            <span className="arr-circle">→</span>
          </Link>
        )}
      </section>
    </>
  );
}
