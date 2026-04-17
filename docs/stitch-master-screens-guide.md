# Stitch Master Export — Screen Design Guide

> **Export-fil:** `docs/stitch-master-export.json`  
> **Master-spec:** `docs/MASTER_FEATURE_SPEC.md`  
> **Status:** Inkluderer Dashboard + Treningsplanlegger 2.0-visjon + nøkkelkomponenter

---

## Hvordan importere til Stitch

1. Last ned/åpne `docs/stitch-master-export.json`
2. I Stitch: **Design System → Import → JSON (W3C format)**
3. Alle tokens, skjermer og komponenter blir tilgjengelige

---

## Skjermvarianter å lage i Stitch

### 1. `dashboard-desktop-pro` — Dashboard Desktop (1440px)
**Bruker:** Pro/Advanced med full data  
**Layout:** 1400px bred, 4 rader, 12-kolonners grid

| Rad | Kolonner | Innhold |
|-----|----------|---------|
| 1 | 8 + 4 | **Venstre:** Welcome + Next Booking + AI Insights. **Høyre:** Player Profile Card |
| 2 | 12 | Week Calendar |
| 3 | 1+1+1+1 | Handicap KPI + (Runder + Økter) KPI-er + TrackMan + Social |
| 4 | 1+1+1 | Coach Insight + Achievements + Shortcut Pills |

**Farger:** Primary `#005840`, Accent `#D1F843`, Dark `#0A1F18`, Coral `#E85D4E`, white cards med soft shadows.

---

### 2. `dashboard-mobile` — Dashboard Mobile (375px)
**Rekkefølge (top → bottom):**

1. Welcome Section
2. Player Profile Card
3. Next Booking Card
4. Week Calendar
5. KPI Card — Handicap
6. AI Insights V2
7. TrackMan Widget
8. Social Widget
9. Coach Insight Card
10. Achievements Widget
11. Shortcut Pills (2 kolonner)

---

### 3. `training-plan-wizard-step-2` — Interaktiv Pyramide (VIKTIGST)
**Status:** `🚀 VISION` — Dette er den viktigste nye skjermen å designe.

**Formål:** Spilleren velger hvilke nivåer i treningspyramiden som skal være fokus.

**Sentrale elementer:**
- `pyramid-visualization` — en stor, geometrisk, interaktiv pyramide med 5 nivåer
- Hvert nivå er klikkbart og kan velges/avvelges
- Når et nivå er valgt: fylt farge + hvit stroke + drop-shadow
- Når et nivå er uvalgt: gjennomsiktig farge + tynn stroke
- Under pyramiden: beskrivelseskort for valgte nivåer

**Pyramide-nivåer (top → bottom):**

| Nivå | Farge | Label | Ikon | Beskrivelse |
|------|-------|-------|------|-------------|
| TURN | `#E85D4E` | Turnering | Trophy | Konkurranser, kvalik, ranking |
| SPILL | `#AF52DE` | Spill | Flag | 9/18 hull, scramble, match |
| SLAG | `#C48A32` | Golfslag | Target | Putting, chipping, driving, jern |
| TEK | `#007AFF` | Teknikk | Wrench | Svinganalyse, video, impact |
| FYS | `#005840` | Fysisk | Dumbbell | Styrke, mobilitet, kondisjon |

**Tips for Stitch:**
- Lag pyramiden som en custom SVG eller polygon-shapes
- Bruk gradient-farger fra exporten
- Sørg for at hover/selected states er tydelige
- Legg til mikro-animasjon på klikk (scale 1.02)

---

### 4. `training-plan-wizard-step-1` — Velg tidsrom
**Komponenter:** `wizard-header`, `step-indicator`, `time-scope-selector`

Tre store kort:
- **Enkeltøkt** — `calendar-plus`-ikon, "Planlegg én treningsøkt"
- **Periode** — `calendar-range`-ikon, "4–12 ukers plan"
- **Årsplan** — `calendar-days`-ikon, "52 ukers sesongplan"

Valgt kort får primary border + svak grønn bakgrunn.

---

### 5. `training-plan-wizard-step-3` — Tilgjengelighet
**Komponenter:** `hours-per-week-slider`, `day-selector`, `time-of-day-selector`

- **Slider:** 2–20 timer/uke (default 6), stor tydelig tall-visning
- **Day selector:** 7 runde knapper (Man–Søn), toggle select
- **Time of day:** Morgen / Ettermiddag / Kveld (chip-knapper)

---

### 6. `training-plan-wizard-step-4` — Fokusområde
**Komponenter:** `focus-area-selector`, `ai-suggestion-card`

- Liste over fokusområder basert på valgt pyramide (f.eks. "Putting under 3m", "Approach 100-140m")
- `ai-suggestion-card` — lilla kant, AI-anbefaling: "Din approach er svak — fokus på SLAG"

---

### 7. `training-plan-wizard-step-5` — Forhåndsvisning
**Komponenter:** `weekly-plan-preview`, `day-detail-cards`

- Viser generert plan: uke-for-uke
- Hver uke er et hvit kort med shadow
- Dag-pills inne i uken viser hvilke dager som har økter
- Under: detaljkort for hver dag med øvelser og varighet

---

### 8. `training-planner-calendar` — Treningsplan Kalender (eksisterende v3)
**Layout:** 9 + 3 kolonner

- **Venstre 9 kolonner:** Uke-kalender-grid med session-kort
- **Høyre 3 kolonner:** Template library + Exercise bank + Pyramid filter

---

### 9. `training-diary` — Dagbok
**Layout:** 4 + 8 kolonner

- **Venstre 4:** Streak-kort + Plan-progress (ring) + Quick-log
- **Høyre 8:** Treningshistorikk-liste + Siste økt

---

### 10. `statistics` — Statistikk
**Layout:** 4-kolonne KPI-rad + 7+5 charts + fullbredde trend

- KPI-er: Snittscore, Runder, HCP, SG Total
- SG-breakdown bars (horisontale, sentrert om 0)
- Treningsvolum stacked bar
- Score-trend area chart

**Viktig:** SG-positive bar = `#2A7D5A`, SG-negative bar = `#B84233`

---

### 11. `booking-list` — Mine Bookinger
**Layout:** Hero (12 kol) + 8+4 kolonner

- Neste booking = stort hero-kort med coral gradient
- Venstre 8: Kommende timeline + historikk
- Høyre 4: Avbestillingsregler (warning-gul bakgrunn)

---

### 12. `ai-coach` — AI Coach
**Layout:** 3 kolonner features + fullbredde chat

- 3 feature-kort øverst (personlige tips, fremgangs-analyse, video-analyse)
- Chat-container under med meldingsbobler
- Hurtigspørsmål som chip-rad nederst

---

## Viktige komponenter i eksporten

| Komponent | Brukes i | Spesiell styling |
|-----------|----------|------------------|
| `pyramid-visualization` | Planlegger 2.0 | Geometrisk pyramide, 5 nivåer, klikkbar |
| `pyramid-stacked-bar` | Øvelsesbank, dataviz | Horisontal stacked bar med pyramid-farger |
| `time-scope-selector` | Planlegger steg 1 | 3 store valgkort |
| `hours-per-week-slider` | Planlegger steg 3 | Track med thumb, live tall-visning |
| `day-selector` | Planlegger steg 3 | 7 runde toggle-knapper |
| `focus-area-selector` | Planlegger steg 4 | Radio-liste med custom styling |
| `ai-suggestion-card` | Planlegger steg 4 | Lilla border, AI-ikon |
| `weekly-plan-preview` | Planlegger steg 5 | Uke-kort med dag-pills |
| `day-detail-cards` | Planlegger steg 5 | 7 små kort (man–søn) |
| `welcome-section` | Dashboard | 32px heading, accent badge |
| `next-booking-card` | Dashboard, Bookinger | Coral gradient filled / dashed empty |
| `week-calendar` | Dashboard, Planlegger | 7 day-items, today = black bg + accent dot |
| `kpi-card` | Dashboard, Statistikk | 40px tall number + sparkline |
| `ai-insights-v2` | Dashboard, AI Coach | Mørk gradient card, 3 tabs |
| `coach-insight-card` | Dashboard | White card, line-clamp-4 |
| `shortcut-pills` | Dashboard | 4 ikon-kort, hover lift |
| `trackman-widget` | Dashboard | Dark card, 3 små sparklines |
| `social-widget` | Dashboard | Dark card, rank + streak |
| `achievements-widget` | Dashboard | Dark card, rarity borders |
| `streak-card` | Dagbok | Stort tall + flamme-ikon |
| `plan-progress-card` | Dagbok | Ring-progress med uketall |
| `sg-breakdown-bars` | Statistikk | Horisontale bars, center line |
| `chat-container` | AI Coach, Meldinger | Meldingsbobler + input |

---

## Arbeidsflyt: Du designer i Stitch → Jeg koder

1. **Du:** Lager skjermvarianter i Stitch basert på skjermene over
2. **Du:** Kopierer endringer/nye specs fra Stitch og limer inn her i chatten
3. **Jeg:** Oppdaterer komponentene i koden (`components/portal/*`, `app/portal/*`)
4. **Jeg:** Kjører `npm run build` + smoke tests for å verifisere

**Hva jeg enkelt kan rulle ut:** farger, radius, padding, shadows, grid-layout, rekkefølge på widgets, nye empty states, typografi.

**Hva som krever mer diskusjon:** nye interaksjoner (drag-drop, nye tabs), nye data-kilder (API-endringer), nye hele seksjoner.

---

## Prioritet for Stitch-arbeid

1. **`training-plan-wizard-step-2`** (Interaktiv pyramide) — KRITISK, definerer hele planlegger-opplevelsen
2. **`dashboard-desktop-pro`** + **`dashboard-mobile`** — Kjernen i daglig bruk
3. **`training-plan-wizard-step-1` til `step-5`** — Full wizard-opplevelse
4. **`training-diary`** — Daglig loggingsflyt
5. **`statistics`** — Evalueringsflyt
6. **`ai-coach`** — AI-opplevelse
7. **`booking-list`** — Booking-admin

---

**Spørsmål?** Se `docs/MASTER_FEATURE_SPEC.md` for full funksjonsbeskrivelse av hver skjerm.
