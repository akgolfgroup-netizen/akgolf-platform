# Prompt v2 til Kimi Code — TrackMan + Baneguide + Stats + Mer

**Til:** Kimi Code (jobber parallelt med Claude Code)
**Repo:** `~/Developer/akgolf/akgolf-platform/`
**Branch:** `main`
**Stack:** Next.js 16, TypeScript strict, Prisma 7, Supabase, Brand Guide V2.0
**Erstatter:** `docs/kimi-code-prompt-2026-04-29.md` (denne er mer komplett)

## Slik leser du dette dokumentet

Fire features beskrevet under. Du kan jobbe pa én av gangen, eller flere parallelt
om de ikke berorer samme filer. Hver feature har:
- **Mal** (hva spilleren far)
- **Eksisterende kode** (filer du skal bygge pa)
- **Backend-krav** (Prisma + server actions)
- **Frontend-krav** (komponenter + UI)
- **Akseptansekriterier** (slik vet du at du er ferdig)

## Globale regler (gjelder alle 4 features)

- **Brand Guide V2.0:** `--color-primary: #005840`, `--color-accent: #D1F843`, `--color-surface: #F4F6F4`, `--color-card: #FFFFFF`, `--color-ink: #0A1F18`, `--color-sidebar: #0F1F18`. Se `.claude/rules/design-system.md`.
- **Fonter:** Inter Tight (headlines), Inter (body), JetBrains Mono (eyebrows + tall).
- **Ikoner:** `lucide-react` KUN. Aldri Material Symbols, aldri emojier.
- **Maks 300 linjer per fil** — splitt i flere komponenter ved behov.
- **TypeScript strict** — aldri `any` uten kommentar som forklarer hvorfor.
- **Server Components der mulig** — kun `"use client"` der reell interaktivitet.
- **Norsk bokmal** for all brukervendt tekst (sjekk `.claude/rules/sprak.md`).
- **Spiller, aldri elev** — terminologi-las.
- **Mobil-forst** — alle nye sider skal fungere godt pa iPhone 14 Pro / Pixel 7. Touch-targets minst 44px.
- **Verifisering for commit:**
  ```bash
  npx tsc --noEmit
  npx eslint <changed-files>
  ```
- **Commit-format:** `feat(F1/F2/F3/F4): kort beskrivelse` — `git add <spesifikke filer>` (ALDRI `git add -A`)
- **Ikke jobb pa samme fil samtidig som Claude.** Sjekk `git log` for siste commits for du starter.

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

## Eksisterende kode

### Prisma-modeller (allerede i schema)

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
  // ...
}

model TrackManShotData {
  id              String  @id
  sessionId       String
  userId          String
  shotNumber      Int
  club            String
  clubCategory    String?
  ballSpeed       Float?
  launchAngle     Float?
  launchDirection Float?
  spinRate        Float?
  spinAxis        Float?
  carryDistance   Float?
  totalDistance   Float?
  maxHeight       Float?
  landingAngle    Float?
  hangTime        Float?
  // ... (sjekk schema for full liste)
}

model ClubInBag {
  // Spillerens 14 valgte koller med snitt-distanser
  // Allerede migrert 2026-04-29
}
```

### Eksisterende filer

- `lib/portal/trackman/import-service.ts` — CSV-import
- `lib/portal/trackman/ai-insights.ts` — Anthropic SDK-pattern
- `components/portal/trackman/club-comparison.tsx`
- `components/portal/trackman/club-waveform.tsx`
- `components/portal/trackman/shot-dispersion-chart.tsx`
- `app/portal/(dashboard)/trackman/trackman-client.tsx`

## Backend-krav (F1)

### 1. Server actions for upload

**Fil:** `lib/portal/trackman/upload-actions.ts` (NY)

```ts
"use server";
import Anthropic from "@anthropic-ai/sdk";

export async function uploadTrackmanImage(
  fileBuffer: Buffer,
  metadata: { sessionDate: Date; club?: string; notes?: string }
): Promise<{ sessionId: string; shotsImported: number; confidence: number }>;

export async function uploadTrackmanCsv(
  csvText: string,
  metadata: { sessionDate: Date; club?: string }
): Promise<{ sessionId: string; shotsImported: number }>;
```

### 2. Vision-prompt (kritisk)

```
Du er en TrackMan-data-parser. Bildet viser et TrackMan-skjermbilde med slag-data.

Returner KUN JSON i dette formatet:

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
- confidence 0-1 basert pa bildekvalitet og lesbarhet.
```

### 3. Aggregering

**Fil:** `lib/portal/trackman/aggregate.ts` (NY)

```ts
export async function getClubAggregates(userId: string): Promise<ClubAggregate[]>;
export async function getClubTrend(userId: string, club: string, days: number): Promise<TrendData>;
```

## Frontend-krav (F1)

### 1. Upload-side: `/portal/trackman/last-opp`

- Tabs: "Last opp bilde" | "Last opp CSV"
- Drag-drop-zone for begge
- Forhandsvisning av bilde for upload
- Manuell metadata-form: dato (default i dag), kolle (dropdown fra ClubInBag), notater
- Progress-indikator under upload (5-15 sek pga Vision-API)
- Suksess: "X slag importert" + lenke til oktdetalj
- Feilhandtering: vis konfidens-score + mulighet for manuell korreksjon

### 2. Spredning-visualisering

**Fil:** `components/portal/trackman/dispersion-plot.tsx` (NY)

SVG-basert spredningsplot:
- X-akse: lateral spredning (-30m til +30m)
- Y-akse: distanse (0-300m)
- Hvert slag = sirkel (storrelse = ball speed, farge = kolle)
- Center-target som referanse
- Tooltip pa hover

### 3. Side per kolle: `/portal/trackman/[club]`

- Hero med snitt-tall (carry, ball speed, smash factor, spinrate)
- Spredningsplot for siste 90 dager
- Trend-graf: snitt-carry per uke siste 12 uker
- Tabell: siste 20 slag

## Akseptansekriterier (F1)

- [ ] Spiller kan laste opp TrackMan-bilde fra mobil-kamera
- [ ] AI parser bildet og lagrer minst 5 slag korrekt
- [ ] CSV-import fortsetter a fungere
- [ ] Spredningsplot viser X/Y-dispersion per kolle
- [ ] Trend-graf viser snitt-carry over tid
- [ ] Coach kan se spillerens TrackMan-data i `/admin/elever?id=<userId>`
- [ ] Upload tar < 15 sek for bilde med 6 slag
- [ ] Vision-feil viser tydelig melding + manuell korreksjon

---

# FEATURE 2 — Statistikk: UpGame-kopiering (manuell)

## Mal

Spilleren forer slag-for-slag-statistikk pa banen via mobil:
- Hvert slag: kolle, distanse, lie (fairway/rough/bunker/green)
- Etter runden: full Strokes Gained-analyse + scorekort

**Fase 1 (DENNE):** Manuell foring uten kart. Rask, mobilvennlig flyt.
**Fase 2 (Feature 3):** Mapbox baneguide-integrasjon med GPS-auto-detect.

## Eksisterende kode

### Prisma-modeller (allerede migrert)

```prisma
model Round { /* ... */ }
model HoleResult { /* ... */ }

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
  // SG
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
```

## Backend-krav (F2)

### 1. Live-runde server actions

**Fil:** `lib/portal/round/live-actions.ts` (NY)

```ts
"use server";

export async function startLiveRound(
  courseId: string,
  teeColor: string,
  weather?: { temperature?: number; windSpeed?: number; windDir?: string }
): Promise<{ roundId: string }>;

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
    fromLat?: number;  // valgfritt — F3 fyller dette
    fromLng?: number;
    toLat?: number;
    toLng?: number;
  }
): Promise<{ shotId: string; sgEstimate: number }>;

export async function completeHole(
  roundId: string,
  holeNumber: number,
  finalScore: number,
  putts: number
): Promise<void>;

export async function completeRound(roundId: string): Promise<{
  totalScore: number;
  sgTotal: number;
  sgBreakdown: { ott: number; app: number; arg: number; put: number };
}>;
```

### 2. Real-time SG-beregning

**Fil:** `lib/portal/strokes-gained/expected-strokes.ts` (utvid hvis finnes)

Bruk PGA Tour benchmark-tabell:

```ts
export function expectedStrokesFromLie(
  lie: "tee" | "fairway" | "rough" | "bunker" | "green",
  distanceMeters: number,
  par: number
): number;

export function calculateShotSg(
  before: { lie: string; distance: number; par: number },
  after: { lie: string; distance: number; par: number }
): number;
```

## Frontend-krav (F2)

### 1. Start-runde-flyt: `/portal/runde/start`

- Velg bane (autocomplete fra Course-tabell, eller "Legg til ny bane")
- Velg tee-farge
- Vær (valgfritt)
- "Start runde" → kaller `startLiveRound()` → redirect til `/portal/runde/[id]/live`

### 2. Live-runde-UI: `/portal/runde/[id]/live`

**Mobil-forst layout:**

```
┌──────────────────────────────────────┐
│ Hull 5 av 18 · Par 4 · 380 m         │
├──────────────────────────────────────┤
│ Slag 2 av ?                          │
│                                      │
│ [ KOLLE ▼ ]   [ LIE ▼ ]             │
│                                      │
│ Distanse til hull:                   │
│ [   125    ]  meter                  │
│                                      │
│ Etter slaget:                        │
│ [ NY LIE ▼ ]                        │
│ [   18    ]  meter til hull         │
│                                      │
│ [ ✓ Logg slag ]  ← stor primary     │
│                                      │
│ Slag i dette hullet:                 │
│ 1. Driver, tee→fairway, 380→125m    │
└──────────────────────────────────────┘
[ Forrige hull ]   [ Neste hull → ]
```

**Krav:**
- Kolle-dropdown henter fra ClubInBag
- Lie-dropdown: tee, fairway, semi-rough, rough, fairway-bunker, greenside-bunker, green, recovery
- Distanse: number input med +/- 5m raske justeringer
- "Logg slag" lagrer + clearer form
- "Neste hull" lagrer holeScore + bytter currentHoleNumber

### 3. Etter-runde: `/portal/runde/[id]/oppsummering`

- Hero: total score (+5 / -2)
- 4 KPI: SG OTT / APP / ARG / PUT
- Tabell over alle hull med score + SG per hull
- Liste over alle slag

## Akseptansekriterier (F2)

- [ ] Spiller kan starte runde pa < 30 sek
- [ ] Logge ett slag tar < 10 sek pa mobil
- [ ] SG beregnes i sanntid og vises etter hvert slag
- [ ] Pause/resume via RoundLiveState
- [ ] Etter runden: full SG-breakdown + scorekort
- [ ] Coach kan se runden i `/admin/elever?id=<userId>`
- [ ] Mobil: alle knapper > 44px touch-targets

---

# FEATURE 3 — Baneguide (Mapbox-integrasjon)

## Mal

Visuell baneguide som UpGame Pro: spilleren ser hvert hull pa kart, GPS-tracking
viser hvor de star, automatisk lie-detection, og slag visualiseres pa kartet.

Integrert med F2 (live-runde):
- F2 = manuell foring uten kart
- F3 = kart-basert foring der GPS gjor det raskere

**Spilleren skal kunne:**
- Se hver hull-layout (tee → fairway → green)
- Sette markor pa kartet for "her star jeg"
- Tappe pa kartet for "her landet ballen"
- Auto-foreslar kolle basert pa GPS-distanse

## Tech-valg

**Mapbox GL JS** — beste valg pga:
- Vector-tiles for offline-bruk
- Custom styling (matcher Brand Guide V2.0)
- Stotte for satellite + custom layers
- Aktiv React-integrasjon (`react-map-gl`)

**Alternativ: Leaflet + OpenStreetMap** — gratis, men mindre presist.

**Anbefaling:** Start med Mapbox. Bruk personal access token i MVP, bytt til
Mapbox Pro (~$100/mnd) nar dere skalerer.

## Eksisterende kode

### Prisma-modeller (allerede)

```prisma
model Course {
  id           String   @id
  name         String
  location     String?
  latitude     Float?
  par          Int
  // ...
  Hole         Hole[]
}

model Hole {
  id          String   @id
  courseId    String
  holeNumber  Int
  par         Int
  lengthMeter Int
  latitude    Float?      // tee-posisjon
  longitude   Float?
  greenLat    Float?
  greenLon    Float?
  strategy    Json?       // baneguide-data (NY!)
  // ...
}
```

### Hva som mangler

- `Course.geojson` JSON-felt for full bane-polygoner
- `Hole.strategyOverlay` JSON for lie-soner (fairway/rough/bunker)
- Mapbox SDK-integrasjon
- Lie-detection-logikk fra GPS

## Backend-krav (F3)

### 1. Utvid Course + Hole med geo-data

**Fil:** `prisma/migrations/<dato>_courseguide/migration.sql` (NY)

```sql
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "geojson" JSONB;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "boundsLat" JSONB;  -- {min, max}
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "boundsLng" JSONB;

ALTER TABLE "Hole" ADD COLUMN IF NOT EXISTS "strategyOverlay" JSONB;
-- Eksempel:
-- {
--   "fairway": [[lat,lng], [lat,lng], ...],
--   "rough": [...],
--   "bunkers": [{"name": "fwy-left", "polygon": [...]}],
--   "greens": [...],
--   "hazards": [...]
-- }
```

### 2. Lie-detection fra GPS

**Fil:** `lib/portal/round/lie-detection.ts` (NY)

```ts
import type { Position } from "geojson";

export function detectLieFromGps(
  position: Position,
  hole: { strategyOverlay: HoleStrategyOverlay }
): "tee" | "fairway" | "rough" | "bunker" | "green" | null {
  // Bruk turf.js (point-in-polygon) for a sjekke hvilket area
  // 1. Sjekk om i green
  // 2. Sjekk om i bunker
  // 3. Sjekk om i fairway
  // 4. Default: rough
}
```

Installer `@turf/turf` for geometri-beregninger.

### 3. Baneguide-import (admin)

**Fil:** `lib/portal/courses/import-geojson.ts` (NY)

```ts
export async function importCourseGeoJson(
  courseId: string,
  geojson: GeoJSON.FeatureCollection
): Promise<{ holesUpdated: number }>;
```

For nå: manuell import via admin-side. Senere kan dette automatiseres via
Google Maps API for a auto-genere bane-overlay.

## Frontend-krav (F3)

### 1. Installer Mapbox

```bash
npm install mapbox-gl react-map-gl @turf/turf
```

Legg til i `app/layout.tsx`:
```tsx
<link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v3.7.0/mapbox-gl.css" />
```

Sett env-var `NEXT_PUBLIC_MAPBOX_TOKEN`.

### 2. Live-runde-side med kart: `/portal/runde/[id]/live`

**Layout (mobil-forst):**

```
┌──────────────────────────────────────┐
│ Hull 5 · Par 4 · 380 m              │ ← header (fixed top)
├──────────────────────────────────────┤
│                                      │
│           [ MAPBOX KART ]            │ ← 60% av skjerm
│                                      │
│   Tee 🏷️                            │
│         ●  ← din posisjon (GPS)      │
│              \                       │
│               ●  ← tappet "ny posisjon"│
│                       Green          │
│                                      │
├──────────────────────────────────────┤
│ Distanse: 125 m  ← auto-beregnet    │
│ Lie: Fairway     ← auto-detektert   │
│                                      │
│ [ 7-iron ▼ ] ← AI-foreslar          │
│ [ ✓ Logg slag ]                     │
└──────────────────────────────────────┘
```

**Krav:**
- Kart sentreres pa current hull (Hole.latitude, longitude)
- Vis tee-marker, green-marker
- GPS-prikk (med `navigator.geolocation`)
- Tap-for-a-sette-mal-marker (eller auto-bruk GPS for "fra-posisjon")
- Auto-distanse-beregning (turf.distance)
- Auto-lie-detection
- Kolle-foreslag basert pa distanse + ClubInBag

### 3. Admin: bane-import-side: `/admin/baner/[id]/import`

For Anders/coaches a laste opp GeoJSON for nye baner:
- Drag-drop GeoJSON-fil
- Forhandsvisning pa kart
- "Lagre"-knapp som kaller `importCourseGeoJson`

### 4. Komponentbibliotek

**Filer:**
- `components/portal/round/course-map.tsx` (NY) — Mapbox-wrapper
- `components/portal/round/hole-map.tsx` (NY) — single hull
- `components/portal/round/shot-marker.tsx` (NY) — slag-markor
- `components/portal/round/club-suggester.tsx` (NY) — AI-kolle-foreslag

## Akseptansekriterier (F3)

- [ ] Mapbox-kart vises riktig pa mobil
- [ ] GPS-prikk oppdateres i sanntid
- [ ] Tap pa kartet setter mal-marker
- [ ] Auto-distanse vises korrekt (testet mot manuell maling)
- [ ] Auto-lie-detection fungerer for alle 5 lie-typer
- [ ] Kolle-foreslag basert pa distanse + ClubInBag.avgCarryMeters
- [ ] Off-line: kart fungerer uten internett (vector-tiles cached)
- [ ] Coach kan se slag-markoringer i `/admin/elever?id=<userId>` for hver runde

## Kostnads-vurdering

- **Mapbox personal access token:** gratis opp til 50 000 map-loads/mnd
- **Mapbox Pro:** $100/mnd ved storre volum
- **Custom satellite-bilder:** $0.50/km² for hoy-oppløsning av spesifikke baner
- **Anbefaling:** Start gratis. Test med 5-10 spillere pa Gamle Fredrikstad GK.
  Bytt til Pro nar dere har > 50 aktive brukere.

---

# FEATURE 4 — Treningsanalyse-modul

## Mal

Coach og spiller kan analysere treningsplan med flere filtre samtidig:
- Pyramide-kategori (FYS, TEK, SLAG, SPILL, TURN)
- Treningsomrade (TEE, INN150, CHIP, PUTT0-3, etc.)
- L-fase (L-KROPP, L-ARM, L-KOLLE, L-BALL, L-AUTO)
- CS-niva (CS50-CS100)
- M-miljo (M0-M5)
- PR-press (PR1-PR5)

**Eksempel-sporringer:**
- "Vis meg all Driver TEK-trening, L-AUTO, CS80+"
- "Sammenlign Putting i M3 vs M5"
- "TEE-trening siste 90d gruppert per L-fase"

## Eksisterende kode

```prisma
model TrainingPlan { /* ... */ }
model TrainingPlanWeek { /* ... */ }
model TrainingPlanSession {
  id              String   @id
  weekId          String
  pyramidCode     String?  // FYS, TEK, SLAG, SPILL, TURN
  area            String?  // TEE, INN150, etc.
  lPhases         String[] // ["L-KROPP", "L-ARM"]
  csLevel         String?
  environment     String?
  pressureLevel   String?
  TrainingLog     TrainingLog[]
}
model TrainingLog { /* ... actuals */ }
```

- `lib/portal/training/ak-taxonomy.ts` — PYRAMIDE, TRENINGSOMRADER, L_FASER, CS_NIVAER, M_MILJO, PR_PRESS

## Backend-krav (F4)

### Server action for filtrert analyse

**Fil:** `lib/portal/training/analysis-actions.ts` (NY)

```ts
"use server";

export interface TrainingFilter {
  userId?: string;
  pyramidCodes?: string[];
  areas?: string[];
  lPhases?: string[];
  csLevels?: string[];
  environments?: string[];
  pressureLevels?: string[];
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
  weeklyTrend: { weekStart: Date; minutes: number }[];
}

export async function analyzeTraining(filter: TrainingFilter): Promise<TrainingAnalysisResult>;
export async function compareTrainingFilters(filter1, filter2): Promise<{...}>;
```

### URL-state

```
/portal/treningsplan/analyse?p=TEK,SLAG&l=L-AUTO&cs=CS80,CS90,CS100&from=2026-01-01
```

## Frontend-krav (F4)

### Hovedside: `/portal/treningsplan/analyse`

```
┌──────────────────────────────────────────────────────┐
│ Treningsanalyse                                      │
├──────────────────────────────────────────────────────┤
│ Filtre:                                              │
│ [ Pyramide ▼ TEK,SLAG ]  [ Omrade ▼ TEE ]           │
│ [ L-fase ▼ L-AUTO ]  [ CS ▼ CS80+ ]                  │
│ [ Miljo ▼ M3-M5 ]  [ Press ▼ alle ]                  │
│ [ Periode: siste 90 dager ▼ ]                        │
│ [ Tom filtre ]  [ Sammenlign ]                       │
├──────────────────────────────────────────────────────┤
│ Resultat: 23 okter · 14 timer · 4 uker              │
│                                                      │
│ ┌─ Per pyramide ──┐  ┌─ Per omrade ──┐              │
│ │ TEK: 8 (5t)     │  │ TEE: 12 (7t)  │              │
│ │ SLAG: 15 (9t)   │  │ INN150: 6 (4t)│              │
│ └─────────────────┘  └───────────────┘              │
│                                                      │
│ Trend over tid (uker): ███▓▓░░░██▓░░░               │
└──────────────────────────────────────────────────────┘
```

**Krav:**
- Multi-select dropdowns med lucide-ikoner
- Filtre persisteres i URL via searchParams
- "Sammenlign"-toggle apner 2-kolonne (filter A vs B)
- Resultat oppdateres pa < 500ms
- Trend-graf: 12-ukers stacked bar per pyramide-kategori

### Coach-versjon: `/admin/elever?id=<userId>` har "Treningsanalyse"-tab

Samme komponent, men med spillerId som prop.

## Akseptansekriterier (F4)

- [ ] Spiller kan filtrere pa alle 6 dimensjoner samtidig
- [ ] Filtre persisteres i URL og kan deles
- [ ] Aggregat oppdateres pa < 500ms
- [ ] Trend-graf viser 12 uker
- [ ] Sammenlign-modus viser to filter side-om-side
- [ ] Coach kan kjore samme analyse for spiller
- [ ] Mobil: filter-bar collapser til "Filtre (3 aktive)" pille
- [ ] Tom-state: "Ingen okter matcher — prov a fjerne noen filtre"

---

# Slik starter du

1. Les `CLAUDE.md` (rotmappe)
2. Les `.claude/rules/design-system.md` (Brand Guide V2.0)
3. Les `.claude/rules/sprak.md` (terminologi-las)
4. Les `.claude/rules/gotchas.md` (kjente feller)
5. Velg én feature og folg backend-krav → frontend-krav → akseptansekriterier
6. Verifiser med `npx tsc --noEmit` + `npx eslint`
7. Commit med formatet `feat(F1/F2/F3/F4): kort beskrivelse`
8. Push til main

## Anbefalt rekkefolge

**Hvis du gjor ÉN av gangen:**
1. F1 TrackMan (3-4 dager) — mest gjenbruk, lavest risiko
2. F2 Stats manuell (3 dager) — bygger pa eksisterende Round-modell
3. F3 Baneguide Mapbox (5-7 dager) — krever ny avhengighet, mer komplekst
4. F4 Treningsanalyse (2-3 dager) — kun query + UI, ingen nye modeller

**Total estimat:** 13-17 dager.

## Hva Claude jobber med (ikke ta disse)

- B2c: `/admin/dagens-fokus` pixel-rebuild (mockup d1-dagens-fokus.html)
- B2d: `/admin/coaching-board` pixel-rebuild (mockup d3-coaching-board.html)
- B1: Treningsplan pixel-rebuild (mockups a5 + a6) — kun layout, ikke data
- B6: TrackMan UI-rebuild (men IKKE upload-flyten — det tar du i F1!)
- D: 20 fastsatte golftester utfor-flow

Alle 4 features er DINE — ingen overlapp.

## Sporsmal og kontakt

Anders er CEO, ikke programmerer. Lag konkrete forslag, ikke abstrakte
alternativer. Hvis du er usikker — bygg det enkleste som dekker
akseptansekriteriene, og dokumenter avgjorelser i kommentarer.

For state-handtering: foretrekk URL-state over React state der mulig
(searchParams). Det gjor lenker delbare og state persistent.
