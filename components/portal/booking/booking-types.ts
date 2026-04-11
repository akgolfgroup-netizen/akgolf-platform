/**
 * Delte typer for booking-komponenter i spillerportalen.
 */

export interface BookingViewModel {
  id: string;
  serviceName: string;
  instructorName: string;
  startTime: Date;
  duration: number;
  location?: string;
  status: "upcoming" | "completed" | "cancelled";
  type: "coaching" | "training" | "tournament" | "booking";
}

export interface CancellationRule {
  hours: string;
  rule: string;
  fee: string;
}

export type BookingStatusVariant = "success" | "warning" | "cancelled";

export interface StatusConfig {
  label: string;
  variant: BookingStatusVariant;
}

export function getStatusConfig(booking: BookingViewModel): StatusConfig {
  switch (booking.status) {
    case "upcoming":
      return { label: "Bekreftet", variant: "success" };
    case "completed":
      return { label: "Fullført", variant: "warning" };
    case "cancelled":
      return { label: "Avlyst", variant: "cancelled" };
  }
}
