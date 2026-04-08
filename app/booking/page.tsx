import { redirect } from "next/navigation";

export default function BookingPage() {
  // Omdiriger til ny booking-flyt
  redirect("/booking/select-service");
}
