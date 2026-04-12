export interface ServiceType {
  id: string;
  name: string;
  description: string | null;
  category: string;
  duration: number;
  price: number;
  color: string | null;
  maxStudents: number;
  instructors: InstructorOption[];
}

export interface InstructorOption {
  id: string;
  title: string | null;
  user: { name: string | null; image: string | null };
}

export type BookingStep =
  | "service"
  | "instructor"
  | "date"
  | "time"
  | "summary";

export const STEP_LABELS: Record<BookingStep, string> = {
  service: "Tjeneste",
  instructor: "Trener",
  date: "Dato",
  time: "Tidspunkt",
  summary: "Bekreft",
};

export interface BookingState {
  service: ServiceType | null;
  instructor: InstructorOption | null;
  date: Date | null;
  slot: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export const INITIAL_BOOKING_STATE: BookingState = {
  service: null,
  instructor: null,
  date: null,
  slot: null,
  customerName: "",
  customerEmail: "",
  customerPhone: "",
};

export function formatPrice(price: number): string {
  return price.toLocaleString("nb-NO", { minimumFractionDigits: 0 }) + " kr";
}

export function getVisibleSteps(
  hasMultipleInstructors: boolean
): BookingStep[] {
  if (hasMultipleInstructors) {
    return ["service", "instructor", "date", "time", "summary"];
  }
  return ["service", "date", "time", "summary"];
}
