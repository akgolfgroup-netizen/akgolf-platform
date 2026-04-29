import { redirect } from "next/navigation";
import { Zap, CalendarDays, Flag, GraduationCap } from "lucide-react";
import { BookingPageTemplate } from "@/components/booking-v2/BookingPageTemplate";
import { BookingCard } from "@/components/booking-v2/BookingCard";
import { BookingSummary } from "@/components/booking-v2/BookingSummary";
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

const CATEGORY_ICON: Record<string, React.ReactNode> = {
  abonnement: <Zap className="h-5 w-5 md:h-6 md:w-6" />,
  flex: <CalendarDays className="h-5 w-5 md:h-6 md:w-6" />,
  bane: <Flag className="h-5 w-5 md:h-6 md:w-6" />,
  kurs: <GraduationCap className="h-5 w-5 md:h-6 md:w-6" />,
};

const CATEGORY_LABEL: Record<string, string> = {
  abonnement: "Abonnement",
  flex: "Flex",
  bane: "Banecoaching",
  kurs: "Kurs",
};

export default async function VelgTjenestePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { locationId, instructorId } = params;

  if (!locationId) redirect("/booking-v2/lokasjon");
  if (!instructorId) redirect(`/booking-v2/velg-trener?locationId=${encodeURIComponent(locationId)}`);

  const [services, locations, instructors] = await Promise.all([
    getBookingV2ServicesAtLocation(locationId, instructorId),
    getBookingV2Locations(),
    getBookingV2Instructors(),
  ]);

  const location = locations.find((l) => l.id === locationId);
  const instructor = instructors.find((i) => i.id === instructorId);

  if (!location || !instructor) redirect("/booking-v2/lokasjon");

  return (
    <BookingPageTemplate
      step={3}
      eyebrow="Steg 3 av 7 — Velg tjeneste"
      title={
        <>
          Hva skal vi <em className="not-italic" style={{ color: "var(--color-primary)" }}>jobbe</em> med?
        </>
      }
      lede={`Tjenester som ${instructor.name} tilbyr på ${location.name}. Abonnement gir lavere pris per økt.`}
      sidebar={
        <BookingSummary
          items={[
            { label: "Lokasjon", value: location.name },
            { label: "Trener", value: instructor.name },
          ]}
          backHref={`/booking-v2/velg-trener?locationId=${encodeURIComponent(locationId)}`}
        />
      }
    >
      {services.length === 0 ? (
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--color-warning-light)", borderColor: "var(--color-warning)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-warning)" }}>
            Ingen tjenester satt opp ennå.
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
            {instructor.name} har ikke aktivert noen tjenester på {location.name}.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:gap-4">
          {services.map((s) => {
            const carry = new URLSearchParams();
            carry.set("locationId", locationId);
            carry.set("instructorId", instructorId);
            carry.set("serviceTypeId", s.id);
            return (
              <BookingCard
                key={s.id}
                href={`/booking-v2/tid?${carry.toString()}`}
                title={s.name}
                description={s.description ?? undefined}
                meta={[
                  `${s.duration} min`,
                  s.priceLabel + (s.category === "abonnement" ? "/mnd" : ""),
                  CATEGORY_LABEL[s.category] ?? s.category,
                ]}
                icon={CATEGORY_ICON[s.category] ?? <Zap className="h-5 w-5" />}
              />
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <a
          href={`/booking-v2/velg-trener?locationId=${encodeURIComponent(locationId)}`}
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-ink-muted)" }}
        >
          ← Tilbake til trener
        </a>
      </div>
    </BookingPageTemplate>
  );
}
