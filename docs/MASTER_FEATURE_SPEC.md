# AK Golf Platform — Master Feature Specification

> **Versjon:** 2.0.0  
> **Sist oppdatert:** 2026-04-17  
> **Status:** Konsolidert produkt- og design-bibel  
> **Mål:** Én sann kilde for alle funksjoner, flyter, skjermer, AI-agenter og designprinsipper i AK Golf Platform.

---

## Hvordan lese dette dokumentet

| Tag | Betydning |
|-----|-----------|
| `✅ IMPLEMENTED` | Funksjonen er kodet, testet og i produksjon/staging |
| `🟡 PARTIAL` | Funksjonen er delvis kodet, har placeholders, eller mangler polish |
| `🚀 VISION` | Funksjonen er designet/beskrevet i dette dokumentet, men IKKE ennå kodet |

---

## Del 1 — Produktvisjon og brukersyklus

### 1.1 Visjon
AK Golf Platform er en helhetlig digital treningspartner for golfspillere. Plattformen kobler **spillerdata** (runder, treningsøkter, TrackMan, coaching) med **AI-drevet innsikt** og **strukturert treningsplanlegging** — alt bygget på AK Golf Academy sin treningspyramide (FYS → TEK → SLAG → SPILL → TURN).

### 1.2 Den store syklusen: PLAN → TREN → SPILL → ANALYSER

```
                    ┌─────────────────┐
                    │   OVERSIKT      │
                    │   Dashboard     │ ← Entrypoint + insikt
                    └────────┬────────┘
                             │
    ┌────────────┬───────────┼───────────┬────────────┐
    ▼            ▼           ▼           ▼            ▼
┌────────┐  ┌────────┐  ┌──────────┐ ┌──────────┐ ┌──────────┐
│ PLAN   │  │  TREN  │  │  SPILL   │ │ ANALYSER │ │  SOSIALT │
│        │  │        │  │          │ │          │ │          │
│Trenings│  │Dagbok  │  │Registrer │ │Statistikk│ │Venner    │
│plan    │  │Øvelser │  │runde     │ │AI Coach  │ │Challenges│
│Booking │  │Tester  │  │Turnering │ │Benchmark │ │Leaderboard│
│Kalender│  │TrackMan│  │Spill     │ │Sammen-   │ │          │
│Mål     │  │Coach-  │  │Strategi  │ │ligning   │ │          │
│        │  │historikk│ │Bag       │ │Analyse   │ │          │
└────────┘  └────────┘  └──────────┘ └──────────┘ └──────────┘
    │            │            │            │
    └────────────┴────────────┴────────────┘
                             │
                    Tilbake til PLAN
                    med ny AI-innsikt
```

**Kjerneprinsipp:** Hver handling i én fase skal kunne føre til en handling i neste fase. Data flyter i en løkke:
1. **Spiller logger runde** → AI analyserer → anbefaler treningsfokus
2. **Spiller følger treningsplan** → logger økt i dagbok → systemet oppdaterer volum
3. **Coach gir feedback** → notater synkroniseres → spiller ser innsikt på dashboard
4. **Spiller øver på TrackMan** → data registreres → avvik identifiseres → justert plan

### 1.3 Brukerroller

| Rolle | Tilgang | Hovedskjermer |
|-------|---------|---------------|
| `VISITOR` | Kun markedssider + auth | - |
| `STUDENT` | Portal (dashboard, plan, dagbok, statistikk) | `/portal/*` |
| `INSTRUCTOR` | Portal + Mission Control | `/portal/*` + `/admin/*` |
| `ADMIN` | Full tilgang | `/portal/*` + `/admin/*` + økonomi/rapporter |

---

## Del 2 — Visuelt designsystem (AK Design DNA)

### 2.1 Fargepalett

| Token | HEX | Bruk |
|-------|-----|------|
| `primary.main` | `#005840` | Knapper, headings, primary borders |
| `primary.accent` | `#D1F843` | CTA, badges, highlights, lime-glow |
| `primary.surface` | `#ECF0EF` | Portal-bakgrunn (Apple-grå) |
| `primary.text` | `#324D45` | Hovedtekst |
| `primary.muted` | `#A5B2AD` | Sekundærtekst, labels |
| `primary.dark` | `#0A1F18` | Mørkeste grønn, hero-overlay, dark cards |
| `semantic.success` | `#2A7D5A` | Positive trender, fullført |
| `semantic.error` | `#B84233` | Feil, avbestilling, negativ SG |
| `semantic.warning` | `#C48A32` | Advarsler, ventende status |
| `ai.primary` | `#AF52DE` | AI-insikt, lilla glow |
| `data.sage` | `#2A7D5A` | Grafer, positive barer |
| `data.coral` | `#E85D4E` | Grafer, negative barer, varme aksenter |
| `data.blue` | `#007AFF` | Lenker, kalender-events, info |
| `data.lime` | `#D1F843` | CTA-grafer, aksent på dataviz |

### 2.2 Kort-typer (komponentbibliotek)

| Type | Bruk | Visuelt |
|------|------|---------|
| **Hero-kort** | Dashboard topp, profil | Bilde + overlay + tekst + stats |
| **Stat-kort** | KPI, tall | Tall + label + trend + glow |
| **Action-kort** | Neste booking | Grønn/coral gradient, CTA |
| **AI-kort** | Innsikt, chat | Lilla aksent, glow-line, mørk bg |
| **Plan-kort** | Ukesplan, økter | Checklist med ikoner, pyramid-tag |
| **Data-kort** | Grafer, charts | Hvit bg, subtle border, chart |
| **Bilde-kort** | Coaching, profil | Foto + overlay tekst |
| **Shortcut-kort** | Snarveier | Ikon + label, hover lift |

### 2.3 Treningspyramiden — visuelt språk

Pyramiden er det **sentrale navigasjons- og filtreringsprinsippet** i hele treningsdelen av plattformen.

```
         ╱╲
        ╱  ╲     TURN  — Turnering
       ╱────╲
      ╱      ╲    SPILL — Spill (9/18 hull)
     ╱────────╲
    ╱          ╲   SLAG  — Golfslag (putting, chipping, driving)
   ╱────────────╲
  ╱              ╲  TEK   — Teknikk (svinganalyse, video, impact)
 ╱────────────────╲
╱                  ╲ FYS   — Fysisk trening (styrke, mobilitet, kondisjon)
```

**Visuell representasjon (anbefalt):**
- **Geometrisk pyramide** i hero-seksjoner og onboarding (5 lag, FYS bredest nederst, TURN spiss øverst)
- **Horisontal stacked bar** i dataviz og filter-paneler
- **Fargekoding + ikoner** per nivå
- **Interaksjon:** Klikk på et nivå = filtrer øvelser/økter/data til dette nivået

**Datastruktur:** Hver økt, øvelse, logg og runde er tagget med ett eller flere pyramid-nivåer.

### 2.4 Layout-prinsipper

- **Bento-grid:** 12-kolonners grid, gaps `20px` desktop / `16px` mobil
- **Kort-radius:** `16px` (`rounded-2xl`)
- **Shadows:** 2-lags — soft base + hover-elevation
- **Typografi:** Inter (sans), tall i `tabular-nums`
- **Animasjoner:** Framer Motion, stagger `0.05s`, hover `translateY(-2px)`

---

## Del 3 — Spillerportal: Alle skjermer og funksjoner

### 3.0 Dashboard (`/portal`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `app/portal/(dashboard)/page.tsx` → `DashboardClientV3`

**Formål:** "Hvor står jeg, og hva er neste steg?" — 5-sekunders oversikt.

**Hva brukeren ser:**
1. **Velkomstseksjon** — personlig hilsen basert på klokkeslett, tier-badge, medlem siden
2. **Neste booking** — hero-kort med coral gradient (viser coach, tid, varighet) + endre/avbestill
3. **Ukekalender** — 7 dag-pills med status (trent, coaching, hvile, tom)
4. **KPI-rad** — Handicap (med sparkline), Runder, Treningsøkter
5. **Widget-rad** — TrackMan (siste økt + 3 sparklines), Sosialt (rank + streak + challenges), AI Insights (for Pro/Advanced), Prestasjoner, Snarveier
6. **Coach Insight** — siste notat fra trener

**Personalisering:**
- `beginner` → skjuler TrackMan, viser Training Activity i stedet for AI Insights
- `pro/advanced` → viser AI Insights, TrackMan, Sosialt
- Ingen data → empty states med "Kom i gang"-lenker

**CTA-flyt:**
- "Book din neste økt" → `/portal/bookinger/ny`
- "Logg trening" → `/portal/dagbok`
- "Registrer runde" → `/portal/runde/ny`
- "Se statistikk" → `/portal/statistikk`

---

### 3.1 Treningsplanlegger (`/portal/treningsplan`)
**Status:** `✅ IMPLEMENTED` (v3 kalender) + `🚀 VISION` (Ideell pyramide-basert planlegger 2.0)

#### NÅVÆRENDE (v3)
**Fil:** `treningsplan-v3-client.tsx`

To visningsmoduser styrt av `?view=`:
- **`viewer`** — enkel liste over ukens økter (`TrainingPlanViewer`)
- **`calendar`** — full kalender med drag-drop (`TrainingPlannerV3`)

**Kalendervisning:**
- Uke-grid (mandag–søndag)
- Økter vises som kort med fargekoding etter fokusområde
- **Drag & drop:** Flytt økt til annen dag
- **Resize:** Endre varighet
- **Slett:** Fjern økt
- **Hardkodede maler:** 6 maler (Putting-drill, Short game, Driving range, Styrke-økt, Spill 9 hull, Svinganalyse)
- **Øvelsesbank:** Høyre sidepanel med filtrering etter pyramide-nivå

**Server actions:**
- `getActivePlan()` — henter aktiv `TrainingPlan`
- `getWeekEvents()` — henter `TrainingPlanSession` for valgt uke
- `updateSessionTime()`, `moveSessionToDay()`, `deleteSession()` — CRUD på økter
- `logLiveSession()` — logger økt direkte til dagbok

#### FREMTIDIG VISJON (Planlegger 2.0)
> Dette er den ideelle brukeropplevelsen som skal designes i Stitch og implementeres.

**Hovedflyt:** Når spiller trykker **"+ Planlegg treningsøkt"** (eller "Ny plan"), skal følgende wizard vises:

**Steg 1 — Velg tidsrom**
```
[ Enkeltøkt ]  [ Periode (4-12 uker) ]  [ Årsplan (52 uker) ]
```

**Steg 2 — Treningspyramiden (visuell selector)**
En stor, interaktiv pyramide vises:
```
         ╱╲  TURN
        ╱──╲ SPILL
       ╱────╲ SLAG
      ╱──────╲ TEK
     ╱────────╲ FYS
```
Spiller klikker på ønskede nivåer. Systemet beregner fordelingsprosent basert på Masterdokumentet (kategori A-K + sesongfase).

**Steg 3 — Tilgjengelighet**
- Hvor mange timer/uke?
- Hvilke dager passer? (mandag, onsdag, fredag…)
- Hvilken tid på døgnet? (morgen, ettermiddag, kveld)

**Steg 4 — Fokusområde**
- Basert på valgt pyramide-nivå, vises aktuelle fokusområder
- AI foreslår fokus basert på siste runde/SG-data (f.eks. "Din approach er svak — fokus på SLAG")

**Steg 5 — Generer plan**
- AI/MCP-agent (`ak_training_plan_save`) genererer ukentlig fordeling
- Planen populeres med øvelser fra øvelsesbanken
- Spiller kan godkjenne eller justere enkeltøkter

**Steg 6 — Lagre og synkroniser**
- Plan lagres i `TrainingPlan` → `TrainingPlanWeek` → `TrainingPlanSession`
- Synkroniseres til Google Calendar (hvis aktivert)
- Coach får varsel i Mission Control

**Per skjerm i wizard:**

| Skjerm | Hva vises | Data/input |
|--------|-----------|------------|
| `plan-wizard/step-1` | Tidsrom-velger | Enkeltøkt / Periode / Årsplan |
| `plan-wizard/step-2` | Interaktiv pyramide | FYS/TEK/SLAG/SPILL/TURN valg |
| `plan-wizard/step-3` | Tilgjengelighet | Timer/uke, dager, tidspunkter |
| `plan-wizard/step-4` | Fokusområde | Dropdown + AI-forslag |
| `plan-wizard/step-5` | Forhåndsvisning | Uke-for-uke, dag-for-dag, øvelser |
| `plan-wizard/step-6` | Bekreftelse | Lagre, del med coach, sync kalender |

**Pyramide-datastruktur i UI:**
```typescript
interface PyramidLevel {
  id: "FYS" | "TEK" | "SLAG" | "SPILL" | "TURN";
  label: string;
  color: string;
  icon: string;
  description: string;
  examples: string[];
}
```

---

### 3.2 Dagbok / Treningsdagbok (`/portal/dagbok`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `training-diary-client.tsx`

**Formål:** "Logg det jeg akkurat gjorde, få umiddelbar feedback."

**Hva brukeren ser:**
1. **Streak-kort** — current streak, longest streak, siste treningsdato, frost-krystaller (freezes)
2. **Plan-progress** — "Denne uken: 3/5 økter fullført" + ring-animasjon
3. **Siste økt** — hurtigvisning av forrige logg med "Gjenta økt"-knapp
4. **Logg ny økt** — modal/skuff som åpner logg-skjema
5. **Historikk** — liste over alle loggede økter

**Logg-skjema (når spiller logger økt):**
- Dato og varighet
- Fokusområde (pyramide-nivå)
- Øvelser fra planlagt økt (auto-fylt hvis økten kom fra treningsplan)
- For hver øvelse:
  - **L-fase** (Læringsfase): `KOLLE` → `ARM` → `BALL` → `MÅL`
  - **M** (Miljø): `LUKT` (range) → `BANE` (course) → `PRESS` (konkurranse)
  - **PR** (Prestasjon): Score, treffrate %, avstand, rating 1-5
  - Antall baller, bevegelser
  - Notater
- Vurdering 1-5 (hele økten)
- Notater (hele økten)

**Server actions:**
- `getTrainingLogs()` — CRUD på `TrainingLog`
- `logSessionWithExercises()` — lagrer økt + øvelser
- `repeatLastSession()` — kopierer forrige økt
- `addCoachFeedback()` — trener kan legge til tilbakemelding

**Data som lagres per øvelse:**
```typescript
interface TrainingLogExercise {
  id: string;
  exerciseDefinitionId: string;
  plannedSets?: number;
  plannedReps?: number;
  actualSets?: number;
  actualReps?: number;
  lPhase?: "KOLLE" | "ARM" | "BALL" | "MÅL";
  environment?: "LUKT" | "BANE" | "PRESS";
  pressLevel?: number;
  clubSpeed?: number;
  score?: number;
  successRate?: number;
  notes?: string;
  sortOrder: number;
}
```

---

### 3.3 Øvelsesbank (`/portal/trening/ovelser`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `ovelser/page.tsx`

**Formål:** Browse og filtrer godkjente øvelser fra `drills`-tabellen i Supabase.

**Hva brukeren ser:**
1. **Pyramide-filter** — horisontal stacked bar der hvert nivå er klikkbart
2. **Kategori-tags** — Putting, Chip, Driver, Jern, Fitness, Mental
3. **Øvelseskort** — tittel, varighet, vanskelighetsgrad, L-fase-indikator
4. **Detalj-modal** — beskrivelse, trinn-for-trinn, suksesskriterier, video (hvis tilgjengelig)

**Data:**
- Hentes direkte fra Supabase `drills`-tabell
- Gruppert etter `pyramid` (FYS/TEK/SLAG/SPILL/TURN)

---

### 3.4 TrackMan-tester (`/portal/trening/tester`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `tester/page.tsx`, `tester/[id]/page.tsx`

**Formål:** Standardiserte TrackMan-testprotokoller.

**Hva brukeren ser:**
- Liste over 100+ testprotokoller gruppert etter kategori
- Hver test viser: navn, beskrivelse, personlig best (fra `TestResult`)
- Klikk på test → detaljside med protokoll, forventede verdier, historikk

**Data:** `TestDefinition`, `TestResult`

---

### 3.5 Bookinger (`/portal/bookinger`)
**Status:** `✅ IMPLEMENTED`  
**Filer:** `bookinger-client.tsx`, `ny/portal-booking-wizard.tsx`

**Listevisning:**
1. **Neste booking — Hero-kort** — stor, tydelig, med coral gradient
2. **Kommende bookinger** — timeline-kort
3. **Historikk** — fortidige bookinger
4. **Avbestillingsregler** — infoboks med gebyrstruktur

**Ny booking wizard (`/portal/bookinger/ny`):**
1. Velg tjenestetype (Performance, Performance Pro, Flex 50, Flex 90)
2. Velg instruktør
3. Velg dato og tid
4. Review og bekreftelse
5. Betaling (Stripe/Vipps)

**Endring/avbestilling:**
- `/portal/bookinger/[id]/endre` — reschedule til annen tid
- Avbestilling med automatisk refusjon basert på 24t/12t-regelen

---

### 3.6 Statistikk (`/portal/statistikk`)
**Status:** `✅ IMPLEMENTED` (med kjent SG-bar farge-bug)  
**Fil:** `statistikk-client.tsx`

**Formål:** "Blir jeg bedre?" — trendanalyse over runder og trening.

**Hva brukeren ser:**
1. **Periode-filter** — `30d`, `90d`, `sesong`, `1år`
2. **KPI-rad** — Snittscore, Runder, HCP, SG Total
3. **SG-breakdown** — horisontale barer per kategori:
   - Tee to green
   - Approach
   - Short game
   - Putting
4. **Treningsvolum** — stacked bar (siste 12 uker)
5. **Score-trend** — area chart / sparkline
6. **Golfprofil-sammendrag** — USI-data, siste treningsresep
7. **"Logg ny runde"-CTA** → `/portal/statistikk/ny-runde`

**Ny runde-skjema (`/portal/statistikk/ny-runde`):**
- Velg bane
- Fyll inn dato, score, putts, FW%, GIR%, scrambling
- Systemet beregner automatisk SG (dersom banedata finnes)

---

### 3.7 Runde-tracking (`/portal/runde/ny`, `/portal/runde/[id]`)
**Status:** `✅ IMPLEMENTED`  
**Filer:** `start-round-client.tsx`, `live-round-client.tsx`

**Formål:** Registrer runde hull for hull med DECADE-strategi.

**Start ny runde:**
1. Søk etter bane
2. Velg tee (farge)
3. Start runde → oppretter `Round`-record

**Live scoring (`/portal/runde/[id]`):**
- Stor score-input (+/- knapper)
- Putts-input
- Toggle-knapper: Fairway hit, GIR, Up-and-down, Sand save, Penalty
- **DECADE-strategi** per hull — automatisk hentet basert på bag-dispersion
- Hull-navigasjon (1-18)
- Live status: Totalt score, FW, GIR, hull-progress

**Rundeoppsummering (`/portal/runde/[id]/oppsummering`):**
- Total score + score to par
- Score-fordeling (birdie, par, bogey, dbl+)
- 9-hulls splits
- SG-breakdown
- DECADE-score (strategifølging)
- Beste / verste hull

---

### 3.8 AI Coach (`/portal/ai-coach`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `ai-coach-chat-client.tsx`

**Formål:** "Forklar hva dataene betyr og hva jeg bør gjøre annerledes."

**Hva brukeren ser:**
1. **Chat-vindu** — streaming-meldinger fra Claude
2. **Kontekst** — AI har tilgang til:
   - Siste 10 runder (med SG)
   - Siste 20 treningslogger
   - Aktiv treningsplan
   - Siste 5 TrackMan-økter
   - Kommende turneringer
3. **Quick Insight** — øyeblikkelig oppsummering over chatten
4. **Hurtigspørsmål** (visjon): "Hva bør jeg trene?", "Analyser siste runde", "Lag treningsplan", "Forbered til turnering"

**CTA fra chat:** Anbefalinger kan konverteres til:
- Treningsplan-endringer
- Dagbok-notater
- Melding til coach

---

### 3.9 TrackMan Data (`/portal/trackman`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `trackman-client.tsx`

**Hva brukeren ser:**
1. **Siste 20 økter** — tabell med dato, klubbe, slag, snitt carry, ball speed, club speed, spin
2. **Klubb-statistikk** — aggregerte tall per klubb
3. **Driver carry-trend** — line chart over tid
4. **Analyse-kort** — `TrackManSessionAnalytics` med insights, recommendations, miss patterns

---

### 3.10 Benchmark (`/portal/benchmark`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `benchmark-client.tsx`

**Hva brukeren ser:**
- Egen SG-profil (siste 20 runder)
- Søk blant proff-spillere (DataGolf)
- Sammenligning mot valgt pro — radar-chart eller bar-chart

---

### 3.11 Sammenligning (`/portal/sammenligning`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `page.tsx` (gated bak `PRO`-tier)

**Hva brukeren ser:**
- Peer-sammenligning basert på handicap-gruppe
- Sammenligning i kategoriene: SG, Score, Fairway %, GIR %, Putts/GIR
- Indikator: "Du er over gjennomsnitt i X av 6 kategorier"

---

### 3.12 Coaching-historikk (`/portal/coaching-historikk`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `page.tsx`

**Hva brukeren ser:**
- Liste over coaching-økter
- Hver økt viser: dato, trener, fokusområder, AI-oppsummering
- Instruktører kan også se elev-økter her

**Data:** `CoachingSession` med `aiSummary`, `aiKeyPoints`, `aiFocusAreas`

---

### 3.13 Kalender (`/portal/kalender`)
**Status:** `🟡 PARTIAL`  
**Fil:** `page.tsx`

**Nåværende tilstand:**
- Header + placeholder-kort "Ukekalender kommer snart"
- Google Calendar sync-innstillinger (`CalendarSyncSettings`) fungerer
- Server action `getCalendarEvents()` kan hente merged events (bookings + coaching + treningsøkter + turneringer)

**Visjon:**
- Apple Calendar-inspirert ukevisning
- Fargekodede events (booking = grønn, coaching = blå, trening = lilla, turnering = gul)
- Klikk event → detalj
- Google Calendar 2-veis sync

---

### 3.14 Turneringer (`/portal/turneringer`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `turneringer-client.tsx`

**Hva brukeren ser:**
- Turneringsoversikt (lokale / nasjonale / internasjonale)
- PGA / Euro Tour schedule fra DataGolf
- Påmelding til turnering med plan-nivå og notater
- Forberedelses-checklist

---

### 3.15 Turneringsplan (`/portal/turneringsplan`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `turneringsplan-client.tsx`

**Hva brukeren ser:**
- Personlig turneringskalender
- Registrerte turneringer med forberedelsesstatus
- Stats: kommende, registrerte, fullførte

---

### 3.16 Spill / Games (`/portal/spill`)
**Status:** `✅ IMPLEMENTED` (hub) / `🟡 PARTIAL` (individuelle spill)  
**Fil:** `spill-client.tsx`

**Hub:**
- 3 kort: Nærspill, Putting, Press
- Oversikt over aktive game sessions

**Individuelle spill (`/portal/spill/[gameType]`):**
- Kan opprette game session (strokeplay, stableford, matchplay, bestball, scramble)
- Join med 6-sifret kode
- Søk etter bane

---

### 3.17 Bag / Utstyr (`/portal/bag`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `bag-client.tsx`

**Hva brukeren ser:**
- Liste over klubber i baggen
- Gap-analyse: avstand mellom klubber
- Anbefalinger hvis gap > 10m
- CRUD på klubber

**Data:** `PlayerBag`, `PlayerClub`, `ClubDispersionData`

---

### 3.18 Strategi / DECADE (`/portal/strategi`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `page.tsx`

**Hva brukeren ser:**
- Velg bane
- Naviger hull 1-18
- For hvert hull: anbefalt strategi, målsoner, faresoner, anbefalt klubbe
- Pre-shot routine checklist
- Dispersion-visualisering (basert på egen bag)

---

### 3.19 Analyse (`/portal/analyse`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `page.tsx`

**Hva brukeren ser:**
- GIR %, Fairway %, Putts/runde, Scrambling % med trender
- Handicap-trend chart
- Strokes Gained barer
- TrackMan-stats (Pro-gated)
- Treningsplan vs faktisk
- Konsistens-data
- Quick actions: Last opp TrackMan, registrer runde, spør AI Coach

---

### 3.20 Mental Game (`/portal/mental`)
**Status:** `🟡 PARTIAL`  
**Filer:** `page.tsx`, `ny/page.tsx`, `[roundId]/page.tsx`

**Nåværende:**
- `ny/` — registrer ny mental scorecard-runde
- `[roundId]` — se detalj for en mental runde
- `page.tsx` — oversikt med tabs: Runder / Trends
- **Trends-tab:** viser smooth line chart for focus, confidence, commitment, acceptance
- **Runder-tab:** placeholder "Ingen runder registrert ennå"

**Data:** Mental score per runde lagres og aggregeres.

---

### 3.21 Tester (DECADE) (`/portal/tester`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `tester-client.tsx`

**Hva brukeren ser:**
- Liste over alle `TestDefinition`
- Personlig best per test
- Stats: fullført/total, total score, beste test

---

### 3.22 Profil (`/portal/profil`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `profil/page.tsx`

**Hva brukeren ser:**
- Profilkort (navn, bilde, tier)
- Stats: HCP, treninger, coaching-økter, streak
- Achievements
- Handicap-historikk chart
- Tour comparison data

**Innstillinger (`/portal/profil/innstillinger`):**
- Rediger navn, telefon
- Last opp avatar
- Se abonnement, åpne Stripe Billing Portal

---

### 3.23 Meldinger (`/portal/meldinger`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `meldinger-chat-client.tsx`

**Hva brukeren ser:**
- Samtaleliste (venstre side)
- Chat-vindu (høyre side)
- Send/lese meldinger i sanntid
- Markere som lest

---

### 3.24 Sosialt (`/portal/sosialt`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `sosialt-client.tsx`

**Hva brukeren ser:**
- Venneforespørsler (send/aksepter/avvis/fjern)
- Søk etter brukere
- Leaderboards (handicap, improvement, streak)
- Challenges (opprett/bli med)

---

### 3.25 Apper (`/portal/apper`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `apper-client.tsx`

**Hva brukeren ser:**
- Markedsplass for `AppModule` og `AppBundle`
- Aktive abonnementer
- Priser og beskrivelser

---

### 3.26 Abonnement (`/portal/abonnement`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `abonnement-client.tsx`

**Hva brukeren ser:**
- Nåværende tier og utløpsdato
- Quota: brukte/tilgjengelige økter, booking-vindu
- Lenke til Stripe Customer Portal

---

### 3.27 Onboarding (`/portal/onboarding`)
**Status:** `✅ IMPLEMENTED`  
**Fil:** `onboarding-client.tsx`

**Formål:** Førstegangsoppsett for nye brukere.
**Hva brukeren gjør:**
- Fyller inn profil
- Setter handicap og mål
- Velger interesseområder
- Fullfører → redirect til Dashboard

---

## Del 4 — Mission Control (Admin)

> Mission Control er instruktørenes og administatorenes arbeidsstasjon. Alt er samlet under `/portal/admin/` med en mørk sidebar.

### 4.1 Admin Dashboard / Hub (`/portal/admin`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
1. **KPI-rad** — Økter i dag, aktive elever, ventende bookinger, MTD inntekt, nye elever denne uken, ukentlige økter, totalt elever, snitt-HCP
2. **Divisjons-bokser** — Coaching, Junior, GFGK med elev-antall og dagens bookinger
3. **Alerts** — Følg-opp-påminnelser, utløpende abonnementer, ventende bookinger
4. **Inntektstrend** — line chart
5. **Dagens timeplan** — hurtigvisning

---

### 4.2 Mission Board (`/portal/admin/mission-board`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Real-time dashboard med statistikk, sparklines, area chart (bookinger siste 30 dager)
- Månedsmål-progress ring
- Dagens schedule
- AI insights-kort
- Alerts og weekly summary
- Auto-refresh hvert 5. minutt

---

### 4.3 Elever (`/portal/admin/spillere`)
**Status:** `✅ IMPLEMENTED`

**Listevisning:**
- Søkbar/paginert tabell (50 per side)
- Filter: aktive, nye, at-risk
- Kolonner: navn, handicap, A-K-kategori, siste booking, neste booking, aktiv plan, økter denne måneden

**Elev-detalj (`/portal/admin/spillere/[id]`):**
- Profil-header med bilde, kontaktinfo, tier-badge
- Tabs: Oversikt / Treningsdata / Bookinger / Treningsplan / Meldinger
- Trener kan se all historikk, redigere plan, sende melding

---

### 4.4 Bookinger (`/portal/admin/bookinger`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Søkbar booking-liste
- Filter på status, dato, trener
- **Actions:** Godkjenn, avbestill (med refusjon), endre tid, marker no-show
- **Bulk actions:** Massavbestilling
- **Ny booking:** Manuell opprettelse av booking for elev

---

### 4.5 Kalender (`/portal/admin/kalender`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Full månedsvisning av alle bookinger
- Filter per instruktør
- Klikk booking → detalj + actions
- Fargekoding per status/elev

---

### 4.6 Økter / Coaching-notater (`/portal/admin/okter`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Oversikt over fullførte, avlyste og no-show-økter
- Oppmøteprosent
- Klikk økt → skriv notater, generer AI-oppsummering
- AI-oppsummering inkluderer: keyPoints, focusAreas, actionItems

---

### 4.7 Tilgjengelighet (`/portal/admin/tilgjengelighet`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Sett faste ukes-tilgjengelighetsslots
- Administrer unntak (blokkerte tider)
- Google Calendar sync — hent events som blokkerte tider
- Kalender-preview

---

### 4.8 Treningsplaner (Admin) (`/portal/admin/treningsplan`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Liste over alle aktive planer
- **CRUD på økter:** opprett, rediger, slett, flytt
- **Week focus:** rediger ukens fokus
- **Dupliser plan:** kopier plan til annen elev
- **Ny plan:** Manuell planbygger med øvelsesbank

---

### 4.9 Denne uken (`/portal/admin/denne-uken`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Ukens booking-oversikt
- Stats per dag
- Kapasitetsindikatorer

---

### 4.10 Godkjenninger (`/portal/admin/godkjenninger`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Ventende bookinger som krever godkjenning
- Ventende fasilitetsaktiviteter
- Actions: Godkjenn / Avslå

---

### 4.11 Rapporter (`/portal/admin/rapporter`)
**Status:** `🟡 PARTIAL`

**Nåværende:**
- Eksporter booking-, inntekts- og elevdata til CSV
- Datointervall-picker
- Scheduled reports-tabell med **mock-data**

**Visjon:**
- Automatiserte rapporter
- PDF-generering
- E-postutsendelse av rapporter

---

### 4.12 Økonomi (`/portal/admin/okonomi`)
**Status:** `✅ IMPLEMENTED` (Admin-only)

**Hva admin ser:**
- Finansiell dashboard
- Inntektsaggregering
- Betalingstransaksjoner

---

### 4.13 Fasiliteter (`/portal/admin/fasiliteter`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Administrer treningssenter/anlegg
- Se dagens schedule per fasilitet
- Opprette nye aktiviteter
- Innstillinger per fasilitet

---

### 4.14 Meldinger (`/portal/admin/meldinger`)
**Status:** `✅ IMPLEMENTED`

Samme chat-system som portal, men med tilgang til alle elev-samtaler.

---

### 4.15 Turneringer (`/portal/admin/turneringer`)
**Status:** `✅ IMPLEMENTED`

**Hva admin/trener ser:**
- Turneringsoversikt
- Elev-påmeldinger
- Administrer lokale turneringer

---

### 4.16 E-postmaler (`/portal/admin/e-postmaler`)
**Status:** `✅ IMPLEMENTED`

**Hva admin ser:**
- CRUD på e-postmaler
- Variabler og placeholders
- Forhåndsvisning

---

### 4.17 Analytics, Focus, Kapasitet, AI-assistent, Agenter, Notifications
**Status:** `🟡 PARTIAL` til `🚀 VISION`

Disse sidene har `page.tsx` og er koblet til navigation, men mangler dyp funksjonalitet eller er i konsept-fase.

---

## Del 5 — AI-agenter og MCP-verktøy

> Plattformen har en lokal MCP-server (`mcp-server/src/`) som eksponerer 24 verktøy for AI-integrasjon. Verktøyene er gruppert etter domene.

### 5.1 Treningsanalyse og planlegging (`training.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_training_analyze` | `player_id` (UUID) | 7-dagers analyse: økter, TrackMan, voice notes, tests, breaking points, invariant violations | Hovedinput for treningsplan-generering |
| `ak_training_plan_save` | `player_id`, `week_start`, `period`, `week_type`, `focus_areas` | Lagret ukentlig plan med auto-beregnet fordeling | Generer og lagre plan basert på kategori og sesong |
| `ak_training_plan_get` | `player_id`, `week_start` (optional) | Aktiv plan med daily schedule og drill references | Hent spillerens nåværende plan |

**Invariant violations** (automatiske sjekker):
- TEK må være minimum 15%
- Høye kategorier (H-K) maks 1 turneringshelg
- Sesongjusterte time-mål

### 5.2 Drill-bibliotek (`drills.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_drill_create` | Tittel, beskrivelse, pyramid, area, L-phase, vanskelighetsgrad, varighet, utstyr | Opprettet drill | Legg til ny øvelse i biblioteket |
| `ak_drill_search` | `pyramid`, `area`, `l_phase`, `difficulty`, `query` | Matchede drills | Finn øvelser etter kriterier |
| `ak_drill_approve` | `drill_id`, `approved` (boolean) | Oppdatert status | Godkjenn eller avvis innsendt drill |
| `ak_drill_stats` | — | Biblioteks-statistikk | Se fordeling av drills per kategori |

### 5.3 Spilleradministrasjon (`players.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_player_create` | Navn, kategori (A-K), HCP, e-post | Opprettet spiller | Registrer ny spiller med AK-kategori |
| `ak_player_get` | `player_id` eller navn | Spiller-profil | Hent spillerdetaljer |
| `ak_player_list` | `category` (optional) | Spillerliste | List alle spillere, filtrer på kategori |
| `ak_session_log` | `player_id`, dato, varighet, pyramid, øvelser, notes | Logget økt | Logg en treningsøkt med AK-formelen |
| `ak_session_history` | `player_id`, `limit` | Økthistorikk med pyramid-fordeling | Se trening over tid |

### 5.4 TrackMan (`trackman.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_trackman_log` | `player_id`, sesjon-data, shots-array | Lagret sesjon og shots | Importer TrackMan-shotdata |
| `ak_trackman_analyze` | `player_id`, `club` (optional) | Per-klubb snitt + standardavvik | Analyser TrackMan-trender |

### 5.5 Tester (`tests.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_test_log` | `player_id`, `test_number`, `test_date`, `score`, `details` | Logget resultat + auto-promotion sjekk | Registrer test og sjekk om elev kvalifiserer til ny kategori |
| `ak_test_compare` | `player_id`, `test_number` | Sammenligning med benchmark | Se hvordan spiller ligger an mot standard |
| `ak_test_history` | `player_id` | Alle testresultater | Historikk over tester |

### 5.6 Voice Notes (`voice.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_voice_save` | `player_id`, transkripsjon, oppsummering, nøkkelpunkter | Lagret voice note | Lagre coachings-opptak |
| `ak_voice_search` | `player_id`, `query` | Matchede voice notes | Søk i coaching-opptak |

### 5.7 Drill-agent (`drill-agent.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_drill_suggest` | `player_id`, svakhetsbeskrivelse, pyramid, tid, utstyr | Liste med foreslåtte drills | AI foreslår øvelser basert på analyse |
| `ak_drill_import_batch` | Array med drills | Importresultat | Batch-import av øvelser (auto-godkjenn AK-original) |
| `ak_drill_coverage_gaps` | — | Manglende kombinasjoner av pyramid×area×vanskelighet | Identifiser hull i øvelsesbiblioteket |

### 5.8 Breaking Points (`breaking-points.ts`)

| Verktøy | Input | Output | Formål |
|---------|-------|--------|--------|
| `ak_bp_log` | `player_id`, teknikk, terskel, kontekst | Logget breaking point | Registrer teknisk terskel |
| `ak_bp_history` | `player_id`, teknikk | Historikk for teknikk | Se utvikling av en teknikk over tid |
| `ak_bp_progression` | `player_id`, teknikk | Eldste vs nyeste terskel | Sammenlign fremgang |

---

## Del 6 — Dataflyt og integrasjonspunkter

### 6.1 Den kritiske løkken: Data fører til handling

```
1. SPILLER logger runde (78, SG putting -0.6)
        │
        ▼
2. AI Coach / MCP analyserer:
   "Kort spill koster deg 1.2 slag per runde"
        │
        ▼
3. SPILLER ser anbefaling på Dashboard
        │
        ▼
4. SPILLER trykker "Legg til i treningsplan"
        │
        ▼
5. Treningsplan oppdateres med nytt fokus
        │
        ▼
6. COACH ser oppdatert plan i Mission Control
        │
        ▼
7. SPILLER logger økt (putting-drill, 8/10 treff)
        │
        ▼
8. Dagbok oppdaterer streak + treningsvolum
        │
        ▼
9. Statistikk oppdaterer SG og treningskorrelasjon
        │
        ▼
10. AI Coach genererer ny ukentlig innsikt
        │
        ▼
   Tilbake til 1.
```

### 6.2 Viktige integrasjoner

| System | Hva den gjør | Kritiske endepunkter |
|--------|--------------|----------------------|
| **Supabase** | Auth, database, RLS, cron jobs | Auth: `supabase.auth.*`, DB: Prisma + service-role |
| **Stripe** | Betaling, abonnement, refusjon | `verify-stripe.ts`, `Stripe Checkout`, `Customer Portal` |
| **Vipps** | Mobilbetaling (Norge) | `vippsOrderId` på Booking |
| **Google Calendar** | 2-veis sync av bookinger/trening | `google-calendar-sync.md`, `/api/portal/calendar/sync` |
| **DataGolf** | Proff-data, turneringer, benchmark | `getProTournaments()`, `getProComparison()` |
| **Anthropic Claude** | AI Coach, coaching-oppsummering, innsikt | `ai-coach/actions.ts`, `api/portal/ai/*` |
| **MCP Server** | 24 verktøy for treningsanalyse, drills, TrackMan | `mcp-server/src/tools/*.ts` |
| **TrackMan** | Shot-data import og analyse | `trackman-client.tsx`, `ak_trackman_log` |
| **Acuity Scheduling** | Offentlig booking for eksterne kunder | Embedded iframe i `/booking` |

### 6.3 Cron-jobs

| Jobb | Frekvens | Hva den gjør |
|------|----------|--------------|
| `ai-insights` | Mandager 06:00 | Genererer ukentlig AI-innsikt per elev |
| `send-reminders` | Døgns | SMS/push 24t før sesjon |
| `smart-notifications` | Døgns | E-post til inaktive spillere |
| `booking-cleanup` | Døgns | Fjerner PENDING bookinger eldre enn 30 min |

---

## Appendiks A — Teknisk kartlegging

### A.1 Kodebase-struktur

```
app/
  ├── booking/              # Offentlig booking-flyt
  ├── portal/(dashboard)/   # Spillerportal (25+ ruter)
  ├── admin/(authed)/       # Mission Control (20+ ruter)
  ├── api/                  # API-endepunkter
  ├── auth/                 # Auth-sider
  └── page.tsx              # Markedsside

components/
  ├── portal/               # Portal-komponenter
  ├── admin/                # Admin-komponenter
  ├── ui/                   # Generiske UI-komponenter
  └── website/              # Markedsside-komponenter

lib/
  ├── design-tokens.ts      # Farger, spacing, typografi
  ├── supabase/             # Server/klient-klienter
  └── portal/auth.ts        # Portal auth-guard

mcp-server/
  ├── src/tools/            # 24 MCP-verktøy
  ├── src/schemas/          # Zod-skjemaer
  └── src/constants.ts      # Masterdokument-distribusjoner

prisma/
  └── schema.prisma         # 85+ modeller
```

### A.2 Viktige Prisma-modeller

| Modell | Relasjon | Formål |
|--------|----------|--------|
| `User` | — | Spiller/admin/trener |
| `TrainingPlan` | 1→* `TrainingPlanWeek` → * `TrainingPlanSession` | Års-/periodeplan |
| `TrainingLog` | 1→* `TrainingLogExercise` | Loggede økter |
| `Round` | 1→* `HoleResult` → * `Shot` | Runder og score |
| `Booking` | → `User`, `Instructor`, `ServiceType` | Bookinger og betaling |
| `CoachingSession` | → `Booking` | Coaching-notater og AI-oppsummering |
| `TrackmanSession` | → `User` | TrackMan-data |
| `TestResult` | → `User`, `TestDefinition` | Testresultater |
| `PlayerBag` | 1→* `PlayerClub` | Utstyr |
| `Challenge` | 1→* `ChallengeParticipant` | Sosiale challenges |
| `Tournament` | 1→* `PlayerTournamentPlan` | Turneringer |

### A.3 Kjente bugs og teknisk gjeld

| Problem | Fil | Status |
|---------|-----|--------|
| SG-bar farge-bug | `statistikk-client.tsx` | `🟡 BLOCKER` — bruker Tailwind-klasse i stedet for hex |
| Kalender UI placeholder | `kalender/page.tsx` | `🟡 PARTIAL` — API klar, UI mangler |
| Mental rounds tab tom | `mental/page.tsx` | `🟡 PARTIAL` — trends fungerer, liste er placeholder |
| Scheduled reports mock | `admin/rapporter/page.tsx` | `🟡 PARTIAL` — CSV-eksport fungerer, scheduled er mock |
| Booking tests feiler | `__tests__/booking/*.test.ts` | `🟡 TECH-DEBT` — schema-mismatch, ikke blokkerende |

### A.4 Arkiverte dokumenter

Følgende utdaterte dokumenter er fjernet eller arkivert:
- `docs/archive/legacy-2026-04-15/wireframe-all-screens.md` → `.bak`
- `docs/archive/legacy-2026-04-15/wireframe-analysis.md` → `.bak`
- `docs/archive/superpowers-2026-04-15/2026-04-12-wireframe-design-masterplan.md` → **slettet**
- `docs/archive/superpowers-2026-04-15/2026-04-12-premium-design-roadmap.md` → **slettet**

**Gyldige kilder som fortsatt eksisterer:**
- `docs/MASTER_FEATURE_SPEC.md` (dette dokumentet)
- `docs/DESIGN_REDIGN_PLAN_2026.md`
- `docs/project/02_SITEMAP.md`
- `docs/project/05_USER_FLOWS.md`
- `docs/DESIGN_SYSTEM.md`

---

**Dokumentet er levende.** Ved endringer i funksjonalitet, design eller dataflyt skal dette dokumentet oppdateres.
