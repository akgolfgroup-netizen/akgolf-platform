import { getPortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
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

  // Fetch service type and instructors
  const serviceType = await prisma.serviceType.findFirst({
    where: { id: serviceTypeId, isPublic: true, isActive: true },
    select: {
      id: true,
      name: true,
      duration: true,
      price: true,
      description: true,
      allowStripe: true,
      allowVipps: true,
    },
  });

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
  const instructors = await prisma.instructor.findMany({
    where: {
      ServiceType: { some: { id: serviceTypeId } },
    },
    include: { User: { select: { name: true, image: true } } },
  });

  // If all params provided, show payment form directly
  if (instructorId && startTime) {
    const instructor = instructors.find((i) => i.id === instructorId);
    if (instructor) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#F5F5F7]">
          <BookingPaymentForm
            serviceType={serviceType}
            instructor={{
              id: instructor.id,
              user: { name: instructor.User.name, image: instructor.User.image },
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
        instructors={instructors.map((i) => ({
          id: i.id,
          user: { name: i.User.name, image: i.User.image },
        }))}
        studentId={user.id}
      />
    </div>
  );
}
