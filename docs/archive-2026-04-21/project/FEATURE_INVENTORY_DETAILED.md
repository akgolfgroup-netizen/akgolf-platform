# AK Golf Platform — Komplett Feature Inventory (Utgave med dybdebeskrivelser)

> Sist oppdatert: 2026-04-15  
> Forfatter: Kimi Code CLI  
> Omfang: Alle brukervendte funksjoner, dataflyter, interaksjonsmønstre og integrasjoner i `akgolf-platform`.

---

## Introduksjon til dokumentet

Dette dokumentet er en **utførlig bruks- og funksjonsbeskrivelse** av hele AK Golf Platform. Hver seksjon forklarer:
- **Hva funksjonen er**
- **Hvordan den fungerer teknisk og visuelt**
- **Hvilke data den bruker og produserer**
- **Hvordan brukeren interagerer med den**
- **Eventuelle begrensninger, tilgangsregler og integrasjoner**

Plattformen er delt inn i fire hoveddeler:
1. **Landingside** — markedsføring og konvertering
2. **Booking-systemet** — timebestilling, betaling og administrasjon
3. **Spillerportal** — der spilleren lever, trener, analyserer og kommuniserer
4. **Mission Board / Admin** — der instruktører og administratorer styrer virksomheten

---

# DEL 1: LANDINGSIDE (Marketing / Publikasjonssider)

## 1.1 Forside v1 (`/`)

### Hva er det?
Dette er hovedinngangen til AK Golf Academy for nye besøkende. Siden er designet som en klassisk landingsside med én primær målsetning: få besøkende til å booke en coaching-time eller utforske treningsabonnementet.

### Hvordan fungerer det?
Siden lastes med en **fullskjerm Hero** med et bakgrunnsbilde av golfbane. Navigasjonsbaren (`WebsiteNav`) er transparent øverst, men blir hvit når brukeren scroller nedover. Siden er bygget opp sekvensielt:

1. **Hero-seksjon**: Stor tittel "Tren golf med system." med undertekst om treningsabonnement. To knapper: "Book coaching" (primær, grønn/lime) og "Se treningsabonnement" (sekundær).
2. **Slik fungerer det**: 5 nummererte steg som forklarer flyten: book i appen → tren med trener → tren på egenhånd → følg utviklingen → neste sesjon bygger videre.
3. **Portal-preview**: En iPhone-mockup som viser 4 faner: Dashboard, Treningsplan, Statistikk, Coaching-historikk. Brukeren kan klikke på fanene for å se ulike skjermbilder (kun visuell demo, ingen ekte data).
4. **Målgruppeprofiler**: 3 kort som adresserer ulike brukertyper: "Du er ny i golf", "Du spiller, men trener uten plan", "Du vil ha raskere resultater".
5. **Team-seksjon**: Anders Kristiansen og Markus R. Pedersen med bilder og korte biografier.
6. **CTA-seksjon**: En svart boks med teksten "Velg coach og start i dag" og en "Book coaching"-knapp.
7. **FAQ**: Accordion med ofte stilte spørsmål om priser, binding, hvordan det fungerer, osv.
8. **Footer**: `WebsiteFooter` (svart) med lenker til tjenester, selskap, kontakt og sosiale medier.

### Data
- **Ingen personlig data** kreves for å besøke siden.
- Trenere og tjenester hentes fra `ServiceType`- og `Instructor`-tabellene i databasen.
- FAQ-innhold er hardkodet i komponenten.

### Brukerflyt
1. Brukeren kommer inn på `/` (fra Google, sosiale medier, direkte).
2. Scroller gjennom siden for å lære om konseptet.
3. Klikker enten "Book coaching" (går til `/booking`) eller "Se treningsabonnement" (går til `/academy`).
4. Alternativt klikker "Ta kontakt først" (går til `/landing/contact`).

### Tekniske detaljer
- Bygget i `app/page.tsx`.
- Bruker `framer-motion` for scroll-animasjoner.
- `WebsiteNav` har en `useScroll`-hook som endrer bakgrunn fra transparent til hvit ved scroll.

---

## 1.2 Forside v2 (`/landing`)

### Hva er det?
En alternativ, nyere landingsside med litt annerledes visuell profil. Denne siden bruker en egen, inline navigasjon (`Navbar variant="light"`) og er mer tekst-tung enn v1.

### Hvordan fungerer det?
1. **Navigasjon**: AK Golf Academy-logo, lenker (Hjem, Book nå, Om oss, Kontakt), "Logg inn"-knapp og "Spillerportal"-knapp.
2. **Hero**: Stor tittel "Bli en bedre golfspiller — med system". Et statistikk-kort viser "200+ spillere coachet". Hero-bilde av Anders Kristiansen.
3. **Treningsabonnement**: 3 steg forklart med ikoner: Book selv → 20 minutter med fokus → Tren mellom sesjonene.
4. **Om oss**: Tekst om Anders Kristiansen, 2 lokasjonskort (GFGK og Miklagard GK) med adresser.
5. **CTA-seksjon**: Svart boks med "Klar for å ta golfen til neste nivå?" og knapper for "Book nå" / "Kontakt oss".
6. **Footer**: `Footer variant="light"` med copyright, personvern/vilkår/kontakt og sosiale medier.

### Data
- Samme som v1: ingen personlig data.
- Statistikk-kortet "200+ spillere coachet" er hardkodet.

### Brukerflyt
1. Brukeren lander på `/landing`.
2. Klikker "Book nå" → `/booking`.
3. Klikker "Spillerportal" → `/spillerportal`.
4. Klikker "Logg inn" → `/portal/login`.

### Tekniske detaljer
- Bygget i `app/landing/page.tsx`.
- Inline navigasjon er definert direkte i filen, ikke gjenbrukt `WebsiteNav`.

---

## 1.3 Om oss (`/landing/about`)

### Hva er det?
En merkevareside som bygger tillit ved å fortelle historien bak AK Golf Academy, introdusere teamet og forklare den systematiske metoden.

### Hvordan fungerer det?
1. **Navbar + Footer** (begge `variant="light"`).
2. **Hero** (svart bakgrunn): "Systematisk golf coaching golfcoaching".
3. **Historien**: Tekst om Anders Kristiansen. En sjekkliste med 4 punkter: korte sesjoner, TrackMan, digital treningsplan, systematisk oppfølging. Et bilde med en "15+ år"-badge.
4. **Teamet**: Anders Kristiansen (med bilde) og Markus R. Pedersen (med initialer).
5. **Lokasjoner**: 2 kort med adresser og feature-tags (Driving range, 18 hull, TrackMan 4i, etc.).
6. **Metoden** (svart bakgrunn): 4 punkter: Tekniske mål → Treningsplan → Progresjonslogging → Neste sesjon.
7. **CTA-seksjon**: "Klar for å bli en del av AK Golf Academy?"

### Data
- Alt innhold er statisk/ hardkodet.
- Ingen databasekall.

### Brukerflyt
- Brukeren klikker "Se pakker og priser" → `/landing/pricing`.
- Eller "Kontakt oss" → `/landing/contact`.

---

## 1.4 Kontakt (`/landing/contact`)

### Hva er det?
Kontaktsiden hvor potensielle kunder kan finne kontaktinformasjon og sende henvendelser.

### Hvordan fungerer det?
1. **Hero** (svart): "Ta kontakt".
2. **Kontaktinfo-kort**: 3 kort med e-postadresser:
   - E-post: `post@akgolf.no`
   - Support: `support@akgolf.no`
   - Booking: `bestilling@akgolf.no`
   Alle er `mailto:`-lenker.
3. **Lokasjoner**: 2 bilder med adresser og feature-tags.
4. **Kontaktskjema**: Felter for Navn, E-post, Telefon, Emne (dropdown), Melding.
   - **Viktig merknade**: I den synlige UI-koden sender skjemaet **ikke** data til backend. `handleSubmit` setter kun `submitted=true` og viser en suksessmelding: "Melding sendt! Takk for din henvendelse."
   - Det finnes en `FORMSPREE_ENDPOINT` i constants, men den brukes ikke her.
5. **Quick CTA**: Svart boks med "Book nå"-knapp.

### Data
- Skjemaet bruker kun **lokal React-state** (`useState`).
- Ingen data lagres eller sendes til server i den nåværende implementasjonen.

### Brukerflyt
1. Brukeren fyller ut skjemaet.
2. Klikker "Send melding".
3. Ser suksessmelding.
4. Kan klikke "Send ny melding" for å tilbakestille.

---

## 1.5 Priser (`/landing/pricing`)

### Hva er det?
En prisoversikt som presenterer alle tilgjengelige pakker og tjenester med tydelige priser.

### Hvordan fungerer det?
1. **Abonnement**:
   - Performance Pro: 2 000 kr/mnd (merket "Mest populær")
   - Performance: 1 600 kr/mnd
2. **Onboarding**:
   - Start: 3 000 kr engangs
3. **Drop-in**:
   - Flex 50: 1 500 kr solo / 850 kr duo
   - Flex 90: 2 500 kr solo / 1 400 kr duo
4. **Banecoaching**:
   - Banecoaching 9 hull: 3 000 kr/spiller
   - Banecoaching Par 3: 500 kr/spiller
5. **FAQ**: "Drop-in vs Abonnement"

### Data
- Alle priser er hardkodede i komponenten.
- Ingen dynamisk prising fra database.

### Brukerflyt
- Hver knapp på siden lenker til `/booking`.
- Brukeren velger en pakke, men selve pakkevalget overføres ikke som parameter til booking-siden (alle knapper går til samme URL).

---

## 1.6 Academy landing (`/academy`)

### Hva er det?
Den primære konverteringssiden for AK Golf Academy. Mer detaljert enn forsiden, med fokus på å forklare treningsabonnement-konseptet og vise frem spillerportalen.

### Hvordan fungerer det?
1. **AcademyHeroV2**: Mørk hero med "Coaching som gir resultater."
2. **ConceptSection**: Forklarer treningsabonnement-konseptet med ikoner og korte tekster.
3. **HowItWorksSection**: 4 steg: Book i appen → Tren med trener → Tren på egenhånd → Følg utviklingen.
4. **PortalPreviewSection**: 6 feature-kort (Booking, Treningsplan, Statistikk, Strokes Gained, Coaching-historikk, Progresjon) + et lanseringsbanner: "Spillerportalen lanseres mai 2026".
5. **AcademyPricesV2**: Priskort for abonnement (Anders/Markus Performance & Performance Pro) + Flex-sesjon.
   - **Merk**: Abonnementsknappene er deaktivert med et "Lanseres mai 2026"-badge. Kun "Book Flex-sesjon" er aktiv.
6. **ComparisonSection**: Tabell som sammenligner Abonnement vs Flex på punkter som pris, binding, treningsplan, portal-tilgang, etc.
7. **AcademyCtaV2**: "Klar for neste nivå?"
8. **FAQSection**: Academy-spesifikk FAQ.
9. **JSON-LD**: BreadcrumbList + FAQPage structured data for SEO.

### Data
- Priser og tekster er hardkodede.
- Ingen personlig data kreves.

### Brukerflyt
- "Book coaching" / "Book Flex-sesjon" → `/booking`.
- "Se priser" → scroller til `#priser` (anchor link).

---

## 1.7 Junior Academy (`/junior-academy`)

### Hva er det?
En dedikert side for juniorprogrammet, rettet mot foreldre og unge golfspillere.

### Hvordan fungerer det?
1. **Hero**: Mørk, fullskjerm-ish med "Morgendagens golfspillere." og bakgrunnsbilde.
2. **AK Golf Junior Academy program**: Pris 3 500 kr/mnd, "Maks 8 spillere", 3 bilder fra trening.
3. **GFGK Junior treningsgrupper**: 3 aldersgrupper:
   - Golflek (6–9 år)
   - Utviklingsgruppe (10–14 år)
   - Prestasjonsgruppe (15–18 år)
   Hver gruppe viser treningsdager, tider og maks antall.
4. **WANG Toppidrett**: Samarbeidsseksjon med WANG-logo og ekstern lenke.
5. **CTA**: "Vil barnet ditt prøve golf?"
6. **JSON-LD**: BreadcrumbList + FAQPage.

### Data
- Alt innhold er statisk.
- Treningsgruppe-tider er hardkodede.

### Brukerflyt
- "Søk opptak" → scroller til `#apply` (anker).
- "Se treningsgrupper" → scroller til `#age-groups`.
- "Les mer om WANG" → åpner `https://wang.no/toppidrett/fredrikstad` i ny fane.
- "Kontakt GFGK Junior" → åpner `https://gfrg.no/junior` i ny fane.

---

## 1.8 Utvikling & Teknologi (`/utvikling`)

### Hva er det?
En B2B-side rettet mot golfklubber som trenger hjelp med sportslig plan, spillerportal eller QR-skilt-konsept.

### Hvordan fungerer det?
1. **Hero**: "Vi bygger bedre golfklubber."
2. **Tjenester bento grid**: 3 expandable cards:
   - Komplett sportslig plan (large, light)
   - Spillerportalen (small, light)
   - QR-skilt konsept (small, dark)
   Hver kort kan klikkes for å utvide/vise mindre.
3. **Referanser**: GFGK-logo og Miklagard GK-logo (MG).
4. **CTA**: "Trenger klubben din en sportslig plan?"
5. **JSON-LD**: BreadcrumbList.

### Data
- Statisk innhold.
- Ingen databasekall.

### Brukerflyt
- "Ta kontakt" (hero) → scroller til `#contact`.
- "Ta kontakt" (CTA) → `/booking`.
- "Les mer" / "Vis mindre" på hver tjenestekort.

---

## 1.9 Fellestrekk på tvers av landingsidene

| Aspekt | Beskrivelse |
|--------|-------------|
| **Navigasjon** | `WebsiteNav` (transparent → hvit ved scroll) på alle sider unntatt `landing/*` som bruker `Navbar variant="light"` |
| **Footer** | `WebsiteFooter` (svart) på academy/junior/utvikling + rot-side. `Footer variant="light"` på `landing/about`, `landing/contact`, `landing/pricing` |
| **Booking-CTA** | `/booking` er den dominerende konverteringen på tvers av ALLE sider |
| **Kontakt** | `/landing/contact` eller `mailto:`-lenker |
| **Spillerportal** | Lenker til `/portal`, `/portal/login`, `/spillerportal` |
| **Mobilmeny** | Hamburger-meny med `AnimatePresence` på `WebsiteNav` |
| **SEO/Structured Data** | JSON-LD BreadcrumbList på academy, junior-academy, utvikling. FAQPage på academy og junior-academy layouts |
| **Faktiske skjemaer** | Kun kontaktskjemaet på `/landing/contact` — men dette sender **ikke** data til backend i den synlige koden (kun lokal state) |
| **Eksterne integrasjoner** | WANG (`wang.no`), GFGK Junior (`gfrg.no`), sosiale medier (Instagram, Facebook, LinkedIn) i footer |

---

# DEL 2: BOOKING-SYSTEMET

## 2.1 Offentlig booking v1 (`/booking`)

### Hva er det?
Den opprinnelige booking-siden som fortsatt eksisterer parallelt med v2. Den bruker en **embedded Acuity Scheduling iframe** for å håndtere hele booking- og betalingsflyten eksternt.

### Hvordan fungerer det?
1. Brukeren ser en hero-seksjon for AK Golf Academy.
2. Velger lokasjon (hardkodet til GFGK for nå).
3. Ser tilgjengelige trenere: Anders Kristiansen og Markus R. Pedersen.
4. Klikker på en trener for å se tjenester.
5. **Booke via embedded Acuity Scheduling iframe** — hele kalenderen, timevelgeren og betalingen skjer inne i iframen.
6. Får bekreftelse på e-post (sendt fra Acuity).

### Data
- Trenere og tjenester hentes fra `ServiceType`- og `Instructor`-tabellene.
- Selve bookingdataen går **til Acuity Scheduling**, ikke direkte til AK Golf-databasen.
- Det er **ingen direkte integrasjon med portalen** fra denne siden.

### Brukerflyt
1. Besøkende kommer til `/booking`.
2. Velger trener og tjeneste.
3. Interagerer med Acuity-iframen.
4. Fullfører booking og betaling i Acuity.
5. Mottar e-postbekreftelse fra Acuity.

### Tekniske detaljer
- Bygget i `app/booking/page.tsx` (v1-komponenten).
- Acuity iframe er embedded med en URL som er konfigurert i miljøvariabler.

---

## 2.2 Offentlig booking v2 — Wizard (`booking-client.tsx`)

### Hva er det?
En ny, egenutviklet booking-wizard som erstatter Acuity-løsningen gradvis. Den gir full kontroll over brukeropplevelse, design og data.

### Hvordan fungerer det?
Wizarden følger en trinnvis flyt styrt av `drawer`-tilstanden:

**Steg 0: Velg trener**
- Hovedsiden viser en grid med `TrainerCard`-komponenter.
- Hver trener har et bilde, navn og tilknyttede tjenester som tags.
- Brukeren klikker på en trener for å velge dem.

**Steg 1: Velg tjeneste**
- Etter at trener er valgt, vises tjenestene som klikkbare `ServiceRow`-elementer på trenerkortet.
- Brukeren klikker en tjeneste, og `DateTimeDrawer` åpnes automatisk.

**Steg 2: Velg dato og tid (`DateTimeDrawer`)**
- En drawer skyver opp fra bunnen.
- Øverst vises en horisontal scroll av `DateChip`-komponenter (datoer).
- Brukeren velger en dato.
- Systemet henter tilgjengelige slots fra `/api/booking/slots`.
- Tilgjengelige tider vises som `TimeChip`-komponenter.
- Brukeren velger en tid.
- Klikker "Bekreft" for å gå videre.

**Steg 3: Bekreft (`ConfirmDrawer`)**
- Drawer med oppsummering: trener, tjeneste, dato, tid, pris.
- Hvis brukeren er **ikke innlogget**: felter for navn, e-post, telefon.
- Hvis brukeren er **innlogget**: info er forhåndsutfylt.
- Hvis brukeren har **abonnement** og tjenesten er inkludert: pris vises som 0 kr.
- Klikker "Gå til betaling" (eller "Bekreft" for abonnement).

**Steg 4: Betaling (`PaymentDrawer`)**
- For ikke-abonnementsbrukere: Stripe-betaling.
- Drawer viser betalingsinformasjon og Stripe-komponent.
- Ved vellykket betaling: `SuccessDrawer` åpnes.

**Steg 5: Suksess (`SuccessDrawer`)**
- Bekreftelsesmelding med booking-detaljer.
- CTA til å logge inn på spillerportalen.
- Informasjon om at bekreftelse er sendt på e-post.

### Data
- **Input**: `trainers` (med `services`), `prefilledUser` (hvis innlogget), `isLoggedIn`, `hasSubscription`.
- **API-kall**:
  - `GET /api/booking/services` — henter tjenester
  - `GET /api/booking/slots` — henter slots for valgt dato/tjeneste/instruktør
  - `GET /api/booking/smart-slots` — anbefalte tidspunkter
  - `POST /api/booking/create` — oppretter booking
- **State**: `BookingState` ({ trainerId, serviceId, date, time, slotIso, name, email, phone }).

### Brukerflyt
1. Besøkende velger trener → tjeneste → dato → tid.
2. Fyller ut kontaktinfo (hvis ikke innlogget).
3. Betaler med Stripe (hvis ikke abonnement).
4. Mottar bekreftelse og kan gå til portalen.

### Tekniske detaljer
- Bygget i `app/booking/booking-client.tsx`.
- Komponenter ligger i `app/booking/components-v2/`.
- Drawer-systemet bruker egne `Drawer`-komponenter med Framer Motion.
- Step-indikatoren (`StepIndicator`) viser visuell fremgang.

---

## 2.3 Betalingssider (`/booking/[id]/pay`)

### Hva er det?
En dedikert betalingsside for bookinger som er opprettet men ikke betalt (status `PENDING`).

### Hvordan fungerer det?
1. Siden mottar `bookingId` fra URL.
2. Henter booking-detaljer fra databasen.
3. Initialiserer en Stripe Payment Intent.
4. Viser et betalingsskjema der brukeren taster inn kortinfo.
5. Ved vellykket betaling: redirect til bekreftelsessiden.

### Data
- `bookingId` fra URL.
- Stripe Payment Intent client secret fra server.
- Booking-detaljer (beløp, valuta, beskrivelse).

### Brukerflyt
1. Brukeren kommer til betalingssiden (fra booking-wizard eller e-postlenke).
2. Taster inn kortinformasjon.
3. Klikker "Betal".
4. Ved suksess: redirect til `/booking/[id]/confirmation`.
5. Ved avbrudd: redirect til `/booking/[id]/cancel`.

### Tekniske detaljer
- `StripePaymentPage.tsx` for innloggede brukere.
- `PublicStripePaymentPage.tsx` for ikke-innloggede brukere.
- Bruker `@stripe/react-stripe-js` og `@stripe/stripe-js`.

---

## 2.4 Bekreftelsesside (`/booking/[id]/confirmation`)

### Hva er det?
Siden brukeren ser etter at en booking er bekreftet — enten umiddelbart (abonnement) eller etter vellykket Stripe-betaling.

### Hvordan fungerer det?
1. Henter booking-detaljer basert på `bookingId`.
2. Viser en oppsummering: dato, instruktør, varighet, pris, tjenestenavn.
3. Viser en `BookingUpsellCard` som foreslår relaterte tjenester.
4. For abonnement: umiddelbar bekreftelse.
5. For Stripe: `PaymentPendingPoller` poller `/api/booking/confirm-payment` hvert 2. sekund (maks 30 forsøk / 60 sekunder) for å sjekke om betalingen er bekreftet.
6. CTA til å logge inn på spillerportalen eller gå tilbake til Academy.

### Data
- `bookingId` fra URL.
- `GET /api/booking/[bookingId]` — henter booking-detaljer.
- `POST /api/booking/confirm-payment` — poller betalingsstatus.

### Brukerflyt
1. Brukeren ser bekreftelsessiden.
2. Polleren sjekker betalingsstatus (kun Stripe).
3. Når bekreftet: viser suksessmelding.
4. Brukeren klikker "Se mine bookinger" (hvis innlogget) eller "Tilbake til Academy".

---

## 2.5 Status- og avbestillingsside (`/booking/[id]/status`)

### Hva er det?
En side hvor både besøkende og innloggede brukere kan se full status på en booking og avbestille den.

### Hvordan fungerer det?
1. Henter booking-detaljer basert på `bookingId`.
2. Viser en **tidslinje** for booking-prosessen (opprettet → bekreftet → fullført/avbestilt).
3. Viser **betalingsstatus**.
4. Tillater **avbestilling** hvis bookingen er `CONFIRMED` eller `PENDING` og ikke i fortiden.
5. Viser **avbestillingsregler**:
   - "> 24 timer før": full refusjon
   - "2–24 timer før": 50% refusjon
   - "< 2 timer før": ingen refusjon
6. Tillater **printe eller dele** booking.
7. For **innloggede brukere**: mulighet for å **endre tid** (reschedule).

### Data
- `bookingId` fra URL.
- `GET /api/booking/[bookingId]` — henter detaljer.
- For ikke-eiere: sensitiv info (f.eks. full e-post, telefon) strippes.

### Brukerflyt
1. Brukeren åpner statussiden (fra e-post, QR-kode, eller portal).
2. Ser booking-tidslinjen og betalingsstatus.
3. Klikker "Avbestill" hvis innen fristen.
4. Bekrefter avbestilling.
5. Mottar refusjon i henhold til reglene.
6. Innlogget bruker kan klikke "Endre tid" for å reschedule.

---

## 2.6 Academy Booking (`/academy/booking`)

### Hva er det?
En dedikert booking-inngang fra Academy-siden, som bruker den samme `BookingWizard` men i `public`-modus.

### Hvordan fungerer det?
1. Viser en hero med informasjon om booking-prosessen.
2. `BookingWizard mode="public"` viser 4 steg: Tjeneste → Tidspunkt → Opplysninger → Bekreft.
3. Progress bar med animasjoner.
4. Etter booking: redirect til `/booking/${bookingId}/confirmation`.
5. Informasjon om: e-postbekreftelse, automatisk profilopprettelse, enkel endring.

### Data
- Henter offentlige `ServiceType` via `/api/portal/public/service-types`.
- Henter slots via `/api/portal/public/slots`.
- `handleBook()` kaller `/api/booking/create` med `paymentMethod: "STRIPE"`.

### Brukerflyt
1. Besøkende kommer fra `/academy`.
2. Velger tjeneste, instruktør, dato, tid.
3. Fyller ut kontaktinfo.
4. Betaler eller bekrefter.
5. Redirect til bekreftelsesside.

---

## 2.7 Booking Wizard-komponenter (`components/booking/`)

### `booking-wizard.tsx`
Hovedwizard-komponenten. Støtter to moduser:
- `public`: Viser alle 4 steg inkludert details-steg (navn, e-post, telefon).
- `portal`: Hopper over details-steg fordi brukeren allerede er autentisert.

### `use-booking-wizard.ts`
Custom hook som styrer all tilstand:
- `selectService()`, `selectInstructor()`, `selectDate()`, `selectSlot()`
- Henter slots fra `/api/portal/public/slots`
- `handleBook()` kaller `/api/booking/create`

### `booking-summary.tsx`
Viser bekreftelsesside med service, instruktør, dato/tid, pris.
Inneholder `CustomerDetailsForm` for public mode.

### `date-picker.tsx` + `time-slots.tsx` + `service-selector.tsx`
UI-komponenter for kalender, timevelger og tjenestevelger.

---

## 2.8 Booking-validering (`lib/portal/booking/validation.ts`)

### Hva er det?
En omfattende valideringsmotor som sjekker at en booking er gyldig før den opprettes.

### Hvordan fungerer det?
`validateBooking()` utfører 9 sjekker:

1. **Grunnleggende input**: Gyldig dato, fremtidig tidspunkt.
2. **ServiceType finnes og er aktiv**: Sjekker at tjenesten eksisterer og er publisert.
3. **Tidsbegrensninger**: `minNoticeHours` (f.eks. ikke booke 1 time før) og `maxAdvanceDays` (f.eks. maks 14 dager frem i tid).
4. **Instruktør-tilgjengelighet**: Sjekker `InstructorAvailability` og `InstructorDateAvailability`.
5. **Dobbeltbooking-sjekk**: Sjekker at instruktøren ikke allerede har en booking i samme tidsrom.
6. **Blokkerte tider**: Sjekker at tidspunktet ikke faller i en blokkert periode.
7. **Student-kvote (abonnement)**: Sjekker at abonnementsbrukeren har ledige sesjoner igjen.
8. **Duplikat-booking**: Sjekker at samme bruker ikke allerede har en identisk booking.
9. **Advarsler**: Flagger siste-liters-bookinger, helg, eller utenfor arbeidstid (men blokkerer ikke).

### Data
- Input: `userId`, `serviceTypeId`, `instructorId`, `startTime`, `endTime`, `isAdmin` (flagg).
- Sjekker mot: `Booking`, `ServiceType`, `InstructorAvailability`, `InstructorDateAvailability`, `BlockedTime`, `SubscriptionQuota`.

---

## 2.9 Konfliktsjekk (`lib/portal/booking/conflict-check.ts`)

### Funksjoner
- `checkDoubleBookingConflict()`: Sjekker overlapp med eksisterende bookinger.
- `checkBlockedTimeConflict()`: Sjekker blokkerte tider.
- `checkAllConflicts()`: Kombinerer begge.
- `validateInstructorAvailability()`: Detaljert tilgjengelighetssjekk.
- `createBookingWithConflictCheck()`: Wrapper for atomisk opprettelse.
- `detectExistingDoubleBookings()`: Health-check funksjon.
- `getBookingStats()`: Metrics.

### Tekniske detaljer
- Bruker Prisma-transaksjoner for å sikre at ingen konflikter oppstår mellom validering og opprettelse.

---

## 2.10 Abonnementskvote (`lib/portal/booking/subscription-quota.ts`)

### Hva er det?
Systemet som styrer hvor mange coaching-timer en abonnementsbruker kan booke per periode.

### Funksjoner
- `checkUserQuota()`: Sjekker om bruker har ledige sesjoner.
- `checkBookingWindow()`: Sjekker maks forhåndsbooking-dager.
- `checkWeeklyLimit()`: Sjekker ukentlig maks:
  - Performance Pro: 2/uke
  - Performance: 1/uke
  - Start: 1/uke
- `consumeSession()`: Bruker én sesjon (atomisk via Supabase RPC for å unngå race conditions).
- `releaseSession()`: Gir tilbake én sesjon ved avbestilling.
- `resetQuotaForNewPeriod()`: Kalles fra Stripe webhook ved fornyelse.
- `createQuotaForNewSubscription()`: Oppretter kvote for nytt abonnement.
- `cancelSubscriptionQuota()`: Sletter kvote.
- `getQuotaStatus()`: Henter kvote-status for UI.

### Data
- Tabell: `SubscriptionQuota` (koblet til `UserSubscription`).
- Felt: `sessionsAllowed`, `sessionsUsed`, `sessionsUsedThisMonth`, `extraSessions`, `periodStart`, `periodEnd`.

---

## 2.11 Reschedule (`lib/portal/booking/reschedule.ts`)

### Hva er det?
Funksjonalitet for å endre tidspunktet på en eksisterende booking.

### Hvordan fungerer det?
1. `rescheduleBooking()` tar `bookingId` og nytt `startTime`/`endTime`.
2. Kjører en Prisma-transaksjon med `Serializable` isolasjonsnivå (høyest mulig).
3. **Oppretter ny booking FØRST**.
4. Deretter **kansellerer gammel booking**.
5. Hvis noe feiler: automatisk rollback.
6. Oppdaterer Google Calendar.
7. Sender e-post og push-notifikasjon til bruker og instruktør.

### Data
- `bookingId`, ny `startTime`, ny `endTime`.
- Sjekker at ny tid er tilgjengelig (samme validering som ny booking).

---

## 2.12 Refusjon (`lib/portal/booking/refund.ts`)

### Hva er det?
Håndterer refusjon ved avbestilling basert på avbestillingsreglene.

### Funksjoner
- `evaluateCancellationPolicy()`:
  - "> 24 timer før": 100% refusjon
  - "2–24 timer før": 50% refusjon
  - "< 2 timer før": 0% refusjon
- `processRefund()`: Håndterer refusjon via original betalingsleverandør.
- `refundStripe()`: Oppretter Stripe refund med idempotency key.

### Data
- `bookingId`, `paymentMethod`, `amount`, `startTime` (for å beregne tid til avbestilling).
- Støtter: **STRIPE**, **INVOICE** (manuell), **NONE**.

---

## 2.13 Venteliste (`lib/portal/booking/waitlist.ts`)

### Hva er det?
Et system som lar brukere melde seg på venteliste for en fullbooket tid, og automatisk får tilbud når noen avbestiller.

### Hvordan fungerer det?
1. `addToWaitlist()`: Legger student på venteliste for en spesifikk slot.
2. Når en booking kanselleres: `notifyNextOnWaitlist()` sender e-post til første person på ventelisten.
3. Ventelisteposisjonen har en **24-timers utløpsfrist**. Hvis brukeren ikke booker innen 24 timer, går tilbudet videre til neste person.

### Data
- Tabell: `BookingWaitlist` (antatt, basert på funksjonsnavn).
- Felter: `userId`, `serviceTypeId`, `instructorId`, `preferredDate`, `preferredTime`, `expiresAt`.

---

## 2.14 Portal-booking (innlogget bruker)

### Mine bookinger (`/portal/bookinger`)
- Liste over kommende og tidligere bookinger.
- Neste booking vises som et stort hero-kort øverst.
- Avbestillingsregler vises tydelig.
- Tom tilstand med CTA hvis ingen bookinger.
- Knapper for "Ny booking", "Endre", "Avbestill".

### Ny booking i portal (`/portal/bookinger/ny`)
- Bruker `<PortalBookingWizard>` (samme `BookingWizard` med `mode="portal"`).
- Forhåndsutfylt brukerinfo (navn, e-post, telefon hentes fra profilen).
- Hopper over details-steg.
- Abonnementstjenester vises med pris = 0 kr.

### Portal booking API (`/api/portal/bookings/`)
| Endpoint | Beskrivelse |
|----------|-------------|
| `POST /cancel` | Avbestiller booking med refusjon, e-post, ventelistenotifikasjon, Google Calendar-sletting |
| `POST /create-group` | Oppretter gruppebooking med deltakere, kapasitetssjekk, pessimistisk lås |
| `GET /live` | SSE-endepunkt for sanntids oppdateringer av slots/bookinger |
| `POST /reschedule` | Endrer tid på booking (Zod-validering) |

---

## 2.15 Oppsummering: Hva kan hver brukergruppe gjøre?

| Funksjon | Besøkende (uten login) | Innlogget bruker |
|----------|------------------------|------------------|
| Se trenere & tjenester | ✅ | ✅ |
| Velge dato & tid | ✅ | ✅ |
| Fylle ut kontaktinfo | ✅ | Forhåndsutfylt |
| Betale med Stripe | ✅ | ✅ |
| Booke uten betaling (abonnement) | ❌ | ✅ |
| Se booking-bekreftelse | ✅ | ✅ |
| Se booking-status | ✅ | ✅ |
| Avbestille | ✅ (via status-siden) | ✅ |
| Endre tid | ❌ | ✅ |
| Se "Mine bookinger" | ❌ | ✅ |
| Gruppebooking | ❌ | ✅ |
| Coaching-pakker (2026) | Se info | ✅ Booke |
| Venteliste | ❌ | ✅ |
| Få e-postbekreftelse | ✅ | ✅ |
| Google Calendar-sync | Bak kulissene | Bak kulissene |

---

# DEL 3: SPILLERPORTAL (Player Portal)

## Introduksjon til spillerportalen

Spillerportalen er hjertet i AK Golf Platform. Det er der spilleren logger inn for å:
- **Planlegge** trening og coaching
- **Trene** med strukturerte økter og treningsplaner
- **Spille** med runde-registrering, turneringsplanlegging og strategi
- **Analysere** egen utvikling med statistikk, TrackMan-data, AI Coach og benchmarking
- **Kommunisere** med treneren

Portalen er bygget som en **single-page application (SPA)-aktig opplevelse** innenfor Next.js, med en fast sidebar-navigasjon og et hovedinnholdsområde. Designet følger `docs/DESIGN_SYSTEM.md` med hvite kort, grå bakgrunn (`#F5F5F7`), og skarp typografi.

---

## 3.1 Oversikt / Dashboard (`/portal`)

### Hva er det?
Dashboardet er den første siden spilleren ser etter innlogging. Det gir en rask, visuell oppsummering av alt som er relevant akkurat nå.

### Hvordan fungerer det?
Siden er delt inn i flere visuelle rader:

**Profil-header**
- Venstre side: Profilbilde (rundt, klikkbart, går til `/portal/profil`), navn, og dato.
- Høyre side (skjult på mobil): HCP, antall runder, antall økter, og abonnementstier-badge (f.eks. "Academy", "Pro", "Elite").

**Rad 1: Neste coaching + Ukens treningsplan**
- `NextBookingCard`: Et stort kort som viser neste booking med instruktør, tjeneste, dato og nedtelling. Hvis ingen booking: CTA til å booke.
- `TrainingPlanCard`: Et kort som viser dagens økt fra treningsplanen. Hvis ingen plan: melding om at plan genereres etter første coaching.

**Rad 2: Ukekalender**
- En visuell ukekalender (man–søn) med datoer.
- Grønn prikke under datoen = trening logget.
- Svart prikke = coaching-booking.
- Ingen prikke = hviledag eller ingen aktivitet.
- Dagens dato er fremhevet med lime-grønn bakgrunn.

**Rad 3: Statistikk + Coach-insight**
- **Statistikk-kort**: Store animerte tall for HCP, runder, økter. En "Se full statistikk"-knapp går til `/portal/statistikk`.
- **CoachInsightCard**: Viser siste coach-notat + AI-generert ukentlig innsikt. Hvis ingen data: tom-state med oppfordring.

**Rad 4: Snarveier**
- 4 hurtigknapper: Logg trening (`/portal/dagbok`), Registrer runde (`/portal/runde`), Book coaching (`/portal/bookinger/ny`), AI Coach (`/portal/ai-coach`).

### Data
| Datakilde | Felt | API/Funksjon |
|-----------|------|--------------|
| Brukerprofil | `userName`, `userImage`, `tier`, `memberSince` | `requirePortalUser()` |
| Stats | `sessionsCount`, `roundsCount` | `getPlayerStats()` |
| Handicap | `current`, `trend`, `handicapHistory` | `getLatestHandicap()` |
| Neste booking | `id`, `instructorName`, `serviceName`, `duration`, `startTime` | `getNextBooking()` |
| Ukekalender | `days[]` med `trained`, `hasCoaching`, `isToday`, `isRest`, `completionPercent` | `getWeekRings()` |
| Coach insight | `focusAreas`, `primaryFocus`, `summary`, `date` | `getLatestCoachInsight()` |
| AI insight | `summary`, `strengths[]`, `improvements[]`, `focusTip`, `generatedAt` | `getLatestAiInsight()` |

### Brukerflyt
1. Spilleren logger inn på `/portal/login`.
2. Redirect til `/portal`.
3. Ser dashboard med personlig data.
4. Klikker på et kort eller en snarvei for å navigere videre.

### Tekniske detaljer
- Bygget i `app/portal/(dashboard)/page.tsx` (server-side) + `dashboard-client.tsx` (client-side).
- `NumberTicker`-komponenten fra `@motion-number` animerer tallene.
- `PremiumCard` gir skygge og hover-effekter.

---

## 3.2 Profil (`/portal/profil` + `/portal/profil/innstillinger`)

### Hva er det?
Spillerens egen profilside hvor de kan se og redigere personlig informasjon.

### Hvordan fungerer det?
**Profil-side (`/portal/profil`)**
- Stort profilbilde øverst.
- Navn, e-post, telefon, rolle (Spiller/Instruktør/Administrator).
- Abonnementstier-badge.
- Nøkkeltall: Handicap, økter siste 30 dager, coaching totalt, streak.
- Abonnementskort med status og CTA til `/portal/abonnement`.

**Innstillinger (`/portal/profil/innstillinger`)**
- **Konto**: Rediger navn, e-post, telefon.
- **Varsler**: Toggle for e-postvarsler, SMS-varsler, push-varsler.
- **Passord**: Endre passord (krever gammelt passord + nytt passord to ganger).
- `AvatarUpload`-komponent: Last opp/endre profilbilde.

### Data
- `getMyProfile()`: Henter brukerens profil fra `PortalUser`.
- `getPlayerStats()`: Henter aggregerte stats.
- `updateProfile()`: Lagrer endringer.
- `updatePassword()`: Endrer passord via Supabase Auth.
- `uploadAvatar()`: Laster opp bilde til Supabase Storage.

### Brukerflyt
1. Spilleren klikker profilbilde i sidebar eller navigerer til `/portal/profil`.
2. Ser profilinformasjon.
3. Klikker "Rediger profil" eller går til "Innstillinger".
4. Gjør endringer og lagrer.
5. Nytt profilbilde vises umiddelbart i sidebar.

---

## 3.3 Bookinger (`/portal/bookinger`, `/portal/bookinger/ny`, `/portal/bookinger/[id]`)

### Hva er det?
Oversikt over alle spillerens bookinger, med mulighet for å opprette nye, endre eksisterende, eller avbestille.

### Hvordan fungerer det?
**Bookingsliste (`/portal/bookinger`)**
- **Kommende bookinger**: Liste over fremtidige bookinger sortert etter dato.
- **Tidligere bookinger**: Liste over fullførte/avbestilte bookinger.
- **Neste booking hero-kort**: Øverst vises neste booking stort med instruktørbilde, tjeneste, dato/tid, og knapper for "Endre" / "Avbestill".
- **Avbestillingsregler**: En infoboks forklarer refusjonsreglene.
- **Tom tilstand**: Hvis ingen bookinger: "Du har ingen bookinger ennå. Book din første time." med CTA-knapp.

**Booking-detalj (`/portal/bookinger/[id]`)**
- Full oppsummering av én booking.
- Status-badge (Bekreftet, Venter, Fullført, Avbestilt, Ikke møtt).
- Tidslinje som viser booking-historikken.
- Knapper for "Endre tid" og "Avbestill" (hvis tillatt).

**Endre booking (`/portal/bookinger/[id]/endre`)**
- En forenklet wizard hvor spilleren kun kan velge ny dato og tid.
- Samme slot-henting og validering som ny booking.
- Ved bekreftelse: kaller `rescheduleBooking()`.

**Ny booking (`/portal/bookinger/ny`)**
- `PortalBookingWizard` i `mode="portal"`.
- Forhåndsutfylt brukerinfo.
- Hopper over "Opplysninger"-steget.
- Viser abonnementstjenester med 0 kr.

### Data
- `getUpcomingBookings()`: Henter `CONFIRMED`/`PENDING` bookinger frem i tid.
- `getPastBookings()`: Henter `COMPLETED`/`CANCELLED`/`NO_SHOW` bookinger.
- `getBookingDetail(bookingId)`: Henter full detalj.
- `POST /api/portal/bookings/reschedule`: Endrer tid.
- `POST /api/portal/bookings/cancel`: Avbestiller.

### Brukerflyt
1. Spilleren går til `/portal/bookinger`.
2. Ser neste booking øverst.
3. Klikker "Ny økt" (fra sidebar) eller "Book coaching" (fra dashboard).
4. Velger trener → tjeneste → dato → tid → bekrefter.
5. Mottar e-postbekreftelse.
6. Kan senere gå tilbake og endre eller avbestille.

---

## 3.4 Coaching-historikk (`/portal/coaching-historikk`)

### Hva er det?
En oversikt over alle gjennomførte coachingsesjoner, med tilgang til notater og AI-genererte oppsummeringer.

### Hvordan fungerer det?
- Liste over coaching-økter sortert etter dato (nyeste først).
- Hver økt viser:
  - Dato og instruktør
  - Hovedfokusområde (f.eks. "Langt spill", "Putting")
  - Instruktørens notater (kort utdrag)
  - AI-oppsummering (hvis generert)
- For staff/brukere med riktige rettigheter: "Generer AI-oppsummering"-knapp.
- Klikk på en økt for å se full detalj.

### Data
- `getCoachingSessions()`: Henter fra `CoachingSession`-tabellen.
- AI-oppsummering hentes fra `/api/portal/ai/coaching-summary`.
- `CoachingSession`-felter: `sessionDate`, `instructorId`, `primaryFocus`, `secondaryFocus`, `instructorNotes`, `aiSummary`, `playerReflection`.

### Brukerflyt
1. Spilleren går til `/portal/coaching-historikk`.
2. Blar gjennom tidligere økter.
3. Klikker på en økt for å lese notater og AI-oppsummering.
4. Ser trender over tid (f.eks. "Du har jobbet mye med approach siste 3 økter").

### AI-funksjon
- `/api/portal/ai/coaching-summary` tar en coaching-økt som input og genererer en strukturert oppsummering med nøkkelpoeng, anbefalinger og fokusområder.

---

## 3.5 Statistikk (`/portal/statistikk`, `/portal/statistikk/ny-runde`)

### Hva er det?
Spillerens statistikksenter. Viser aggregerte data over runder, trening og Strokes Gained, med filtrering på tidsperiode.

### Hvordan fungerer det?
**Statistikk-dashboard (`/portal/statistikk`)**
- **Periodevelger**: 30 dager, 90 dager, Sesong, 1 år, Egendefinert.
- **KPI-kort**:
  - Snitt score (siste N runder)
  - Handicap (siste registrerte)
  - Antall runder
  - SG Total (Strokes Gained total)
- **Strokes Gained**: Horisontale barer per kategori:
  - Tee Total (driver + fairway wood)
  - Approach (jern)
  - Short Game (chip, pitch, bunker)
  - Putting
- **Treningsvolum**: Stolpediagram som viser trente minutter per uke.
- **Score-trend**: Sparkline-graf som viser score-utvikling over tid.
- **AI-anbefaling**: En boks identifiserer automatisk spillerens svakeste SG-kategori og gir en treningsanbefaling.

**Ny runde (`/portal/statistikk/ny-runde`)**
- En enkel snarvei-side som sender spilleren videre til runde-registreringen (`/portal/runde/ny`).

### Data
- `getFilteredRoundStats(period)`: Henter runder innenfor valgt periode.
- `getFilteredAggregates(period)`: Beregner snitt, median, best/worst.
- `getStrokesGainedData(period)`: Henter/beregner SG per kategori.
- `getWeeklyTrainingVolume(period)`: Aggregater fra treningslogger.
- `getLatestHandicap()`: Siste handicap.

### Brukerflyt
1. Spilleren går til `/portal/statistikk`.
2. Velger ønsket periode (f.eks. "Siste 90 dager").
3. Studerer KPI-kortene og SG-barene.
4. Ser AI-anbefalingen: "Din svakeste kategori er Approach. Her er 3 øvelser..."
5. Klikker "Registrer ny runde" for å legge til data.

---

## 3.6 TrackMan (`/portal/trackman`)

### Hva er det?
En dedikert seksjon for TrackMan-data. Spilleren kan se historiske sesjoner, analysere klubb-statistikk, og importere nye data via CSV eller bilde.

### Hvordan fungerer det?
**Oversikt**
- **Top-stats**: Antall sesjoner, slag totalt, beste carry, snitt carry.
- **Ballfart-trend**: Linjediagram for driver-ballfart over tid.
- **Sesjoner per klubb**: Stolpediagram som viser hvor mange slag som er slått med hver klubb.
- **Klubb-statistikk tabell**:
  - Klubb
  - Klubbfart (swing speed)
  - Ballfart
  - Spin
  - Launch angle
  - Carry
- **Sesjonsoversikt**: Ekspanderbare rader. Klikk på en sesjon for å se alle slagene i den sesjonen.

**Import-funksjoner**
- **Last opp CSV**: En filopplaster som aksepterer TrackMan CSV-eksporter. Systemet parser filen og lagrer slagdata i databasen.
- **Last opp skjermbilde**: En bildeopplaster som sender bildet til en AI/OCR-tjeneste. AI-en leser TrackMan-tallene fra skjermbildet og lagrer dem.
- **Eksporter data**: Last ned alle TrackMan-data som CSV.

### Data
- `getTrackManOverview()`: Henter aggregerte stats.
- `GET /api/portal/trackman/sessions`: Henter alle sesjoner.
- `GET /api/portal/trackman/sessions/[id]/shots`: Henter alle slag for en sesjon.
- `POST /api/portal/trackman/upload-csv`: Parser og lagrer CSV.
- `POST /api/portal/trackman/upload-image`: AI/OCR-analyse.

### Brukerflyt
1. Spilleren går til `/portal/trackman`.
2. Ser oversikt over tidligere sesjoner.
3. Klikker "Last opp CSV" og velger en TrackMan-eksport.
4. Systemet parser filen og oppdaterer siden med nye data.
5. Spilleren studerer klubb-statistikken og identifiserer hvilke klubber som trenger mer trening.

### AI-funksjon
- Bilde-upload med OCR: AI-en gjenkjenner TrackMan-layouten, leser tallene, og strukturerer dem til databaserader.

---

## 3.7 Dagbok / Treningslogg (`/portal/dagbok`, `/portal/dagbok/[sessionId]`)

### Hva er det?
Spillerens treningsdagbok. Her logger spilleren alle økter — både selvstendig trening og fullføring av treningsplan-økter.

### Hvordan fungerer det?
**Dagbok-oversikt (`/portal/dagbok`)**
- **Streak-kort**: Antall dager på rad med trening.
- **Stats**: Økter totalt, timer totalt, snitt vurdering.
- **Filter**: Filtrer etter fokusområde (f.eks. "Langt spill", "Putting").
- **Visningsmodus**: Listevisning eller kalendervisning.
- **Logg-oppføringer**: Hver økt viser dato, varighet, fokusområde, vurdering (1–10), og eventuell coach-feedback.

**Logg ny økt**
- En modal/dialog åpnes.
- Felter:
  - Dato (forhåndsutfylt med i dag)
  - Varighet (minutter)
  - Fokusområde (dropdown)
  - Notater (tekstfelt)
  - Vurdering (1–10 stjerner)
- "Gjenta siste økt": Ett-klikks-knapp som kopierer forrige økts data.

**Økt-detalj (`/portal/dagbok/[sessionId]`)**
- Full visning av én logget økt.
- Viser øvelser (hvis økten var fra treningsplanen), L-M-PR tags, coach-feedback.
- Rediger-knapp for å endre notater eller vurdering.

### Data
- `getTrainingLogs()`: Henter alle `TrainingLog`-rader for brukeren.
- `getLoggedSessionIds()`: Henter ID-er for økter som allerede er logget.
- `getLastSession()`: Henter siste logget økt (for "Gjenta"-funksjonen).
- `createTrainingLog()`: Lagrer ny økt.
- `updateTrainingLog()`: Oppdaterer eksisterende.

### Brukerflyt
1. Spilleren går til `/portal/dagbok`.
2. Klikker "Logg ny økt".
3. Fyller ut varighet, fokusområde, notater, vurdering.
4. Lagrer. Økten vises i listen og i ukekalenderen på dashboardet.
5. Hvis økten var fra treningsplanen, markeres den som fullført i planen også.

---

## 3.8 Treningsplan (`/portal/treningsplan`, `/portal/treningsplan/[sessionId]`)

### Hva er det?
Spillerens strukturerte treningsplan. Kan være manuelt opprettet av instruktør, eller AI-generert basert på spillerens data.

### Hvordan fungerer det?
**Treningsplan-oversikt (`/portal/treningsplan`)**
- **Ukeplan**: En 7-dagers selector (man–søn).
- **Dagens økt**: Viser øvelser, varighet, fokusområde, og beskrivelse for valgt dag.
- **Ukens fokus**: Et banner som viser hovedfokus for uken (f.eks. "Konsistens i approach").
- **Fremgangsindikator**: Progress bar som viser hvor mange av ukens økter som er fullført.
- **Kalender-visning (V2)**: Drag-and-drop kalender hvor spilleren kan flytte økter mellom dager.

**Økt-detalj (`/portal/treningsplan/[sessionId]`)**
- Full øktvisning med alle øvelser.
- Hver øvelse viser: navn, beskrivelse, varighet, antall repetisjoner/sett, video-lenke (hvis tilgjengelig).
- "Marker som fullført"-knapp.
- "Start økt"-knapp (går til økt-detalj).

**AI-generert plan**
- En "Generer AI-plan"-knapp (kun for autoriserte brukere, f.eks. etter coaching-sesjon).
- Spilleren svarer på noen spørsmål (mål, treningsfrekvens, tilgjengelig utstyr).
- AI-en genererer en komplett 4–12 ukers plan med økter, øvelser og progresjon.
- Planen lagres i databasen og kobles til spilleren.

**Manuell plan**
- Instruktør eller spiller kan opprette økter manuelt.
- Velg dato, fokusområde, øvelser fra biblioteket.

### Data
- `getActivePlan()`: Henter spillerens aktive `TrainingPlan`.
- `getWeekEvents()`: Henter økter for valgt uke.
- `POST /api/portal/ai/training-plan`: Genererer AI-plan.
- `TrainingPlan`-felter: `title`, `startDate`, `endDate`, `status`, `generatedBy`.
- `TrainingSession`-felter: `date`, `focusArea`, `duration`, `completed`, `planId`.
- `TrainingSessionExercise`-felter: `exerciseId`, `sets`, `reps`, `duration`, `notes`.

### Brukerflyt
1. Spilleren går til `/portal/treningsplan`.
2. Ser ukens plan.
3. Klikker på en dag for å se økt-detaljer.
4. Fullfører økten og klikker "Marker som fullført".
5. Hvis spilleren vil ha ny plan: klikker "Generer AI-plan", svarer på spørsmål, og mottar en ny plan.

### AI-funksjon
- `/api/portal/ai/training-plan` bruker spillerens profil, handicap, siste runder, treningslogger, og coaching-fokus for å generere en personlig plan.
- Planen følger AK-Formula med pyramid-koder: FYS → TEK → SLAG → SPILL → TURN.

---

## 3.9 Tester / DECADE Tester (`/portal/tester`, `/portal/trening/tester`)

### Hva er det?
En samling av standardiserte tester som spilleren kan gjennomføre for å måle fremgang. Inkluderer både DECADE-mentale tester og fysiske/trackman-baserte tester.

### Hvordan fungerer det?
**DECADE Tester**
- **Oversikt**: Fullførte tester, total score, tilgjengelige tester, beste test.
- **Testliste**: Alle tilgjengelige tester med beskrivelse.
- **Leaderboard**: Per test kan spilleren se en leaderboard med andre spillere.
  - Filter: Alle, Denne måned, Denne uke.
  - Medaljer for topp 3 (🥇🥈🥉).
- **Start test**: Spilleren gjennomfører testen og får en score.

**TrackMan Tester (`/portal/trening/tester`)**
- 100+ standardiserte tester gruppert i kategorier:
  - Hastighet, Presisjon, Avstandskontroll, Ballflukt, Konsistens, Effektivitet
  - Wedge, Jern, Driver, Benchmark
- Hver test har en protokoll (beskrivelse av hvordan den gjennomføres).
- Spilleren kan se sine tidligere resultater per test.

### Data
- `getTestsOverview()`: Henter fullførte og tilgjengelige tester.
- `getTesterStats()`: Henter aggregerte test-stats.
- `GET /api/portal/tests/leaderboard`: Henter leaderboard-data.
- `trackman_test_protocols`: Tabell med test-protokoller.
- `TestResult`: Brukerens resultater per test.

### Brukerflyt
1. Spilleren går til `/portal/tester`.
2. Ser DECADE-tester.
3. Klikker på en test for å se leaderboard.
4. Starter testen, fullfører den, og får en score.
5. Sammenligner med tidligere resultater og andre spillere.

---

## 3.10 Mental Scorecard (`/portal/mental`, `/portal/mental/ny`, `/portal/mental/[roundId]`)

### Hva er det?
Et verktøy for å tracke den mentale siden av golfspillet. Spilleren vurderer sin mental tilstand før, under og etter hvert hull.

### Hvordan fungerer det?
**Oversikt (`/portal/mental`)**
- **Runder-tab**: Liste over runder med mental scorecard.
- **Trends-tab**: Linjediagram over 4 metrics over tid:
  - Fokus (1–10)
  - Selvtillit (1–10)
  - Engasjement (1–10)
  - Aksept (1–10)
- Snitt-verdier for alle metrics vises som store tall.

**Ny mental scorecard (`/portal/mental/ny`)**
- Velg bane, dato, og total score.
- Deretter fylles scorecard ut **hull for hull**:
  - Plan (tekst)
  - Target (tekst)
  - Fokus (1–10)
  - Selvtillit (1–10)
  - Visualisering (1–10)
  - Rutine fullført (ja/nei)
  - Resultat (tekst)
  - Processcore (1–10)
  - Følelse (tekst)
  - Akseptert (ja/nei)
  - Tvil (ja/nei)

**Rundedetalj (`/portal/mental/[roundId]`)**
- Full visning av mental scorecard for én runde.
- Kan redigeres.

### Data
- `GET /api/portal/ai/mental/rounds`: Henter runder med mental data.
- `GET /api/portal/ai/mental/trends`: Henter trend-data for grafer.
- `POST /api/portal/ai/mental/entries`: Lagrer nytt scorecard.

### Brukerflyt
1. Etter en runde går spilleren til `/portal/mental/ny`.
2. Velger bane og dato.
3. Går gjennom hull 1–18 og vurderer sin mentale tilstand.
4. Lagrer.
5. Går tilbake til `/portal/mental` for å se trender over tid.

### AI-funksjon
- AI Coach kan vise mental trend (7-dagers snitt) og gi råd basert på mønstre i dataene.

---

## 3.11 Runde / Scorecard (`/portal/runde/ny`, `/portal/runde/[id]`, `/portal/runde/[id]/oppsummering`)

### Hva er det?
Et komplett system for å registrere golfrunder hull for hull, med integrert DECADE-strategi og pre-shot rutine.

### Hvordan fungerer det?
**Start ny runde (`/portal/runde/ny`)**
- **Bane-velger**: Søk etter bane. Systemet viser treff fra `Course`-tabellen.
- **Tee-farge**: Velg tee (gul, rød, hvit, blå).
- **Vær**: Velg værforhold (solskyet, regn, vind).
- Klikk "Start runde".

**Live runde (`/portal/runde/[id]`)**
- **Hull-for-hull registrering**:
  - Score (slag)
  - Putts
  - Fairway hit (ja/nei/ikke relevant)
  - GIR (ja/nei)
- **DECADE strategi-panel** (vises for hvert hull):
  - Anbefalt klubb
  - Aimpoint
  - Målsone
  - Fareområder (vann, bunkere, out of bounds)
- **Pre-shot rutine**: En steg-for-steg guide:
  1. Visualiser slaget
  2. Velg klubb
  3. Utfør sving
  4. Evaluer resultat
  - Hvert steg har en fullføringsknapp.
- **GPS-avstand**: `GPSDistance`-komponenten viser avstand til hull (hvis tilgjengelig).
- **Strategi fulgt**: En toggle for om spilleren fulgte DECADE-strategien.
- Navigasjon: Forrige/neste hull, eller direkte klikk på hull-nummer.

**Oppsummering (`/portal/runde/[id]/oppsummering`)**
- Total score og score to par.
- Score-fordeling: eagle, birdie, par, bogey, dobbel+, triple+.
- Fairway %, GIR %, putts totalt.
- Strokes Gained breakdown per kategori.
- DECADE Score (prosentandel av hull hvor strategi ble fulgt).
- Sammenligning med handicap.

### Data
- `startRound(courseId, teeId, weather)`: Oppretter ny runde.
- `saveHoleResult(roundId, holeNumber, data)`: Lagrer resultat per hull.
- `completeRound(roundId)`: Fullfører runden og beregner aggregater.
- `Course`-tabell: baner og hull-data.
- `HoleResult`-tabell: score, putts, fairway, gir, strategyFollowed.

### Brukerflyt
1. Spilleren går til `/portal/runde/ny`.
2. Søker etter og velger bane.
3. Velger tee og vær.
4. Starter runden.
5. For hvert hull: ser DECADE-strategi, følger pre-shot rutine, registrerer score.
6. Fullfører runden.
7. Studerer oppsummeringen med Strokes Gained og DECADE Score.

---

## 3.12 Spill-modul (`/portal/spill`, `/portal/spill/[gameType]`)

### Hva er det?
En samling av treningspill designet for å gjøre øktene mer engasjerende. Fokus på nærspill, putting og press-situasjoner.

### Hvordan fungerer det?
**Oversikt (`/portal/spill`)**
- Tre spillkategorier:
  - **Nærspill**: Chip, pitch, bunker-utfordringer
  - **Putting**: Avstander, break, konsistens
  - **Press**: Øvelser under press (PR1–PR5)
- Siste økter vises (hvis noen).

**Live økt (`/portal/spill/[gameType]`)**
- "Start spill" oppretter en ny spilløkt.
- Spilleren logger hvert slag:
  - Avstand til hull
  - Resultat (tekst)
  - Notater
  - Pressnivå (PR1 = lavt press, PR5 = høyt press)
- **Scoreboard**: Viser poengsum og statistikk i sanntid.
- "Avslutt økt": Viser endelig poengsum, statistikk, og lagrer økten.

### Data
- `POST /api/portal/ai/games`: Oppretter spilløkt.
- `POST /api/portal/ai/games/shots`: Lagrer slag.
- `GameSession`-tabell: `gameType`, `startTime`, `endTime`, `totalScore`.
- `GameShot`-tabell: `distance`, `result`, `notes`, `pressureLevel`.

### Brukerflyt
1. Spilleren går til `/portal/spill`.
2. Velger kategori (f.eks. "Putting").
3. Klikker "Start spill".
4. Logger hvert putt med avstand og resultat.
5. Avslutter økten og ser poengsum.

---

## 3.13 Sosialt (`/portal/sosialt`)

### Hva er det?
Et sosialt nettverk innenfor portalen hvor spillere kan legge til venner, se leaderboards, og konkurrere.

### Hvordan fungerer det?
- **Venner**: Liste over alle venner med:
  - Online/offline status (grønn/grå prikk)
  - Handicap
  - Siste aktivitet
- **Toppliste**: Handicap-leaderboard blant venner (lavt handicap = høy plassering).
- **Innkommende forespørsler**: Liste over personer som har sendt venneforespørsel.

**Handlinger**
- **Legg til venn**: Søk etter brukere (navn eller e-post). Send forespørsel.
- **Godta / avslå**: Håndter innkommende forespørsler.
- **Filtrer venner**: Søk i egen venneliste.
- **Send melding**: UI-knapp finnes, men full meldingsfunksjonalitet er ikke implementert i sosialt-modulen (bruk `/portal/meldinger` for trener-kommunikasjon).

### Data
- `getFriends()`: Henter godkjente vennskap.
- `getFriendsLeaderboard()`: Henter handicap-rangering blant venner.
- `getPendingRequests()`: Henter innkommende forespørsler.
- `searchUsers(query)`: Søker etter brukere.
- `sendFriendRequest(userId)`, `acceptFriendRequest(id)`, `declineFriendRequest(id)`.

### Brukerflyt
1. Spilleren går til `/portal/sosialt`.
2. Ser vennelisten og topplisten.
3. Klikker "Legg til venn", søker etter en spiller, sender forespørsel.
4. Godtar innkommende forespørsler.
5. Sammenligner handicap med venner på topplisten.

---

## 3.14 Sammenligning / Peer-analyse (`/portal/sammenligning`)

### Hva er det?
En avansert analysefunksjon som sammenligner spilleren med andre spillere på samme nivå.

### Hvordan fungerer det?
- Spilleren klassifiseres automatisk i en kategori basert på handicap og Strokes Gained.
- En **radar-chart** viser spilleren vs peers på flere metrics:
  - Driving distance
  - Fairway accuracy
  - GIR
  - Putts per runde
  - Scrambling
  - Strokes Gained total
- **Statistiske sammenligninger**: Tabell som viser spillerens verdi, peer-snitt, og differanse.

### Tilgang
- Krever **PRO** abonnement eller høyere.
- `TierGate`-komponenten blokkerer tilgang for lavere tiers.

### Data
- `getPeerComparisonData()`: Henter anonymiserte aggregater for peer-gruppen.
- Spillerens egen data hentes fra `RoundStats` og `StrokesGained`.

### Brukerflyt
1. Spilleren (med PRO) går til `/portal/sammenligning`.
2. Ser sin spillerkategori (f.eks. "Single-digit hcp").
3. Studerer radar-chart og identifiserer områder hvor de er bedre/dårligere enn peers.

---

## 3.15 Benchmarking (`/portal/benchmark`)

### Hva er det?
Sammenligning med PGA Tour-proffer via DataGolf-integrasjon.

### Hvordan fungerer det?
- **PGA Tour-persentil**: Vertikalt bar-chart som viser spillerens persentil per SG-kategori sammenlignet med PGA Tour.
- **A-K ferdighetsnivå**: Overall score og per kategori.
- **Proff-sammenligning**:
  - Søk etter PGA Tour-spiller (f.eks. "Viktor Hovland").
  - Radar-chart som viser spilleren vs proffen side om side.
  - Tabell med eksakte verdier.
- **Forbedringspotensial**: Estimert HCP-effekt av å forbedre ulike SG-kategorier.
- **Innspill per avstand**: Bar-chart som sammenligner spillerens innspill mot proffsnittet fra ulike avstander (100m, 150m, 200m).

### Data
- `getPlayerSGProfile()`: Henter spillerens Strokes Gained-profil.
- `getProPlayers()`: Henter liste over tilgjengelige proffspillere fra DataGolf.
- `getProComparison(proPlayerId)`: Henter sammenligningsdata.
- DataGolf API (`/lib/portal/datagolf`).

### Brukerflyt
1. Spilleren går til `/portal/benchmark`.
2. Ser sin PGA Tour-persentil.
3. Søker etter en proffspiller.
4. Studerer radar-chart og tabell.
5. Ser forbedringspotensialet for ulike kategorier.

---

## 3.16 Kalender (`/portal/kalender`)

### Hva er det?
Spillerens personlige kalender som viser bookinger, treningsplan-økter, og turneringer.

### Hvordan fungerer det?
- **Ukekalender**: Visuell ukevisning med hendelser.
- **Google Calendar Sync**:
  - "Koble til Google Calendar"-knapp.
  - OAuth-autentisering mot Google.
  - Etter autentisering synkroniseres alle bookinger og treningsplan-økter til spillerens Google Calendar.
  - Webhook håndterer endringer.
  - iCal-feed tilgjengelig for andre kalender-apper.

### Data
- `getCalendarEvents()`: Henter bookinger, treningsøkter, og turneringer.
- `GET /api/portal/calendar/google/auth`: Starter OAuth.
- `GET /api/portal/calendar/google/callback`: Håndterer callback.
- `POST /api/portal/calendar/google/sync`: Triggesynkronisering.
- `GET /api/portal/calendar/feed/[token]`: iCal-feed.

### Brukerflyt
1. Spilleren går til `/portal/kalender`.
2. Ser kommende hendelser.
3. Klikker "Koble til Google Calendar".
4. Godkjenner i Google-popup.
5. Hendelser synkroniseres automatisk.

---

## 3.17 Meldinger (`/portal/meldinger`)

### Hva er det?
Direktemeldinger mellom spiller og trener.

### Hvordan fungerer det?
- **Samtaleliste**: Venstre sidepanel med alle aktive samtaler.
- **Chat-vindu**: Høyre side med meldingshistorikk.
- **Send melding**: Tekstfelt nederst. Meldinger sendes i sanntid (via Supabase Realtime eller polling).
- **Notifikasjoner**: Uleste meldinger vises med badge på sidebar.

### Data
- `getMyConversations()`: Henter samtaler hvor brukeren er deltaker.
- `getMessages(conversationId)`: Henter meldinger.
- `sendMessage(conversationId, content)`: Sender melding.
- `Conversation`-tabell: `participantIds[]`, `createdAt`, `updatedAt`.
- `Message`-tabell: `conversationId`, `senderId`, `content`, `createdAt`, `readAt`.

### Brukerflyt
1. Spilleren går til `/portal/meldinger`.
2. Velger en samtale (typisk med treneren).
3. Skriver og sender en melding.
4. Mottar svar og ser det i sanntid.

---

## 3.18 Analyse (`/portal/analyse`)

### Hva er det?
En dypere analyse-side enn statistikk-dashboardet, med flere grafer og sammenhenger.

### Hvordan fungerer det?
- **GIR-trend**: Graf over greens in regulation over tid.
- **Fairway-trend**: Graf over fairway-treffprosent.
- **Putts per runde**: Trendlinje.
- **Scrambling**: Prosentandel av hull hvor spilleren reddet par uten GIR.
- **Handicap-trend**: Langsiktig graf.
- **Strokes Gained breakdown**: Dypere analyse per kategori.
- **TrackMan-data**: Kun for PRO-brukere. Viser avanserte TrackMan-metricer.
- **Quick actions**: "Last opp TrackMan", "Registrer runde", "Be om AI-analyse".

### Data
- `getHandicapEntries()`: Historiske handicap.
- `getAnalyseStats()`: Aggregerte stats.
- `getStrokesGainedData()`: SG per runde og kategori.
- `getTrackManStats()`: TrackMan-aggregater (kun PRO).

### Brukerflyt
1. Spilleren går til `/portal/analyse`.
2. Scroller gjennom ulike grafer og trender.
3. Identifiserer mønstre (f.eks. "Putting har blitt bedre, men approach har blitt dårligere").
4. Klikker "Be om AI-analyse" for å få en skrevet oppsummering.

---

## 3.19 AI Coach (`/portal/ai-coach`, `/portal/ai-coach/chat`)

### Hva er det?
Plattformens mest avanserte AI-funksjon. En personlig golf-coach drevet av Anthropic Claude Sonnet 4.5.

### Hvordan fungerer det?
**AI Coach Dashboard (`/portal/ai-coach`)**
- **KPI-kort**:
  - Driver speed (siste TrackMan)
  - Konsistensscore (variasjon i slag)
  - Mental trend (7-dagers snitt)
  - DECADE Score (strategi-etterlevelse)
- **Dagens innsikt**: En kort, AI-generert tekst med dagens fokus.
- **Hurtighandlinger**: Knapper til TrackMan, mental scorecard, treningsplan, spill-modul.
- **Modul-forhåndsvisninger**: Små widgets fra andre deler av portalen.

**AI Coach Chat (`/portal/ai-coach/chat`)**
- **Streaming chat-grensesnitt**: Spilleren skriver spørsmål, AI-en svarer i sanntid.
- **System prompt**: AI-en får tilgang til spillerens:
  - Siste 15 runder
  - Treningslogger
  - Aktiv treningsplan
  - TrackMan-sesjoner
  - Turneringer
  - Coaching-historikk
  - Mental scorecard-trender
- **Quick questions**: Forhåndsdefinerte knapper:
  - "Hva bør jeg trene i dag?"
  - "Analyser siste 5 runder"
  - "Hvordan kan jeg forbedre approach?"
  - "Lag en økt for putting"
- **Rate limiting**: Maks antall meldinger per bruker per time for å kontrollere kostnader.

### Data
- `getChatContext()`: Samler all relevant spillerdata til system prompt.
- `getQuickInsight()`: Genererer dagens innsikt.
- `POST /api/portal/ai/chat`: Streaming chat-endepunkt.
- `GET /api/portal/ai/metrics`: Henter KPI-data.
- `GET /api/portal/ai/mental/trends`: Henter mental trend.

### Brukerflyt
1. Spilleren går til `/portal/ai-coach`.
2. Ser KPI-kort og dagens innsikt.
3. Klikker "Start chat" eller går til `/portal/ai-coach/chat`.
4. Skriver et spørsmål (f.eks. "Hvorfor har jeg stagnert i handicap?").
5. AI-en analyserer dataene og gir et personlig, detaljert svar.
6. Spilleren kan stille oppfølgingsspørsmål.

### Tekniske detaljer
- Bruker **Anthropic Claude Sonnet 4.5** via AI SDK.
- Streaming via Vercel AI SDK (`useChat`, `streamText`).
- System prompt er dynamisk generert basert på spillerens data.
- Rate limiting implementert per `userId`.

---

## 3.20 Apper / Marketplace (`/portal/apper`)

### Hva er det?
Et abonnements- og pakke-marked hvor spilleren kan oppgradere, nedgradere, eller aktivere nye moduler.

### Hvordan fungerer det?
- **Abonnementsplaner**:
  - Performance
  - Performance Pro
  - Gruppe
- **Pakker (bundles)**: Kombinasjoner av moduler til rabattert pris.
- **Enkeltapper**: Individuelle moduler som kan kjøpes separat.
- **Aktive abonnementer**: Viser nåværende plan, neste faktureringsdato, og status.
- **Prøveperiode-info**: Hvis brukeren er i prøveperiode, vises nedtelling.

**Handlinger**
- Velg abonnement (månedlig/årlig fakturering).
- Aktiver gratis moduler.
- "Administrer abonnement" — åpner Stripe Customer Portal.

### Data
- `getApperPageData()`: Henter planer, pakker, og brukerens aktive abonnement.
- Stripe Product/Price IDs.
- `UserSubscription`-tabell: `status`, `tier`, `currentPeriodStart`, `currentPeriodEnd`.

### Brukerflyt
1. Spilleren går til `/portal/apper`.
2. Ser tilgjengelige planer.
3. Velger en plan og faktureringsperiode.
4. Klikker "Velg".
5. Redirect til Stripe Checkout.
6. Etter betaling: redirect tilbake til portalen.

---

## 3.21 Bag / Klubber (`/portal/bag`)

### Hva er det?
Digital representasjon av spillerens golfbag, med avstander, gap-analyse, og anbefalinger.

### Hvordan fungerer det?
- **Visuell bag**: Alle klubbene vises i en bag-illustrasjon eller liste.
- **Valgt klubb**: Detaljer:
  - Carry
  - Total avstand
  - Antall slag registrert
  - Loft
  - Merke
  - Modell
- **Avstandsoversikt**: Horisontale barer som viser carry per klubb.
- **Gap-analyse**: Identifiserer hull mellom klubber (f.eks. "Du har et 15m hull mellom 7-jern og 5-jern").
- **Anbefalinger**: Forslag til klubber som kan fylle gap.

**Handlinger**
- **Legg til klubb**: Velg fra standardliste (Driver, 3-wood, 5-iron, etc.), merke, modell, carry.
- **Fjern klubb**: Sletter klubb fra bagen.

### Data
- `getPlayerBag()`: Henter klubber + `gapAnalysis`.
- `Club`-tabell: standardklubber.
- `PlayerBag`-tabell: brukerens klubber med `carry`, `brand`, `model`.

### Brukerflyt
1. Spilleren går til `/portal/bag`.
2. Ser sin nåværende bag.
3. Klikker "Legg til klubb".
4. Velger klubbtype, merke, modell, og carry.
5. Ser oppdatert bag og gap-analyse.

---

## 3.22 Abonnement (`/portal/abonnement`)

### Hva er det?
En dedikert side for administrasjon av spillerens abonnement.

### Hvordan fungerer det?
- **Nåværende plan**: Navn og pris.
- **Økter denne perioden**: Progress bar som viser brukt/gjenstående økter.
- **Kommende bookinger**: Liste over bookinger som er dekket av abonnementet.
- **Utløpsdato**: Når gjelder abonnementet til.
- **Bookingsvindu**: Hvor langt frem i tid spilleren kan booke.

**Handlinger**
- **Oppgrader abonnement**: Går til `/portal/apper`.
- **Administrer i Stripe**: Åpner Stripe Customer Portal for å endre betalingsmetode, se fakturaer, etc.
- **Avbryt abonnement**: Starter avbestillingsprosessen.
- **Book en økt**: Snarvei til booking.

### Data
- `getSubscriptionData()`: Henter `UserSubscription`, `SubscriptionQuota`, og kommende abonnements-bookinger.

### Brukerflyt
1. Spilleren går til `/portal/abonnement`.
2. Ser forbruk og gjenstående økter.
3. Klikker "Administrer i Stripe" for å se fakturaer.
4. Eller klikker "Oppgrader" for å bytte til en større plan.

---

## 3.23 Turneringer (`/portal/turneringer`)

### Hva er det?
Oversikt over golfturneringer — både spillerens egne planlagte turneringer og proffturneringer.

### Hvordan fungerer det?
- **Mine turneringer**: Planlagte turneringer med mål, prioritet, påmeldingsstatus.
- **Alle turneringer**: Filtrerbar liste/kalender over alle turneringer i systemet.
- **Pro Tour**: PGA Tour og DP World Tour schedule hentet fra DataGolf.
- **Nivå-badges**: Nasjonal, regional, lokal, internasjonal.
- **Påmeldingsfrister**: Tydelig markering av frister.

**Handlinger**
- Filtrer på nivå.
- List/kalender view toggle.
- Klikk på turnering → detalj-modal.
- **Meld deg på** turnering.
- Sett måltype: prestasjon, læring, opplevelse.
- Sett prioritet: A/B/C.
- Legg til notater.

### Data
- `getTournamentsWithPlans()`: Henter turneringer + spillerens planer.
- DataGolf: PGA/Euro schedule.
- `Tournament`-tabell: `name`, `date`, `location`, `level`, `series`, `holes`.
- `TournamentPlan`-tabell: `userId`, `tournamentId`, `goalType`, `priority`, `notes`, `registered`.

### Brukerflyt
1. Spilleren går til `/portal/turneringer`.
2. Ser kommende turneringer.
3. Klikker på en turnering.
4. Velger måltype og prioritet.
5. Klikker "Meld meg på".

---

## 3.24 Turneringsplan (`/portal/turneringsplan`)

### Hva er det?
En sesongbasert oversikt over spillerens turneringsplan.

### Hvordan fungerer det?
- **Sesong 2026 oversikt**.
- **Stat-kort**: Kommende, Påmeldt, Fullført.
- **Tabs**: Kommende / Påmeldt / Resultater.
- **Turneringsliste**: Dato, sted, nivå, serie, hull, mål, notater.

**Handlinger**
- **Meld meg på** turnering.
- Se ekstern turneringslenke.
- Utvid detaljer.

### Data
- `getPlayerTournaments()`: Henter spillerens `TournamentPlan`-rader.

### Brukerflyt
1. Spilleren går til `/portal/turneringsplan`.
2. Ser sin sesongplan.
3. Klikker "Meld meg på" for en kommende turnering.
4. Fyller ut mål og notater.

---

## 3.25 Strategi (`/portal/strategi`)

### Hva er det?
Et verktøy for å studere bane-strategi hull for hull, med DECADE-anbefalinger.

### Hvordan fungerer det?
- **Bane-velger**: Dropdown med alle baner i systemet.
- **Hull-for-hull navigasjon**: Knapper for hull 1–18, eller forrige/neste.
- **Hull-info**: Par, lengde, handicap-indeks.
- **DECADE Strategi**:
  - Anbefalt klubb
  - Aimpoint
  - Målsone (illustrert)
  - Fareområder (vann, bunkere, OOB)
- **Pre-shot rutine**: 4 steg med forklaring.
- **Dispersion-visualisering**: Fairway, target line, spredningsellipse basert på spillerens data.

### Data
- `GET /api/portal/courses`: Henter alle baner.
- `GET /api/portal/courses/[id]/holes`: Henter hull-data + DECADE-strategi.
- `Course`-tabell: `name`, `location`.
- `Hole`-tabell: `number`, `par`, `length`, `handicapIndex`.
- `HoleStrategy`-tabell: `recommendedClub`, `aimPoint`, `targetZone`, `hazards`.

### Brukerflyt
1. Spilleren går til `/portal/strategi`.
2. Velger bane.
3. Klikker gjennom hull 1–18.
4. Studerer DECADE-strategien for hvert hull.
5. Bruker pre-shot rutine under neste runde.

---

## 3.26 Onboarding (`/portal/onboarding`)

### Hva er det?
En wizard for nye brukere som hjelper dem med å sette opp profilen og målene sine.

### Hvordan fungerer det?
- **Steg 1**: Velkomst og introduksjon.
- **Steg 2**: Målsetting — hva vil spilleren oppnå? (f.eks. "Komme under 10 i handicap", "Være mer konsekvent").
- **Steg 3**: Treningsfrekvens — hvor ofte kan spilleren trene?
- **Steg 4**: Fullfør og gå til dashboard.

**Handlinger**
- Fullfør onboarding.
- Hopp over onboarding.

### Data
- `checkOnboardingStatus()`: Sjekker om brukeren har fullført onboarding.
- `saveOnboardingData()`: Lagrer mål og treningsfrekvens.
- `OnboardingStatus`-tabell: `completed`, `step`, `data`.

### Brukerflyt
1. Ny bruker registrerer seg.
2. Redirect til `/portal/onboarding`.
3. Går gjennom stegene.
4. Fullfører og kommer til dashboard.

---

## 3.27 Portal-navigasjon (Sidebar)

### Hva er det?
Fast venstre-sidebar som gir tilgang til alle portal-funksjoner.

### Hvordan fungerer det?
**Hovedmeny**
1. **Oversikt** → `/portal`
2. **Planlegg** → `/portal/treningsplan`
   - Inkluderer også `/portal/bookinger`, `/portal/kalender`, `/portal/periodisering`
3. **Tren** → `/portal/dagbok`
   - Inkluderer også `/portal/trening`, `/portal/tester`
4. **Spill** → `/portal/runde`
   - Inkluderer også `/portal/turneringer`, `/portal/spill`, `/portal/turneringsplan`, `/portal/bag`
5. **Analyser** → `/portal/statistikk`
   - Inkluderer også `/portal/analyse`, `/portal/benchmark`, `/portal/trackman`, `/portal/sammenligning`, `/portal/ai-coach`, `/portal/coaching-historikk`

**Andre elementer**
- **Ny økt-knapp** (nederst): Rask snarvei til `/portal/bookinger/ny`.
- **Logg ut**: Logger ut fra Supabase Auth.
- **Mission Control**: Kun synlig for `staff`/`admin`. Lenker til `/admin`.
- **Profilkort**: Nederst i sidebar. Viser navn og abonnementstier.
- **Notification bell**: Øverst i sidebar. Viser antall uleste notifikasjoner.

### Tekniske detaljer
- Bygget i `components/portal/layout/sidebar.tsx`.
- Bruker `usePathname()` for å markere aktivt menypunkt.
- Mobilversjon: Slide-out drawer med `AnimatePresence`.

---

# DEL 4: MISSION BOARD / ADMIN

## Introduksjon til Mission Board

Mission Board (også kalt "Admin" eller "Mission Control") er administrasjonsgrensesnittet for instruktører og administratorer i AK Golf Academy. Det er bygget med en egen visuell profil — mørkere, mer datatett, med tabeller, grafer, drawere og kalendere.

**Tilgangskontroll (RBAC)**
| Ressurs | Tillatte roller |
|---------|-----------------|
| Hub, Kalender, Fasiliteter | ADMIN, INSTRUCTOR, INVITED |
| Bookinger, Elever, Meldinger | ADMIN, INSTRUCTOR |
| Agenter, Økonomi, Rapporter | ADMIN |

Alle admin-sider er beskyttet av `canAccessMissionControl()` i `lib/portal/rbac.ts`.

---

## 4.1 Hub / Oversikt (`/admin`)

### Hva er det?
Dashboardet for instruktører og administratorer. Gir en rask oversikt over dagens virksomhet.

### Hvordan fungerer det?
**Top-bar**
- Tittel: "Hub — Oversikt"
- Undertittel: Dagens dato (f.eks. "Tirsdag 15. april 2026")
- Meny-knapp (åpner sidebar på mobil)
- Brukerprofil og notifikasjonsbadge

**Alerts**
- En rad med badges som viser viktige hendelser:
  - "3 ventende bookinger"
  - "1 elev trenger oppfølging"
  - "Kalender-synk feilet"

**Stats Grid (4 kort)**
- **Økter i dag**: Antall bookinger i dag + sparkline (siste 14 dager).
- **Aktive elever**: Totalt antall aktive elever + sparkline.
- **Ventende bookinger**: PENDING-bookinger + sparkline.
- **Omsetning MTD**: Månedens omsetning hittil + sparkline.

**Kapasitet + Tier + Handicap**
- **Kapasitetsutnyttelse**: Gauge-chart som viser fylte plasser (f.eks. "127 av 150 plasser" = 85%).
- **Elevfordeling per tier**: Donut-chart med Visitor, Academy, Starter, Pro, Elite.
- **Handicap-trend (30 dager)**: Linjediagram som viser gjennomsnittlig handicap for alle aktive elever.

**Dagens timeplan**
- En tidslinje som kombinerer sessjoner fra alle divisjoner (Coaching, Junior, GFGK).
- Hver rad viser: tidspunkt, varighet, elevnavn, tjeneste, instruktør, divisjon-badge.
- Hvis aktiv sessjon: grønn "Aktiv"-badge.
- Lenke til full kalender (`/admin/kalender`).

**Sidebar (høyre kolonne)**
- **Snarveier**: "Ny booking", "Send melding", "Legg til elev".
- **Divisjoner**: Coaching, Junior, GFGK — med antall elever per divisjon.
- **Påminnelser**: Action items som krever oppmerksomhet (f.eks. "Skriv notater etter kl 14:00-sessjonen").

### Data
- `getHubData()`: Henter KPI-er, divisjonsdata, alerts, sessjoner, action items.
- `Booking`-tabell: dagens bookinger.
- `User`-tabell: aktive elever.
- `HandicapEntry`-tabell: handicap-trend.

### Brukerflyt
1. Admin/instruktør logger inn på `/admin/login`.
2. Redirect til `/admin` (Hub).
3. Scroller gjennom KPI-er og sjekker dagens timeplan.
4. Klikker på en sessjon for å se detaljer.
5. Bruker snarveier for å opprette ny booking eller sende melding.

---

## 4.2 Mission Board (`/admin/mission-board`)

### Hva er det?
Et visuelt Kanban-board for operasjonell oppfølging av oppgaver, prosjekter og hendelser.

### Hvordan fungerer det?
- **Kolonner**: Typisk "Å gjøre", "Pågår", "Venter", "Fullført".
- **Kort**: Hver oppgave vises som et kort med tittel, ansvarlig, frist, og prioritet.
- **Drag-and-drop**: Admin kan flytte kort mellom kolonner.
- **Filtrering**: Filtrer etter ansvarlig, divisjon, eller prioritet.

### Data
- `MissionBoardTask`-tabell: `title`, `description`, `status`, `assigneeId`, `dueDate`, `priority`, `division`.

### Brukerflyt
1. Admin går til `/admin/mission-board`.
2. Ser alle pågående oppgaver.
3. Flytter en oppgave fra "Å gjøre" til "Pågår".
4. Klikker på et kort for å redigere detaljer.

---

## 4.3 Denne uken (`/admin/denne-uken`)

### Hva er det?
En ukeoversikt spesifikt designet for instruktører som skal forberede seg til kommende sessjoner.

### Hvordan fungerer det?
- **Ukekalender**: Viser alle sessjoner for uken.
- **Forberedelsesliste**: For hver sessjon kan instruktøren:
  - Se elevprofil
  - Se forrige coaching-notater
  - Merke at de har forberedt seg
- **Action items**: Oppgaver som må gjøres denne uken.

### Data
- `getThisWeekBookings()`: Henter bookinger for inneværende uke.
- `CoachingSession`-tabell: historiske notater.

### Brukerflyt
1. Instruktøren går til `/admin/denne-uken` søndag kveld eller mandag morgen.
2. Går gjennom ukens sessjoner.
3. Klikker på hver elev for å lese historikk og notater.
4. Markerer forberedelser som fullført.

---

## 4.4 Focus (`/admin/focus`)

### Hva er det?
Et task-management-system for personlig og team-basert fokus.

### Hvordan fungerer det?
- **Oppgaveliste**: Dagens fokus-oppgaver.
- **Prioritering**: Hver oppgave har en prioritet (P1, P2, P3).
- **Create Task Dialog**: Modal for å opprette nye oppgaver med tittel, beskrivelse, frist, og ansvarlig.
- **Fullføring**: Checkbox for å markere oppgaver som fullført.

### Data
- `FocusTask`-tabell: `title`, `description`, `priority`, `dueDate`, `assigneeId`, `completed`, `createdAt`.

### Brukerflyt
1. Admin/instruktør går til `/admin/focus`.
2. Ser dagens oppgaver.
3. Klikker "Ny oppgave".
4. Fyller ut detaljer og lagrer.
5. Markerer oppgaver som fullført etter hvert.

---

## 4.5 Kalender (`/admin/kalender`)

### Hva er det?
En fullverdig administrasjonskalender for alle bookinger og hendelser.

### Hvordan fungerer det?
**Kontroller**
- **Navigasjon**: Forrige/neste måned-knapper. "I dag"-knapp.
- **Visningsmodus**: Måned, Uke, Dag (tabs).
- **Instruktør-filter**: Dropdown for å filtrere på én instruktør.
- **Filter-knapp**: Avanserte filtre.
- **Ny hendelse**: Åpner dialog for å opprette blokkert tid.

**Kalender-grid**
- 7 kolonner (man–søn).
- Hver celle viser dato og opptil 3 booking-hendelser.
- Hendelser vises som små tags med tidspunkt og elev/tjeneste.
- "+X flere" hvis flere enn 3 hendelser.
- Dagens dato er fremhevet med svart sirkel.
- Klikk på en celle for å se alle hendelser for den dagen i sidepanelet.

**Sidepanel (høyre)**
- **Valgt dato**: Liste over alle bookinger for valgt dato.
- Hver booking viser: tidspunkt, varighet, tjeneste, elev, instruktør, lokasjon, status-badge.
- **Quick actions** per booking: Se detaljer, legg til notat, merk som ikke møtt.
- **Legg til hendelse**: Knapp for å blokkere tid.
- **Status-legend**: Visuell forklaring av fargene.

**Aktivitet-heatmap**
- En heatmap som viser antall bookinger per ukedag × klokkeslett (08–20).
- Tooltip: "Tirsdag kl 10:00 — 5 bookinger".

**Dialoger / Drawere**
- **Admin-notat-dialog**: Tekstfelt for interne notater på en booking.
- **Ny hendelse-dialog**: Tittel, dato, starttid, sluttid, notat. Oppretter en `BlockedTime`.
- **Booking detail drawer**: Full oppsummering av booking med elevinfo, tid, lokasjon, admin-notater.

### Data
- `getBookingsForPeriod(start, end, instructorId?)`: Henter bookinger for valgt periode.
- `getBookingsForDay(date, instructorId?)`: Henter bookinger for én dag.
- `getBookingsForWeek(date, instructorId?)`: Henter bookinger for én uke.
- `markNoShow(bookingId)`: Oppdaterer status til `NO_SHOW`.
- `addAdminNote(bookingId, note)`: Lagrer internt notat.
- `createBlockedTime(data)`: Oppretter blokkert tid.

### Brukerflyt
1. Admin går til `/admin/kalender`.
2. Blar til neste måned for å planlegge.
3. Klikker på en dag for å se detaljer.
4. Klikker på en booking for å åpne drawer.
5. Legger til et admin-notat.
6. Klikker "Ny hendelse" for å blokkere tid til et møte.

---

## 4.6 Bookinger (`/admin/bookinger`)

### Hva er det?
En avansert administrasjonsliste over alle bookinger med søk, filtre, bulk-actions og eksport.

### Hvordan fungerer det?
**Stats-kort (øverst)**
- I dag
- Bekreftet
- Venter
- Omsetning i dag

**Kontrollpanel**
- **Søk**: Tekstfelt for å søke etter elevnavn, e-post, eller tjeneste.
- **Visningsmodus**: Dag / Liste (toggle).
- **Datofilter**: Date-picker.
- **Handlings-dropdown**: "Eksporter CSV", "Send påminnelse (dagens)".
- **Ny booking**: Knapp som går til `/admin/bookinger/ny`.
- **Status-filter pills**: Alle, Bekreftet, Venter, Avbestilt.

**Dag-visning**
- Liste over bookinger for valgt dato.
- Hver rad viser: tidspunkt, varighet, tjeneste, status-badge, fokusområde-badge, elevnavn, instruktørnavn, beløp.
- Klikk på rad for å åpne `BookingDetailDrawer`.

**Liste-visning**
- `AdminDataTable` med kolonner: Tidspunkt, Elev, Tjeneste, Instruktør, Status, Beløp.
- **Sortering**: Klikk på kolonneheader for å sortere.
- **Paginering**: 15 rader per side.
- **Bulk actions**: "Send påminnelse", "Avbestill valgte".
- **On-row-click**: Åpner detail drawer.

**Booking Detail Drawer**
- Full booking-informasjon.
- `SessionPlanPanel`: Viser planlagt fokus og øvelser for sessjonen.
- Knapper for å redigere, avbestille, eller sende påminnelse.

### Data
- `searchBookings(query, status?, page?)`: Server action for søk.
- `bulkCancelBookings(ids[])`: Avbestiller flere bookinger.
- `bulkSendReminder(ids[])`: Sender påminnelser.
- `AdminBooking`-type: `id`, `startTime`, `status`, `amount`, `User`, `ServiceType`, `Instructor`, `focusArea`.

### Brukerflyt
1. Admin går til `/admin/bookinger`.
2. Søker etter en elev.
3. Filtrerer på "Venter" for å se ubekreftede bookinger.
4. Velger flere rader og klikker "Send påminnelse".
5. Klikker på en booking for å se detaljer og eventuelt avbestille.

---

## 4.7 Ny booking (`/admin/bookinger/ny`)

### Hva er det?
En manuell booking-opprettelse for administratorer.

### Hvordan fungerer det?
- **Elev-velger**: Søk etter eksisterende elev eller opprett ny gjestebruker.
- **Tjeneste-velger**: Dropdown med alle aktive tjenester.
- **Instruktør-velger**: Dropdown med instruktører.
- **Dato- og tidsvelger**: Kalender + time slots.
- **Notater**: Interne notater for sessjonen.
- **Bypass-validering**: Admin kan overstyre `minNoticeHours` og `maxAdvanceDays`.

### Data
- `getActiveStudents()`: Henter elever.
- `getServiceTypes()`: Henter tjenester.
- `getInstructors()`: Henter instruktører.
- `getAvailableSlots()`: Henter slots.
- `createAdminBooking(data)`: Oppretter booking med `isAdmin: true`.

### Brukerflyt
1. Admin går til `/admin/bookinger/ny`.
2. Søker etter elev.
3. Velger tjeneste, instruktør, dato, tid.
4. Legger til interne notater.
5. Klikker "Opprett booking".
6. Bekreftelse sendes til elev på e-post.

---

## 4.8 Godkjenninger (`/admin/godkjenninger`)

### Hva er det?
En kø av hendelser som venter på godkjenning før de blir aktive.

### Hvordan fungerer det?
- Liste over pending items:
  - Nye elevregistreringer
  - Booking-endringer
  - Treningsplan-endringer
  - Refusjonsforespørsler
- Hver rad viser: type, dato, beskrivelse, ansvarlig.
- **Godkjenn / Avslå**: To knapper per rad.
- Notat-felt for å dokumentere beslutning.

### Data
- `getPendingApprovals()`: Henter items som krever godkjenning.
- `approveItem(id, notes)`: Godkjenner.
- `rejectItem(id, notes)`: Avslår.

### Brukerflyt
1. Admin går til `/admin/godkjenninger`.
2. Ser køen av pending items.
3. Klikker "Godkjenn" på en ny elevregistrering.
4. Legger til et notat og bekrefter.

---

## 4.9 Tilgjengelighet (`/admin/tilgjengelighet`)

### Hva er det?
Administrasjon av instruktørers tilgjengelighet og blokkerte tider.

### Hvordan fungerer det?
- **Instruktør-velger**: Velg instruktør.
- **Ukentlig timeplan**: Standard arbeidstider per ukedag.
- **Unntak**: Spesifikke datoer med avvikende tider.
- **Blokkerte tider**: Liste over allerede blokkerte perioder.
- **Legg til blokkering**: Dato, starttid, sluttid, årsak.

### Data
- `InstructorAvailability`-tabell: `instructorId`, `dayOfWeek`, `startTime`, `endTime`.
- `InstructorDateAvailability`-tabell: `instructorId`, `date`, `startTime`, `endTime`, `isAvailable`.
- `BlockedTime`-tabell: `instructorId`, `startTime`, `endTime`, `reason`.

### Brukerflyt
1. Admin går til `/admin/tilgjengelighet`.
2. Velger en instruktør.
3. Setter standard arbeidstider.
4. Legger til en blokkering for ferie.

---

## 4.10 Kapasitet (`/admin/kapasitet`)

### Hva er det?
Oversikt over kapasitetsutnyttelse og verktøy for å justere kapasiteten.

### Hvordan fungerer det?
- **Kapasitetsoversikt**: Gauge og tall for nåværende utnyttelse.
- **Tabs**: Ulike visninger (dag, uke, måned).
- **Uke-justering**: Admin kan justere maks kapasitet for spesifikke uker (f.eks. øke i sommerferien).
- **Varsler**: Systemet varsler når kapasitet nærmer seg 90%.

### Data
- `getCapacityData()`: Henter booking-volum og maks kapasitet.
- `updateWeekCapacity(week, newCapacity)`: Justerer kapasitet.

### Brukerflyt
1. Admin går til `/admin/kapasitet`.
2. Ser at neste uke er 95% full.
3. Justerer maks kapasitet for den uken.
4. Eller åpner for ekstra tidslots.

---

## 4.11 Elever (`/admin/spillere`)

### Hva er det?
En fullstendig elevadministrasjon med søk, filtre, bulk-actions og hurtigvisning.

### Hvordan fungerer det?
**Stats-kort**
- Totalt
- Aktive
- Nye denne måneden
- Trenger oppfølging (at-risk)

**Filter-panel**
- **Status-filter**: Alle, Aktive, Inaktive, Oppfølging.
- **Medlemskap-filter**: Alle, Elite, Pro, Starter, Academy, Visitor.

**DataTable**
- Kolonner: Navn (med profilbilde), Medlemskap, Status, HCP, Kategori, Økter/mnd, Sist aktiv, Neste booking, Plan (ja/nei-ikon).
- **Sortering**: Klikk på kolonneheader.
- **Paginering**: 20 rader per side.
- **Søk**: Tekstfelt over tabellen.
- **Bulk actions**: "Send e-post", "Eksporter valgte".
- **On-row-click**: Åpner hurtigvisning-drawer.

**Hurtigvisning-drawer**
- Stort profilbilde/initialer.
- Badges: Medlemskap, Status, Kategori.
- Kontaktinfo (e-post, telefon).
- Stats: Handicap, Økter denne mnd, Sist aktiv.
- Neste booking-boks.
- Treningsplan-boks (aktiv / ingen plan).
- Knapper: "Send melding", "Åpne profil".

### Data
- `getStudents()`: Henter alle elever med aggregerte felter.
- `StudentRow`-type: `id`, `name`, `email`, `phone`, `subscriptionTier`, `isActive`, `handicap`, `category`, `sessionsThisMonth`, `lastActiveAt`, `nextBookingDate`, `hasActivePlan`.

### Brukerflyt
1. Admin går til `/admin/spillere`.
2. Filtrerer på "Oppfølging" for å se elever som ikke har vært aktive på 30+ dager.
3. Klikker på en elev for å se hurtigvisning.
4. Klikker "Åpne profil" for full detalj.

---

## 4.12 Elevprofil (`/admin/spillere/[id]`)

### Hva er det?
En omfattende profilside for én enkelt elev, sett fra instruktørens/administratorens perspektiv.

### Hvordan fungerer det?
**Tabs**
1. **Oversikt**
   - Profilinfo (navn, kontakt, medlemskap, status).
   - Handicap-trend (linjediagram, siste 12 måneder).
   - HCP-endring (fra første til siste måling).
   - Treningsvolum (bar-chart, siste 8 måneder).
   - Aktivitetstimeline (siste bookinger + coaching-økter).
   - Mål (progress rings for aktive mål).
2. **Treningsdata** (`TrainingDataTabs`)
   - TrackMan-sesjoner
   - Runde-historikk
   - Treningslogger
   - Statistikk
3. **Bookinger**
   - Full booking-historikk.
   - Knapper for å opprette ny booking.
4. **Treningsplan**
   - Aktiv plan med ukevisning.
   - Knapper for å generere ny plan eller redigere eksisterende.
5. **Meldinger**
   - Chat-historikk med eleven.
   - Send ny melding.

**Handlinger**
- "Send melding": Starter eller åpner samtale.
- "Rediger profil": Endrer elevdata.
- "Opprett booking": Snarvei til ny booking med forhåndsvalgt elev.

### Data
- `getStudentProfile(id)`: Henter full profil med relasjoner.
- `Profile`-type inkluderer: `User`, `HandicapEntry[]`, `Booking[]`, `CoachingSession[]`, `Goal[]`, `TrainingPlan[]`.

### Brukerflyt
1. Admin går til `/admin/spillere/[id]`.
2. Studerer handicap-trenden.
3. Går til "Treningsdata"-tab for å se siste TrackMan-sesjon.
4. Klikker "Send melding" for å følge opp eleven.

---

## 4.13 Coaching-notater (`/admin/okter`)

### Hva er det?
Oversikt over alle coaching-økter med mulighet for å skrive og redigere notater.

### Hvordan fungerer det?
- Liste over coaching-økter sortert etter dato.
- Hver rad viser: dato, elev, instruktør, hovedfokus, status (notater skrevet / ikke skrevet).
- **Skriv notater**: Åpner en rik tekst-editor.
- **Generer AI-oppsummering**: Knapp som bruker AI til å strukturere notatene.
- **Filtrering**: Per instruktør, per elev, per dato.

### Data
- `getCoachingSessions()`: Henter alle sessjoner.
- `updateCoachingNotes(id, notes)`: Lagrer notater.
- `generateAiSummary(sessionId)`: Genererer AI-oppsummering.

### Brukerflyt
1. Instruktøren går til `/admin/okter` etter en dag med sessjoner.
2. Ser at to økter mangler notater.
3. Klikker "Skriv notater".
4. Skriver oppsummering av sessjonen.
5. Klikker "Generer AI-oppsummering" for å få et strukturert sammendrag.

---

## 4.14 Treningsplaner (`/admin/treningsplan`)

### Hva er det?
Administrasjon av elev-treningsplaner.

### Hvordan fungerer det?
- **Oversikt**: Liste over alle aktive treningsplaner per elev.
- **Elev-velger**: Filtrer på elev.
- **Ukevisning**: Se planen uke for uke.
- **Ny plan-wizard** (`/admin/treningsplan/ny`):
  - Velg elev.
  - Velg varighet (4, 8, 12 uker).
  - Velg fokusområder.
  - **Drill-picker**: Velg øvelser fra biblioteket.
  - AI-generer plan (valgfritt).
  - Manuelt dra økter i kalenderen.

### Data
- `getTrainingPlans()`: Henter planer.
- `getExerciseLibrary()`: Henter øvelser.
- `createTrainingPlan(data)`: Oppretter plan.

### Brukerflyt
1. Instruktøren går til `/admin/treningsplan`.
2. Klikker "Ny plan".
3. Velger elev og varighet.
4. Velger øvelser fra drill-picker.
5. Justerer ukeplanen.
6. Lagrer og eleven ser planen i portalen.

---

## 4.15 Turneringer (`/admin/turneringer`)

### Hva er det?
Administrasjon av turneringer som elevene kan melde seg på.

### Hvordan fungerer det?
- **Turneringsliste**: Alle turneringer med dato, sted, nivå, antall påmeldte.
- **Add Tournament Form**: Modal for å opprette ny turnering.
  - Navn, dato, sted, nivå, serie, ekstern lenke.
- **Tournament Admin List**: Liste med rediger/slett-knapper.
- **Påmeldingsliste**: Se hvem som er påmeldt per turnering.

### Data
- `getTournaments()`: Henter turneringer.
- `createTournament(data)`: Oppretter turnering.
- `getTournamentRegistrations(tournamentId)`: Henter påmeldte.

### Brukerflyt
1. Admin går til `/admin/turneringer`.
2. Klikker "Ny turnering".
3. Fyller ut detaljer og lagrer.
4. Turneringen vises i portalen for elevene.

---

## 4.16 Meldinger (`/admin/meldinger`)

### Hva er det?
Chat-grensesnitt for kommunikasjon mellom instruktører/admin og elever.

### Hvordan fungerer det?
- **Samtaleliste**: Venstre sidepanel med alle samtaler.
  - Sortert etter siste melding.
  - Uleste samtaler er fremhevet.
  - Viser elevnavn, siste melding-utdrag, tidspunkt.
- **Chat-vindu**: Høyre side.
  - Meldingshistorikk.
  - Tekstfelt for ny melding.
  - Filvedlegg-støtte (hvis implementert).
- **Start ny samtale**: Søk etter elev, start samtale.

### Data
- `getConversations()`: Henter alle samtaler.
- `getMessages(conversationId)`: Henter meldinger.
- `sendMessage(conversationId, content)`: Sender melding.
- `getOrCreateConversation(userId)`: Finner eller oppretter samtale.

### Brukerflyt
1. Instruktøren går til `/admin/meldinger`.
2. Velger en samtale fra listen.
3. Skriver et svar.
4. Mottar svar fra eleven i sanntid.

---

## 4.17 E-postmaler (`/admin/e-postmaler`)

### Hva er det?
Administrasjon av e-postmaler som sendes automatisk fra systemet.

### Hvordan fungerer det?
- **Malleliste**: Alle maler med navn, beskrivelse, sist endret.
- **Rediger mal**: Rik tekst-editor med variabler (f.eks. `{{userName}}`, `{{bookingDate}}`).
- **Forhåndsvisning**: Se malen med eksempeldata.
- **Testsend**: Send test-e-post til seg selv.

### Data
- `getEmailTemplates()`: Henter maler.
- `updateEmailTemplate(id, content)`: Lagrer endringer.

### Brukerflyt
1. Admin går til `/admin/e-postmaler`.
2. Klikker på "Booking bekreftelse"-malen.
3. Redigerer teksten.
4. Klikker "Forhåndsvis".
5. Lagrer endringene.

---

## 4.18 Push-varsler (`/admin/notifications`)

### Hva er det?
Administrasjon av push-notifikasjoner til app/portal.

### Hvordan fungerer det?
- **Oversikt**: Liste over sendte, planlagte, og utkast-notifikasjoner.
- **Ny notifikasjon**:
  - Tittel, melding, målgruppe (alle, spesifikke elever, tier).
  - Planlagt sendetidspunkt eller umiddelbar sending.
- **Målgruppe-segmentering**:
  - Alle elever
  - Spesifikk tier
  - Spesifikke elever
  - Inaktive elever (win-back)

### Data
- `getNotifications()`: Henter notifikasjoner.
- `sendNotification(data)`: Sender push.
- `scheduleNotification(data)`: Planlegger push.

### Brukerflyt
1. Admin går til `/admin/notifications`.
2. Klikker "Ny varsling".
3. Skriver tittel og melding.
4. Velger målgruppe "Alle aktive elever".
5. Klikker "Send nå".

---

## 4.19 AI-assistent (`/admin/ai-assistent`)

### Hva er det?
En AI-chat for administratorer som kan hjelpe med analyse, oppsummeringer og beslutningsstøtte.

### Hvordan fungerer det?
- **Streaming chat-grensesnitt**.
- **System prompt** gir AI-en tilgang til aggregerte data:
  - Dagens bookinger
  - Elev-statistikk
  - Økonomiske tall
  - Kapasitet
- **Quick questions**:
  - "Hvilke elever trenger oppfølging?"
  - "Hva er omsetningen denne måneden?"
  - "Analyser kapasitetsutnyttelsen"

### Data
- `getAdminChatContext()`: Samler admin-relevant data.
- `POST /api/admin/ai/chat`: Streaming chat-endepunkt.

### Brukerflyt
1. Admin går til `/admin/ai-assistent`.
2. Skriver: "Hvilke elever har ikke booket på over 30 dager?"
3. AI-en analyserer dataene og returnerer en liste med navn og siste aktivitet.

---

## 4.20 Agenter (`/admin/agenter`)

### Hva er det?
Oversikt over AI-agenter og automatiserte arbeidsflyter i systemet.

### Hvordan fungerer det?
- **Agent-liste**: Navn, beskrivelse, status (aktiv/pauset), siste kjøring, neste kjøring.
- **Eksempler på agenter**:
  - AI Insight Agent (ukentlig innsikt)
  - Win-back Agent (inaktive elever)
  - Booking Reminder Agent
  - No-show Handler Agent
- **Logg**: Se hva hver agent har gjort.
- **Start/stop**: Aktiver eller deaktiver agenter.

### Data
- `getAgents()`: Henter agent-konfigurasjoner.
- `toggleAgent(id, active)`: Aktiverer/deaktiverer.
- `getAgentLogs(agentId)`: Henter kjøringslogger.

### Brukerflyt
1. Admin går til `/admin/agenter`.
2. Ser at "Win-back Agent" sist kjørte i går og sendte 5 e-poster.
3. Klikker på agenten for å se detaljer.
4. Deaktiverer agenten midlertidig.

---

## 4.21 Analytics (`/admin/analytics`)

### Hva er det?
Dashboard med statistikker og grafer for virksomheten.

### Hvordan fungerer det?
- **KPI-kort**: Aktive elever, nye denne måneden, churn rate, gjennomsnittlig HCP-forbedring.
- **Grafer**:
  - Elever over tid (linjediagram)
  - Bookinger per måned (bar-chart)
  - Inntekt per tjeneste (donut-chart)
  - HCP-forbedring per elevkategori
- **Filtrering**: Periodevelger, divisjonsfilter.
- **Eksport**: Last ned rådata som CSV.

### Data
- `getAnalyticsData()`: Henter aggregerte business-metrics.

### Brukerflyt
1. Admin går til `/admin/analytics`.
2. Velger periode "Siste 6 måneder".
3. Studerer grafer for å identifisere trender.
4. Eksporterer data til regneark.

---

## 4.22 Økonomi (`/admin/okonomi`)

### Hva er det?
En økonomisk oversikt med inntekter, ubetalte transaksjoner, refusjoner og måloppnåelse.

### Hvordan fungerer det?
- **År totalt**: Stort tall for årets omsetning.
- **Månedlig trend**: Area chart som viser omsetning per måned.
  - Inkluderer sammenligning med i fjor.
- **Inntekt per tjeneste**: Donut-chart (top 6 tjenester).
- **Måloppnåelse**: Gauge-chart (f.eks. "1 080 000 kr av 1 500 000 kr mål" = 72%).
- **Sparklines**: Daglig, ukentlig, månedlig, årlig trend.
- **Ubetalte transaksjoner**: DataTable med kunde, tjeneste, beløp, dato.
- **Refusjoner**: DataTable med kunde, tjeneste, bruttobeløp, refusjonsdato.
- **Date range picker**: Filtrer data etter egendefinert periode.

### Data
- `getOkonomiData()`: Henter økonomiske aggregater.
- `OkonomiData`-type: `revenue` (dag, uke, måned, år), `monthlyTrend`, `revenueByService`, `unpaidTransactions`, `refunds`.

### Brukerflyt
1. Admin går til `/admin/okonomi`.
2. Sjekker årets omsetning mot målet.
3. Ser at en tjeneste står for 40% av inntekten.
4. Sjekker ubetalte transaksjoner og følger opp.

---

## 4.23 Rapporter (`/admin/rapporter`)

### Hva er det?
En rapportgenerator for ulike typer rapporter.

### Hvordan fungerer det?
- **Rapport-maler**:
  - Månedlig økonomirapport
  - Elevaktivitetsrapport
  - Coaching-rapport
  - TrackMan-rapport
- **Parametre**: Periode, divisjon, instruktør.
- **Forhåndsvisning**: Generer rapport og se i nettleser.
- **Eksport**: PDF eller CSV.

### Data
- `generateReport(type, params)`: Genererer rapport basert på mal og parametre.

### Brukerflyt
1. Admin går til `/admin/rapporter`.
2. Velger "Månedlig økonomirapport".
3. Velger periode.
4. Klikker "Generer".
5. Forhåndsviser og laster ned som PDF.

---

## 4.24 Fasiliteter (`/admin/fasiliteter`)

### Hva er det?
Oversikt over anlegg (fasiliteter) og deres aktiviteter.

### Hvordan fungerer det?
- **Fasilitetsliste**: Kort for hver fasilitet.
  - Navn, lokasjon, kapasitet, status (aktiv/vedlikehold/inaktiv).
- **Dagsplan**: Viser dagens aktiviteter for valgt fasilitet.
- **Booking counts**: Antall bookinger per fasilitet.
- **Innstillinger**: Knapp til `/admin/fasiliteter/innstillinger`.
- **Ny aktivitet**: Knapp til `/admin/fasiliteter/ny-aktivitet`.

**Fasilitetsdetalj**
- Klikk på en fasilitet for å se full timeplan.
- Rediger fasilitetsinfo.

### Data
- `getFacilities()`: Henter fasiliteter.
- `getTodaySchedule()`: Henter dagens aktiviteter.
- `getBookingCounts()`: Henter antall bookinger per fasilitet.
- `Facility`-tabell: `name`, `slug`, `description`, `capacity`, `isActive`, `locationId`.

### Brukerflyt
1. Admin går til `/admin/fasiliteter`.
2. Ser at "GFGK Driving Range" har 12 bookinger i dag.
3. Klikker på fasiliteten for å se timeplan.
4. Klikker "Ny aktivitet" for å legge til en gruppetrening.

---

## 4.25 Admin-navigasjon (Mission Control Sidebar)

### Hva er det?
Fast venstre-sidebar for alle admin-sider.

### Hvordan fungerer det?
**Hub**
- Oversikt
- Mission Board
- Denne uken
- Focus

**Kalender & Bookinger**
- Kalender
- Bookinger
- Godkjenninger
- Tilgjengelighet
- Kapasitet

**Elever & Coaching**
- Elever
- Coaching-notater
- Treningsplaner
- Turneringer

**Kommunikasjon**
- Meldinger
- E-postmaler
- Push-varsler

**AI & Agenter**
- AI-assistent
- Agenter

**Analyse & Økonomi**
- Analytics
- Økonomi
- Rapporter

**Fasiliteter**
- Fasiliteter

### Tekniske detaljer
- Definert i `components/portal/mission-control/mc-nav-config.ts`.
- Bruker `MCLayout` og `MCSidebar`.
- Inkluderer **Command Palette** (`AdminCommandPalette`) med hurtigtast `Cmd+K` / `Ctrl+K` for rask navigasjon.
- Topbar viser tittel, undertittel, brukerprofil, og notifikasjoner.

---

# DEL 5: INTEGRASJONER OG DATAFLYT

## 5.1 Supabase

### Hva er det?
Supabase er plattformens primære backend-as-a-service. Den håndterer database, autentisering, realtidsoppdateringer og fil lagring.

### Hvordan fungerer det?
- **Database**: PostgreSQL-database med Prisma ORM.
- **Auth**: Supabase Auth med e-post/passord, magic link, og OAuth (Google).
- **Realtime**: Sanntidsoppdateringer av meldinger og notifikasjoner.
- **Storage**: Lagring av profilbilder, TrackMan CSV-er, og vedlegg.

### Data
- 50+ tabeller inkludert: `User`, `Booking`, `ServiceType`, `Instructor`, `TrainingPlan`, `TrainingSession`, `Round`, `HoleResult`, `TrackManSession`, `TrackManShot`, `CoachingSession`, `Conversation`, `Message`, `Tournament`, `TournamentPlan`, `Notification`, `Subscription`, `SubscriptionQuota`, `HandicapEntry`, `Goal`, `PlayerBag`, `Club`, `Facility`, `BlockedTime`, `Waitlist`, `EmailTemplate`, `MissionBoardTask`, `FocusTask`, `Agent`, `AgentLog`.

### Brukerflyt
1. Brukeren registrerer seg → konto opprettes i Supabase Auth.
2. En `User`-rad opprettes i databasen med `role: STUDENT`.
3. Ved innlogging: Supabase Auth validerer credentials og returnerer JWT.
4. All portal-data hentes fra Supabase via Prisma.

---

## 5.2 Stripe

### Hva er det?
Stripe håndterer alle betalinger, abonnementer, refusjoner og fakturering.

### Hvordan fungerer det?
- **Checkout Sessions**: Engangsbetalinger for Flex-pakker og drop-in.
- **Customer Portal**: Spilleren kan administrere betalingsmetode og se fakturaer.
- **Subscriptions**: Månedlige abonnementer (Performance, Performance Pro, Start).
- **Webhooks**: Stripe sender webhooks til `/api/webhooks/stripe` for hendelser som:
  - `checkout.session.completed`
  - `invoice.paid`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`

### Dataflyt
1. Brukeren klikker "Betal" i booking-wizard.
2. Server oppretter Stripe Checkout Session.
3. Brukeren fullfører betaling i Stripe.
4. Stripe sender webhook.
5. Server oppdaterer `Booking.status` til `CONFIRMED` og sender e-postbekreftelse.
6. Ved abonnementsfornyelse: webhook trigger `resetQuotaForNewPeriod()`.

### Brukerflyt (spiller)
1. Spilleren går til `/portal/apper`.
2. Velger Performance Pro.
3. Redirect til Stripe Checkout.
4. Betaler.
5. Redirect tilbake til portalen.
6. Abonnementet er nå aktivt.

---

## 5.3 Anthropic (Claude / Sonnet 4.5)

### Hva er det?
Anthropic Claude er plattformens AI-motor. Den driver AI Coach-chat, oppsummeringer, treningsplan-generering og innholdsgenerering.

### Hvordan fungerer det?
- **AI Coach Chat**: Streaming chat via Vercel AI SDK.
- **System Prompt**: Dynamisk generert basert på spillerens komplette datahistorikk.
- **Treningsplan-generering**: Claude genererer strukturerte JSON-planer med uker, økter og øvelser.
- **Coaching-oppsummering**: Claude strukturerer instruktørens notater til lesbare oppsummeringer.

### Dataflyt (AI Coach Chat)
1. Spilleren åpner `/portal/ai-coach/chat`.
2. Frontend kaller `getChatContext()`.
3. Server samler spillerdata: runder, logger, plan, TrackMan, turneringer, coaching.
4. Dataene formateres til en system prompt.
5. Spillerens spørsmål sendes til Anthropic API.
6. Claude genererer svar.
7. Svar streams tilbake til frontend.

### Rate Limiting
- Maks antall meldinger per bruker per time for å kontrollere kostnader.
- Implementert i `/api/portal/ai/chat`.

---

## 5.4 TrackMan

### Hva er det?
TrackMan er en launch monitor som måler ball- og klubbdata. Plattformen integrerer med TrackMan via CSV-import og bilde-OCR.

### Hvordan fungerer det?
**CSV-import**
1. Spilleren laster opp en TrackMan CSV-eksport.
2. Server parser filen med en dedikert CSV-parser.
3. Dataene struktureres til `TrackManSession` og `TrackManShot` rader.
4. Aggregater beregnes (snitt, beste, etc.).

**Bilde-OCR**
1. Spilleren tar et bilde av TrackMan-skjermen.
2. Bildet sendes til en AI/OCR-tjeneste.
3. AI-en gjenkjenner TrackMan-layouten og leser tallene.
4. Dataene lagres i databasen.

### Data
- `TrackManSession`: `date`, `facilityId`, `totalShots`, `bestCarry`, `avgCarry`.
- `TrackManShot`: `sessionId`, `club`, `ballSpeed`, `clubSpeed`, `spin`, `launchAngle`, `carry`, `total`.

### Brukerflyt
1. Spilleren går til `/portal/trackman`.
2. Klikker "Last opp CSV".
3. Velger fil.
4. Systemet parser og viser nye data.
5. Spilleren ser klubb-statistikk og trender.

---

## 5.5 Google Calendar

### Hva er det?
To-veis synkronisering mellom AK Golf-bookinger og spillerens Google Calendar.

### Hvordan fungerer det?
1. Spilleren klikker "Koble til Google Calendar" i `/portal/kalender`.
2. OAuth-autentisering mot Google.
3. Server får refresh token og access token.
4. Ved ny booking: server oppretter Google Calendar-event.
5. Ved endring/avbestilling: server oppdaterer/sletter event.
6. Google Calendar webhook håndterer endringer fra Google-siden.
7. iCal-feed (`/api/portal/calendar/feed/[token]`) for andre kalender-apper.

### Data
- `CalendarToken`-tabell: `userId`, `googleRefreshToken`, `googleAccessToken`, `expiresAt`.
- `Booking.googleEventId`: Kobling til Google Calendar-event.

### Brukerflyt
1. Spilleren går til `/portal/kalender`.
2. Klikker "Koble til Google Calendar".
3. Godkjenner i Google-popup.
4. Neste booking vises automatisk i Google Calendar.

---

## 5.6 DataGolf

### Hva er det?
DataGolf er en golfstatistikk-tjeneste som tilbyr data om PGA Tour, DP World Tour, og proffspillere.

### Hvordan fungerer det?
- **Pro Tour schedules**: Henter turneringskalender for PGA Tour og DP World Tour.
- **Proffstatistikk**: Henter Strokes Gained-data for proffspillere.
- **Benchmarking**: Sammenligner spilleren med proffsnittet.

### Data
- `GET https://api.datagolf.com/...` (spesifikke endepunkter ligger i `/lib/portal/datagolf`).
- Cache-lagres i databasen eller via Next.js `unstable_cache`.

### Brukerflyt
1. Spilleren går til `/portal/benchmark`.
2. Søker etter "Viktor Hovland".
3. Systemet henter DataGolf-stats.
4. Radar-chart viser sammenligning.

---

## 5.7 GolfBox

### Hva er det?
GolfBox er en norsk golfplattform som blant annet håndterer handicap.

### Hvordan fungerer det?
- **Handicap-integrasjon**: Henter spillerens offisielle handicap fra GolfBox.
- `GET /api/portal/golfbox/handicap`: Henter og lagrer handicap.

### Data
- `HandicapEntry`-tabell: `userId`, `handicapIndex`, `date`, `source`.

---

## 5.8 Notion

### Hva er det?
Notion brukes som sekundær lagring for player profiles og dokumentasjon.

### Hvordan fungerer det?
- Ved **gjestebooking** (`auto-create-user.ts`): Systemet oppretter automatisk en Notion player profile for nye brukere.
- Notion-sidene brukes til intern dokumentasjon og oppfølging.

### Data
- Notion API-kall via `@notionhq/client`.
- Database ID og properties konfigurert i miljøvariabler.

---

# DEL 6: CRON-JOBS OG AUTOMATISERING

## 6.1 Booking Reminders

### Hva er det?
Automatiske påminnelser sendt 24 timer før en coaching-sesjon.

### Hvordan fungerer det?
- En cron-job kjører hver time.
- Finner alle `CONFIRMED` bookinger med starttid mellom 23 og 25 timer frem i tid.
- Sender SMS og/eller e-post til spilleren.
- Markerer bookingen som "reminder sent" for å unngå duplikater.

### Data
- `Booking`-tabell: `status`, `startTime`, `reminderSentAt`.
- `User`-tabell: `phone`, `email`, `notificationPreferences`.

---

## 6.2 No-Show Handler

### Hva er det?
Automatisk markering av bookinger som `NO_SHOW` når spilleren ikke møter opp.

### Hvordan fungerer det?
- Cron-job kjører hver time.
- Finner alle `CONFIRMED` bookinger hvor `endTime` har passert.
- Hvis instruktøren ikke har manuelt markert som fullført: setter status til `NO_SHOW`.
- Trigger eventuell refusjonsvurdering (0% refusjon for no-show).

### Data
- `Booking`-tabell: `status`, `endTime`.

---

## 6.3 Waitlist Cleanup

### Hva er det?
Rydder opp i utløpte ventelisteposisjoner.

### Hvordan fungerer det?
- Cron-job kjører daglig.
- Finner alle ventelisteposisjoner hvor `expiresAt` har passert.
- Sletter dem eller markerer som `EXPIRED`.
- Hvis det finnes neste person på ventelisten: sender tilbud til dem.

### Data
- `BookingWaitlist`-tabell: `expiresAt`, `status`.

---

## 6.4 Google Calendar Sync

### Hva er det?
En bakgrunnsjobb som synkroniserer bookinger med Google Calendar.

### Hvordan fungerer det?
- Cron-job kjører hvert 15. minutt.
- Sjekker nylig endrede bookinger.
- For hver bruker med aktiv Google Calendar-integrasjon:
  - Oppretter nye events.
  - Oppdaterer endrede events.
  - Sletter avbestilte events.

### Data
- `Booking`-tabell: `status`, `startTime`, `endTime`, `googleEventId`.
- `CalendarToken`-tabell.

---

## 6.5 AI Insights

### Hva er det?
Genererer ukentlig AI-innsikt for hver spiller.

### Hvordan fungerer det?
- Cron-job kjører **mandager kl 06:00**.
- For hver aktiv spiller:
  - Samler siste ukens data: runder, treningslogger, TrackMan, coaching.
  - Sender data til Claude.
  - Claude genererer en strukturert innsikt med `summary`, `strengths[]`, `improvements[]`, `focusTip`.
  - Lagrer resultatet i `AiInsight`-tabellen.
- Innsikten vises på dashboardet og kan sendes som push-notifikasjon.

### Data
- `AiInsight`-tabell: `userId`, `summary`, `strengths`, `improvements`, `focusTip`, `generatedAt`.

---

## 6.6 Win-Back Sequences

### Hva er det?
Automatiske e-post- og SMS-sekvenser for å reaktivere inaktive elever.

### Hvordan fungerer det?
- Cron-job kjører daglig.
- Identifiserer elever som ikke har logget inn, trent, eller booket på X dager (f.eks. 14, 30, 60 dager).
- Sender personalisert melding basert på inaktivitetsperiode.
- Sporer åpninger og klikk.

### Data
- `User`-tabell: `lastActiveAt`, `lastLoginAt`.
- `TrainingLog`-tabell: siste logg.
- `Booking`-tabell: siste booking.

---

## 6.7 Subscription Quota Reset

### Hva er det?
Nullstiller månedlig kvote for abonnementsbrukere.

### Hvordan fungerer det?
- Trigges av Stripe webhook (`invoice.paid`) ved abonnementsfornyelse.
- Kaller `resetQuotaForNewPeriod()`.
- Setter `sessionsUsedThisMonth = 0` og oppdaterer `periodStart` / `periodEnd`.

### Data
- `SubscriptionQuota`-tabell.

---

## 6.8 Health Checks

### Hva er det?
En diagnostisk jobb som sjekker booking-systemets helse.

### Hvordan fungerer det?
- Endepunkt: `/api/health/booking`.
- Sjekker:
  1. Database-tilkobling.
  2. Eksisterende dobbeltbookings.
  3. Utløpte pessimistiske låser.
  4. Metrics (bookinger per dag, avbestillingsrate).
- Admin kan trigge "Cleanup locks" og "Check conflicts" fra health check-siden.

### Data
- `Booking`-tabell: overlappende bookinger.
- `BookingLock`-tabell: utløpte låser.

---

# DEL 7: DATAFLYT-DIAGRAMMER (Tekstbeskrivelser)

## 7.1 Ny booking (v2) — komplett flyt

```
1. Bruker velger trener → UI oppdaterer state.trainerId
2. Bruker velger tjeneste → UI oppdaterer state.serviceId
3. DateTimeDrawer åpnes
4. Bruker velger dato → API-kall: GET /api/booking/slots
5. Server genererer slots basert på InstructorAvailability + eksisterende bookinger
6. Bruker velger tid → state oppdateres
7. ConfirmDrawer åpnes
8. Bruker fyller ut/får forhåndsutfylt info
9. Bruker klikker "Gå til betaling"
10. API-kall: POST /api/booking/create
11. Server: validateBooking() (9 sjekker)
12. Server: createBookingWithConflictCheck() (atomisk transaksjon)
13. Hvis abonnement: consumeSession() → status = CONFIRMED
14. Hvis Stripe: opprett Payment Intent / Checkout Session → status = PENDING
15. Returner bookingId (+ checkout URL hvis Stripe)
16. UI: redirect til /booking/[id]/confirmation
17. Hvis Stripe: PaymentPendingPoller sjekker /api/booking/confirm-payment
18. Stripe webhook mottas → status oppdateres til CONFIRMED
19. E-postbekreftelse sendes
20. Google Calendar-event opprettes (hvis bruker har koblet til)
```

## 7.2 AI Coach Chat — komplett flyt

```
1. Bruker åpner /portal/ai-coach/chat
2. Frontend initialiserer useChat-hook
3. Bruker skriver spørsmål
4. Frontend POST /api/portal/ai/chat
5. Server: rate limiting-sjekk
6. Server: getChatContext(userId)
   - Henter runder, logger, plan, TrackMan, turneringer, coaching
7. Server bygger system prompt
8. Server sender prompt + brukerspørsmål til Anthropic API
9. Anthropic Claude genererer svar
10. Server streams svar tilbake til frontend
11. Frontend viser svar ord for ord
12. Bruker kan stille oppfølgingsspørsmål
```

## 7.3 TrackMan CSV-import — komplett flyt

```
1. Bruker klikker "Last opp CSV" i /portal/trackman
2. Velger TrackMan CSV-fil
3. Frontend POST /api/portal/trackman/upload-csv
4. Server mottar fil
5. Server parser CSV med dedikert parser
6. Server validerer datastruktur
7. Server oppretter TrackManSession-rad
8. Server oppretter TrackManShot-rader (alle slag)
9. Server beregner aggregater (snitt, beste)
10. Returnerer suksess
11. Frontend oppdaterer TrackMan-oversikten
```

## 7.4 Coaching-notater → AI-oppsummering — komplett flyt

```
1. Instruktør skriver notater i /admin/okter
2. Klikker "Generer AI-oppsummering"
3. Frontend POST /api/portal/ai/coaching-summary
4. Server sender notater + elevdata til Anthropic Claude
5. Claude genererer strukturert oppsummering
6. Server lagrer oppsummering i CoachingSession.aiSummary
7. Frontend viser oppsummeringen
8. Elev ser oppsummering i /portal/coaching-historikk
```

---

# DEL 8: TILGANGSNIVÅER OG ROLLER

## 8.1 Roller i systemet

| Rolle | Beskrivelse |
|-------|-------------|
| **STUDENT** | Standard spiller. Har tilgang til spillerportalen. Kan booke, avbestille, endre egne bookinger. |
| **INSTRUCTOR** | Trener. Har tilgang til Mission Board (Hub, Kalender, Bookinger, Elever, Meldinger, Coaching-notater, Treningsplaner, Turneringer). Kan se alle elevers data. Kan ikke se Økonomi, Rapporter, Agenter. |
| **ADMIN** | Administrator. Full tilgang til Mission Board. Kan se økonomi, rapporter, agenter, AI-assistent. Kan overstyre valideringsregler. |
| **INVITED** | Invitert bruker. Begrenset tilgang til Mission Board (typisk kun lesing av Kalender og Fasiliteter). |

## 8.2 Tier-system (abonnement)

| Tier | Beskrivelse |
|------|-------------|
| **VISITOR** | Gratisbruker. Begrenset tilgang. Kan ikke booke abonnementstjenester. |
| **ACADEMY** | Basis-abonnement. Tilgang til standard portal-funksjoner. |
| **STARTER** | Entry-level abonnement. Færre økter per måned. |
| **PRO** | Avansert abonnement. Tilgang til peer-analyse, TrackMan-data i analyse, benchmarking. |
| **ELITE** | Toppnivå. Full tilgang til alle AI-funksjoner, inkludert weakness analysis. |

---

# DEL 9: ANTI-PATTERNER OG BEGRENSNINGER

Basert på kodegjennomgang og dokumentasjon:

1. **Kontaktskjemaet på `/landing/contact`** sender ikke faktisk data til backend. Det er kun en frontend-demo.
2. **Vipps-betaling** er definert i skjemaet men ikke aktivt implementert i alle flyter.
3. **Abonnementsknappene på `/academy`** er deaktivert med "Lanseres mai 2026"-badge. Kun Flex-booking er aktiv.
4. **Meldinger i sosialt-modulen** (`/portal/sosialt`) har en "Send melding"-knapp for venner, men full funksjonalitet er ikke implementert.
5. **Google Calendar i `/portal/kalender`** har visse deler merket som "kommer snart" i UI.

---

# DEL 10: OPPSUMMERING

AK Golf Platform er en **svært omfattende, integrert golf-coaching-plattform** som dekker hele verdikjeden:

- **Markedsføring** → Landingsider som konverterer besøkende til leads
- **Booking** → Avansert timebestilling med Stripe-betaling, abonnementskvote, og konfliktsjekk
- **Spilleropplevelse** → Portal med 28+ funksjonsområder: treningsplan, statistikk, TrackMan, AI Coach, mental scorecard, runde-registrering, turneringer, sosialt nettverk
- **Administrasjon** → Mission Board med 20+ sider for instruktører og administratorer
- **Automatisering** → Cron-jobs for påminnelser, no-shows, AI-innsikt, win-back, og Google Calendar-sync
- **Integrasjoner** → Supabase, Stripe, Anthropic Claude, TrackMan, Google Calendar, DataGolf, GolfBox, Notion

Plattformen er bygget med **Next.js 16, React 19, Tailwind CSS v4, TypeScript, Prisma, og Supabase**. Designet følger en streng designsystem dokumentert i `docs/DESIGN_SYSTEM.md`.

---

*Dette dokumentet er generert fra grundig kartlegging av hele `akgolf-platform`-kodebasen og representerer den mest komplette oversikten over alle brukervendte funksjoner, dataflyter, integrasjoner og automatiseringer per april 2026.*
