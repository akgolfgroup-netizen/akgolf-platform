# Dashboard v2 — Stitch Screen Specs

> **Kildekode:** `app/portal/(dashboard)/dashboard-client-v3.tsx`  
> **Eksportfil:** `docs/stitch-dashboard-export.json`  
> **Klare design-IDer:** 3, 4, 5, 6 (på vent med SG-bar fiks)

---

## Hvordan importere til Stitch

1. Last ned/åpne `docs/stitch-dashboard-export.json`
2. I Stitch: **Design System → Import → JSON (W3C format)**
3. Komponentene dukker opp under `AK Golf Dashboard v2 Export`
4. Tokens (gradients, dashboard-gaps, card-radius) blir tilgjengelige i token-panelet

---

## Skjermvarianter å lage i Stitch

### 1. `dashboard-desktop` — Desktop (1440×900)
**Bruker:** Pro/Advanced-spiller med full data  
**Layout:** 1400px bred, 4 rader, 12-kolonners grid

| Rad | Kolonner | Innhold |
|-----|----------|---------|
| 1 | 8 + 4 | **Venstre:** Welcome + Next Booking + AI Insights. **Høyre:** Player Profile Card |
| 2 | 12 | Week Calendar (7 dager) |
| 3 | 3 + 3 + 3 + 3 | Handicap KPI + (Runder + Økter) KPI-er + TrackMan + Social |
| 4 | 4 + 4 + 4 | Coach Insight + Achievements + Shortcut Pills |

**Viktig:**  
- Next Booking Card = coral gradient (`#E85D4E → #C43A2A`)  
- Player Profile = dark card (`#0A1F18`) med bilde + gradient overlay  
- Shortcut Pills = 4 kolonner på desktop, hover `-translateY(2px)`

---

### 2. `dashboard-mobile` — Mobile (375×812)
**Bruker:** Samme pro-bruker, alt i én kolonne  
**Rekkefølge (top → bottom):**

1. Welcome Section
2. Player Profile Card (full bredde)
3. Next Booking Card
4. Week Calendar (horisontal scroll hvis nødvendig)
5. KPI Card — Handicap
6. AI Insights V2 (eller Training Activity)
7. TrackMan Widget
8. Social Widget
9. Coach Insight Card
10. Achievements Widget
11. Shortcut Pills (2 kolonner)

**Viktig:**  
- `max-width: 100%`, padding `16px` side  
- Gaps reduseres til `16px`

---

### 3. `dashboard-beginner` — Beginner Desktop
**Bruker:** Nybegynner, ingen TrackMan, lite stats  
**Forskjeller fra base:**

- **Skjul:** TrackMan Widget
- **Bytt ut:** AI Insights V2 → Training Activity Card (alltid)
- **Rad 3:** Handicap KPI + (Runder + Økter) KPI-er + **AchievementsWidget** + **AI Insights V2** (fallback hvis `!showAdvancedAI`)
- **Social:** vises kun hvis `roundsCount > 5 || sessionsCount > 10`

Visuell variant for å teste "tomme tilstander":
- Next Booking Card = empty state (dashed border)
- KPI Cards = empty states med "Kom i gang"-lenker

---

### 4. `dashboard-pro` — Pro/Advanced Desktop
**Bruker:** Elite/Pro med maksimal data  
**Forskjeller fra base:**

- **Vis:** AI Insights V2 (tabs: Oversikt / Analyse / Anbefalinger)
- **Vis:** TrackMan Widget (3 små sparklines)
- **Vis:** Social Widget (rank + streak + challenges)
- Rad 1 bruker AI Insights i stedet for Training Activity Card

---

## Komponent-liste (alle i eksporten)

| Komponent | Fil | Spesiell styling |
|-----------|-----|------------------|
| `welcome-section` | `welcome-section.tsx` | 32px bold heading, accent badge |
| `next-booking-card` | `next-booking-card.tsx` | Coral gradient filled / Dashed empty |
| `week-calendar` | `week-calendar.tsx` | 7 day-items, today = black bg + accent dot |
| `kpi-card` | `kpi-card.tsx` | 40px tall number + sparkline + change badge |
| `empty-kpi-card` | inline i dashboard-client-v3 | Border + CTA-link |
| `player-profile-card` | `player-profile-card.tsx` | Dark card, image 45%, 3 stat boxes |
| `training-activity-card` | `training-activity-card.tsx` | Mint gradient, stacked bars, streak badge |
| `ai-insights-v2` | `ai-insights-v2.tsx` | Dark gradient card, 3 tabs, goal progress bar |
| `coach-insight-card` | `coach-insight-card.tsx` | White card, line-clamp-4, bottom border CTA |
| `shortcut-pills` | `shortcut-pills.tsx` | 4 ikon-kort, hover lift |
| `trackman-widget` | `trackman-widget.tsx` | Dark card, 3 sparklines, improvement badges |
| `social-widget` | `social-widget.tsx` | Dark card, rank/streak, challenge progress |
| `achievements-widget` | `achievements-widget.tsx` | Dark card, rarity borders, progress bars |

---

## Tokens brukt i Dashboard v2

**Farger (fra `docs/stitch-design-tokens.json`):**
- Primary: `#005840`
- Accent: `#D1F843`
- Dark: `#0A1F18`
- Coral (data): `#E85D4E`
- Success: `#2A7D5A`
- Error: `#B84233`

**Dashboard-spesifikke tokens (fra eksporten):**
- `dashboard.maxWidth` = `1400px`
- `dashboard.gap` = `20px`
- `dashboard.cardRadius` = `16px`
- `dashboard.cardPadding` = `20px`
- `gradients.nextBooking` = `linear-gradient(135deg, #E85D4E 0%, #C43A2A 100%)`
- `gradients.trainingActivity` = `linear-gradient(135deg, #E1F0E8 0%, #D4E8DC 100%)`

---

## Arbeidsflyt: Du designer i Stitch → Jeg koder

1. **Du:** Lager 2–4 skjermvarianter i Stitch (gjerne de 4 over)
2. **Du:** Kopierer endringer/nye specs fra Stitch og limer inn her i chatten
3. **Jeg:** Oppdaterer `dashboard-client-v3.tsx` og/eller komponentene i `components/portal/dashboard/`
4. **Jeg:** Kjører `npm run build` + smoke tests for å verifisere

### Hva du kan endre i Stitch som jeg enkelt kan rulle ut:
- Farger, border-radius, padding, shadow
- Grid-layout (kolonner, spans)
- Rekkefølge på widgeter
- Nye/tomme states
- Typografi-skala

### Hva som krever mer diskusjon:
- Nye interaksjoner (drag-drop, nye tabs)
- Nye data-kilder (API-endringer)
- Nye hele seksjoner

---

## Notater

- **Animasjoner i koden:** Framer Motion `staggerChildren: 0.05`, `y: 12 → 0`, `duration: 0.4`. Behold dette med mindre du spesifikt vil endre.
- **Responsivitet:** Koden bruker Tailwind-klasser: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-cols-12`
- **Personalisering:** Widget-visibility styres av `playerLevel`, `roundsCount`, `sessionsCount`

