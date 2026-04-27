// TODO: Erstatt med data fra prisma.booking.findMany() filtrert på dato/coach
// Se lib/portal/booking/ for eksisterende lookup-helpers.

export type BookingStatus = "confirmed" | "pending" | "cancelled" | "live";

export type BookingRow = {
  id: string;
  dayLabel: string; // "I dag", "Onsdag", ...
  dayShort: string; // "30 APR"
  time: string; // "09:00"
  duration: string; // "60 min"
  player: { initials: string; name: string; sub: string; color: string };
  coach: { name: string; tag: string };
  location: string;
  status: BookingStatus;
  type: string;
};

export type BookingDayGroup = {
  label: string; // "I DAG · TIRSDAG 30. APRIL"
  count: number;
  rows: BookingRow[];
};

export const BOOKING_STATS = [
  { label: "I dag", value: "6", tone: "default" as const },
  { label: "Denne uken", value: "18", tone: "default" as const },
  { label: "Pending", value: "3", tone: "warning" as const },
  { label: "Avlyst 30d", value: "4", tone: "danger" as const },
  { label: "No-show 30d", value: "1", tone: "danger" as const },
];

export const COACH_FILTERS = [
  { name: "Anders K.", count: 9 },
  { name: "Maria T.", count: 5 },
  { name: "Erik S.", count: 4 },
];

export const BOOKING_DAYS: BookingDayGroup[] = [
  {
    label: "I DAG · TIRSDAG 30. APRIL",
    count: 6,
    rows: [
      {
        id: "b1",
        dayLabel: "I dag",
        dayShort: "30 APR",
        time: "09:00",
        duration: "60 min",
        player: { initials: "PK", name: "Pelle Kvist", sub: "HCP 9.1", color: "#6FB3FF" },
        coach: { name: "Anders K.", tag: "PRIMÆR" },
        location: "Studio 1",
        status: "live",
        type: "Iron-økt",
      },
      {
        id: "b2",
        dayLabel: "I dag",
        dayShort: "30 APR",
        time: "10:30",
        duration: "45 min",
        player: { initials: "EL", name: "Erik Lund", sub: "HCP 18.5", color: "#6FCBA1" },
        coach: { name: "Anders K.", tag: "PRIMÆR" },
        location: "Range bay 4",
        status: "confirmed",
        type: "Driver",
      },
      {
        id: "b3",
        dayLabel: "I dag",
        dayShort: "30 APR",
        time: "12:00",
        duration: "60 min",
        player: { initials: "CR", name: "Camilla Ruud", sub: "HCP 15.3 · Junior", color: "#C896E8" },
        coach: { name: "Maria T.", tag: "JUNIOR" },
        location: "Studio 2",
        status: "confirmed",
        type: "Sving-analyse",
      },
      {
        id: "b4",
        dayLabel: "I dag",
        dayShort: "30 APR",
        time: "14:00",
        duration: "60 min",
        player: { initials: "SH", name: "Sofie Holm", sub: "HCP 4.2 · Performance", color: "#D1F843" },
        coach: { name: "Anders K.", tag: "PRIMÆR" },
        location: "Performance studio",
        status: "confirmed",
        type: "Tempo",
      },
      {
        id: "b5",
        dayLabel: "I dag",
        dayShort: "30 APR",
        time: "15:30",
        duration: "30 min",
        player: { initials: "TS", name: "Tor Solberg", sub: "HCP 17.1", color: "#E8B967" },
        coach: { name: "Erik S.", tag: "SHORT-GAME" },
        location: "Putting green",
        status: "pending",
        type: "Putting",
      },
      {
        id: "b6",
        dayLabel: "I dag",
        dayShort: "30 APR",
        time: "17:00",
        duration: "60 min",
        player: { initials: "JH", name: "Jonas Hansen", sub: "HCP 16.8 · Junior", color: "#6FB3FF" },
        coach: { name: "Maria T.", tag: "JUNIOR" },
        location: "Range bay 2",
        status: "confirmed",
        type: "Full sving",
      },
    ],
  },
  {
    label: "I MORGEN · ONSDAG 1. MAI",
    count: 5,
    rows: [
      {
        id: "b7",
        dayLabel: "Onsdag",
        dayShort: "01 MAI",
        time: "08:00",
        duration: "60 min",
        player: { initials: "AB", name: "Alex Brandt", sub: "HCP 7.4", color: "#D1F843" },
        coach: { name: "Anders K.", tag: "PRIMÆR" },
        location: "Performance studio",
        status: "confirmed",
        type: "Iron",
      },
      {
        id: "b8",
        dayLabel: "Onsdag",
        dayShort: "01 MAI",
        time: "10:00",
        duration: "45 min",
        player: { initials: "KS", name: "Kari Strand", sub: "HCP 14.2", color: "#6FCBA1" },
        coach: { name: "Maria T.", tag: "SVING" },
        location: "Studio 1",
        status: "confirmed",
        type: "Sving",
      },
      {
        id: "b9",
        dayLabel: "Onsdag",
        dayShort: "01 MAI",
        time: "13:00",
        duration: "60 min",
        player: { initials: "EL", name: "Emma Lien", sub: "HCP 16.4 · Inaktiv 16d", color: "#F49283" },
        coach: { name: "Anders K.", tag: "RE-ENG." },
        location: "Studio 2",
        status: "pending",
        type: "Re-onboarding",
      },
      {
        id: "b10",
        dayLabel: "Onsdag",
        dayShort: "01 MAI",
        time: "15:00",
        duration: "30 min",
        player: { initials: "ME", name: "Markus Eide", sub: "HCP 18.7", color: "#6FB3FF" },
        coach: { name: "Erik S.", tag: "SHORT-GAME" },
        location: "Bunker",
        status: "cancelled",
        type: "Bunker",
      },
      {
        id: "b11",
        dayLabel: "Onsdag",
        dayShort: "01 MAI",
        time: "17:30",
        duration: "60 min",
        player: { initials: "PB", name: "Per Bråten", sub: "HCP 11.5", color: "#A5B2AD" },
        coach: { name: "Anders K.", tag: "PRIMÆR" },
        location: "Range bay 3",
        status: "confirmed",
        type: "Driver",
      },
    ],
  },
  {
    label: "TORSDAG 2. MAI",
    count: 4,
    rows: [
      {
        id: "b12",
        dayLabel: "Torsdag",
        dayShort: "02 MAI",
        time: "09:30",
        duration: "60 min",
        player: { initials: "MK", name: "Mona Knutsen", sub: "HCP 19.2", color: "#A5B2AD" },
        coach: { name: "Maria T.", tag: "SVING" },
        location: "Studio 1",
        status: "confirmed",
        type: "Sving",
      },
      {
        id: "b13",
        dayLabel: "Torsdag",
        dayShort: "02 MAI",
        time: "12:00",
        duration: "45 min",
        player: { initials: "AM", name: "Anne Moen", sub: "HCP 22.8 · Ny", color: "#6FCBA1" },
        coach: { name: "Maria T.", tag: "ONBOARDING" },
        location: "Studio 2",
        status: "pending",
        type: "Onboarding",
      },
      {
        id: "b14",
        dayLabel: "Torsdag",
        dayShort: "02 MAI",
        time: "15:00",
        duration: "60 min",
        player: { initials: "RJ", name: "Rune Johansen", sub: "HCP 13.8", color: "#A5B2AD" },
        coach: { name: "Anders K.", tag: "PRIMÆR" },
        location: "Performance studio",
        status: "confirmed",
        type: "Iron",
      },
      {
        id: "b15",
        dayLabel: "Torsdag",
        dayShort: "02 MAI",
        time: "16:30",
        duration: "30 min",
        player: { initials: "CR", name: "Camilla Ruud", sub: "HCP 15.3 · Junior", color: "#C896E8" },
        coach: { name: "Erik S.", tag: "SHORT-GAME" },
        location: "Putting green",
        status: "confirmed",
        type: "Putting",
      },
    ],
  },
];
