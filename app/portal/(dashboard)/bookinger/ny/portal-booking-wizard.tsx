"use client";

import { useRouter } from "next/navigation";
import { BookingWizard } from "@/components/booking";
import type { BookingServiceType } from "@/components/booking";

interface Props {
  services: BookingServiceType[];
}

export function PortalBookingWizard({ services }: Props) {
  const router = useRouter();

  function handleComplete(data: { bookingId: string; redirectUrl?: string }) {
    if (data.redirectUrl) {
      window.location.href = data.redirectUrl;
      return;
    }
    router.push("/portal/bookinger");
    router.refresh();
  }

  return <BookingWizard mode="portal" services={services} onComplete={handleComplete} />;
}
