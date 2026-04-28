// TODO: koble til ekte data
// - services: prisma.service.findMany() (ServiceType + tilknyttede Stripe-priser)
// - bookingsPerMonth: aggregat fra prisma.booking siste 30 dager
// - statuser: ny "active/draft/archived"-status på Service

export type ServiceCategory = "coach" | "test" | "package" | "camp";
export type ServiceStatus = "live" | "draft" | "archived";

export type IconName =
  | "target"
  | "circle-dot"
  | "flag"
  | "video"
  | "brain"
  | "activity"
  | "ruler"
  | "line-chart"
  | "package-2"
  | "package"
  | "package-check"
  | "tent"
  | "users"
  | "users-round"
  | "file-text"
  | "archive";

export interface ServiceRow {
  id: string;
  icon: IconName;
  category: ServiceCategory | "draft" | "archived";
  name: string;
  meta: string;
  duration: string;
  durationUnit?: string;
  price: string;
  priceUnit?: string;
  status: ServiceStatus;
  statusExtra?: string; // e.g. "8/8"
  bookings: string;
}

export interface TabItem {
  key: string;
  label: string;
  count: number;
  active?: boolean;
}

export const SUMMARY_KPIS = [
  { label: "Aktive tjenester", value: "14" },
  { label: "Snittpris", value: "1 480", unit: "kr" },
  { label: "Bookinger denne mnd", value: "87" },
  { label: "Topp-tjeneste", value: "SWING", unit: "·24" },
];

export const TABS: TabItem[] = [
  { key: "all", label: "Alle", count: 19, active: true },
  { key: "coach", label: "Coaching 1:1", count: 6 },
  { key: "test", label: "Test & data", count: 3 },
  { key: "package", label: "Pakker", count: 5 },
  { key: "camp", label: "Camp & gruppe", count: 3 },
  { key: "archived", label: "Arkivert", count: 2 },
];

export const SERVICES: ServiceRow[] = [
  {
    id: "swing-1-1",
    icon: "target",
    category: "coach",
    name: "Swing-økt 1:1",
    meta: "BOGSTAD · SKULLERUD · DRIVING-RANGE",
    duration: "60",
    durationUnit: "min",
    price: "1 200",
    priceUnit: "kr",
    status: "live",
    bookings: "24 booket",
  },
  {
    id: "putt-1-1",
    icon: "circle-dot",
    category: "coach",
    name: "Putting-økt 1:1",
    meta: "SKULLERUD · QUINTIC",
    duration: "45",
    durationUnit: "min",
    price: "900",
    priceUnit: "kr",
    status: "live",
    bookings: "12 booket",
  },
  {
    id: "oncourse",
    icon: "flag",
    category: "coach",
    name: "On-course 1:1",
    meta: "BOGSTAD · BANEN · 9 HULL",
    duration: "2 t",
    price: "2 400",
    priceUnit: "kr",
    status: "live",
    bookings: "8 booket",
  },
  {
    id: "video",
    icon: "video",
    category: "coach",
    name: "Video-analyse",
    meta: "SKULLERUD · 4K + DARTFISH",
    duration: "75",
    durationUnit: "min",
    price: "1 350",
    priceUnit: "kr",
    status: "live",
    bookings: "7 booket",
  },
  {
    id: "mental",
    icon: "brain",
    category: "coach",
    name: "Mental-økt",
    meta: "SKULLERUD · COACHING-ROM",
    duration: "60",
    durationUnit: "min",
    price: "1 100",
    priceUnit: "kr",
    status: "live",
    bookings: "5 booket",
  },
  {
    id: "trackman",
    icon: "activity",
    category: "test",
    name: "Trackman fitting + test",
    meta: "SKULLERUD · TRACKMAN 4",
    duration: "90",
    durationUnit: "min",
    price: "1 950",
    priceUnit: "kr",
    status: "live",
    bookings: "6 booket",
  },
  {
    id: "tpi",
    icon: "ruler",
    category: "test",
    name: "TPI Level 1 screening",
    meta: "SKULLERUD · M/ FYSIO",
    duration: "90",
    durationUnit: "min",
    price: "2 200",
    priceUnit: "kr",
    status: "live",
    bookings: "3 booket",
  },
  {
    id: "quintic-test",
    icon: "line-chart",
    category: "test",
    name: "Quintic putting-test",
    meta: "SKULLERUD · STROKE + ROLL",
    duration: "60",
    durationUnit: "min",
    price: "1 400",
    priceUnit: "kr",
    status: "live",
    bookings: "4 booket",
  },
  {
    id: "season-10",
    icon: "package-2",
    category: "package",
    name: "Sesongpakke 10x",
    meta: "10 SWING-ØKTER · LÅS PRIS",
    duration: "10 økt",
    price: "10 800",
    priceUnit: "kr",
    status: "live",
    bookings: "9 solgt",
  },
  {
    id: "junior-spring",
    icon: "package",
    category: "package",
    name: "Junior-pakke vår",
    meta: "8 ØKTER + KARTLEGGING + PLAN",
    duration: "12 uker",
    price: "8 900",
    priceUnit: "kr",
    status: "live",
    bookings: "14 solgt",
  },
  {
    id: "premium-360",
    icon: "package-check",
    category: "package",
    name: "Premium 360°",
    meta: "UBEGRENSET · 6 MND · ALL DATA",
    duration: "6 mnd",
    price: "28 000",
    priceUnit: "kr",
    status: "live",
    bookings: "3 solgt",
  },
  {
    id: "tour-camp",
    icon: "tent",
    category: "camp",
    name: "Tour Camp Holtsmark",
    meta: "3 DAGER · INTENSIV · MAX 8",
    duration: "3 dgr",
    price: "9 800",
    priceUnit: "kr",
    status: "live",
    statusExtra: "8/8",
    bookings: "FULL JUNI",
  },
  {
    id: "dame-bogstad",
    icon: "users",
    category: "camp",
    name: "Damegruppe Bogstad",
    meta: "UKENTLIG · 16 PLASSER",
    duration: "90 min",
    price: "450",
    priceUnit: "kr / økt",
    status: "live",
    bookings: "14/16 plass",
  },
  {
    id: "junior-mid",
    icon: "users-round",
    category: "camp",
    name: "Junior Mid 12–14 år",
    meta: "12 UKER · KOHORT",
    duration: "12 uker",
    price: "6 200",
    priceUnit: "kr",
    status: "live",
    bookings: "12/12 plass",
  },
  {
    id: "beginner-draft",
    icon: "file-text",
    category: "draft",
    name: "Beginner-pakke 6 uker",
    meta: "UTKAST · PRISING UAVKLART",
    duration: "6 uker",
    price: "—",
    status: "draft",
    bookings: "—",
  },
  {
    id: "old-beginner",
    icon: "archive",
    category: "archived",
    name: "Old: Nybegynner-pakke 2024",
    meta: "ARKIVERT MARS 2025",
    duration: "—",
    price: "5 600",
    priceUnit: "kr",
    status: "archived",
    bookings: "0 booket",
  },
];
