# Apple-Inspired Homepage Redesign — AK Golf Academy

**Dato:** 2026-03-27
**Status:** Implementering startet

## Designfilosofi

Apple.com-prinsipper tilpasset golf coaching:
- **Massiv whitespace** — la innholdet puste
- **Stor, dristig typografi** — overskrifter som stopper scrolling
- **Minimal UI-krom** — ingen unødvendige borders, bokser, skygger
- **Full-bleed bilder** — kanter som forsvinner
- **Progressiv avsløring** — vis info gradvis ved scroll
- **Én CTA per seksjon** — aldri overveldende
- **Pris-psykologi** — vis enkeltsesjoner først (dyrt), deretter abonnement (kupp)

## Sidestruktur (scroll-rekkefølge)

### 1. Hero — Full-screen, single statement
- Full viewport høyde, hero-main.jpg som bakgrunn
- Én kraftig headline: "Bli bedre. Raskere."
- Én subline: kort verdiforslag
- Én CTA-knapp: "Se coaching-pakker"
- Ingen meny-støy — clean navbar med logo + 3 lenker + CTA

### 2. Credentials Strip — Trust i én linje
- Horisontalt: PGA Professional · Trackman Certified · TPI Certified · 10+ års erfaring
- Subtil, liten tekst — ikke skrikende

### 3. Slik fungerer det — 3 steg
- Apple "How it works"-stil med store ikoner/tall
- 01: Book selv i appen → 02: 20 min med fokus → 03: Tren mellom øktene
- Enorm whitespace rundt hvert steg

### 4. Foundation Test — Inngangspunktet
- Full-bredde seksjon med bilde (instruksjon.jpg)
- "Din første time: 995 kr" — stort, tydelig
- 50 min kartlegging, refunderbar ved abonnement
- Én CTA: "Book Foundation Test"

### 5. Pris-sammenligning — Flex vs Abonnement (KJERNESTRATEGI)
- To kolonner side-by-side
- **Venstre (Flex):** "Fra 1 500 kr per time" — liste med begrensninger (✗)
- **Høyre (Abonnement):** "Fra 400 kr per økt" — alle fordeler (✓), sparebadge
- Visuelt: abonnement-kolonnen er større, gold-accent, "Mest populær"
- Beregning synlig: "4 økter × 500 kr = 2 000 kr/mnd → spar 67% vs enkelttimer"

### 6. Coaching-pakker — Performance & Performance Pro
- To store kort, Performance Pro fremhevet
- **Performance:** 1 600 kr/mnd, 2×20 min, 7 dager booking
- **Performance Pro:** 2 000 kr/mnd, 4×20 min, 14 dager booking, prioritert
- Pris per økt synlig: "800 kr/økt" vs "500 kr/økt"
- CTA: "Kom i gang" → booking

### 7. Spillerportalen — Hva du får som medlem
- Bento-grid med 6 features (Treningsplan, Øvelsesbank, Dagbok, Statistikk, AI-analyse, TrackMan)
- Hvert kort har ikon + kort beskrivelse
- DeviceMockup med portal-screenshot (valgfritt)

### 8. Anders Kristiansen — Coach-profilen
- Full-bredde seksjon, bilde til venstre, tekst til høyre
- Profilbilde: `/images/team/anders-kristiansen.jpg` (konsistent overalt)
- Kort bio, sertifiseringer, erfaring
- Personlig og troverdig tone

### 9. Resultater — Testimonials
- 2-3 sitater med navn, handicap-endring
- Minimalt design — stor quote, liten attribusjon

### 10. Siste CTA — "Klar for å starte?"
- Full-bredde, mørk bakgrunn
- Stort spørsmål + CTA-knapp
- ApplicationForm tilgjengelig

## Pris-psykologisk strategi

Rekkefølge er kritisk:
1. Vis Foundation Test (995 kr) — lav terskel
2. Vis Flex-priser (1 500 kr/time) — dyrt, men fair
3. Vis abonnement (500 kr/økt) — plutselig billig i sammenligning
4. Vis besparelsen eksplisitt: "Spar 67% med abonnement"

## Bilder

| Brukssted | Fil |
|-----------|-----|
| Hero bakgrunn | `/images/hero/hero-main.jpg` |
| Foundation Test | `/images/sections/instruksjon.jpg` |
| Banecoaching | `/images/sections/banecoaching.jpg` |
| Anders profil | `/images/team/anders-kristiansen.jpg` |
| Diverse akademi | `/images/academy/AK-Golf-Academy-*.jpg` |

## Responsivt design

- **iPhone:** Single-column, store touch targets (min 44px), bottom CTA alltid synlig
- **Desktop:** Max-width 1120px, 2-3 kolonner for kort/grid
- **Tablet:** Tilpasning mellom mobil og desktop

## Font & Farger

Implementeres sist som planlagt. Nåværende Manrope + brand system v3.2 brukes.

## Filer som endres

| Fil | Endring |
|-----|---------|
| `app/page.tsx` | Komplett omskriving av forsiden |
| `lib/website-constants.ts` | Oppdatert innhold og struktur |
| `components/website/TeamSection.tsx` | Oppdatert med riktig Anders-bilde |
| `components/website/*` | Nye/oppdaterte seksjonskomponenter |
| `app/globals.css` | Eventuelle nye utility-klasser |
