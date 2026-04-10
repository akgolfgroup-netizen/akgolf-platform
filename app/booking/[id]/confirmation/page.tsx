import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { ConfirmationView } from "./ConfirmationView";
import { PublicConfirmationView } from "./PublicConfirmationView";
import { Loader2, AlertCircle } from "lucide-react";

// Apple Light Theme 2026
const THEME = {
  bg: "#ECF0EF",
  bgElevated: "#FFFFFF",
  primary: "#0A1F18",
  text: "#0A1F18",
  textMuted: "#7A8C85",
  border: "#D5DFDB",
};

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
            style={{ background: THEME.bg }}
          >
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: THEME.primary }} />
          </div>
          <h2 className="text-xl font-semibold mb-2" style={{ color: THEME.text }}>
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
        serviceName={booking.ServiceType?.name}
        instructorName={instructorName}
        formattedDate={formattedDate}
        duration={booking.ServiceType?.duration}
        priceNOK={priceNOK}
        paymentMethod={booking.paymentMethod}
        studentEmail={booking.User?.email ?? ""}
        bookingId={booking.id}
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
