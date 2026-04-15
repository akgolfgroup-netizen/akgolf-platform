import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { stripe } from "@/lib/portal/stripe";
import { StripePaymentPage } from "../StripePaymentPage";
import { PublicStripePaymentPage } from "../PublicStripePaymentPage";
import { AlertCircle, CreditCard, ShieldCheck } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingPayPage({ params }: Props) {
  const { id } = await params;

  const user = await getPortalUser();

  const supabase = await createServerSupabase();

  // Fetch booking - if user is logged in, verify ownership; otherwise allow public access
  let query = supabase
    .from("Booking")
    .select(`
      *,
      ServiceType:serviceTypeId(name, duration, price),
      User:studentId(name, email)
    `)
    .eq("id", id);

  if (user?.id) {
    query = query.eq("studentId", user.id);
  }

  const { data: booking } = await query.single();

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Booking ikke funnet
          </h2>
          <p className="text-muted">
            Vi kunne ikke finne denne bookingen. Kontroller at lenken er korrekt.
          </p>
        </div>
      </div>
    );
  }

  // Check if booking is already paid or cancelled
  if (booking.status === "CONFIRMED") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Allerede betalt
          </h2>
          <p className="text-muted">
            Denne bookingen er allerede betalt og bekreftet.
          </p>
        </div>
      </div>
    );
  }

  if (booking.status === "CANCELLED") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Booking kansellert
          </h2>
          <p className="text-muted">
            Denne bookingen har blitt kansellert.
          </p>
        </div>
      </div>
    );
  }

  if (!booking.stripePaymentId) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Betaling ikke tilgjengelig
          </h2>
          <p className="text-muted">
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
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-grey-200 bg-white">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2 text-primary">
            Betalingsfeil
          </h2>
          <p className="text-muted">
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
        serviceName={booking.ServiceType?.name}
        customerEmail={booking.User?.email ?? ""}
        amount={booking.ServiceType?.price}
      />
    );
  }

  return (
    <StripePaymentPage
      clientSecret={paymentIntent.client_secret}
      bookingId={id}
      serviceName={booking.ServiceType?.name}
    />
  );
}
