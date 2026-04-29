import { requirePortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { RescheduleForm } from "@/components/portal/booking/reschedule-form";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReschedulePage({ params }: Props) {
  const { id } = await params;
  const user = await requirePortalUser();
  if (!user?.id) redirect("/login");

  const supabase = await createServerSupabase();

  const { data: booking } = await supabase
    .from("Booking")
    .select(`
      *,
      ServiceType:serviceTypeId(id, name, duration),
      Instructor:instructorId(
        id,
        User:userId(name)
      )
    `)
    .eq("id", id)
    .maybeSingle();

  if (!booking || booking.studentId !== user.id) {
    notFound();
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-surface">Endre tidspunkt</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {booking.ServiceType.name} med{" "}
          {booking.Instructor?.User?.name ?? "Instruktor"}
        </p>
      </div>

      <RescheduleForm
        bookingId={booking.id}
        serviceTypeId={booking.ServiceType.id}
        instructorId={booking.Instructor.id}
        instructorName={booking.Instructor?.User?.name ?? "Instruktor"}
        serviceName={booking.ServiceType.name}
        duration={booking.ServiceType.duration}
      />
    </div>
  );
}
