import { LokasjonerPageHeader } from "@/components/admin/lokasjoner/lokasjoner-page-header";
import { LocationsMap } from "@/components/admin/lokasjoner/locations-map";
import { LocationCard } from "@/components/admin/lokasjoner/location-card";
import { LOCATIONS_LIST, MAP_PINS } from "@/components/admin/lokasjoner/mock-data";

// TODO: koble til ekte data
// - prisma.location.findMany med facility-relasjoner
// - kart-pinner fra Location.lat/lng (na hardkodet pixel-percentages mot mockup)
// - belegg uke aggregert fra Booking siste 7 dager per lokasjon

export default function LokasjonerPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <LokasjonerPageHeader
        eyebrow="/ Drift · Lokasjoner"
        title="Hvor du coacher."
        subtitle="5 lokasjoner totalt. Hovedsaklig Bogstad og Skullerud. Holtsmark er sesongbasert (mai–oktober). Spillere ser bare aktive lokasjoner i bookingflow."
      />

      <LocationsMap pins={MAP_PINS} />

      <div className="grid grid-cols-2 gap-[18px]">
        {LOCATIONS_LIST.map((loc) => (
          <LocationCard key={loc.id} loc={loc} />
        ))}
      </div>
    </div>
  );
}
