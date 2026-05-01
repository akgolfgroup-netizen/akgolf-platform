# MASTER PROMPT — Kimi Code YOLO Modus

**Til:** Kimi Code
**Repo:** `~/Developer/akgolf/akgolf-platform/`
**Branch:** `main` (push fortlopende)
**Modus:** YOLO — auto-godkjenne alt, jobb autonomt 4-8 timer
**Mal:** Fullfor sa mye som mulig av "Alternativ 3 Komplett"-planen

## ⚡ Slik kjorer du dette

```bash
cd ~/Developer/akgolf/akgolf-platform
claude --dangerously-skip-permissions
# Lim inn hele dette dokumentet som forste melding
```

YOLO betyr:
- Du **godkjenner alle git operations selv** (auto-commit, auto-push)
- Du **trenger ingen bekreftelse fra Anders** for endringer
- Du **fortsetter til neste oppgave automatisk** etter ferdig
- Du **stopper KUN** ved kritiske feil (build broken, TS > 10 errors)

---

## 🎯 Hovedmal

Fullfor disse 4 prioriteringer i rekkefolge:

1. **P1 — Lansering-kritisk** (2-3 dager arbeid, ma gjores forst)
2. **P2 — Pre-lansering polish** (4-5 dager)
3. **P3 — Sprint 7 tester + docs** (2 dager)
4. **P4 — Nye features F1-F4** (10-13 dager — kommer du langt nok pa ditt skift)

Alt er listet i prioritert rekkefolge under. **Hopp over en oppgave hvis du sitter fast > 30 min** og dokumenter i WORKLOG.

---

## 🔒 Globale regler (gjelder ALLE oppgaver)

### Stack
- Next.js 16 App Router, TypeScript strict, React 19
- Prisma 7, Supabase, Tailwind v4
- Brand Guide V2.0: `#005840` primary, `#D1F843` accent, `#F4F6F4` surface
- Inter Tight (heading), Inter (body), JetBrains Mono (tall + eyebrow)
- Lucide-ikoner KUN — aldri Material Symbols, aldri emojier
- Norsk bokmal i all brukervendt tekst — sjekk `.claude/rules/sprak.md`

### Konvensjoner
- **"Spiller" — aldri "elev"** (terminologi-las)
- **Aldri** `git add -A` eller `git add .` — alltid spesifikke filer
- **Aldri** sertifiseringer (PGA, TrackMan, TPI)
- **Aldri** MVA pa kundevendte sider
- **Maks 300 linjer per fil** — splitt i komponenter
- **Server Components der mulig** — kun "use client" der reell interaktivitet
- **Mobil-forst** — alle nye sider testes pa iPhone 14 Pro / Pixel 7
- **44px touch-targets** minimum

### Verifikasjon for hver commit
```bash
npx tsc --noEmit
npx eslint <changed-files>
```
Begge MA returnere 0 errors. Hvis ikke — fix forst, ELLER reverter og hopp over.

### Commit-format
```
<type>(<sprint>): <kort beskrivelse>

<lengre forklaring hvis nodvendig>

Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```
Eksempel: `feat(B6.1): TrackMan v2 KPI-rad + filter-bar`

### Per oppgave-protokoll
1. **Les** mockup hvis relevant
2. **Inspiser** eksisterende kode for gjenbruk
3. **Implementer** med splittede komponenter (< 300 linjer hver)
4. **Verifiser** TS + lint
5. **Commit** med spesifikke filer
6. **Push** umiddelbart til main
7. **Oppdater WORKLOG** med commit-ID + 1-linje sammendrag
8. **Gå til neste oppgave**

### Stop-conditions (KUN disse stopper deg)
- TypeScript > 10 errors (etter pa-gaende oppgave)
- Build feiler (`npm run build`)
- Git push avvises (push first, fix conflict)
- Du sitter fast > 30 min pa samme oppgave (hopp over + dokumenter)
- Anders sender ny instruks via chat

---

# P1 — LANSERING-KRITISK (gjor forst — 2-3 dager)

## P1.1 — Fix Mapbox/turf-dependencies (15 min)

```bash
cd ~/Developer/akgolf/akgolf-platform
npm install mapbox-gl react-map-gl @turf/turf @turf/distance @turf/boolean-point-in-polygon
npm install -D @types/geojson @types/mapbox-gl
```

Verifiser:
```bash
npx tsc --noEmit | grep -E "mapbox|turf|geojson"
# Skal returnere INGEN linjer (alle TS-feil borte)
```

Commit: `chore(deps): install mapbox + turf dependencies`. Push.

## P1.2 — B2d Coaching Board fullforing (0.5-1 dag)

**Mockup:** `public/design-reference/handoff-2026-04-27/screens/d3-coaching-board.html`

**Eksisterende:**
- `app/admin/(authed)/coaching-board/page.tsx` (35 linjer)
- `app/admin/(authed)/coaching-board/coaching-board-client.tsx` (77 linjer)
- `app/admin/(authed)/coaching-board/coaching-board-dark-client.tsx` (120 linjer)
- `app/admin/(authed)/coaching-board/actions.ts` (652 linjer)

**Sjekkliste:**
1. Les `d3-coaching-board.html` 1:1
2. Sammenlign med `coaching-board-dark-client.tsx`
3. Identifiser hva som mangler (kanban-kolonner, fokus-pills, "Aktive okter"-counter)
4. Implementer manglende seksjoner
5. Erstatt eventuelt mock-data med real fra `actions.ts`

**Akseptansekriterier:**
- [ ] Layout matcher d3-mockup pixel-naer
- [ ] Real data der mock var
- [ ] Mobil: kolonner stables vertikalt
- [ ] TS + lint 0 errors

Commit: `feat(B2d): coaching-board pixel-rebuild matchet til d3`

## P1.3 — B6 TrackMan UI-rebuild (1.5-2 dager)

**Mockup:** `public/design-reference/handoff-2026-04-27/screens/trackman.html`

**Eksisterende:**
- `app/portal/(dashboard)/trackman/v2/page.tsx` (33 linjer)
- `components/portal/trackman-v2/{filter-bar, kpi-row, shots-table, trackman-v2-client}.tsx`
- Charts allerede dynamic-loaded i `components/portal/trackman/`

**Mangler:**
1. Charts-integrasjon i v2 (gjenbruk eksisterende `club-comparison`, `club-waveform`, `shot-dispersion-chart`)
2. Real data hookup (TrackmanShotData)
3. Mobil-tilpasning (KPI 2-kolonne pa mobile, charts vertikalt)
4. Aktivering via `?v=2` query (cookie 30 dager)

**Filer a opprette/fullfore:**
- `components/portal/trackman-v2/charts-section.tsx` — embed eksisterende dynamic-loaded charts
- `components/portal/trackman-v2/insights-card.tsx` — AI-insights per kolle (gjenbruk eksisterende `lib/portal/trackman/ai-insights.ts`)

**Akseptansekriterier:**
- [ ] V2 aktiveres via `?v=2`
- [ ] V1 fortsatt fungerer
- [ ] KPI-rad viser real snitt-tall fra siste 90 dager
- [ ] Filter-bar fungerer (kolle, periode)
- [ ] Charts integrert
- [ ] Mobil: alt fungerer pa iPhone 14 Pro

Commit: `feat(B6): TrackMan v2 fullforing — charts + real data + mobil`

## P1.4 — D.4 input-komponenter polish (1 dag)

**Mappe:** `components/portal/tester/inputs/` (TOM)

**Eksisterende generic input fungerer**, men 5 dedikerte komponenter gir bedre UX:

```ts
// components/portal/tester/inputs/single-number-input.tsx
// For: Test 1, 7, 17, 18, 19, 20
// 1 felt med large display (40px font, +/- knapper)

// components/portal/tester/inputs/distance-array-input.tsx
// For: Test 2, 3, 4, 5, 9, 10
// 5-10 felter i 3-kolonne grid (mobile: 2-kolonne)

// components/portal/tester/inputs/percentage-attempts-input.tsx
// For: Test 6, 12, 13, 14, 16
// 5-kolonne tally-grid med checkboxes (mobile: 4-kolonne)

// components/portal/tester/inputs/score-per-attempt-input.tsx
// For: Test 8, 11
// 0/1/2-velger per slag (10 slag for test 8, 5 for test 11)

// components/portal/tester/inputs/distance-past-hole-input.tsx
// For: Test 15
// 10 felter med +/- (lengdekontroll i cm forbi hull)
```

**Generic dispatcher:**
```ts
// components/portal/tester/test-input-form.tsx
// Discriminator basert pa testNumber → riktig sub-komponent
const INPUT_TYPE_BY_TEST: Record<number, InputType> = {
  1: "single-number", 7: "single-number", 17: "single-number",
  18: "single-number", 19: "single-number", 20: "single-number",
  2: "distance-array", 3: "distance-array", 4: "distance-array",
  5: "distance-array", 9: "distance-array", 10: "distance-array",
  6: "percentage-attempts", 12: "percentage-attempts",
  13: "percentage-attempts", 14: "percentage-attempts", 16: "percentage-attempts",
  8: "score-per-attempt", 11: "score-per-attempt",
  15: "distance-past-hole",
};
```

Modifiser `app/portal/(dashboard)/tester/[testNumber]/page.tsx` til a bruke `<TestInputForm>`.

**Akseptansekriterier:**
- [ ] Alle 20 tester ruter til riktig input-type
- [ ] Mobil: 5-kolonne tally blir 4-kolonne pa <600px
- [ ] Submit lagrer riktig rawInput-format

Commit: `feat(D.4): 5 dedikerte input-komponenter for test-utforing`

---

# P2 — PRE-LANSERING POLISH (4-5 dager)

## P2.1 — B1 Treningsplan v2 fullforing (3-4 dager)

**Mockups:**
- `public/design-reference/handoff-2026-04-27/screens/a5-treningsplan.html` (uke-oversikt)
- `public/design-reference/handoff-2026-04-27/screens/a6-treningsplan-detalj.html` (okt-detalj)

**Eksisterende:**
- `app/portal/(dashboard)/treningsplan/v2/page.tsx` (115 linjer)
- `components/portal/treningsplan-v2/{day-card, session-pill, types, week-strip}.tsx`

**Mangler — bygg disse:**

### P2.1.a Komponenter (1 dag)

```
components/portal/treningsplan-v2/
├── mini-stat.tsx            # KPI-kort (Volum, Okter, Putt 3-fot, Streak)
├── exercise-card.tsx        # Library-kort med thumb + badge + duration
├── exercise-row.tsx         # Okt-detalj rad med checkbox + meta + dur
├── library-grid.tsx         # 3-kolonne grid med exercise-cards
├── stats-row.tsx            # 4 mini-stats horisontalt
├── today-card.tsx           # "Dagens okt"-block med ovelses-liste
└── filter-row.tsx           # Filter-chips (Alle / Putting / Iron / Short / Driver / Mental / Med video)
```

### P2.1.b Uke-oversikt-side (a5) (1 dag)

`app/portal/(dashboard)/treningsplan/v2/page.tsx` — utvid med:
- Header med uke-label + nav-knapper
- `<WeekStrip>` (allerede laget)
- `<StatsRow>` (4 mini-stats)
- `<TodayCard>` (dagens okt med ovelses-liste)
- `<FilterRow>` + `<LibraryGrid>` (ovelses-bibliotek)

Data fra eksisterende `app/portal/(dashboard)/treningsplan/actions.ts`.

### P2.1.c Okt-detalj-side (a6) (1 dag)

```
app/portal/(dashboard)/treningsplan/v2/[sessionId]/page.tsx
```

- Hero med tittel + dato + okt-id
- Ovelser gruppert (warm-up / hovedfokus / cool-down)
- Per ovelse: `<ExerciseRow>` med checkbox
- Coach-feedback panel
- "Logg som utfort"-knapp

### P2.1.d Aktivering + mobil (0.5 dag)

- Cookie-flag `treningsplan_v2` i `proxy.ts` (kopier fra `BOOKING_V2_COOKIE`-pattern linje 27-28)
- `?v2=1` setter cookie 30 dager
- `?v2=0` fjerner cookie
- Banner i v1: "Prov ny treningsplan-design"
- Mobil: stable kort vertikalt < 768px

**Akseptansekriterier:**
- [ ] V2 aktiveres via `?v2=1` cookie
- [ ] V1 forsetter a fungere
- [ ] Real data fra eksisterende actions
- [ ] Mobil: alt fungerer pa iPhone 14 Pro

Commits: `feat(B1.1)`, `feat(B1.2)`, `feat(B1.3)`, `feat(B1.4)` per sprint-del.

## P2.2 — Sprint 6.3 sekundaere sider (2 dager)

12-15 sider som mangler Brand Guide V2.0-styling. **30-60 min per side.**

**Portal-sider:**
1. `/portal/kalender` — bytt til V2 cards med `bg-card border border-line`
2. `/portal/meldinger` — drawer-pattern fra PlayerHQSidebar (mobile)
3. `/portal/sosialt` — friend-list med V2-tokens
4. `/portal/turneringer` — KPI-kort med Brand Guide V2.0
5. `/portal/analyse` — gjenbruk SgCard / Sparkline-pattern
6. `/portal/benchmark` — gjenbruk eksisterende ComparisonGrid
7. `/portal/sammenligning` — peer-radar i V2
8. `/portal/ai-coach` — chat-UI med V2-tokens
9. `/portal/coaching-historikk` — timeline med V2-cards
10. `/portal/tester` — FERDIG (D-feature)
11. `/portal/bag` — ClubInBag-display
12. `/portal/mental` — MentalProfile cards
13. `/portal/strategi` — DECADE-kort
14. `/portal/apper` — feature-grid
15. `/portal/abonnement` — plan-cards
16. `/portal/profil-innst` — settings-form

**Admin-sider:**
17. `/admin/tilgjengelighet` — calendar-view i V2
18. `/admin/kapasitet` — utilization-charts
19. `/admin/focus` — kanban (gjenbruk fra coaching-board)
20. `/admin/denne-uken` — kalender-view
21. `/admin/e-postmaler` — list + editor
22. `/admin/push-varsler` — notification-templates
23. `/admin/ai-assistent` — chat-UI
24. `/admin/analytics` — dashboard med charts

**Per side-pattern:**
1. Identifiser hovedstruktur (hero, KPI, table, etc.)
2. Bytt Heritage-tokens til V2 (`bg-emerald-950` → `bg-sidebar`, `bg-card-old` → `bg-card`)
3. Bytt Material Symbols til lucide-react
4. Mobil-tilpas (single-col under 768px)
5. Verifiser TS + lint
6. Commit: `feat(6.3): <sidenavn> V2-styling`

## P2.3 — Sprint 6.4 Treningsplan-features (1.5 dag)

| Oppgave | Filer | Estimat |
|---|---|---|
| TP-1: "Foresla i stedet"-knapp | `app/admin/(authed)/treningsplan/treningsplan-client.tsx` | 2t |
| TP-3: PlanChangeLog-modell + UI | Prisma migration + `lib/portal/treningsplan/change-log.ts` | 4t |
| TP-5: PyramidActuals header-bar | `components/portal/treningsplan/pyramid-header.tsx` | 2t |
| TP-6: Fjern hardkodet periodType | `app/admin/(authed)/treningsplan/actions.ts:1379` | 1t |
| TP-8: `/admin/periodisering/[playerId]` UI | Ny rute | 4t |

Commit per oppgave: `feat(6.4): TP-X — <kort>`

## P2.4 — Tekst-revisjon (etter Anders har fylt ut)

**Sjekk:** `docs/tekst-revisjon-2026-04-29.md`. Har Anders fylt ut "Ny tekst:"-felter?

Hvis ja:
1. Parse alle utfylte "Ny tekst:"-felter
2. Mapping: hver feltsti → fil + linje (fra dokumentet)
3. Oppdater `lib/website-constants.ts` + andre filer
4. Verifiser TS + lint
5. Commit: `feat(tekst): manuell revisjon av Anders 2026-04-30`

Hvis ikke fylt ut: hopp over.

---

# P3 — TESTER + DOCS (2 dager)

## P3.1 — Vitest unit-tester for agenter

For hver agent i `lib/portal/agents/*.ts`:
```ts
// __tests__/agents/<agent-name>.test.ts
import { run<AgentName> } from "@/lib/portal/agents/<agent-name>";

describe("<agent-name>", () => {
  it("happy path: ran successfully", async () => { ... });
  it("error path: returns ran=false", async () => { ... });
});
```

Mal: hver agent har minst 2 tester (happy + error).

## P3.2 — Vitest for booking-utilities

`lib/portal/booking/`:
- `slot-availability.test.ts`
- `cancellation-policy.test.ts` (utvid eksisterende)
- `subscription-quota.test.ts`

## P3.3 — Playwright E2E

`__tests__/playwright/`:
- `booking-flow.spec.ts` (utvid 28 eksisterende tester med nye edge-cases)
- `portal-login.spec.ts`
- `dashboard-load.spec.ts`
- `admin-arbeidsflate.spec.ts`

## P3.4 — Dokumentasjon

- Oppdater `WORKLOG.md` med all aktivitet (en seksjon per dag)
- Oppdater `docs/status/BACKLOG.md` — fra Heritage til V2
- Oppdater `.claude/rules/component-library.md` med ALLE nye komponenter
- Slett `docs/archive-2026-04-21/`, `docs/archive-2026-04-24/`

Commit: `docs: oppdatert WORKLOG + BACKLOG + component-library`

---

# P4 — NYE FEATURES F1-F4 (10-13 dager — kommer du sa langt?)

Dette er stort arbeid. Hvis du har tid igjen:

## P4.1 — F1 TrackMan-upload (3-4 dager)

Detaljert spec i `docs/kimi-code-prompt-v2-2026-04-29.md` § F1.

Kort: Bilde-upload via Claude Vision + CSV + spredningsplot per kolle.

**Bruk eksisterende:**
- `lib/portal/trackman/import-service.ts` (CSV)
- `lib/portal/trackman/ai-insights.ts` (Anthropic SDK-pattern)

**Lag nye:**
- `lib/portal/trackman/upload-actions.ts` med `uploadTrackmanImage` + `uploadTrackmanCsv`
- Vision-prompt for parsing bilde til JSON
- `app/portal/(dashboard)/trackman/last-opp/` med tabs (bilde / CSV)
- `components/portal/trackman/dispersion-plot.tsx` — SVG X/Y-spredning

## P4.2 — F2 Stats UpGame manuell (3 dager)

Detaljert spec i `docs/kimi-code-prompt-v2-2026-04-29.md` § F2.

Kort: Live shot-logging pa banen uten kart (manuell flyt forst).

**Bruk eksisterende:**
- `Round`, `HoleResult`, `Shot`, `RoundLiveState` (allerede migrert i Sprint A)

**Lag nye:**
- `lib/portal/round/live-actions.ts` (startLiveRound, logShot, completeHole, completeRound)
- `lib/portal/strokes-gained/expected-strokes.ts` (PGA Tour benchmark)
- `app/portal/(dashboard)/runde/start/` (start-runde-flyt)
- `app/portal/(dashboard)/runde/[id]/live/` (live-runde-UI mobil-forst)

## P4.3 — F3 Baneguide Mapbox (5-7 dager)

Detaljert spec i `docs/kimi-code-prompt-v2-2026-04-29.md` § F3.

Mapbox-deps allerede installert i P1.1.

**Lag nye:**
- Prisma migrasjon: `Course.geojson` JSONB + `Hole.strategyOverlay` JSONB
- `lib/portal/round/lie-detection.ts` (point-in-polygon)
- `lib/portal/courses/import-geojson.ts`
- `components/portal/round/{course-map, hole-map, shot-marker, club-suggester}.tsx` (DELVIS bygget — fullforer)
- Admin-side for GeoJSON-import: `/admin/baner/[id]/import`

## P4.4 — F4 Treningsanalyse (2-3 dager)

Detaljert spec i `docs/kimi-code-prompt-v2-2026-04-29.md` § F4.

**Lag nye:**
- `lib/portal/training/analysis-actions.ts`
- `app/portal/(dashboard)/treningsplan/analyse/page.tsx`
- `components/portal/training-analysis/{filter-bar, results-grid}.tsx`

---

# 📊 RAPPORTERING

Etter HVER ferdig oppgave, oppdater `WORKLOG.md` med:

```markdown
## YYYY-MM-DD HH:MM — <oppgave-id> ferdig

**Commit:** `<hash>` — <commit-message>
**Filer endret:** N
**TS:** 0 errors. **ESLint:** 0 errors.
**Status:** ✅ Pushed to main

**Hovedendringer:**
- <bullet 1>
- <bullet 2>
- <bullet 3>

**Neste oppgave:** P<x.y>
```

Hver 2-3 timer, oppsummer i en samlet WORKLOG-seksjon.

---

# 🛑 STOP-CONDITIONS — slik vet du nar du skal STOPPE

**Stopp og send rapport hvis:**

1. **TypeScript > 10 errors** etter pa-gaende oppgave
2. **`npm run build` feiler** (med stack trace)
3. **Git push avvises** (rebase, fix conflict, prov igjen — hvis fortsatt failer: stopp)
4. **Database-migrasjon feiler** (sjekk gotchas: bruke DIRECT_URL ikke pooler)
5. **Anders sender en chat-melding**

**Skriv en avslutnings-rapport med:**
- Hva som er ferdig (lista per oppgave med commit-IDer)
- Hva som er pa-gaende (siste status)
- Hva som er igjen
- Eventuelle problemer + lpsninger pavtatt

---

# 🚀 START NA

```bash
cd ~/Developer/akgolf/akgolf-platform
git pull origin main
npm install  # forsikr at alle deps er der

# Begynn P1.1 (Mapbox-deps)
npm install mapbox-gl react-map-gl @turf/turf @turf/distance @turf/boolean-point-in-polygon
npm install -D @types/geojson @types/mapbox-gl
npx tsc --noEmit | grep -E "mapbox|turf"
# Hvis tomt — push commit og ga til P1.2

git add package.json package-lock.json
git commit -m "chore(deps): install mapbox + turf dependencies"
git push origin main
```

Deretter folg P1.2 → P1.3 → P1.4 → P2.1 → ... osv.

**Husk:**
- Push fortlopende
- Oppdater WORKLOG etter hver oppgave
- Hopp over og dokumenter hvis du sitter fast > 30 min
- Stopp KUN ved kritiske feil

Lykke til! Anders kommer tilbake etter gymmen og leser WORKLOG.

---

# 📋 Pre-flight sjekkliste for Anders

Sett dette opp FOR du gar pa gymmen:

```bash
# 1. Sjekk at git er rent
cd ~/Developer/akgolf/akgolf-platform
git status  # skal vaere clean
git pull origin main

# 2. Sjekk at npm er oppdatert
npm install

# 3. Sjekk at TS bygger (kanskje noen Mapbox-feil — det fikser Kimi)
npx tsc --noEmit | head -10

# 4. Start Kimi i YOLO-modus
claude --dangerously-skip-permissions

# 5. Lim inn hele dette dokumentet som forste melding
```

Etter Kimi har startet:
- Lukk laptop
- Ga pa gymmen
- Kom tilbake om 2-4 timer
- Les `WORKLOG.md` for status
- Kjor `git log --oneline -20` for a se commit-historikk

**Forventet output:** 5-10 commits pushet til main, hver med tydelig melding og scope.
