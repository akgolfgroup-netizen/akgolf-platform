import type { Metadata } from "next";
import { BookingShell } from "@/components/booking-v2/BookingShell";

export const metadata: Metadata = {
  title: "Booking — AK Golf",
  robots: { index: false, follow: false },
};

export default function BookingV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <BookingShell>{children}</BookingShell>;
}
