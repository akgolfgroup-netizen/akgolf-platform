import { redirect } from "next/navigation";
import { MapPin } from "lucide-react";
import { BookingPageTemplate } from "@/components/booking-v2/BookingPageTemplate";
import { BookingCard } from "@/components/booking-v2/BookingCard";
import { getBookingV2Locations } from "@/lib/booking-v2/services";

export const dynamic = "force-dynamic";

export default async function LokasjonPage() {
  const locations = await getBookingV2Locations();

  return (
    <BookingPageTemplate
      step={1}
      eyebrow="Steg 1 av 7 — Velg lokasjon"
      title={
        <>
          Hvor vil <em className="not-italic" style={{ color: "var(--color-primary)" }}>du</em> trene?
        </>
      }
      lede="Velg klubb eller anlegg først — så viser vi hvilke trenere som er tilgjengelige der, og hvilke tjenester de tilbyr."
    >
      {locations.length === 0 ? (
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--color-warning-light)", borderColor: "var(--color-warning)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-warning)" }}>
            Ingen lokasjoner satt opp ennå.
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Trenere må aktivere minst én lokasjon i CoachHQ før booking blir tilgjengelig.
            Kontakt oss på{" "}
            <a href="mailto:post@akgolf.no" className="underline">
              post@akgolf.no
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:gap-4">
          {locations.map((loc) => (
            <BookingCard
              key={loc.id}
              href={`/booking-v2/velg-trener?locationId=${encodeURIComponent(loc.id)}`}
              title={loc.name}
              description={loc.address ?? undefined}
              icon={<MapPin className="h-5 w-5 md:h-6 md:w-6" />}
            />
          ))}
        </div>
      )}
    </BookingPageTemplate>
  );
}
