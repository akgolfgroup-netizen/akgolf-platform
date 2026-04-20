import { Icon } from "@/components/ui/icon";
import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ConfirmationView } from "./ConfirmationView";
import { PublicConfirmationView } from "./PublicConfirmationView";
import { PaymentPendingPoller } from "./PaymentPendingPoller";


interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingConfirmationPage({ params }: Props) {
  const { id } = await params;

  const user = await getPortalUser();

  const supabase = await createServerSupabase();

  // Fetch booking - if user is logged in, verify ownership; otherwise allow public access
  let query = supabase
    .from("Booking")
    .select(`
      *,
      ServiceType:serviceTypeId(name, duration, price),
      Instructor:instructorId(
        User:userId(name, image)
      ),
      User:studentId(name, email)
    `)
    .eq("id", id);

  if (user?.id) {
    query = query.eq("studentId", user.id);
  }

  const { data: booking } = await query.single();

  // Booking not found
  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-surface">
        <div className="rounded-3xl p-10 max-w-md w-full text-center border border-outline-variant/30 bg-surface-container-lowest">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 bg-surface">
            <Icon name="error" className="w-8 h-8 text-primary" />
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

  // Payment still processing — poll for webhook confirmation
  if (booking.status === "PENDING") {
    return <PaymentPendingPoller bookingId={id} />;
  }

  // Format date in Norwegian
  const rawDate = format(booking.startTime, "EEEE d. MMMM yyyy 'kl.' HH:mm", {
    locale: nb,
  });
  // Capitalize only first character — Norwegian month names and "kl." must stay lowercase
  const formattedDate = rawDate.charAt(0).toUpperCase() + rawDate.slice(1);

  // Format price
  // Prisene er lagret i kroner
  const priceNOK = booking.ServiceType?.price?.toLocaleString("nb-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
  });

  const instructorName = booking.Instructor?.User?.name ?? "Ukjent instruktør";

  // If user is not logged in, show public confirmation view
  if (!user?.id) {
    return (
      <PublicConfirmationView
        instructorName={instructorName}
        formattedDate={formattedDate}
        duration={booking.ServiceType?.duration}
        priceNOK={priceNOK}
        studentEmail={booking.User?.email ?? ""}
        bookingPrice={booking.ServiceType?.price}
      />
    );
  }

  return (
    <ConfirmationView
      serviceName={booking.ServiceType?.name}
      instructorName={instructorName}
      formattedDate={formattedDate}
      duration={booking.ServiceType?.duration}
      priceNOK={priceNOK}
      paymentMethod={booking.paymentMethod}
      userName={user.name}
      bookingPrice={booking.ServiceType?.price}
    />
  );
}
