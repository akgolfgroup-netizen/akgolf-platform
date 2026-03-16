import { getPortalUser } from "@/lib/portal/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { StripePaymentPage } from "../StripePaymentPage";
import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";

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

export default async function BookingPayPage({ params }: Props) {
  const { id } = await params;

  const user = await getPortalUser();
  if (!user?.id) {
    const callbackUrl = encodeURIComponent(`/portal/booking/${id}/pay`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const booking = await prisma.booking.findFirst({
    where: { id, studentId: user.id },
    include: {
      serviceType: { select: { name: true, duration: true, price: true } },
    },
  });

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

  if (!booking.stripePaymentId) {
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
            Betaling ikke tilgjengelig
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Ingen Stripe-betaling er knyttet til denne bookingen.
          </p>
        </div>
      </div>
    );
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(
    booking.stripePaymentId
  );

  if (!paymentIntent.client_secret) {
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
            <ShieldCheck className="w-8 h-8" style={{ color: THEME.gold }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.navy }}>
            Betalingsfeil
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Kunne ikke hente betalingsinformasjon. Prøv igjen eller kontakt support.
          </p>
        </div>
      </div>
    );
  }

  return (
    <StripePaymentPage
      clientSecret={paymentIntent.client_secret}
      bookingId={id}
      serviceName={booking.serviceType.name}
    />
  );
}
