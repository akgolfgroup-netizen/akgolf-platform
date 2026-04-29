/**
 * Booking V2 — all bruker-vendt tekst på norsk bokmål.
 * Følger .claude/rules/sprak.md.
 * Kilde-mockup: public/design-reference/booking-v2/booking-v2.html
 */

export const BRAND = {
  name: "AK Golf",
  subline: "Booking · v2",
  org: "AK Golf Group · Org. 925 110 887",
  // VERIFY org-nummer
};

export const STEPS = [
  { num: "01", label: "Lokasjon", path: "/booking-v2/lokasjon" },
  { num: "02", label: "Trener", path: "/booking-v2/velg-trener" },
  { num: "03", label: "Tjeneste", path: "/booking-v2/velg-tjeneste" },
  { num: "04", label: "Tid", path: "/booking-v2/tid" },
  { num: "05", label: "Detaljer", path: "/booking-v2/dine-detaljer" },
  { num: "06", label: "Betaling", path: "/booking-v2/betal" },
  { num: "07", label: "Bekreftelse", path: "/booking-v2/bekreftelse" },
] as const;

export const ENTRY = {
  eyebrow: "Booking",
  hero: "Tren golf med",
  heroEm: "system",
  heroDot: ".",
  lede: "Velg det som passer deg — fast abonnement, enkeltsesjon, eller en runde på banen. Hele bookingen tar omtrent to minutter.",
  ctaPrimary: "Se alle tjenester",
  ctaSecondary: "Velg trener først",
  quickHeading: "Vanligste valg",
  quote: "Etter et år med Anders gikk jeg fra 14 til 6 i HCP. Forskjellen var at jeg endelig visste hva jeg skulle trene på.",
  // VERIFY: bytt til ekte sitat fra elev
  quoteCredit: "Spiller, AK Golf Academy",
};

export type ServiceCategory = "abonnement" | "flex" | "bane" | "kurs";

export interface BookingService {
  id: string;
  name: string;
  nameEm?: string;
  description: string;
  meta: string[];
  price: string;
  priceUnit?: string;
  category: ServiceCategory;
  trainer: "anders" | "markus" | "begge";
  // Booking window from lib/portal/booking/subscription-quota.ts
  maxAdvanceDays: number;
}

export const SERVICES: BookingService[] = [
  {
    id: "performance",
    name: "Performance",
    nameEm: "1:1",
    description: "Faste økter to ganger i måneden. TrackMan-analyse, video og personlig plan i appen mellom øktene.",
    meta: ["2 × 20 min / mnd", "Anders", "Løpende"],
    price: "1 400 kr",
    priceUnit: "/mnd",
    category: "abonnement",
    trainer: "anders",
    maxAdvanceDays: 28,
  },
  {
    id: "performance-pro",
    name: "Performance",
    nameEm: "Pro",
    description: "Dobbel frekvens for raskere utvikling. Samme metodikk — bare med tettere oppfølging.",
    meta: ["4 × 20 min / mnd", "Anders", "Løpende"],
    price: "2 500 kr",
    priceUnit: "/mnd",
    category: "abonnement",
    trainer: "anders",
    maxAdvanceDays: 28,
  },
  {
    id: "express",
    name: "Express",
    description: "Treningsabonnement med Markus — ideelt for de som vil ha grunnprinsippene på plass.",
    meta: ["2 × 20 min / mnd", "Markus", "3 mnd"],
    price: "800 kr",
    priceUnit: "/mnd",
    category: "abonnement",
    trainer: "markus",
    maxAdvanceDays: 28,
  },
  {
    id: "express-pro",
    name: "Express",
    nameEm: "Pro",
    description: "Tettere progresjon med Markus, samme tilnærming som Express.",
    meta: ["4 × 20 min / mnd", "Markus", "3 mnd"],
    price: "1 400 kr",
    priceUnit: "/mnd",
    category: "abonnement",
    trainer: "markus",
    maxAdvanceDays: 28,
  },
  {
    id: "flex-20",
    name: "Flex 20",
    description: "En kort fokusert økt på ett konkret tema — for eksempel putt, chip eller wedge.",
    meta: ["20 min", "Enkeltsesjon", "Ingen binding"],
    price: "450 kr",
    category: "flex",
    trainer: "begge",
    maxAdvanceDays: 21,
  },
  {
    id: "flex-50",
    name: "Flex 50",
    description: "Full enkelttime med video og analyse. Du får en skriftlig plan i etterkant.",
    meta: ["50 min", "Enkeltsesjon", "TrackMan"],
    price: "800 – 1 500 kr",
    priceUnit: "etter trener",
    category: "flex",
    trainer: "begge",
    maxAdvanceDays: 21,
  },
  {
    id: "banecoaching",
    name: "Banecoaching",
    nameEm: "9 hull",
    description: "Vi spiller, jeg coacher. Beslutninger, klubbvalg og miss-management — alt det rangen ikke kan lære deg.",
    meta: ["~3 t", "På bane", "Strategi"],
    price: "3 000 kr",
    priceUnit: "/spiller",
    category: "bane",
    trainer: "anders",
    maxAdvanceDays: 28,
  },
  {
    id: "first-tee",
    name: "First Tee",
    description: "Veien til golf for nye spillere — teori, regler og første sving på range.",
    meta: ["VTG-kurs", "Markus", "Begynner"],
    price: "1 295 kr",
    category: "kurs",
    trainer: "markus",
    maxAdvanceDays: 21,
  },
];

export const TRAINERS = [
  {
    id: "anders" as const,
    name: "Anders Kristiansen",
    role: "Hovedcoach · AK Golf Academy",
    badge: "Hovedcoach",
    bio: "15 års erfaring med spillerutvikling fra nybegynner til PGA Tour. Utvikler av coaching-systemet og PlayersHQ. Jobber med spillere som vil ha individuell teknisk veiledning.",
    image: "/images/team/anders-kristiansen.jpg",
    fallbackBg: "#1F3D2C",
    stats: [
      { v: "15 år", l: "Erfaring" },
      { v: "2×20", l: "Min per økt" },
      { v: "PlayersHQ", l: "Egen app" },
    ],
  },
  {
    id: "markus" as const,
    name: "Markus R. Pedersen",
    role: "Coach · AK Golf Academy",
    badge: "Coach · junior & nye spillere",
    bio: "College-golf fra USA. Ansvarlig for VTG-kurs, gruppetreninger og juniorer. Sikrer at du lærer riktige grunnprinsipper fra starten.",
    image: "/images/team/markus-pedersen.jpg",
    // VERIFY: filen finnes ikke ennå — fallback til solid grønn
    fallbackBg: "#2A5340",
    stats: [
      { v: "VTG", l: "First Tee-kurs" },
      { v: "Junior", l: "Spesialist" },
      { v: "Gruppe", l: "Express-pakker" },
    ],
  },
];

export const POLICY = {
  // Matcher lib/portal/booking/refund-policy.ts (Standardvalg #1: 24t/8-24t/0)
  rules: [
    { when: "> 24 t", title: "Gratis", text: "Full refusjon, ingen spørsmål. Du gjør det selv på Min side.", className: "free" },
    { when: "8 – 24 t", title: "50 % gebyr", text: "Med mindre noen tar slottet ditt fra ventelisten — da refunderer vi alt automatisk.", className: "" },
    { when: "< 8 t", title: "Full betaling", text: "Vi kan ikke fylle slottet på så kort varsel. Kontakt oss om noe ekstraordinært skjer.", className: "full" },
    { when: "Sykdom", title: "Vi er rause", text: "Send oss en melding så finner vi en ny tid uten kostnad. Bare vær ærlig.", className: "" },
  ],
};
