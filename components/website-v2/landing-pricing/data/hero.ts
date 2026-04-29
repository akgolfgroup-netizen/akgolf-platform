// /landing/pricing — hero + billing toggle (Brand Guide V2.0)
// Kilde: public/design-reference/handoff-2026-04-27/screens/g4-pricing.html

export const PRICING_HERO = {
  eyebrow: "Priser · 2026",
  headingPrefix: "Klart, samlet,",
  headingItalic: "uten asterisker",
  headingSuffix: ".",
  lede:
    "Alle priser inkluderer mva. Ingen påmeldingsavgift, ingen skjulte gebyrer. Du kan oppgradere når som helst og bytte coach gratis én gang per år.",
  toggleMonthly: "Månedlig",
  toggleYearly: "Årlig",
  yearlySaveLabel: "−15%",
} as const;

export const PRICING_CTA = {
  headingPrefix: "Snakk med oss",
  headingItalic: "før du velger",
  headingSuffix: ".",
  description:
    "30 minutter intro-samtale på telefon eller bane. Vi finner riktig nivå sammen — du står helt fritt til å si nei.",
  primaryCta: "Book intro 30 min",
  primaryHref: "/booking-v2?v=2",
  secondaryCta: "Skriv til oss",
  secondaryHref: "/kontakt?v=2",
} as const;
