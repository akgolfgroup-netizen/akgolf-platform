import { getPortalUser } from "@/lib/portal/auth";
import { prisma } from "@/lib/portal/prisma";
import { stripe } from "@/lib/portal/stripe";
import { StripePaymentPage } from "../StripePaymentPage";
import { PublicStripePaymentPage } from "../PublicStripePaymentPage";
import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";
import { BookingStatus } from "@prisma/client";

// Apple Light Theme 2026
const THEME = {
  bg: "#F5F5F7",
  bgElevated: "#FFFFFF",
  primary: "#1D1D1F",
  text: "#1D1D1F",
  textMuted: "#86868B",
  border: "#E8E8ED",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPayPage({ params }: Props) {
  const { id } = await params;

  const user = await getPortalUser();
  
  // Fetch booking - if user is logged in, verify ownership; otherwise allow public access
  const booking = await prisma.booking.findFirst({
    where: user?.id 
      ? { id, studentId: user.id }
      : { id },
    include: {
      ServiceType: { select: { name: true, duration: true, price: true } },
      User: { select: { name: true, email: true } },
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
            style={{ background: THEME.bg }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: THEME.primary }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
            Booking ikke funnet
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Vi kunne ikke finne denne bookingen. Kontroller at lenken er korrekt.
          </p>
        </div>
      </div>
    );
  }

  // Check if booking is already paid or cancelled
  if (booking.status === BookingStatus.CONFIRMED) {
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
            style={{ background: THEME.bg }}
          >
            <ShieldCheck className="w-8 h-8" style={{ color: THEME.primary }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
            Allerede betalt
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Denne bookingen er allerede betalt og bekreftet.
          </p>
        </div>
      </div>
    );
  }

  if (booking.status === BookingStatus.CANCELLED) {
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
            style={{ background: THEME.bg }}
          >
            <AlertCircle className="w-8 h-8" style={{ color: THEME.primary }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
            Booking kansellert
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Denne bookingen har blitt kansellert.
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
            style={{ background: THEME.bg }}
          >
            <CreditCard className="w-8 h-8" style={{ color: THEME.primary }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
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
            style={{ background: THEME.bg }}
          >
            <ShieldCheck className="w-8 h-8" style={{ color: THEME.primary }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
            Betalingsfeil
          </h2>
          <p style={{ color: THEME.textMuted }}>
            Kunne ikke hente betalingsinformasjon. Prøv igjen eller kontakt support.
          </p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show public payment page
  if (!user?.id) {
    return (
      <PublicStripePaymentPage
        clientSecret={paymentIntent.client_secret}
        bookingId={id}
        serviceName={booking.ServiceType.name}
        customerEmail={booking.User.email ?? ""}
        customerName={booking.User.name ?? ""}
        amount={booking.ServiceType.price}
      />
    );
  }

  return (
    <StripePaymentPage
      clientSecret={paymentIntent.client_secret}
      bookingId={id}
      serviceName={booking.ServiceType.name}
    />
  );
}
