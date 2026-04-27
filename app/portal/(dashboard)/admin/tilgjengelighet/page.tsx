import { TilgjengelighetPageHeader } from "@/components/admin/tilgjengelighet/page-header";
import { WeekCard } from "@/components/admin/tilgjengelighet/week-card";
import { RulesPanel } from "@/components/admin/tilgjengelighet/rules-panel";
import { ExceptionsPanel } from "@/components/admin/tilgjengelighet/exceptions-panel";
import {
  STANDARD_HOURS,
  BOOKING_POLICY,
  EXCEPTIONS,
} from "@/components/admin/tilgjengelighet/mock-data";

// TODO: koble til ekte data
// - workingHours: ny modell CoachAvailability per Instructor
// - exceptions: ny modell CoachAvailabilityException
// - bookingPolicy: settings på Instructor
// - week-cells: aggregat fra Booking + CoachAvailability for valgt uke

export default function TilgjengelighetPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <TilgjengelighetPageHeader />

      <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start gap-[18px]">
        <WeekCard />

        <div className="flex flex-col gap-3.5">
          <RulesPanel
            title="Standard arbeidsuke"
            meta="REDIGER"
            rules={STANDARD_HOURS}
          />
          <ExceptionsPanel items={EXCEPTIONS} />
          <RulesPanel
            title="Booking-policy"
            meta="REDIGER"
            rules={BOOKING_POLICY}
          />
        </div>
      </div>
    </div>
  );
}
