// /landing/pricing — tilleggspakker (Spania-camp, Sving-prosjekt, Caddie)
// Kilde: public/design-reference/handoff-2026-04-27/screens/g4-pricing.html

export interface AddOn {
  id: string;
  label: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  imageTone: "default" | "cream" | "warm";
  imageDesc: string;
}

export const ADDONS_HEAD = {
  eyebrow: "Tilleggspakker",
  headingPrefix: "Bygg på",
  headingItalic: "det du allerede har",
  headingSuffix: ".",
} as const;

export const ADDONS: AddOn[] = [
  {
    id: "spania",
    label: "REISE-CAMP · MARS",
    title: "Spania-camp 4 dgr",
    description:
      "Intensiv treningssamling i La Cala (Spania). Rom, mat og 6 timer coaching daglig. Ikke fly.",
    price: "12 900 kr",
    unit: "PR. PERSON",
    imageTone: "default",
    imageDesc: "Spillere på range i Spania, palmer og solskinn",
  },
  {
    id: "video-pakke",
    label: "VIDEO-PAKKE · 4 ØKTER",
    title: "Sving-prosjekt",
    description:
      "4 lessons over 6 uker dedikert til én konkret teknikk-endring. Før/etter-video, daglig hjemmeplan.",
    price: "3 690 kr",
    unit: "FERDIG PRIS",
    imageTone: "cream",
    imageDesc:
      "Coach analyserer slow-motion video på iPad sammen med spiller",
  },
  {
    id: "caddie",
    label: "TURNERING · 1 RUNDE",
    title: "Caddie / coach på dag",
    description:
      "Coach følger som caddie under én turneringsrunde 18 hull — slagvalg, mental coaching, post-runde rapport.",
    price: "3 290 kr",
    unit: "PR. RUNDE",
    imageTone: "warm",
    imageDesc:
      "Spillere på fairway under turnering, scorekort og caddie i bakgrunnen",
  },
];
