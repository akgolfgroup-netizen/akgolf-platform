# Prompt til Kimi Code — 3 features for AK Golf Platform

**Til:** Kimi Code (jobber parallelt med Claude Code)
**Repo:** `~/Developer/akgolf/akgolf-platform/`
**Branch:** `main`
**Stack:** Next.js 16, TypeScript strict, Prisma 7, Supabase, Brand Guide V2.0

## Slik leser du dette dokumentet

Dette dokumentet beskriver tre uavhengige features. Du kan jobbe pa én av gangen,
eller alle tre parallelt om de ikke roter med samme filer. Hver feature har:
- **Mal** (hva spilleren far)
- **Eksisterende kode** (filer du skal bygge pa)
- **Backend-krav** (Prisma + server actions)
- **Frontend-krav** (komponenter + UI)
- **Akseptansekriterier** (slik vet du at du er ferdig)

## Globale regler (gjelder alle 3 features)

- **Brand Guide V2.0:** `--color-primary: #005840`, `--color-accent: #D1F843`, `--color-surface: #F4F6F4`, `--color-card: #FFFFFF`, `--color-ink: #0A1F18`. Se `.claude/rules/design-system.md`.
- **Fonter:** Inter Tight (headlines), Inter (body), JetBrains Mono (eyebrows + tall).
- **Ikoner:** `lucide-react` KUN. Aldri Material Symbols, aldri emojier.
- **Maks 300 linjer per fil** — splitt i flere komponenter ved behov.
- **TypeScript strict** — aldri `any` uten kommentar som forklarer hvorfor.
- **Server Components der mulig** — kun `"use client"` der det er reell interaktivitet.
- **Norsk bokmal** for all brukervendt tekst (sjekk `.claude/rules/sprak.md`).
- **Spiller, aldri elev** — terminologi-las (sprak.md).
- **Mobil-forst** — alle nye sider skal fungere godt pa iPhone 14 Pro / Pixel 7.
- **Verifisering for commit:**
  ```bash
  npx tsc --noEmit               # 0 errors
  npx eslint <changed-files>     # 0 errors
  ```
- **Commit-format:** `feat(X): kort beskrivelse` — `git add <spesifikke filer>` (ALDRI `git add -A`)

---

# FEATURE 1 — TrackMan-integrasjon

## Mal

Spiller laster opp TrackMan-data via:
- **A) Bilde** av TrackMan-skjerm (mobiltelefon-foto)
- **B) CSV-eksport** fra TrackMan Combine

Backend bruker Anthropic Claude Vision-modell for a lese bildet, parser dataen
strukturert, og lagrer til spillerens profil. Frontend viser:
- Spredning per kolle (X/Y dispersion plot)
- Snitt-tall (carry, ball speed, smash factor, etc.)
- Trend over tid per kolle

**Mal med data:** Spilleren skal ha en tydelig oversikt over slag-spredning med
alle 14 koller. Coach skal kunne se trend per kolle og identifisere svake punkter.

## Eksisterende kode

### Prisma-modeller (allerede i `prisma/schema.prisma`)

```prisma
model TrackmanSession {
  id                 String   @id
  userId             String
  sessionDate        DateTime
  club               String
  shots              Json
  averages           Json
  coachingSessionId  String?
  sourceType         String   @default("manual") // manual, csv, image, api
  createdAt          DateTime @default(now())
  // ...
}

model TrackManShotData {
  id              String  @id @default(cuid())
  sessionId       String
  userId          String
  shotNumber      Int
  club            String
  clubCategory    String?
  // Ball data
  ballSpeed       Float?
  launchAngle     Float?
  launchDirection Float?
  spinRate        Float?
  spinAxis        Float?
  // Flight data (meter)
  carryDistance   Float?
  totalDistance   Float?
  maxHeight       Float?
  landingAngle    Float?
  hangTime        Float?
  // ... (fortsetter — sjekk schema)
}

model TrackManImport {
  id          String   @id @default(cuid())
  // metadata for hver import-fil
}

model ClubInBag {
  // Spillerens 14 valgte koller med snitt-distanser
  // (allerede ferdig migrert 2026-04-29)
}
```

### Eksisterende filer

- `lib/portal/trackman/import-service.ts` — CSV-import-logikk
- `lib/portal/trackman/ai-insights.ts` — bruker Anthropic SDK for analyse
- `components/portal/trackman/club-comparison.tsx` — sammenligningsgraf (recharts)
- `components/portal/trackman/club-waveform.tsx` — bolge-graf
- `components/portal/trackman/shot-dispersion-chart.tsx` — spredningsplot
- `app/portal/(dashboard)/trackman/trackman-client.tsx` (858 linjer) — eksisterende UI

### AI-integrasjon

Bruk eksisterende Anthropic-pattern fra `lib/portal/trackman/ai-insights.ts`:

```ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// For Vision (bilde-tolking):
const response = await client.messages.create({
  model: "claude-sonnet-4-5",
  max_tokens: 2048,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/png", data: base64Image } },
      { type: "text", text: PROMPT }
    ]
  }]
});
```

## Backend-krav (Feature 1)

### 1. Lag server action `uploadTrackmanData`

**Fil:** `lib/portal/trackman/upload-actions.ts` (NY)

```ts
"use server";

export async function uploadTrackmanImage(
  file: File,
  metadata: { sessionDate: Date; club?: string; notes?: string }
): Promise<{ sessionId: string; shotsImported: number }> {
  // 1. Verifiser bruker via requirePortalUser()
  // 2. Konverter file til base64
  // 3. Send til Claude Vision med strukturert prompt
  // 4. Parse JSON-responsen
  // 5. Lag TrackmanSession + N TrackManShotData rows
  // 6. Return sessionId + count
}

export async function uploadTrackmanCsv(
  csvText: string,
  metadata: { sessionDate: Date; club?: string }
): Promise<{ sessionId: string; shotsImported: number }> {
  // Bruk eksisterende lib/portal/trackman/import-service.ts
}
```

### 2. Vision-prompt (kritisk del)

Send dette med bildet til Claude Vision:

```
Du er en TrackMan-data-parser. Bildet viser et TrackMan-skjermbilde med slag-data.

Returner JSON i dette formatet — INGEN tekst utenfor JSON:

{
  "club": "7-iron",
  "clubCategory": "iron",
  "shots": [
    {
      "shotNumber": 1,
      "ballSpeed": 132.5,
      "launchAngle": 18.2,
      "launchDirection": -2.1,
      "spinRate": 6800,
      "spinAxis": 1.5,
      "carryDistance": 165.0,
      "totalDistance": 178.2,
      "maxHeight": 32.5,
      "landingAngle": 48.0,
      "hangTime": 6.2
    }
  ],
  "averages": {
    "ballSpeed": 130.2,
    "carryDistance": 162.5,
    "spinRate": 6920
  },
  "confidence": 0.92,
  "notes": "Klart bilde. Alle 5 slag synlige."
}

Felt-regler:
- Distanser i meter (selv om TrackMan viser yards). Konverter: yards * 0.9144 = meter.
- ballSpeed i mph (ikke convert).
- spinRate i rpm.
- Hvis usikker pa et felt: returner null, IKKE gjett.
- confidence 0-1 basert pa bilde-kvalitet og lesbarhet.
```

### 3. Aggregering for visning

**Fil:** `lib/portal/trackman/aggregate.ts` (NY)

```ts
export interface ClubAggregate {
  club: string;
  shotCount: number;
  avgCarry: number;
  avgBallSpeed: number;
  avgSmashFactor: number;
  // Spredning (X/Y) for plot
  dispersion: {
    avgLateral: number;      // gjennomsnitt offline
    stddevLateral: number;   // spredning offline
    avgDistance: number;
    stddevDistance: number;
  };
  trend: {
    last30dAvgCarry: number;
    prev30dAvgCarry: number;
    deltaPct: number;
  };
}

export async function getClubAggregates(userId: string): Promise<ClubAggregate[]> {
  // SELECT FROM TrackManShotData GROUP BY club
  // Beregn snitt + standardavvik per kolle
}
```

## Frontend-krav (Feature 1)

### 1. Upload-side: `/portal/trackman/last-opp`

**Filer:**
- `app/portal/(dashboard)/trackman/last-opp/page.tsx`
- `app/portal/(dashboard)/trackman/last-opp/upload-client.tsx`

**Layout:**
- Tabs: "Last opp bilde" | "Last opp CSV"
- Bilde-tab: drag-drop eller filvelger
- CSV-tab: drag-drop eller filvelger
- Forhandsvisning av bilde for upload
- Manuell metadata-form: dato (default i dag), kolle (dropdown), notater
- "Last opp"-knapp som kaller server action
- Progress-indikator under upload (kan ta 5-10 sek pga Claude Vision)
- Suksess: vis "X slag importert til økten" + lenke til oktens detaljside

### 2. Spredning-visualisering

**Fil:** `components/portal/trackman/dispersion-plot.tsx` (NY)

SVG-basert spredningsplot:
- X-akse: lateral spredning (-30m til +30m)
- Y-akse: distanse (0-300m)
- Hvert slag = en sirkel (storrelse = ball speed, farge = kolle)
- Center-target som grafisk referanse
- Tooltip pa hover (klubb, slag-nummer, ball speed, etc.)

### 3. Oversiktsside per kolle

**Fil:** `app/portal/(dashboard)/trackman/[club]/page.tsx`

For hver kolle (driver, 3-wood, 5-iron, etc.):
- Hero med snitt-tall (carry, ball speed, smash factor, spinrate)
- Spredningsplot for alle slag siste 90 dager
- Trend-graf: snitt-carry per uke siste 12 uker
- Liste over siste 20 slag (tabell)

## Akseptansekriterier (Feature 1)

- [ ] Spiller kan laste opp TrackMan-bilde fra mobil-kamera
- [ ] AI parser bildet og lagrer minst 5 slag korrekt (verifisert mot test-bilder)
- [ ] CSV-import fortsetter a fungere som for
- [ ] Spredningsplot viser tydelig X/Y-dispersion per kolle
- [ ] Trend-graf viser snitt-carry over tid
- [ ] Coach kan se spillerens TrackMan-data fra `/admin/elever/[id]/v2`
- [ ] Upload tar < 15 sekunder for et bilde med 6 slag
- [ ] Hvis Vision feiler: vis tydelig feilmelding + mulighet for manuell korreksjon

---

# FEATURE 2 — Statistikk: UpGame-kopiering

## Mal

Spilleren forer slagregistrering pa banen som UpGame Pro:
- Hvert slag logges med kolle, distanse, lie (fairway/rough/bunker/green)
- Etter runden: full Strokes Gained-analyse + scorekort

**Vi bygger forst manuell foring** (ingen kart, ingen GPS-auto-detect).
Mapbox-kart kan komme i en senere fase nar manuell flyt fungerer.

## Eksisterende kode

### Prisma-modeller (allerede i `prisma/schema.prisma`)

```prisma
model Round {
  id              String   @id
  userId          String
  courseId        String
  date            DateTime
  startTime       DateTime?
  endTime         DateTime?
  teeColor        String   @default("yellow")
  // ... mange felter
  HoleResult      HoleResult[]
  RoundLiveState  RoundLiveState?
}

model HoleResult {
  id        String @id
  roundId   String
  holeId    String
  score     Int?
  putts     Int?
  // ...
  Shot      Shot[]
}

model Shot {
  id              String   @id
  holeResultId    String
  holeId          String
  shotNumber      Int
  fromLie         String   // "tee", "fairway", "rough", "bunker", "green"
  fromDistance    Float    // meter til hull
  toLie           String
  toDistance      Float
  club            String
  // GPS (Sprint A 2026-04-29)
  fromLat         Float?
  fromLng         Float?
  toLat           Float?
  toLng           Float?
  loggedAt        DateTime?
  fromLieDetail   String?
  toLieDetail     String?
  // SG-felter
  expectedBefore  Float
  expectedAfter   Float
  strokesGained   Float
  sgCategory      String   // "OTT", "APP", "ARG", "PUT"
}

model RoundLiveState {
  id                String   @id
  roundId           String   @unique
  currentHoleNumber Int      @default(1)
  currentShotNumber Int      @default(0)
  isPaused          Boolean  @default(false)
  // ...
}

model Course {
  id        String  @id
  name      String
  // ...
  Hole      Hole[]
}

model Hole {
  id          String @id
  courseId    String
  holeNumber  Int
  par         Int
  lengthMeter Int
  // ...
  Shot        Shot[]
}
```

### Eksisterende filer

- `app/portal/(dashboard)/runde/` — eksisterende rute (sjekk struktur)
- `lib/portal/strokes-gained/` — SG-beregning
- Sjekk: `find . -path "*runde*" -name "*.tsx" -o -path "*round*" -name "*.tsx"` for eksisterende UI

## Backend-krav (Feature 2)

### 1. Server actions for live runde

**Fil:** `lib/portal/round/live-actions.ts` (NY)

```ts
"use server";

export async function startLiveRound(
  courseId: string,
  teeColor: string,
  weather?: { temperature?: number; windSpeed?: number; windDir?: string }
): Promise<{ roundId: string }> {
  // 1. Lag Round-row med isComplete = false
  // 2. Lag RoundLiveState med currentHoleNumber = 1, shotNumber = 0
  // 3. Lag HoleResult-rader for alle 18 hull (eller 9)
  // 4. Return roundId for klient-state
}

export async function logShot(
  roundId: string,
  data: {
    holeNumber: number;
    shotNumber: number;
    club: string;
    fromLie: string;
    fromDistance: number;
    toLie: string;
    toDistance: number;
    fromLat?: number;
    fromLng?: number;
    toLat?: number;
    toLng?: number;
  }
): Promise<{ shotId: string; sgEstimate: number }> {
  // 1. Verifiser at roundId tilhorer brukeren
  // 2. Beregn SG i sanntid via expected-strokes-modell
  // 3. Lagre Shot-row + oppdater RoundLiveState (currentShotNumber++)
}

export async function completeHole(
  roundId: string,
  holeNumber: number,
  finalScore: number,
  putts: number
): Promise<void> {
  // Lukk dette hullet, beveg til neste
}

export async function completeRound(roundId: string): Promise<{
  totalScore: number;
  sgTotal: number;
  sgBreakdown: { ott: number; app: number; arg: number; put: number };
}> {
  // 1. Aggregér alle Shot-rader
  // 2. Beregn endelige SG-tall
  // 3. Marker isComplete = true
  // 4. Slett RoundLiveState
}
```

### 2. Strokes Gained-beregning i sanntid

**Fil:** `lib/portal/strokes-gained/expected-strokes.ts` (utvid hvis finnes, ellers NY)

Bruk PGA Tour benchmark-tabell (allerede i kodebasen, sjekk `lib/portal/strokes-gained/`):

```ts
export function expectedStrokesFromLie(
  lie: "tee" | "fairway" | "rough" | "bunker" | "green",
  distanceMeters: number,
  par: number
): number {
  // Bruk benchmark-tabell, interpolér mellom kjente avstander
}

export function calculateShotSg(
  before: { lie: string; distance: number; par: number },
  after: { lie: string; distance: number; par: number }
): number {
  return expectedStrokesFromLie(before.lie, before.distance, before.par)
       - expectedStrokesFromLie(after.lie, after.distance, after.par)
       - 1; // -1 for slaget som ble gjort
}
```

## Frontend-krav (Feature 2)

### 1. Start-runde-flyt

**Fil:** `app/portal/(dashboard)/runde/start/page.tsx`

- Velg bane (autocomplete fra Course-tabell, eller "Legg til ny bane")
- Velg tee-farge (gul / hvit / blå / rød / svart)
- Vær (valgfritt: temperatur, vind)
- "Start runde"-knapp → kaller `startLiveRound()` → redirect til `/portal/runde/[id]/live`

### 2. Live-runde-UI

**Fil:** `app/portal/(dashboard)/runde/[id]/live/page.tsx` + `live-client.tsx`

**Layout (mobil-forst):**

```
┌──────────────────────────────────────┐
│ Hull 5 av 18 · Par 4 · 380 m         │  ← header
├──────────────────────────────────────┤
│                                      │
│  Slag 2 av ?                         │  ← stort tall i midten
│                                      │
│  [ KOLLE ▼ ]   [ LIE ▼ ]            │  ← dropdowns
│                                      │
│  Distanse til hull:                  │
│  [   125    ]  meter                 │  ← number input
│                                      │
│  Etter slaget:                       │
│  [ NY LIE ▼ ]                       │
│  [   18    ]  meter til hull        │
│                                      │
│  [ ✓ Logg slag ]  ← stor primary    │
│                                      │
├──────────────────────────────────────┤
│ Slag i dette hullet:                 │
│ 1. Driver, tee→fairway, 380→125m    │
│ 2. (logger nå...)                    │
└──────────────────────────────────────┘
[ Forrige hull ]      [ Neste hull → ]
```

**Krav:**
- Kolle-dropdown henter fra spillerens ClubInBag
- Lie-dropdown: tee, fairway, semi-rough, rough, fairway-bunker, greenside-bunker, green, recovery
- Distanse: number input med +/- 5m knapper for raske justeringer
- "Logg slag" lagrer + clearer form, ready for neste slag
- "Neste hull"-knapp lagrer holeScore + bytter currentHoleNumber

### 3. Etter-runde-side

**Fil:** `app/portal/(dashboard)/runde/[id]/oppsummering/page.tsx` (eksisterer kanskje, sjekk)

- Hero: total score (+5 / -2)
- 4 KPI-kort: SG OTT / APP / ARG / PUT
- Tabell over alle hull med score + SG per hull
- Liste over alle slag (collapse-able)

## Akseptansekriterier (Feature 2)

- [ ] Spiller kan starte en runde pa < 30 sekunder
- [ ] Logge ett slag tar < 10 sekunder pa mobil
- [ ] SG beregnes i sanntid og vises etter hvert slag
- [ ] Spiller kan pause runden og fortsette senere (RoundLiveState)
- [ ] Etter runden vises full SG-breakdown + scorekort
- [ ] Coach kan se spillerens runde i `/admin/elever/[id]/v2`
- [ ] All data lagres i Round + Shot, henter fungerer i ettertid
- [ ] Mobil-test pa iPhone 14 Pro: alle knapper > 44px touch-targets

## **Senere fase (NÅ skal IKKE bygges):**
- Mapbox-kart med GPS-tracking
- Auto-detect av lie via course-overlay
- Live-foto-logging av slaget

---

# FEATURE 3 — Treningsanalyse-modul

## Mal

Coach og spiller kan analysere treningsplan med flere filtre samtidig:
- Pyramide-kategori (FYS, TEK, SLAG, SPILL, TURN)
- Treningsomrade (TEE, INN150, CHIP, PUTT0-3, etc.)
- L-fase (L-KROPP, L-ARM, L-KOLLE, L-BALL, L-AUTO)
- CS-niva (CS50-CS100)
- M-miljo (M0=off-course → M5=turnering)
- PR-press (PR1-PR5)

**Eksempel-spørringer:**
- "Vis meg all Driver TEK-trening, L-AUTO, CS80+"
- "Sammenlign Putting (alle distanser) i M3 vs M5"
- "Hvor mye TEE-trening har spilleren gjort siste 90d, gruppert per L-fase?"

## Eksisterende kode

### Prisma-modeller

```prisma
model TrainingPlan {
  id           String   @id
  studentId    String
  isActive     Boolean
  // ...
  TrainingPlanWeek TrainingPlanWeek[]
}

model TrainingPlanWeek {
  id        String   @id
  planId    String
  weekNumber Int
  weekStart DateTime
  // ...
  TrainingPlanSession TrainingPlanSession[]
}

model TrainingPlanSession {
  id              String   @id
  weekId          String
  // Pyramide + omrade
  pyramidCode     String?  // FYS, TEK, SLAG, SPILL, TURN
  area            String?  // TEE, INN150, etc.
  // L-faser
  lPhases         String[] // ["L-KROPP", "L-ARM"]
  // CS, M, PR
  csLevel         String?  // CS50, CS60, ...
  environment     String?  // M0, M1, ...
  pressureLevel   String?  // PR1, PR2, ...
  // ...
  TrainingLog     TrainingLog[]
}

model TrainingLog {
  id            String   @id
  userId        String
  sessionId     String?
  date          DateTime
  durationMinutes Int?
  focusArea     String?
  // ... actuals fra utfort okt
}
```

### Eksisterende filer

- `lib/portal/training/ak-taxonomy.ts` — PYRAMIDE, TRENINGSOMRADER, L_FASER, CS_NIVAER, M_MILJO, PR_PRESS
- `app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx` (2817 linjer — KOMPLEKS)
- `app/portal/(dashboard)/treningsplan/actions.ts` (2408 linjer — masse server actions)

## Backend-krav (Feature 3)

### 1. Server action for filtrert analyse

**Fil:** `lib/portal/training/analysis-actions.ts` (NY)

```ts
"use server";

export interface TrainingFilter {
  userId?: string; // for coach-mode, ellers currentUser
  pyramidCodes?: string[];        // ["TEK"]
  areas?: string[];                // ["TEE", "INN150"]
  lPhases?: string[];              // ["L-AUTO"]
  csLevels?: string[];             // ["CS80", "CS90", "CS100"]
  environments?: string[];          // ["M3", "M4", "M5"]
  pressureLevels?: string[];        // ["PR4", "PR5"]
  fromDate?: Date;
  toDate?: Date;
}

export interface TrainingAnalysisResult {
  totalSessions: number;
  totalMinutes: number;
  byPyramid: Record<string, { sessions: number; minutes: number }>;
  byArea: Record<string, { sessions: number; minutes: number }>;
  byLPhase: Record<string, { sessions: number; minutes: number }>;
  byCsLevel: Record<string, { sessions: number; minutes: number }>;
  byEnvironment: Record<string, { sessions: number; minutes: number }>;
  // Trend over tid
  weeklyTrend: { weekStart: Date; minutes: number }[];
}

export async function analyzeTraining(
  filter: TrainingFilter
): Promise<TrainingAnalysisResult> {
  // SELECT FROM TrainingPlanSession + TrainingLog WHERE filtre matcher
  // GROUP BY pyramidCode, area, lPhases, csLevel, environment, pressureLevel
  // Returner aggregat
}

export async function compareTrainingFilters(
  filter1: TrainingFilter,
  filter2: TrainingFilter
): Promise<{
  filter1: TrainingAnalysisResult;
  filter2: TrainingAnalysisResult;
  delta: { totalSessions: number; totalMinutes: number };
}> {
  // For "sammenlign A vs B"-flyt
}
```

### 2. URL-stat for filter-state

Filter skal serializes til URL slik at lenker kan deles:

```
/portal/treningsplan/analyse?p=TEK,SLAG&l=L-AUTO&cs=CS80,CS90,CS100&from=2026-01-01
```

Bruk `useSearchParams` + helper for parsing.

## Frontend-krav (Feature 3)

### 1. Hovedside: `/portal/treningsplan/analyse`

**Filer:**
- `app/portal/(dashboard)/treningsplan/analyse/page.tsx`
- `app/portal/(dashboard)/treningsplan/analyse/analyse-client.tsx`
- `components/portal/training-analysis/filter-bar.tsx` (NY)
- `components/portal/training-analysis/results-grid.tsx` (NY)

**Layout:**

```
┌──────────────────────────────────────────────────────┐
│ Treningsanalyse                                      │
├──────────────────────────────────────────────────────┤
│ Filtre:                                              │
│ [ Pyramide ▼ TEK,SLAG ]                              │
│ [ Omrade ▼ TEE ]                                     │
│ [ L-fase ▼ L-AUTO ]                                  │
│ [ CS ▼ CS80+ ]                                       │
│ [ Miljo ▼ M3-M5 ]                                    │
│ [ Press ▼ alle ]                                     │
│ [ Periode: siste 90 dager ▼ ]                        │
│                                                      │
│ [ Tom filtre ]  [ Lagre filter ▼ ]                   │
├──────────────────────────────────────────────────────┤
│ Resultat: 23 okter · 14 timer · 4 uker              │
│                                                      │
│ ┌─────────────────┐  ┌─────────────────┐            │
│ │ Per pyramide    │  │ Per omrade      │            │
│ │ TEK: 8 (5t)     │  │ TEE: 12 (7t)    │            │
│ │ SLAG: 15 (9t)   │  │ INN150: 6 (4t)  │            │
│ └─────────────────┘  └─────────────────┘            │
│                                                      │
│ ┌─────────────────────────────────────┐             │
│ │ Trend over tid (uker)               │             │
│ │ ███▓▓░░░██▓░░░▓▓██░░░░              │             │
│ └─────────────────────────────────────┘             │
└──────────────────────────────────────────────────────┘
```

**Krav:**
- Filter-bar: multi-select dropdowns med lucide-ikoner per filter-type
- Filtre persisteres i URL via searchParams
- "Tom filtre" sletter all filtering
- "Sammenlign"-toggle apner et 2-kolonne-layout med filter A vs filter B
- Resultat oppdateres i sanntid (bruk useTransition for optimistic updates)
- Trend-graf: 12-ukers stacked bar (per pyramide-kategori)

### 2. Coach-versjon: `/admin/elever/[id]/treningsanalyse`

Samme komponent som i 1, men med spillerId som ekstra prop. Filter-state inkluderer
ogsa "vis kun aktiv plan" toggle.

## Akseptansekriterier (Feature 3)

- [ ] Spiller kan filtrere pa alle 6 dimensjoner samtidig
- [ ] Filtre persisteres i URL og kan deles
- [ ] Aggregat-resultat oppdateres pa < 500ms
- [ ] Trend-graf viser utvikling over 12 uker
- [ ] Sammenlign-modus viser to filter side-om-side
- [ ] Coach kan kjore samme analyse for en spiller
- [ ] Mobil: filter-bar collapser til "Filtre (3 aktive)" pille
- [ ] Tom-state: hvis ingen treff, vis "Ingen okter matcher filtrene — prov a fjerne noen"

---

# Slik starter du

1. Les `CLAUDE.md` (rotmappe) for prosjekt-konvensjoner
2. Les `.claude/rules/design-system.md` (Brand Guide V2.0)
3. Les `.claude/rules/sprak.md` (terminologi-las)
4. Les `.claude/rules/gotchas.md` (kjente feller)
5. Velg én feature og folg backend-krav -> frontend-krav -> akseptansekriterier
6. Verifiser med `npx tsc --noEmit` + `npx eslint`
7. Commit med formatet `feat(F1/F2/F3): kort beskrivelse`
8. Push til main

**For sporsmal:** Anders er CEO, ikke programmerer. Lag konkrete forslag, ikke
abstrakte alternativer. Hvis du er usikker — bygg det enkleste som dekker
akseptansekriteriene, og dokumenter avgjorelser i kommentarer.

**For state-hĂĄndtering:** Foretrekk URL-state over React state der mulig
(searchParams). Det gjor lenker delbare og state persistent.

---

## Hva Claude jobber med na (ikke ta disse oppgavene)

- B2c: `/admin/dagens-fokus` pixel-rebuild (mockup d1-dagens-fokus.html)
- B2d: `/admin/coaching-board` pixel-rebuild (mockup d3-coaching-board.html)
- B1: Treningsplan pixel-rebuild (mockups a5 + a6)
- B6: TrackMan UI-rebuild (men IKKE upload-flyten — det tar du!)
- D: 20 fastsatte golftester utfor-flow

Disse 3 features er DINE — ingen overlapp.
