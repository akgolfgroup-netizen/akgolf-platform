// /landing/pricing — bedriftsbånd + FAQ
// Kilde: public/design-reference/handoff-2026-04-27/screens/g4-pricing.html

export const BIZ_BAND = {
  eyebrow: "Bedriftsavtaler",
  headingPrefix: "Golf som",
  headingItalic: "velferdsgode",
  headingSuffix: "for laget ditt.",
  description:
    "Vi setter opp månedlige fellesøkter for ansatte, kvartalsvis turnering og personlig oppfølging — alt fakturert samlet til arbeidsgiver. Brukes av 18 selskap i Bærum og Oslo i dag.",
  features: [
    "Månedlig fellesøkt for opptil 12",
    "Kvartals-turnering med caterer",
    "Individuell oppfølging i app",
    "Samlet faktura · 1 stk / mnd",
    "Fra 8 personer · skreddersøm",
    "Hjemmebane Bærum GK",
  ],
  cardLabel: "FRA 6 490 KR / PR. PERSON / KVARTAL",
  cardQuote:
    "Vi har 24 ansatte som spiller — felles økt en gang i måneden er blitt det de gleder seg mest til.",
  cardAuthor: "— SOFIE LARSEN, HR-DIREKTØR · NORDSTRAND DIGITAL",
  primaryCta: "Få tilbud",
  primaryHref: "/kontakt?v=2&plan=bedrift",
  secondaryCta: "Last ned bedriftsark",
  secondaryHref: "/kontakt?v=2&plan=bedrift",
} as const;

export const FAQ_BAND = {
  eyebrow: "Det vi får spørsmål om",
  headingPrefix: "Pris og",
  headingItalic: "vilkår",
  headingSuffix: ".",
  items: [
    {
      q: "Hva inkluderer prisen — og hva ikke?",
      a: "Alle medlemspriser inkluderer Trackman, video-analyse, PlayerHQ-app, og månedlig oppfølging. Bane-greenfee dekkes for banecoaching-økter (4–12 stk per pakke). Reise og overnatting til Spania-camp er separat.",
    },
    {
      q: "Kan jeg si opp underveis?",
      a: "Bindingstiden er 12 mnd, men du kan pause i opptil 3 mnd ved sykdom, jobb-utenlands eller graviditet — ubrukt tid legges på slutten av perioden. Etter 12 mnd løper det måned-for-måned med 1 mnd oppsigelse.",
    },
    {
      q: "Hvordan fungerer årlig betaling?",
      a: "Du betaler hele året på forhånd og får 15% rabatt. Hvis du sier opp før 12 mnd, krediterer vi ubrukte måneder minus 15%-rabatten — du står aldri igjen med tap.",
    },
    {
      q: "Kan jeg bytte coach?",
      a: "Ja — én gang i året kan du bytte coach gratis, gjennom året kan du bytte mot et 250 kr administrasjons-gebyr. Vi vil at du skal ha rett match.",
    },
    {
      q: "Tar dere imot HSP eller bedriftskupong?",
      a: "Vi tar imot Helse-Sør-Øst sin «trening på resept», de fleste forsikringsselskap som dekker fysisk aktivitet, og bedriftskupong via Edenred + Sodexo. Spør oss konkret hvis du er usikker.",
    },
  ],
} as const;
