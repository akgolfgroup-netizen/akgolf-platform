# AK Golf Website — Status & Arbeidsoppgaver

> Sist oppdatert: 2026-03-17

---

## Nettside-status

| Område | Status |
|---|---|
| Kodebase / teknisk fundament | Ferdig |
| Design / visuell profil | Ferdig — alignet med brand guidelines |
| Brand guidelines alignment | Ferdig |
| Innhold (tekst) | Ferdig (oppdatert CTA-tone, FAQ, personvern) |
| Bilder | Ikke startet — kun plassholdere |
| Booking-system | ✅ Ferdig — Offentlig booking + betaling på /academy/booking |
| Skjema-integrasjon | Ikke funksjonelt (Formspree placeholder) |
| Kontaktinfo | Telefonnumre er placeholder, e-post og lokasjon oppdatert |
| SEO | Metadata, sitemap, robots.txt, OG-tags, Twitter Card, JSON-LD (Organization, FAQPage) |
| Personvern | Komplett GDPR-innhold (ikke bare placeholder) |
| Sportsplan | 15 dokumenter i `content/sportsplan/` (Fase 1–4 ferdig) |
| Lansering | Ikke klar |

---

## Arbeidsoppgaver

### CRITICAL — Må fikses før lansering

#### 1. Koble opp kontaktskjema
- **Fil:** `lib/website-constants.ts` linje 273
- **Problem:** `FORMSPREE_ENDPOINT` er satt til `"https://formspree.io/f/YOUR_FORM_ID"` — skjemaet sender ingenting
- **Oppgave:** Opprett Formspree-konto (eller alternativ: egen API-route, HubSpot, Resend), hent ekte form ID, oppdater konstanten
- **Verifiser:** Send testskjema og bekreft at data mottas
- [ ] Velg form-backend
- [ ] Opprett konto og skjema
- [ ] Oppdater `FORMSPREE_ENDPOINT` med ekte ID
- [ ] Test innsending og bekreft mottak
- [ ] Test feilhåndtering (ugyldig e-post, tom innsending)

#### 2. Erstatt alle bildeplassholdere med ekte foto
- **Komponenter:** `ImagePlaceholder.tsx` brukes i `MethodRow.tsx`, `SubPageHero.tsx`, og flere
- **Status:** ✅ DELVIS FERDIG — Eksisterende bilder fra `/public/images/academy/` er nå koblet til
- **Endringer:**
  - [x] Academy-side: `AK-Golf-Academy-1.jpg` på coaching-seksjon
  - [x] Junior-side: `AK-Golf-Academy-20.jpg` på junior coach-profil
- **Gjenstående:** Profesjonelle bilder av:
  - [ ] Trener(e) i aksjon — dedikerte coaching-situasjoner
  - [ ] Treningsfasiliteter (range, simulator, bane)
  - [ ] Portrettbilder av Anders og Markus (dedikerte headshots)
  - [ ] Stemningsbilder (bane, utstyr, detaljer)

#### 3. Legg inn reell kontaktinformasjon
- **Filer:** `lib/website-constants.ts` linje 28, 36, 340
- **Problem:** Telefonnummer `+47 900 00 000` er placeholder (3 steder: Anders, Markus, footer)
- **Oppdatert:** Adresse endret fra "Oslo" til "GFGK, Vinger" (constants + JSON-LD)
- [x] Legg til faktisk adresse/lokasjon (GFGK, Vinger)
- [x] Oppdater JSON-LD adresse i layout.tsx
- [ ] Oppdater telefonnummer med ekte nummer (3 steder)
- [ ] Verifiser at e-postadressen post@akgolf.no er satt opp og mottar e-post

---

### HIGH — Stor påvirkning på effektivitet

#### 4. ~~Legg til grunnlegger-/trenerprofil~~ DELVIS FERDIG
- [x] Skriv kort bio (bakgrunn, sertifiseringer, erfaring, filosofi) — `FOUNDER`-konstant i `website-constants.ts`
- [ ] Legg til profesjonelt portrettbilde (bruker `ImagePlaceholder` inntil bilde er klart)
- [x] Vis sertifiseringer (PGA, TPI, Mental Coach, Trackman) som badges
- [x] Plasser på forsiden mellom metode- og testimonials-seksjonen
- [ ] Vurder om det bør være en dedikert `/om`-side

#### 5. Gjør testimonials troverdige
- **Fil:** `lib/website-constants.ts` linje 87-112
- **Problem:** Kun fornavn + initial (Thomas R., Maria L., etc.), ingen bilder, ingen verifiserbar identitet. Kan oppfattes som fabrikkerte.
- [ ] Innhent tillatelse til å bruke fullt navn
- [ ] Legg til portrettbilder av kunder
- [ ] Legg til klubbtilhørighet eller annen identifikator
- [ ] Vurder video-testimonials for ekstra troverdighet

#### 6. ~~Konverteringsskjema på hver underside~~ FERDIG
- [x] Legg til `ApplicationForm`-komponent nederst på hver underside
- [x] Forhåndsvelg riktig program i dropdown basert på hvilken side brukeren er på
- [x] Oppdater CTA-seksjonenes href til `#apply` (lokal anchor) i stedet for `/#apply`

#### 7. ~~Lavterskel konverteringstilbud~~ DELVIS FERDIG
- [ ] Vurder lead magnet: gratis swing-analyse, treningsguide PDF
- [x] Implementer enkel e-post-innsamling — `NewsletterSignup`-komponent i footer med Formspree-integrasjon
- [ ] Vurder Calendly-integrasjon for "Book en uforpliktende samtale"

#### 8. Tydeliggjør B2C vs. B2B segmentering
- **Problem:** `/utvikling` blander software-produkter og klubbrådgivning for en helt annen målgruppe enn Academy/Junior
- [ ] Vurder om Utvikling bør splittes i to sider (`/software` + `/klubb`)
- [ ] Alternativt: tydeliggjør segmenteringen visuelt på eksisterende side
- [ ] Vurder om B2B-tjenester bør ha egen CTA (f.eks. "Book et møte" vs. "Søk om plass")

---

### MEDIUM — Merkbar forbedring

#### 9. ~~SEO: Strukturerte data~~ FERDIG
- [x] JSON-LD `Organization` i `app/layout.tsx` (navn, url, logo, contactPoint, adresse)
- [x] JSON-LD `FAQPage` på `/academy` og `/junior` (fra `ACADEMY_FAQ`/`JUNIOR_FAQ`)
- [ ] Legg til JSON-LD for `LocalBusiness` med ekte adresse og åpningstider (krever reell data)
- [x] Open Graph og Twitter Card meta tags på alle sider (root + 3 undersider)

#### 10. SEO: Innholdsstrategi / blogg
- **Problem:** 4 statiske sider gir minimal organisk synlighet
- [ ] Vurder å legge til `/blogg` eller `/ressurser`-seksjon
- [ ] Potensielle artikler: treningsguider, mental trening-tips, junior-utvikling, banetips
- [ ] Vurder CMS-integrasjon (MDX, Contentlayer, eller eksternt CMS)

#### 11. ~~Fjern/optimaliser loading-animasjon~~ FERDIG
- [x] Gjør animasjonen betinget (kun første besøk via sessionStorage)
- Animasjonen vises kun én gang per browser-sesjon (`sessionStorage`-flagg `akgolf_visited`)

#### 12. ~~Intern krysslinking mellom undersider~~ FERDIG
- [x] `RelatedPages`-komponent som viser andre divisjoner (filtrert via `exclude`-prop)
- [x] Lagt til nederst på `/academy`, `/junior` og `/utvikling` etter ApplicationForm
- [ ] Legg til kontekstuell lenking i innholdstekst der relevant

#### 13. ~~Sitemap og robots.txt~~ FERDIG
- [x] Opprett `app/sitemap.ts` (Next.js native sitemap-generering)
- [x] Opprett `app/robots.ts` (Next.js native robots-generering)
- Inkluderer alle 5 ruter, base URL `https://akgolf.no`

#### 14. ~~GDPR / personvern~~ FERDIG
- [x] Opprett personvernerklæring-side (`/personvern`) — komplett GDPR-innhold
- [x] Legg til cookie-samtykke — `CookieConsent`-komponent med localStorage-persistering
- [x] Legg til lenke til personvernerklæring i footer
- [x] Oppdatert med reelt innhold: behandlingsgrunnlag, datatyper, lagringsperioder, rettigheter, Datatilsynet
- Personvernerklæringen bør gjennomgås av juridisk rådgiver før lansering

---

### LOW — Polish

#### 15. ~~Custom 404-side~~ FERDIG
- [x] Opprett `app/not-found.tsx` med design som matcher nettsiden
- [x] Inkluder navigasjon tilbake til forsiden

#### 16. ~~Favicon og app-ikoner~~ FERDIG
- [x] Dynamisk favicon via `app/icon.tsx` — K-mark på Deep Ink-bakgrunn (#0A1929) med gull (#B8975C), 48x48
- [x] Slettet gammel generisk `favicon.ico`
- [x] Apple touch icon via `app/apple-icon.tsx` — 180x180, K-mark, midnight bg, gull

#### 17. ~~Hero-heading språk~~ FERDIG
- [x] Oversatt til norsk: "Hev spillet ditt."

#### 18. ~~Konsolider verdier/metode-seksjoner~~ FERDIG
- [x] Fjernet verdier-seksjonen fra forsiden — metode-seksjonen er sterkere og mer konkret

---

## Tekniske notater

| Teknologi | Versjon |
|---|---|
| Next.js | 16.1.6 (Turbopack) |
| Tailwind CSS | v4 |
| Framer Motion | (brukes for animasjoner) |
| Fonts | Inter (variable, 300-700 via next/font/local) |
| Form backend | Formspree (ikke konfigurert — placeholder endpoint) |
| Hosting | Ikke bestemt |
| Sportsplan | 15 dokumenter i `content/sportsplan/` |
| Git remote | github.com/akgolfgroup-netizen/akgolf-website (privat) |

### Utførte forbedringer
- **Tailwind CSS navnekollisjon** (2026-02-13): Flyttet `--spacing-section` og `--spacing-section-lg` fra `@theme inline` til `@layer base` i `globals.css` for å unngå at Tailwind v4 auto-genererer `w-section`/`w-section-lg` width-utilities som overstyrer egendefinerte komponent-klasser.
- **Batch 2 — Tekniske forbedringer** (2026-02-13):
  1. Betinget loading-animasjon (kun første besøk per sesjon via `sessionStorage`)
  2. `defaultProgram`-prop på `ApplicationForm` for forhåndsvalgt program
  3. `ApplicationForm` lagt til på `/academy`, `/junior` og `/utvikling` med lokale `#apply`-ankere
  4. `sitemap.xml` og `robots.txt` via Next.js MetadataRoute
  5. Custom 404-side med AK-logo og lenke til forsiden
  6. Personvernside (`/personvern`) med placeholder-innhold + footer-lenke
- **Batch 3 — SEO, troverdighet og konvertering** (2026-02-13):
  1. Open Graph + Twitter Card meta tags på root layout og alle undersider
  2. JSON-LD `Organization` i root layout + `FAQPage` på `/academy` og `/junior`
  3. Grunnlegger-profil på forsiden med bio, sertifiseringer og ImagePlaceholder for portrett
  4. `RelatedPages`-komponent for intern krysslinking mellom undersider
  5. Dynamisk favicon (`app/icon.tsx`) med gull AK-logo
  6. Nyhetsbrev-signup (`NewsletterSignup`) i footer med Formspree-integrasjon
- **Brand Guidelines Alignment** (2026-02-14):
  1. Typografi: DM Serif Display for headings (midlertidig), weight 400, letter-spacing -0.02em — ERSTATTET med Inter i mars 2026
  2. Farger: Kald blågrå ink-skala, korrekt gull (#B8975C), navy (#0F2950), deep ink (#0A1929)
  3. Sub-brand aksenter: Academy=navy (#0F2950), Junior=blue (#3B82F6), Software=purple (#8B5CF6), Utvikling=green (#22C55E)
  4. Logo: Kalligrafisk K-mark SVG (erstatter rounded-rect "AK")
  5. Favicon: K-mark på Midnight-bakgrunn, 48x48
  6. Overflater: Kalde toner Snow (#FAFBFC) og Cloud (#F0F2F5)
  7. Fjernet gamle fargetokens: forest, tech, jet, snow, khaki
- **Apple-inspirert redesign** (2026-02-28):
  1. CTA-knapper: Pill-form (border-radius: 9999px), opacity-basert hover/active
  2. Ny `.w-btn-secondary` klasse for tekstlenke-stil sekundærknapper
  3. Fjernet film grain SVG-overlay fra layout
  4. Fjernet glassmorphism og glow-effekter fra CTASection
  5. Fjernet translateY/scale hover-transforms fra kort og knapper
  6. Økt seksjonsspacing (7rem/10rem desktop, 5rem/7rem mobil)
  7. Cookie consent banner (`CookieConsent.tsx`) med localStorage-persistering
  8. Apple touch icon (`app/apple-icon.tsx`, 180x180)
  9. Hero-heading oversatt til norsk: "Hev spillet ditt."
  10. Konsolidert verdier/metode-seksjoner (fjernet overlappende verdier-seksjon)
- **Innholds- og strukturredesign** (2026-03-01):
  1. Fjernet fiktive statistikker (StatsStrip, Results, Marquee) fra forsiden
  2. Lagt til trenerteam med Anders (Head Coach) og Markus (Junior Coach) — ny `TeamSection`-komponent
  3. Forside forenklet til 6 seksjoner med Apple-stil lys/mørk-alternering
  4. CTA-tekster endret fra "Søk om plass" til "Avtal en samtale" / "Avtal et møte"
  5. Kontaktinfo oppdatert til GFGK, Vinger (fra Oslo)
  6. Junior Academy: Lagt til opptakskriterier og retningslinjer (`JUNIOR_INTAKE` i constants)
  7. Junior Academy: Markus vist som dedikert Junior Coach med kontaktinfo
  8. Skjema: "Send søknad" → "Send melding", suksessmelding oppdatert
  9. MethodRow støtter nå `dark`-prop for mørke seksjoner
  10. Fixet ESLint-feil: setState i useEffect erstattet med lazy initializer
- **Sportsplan Fase 1** (2026-03-01):
  1. `gfgk-samarbeid.md` — Samarbeidsavtale GFGK (fasiliteter, økonomi, avtalevilkår)
  2. `iup-kategorier.md` — IUP nivåsystem A–K med kriterier per ferdighetsområde
  3. `testprotokoller.md` — 23 standardiserte tester med normverdier og registreringsskjema
- **Sportsplan Fase 2** (2026-03-01):
  4. `mental-trening.md` — Mental trening-pensum per aldersgruppe (8 emner)
  5. `drillbibliotek.md` — 25+ drills med varianter, periodisert
  6. `personvern-og-samtykke.md` — GDPR-retningslinjer, samtykkeskjemaer
- **Sportsplan Fase 3** (2026-03-01):
  7. `kursmanagement-gfgk.md` — Hull-for-hull banestrategi med beslutningsrammeverk
  8. `konkurransekalender-2026.md` — Intern + ekstern turneringskalender
  9. `masterplan-2026.md` — Uke-for-uke treningsplan (uke 43→42)
  10. Fysisk trening-seksjon (§11) lagt til i junior-academy-sportsplan.md
- **Sportsplan Fase 4** (2026-03-01):
  11. `college-golf-veileder.md` — NCAA/NAIA-prosess for 18–19 år
  12. `evalueringsskjema.md` — Maler for kvartalsvis evaluering og foreldresamtaler
- **Sub-brand farge-synkronisering & byggfeil** (2026-03-11):
  1. Lagt til "utvikling" aksent (green #22C55E) i SubPageHero, ServiceCard, RelatedPages
  2. Utvikling-side aksent endret fra software/purple til utvikling/green
  3. Academy aksent: Navy #0F2950 beholdt som bevisst designvalg (primaerfarge = primaervirksomhet)
  4. TRENINGSPLAN og CREDENTIALS eksporter lagt til i website-constants.ts (byggfeil-fix)
  5. NewsletterSignup: lagt til manglende FORMSPREE_ENDPOINT-import
  6. CTASection: fjernet ugyldig accent-prop fra treningsplan-side
  7. CLAUDE.md: fjernet utdaterte font-migreringsnotater, korrigert sub-brand farger
  8. Font-migrering til Inter var allerede fullfort — kun docs var utdatert
- **Website-fikser** (2026-03-01):
  1. JSON-LD adresse oppdatert fra "Oslo" til "Vinger, Innlandet"
  2. Academy FAQ: "Hvordan søker jeg om plass?" → "Hvordan kommer jeg i gang?"
  3. Personvernside: Fullstendig GDPR-innhold (erstatter placeholder)
  4. Kryssreferanser i alle sportsplan-dokumenter
- **Offentlig bookingsystem for Academy** (2026-03-17):
  1. Ny side: `/academy/booking` — Offentlig booking uten innlogging
  2. Gjenbruker eksisterende `/api/booking/create` som kobler til spillerportalen
  3. Hvis e-post finnes i portalen → kobles til eksisterende bruker
  4. Hvis e-post ikke finnes → opprettes ny bruker med midlertidig passord
  5. Oppdatert `CTASection` med sekundær CTA-støtte
  6. Lagt til booking-lenker på Academy-siden (pris-seksjon og CTA)
  7. Oppdatert confirmation-side for å støtte offentlige bookinger
  8. **Betaling uten innlogging**: Stripe og Vipps støtter nå betaling uten å logge inn
     - `/booking/[id]/pay` — Offentlig Stripe-betalingsside
     - `/api/booking/vipps-initiate` — Støtter offentlige bookinger
     - Ny komponent: `PublicStripePaymentPage.tsx`

---

## Booking System Status (2026-03-17)

### ✅ Operative funksjoner

| Funksjon | Status | Kommentar |
|----------|--------|-----------|
| Offentlig booking-side | ✅ Ferdig | `/academy/booking` - ingen innlogging nødvendig |
| Tjeneste-utvalg | ✅ Ferdig | Henter fra `/api/portal/public/service-types` |
| Kalender/ledige tider | ✅ Ferdig | Henter fra `/api/portal/public/slots` |
| Bruker-kobling | ✅ Ferdig | E-post sjekkes mot eksisterende brukere |
| Auto-opprettelse | ✅ Ferdig | Ny bruker opprettes med midlertidig passord |
| Bekreftelses-side | ✅ Ferdig | Offentlig tilgjengelig confirmation-side |
| E-postbekreftelse | ✅ Ferdig | Velkomst- og booking-bekreftelse sendes |
| Notion-profil | ✅ Ferdig | Opprettes automatisk for nye brukere |

### ✅ Betaling uten innlogging

| Funksjon | Status | Kommentar |
|----------|--------|-----------|
| Stripe-betaling | ✅ Ferdig | Offentlig betalingsside på `/booking/[id]/pay` |
| Vipps-betaling | ✅ Ferdig | Direkte redirect til Vipps etter booking |
| Betaling uten innlogging | ✅ Ferdig | Full støtte for gjeste-betaling |

### Miljøvariabler som kreves

```bash
# Database (påkrevd)
DATABASE_URL=postgresql://...

# Stripe (valgfritt, for betaling)
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Vipps (valgfritt, for betaling)
VIPPS_CLIENT_ID=...
VIPPS_CLIENT_SECRET=...
VIPPS_SUBSCRIPTION_KEY=...
VIPPS_MERCHANT_SERIAL_NUMBER=...

# E-post (valgfritt, for bekreftelser)
RESEND_API_KEY=re_...
CONTACT_EMAIL=post@akgolf.no
```

---

## Filstruktur (nøkkelfiler)

```
app/
  globals.css          — Design tokens (brand-aligned), base styles, komponenter
  layout.tsx           — Root layout, fonts (Inter variable), metadata, JSON-LD
  page.tsx             — Forsiden (6 seksjoner: Hero, Divisjoner, Metode, Team, Testimonials, Kontakt)
  icon.tsx             — Dynamisk favicon (K-mark på midnight)
  not-found.tsx        — Custom 404-side
  sitemap.ts           — Auto-generert sitemap.xml
  robots.ts            — Auto-generert robots.txt
  academy/
    layout.tsx         — Metadata, OG-tags, JSON-LD FAQPage
    page.tsx           — Academy-underside (accent: academy/navy #0F2950)
    booking/
      page.tsx         — Offentlig booking-side (ingen innlogging nødvendig)
  booking/
    [id]/
      pay/
        page.tsx       — Stripe betalingsside (støtter offentlige bookinger)
      confirmation/
        page.tsx       — Booking bekreftelse (støtter offentlige bookinger)
        PublicConfirmationView.tsx — Offentlig bekreftelsesvisning
      PublicStripePaymentPage.tsx — Offentlig Stripe betalingskomponent
  junior/
    layout.tsx         — Metadata, OG-tags, JSON-LD FAQPage
    page.tsx           — Junior-underside (accent: junior/blue #3B82F6)
  utvikling/
    layout.tsx         — Metadata, OG-tags
    page.tsx           — Utvikling/teknologi-underside (accent: utvikling/green #22C55E + software/purple #8B5CF6)
  personvern/
    layout.tsx         — Metadata for personvernside
    page.tsx           — Personvernerklæring
components/website/
  AKLogo.tsx           — Kalligrafisk K-mark SVG (brand guidelines)
  WebsiteNav.tsx       — Navigasjon (K-mark i Midnight)
  WebsiteFooter.tsx    — Footer (K-mark i gull, nyhetsbrev-signup)
  TeamSection.tsx      — Trenerteam (Anders + Markus) med kontaktinfo
  ApplicationForm.tsx  — Kontaktskjema (støtter defaultProgram-prop)
  NewsletterSignup.tsx — Nyhetsbrev e-postinnsamling i footer
  RelatedPages.tsx     — Intern krysslinking mellom undersider
  ServiceCard.tsx      — Divisjonskort med sub-brand aksenter
  SubPageHero.tsx      — Hero for undersider med aksent-dot
  CTASection.tsx       — CTA-seksjon med aksent-border
  PricingCard.tsx      — Priskort (gold for checkmarks)
  BackToTop.tsx          — Scroll til toppen-knapp
  Marquee.tsx            — Rullende tekst-animasjon
  PageTransition.tsx     — Side-overgangsanimasjon
  + 11 andre komponenter
hooks/
  useScrollPosition.ts
  useAnimatedCounter.ts
  useMediaQuery.ts
lib/
  website-constants.ts — Alt tekstinnhold og data (inkl. TEAM, JUNIOR_INTAKE, sub-brand aksenter)
```
