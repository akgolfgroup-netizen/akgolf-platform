/**
 * Booking Wizard — Delte typer
 * Brukes av både /academy/booking (public) og /portal/bookinger/ny (portal)
 */

export interface BookingServiceType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  price: number;
  color: string | null;
  maxStudents: number;
  instructors: BookingInstructor[];
}

export interface BookingInstructor {
  id: string;
  title: string | null;
  user: { name: string | null; image: string | null };
}

export type BookingStep = "service" | "datetime" | "details" | "confirm";

export type BookingMode = "public" | "portal";

export interface BookingWizardState {
  step: BookingStep;
  selectedService: BookingServiceType | null;
  selectedInstructor: BookingInstructor | null;
  selectedDate: Date | null;
  selectedSlot: string | null;
  availableSlots: string[];
  loadingSlots: boolean;
  booking: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export const STEP_CONFIG: Record<BookingStep, { label: string; index: number }> = {
  service: { label: "Tjeneste", index: 0 },
  datetime: { label: "Tidspunkt", index: 1 },
  details: { label: "Opplysninger", index: 2 },
  confirm: { label: "Bekreft", index: 3 },
};

export function getVisibleSteps(mode: BookingMode): BookingStep[] {
  if (mode === "portal") {
    return ["service", "datetime", "confirm"];
  }
  return ["service", "datetime", "details", "confirm"];
}

export function formatBookingPrice(price: number): string {
  return price.toLocaleString("nb-NO", { minimumFractionDigits: 0 }) + " kr";
}
