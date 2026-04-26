import { notFound } from "next/navigation";
import { getStudent360 } from "./get-student-360";
import { Hero360 } from "@/components/portal/admin/student-360/Hero360";
import { KontaktinfoCard } from "@/components/portal/admin/student-360/KontaktinfoCard";
import { GolfCard } from "@/components/portal/admin/student-360/GolfCard";
import { CoachingCard } from "@/components/portal/admin/student-360/CoachingCard";
import { TrainingCard } from "@/components/portal/admin/student-360/TrainingCard";
import { MentalForecastCard } from "@/components/portal/admin/student-360/MentalForecastCard";
import { TestsCard } from "@/components/portal/admin/student-360/TestsCard";
import { EconomyCard } from "@/components/portal/admin/student-360/EconomyCard";
import { SignalsCard } from "@/components/portal/admin/student-360/SignalsCard";

export const metadata = {
  title: "Spillerprofil 360° | AK Golf CoachHQ",
};
export const dynamic = "force-dynamic";

export default async function Student360Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await getStudent360(id);
  if (!data) notFound();

  return (
    <div className="space-y-6 max-w-[1200px]">
      {/* Hero */}
      <Hero360 identity={data.identity} golf={data.golf} coaching={data.coaching} />

      {/* Row 1: Kontaktinfo (5) + Golf-statistikk (7) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5">
          <KontaktinfoCard identity={data.identity} />
        </div>
        <div className="col-span-7">
          <GolfCard golf={data.golf} />
        </div>
      </div>

      {/* Row 2: Coaching-historikk (7) + Trening (5) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7">
          <CoachingCard coaching={data.coaching} />
        </div>
        <div className="col-span-5">
          <TrainingCard training={data.training} />
        </div>
      </div>

      {/* Row 3: Mental + prognose (7) + Tester (5) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-7">
          <MentalForecastCard mental={data.mental} forecast={data.forecast} />
        </div>
        <div className="col-span-5">
          <TestsCard tests={data.tests} />
        </div>
      </div>

      {/* Row 4: Økonomi (5) + Signaler (7) */}
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-5">
          <EconomyCard economy={data.economy} />
        </div>
        <div className="col-span-7">
          <SignalsCard signals={data.signals} />
        </div>
      </div>
    </div>
  );
}
