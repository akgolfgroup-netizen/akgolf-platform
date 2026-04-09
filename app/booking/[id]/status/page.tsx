import { getPortalUser } from "@/lib/portal/auth";
import { createServerSupabase } from "@/lib/supabase/server";
import { format } from "date-fns";
import { nb } from "date-fns/locale";
import { BookingStatusView } from "./BookingStatusView";
import { NotFoundView } from "./NotFoundView";
import type { BookingStatus, PaymentStatus, PaymentMethod } from "@prisma/client";

export const metadata = {
  title: "Booking-status | AK Golf",
  description: "Se status for din booking hos AK Golf Academy",
};

interface BookingWithRelations {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  startTime: string;
  endTime: string;
  amount: number;
  studentNotes: string | null;
  adminNotes: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  ServiceType: {
    name: string;
    duration: number;
    price: number;
    description: string | null;
  } | null;
  Instructor: {
    User: {
      name: string | null;
      image: string | null;
    } | null;
    title: string | null;
  } | null;
  Location: {
    name: string;
    address: string | null;
  } | null;
  User: {
    name: string | null;
    email: string;
  } | null;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookingStatusPage({ params }: Props) {
  const { id } = await params;
  const user = await getPortalUser();
  const supabase = await createServerSupabase();

  // Fetch booking with all related data
  let query = supabase
    .from("Booking")
    .select(`
      id,
      status,
      paymentStatus,
      paymentMethod,
      startTime,
      endTime,
      amount,
      studentNotes,
      adminNotes,
      cancelledAt,
      cancelReason,
      createdAt,
      ServiceType:serviceTypeId(name, duration, price, description),
      Instructor:instructorId(
        title,
        User:userId(name, image)
      ),
      Location:locationId(name, address),
      User:studentId(name, email)
    `)
    .eq("id", id)
    .single();

  const { data: booking, error } = await query;

  if (error || !booking) {
    return <NotFoundView />;
  }

  const typedBooking = booking as unknown as BookingWithRelations;

  // Format dates
  const startTime = new Date(typedBooking.startTime);
  const endTime = new Date(typedBooking.endTime);
  const createdAt = new Date(typedBooking.createdAt);
  const cancelledAt = typedBooking.cancelledAt 
    ? new Date(typedBooking.cancelledAt) 
    : null;

  const formattedDate = format(startTime, "EEEE d. MMMM yyyy", { locale: nb });
  const formattedTimeRange = `${format(startTime, "HH:mm")} - ${format(endTime, "HH:mm")}`;
  const formattedCreatedAt = format(createdAt, "d. MMMM yyyy 'kl.' HH:mm", { locale: nb });
  const formattedCancelledAt = cancelledAt 
    ? format(cancelledAt, "d. MMMM yyyy 'kl.' HH:mm", { locale: nb })
    : null;

  // Capitalize first letter only
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Format price
  const priceDisplay = typedBooking.amount > 0
    ? typedBooking.amount.toLocaleString("nb-NO", {
        style: "currency",
        currency: "NOK",
        minimumFractionDigits: 0,
      })
    : typedBooking.ServiceType?.price 
      ? typedBooking.ServiceType.price.toLocaleString("nb-NO", {
          style: "currency",
          currency: "NOK",
          minimumFractionDigits: 0,
        })
      : null;

  const isOwner = user?.id && typedBooking.User?.email === user.email;

  return (
    <BookingStatusView
      booking={{
        id: typedBooking.id,
        status: typedBooking.status,
        paymentStatus: typedBooking.paymentStatus,
        paymentMethod: typedBooking.paymentMethod,
        serviceName: typedBooking.ServiceType?.name ?? "Ukjent tjeneste",
        serviceDescription: typedBooking.ServiceType?.description,
        duration: typedBooking.ServiceType?.duration ?? 60,
        instructorName: typedBooking.Instructor?.User?.name ?? "Ukjent instruktør",
        instructorTitle: typedBooking.Instructor?.title,
        locationName: typedBooking.Location?.name,
        locationAddress: typedBooking.Location?.address,
        date: capitalizedDate,
        timeRange: formattedTimeRange,
        price: priceDisplay,
        studentNotes: typedBooking.studentNotes,
        adminNotes: typedBooking.adminNotes,
        cancelReason: typedBooking.cancelReason,
        createdAt: formattedCreatedAt,
        cancelledAt: formattedCancelledAt,
      }}
      isAuthenticated={!!user?.id}
      isOwner={isOwner}
    />
  );
}
