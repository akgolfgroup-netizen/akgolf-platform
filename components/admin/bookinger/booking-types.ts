export type BookingStatus = "confirmed" | "pending" | "cancelled" | "live";

export type BookingRow = {
  id: string;
  dayLabel: string;
  dayShort: string;
  time: string;
  duration: string;
  player: { initials: string; name: string; sub: string; color: string };
  coach: { name: string; tag: string };
  location: string;
  status: BookingStatus;
  type: string;
};

export type BookingDayGroup = {
  label: string;
  count: number;
  rows: BookingRow[];
};

export type BookingStat = {
  label: string;
  value: string;
  tone: "default" | "warning" | "danger";
};

export type CoachFilter = { name: string; count: number };
