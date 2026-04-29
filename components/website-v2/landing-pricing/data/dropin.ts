// /landing/pricing — drop-in / enkelt-lessons
// Kilde: public/design-reference/handoff-2026-04-27/screens/g4-pricing.html

export type DropInIcon = "Zap" | "Users" | "Flag" | "BarChart3";

export interface DropIn {
  id: string;
  icon: DropInIcon;
  price: string;
  unit: string;
  title: string;
  duration: string;
  description: string;
  cta: string;
  href: string;
}

export const DROPIN_HEAD = {
  eyebrow: "Uten medlemskap",
  headingPrefix: "Drop-in og",
  headingItalic: "enkelt-lessons",
  headingSuffix: ".",
  ctaLabel: "Book direkte i kalenderen",
  ctaHref: "/booking-v2?v=2",
} as const;

export const DROP_INS: DropIn[] = [
  {
    id: "sharpen",
    icon: "Zap",
    price: "450 kr",
    unit: "PR. ØKT",
    title: "Sharpen",
    duration: "20 MIN · KORT FOKUS",
    description:
      "Kjapp tune-up med coach — én ting du jobber med, én tilbakemelding. Trackman valgfritt.",
    cta: "Book Sharpen",
    href: "/booking-v2?serviceTypeId=flex20",
  },
  {
    id: "standard",
    icon: "Zap",
    price: "990 kr",
    unit: "PR. ØKT",
    title: "Standard lesson",
    duration: "50 MIN · 1-TIL-1",
    description:
      "Personlig coaching på range eller i Trackman-bay. Inkluderer videoanalyse.",
    cta: "Book lesson",
    href: "/booking-v2?serviceTypeId=flex50-solo",
  },
  {
    id: "deep-dive",
    icon: "Zap",
    price: "1 690 kr",
    unit: "PR. ØKT",
    title: "Deep-dive",
    duration: "90 MIN · 1-TIL-1",
    description:
      "Lengre format for fullstendig kartlegging eller turneringsforberedelse. Trackman + video.",
    cta: "Book Deep-dive",
    href: "/booking-v2?serviceTypeId=flex90-solo",
  },
  {
    id: "duo",
    icon: "Users",
    price: "1 290 kr",
    unit: "PR. PERSON",
    title: "Duo-time",
    duration: "50 MIN · 2 PERSONER",
    description:
      "Ta med en venn eller partner — 50 min lesson delt mellom to. Lavere pris pr. person.",
    cta: "Book duo",
    href: "/booking-v2?serviceTypeId=flex50-duo",
  },
  {
    id: "bane-9",
    icon: "Flag",
    price: "2 290 kr",
    unit: "PR. ØKT",
    title: "Banecoaching · 9 hull",
    duration: "2 TIMER · PÅ BANE",
    description:
      "Coach følger deg gjennom 9 hull med fokus på slagvalg, banehåndtering og mental rytme. Greenfee inkludert.",
    cta: "Book bane",
    href: "/booking-v2?serviceTypeId=on-course-9",
  },
  {
    id: "trackman",
    icon: "BarChart3",
    price: "390 kr",
    unit: "PR. TIME",
    title: "Trackman drop-in",
    duration: "30/60 MIN · SELVBETJENT",
    description:
      "Bruk Trackman-bay uten coach — full data, video-kamera, eget tempo. 50% rabatt for medlemmer.",
    cta: "Book bay",
    href: "/booking-v2?serviceTypeId=trackman-bay",
  },
];
