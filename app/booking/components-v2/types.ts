// app/booking/components-v2/types.ts

export interface TrainerService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  isSubscription: boolean;
  availableSlotsThisWeek: number;
  allowStripe: boolean;
}

export interface TrainerWithServices {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  badge: string;
  services: TrainerService[];
}

export type DrawerType = "datetime" | "confirm" | "payment" | "success" | null;

export interface SmartSlot {
  time: string;
  available: boolean;
  isoString?: string;
}

export interface DayData {
  date: string;
  dayName: string;
  dayNumber: number;
  month: string;
  slots: SmartSlot[];
}

export interface BookingState {
  trainerId: string | null;
  serviceId: string | null;
  date: string | null;
  time: string | null;
  slotIso: string | null;
  focusAreas: string[];
  notes: string;
  name: string;
  email: string;
  phone: string;
  handicap: string;
  acceptedTerms: boolean;
}

export const INITIAL_BOOKING_STATE: BookingState = {
  trainerId: null,
  serviceId: null,
  date: null,
  time: null,
  slotIso: null,
  focusAreas: [],
  notes: "",
  name: "",
  email: "",
  phone: "",
  handicap: "",
  acceptedTerms: false,
};
