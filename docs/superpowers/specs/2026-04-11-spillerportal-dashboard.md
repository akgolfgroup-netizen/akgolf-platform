# Spillerportal Dashboard `/portal`

## Formål
Gi spiller umiddelbar verdi rett etter innlogging — se fremgang, neste handling, og motivasjon på under 5 sekunder. Dette er siden som avgjør retention.

## Bruker
STUDENT (alle subscription tiers).

## Datakilder (eksisterende, i `dashboard-actions.ts`)

| Data | Funksjon | Status |
|------|----------|--------|
| Stats 30 dager | `getDashboardStats()` | OK |
| Handicap + trend | `getHandicapData()` | OK |
| Handicap-historikk | `getHandicapHistory()` | OK |
| Neste booking | `getNextBooking()` | OK |
| Ukens ringer | `getWeekRingsData()` | OK |
| Dagens sjekkliste | `getDailyChecklist()` | OK |
| Achievements | `getAchievements()` | OK |
| Coach-innsikt | `getCoachInsight()` | OK |
| AI-innsikt | `getLatestAiInsight()` | MANGLER (TODO) |

## Layout (Sky Rye-stil, AK Golf branding)

### Desktop
```
Row 1: GreetingHeader (full bredde)
Row 2: 4 kort på rad
  - PlayerProfileCompactCard (avatar, navn, handicap, tier)
  - StatTile: Handicap med sparkline
  - StatTile: Ukemål ringer
  - StatTile: Streak med flamme
Row 3: 2 kolonner
  - Venstre: NextBookingCard, WeekRingsGrid
  - Høyre: DailyChecklistCard, CoachInsightCard
Row 4: 2 kort
  - HandicapTrendChart (2/3 bredde)
  - AchievementShowcase (1/3 bredde)
Row 5: QuickActionsRow (horisontalt, ikke sticky på desktop)
```

### Mobil (prioritet B)
```
1. GreetingHeader (kompakt)
2. PlayerProfileCompactCard (full bredde)
3. StatTile: Handicap
4. DailyChecklistCard
5. NextBookingCard
6. WeekRingsGrid
7. CoachInsightCard
8. HandicapTrendChart
9. AchievementShowcase
QuickActionsSticky (bunn av skjermen)
```

## Nye komponenter

1. `GreetingHeader` — dynamisk hilsen + dato + uke
2. `PlayerProfileCompactCard` — avatar + navn + tier + handicap
3. `StatTileWithSparkline` — stor verdi + mini-trend
4. `NextBookingCard` — booking-info med CTA + "book ny" fallback
5. `DailyChecklistCard` — interaktiv sjekkliste
6. `WeekRingsGrid` — 7 dager med ProgressRing (0-100%)
7. `CoachInsightCard` — siste coach-innsikt med AI-fallback
8. `HandicapTrendChart` — gjenbruk AdminLineChart
9. `AchievementShowcase` — compact 4-achievement grid
10. `QuickActionsSticky` — mobil-bunn-bar + desktop-rad

## Brand Guide V2.0

- Primary: `#005840` (bakgrunn for CTA, active states)
- Accent: `#D1F843` (highlights, badges)
- Surface: `#ECF0EF` (dashboard-bakgrunn)
- Kort: hvit med `rounded-2xl`, soft shadow, grey-200 border
- Typografi: Inter, store tall (3xl-4xl), små muted labels

## Suksess-mål
- Laste dashboardet på <500ms
- Bruker finner neste handling på <3 sekunder
- Tydelig CTA for dagens viktigste action
