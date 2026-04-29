// TODO: Erstatt med data fra prisma.booking.findMany() for valgt uke,
// gruppert per dag/coach. Se lib/portal/booking/ for query-helpers.

export type CoachKey = "anders" | "maria" | "erik" | "lisa" | "live" | "gym";

export type CalendarBlock = {
  who: string; // "Pelle K."
  what?: string; // "Iron · Studio 1"
  when?: string; // "09:00 · 60M"
  topPx: number; // offset i cellen
  heightPx: number; // høyde
  coach: CoachKey;
  pending?: boolean;
  highlight?: boolean; // for "ny" booking ramme
};

export type CalendarHourRow = {
  hour: string; // "09:00"
  cells: (CalendarBlock | null)[]; // 7 dager
  showNowLineAt?: number; // px fra topp av cellen (kun én rad har dette)
  nowLineColIndex?: number; // hvilken kolonne (0–6)
};

export type DayHeader = {
  dow: string; // "Man" eller "Ons · I DAG"
  num: string; // "28"
  meta: string; // "3 økter"
  today?: boolean;
};

export const WEEK_HEADERS: DayHeader[] = [
  { dow: "Man", num: "28", meta: "3 økter" },
  { dow: "Tir", num: "29", meta: "2 økter" },
  { dow: "Ons · I DAG", num: "30", meta: "6 økter", today: true },
  { dow: "Tor", num: "01", meta: "4 økter" },
  { dow: "Fre", num: "02", meta: "5 økter" },
  { dow: "Lør", num: "03", meta: "2 økter" },
  { dow: "Søn", num: "04", meta: "1 økt" },
];

export const COACH_LEGEND: { key: CoachKey; name: string; color: string; count: number; muted?: boolean }[] = [
  { key: "anders", name: "Anders K.", color: "#6FB3FF", count: 9 },
  { key: "maria", name: "Maria T.", color: "#C896E8", count: 5 },
  { key: "erik", name: "Erik S.", color: "#E8B967", count: 7 },
  { key: "lisa", name: "Lisa M.", color: "#6FCBA1", count: 2, muted: true },
];

export const CALENDAR_HOURS: CalendarHourRow[] = [
  {
    hour: "09:00",
    cells: [
      { who: "Pelle K.", what: "Iron · Studio 1", when: "09:00 · 60M", topPx: 0, heightPx: 60, coach: "anders" },
      { who: "Mona K.", what: "Sving · S1", when: "09:30 · 60M", topPx: 30, heightPx: 45, coach: "maria" },
      { who: "● Pelle K. (LIVE)", what: "Iron · Studio 1", when: "09:00 · 60M", topPx: 0, heightPx: 60, coach: "live" },
      null,
      { who: "Pelle K.", when: "09:00 · Putting", topPx: 0, heightPx: 30, coach: "erik" },
      null,
      null,
    ],
  },
  {
    hour: "10:00",
    cells: [
      { who: "Erik L.", what: "Driver · Range 4", when: "10:30 · 45M", topPx: 30, heightPx: 45, coach: "anders" },
      null,
      { who: "Erik L.", what: "Driver · Range 4", when: "10:30 · 45M", topPx: 30, heightPx: 45, coach: "anders" },
      { who: "Kari S.", what: "Sving · S1", when: "10:00 · 45M", topPx: 0, heightPx: 45, coach: "maria" },
      { who: "Tor S.", when: "10:30 · Chip", topPx: 30, heightPx: 30, coach: "erik" },
      null,
      null,
    ],
  },
  {
    hour: "11:00",
    cells: [
      null,
      null,
      null,
      null,
      { who: "Markus E.", when: "11:30 · Bunker", topPx: 30, heightPx: 30, coach: "erik" },
      { who: "Junior-clinic", what: "5 spillere · Range", when: "11:00 · 90M", topPx: 0, heightPx: 90, coach: "lisa" },
      null,
    ],
  },
  {
    hour: "12:00",
    cells: [
      { who: "Camilla R.", what: "Sving · pending", when: "12:00 · 60M", topPx: 0, heightPx: 60, coach: "maria", pending: true },
      { who: "Lunsj", when: "12:00–13:00", topPx: 0, heightPx: 60, coach: "gym" },
      { who: "Camilla R.", what: "Sving · S2", when: "12:00 · 60M", topPx: 0, heightPx: 60, coach: "maria" },
      { who: "Anne M.", what: "Onboarding", when: "12:00 · 45M", topPx: 0, heightPx: 45, coach: "maria", pending: true },
      null,
      null,
      null,
    ],
  },
  {
    hour: "13:00",
    cells: [
      null,
      { who: "Sofie H.", what: "Tempo · Perf studio", when: "13:00 · 60M", topPx: 0, heightPx: 45, coach: "anders" },
      null,
      { who: "Emma L.", what: "Re-onboarding", when: "13:00 · 60M", topPx: 0, heightPx: 60, coach: "anders", pending: true },
      { who: "Camilla R.", when: "13:30 · Putting", topPx: 30, heightPx: 30, coach: "erik" },
      null,
      null,
    ],
  },
  {
    hour: "14:00",
    cells: [
      null,
      null,
      { who: "Sofie H.", what: "Tempo · Perf studio", when: "14:00 · 60M", topPx: 0, heightPx: 60, coach: "anders" },
      null,
      { who: "Sofie H. (NY)", when: "14:00 · Bunker", topPx: 0, heightPx: 30, coach: "erik", highlight: true },
      null,
      null,
    ],
  },
  {
    hour: "15:00",
    cells: [
      null,
      null,
      { who: "Tor S.", when: "15:30 · Putting", topPx: 30, heightPx: 30, coach: "erik" },
      { who: "Rune J.", what: "Iron · Perf studio", when: "15:00 · 60M", topPx: 0, heightPx: 60, coach: "anders" },
      { who: "Anne M.", when: "15:30 · Chip", topPx: 30, heightPx: 30, coach: "erik" },
      null,
      null,
    ],
  },
  {
    hour: "16:00",
    cells: [
      { who: "Alex B.", what: "Iron · Perf studio", when: "16:00 · 60M", topPx: 0, heightPx: 60, coach: "anders" },
      null,
      null,
      { who: "Camilla R.", when: "16:30 · Putting", topPx: 30, heightPx: 30, coach: "erik" },
      null,
      { who: "Pro-am-trening", what: "Range · 4 spillere", when: "16:00 · 60M", topPx: 0, heightPx: 60, coach: "lisa" },
      null,
    ],
  },
  {
    hour: "17:00",
    cells: [
      null,
      null,
      { who: "Jonas H.", what: "Full sving · Range 2", when: "17:00 · 60M", topPx: 0, heightPx: 60, coach: "maria" },
      { who: "Per B.", what: "Driver · Range 3", when: "17:30 · 60M", topPx: 30, heightPx: 60, coach: "anders" },
      { who: "Henrik V.", when: "17:00 · Putting", topPx: 0, heightPx: 30, coach: "erik" },
      null,
      { who: "Klubbmesterskap", what: "Sofie H. starter", when: "søn 09:00 →", topPx: 0, heightPx: 90, coach: "anders" },
    ],
    showNowLineAt: 24,
    nowLineColIndex: 2,
  },
  {
    hour: "18:00",
    cells: [null, null, null, null, null, null, null],
  },
];

export const FOOTER_STATS = [
  { label: "Total økter", value: "23", color: "#fff" },
  { label: "Utnyttelse", value: "82%", color: "#D1F843" },
  { label: "Pending", value: "3", color: "#E8B967" },
  { label: "Ledige timer", value: "14", color: "#fff" },
  { label: "Inntekt uke", value: "14.290", suffix: "kr", color: "#6FCBA1" },
];
