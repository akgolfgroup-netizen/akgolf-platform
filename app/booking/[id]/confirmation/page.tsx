import { getPortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { prisma } from "@/lib/portal/prisma";
import { ConfirmationView } from "./ConfirmationView";
import { Loader2, AlertCircle } from "lucide-react";

// Warm Light Theme
const THEME = {
  bg: "#FAFBFC",
  bgElevated: "#FFFFFF",
  gold: "#B8975C",
  navy: "#0F2950",
  text: "#02060D",
  textMuted: "#64748B",
  border: "#EBE5DA",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { id } = await params;

  const user = await getPortalUser();
  if (!user?.id) {
    const callbackUrl = encodeURIComponent(`/portal/booking/${id}/confirmation`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const booking = await prisma.booking.findFirst({
    where: { id, studentId: user.id },
    include: {
      serviceType: { select: { name: true, duration: true, price: true } },
      instructor: { include: { user: { select: { name: true, image: true } } } },
    },
  });

  // Booking not found
  if (!booking) {
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
            <AlertCircle className="w-8 h-8" style={{ color: THEME.gold }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.navy }}>
            Booking ikke funnet
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Vi kunne ikke finne denne bookingen. Kontroller at lenken er korrekt.
          </p>
        </div>
      </div>
    );
  }

  // Payment still processing
  if (booking.status === "PENDING") {
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
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: THEME.gold }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.navy }}>
            Betaling pågår
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Vi behandler betalingen din. Du vil motta en bekreftelse på e-post
            når bookingen er bekreftet.
          </p>
        </div>
      </div>
    );
  }

  // Format date in Norwegian
  const rawDate = format(booking.startTime, "EEEE d. MMMM yyyy 'kl.' HH:mm", {
    locale: nb,
  });
  // Capitalize only first character — Norwegian month names and "kl." must stay lowercase
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  // Format price
  const priceNOK = (booking.serviceType.price / 100).toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
  });

  const instructorName = booking.instructor.user.name ?? "Ukjent instruktør";

  return (
    <ConfirmationView
      serviceName={booking.serviceType.name}
      instructorName={instructorName}
      formattedDate={formattedDate}
      duration={booking.serviceType.duration}
      priceNOK={priceNOK}
      paymentMethod={booking.paymentMethod}
    />
  );
}
