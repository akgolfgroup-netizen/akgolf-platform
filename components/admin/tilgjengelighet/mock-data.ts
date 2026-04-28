// TODO: koble til ekte data
// - bookings: prisma.booking.findMany({ where: { instructorId, startTime: { gte: weekStart, lt: weekEnd } } })
// - workingHours: ny modell CoachAvailability eller manuelt på Instructor
// - exceptions: ny modell CoachAvailabilityException (date, type, label)
// - bookingPolicy: settings på Instructor / Capabilities

export type CellState = "free" | "avail" | "booked" | "blocked" | "holiday";

export interface WeekDay {
  short: string;
  date: string;
  today?: boolean;
}

export const WEEK_DAYS: WeekDay[] = [
  { short: "MAN", date: "28" },
  { short: "TIR", date: "29" },
  { short: "ONS", date: "30" },
  { short: "TOR", date: "01" },
  { short: "FRE", date: "02" },
  { short: "LØR", date: "03", today: true },
  { short: "SØN", date: "04" },
];

export const HOURS = [
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

// Hver rad svarer til en time. 7 verdier per rad for hver dag i uken.
export const WEEK_CELLS: CellState[][] = [
  ["free", "free", "free", "free", "free", "free", "free"],
  ["avail", "avail", "avail", "avail", "avail", "avail", "free"],
  ["avail", "avail", "avail", "booked", "avail", "avail", "free"],
  ["avail", "avail", "holiday", "booked", "avail", "avail", "avail"],
  ["booked", "booked", "holiday", "avail", "avail", "avail", "avail"],
  ["blocked", "blocked", "holiday", "blocked", "blocked", "blocked", "free"],
  ["avail", "avail", "holiday", "avail", "avail", "avail", "free"],
  ["avail", "booked", "avail", "avail", "booked", "avail", "free"],
  ["booked", "booked", "avail", "booked", "booked", "free", "free"],
  ["booked", "avail", "booked", "booked", "avail", "free", "free"],
  ["avail", "avail", "avail", "avail", "free", "free", "free"],
  ["avail", "avail", "avail", "free", "free", "free", "free"],
  ["free", "free", "free", "free", "free", "free", "free"],
];

export type IconName =
  | "sun"
  | "calendar"
  | "moon"
  | "coffee"
  | "timer"
  | "clock-4"
  | "x-circle"
  | "repeat";

export interface RuleItem {
  icon: IconName;
  name: string;
  meta: string;
  on: boolean;
  muted?: boolean;
}

export const STANDARD_HOURS: RuleItem[] = [
  { icon: "sun", name: "Hverdager", meta: "MAN–FRE · 08:00–18:00", on: true },
  { icon: "calendar", name: "Lørdag", meta: "10:00–14:00 · KIDS-CAMP", on: true },
  { icon: "moon", name: "Søndag", meta: "FRI", on: false, muted: true },
  { icon: "coffee", name: "Lunsj", meta: "12:00–13:00 DAGLIG", on: true },
  { icon: "timer", name: "Buffer mellom økter", meta: "15 MIN MIN", on: true },
];

export const BOOKING_POLICY: RuleItem[] = [
  { icon: "clock-4", name: "Min varsel før booking", meta: "12 TIMER", on: true },
  { icon: "x-circle", name: "Avbestilling", meta: "24 T FRI · < 24 T 50%", on: true },
  { icon: "repeat", name: "Re-book ved vær-avlyst", meta: "AUTO", on: true },
];

export interface ExceptionItem {
  date: string;
  name: string;
  label: string;
  variant: "danger" | "warning";
}

export const EXCEPTIONS: ExceptionItem[] = [
  { date: "01 MAI", name: "Helligdag · Arbeiderens dag", label: "FRI", variant: "danger" },
  { date: "17 MAI", name: "Grunnlovsdagen", label: "FRI", variant: "danger" },
  { date: "12–14 JUN", name: "Tour Camp Holtsmark", label: "REDUSERT", variant: "warning" },
];
