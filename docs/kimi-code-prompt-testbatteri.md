# Kimi Code Prompt: Fullfør Testbatteri-systemet (PlayerHQ + CoachHQ)

> **Kontekst:** Backend for 38 tester (20 AK Standard + 18 Team Norway) er allerede implementert. Din oppgave er å fullføre frontend + treningsplan-kobling.

---

## 0. Hva som ALLEREDE er på plass (IKKJE endre)

### Database (Prisma)
- `TestDefinition` — 38 tester (testNumber 1-38) seeded
- `TestResult` — lagrer value, rawInput, passed, categoryReq
- `CategoryRequirement` — A-K-terskler for alle 38 tester

### Backend
- `lib/portal/tests/calculate.ts` — formler for alle tester + PEI-funksjon
- `lib/portal/tests/category-requirements.ts` — meetsRequirement(), getAchievedCategory()
- `lib/portal/tests/validation.ts` — input ranges for alle 38 tester
- `lib/portal/tests/test-battery.ts` — hjelpefunksjoner (getTestSource, getTestCategoryLabel, getTestPyramid, getTestArea)
- `lib/portal/tests/test-exercise-bridge.ts` — getTestsAsExercises(), testToSessionExercise(), searchTestsAsExercises()
- `app/portal/(dashboard)/tester/actions.ts` — getTestsOverview() returnerer group ("AK Standard" / "Team Norway")

### Treningsplan-typer
- `lib/portal/training/session-exercise-types.ts` — `SessionExercise` har `testNumber?: number` og `testTarget?: number`

### Test-oversikt UI
- `app/portal/(dashboard)/tester/tester-client.tsx` — to-nivå gruppering (gruppe → kategori)

---

## 1. Din oppgave: Treningsplan-kobling + Test-utførelse UI

### 1A. Legg "Tester"-fane i treningsplan-editoren

**Fil:** `app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx`

1. Utvid `SidebarTab`-unionen med `"tests"`
2. I `PlannerSidebar`: legg til `{ id: "tests", label: "Tester", icon: "sports_golf" }` i tabs-array
3. Lag en ny `TestsPlaceholder`-komponent (inline, samme mønster som `ExercisesPlaceholder`):
   - Henter tester via `searchTestsAsExercises(query, source)`
   - Viser tester som draggable `TestCard`-kort
   - Grupper etter "AK Standard" / "Team Norway"
   - Søkefelt for filtrering på navn
4. På `dragStart`: pakker testdata som JSON (testNumber, name, pyramid, area)

### 1B. Drop + konfigurer test i økt

**Fil:** `app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx`

I drop-håndteringen (`WeekGrid` `onDrop`):
1. Sjekk om drag-data inneholder `testNumber`
2. Hvis ja: åpne `ExerciseConfigPopover` med test-spesifikke defaults:
   - `durationMinutes: 30`
   - `repsWithBall: inputCount` (fra TestDefinition)
   - `pyramid` satt via `getTestPyramid(testNumber)`
   - `area` satt via `getTestArea(testNumber)`
3. Ved bekreftelse: kall `onAddExerciseToSession` med `testNumber` inkludert

### 1C. Vis test-økter i treningsplan-overview

**Fil:** `app/portal/(dashboard)/treningsplan/components/` (finn passende komponent)

1. Når `SessionExercise.testNumber` finnes:
   - Vis test-ikon (f.eks. `FlaskConical` fra lucide-react) ved siden av øvelsesnavn
   - Vis "Test"-badge (lime `#D1F843` på mørk bakgrunn)
2. I `TodayCard`: hvis dagens økt inneholder en test, vis "🔬 Test planlagt"

### 1D. Test-utførelse fra treningsplan

**Fil:** Opprett `app/portal/(dashboard)/treningsplan/components/test-session-launcher.tsx`

1. Komponent som vises når en økt inneholder `testNumber` og ikke er fullført
2. Viser: "Gjør test: [test-navn]" med CTA-knapp
3. Ved klikk: redirect til `/portal/tester/[testNumber]?fromPlan=[planSessionId]`

---

## 2. Oppdatere test-utførelse-siden

**Fil:** `app/portal/(dashboard)/tester/[testNumber]/page.tsx`

1. Les `fromPlan` query-param
2. Vis "Tilbake til treningsplan"-knapp hvis `fromPlan` finnes
3. Etter `submitTestResult`: redirect tilbake til treningsplan (ikke `/portal/tester/[testNumber]/resultat`)

---

## 3. Oppdatere resultatvisning

**Fil:** `app/portal/(dashboard)/tester/[testNumber]/resultat/page.tsx`

1. Vis test-kategori-label ("Golfslag", "PEI", "Teknikk", etc.) via `getTestCategoryLabel()`
2. Vis "Team Norway"-badge hvis testNumber >= 21
3. For PEI-tester (29-31): vis hjelpetekst "PEI = 0.15 betyr at ballen i snitt havnet 15% av target-avstanden fra hullet"
4. Vis A-K-kategori oppnådd via `getAchievedCategory()`

---

## 4. Design-regler (Heritage M3 / Brand Guide V2.0)

**Følg disse strengt. Avvik er ikke tillatt.**

### Farger
- Primary: `#005840` (skogsgrønn) — knapper, headers, brand
- Accent: `#D1F843` (lime) — CTA, badges, highlights (bruk SPARSOMT)
- Dark BG: `#0A1F18` (admin, sidebar)
- Surface: `#F4F6F4` (hovedbakgrunn)
- Card: `#FFFFFF`
- Ink: `#0A1F18` (tekst, aldri #000000)

**Bruk Tailwind-tokens:** `bg-primary`, `text-accent`, `bg-surface`, `text-ink`, etc.
**Aldri hardkodede hex-koder i komponenter.**

### Typografi
- Font: **Geist** (via `next/font`) — body, UI
- Font: **Inter Tight** — headlines
- Font: **JetBrains Mono** — labels, kategori-tagger
- Body: 16px, 1.6 line-height, 400 weight
- H1: 48px, 1.1 line-height, 700 weight
- H2: 32px, 1.2 line-height, 600 weight
- Labels: 14px, uppercase, 0.05em letter-spacing

### Layout
- 8pt grid: alle paddings/margins som multipler av 8
- Container: max-width 1200px, sentrert, 24px side-padding
- Cards: `rounded-2xl` (16px), `p-6`
- Buttons: `rounded-xl` (12px), `px-6 py-3`

### ADHD-vennlig UX
- Én handling om gangen
- Store klikkflater (min 44x44px)
- Tydelig progresjon (steg 1/5, 2/5...)
- Ingen distraksjoner — ren, fokusert UI
- Norsk bokmål med æ, ø, å

---

## 5. Viktige kode-regler

1. **Les ALLTID filen før du endrer den** — forstå eksisterende mønster
2. **Gjenbruk EKSISTERENDE komponenter** fra `components/ui/` og `components/portal/`
3. **Ingen nye Prisma-modeller** — bruk TestDefinition/TestResult
4. **Ingen hardkodede hex-koder** — bruk Tailwind-tokens eller CSS-variabler
5. **Kjør `npx tsc --noEmit` før du er ferdig**
6. **Kjør `npm test` før du er ferdig**

---

## 6. Start her (rekkefølge)

1. Les `app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx` (spesielt PlannerSidebar, ExercisesPlaceholder, drop-håndtering)
2. Les `lib/portal/tests/test-battery.ts` og `lib/portal/tests/test-exercise-bridge.ts`
3. Les `lib/portal/training/session-exercise-types.ts`
4. Implementer 1A (Tester-fane i sidebar)
5. Implementer 1B (drop + konfigurer test)
6. Implementer 1C (vis test-økter i overview)
7. Implementer 1D (test-session-launcher)
8. Implementer 2 (test-utførelse med fromPlan)
9. Implementer 3 (resultatvisning med Team Norway-badge)
10. Kjør `npx tsc --noEmit`
11. Kjør `npm test`
