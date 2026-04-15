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
