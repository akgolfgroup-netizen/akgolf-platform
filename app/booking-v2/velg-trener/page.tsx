import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { BookingPageTemplate } from "@/components/booking-v2/BookingPageTemplate";
import { BookingCard } from "@/components/booking-v2/BookingCard";
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
    <BookingPageTemplate
      step={2}
      eyebrow="Steg 2 av 7 — Velg trener"
      title={
        <>
          Med hvem vil <em className="not-italic" style={{ color: "var(--color-primary)" }}>du</em> trene?
        </>
      }
      lede={`Trenere som er tilgjengelige på ${location.name}. Hver trener har sine egne tjenester og tider.`}
    >
      {instructors.length === 0 ? (
        <div
          className="rounded-xl border p-5"
          style={{ background: "var(--color-warning-light)", borderColor: "var(--color-warning)" }}
        >
          <p className="text-sm font-medium" style={{ color: "var(--color-warning)" }}>
            Ingen trenere på denne lokasjonen ennå.
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Velg en annen lokasjon, eller kontakt oss på{" "}
            <a href="mailto:post@akgolf.no" className="underline">
              post@akgolf.no
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3 md:gap-4">
          {instructors.map((i) => {
            const carry = new URLSearchParams();
            carry.set("locationId", locationId);
            carry.set("instructorId", i.id);
            return (
              <BookingCard
                key={i.id}
                href={`/booking-v2/velg-tjeneste?${carry.toString()}`}
                title={i.name}
                description={i.title ?? i.bio?.slice(0, 140) ?? undefined}
                icon={<User className="h-5 w-5 md:h-6 md:w-6" />}
              />
            );
          })}
        </div>
      )}

      <div className="mt-6">
        <a
          href="/booking-v2/lokasjon"
          className="inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 transition-colors hover:text-[var(--color-primary)]"
          style={{ color: "var(--color-ink-muted)" }}
        >
          ← Tilbake til lokasjon
        </a>
      </div>
    </BookingPageTemplate>
  );
}
