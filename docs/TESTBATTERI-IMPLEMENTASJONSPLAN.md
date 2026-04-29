# Testbatteri — Implementasjonsplan

> Mål: Fullføre PlayerHQ + CoachHQ testbatteri basert på Team Norways protokoller.
> Backend (38 tester) er ferdig. Gjenstår: treningsplan-kobling + test-utførelse UI.

---

## Fase 1: Seed nye tester i databasen
**Tid: 5 min** | **Filer: 1** | **Test: Kjør seed-script**

1. Kjør `DATABASE_URL="..." npx tsx prisma/seed-tests.ts`
2. Verifiser i Supabase Dashboard at alle 38 TestDefinitions finnes

**Verifisering:**
```sql
SELECT testNumber, name, category FROM "TestDefinition" ORDER BY testNumber;
-- Skal vise 38 rader, 21-38 = Team Norway-tester
```

---

## Fase 2: "Tester"-fane i treningsplan-sidebar
**Tid: 30 min** | **Filer: 1** | **Test: Visuell — åpne /portal/treningsplan?modus=editor**

**Fil:** `app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx`

### Steg 2A: Utvid SidebarTab-typen
```typescript
type SidebarTab = "exercises" | "templates" | "history" | "tests";
```

### Steg 2B: Legg til fane i PlannerSidebar
```typescript
{ id: "tests", label: "Tester", icon: "science" } // eller "sports_golf"
```

### Steg 2C: Lag TestsPlaceholder-komponent
- Inline-komponent (samme mønster som ExercisesPlaceholder)
- Henter tester via `searchTestsAsExercises(query, source)`
- Viser filtre: "Alle" | "AK Standard" | "Team Norway"
- Søkefelt for navn-filtrering
- Grupper etter kategori (Golfslag, PEI, Teknikk, etc.)

### Steg 2D: Lag TestCard-komponent
- Draggable kort (samme mønster som ExerciseCard)
- `dragStart` setter data: `{ testNumber, name, pyramid, area, isTest: true }`
- Viser: test-navn, kategori-label, antall slag

**Test:** Åpne treningsplan i editor-modus. Se at "Tester"-fane finnes med test-liste.

---

## Fase 3: Drop + lagre test i økt
**Tid: 30 min** | **Filer: 2** | **Test: Drag test til økt-celle, verifiser lagring**

**Fil 1:** `app/portal/(dashboard)/treningsplan/treningsplan-planner.tsx`

### Steg 3A: Oppdater ExerciseConfigPopover
- Sjekk om payload har `isTest: true`
- Hvis ja: sett defaults fra `testToSessionExercise(test)`:
  - durationMinutes = 30
  - repsWithBall = test.inputCount
  - pyramid = getTestPyramid(testNumber)
  - area = getTestArea(testNumber)
- Vis "Test"-badge i popover-header

### Steg 3B: Oppdater handleConfirmExerciseConfig
- Inkluder `testNumber` i exercise-objektet som sendes til server

**Fil 2:** `app/portal/(dashboard)/treningsplan/actions.ts`

### Steg 3C: Verifiser at addExerciseToSession håndterer testNumber
- `addExerciseToSession` lagrer exercises-JSON as-is
- Siden SessionExercise nå har `testNumber`, skal dette fungere automatisk
- Verifiser at `testNumber` bevares i JSON

**Test:**
1. Dra "Chip 10m"-test til en økt-celle
2. Fyll ut varighet, klikk "Legg til"
3. Sjekk at økten viser test-øvelsen
4. Verifiser i Supabase at `TrainingPlanSession.exercises` inneholder `testNumber: 21`

---

## Fase 4: Vis test-økter i treningsplan-overview
**Tid: 30 min** | **Filer: 2** | **Test: Visuell — se test-ikon og badge**

**Fil 1:** Opprett `components/portal/treningsplan/test-exercise-badge.tsx`

```tsx
// Viser test-ikon + "TEST"-badge for øvelser med testNumber
// Brukes i økt-kort og TodayCard
```

**Fil 2:** `components/portal/treningsplan/session-card.tsx` (eller tilsvarende)

- Import `TestExerciseBadge`
- For hver exercise: hvis `exercise.testNumber`, vis badge
- Test-badge: lime `#D1F843` bakgrunn, `#0A1F18` tekst, `rounded-full`, `px-2 py-0.5`, `text-[10px]` uppercase

**Fil 3:** `app/portal/(dashboard)/treningsplan/components/today-card.tsx` (eller tilsvarende)

- Hvis dagens økt inneholder `testNumber`, vis "🔬 Test planlagt" under økt-navn

**Test:** Åpne treningsplan (ikke editor). Se at test-økter viser test-badge.

---

## Fase 5: Test-utførelse fra treningsplan
**Tid: 30 min** | **Filer: 2** | **Test: Klikk "Gjør test", fyll ut, redirect tilbake**

**Fil 1:** Opprett `components/portal/treningsplan/test-session-launcher.tsx`

```tsx
// Props: testNumber, planSessionId, testName
// Viser: "Gjør test: Chip 10m" + CTA-knapp
// CTA: redirect til `/portal/tester/[testNumber]?fromPlan=[planSessionId]`
// Style: Primary knapp (#005840), stor, tydelig
```

**Fil 2:** `app/portal/(dashboard)/treningsplan/[sessionId]/page.tsx` eller session-view

- For hver exercise: hvis `testNumber` og ikke fullført → vis `TestSessionLauncher`

**Fil 3:** `app/portal/(dashboard)/tester/[testNumber]/page.tsx`

- Les `fromPlan` query-param
- Hvis `fromPlan`: vis "Tilbake til treningsplan"-knapp øverst
- Etter `submitTestResult`: redirect til `/portal/treningsplan?highlightSession=[fromPlan]`

**Test:**
1. Åpne en økt med test
2. Klikk "Gjør test"
3. Fyll ut resultater
4. Send inn
5. Bekreft redirect tilbake til treningsplan

---

## Fase 6: Oppdatert resultatvisning
**Tid: 20 min** | **Filer: 1** | **Test: Visuell — se Team Norway-badge + A-K-kategori**

**Fil:** `app/portal/(dashboard)/tester/[testNumber]/resultat/page.tsx`

### Steg 6A: Vis test-kilde
- Hvis testNumber >= 21: vis "Team Norway"-badge (lime `#D1F843`)
- Hvis testNumber <= 20: vis "AK Standard"-badge (primary `#005840`)

### Steg 6B: Vis A-K-kategori oppnådd
- Bruk `getAchievedCategory(testNumber, value, comparison)`
- Vis: "Du putter som en [C]-spiller på denne testen"
- Bruk progress-bar som viser alle A-K-nivåer med markering på oppnådd nivå

### Steg 6C: PEI-hjelpetekst
- For tester 29-31: vis "PEI forklaring"-tooltip/accordion

**Test:** Gjennomfør en Team Norway-test. Bekreft at badge og kategori vises.

---

## Fase 7: CoachHQ — Test-register
**Tid: 30 min** | **Filer: 2** | **Test: Åpne Mission Control, se test-status**

**Fil 1:** `components/portal/mission-control/test-register.tsx`

- Inkluder nye tester (21-38) i test-register-visningen
- Grupper etter "AK Standard" / "Team Norway"
- Vis retest-status (8-ukers intervall)

**Fil 2:** `app/admin/(authed)/elever/[id]/v2/get-student-360.ts`

- Inkluder nye tester i TestsGroup
- Vis Team Norway-badge på testresultater

**Test:** Åpne Mission Control → Test-register. Se at alle 38 tester listes.

---

## Fase 8: Polish + TypeScript + Testing
**Tid: 20 min** | **Filer: alle endrede** | **Test: `npx tsc --noEmit && npm test`**

1. Kjør `npx tsc --noEmit` — 0 feil
2. Kjør `npm test` — eksisterende tester skal passere
3. Gjør en visuell QA-runde:
   - Dark mode fungerer
   - Mobil (responsive)
   - ADHD-vennlig: én ting om gangen, store klikkflater
4. Oppdater `docs/TESTBATTERI-IMPLEMENTASJONSPLAN.md` med "Ferdig"-status per fase

---

## Oppsummering av filer per fase

| Fase | Filer | Kompleksitet |
|------|-------|-------------|
| 1 | `prisma/seed-tests.ts` (kjør) | 🟢 Enkel |
| 2 | `treningsplan-planner.tsx` | 🟡 Medium |
| 3 | `treningsplan-planner.tsx`, `actions.ts` | 🟡 Medium |
| 4 | Ny `test-exercise-badge.tsx`, session-card, today-card | 🟢 Enkel |
| 5 | Ny `test-session-launcher.tsx`, session-view, `[testNumber]/page.tsx` | 🟡 Medium |
| 6 | `[testNumber]/resultat/page.tsx` | 🟢 Enkel |
| 7 | `test-register.tsx`, `get-student-360.ts` | 🟡 Medium |
| 8 | Alle endrede + QA | 🟢 Enkel |

**Totalt estimat: ~3 timer** (hvis fokusert, én fase om gangen)

---

## Anbefalt rekkefølge

1. Start med **Fase 1** (seed) — verifiser at data er på plass
2. Gjør **Fase 2 + 3** sammen (sidebar + drop) — dette er kjernefunksjonaliteten
3. Ta **Fase 4** (overview) — visuell verifisering
4. Gjør **Fase 5** (utførelse) — full flyt fungerer
5. Resten (6-8) kan gjøres i én økt eller deles opp
