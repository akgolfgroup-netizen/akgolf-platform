import type { Metadata } from "next";
import { BookingShell } from "@/components/booking-v2/BookingShell";
import "./booking-v2.css";

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
