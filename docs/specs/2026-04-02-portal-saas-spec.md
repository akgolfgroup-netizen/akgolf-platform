# AK Golf Portal — Produkt-spesifikasjon

**Dato:** 2026-04-02
**Versjon:** 1.0
**Status:** Godkjent for utvikling

---

## Sammendrag

Standalone SaaS-produkt for golfspesifikk treningsdagbok med AI-analyse. Første produkt i sitt slag tilpasset golf. Mål: 150K MRR innen måned 10.

---

## Forretningsmål

| Metrikk | Mål |
|---------|-----|
| MRR måned 10 | 150 000 kr |
| MRR måned 12 | 188 000 kr |
| Betalende abonnenter | 750-950 |
| Månedlig churn | < 5% |
| CAC | < 200 kr |
| LTV:CAC ratio | > 20:1 |

---

## Målgruppe

### Primær: Dedikerte amatører
- Trener regelmessig (1-3 ganger/uke)
- Vil bli bedre, men har ikke trener
- HCP 10-36
- Frustrert over manglende struktur
- Norge: ~30 000 personer

### Sekundær: Ambisiøse spillere
- Trener 3+ ganger/uke
- Vil ha data og systematikk
- HCP 0-15
- Kan ha trener andre steder

### Geografisk
- År 1: Norge (nasjonalt fra dag 1)
- År 2+: Sverige, Danmark, internasjonalt

---

## Prisstruktur

### Tier-nivåer

| Tier | Pris | Målgruppe |
|------|------|-----------|
| **Gratis** | 0 kr | Prøve produktet, bli kjent |
| **Pro** | 199 kr/mnd | Dedikerte amatører |
| **Pro+** | 299 kr/mnd | Ambisiøse spillere, TrackMan-brukere |

### Årlig rabatt

| Tier | Månedlig | Årlig prepay | Effektiv/mnd | Besparelse |
|------|----------|--------------|--------------|------------|
| Pro | 199 kr | 1 788 kr | 149 kr | 600 kr/år |
| Pro+ | 299 kr | 2 628 kr | 219 kr | 960 kr/år |

### Retention-tilbud (eks-coaching-kunder)

Vises kun ved kansellering av coaching-abonnement, gyldig i 7 dager.

| Plan | Pris | Effektiv/mnd | Rabatt vs. standard |
|------|------|--------------|---------------------|
| 12 mnd prepay | 999 kr | 83 kr | 58% |
| Månedlig | 149 kr/mnd | 149 kr | 25% |

---

## Feature-matrise

| Funksjon | Gratis | Pro | Pro+ |
|----------|--------|-----|------|
| **Treningsdagbok** | | | |
| Logg økter | 4/mnd | Ubegrenset | Ubegrenset |
| Historikk | 30 dager | Alt | Alt |
| SLAG-kategorier | Kun totalt | Alle 4 | Alle 4 |
| Notater per økt | Ja | Ja | Ja |
| **Statistikk** | | | |
| Enkel oversikt | Ja | Ja | Ja |
| Grafer og trender | Nei | Ja | Ja |
| Perioderapporter | Nei | Ja | Ja |
| **AI-funksjoner** | | | |
| Svakhetsanalyse | 1/mnd | Ubegrenset | Ubegrenset |
| Treningsplan-generator | Nei | Ja | Ja |
| Fokusanbefaling | Nei | Ja | Ja |
| **Import/Eksport** | | | |
| TrackMan-import | Nei | Nei | Ja |
| Manuell runde-input | Ja | Ja | Ja |
| Eksport PDF | Nei | Ja | Ja |
| Eksport CSV | Nei | Ja | Ja |
| **Video** | | | |
| Videoanalyse | Nei | Nei | Ja |
| Videolagring | Nei | Nei | 2 GB |
| **Deling** | | | |
| Del med trener | Nei | Nei | Ja |
| Offentlig profil | Nei | Nei | Valgfritt |

---

## Brukerflyter

### 1. Registrering (ny bruker)

```
Landingsside
    ↓
"Prøv gratis" CTA
    ↓
Registreringsskjema
  - E-post
  - Passord
  - Fornavn
  - Handicap (valgfritt)
    ↓
E-postverifisering
    ↓
Onboarding (3 steg)
  1. "Hva er ditt mål?" (velg 1-3)
  2. "Hvor ofte trener du?" (1-2x, 3-4x, 5+)
  3. "Logg din første økt" (guided)
    ↓
Dashboard (Gratis tier)
```

### 2. Logge treningsøkt

```
Dashboard → "Logg økt" knapp
    ↓
Økt-skjema
  - Dato (default: i dag)
  - Varighet (minutter)
  - Fokusområde (SLAG-kategori)
  - Øvelser (flervalg fra bank)
  - Notater (fritekst)
  - Vurdering (1-5 stjerner)
    ↓
[Lagre]
    ↓
Bekreftelse + "Du har logget X økter denne måneden"
    ↓
Hvis Gratis og økt 4: Vis upgrade-modal
```

### 3. AI Svakhetsanalyse

```
Dashboard → "Se analyse" eller Analyse-side
    ↓
Hvis Gratis:
  - Sjekk om brukt denne måneden
  - Hvis ja: Vis låst med "Oppgrader for ubegrenset"
  - Hvis nei: Generer analyse
    ↓
Hvis Pro/Pro+:
  - Generer analyse direkte
    ↓
Vis resultat:
  - Primær svakhet (headline)
  - 3 bevis fra treningsdata
  - Anbefaling for neste periode
  - Fokusfordeling (pie chart)
```

### 4. Freemium → Pro konvertering

**Trigger-punkter:**

| Trigger | Handling |
|---------|----------|
| 4. økt logget | Modal: "Du har nådd grensen. Oppgrader for ubegrenset logging." |
| Dag 31 | Banner: "Din treningshistorikk fra [måned] er nå arkivert." |
| 2. AI-analyse forsøk | Låst visning: "Du har brukt din månedlige analyse." |
| Klikk på låst feature | Slide-in: Feature-beskrivelse + pris + CTA |

**Konverteringsmodal:**

```
┌─────────────────────────────────────────────────┐
│  Få mer ut av treningen din                     │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────┐       │
│  │ Pro             │  │ Pro+            │       │
│  │ 199 kr/mnd      │  │ 299 kr/mnd      │       │
│  │                 │  │                 │       │
│  │ ✓ Ubegrenset    │  │ ✓ Alt i Pro     │       │
│  │   logging       │  │ ✓ TrackMan      │       │
│  │ ✓ Full historie │  │ ✓ Videoanalyse  │       │
│  │ ✓ AI-analyse    │  │ ✓ Trenerdeling  │       │
│  │                 │  │                 │       │
│  │ [Velg Pro]      │  │ [Velg Pro+]     │       │
│  └─────────────────┘  └─────────────────┘       │
│                                                 │
│  Spar 25% med årlig betaling                    │
└─────────────────────────────────────────────────┘
```

### 5. Kansellering av coaching → Retention

```
Bruker klikker "Avslutt abonnement" (coaching)
    ↓
Bekreftelsessteg 1: "Er du sikker?"
    ↓
Bekreftelsessteg 2: Retention-tilbud

┌─────────────────────────────────────────────────┐
│  Behold treningshistorikken din                 │
│                                                 │
│  Du har logget 47 økter og 12 runder.           │
│  AI-analysen viser fremgang i nærspill.         │
│                                                 │
│  ┌─────────────────────────────────────────┐    │
│  │  12 måneder for 999 kr                  │    │
│  │  (83 kr/mnd — spar 1 389 kr)            │    │
│  │                                         │    │
│  │  [Velg denne]                           │    │
│  └─────────────────────────────────────────┘    │
│                                                 │
│  eller fortsett for 149 kr/mnd                  │
│                                                 │
│  ───────────────────────────────────────────    │
│  Tilbudet gjelder i 7 dager                     │
│                                                 │
│  [Nei takk, avslutt helt]                       │
└─────────────────────────────────────────────────┘

    ↓
Hvis valgt tilbud: Redirect til betaling
Hvis avslått: Fullfør kansellering, send e-post med tilbud
```

---

## Teknisk arkitektur

### Eksisterende system (gjenbruk)

| Komponent | Fil | Status |
|-----------|-----|--------|
| AI Svakhetsanalyse | `lib/portal/ai/weakness-analysis.ts` | Ferdig |
| AI Treningsplan | `lib/portal/ai/training-plan.ts` | Ferdig |
| Treningsdagbok | `app/portal/(dashboard)/dagbok/` | Ferdig |
| Statistikk | `app/portal/(dashboard)/statistikk/` | Ferdig |
| Bruker-auth | `lib/portal/auth.ts` | Ferdig |
| Stripe-integrasjon | `lib/portal/stripe.ts` | Ferdig |

### Nye komponenter

| Komponent | Beskrivelse | Prioritet |
|-----------|-------------|-----------|
| Tier-gate system | Sjekk tilgang basert på subscription tier | P0 |
| Usage tracking | Tell logger, AI-kall per bruker per måned | P0 |
| Freemium onboarding | 3-stegs wizard for nye brukere | P0 |
| Upgrade modals | Konverteringsmodaler ved grenser | P0 |
| Retention flow | Kanselleringsflyt med tilbud | P1 |
| TrackMan import | CSV-parsing for TrackMan data | P1 |
| Video upload | Opplasting og lagring av svingvideoer | P2 |
| Coach sharing | Del data med ekstern trener | P2 |

### Database-endringer

```prisma
// Ny enum for portal-spesifikk tier
enum PortalTier {
  FREE
  PRO
  PRO_PLUS
}

// Utvidelse av User-modell
model User {
  // ... eksisterende felter
  portalTier          PortalTier @default(FREE)
  portalSubscriptionId String?   // Stripe subscription ID

  // Usage tracking
  monthlyLogCount     Int       @default(0)
  monthlyAiCount      Int       @default(0)
  usageResetDate      DateTime  @default(now())
}

// Ny modell for retention-tilbud
model RetentionOffer {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  offerType       String   // "annual_999" | "monthly_149"
  expiresAt       DateTime
  acceptedAt      DateTime?
  createdAt       DateTime @default(now())
}
```

### API-endepunkter (nye)

| Endpoint | Metode | Beskrivelse |
|----------|--------|-------------|
| `/api/portal/subscription/upgrade` | POST | Oppgrader til Pro/Pro+ |
| `/api/portal/subscription/cancel` | POST | Kanseller, vis retention |
| `/api/portal/subscription/retention` | POST | Aksepter retention-tilbud |
| `/api/portal/usage` | GET | Hent bruksstatus (logger, AI) |
| `/api/portal/usage/reset` | POST | Månedlig reset (cron) |

---

## Betalingsflyt

### Stripe-produkter

| Produkt | Stripe Price ID | Intervall |
|---------|-----------------|-----------|
| Pro Monthly | `price_pro_monthly` | Månedlig |
| Pro Annual | `price_pro_annual` | Årlig |
| Pro+ Monthly | `price_proplus_monthly` | Månedlig |
| Pro+ Annual | `price_proplus_annual` | Årlig |
| Retention Annual | `price_retention_annual` | Engang |
| Retention Monthly | `price_retention_monthly` | Månedlig |

### Webhook-events

| Event | Handling |
|-------|----------|
| `checkout.session.completed` | Oppgrader bruker til valgt tier |
| `customer.subscription.updated` | Synkroniser tier-status |
| `customer.subscription.deleted` | Nedgrader til FREE, trigger retention |
| `invoice.payment_failed` | Send varsel, 3 forsøk før kansellering |

---

## Landingsside

### URL
`akgolf.no/portal` eller `treningsdagbok.golf` (separat domene?)

### Struktur

1. **Hero**
   - Headline: "Den eneste treningsdagboken laget for golf"
   - Subheadline: "Logg økter. Se fremgang. Få AI-analyse."
   - CTA: "Prøv gratis"
   - Screenshot av dashboard

2. **Problem/Løsning**
   - "Du trener, men vet ikke om det virker"
   - "Generelle apper forstår ikke golf"
   - "AK Golf Portal er bygget av golftrener for golfere"

3. **Features (3 hovedpunkter)**
   - Golfspesifikk logging (SLAG-kategorier)
   - AI som forstår golf (svakhetsanalyse)
   - Se fremgangen din over tid

4. **Priser**
   - Side-by-side: Gratis | Pro | Pro+
   - Årlig/månedlig toggle
   - "Mest populær" badge på Pro

5. **Social proof**
   - "X spillere logger treningen sin her"
   - 2-3 testimonials (fra coaching-kunder)

6. **FAQ**
   - Hva er forskjellen på tierene?
   - Kan jeg oppgradere senere?
   - Fungerer det med TrackMan?
   - Er det binding?

7. **Avsluttende CTA**
   - "Start gratis i dag"
   - Ingen kredittkort kreves

---

## Onboarding

### E-postsekvens (gratis brukere)

| Dag | E-post | Mål |
|-----|--------|-----|
| 0 | Velkommen + logg første økt | Aktivering |
| 3 | Tips: Slik bruker du SLAG-kategorier | Utdanning |
| 7 | Din første ukesrapport | Verdi |
| 14 | "Du har X økter — se AI-analysen" | Feature discovery |
| 21 | Suksesshistorie fra annen bruker | Social proof |
| 28 | "Siste uke på full historikk" | Urgency |
| 30 | Upgrade-tilbud (10% rabatt første måned) | Konvertering |

### In-app onboarding

**Steg 1:** Mål
```
Hva vil du oppnå?
[ ] Lavere handicap
[ ] Mer konsistens
[ ] Lengre slag
[ ] Bedre nærspill
[ ] Spille turneringer
```

**Steg 2:** Treningsfrekvens
```
Hvor ofte trener du?
( ) 1-2 ganger i uken
( ) 3-4 ganger i uken
( ) 5+ ganger i uken
```

**Steg 3:** Første økt
```
Logg din første økt for å komme i gang
[Åpne økt-skjema]
```

---

## Metrics & Analytics

### Nøkkelmetrikker

| Metrikk | Definisjon | Mål |
|---------|------------|-----|
| MRR | Sum av alle aktive abonnementer | 150K mnd 10 |
| Churn rate | Kanselleringer / aktive | < 5% |
| Free→Pro conversion | Oppgraderinger / gratis brukere | > 8% |
| Activation rate | Logget 1+ økt innen 7 dager | > 60% |
| DAU/MAU | Daglig aktive / månedlig aktive | > 25% |
| ARPU | MRR / betalende brukere | ~200 kr |

### Events å tracke

| Event | Trigger |
|-------|---------|
| `signup_started` | Klikk på "Prøv gratis" |
| `signup_completed` | Fullført registrering |
| `onboarding_step_X` | Fullført onboarding-steg |
| `session_logged` | Logget treningsøkt |
| `ai_analysis_viewed` | Sett AI-analyse |
| `upgrade_modal_shown` | Vist oppgraderingsmodal |
| `upgrade_started` | Klikket "Velg Pro/Pro+" |
| `upgrade_completed` | Fullført betaling |
| `churn_initiated` | Startet kansellering |
| `retention_accepted` | Akseptert retention-tilbud |

---

## Utenfor scope (v1)

Følgende er IKKE inkludert i første versjon:

- [ ] Mobilapp (web-first, PWA later)
- [ ] Sosiale features (dele med venner)
- [ ] Leaderboards / konkurranser
- [ ] Integrasjon med andre apper (Garmin, Apple Health)
- [ ] Flerspråklig (kun norsk v1)
- [ ] Klubb-løsninger (B2B)
- [ ] Live coaching-videosamtaler
- [ ] Betalingsplan (delbetaling)

---

## Tidsplan

### Fase 1: MVP (uke 1-4)
- [ ] Tier-gate system
- [ ] Usage tracking
- [ ] Upgrade modals
- [ ] Stripe-produkter oppsett
- [ ] Landingsside

### Fase 2: Onboarding (uke 5-6)
- [ ] Onboarding wizard
- [ ] E-postsekvenser
- [ ] Aktiveringsmetrikker

### Fase 3: Retention (uke 7-8)
- [ ] Kanselleringsflyt
- [ ] Retention-tilbud
- [ ] Win-back e-poster

### Fase 4: Pro+ features (uke 9-12)
- [ ] TrackMan import
- [ ] Video upload
- [ ] Coach sharing

---

## Godkjenning

- [x] Prisstruktur godkjent
- [x] Feature-matrise godkjent
- [x] Freemium-modell godkjent
- [x] Retention-strategi godkjent
- [ ] Teknisk arkitektur review
- [ ] Design review
- [ ] Launch-dato satt

---

**Neste steg:** Implementeringsplan med detaljerte tasks per fase.
