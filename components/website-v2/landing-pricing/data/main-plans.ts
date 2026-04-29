// /landing/pricing — hovedplaner (Foundation, Performance, Tour, Junior)
// Kilde: public/design-reference/handoff-2026-04-27/screens/g4-pricing.html

export type PlanIcon = "Target" | "TrendingUp" | "Users" | "Sprout";

export interface MainPlan {
  id: string;
  icon: PlanIcon;
  name: string;
  title: string;
  tagline: string;
  badge?: string;
  priceMonthly: string;
  priceYearly: string;
  unit: string;
  subMonthly: string;
  subYearly: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

export const MAIN_PLANS: MainPlan[] = [
  {
    id: "foundation",
    icon: "Target",
    name: "FOUNDATION",
    title: "Foundation",
    tagline: "Bygg fundamentet — 6 lessons + app + månedlig fokus.",
    priceMonthly: "2 490",
    priceYearly: "2 117",
    unit: "KR / MND",
    subMonthly: "12 mnd binding · 29 880 kr / år",
    subYearly: "Spart 4 480 kr · 25 400 kr / år",
    features: [
      "6 × 50 min lessons / år",
      "PlayerHQ-app + AI-plan",
      "Månedlig fokus-økt",
      "1 × HCP-test / år",
      "Trackman drop-in 50%",
    ],
    cta: "Velg Foundation",
    href: "/booking-v2?serviceTypeId=performance-markus",
  },
  {
    id: "performance",
    icon: "TrendingUp",
    name: "PERFORMANCE",
    title: "Performance",
    tagline: "Strukturert HCP-utvikling med personlig coach.",
    badge: "MEST VALGT",
    priceMonthly: "4 990",
    priceYearly: "4 242",
    unit: "KR / MND",
    subMonthly: "12 mnd binding · 59 880 kr / år",
    subYearly: "Spart 8 980 kr · 50 900 kr / år",
    features: [
      "24 × 50 min lessons / år",
      "Personlig coach",
      "Månedlig SG-test + plan",
      "Trackman ubegrenset",
      "4 × banecoaching 9 hull",
      "AK-camp vår + høst",
    ],
    cta: "Velg Performance",
    href: "/booking-v2?serviceTypeId=performance-anders",
    featured: true,
  },
  {
    id: "tour",
    icon: "Users",
    name: "TOUR · ELITE",
    title: "Tour",
    tagline: "Ubegrenset coaching, performance-team og turnering.",
    priceMonthly: "9 490",
    priceYearly: "8 067",
    unit: "KR / MND",
    subMonthly: "12 mnd · 113 880 kr / år",
    subYearly: "Spart 17 080 kr · 96 800 kr / år",
    features: [
      "Ubegrenset 1-til-1",
      "Performance-team (4 coacher)",
      "Fysisk + mental coach",
      "12 × banecoaching 18 hull",
      "Reise-camp Spania (4 dgr)",
      "Caddie ved 4 turneringer",
    ],
    cta: "Søk om plass",
    href: "/kontakt?v=2&plan=tour",
  },
  {
    id: "junior",
    icon: "Sprout",
    name: "JUNIOR · 6–17 ÅR",
    title: "Junior",
    tagline: "Tre nivåer: Sprout · Grow · Compete.",
    priceMonthly: "1 290",
    priceYearly: "1 097",
    unit: "KR / MND · FRA",
    subMonthly: "Søsken-rabatt 25% · alle nivåer",
    subYearly: "Søsken-rabatt 25% · spart 2 320 kr",
    features: [
      "Egne juniortrenere",
      "Foreldreapp + chat",
      "Sommerleir 5 dgr / uke",
      "Klubbturnering inkl.",
      "Compete: regional talentstige",
      "Gratis prøvetime hver lørdag",
    ],
    cta: "Se junior-program",
    href: "/junior-academy?v=2",
  },
];
