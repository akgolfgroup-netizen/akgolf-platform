import { getPortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { prisma } from "@/lib/portal/prisma";
import { BookingPaymentForm } from "./BookingPaymentForm";
import { Calendar, CreditCard } from "lucide-react";

// Warm Light Theme
const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  gold: "#B8975C",
  navy: "#0F2950",
  textMuted: "#64748B",
  border: "#EBE5DA",
};

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
      `/portal/booking/new?serviceTypeId=${serviceTypeId ?? ""}&instructorId=${instructorId ?? ""}&startTime=${startTime ?? ""}`
    );
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  if (!serviceTypeId || !instructorId || !startTime) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: THEME.bg }}
      >
        <div
          className="rounded-3xl p-10 max-w-md w-full text-center border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
          }}
        >
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${THEME.gold}15` }}
          >
            <Calendar className="w-8 h-8" style={{ color: THEME.gold }} />
          </div>
          <p style={{ color: THEME.textMuted }}>
            Mangler bookingdetaljer. Vennligst start på nytt fra booking-systemet.
          </p>
        </div>
      </div>
    );
  }

  const [serviceType, instructor] = await Promise.all([
    prisma.serviceType.findFirst({
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
    }),
    prisma.instructor.findFirst({
      where: {
        id: instructorId,
        serviceTypes: { some: { id: serviceTypeId } },
      },
      include: { user: { select: { name: true, image: true } } },
    }),
  ]);

  if (!serviceType || !instructor) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: THEME.bg }}
      >
        <div
          className="rounded-3xl p-10 max-w-md w-full text-center border"
          style={{
            background: THEME.bgElevated,
            borderColor: THEME.border,
          }}
        >
          <div 
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: `${THEME.gold}15` }}
          >
            <CreditCard className="w-8 h-8" style={{ color: THEME.gold }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.navy }}>
            Kunne ikke finne bookingdetaljer
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Tjenesten eller instruktøren ble ikke funnet. Vennligst prøv igjen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: THEME.bg }}
    >
      <BookingPaymentForm
        serviceType={serviceType}
        instructor={{
          id: instructor.id,
          user: { name: instructor.user.name, image: instructor.user.image },
        }}
        startTime={startTime}
        studentId={user.id}
      />
    </div>
  );
}
