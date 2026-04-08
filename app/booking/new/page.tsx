import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BookingPaymentForm } from "./BookingPaymentForm";
import { BookingStepManager } from "./BookingStepManager";
import { Calendar, CreditCard } from "lucide-react";

interface Props {
  searchParams: Promise<{
    serviceTypeId?: string;
    instructorId?: string;
    startTime?: string;
  }>;
}

export default async function BookingNewPage({ searchParams }: Props) {
  const params = await searchParams;
  const { serviceTypeId, instructorId, startTime } = params;

  const user = await getPortalUser();
  if (!user?.id) {
    const callbackUrl = encodeURIComponent(
      `/booking/new?serviceTypeId=${serviceTypeId ?? ""}&instructorId=${instructorId ?? ""}&startTime=${startTime ?? ""}`
    );
    redirect(`/portal/login?callbackUrl=${callbackUrl}`);
  }

  // Need at least serviceTypeId
  if (!serviceTypeId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F7]">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border bg-white border-[#E8E8ED]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#F5F5F7]">
            <Calendar className="w-8 h-8 text-[#1D1D1F]" />
          </div>
          <p className="text-[#86868B]">
            Mangler bookingdetaljer. Vennligst start på nytt fra booking-systemet.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createServerSupabase();

  // Fetch service type and instructors
  const { data: serviceType } = await supabase
    .from("ServiceType")
    .select("id, name, duration, price, description, allowStripe, allowVipps")
    .eq("id", serviceTypeId)
    .eq("isPublic", true)
    .eq("isActive", true)
    .single();

  if (!serviceType) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#F5F5F7]">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border bg-white border-[#E8E8ED]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-[#F5F5F7]">
            <CreditCard className="w-8 h-8 text-[#1D1D1F]" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-[#1D1D1F]">
            Kunne ikke finne tjenesten
          </h2>
          <p className="text-[#86868B]">
            Tjenesten ble ikke funnet. Vennligst prøv igjen.
          </p>
        </div>
      </div>
    );
  }

  // Fetch instructors for this service
  const { data: instructors } = await supabase
    .from("Instructor")
    .select(`
      *,
      User:userId(name, image),
      InstructorServiceType!inner(serviceTypeId)
    `)
    .eq("InstructorServiceType.serviceTypeId", serviceTypeId);

  // If all params provided, show payment form directly
  if (instructorId && startTime) {
    const instructor = instructors?.find((i) => i.id === instructorId);
    if (instructor) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
          <BookingPaymentForm
            serviceType={serviceType}
            instructor={{
              id: instructor.id,
              user: { name: instructor.User?.name, image: instructor.User?.image },
            }}
            startTime={startTime}
            studentId={user.id}
          />
        </div>
      );
    }
  }

  // Show step manager for instructor/time selection
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
      <BookingStepManager
        serviceType={serviceType}
        instructors={(instructors ?? []).map((i) => ({
          id: i.id,
          user: { name: i.User?.name, image: i.User?.image },
        }))}
        studentId={user.id}
      />
    </div>
  );
}
