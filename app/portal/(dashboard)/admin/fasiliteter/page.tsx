import { FasiliteterPageHeader } from "@/components/admin/fasiliteter/v2/page-header";
import { FacilityCard } from "@/components/admin/fasiliteter/v2/facility-card";
import { FACILITIES } from "@/components/admin/fasiliteter/v2/mock-data";

// TODO: koble til ekte data
// - facilities: prisma.facility.findMany med equipment + utilization
// - utilization: aggregat fra FacilityBooking siste 7/30 dager
// - nextSlot: lib/portal/booking/available-slots for fasilitet
// - equipment-status: ny modell FacilityEquipment med kalibrering

export default function FasiliteterPage() {
  return (
    <div className="min-h-full bg-[#102B1E] px-7 pb-12 pt-6 text-white">
      <FasiliteterPageHeader />

      <div className="grid grid-cols-2 gap-[18px]">
        {FACILITIES.map((facility) => (
          <FacilityCard key={facility.id} facility={facility} />
        ))}
      </div>
    </div>
  );
}
